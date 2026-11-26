import 'dotenv/config';
import { testConnection } from './src/models/db.js';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import router from './src/routes.js';
import session from 'express-session';
import flash from './src/middleware/flash.js';


// Environment configuration
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

// Resolve current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();

// Serve CSS and images
app.use(express.static(path.join(__dirname, 'public')));
console.log('SESSION_SECRET configured:', Boolean(process.env.SESSION_SECRET));

// Configure EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Log incoming requests during development
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Make NODE_ENV available to EJS templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('trust proxy', 1);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));
app.use((req, res, next) => {
    res.locals.isLoggedIn = Boolean(req.session?.user);

    res.locals.isAdmin =
        req.session?.user?.role_id === 2;

    res.locals.NODE_ENV = NODE_ENV;

    next();
});
app.use(flash);
// Use the application routes
app.use(router);

// Handle routes that do not exist
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };

    res.status(status).render(`errors/${template}`, context);
});

// Start server
app.listen(PORT, async () => {
    try {
        await testConnection();

        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});
