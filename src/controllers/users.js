
import bcrypt from 'bcrypt';
import {
    createUser,
    authenticateUser,
    getAllUsers
} from '../models/users.js';
import db from '../models/db.js';

// Display the registration form
const showUserRegistrationForm = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};

// Process registration form submission
const processUserRegistrationForm = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Hash the password before saving it
        const passwordHash = await bcrypt.hash(password, 10);

        // Save the new user to PostgreSQL
        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful!');
        return res.redirect('/login');

    } catch (error) {
        if (error.code === '23505') {
            req.flash('error', 'This email is already registered.');
            return res.redirect('/register');
        }

        next(error);
    }
};


// Display login form
const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

// Process login
const processLoginForm = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        // Regenerate session to prevent session fixation
        req.session.regenerate((error) => {
            if (error) return next(error);

            req.session.user = user;
            req.flash('success', 'Login successful!');

            req.session.save((error) => {
                if (error) return next(error);
                res.redirect('/dashboard');
            });
        });

    } catch (error) {
        next(error);
    }
};

// Process logout
const processLogout = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) return next(error);

        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    next();
};

const showDashboard = (req, res) => {
    const user = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email,
        roleId: user.role_id
    });
};

const requireRole = (roleName) => {
    return async (req, res, next) => {
        try {
            if (!req.session?.user) {
                req.flash('error', 'You must be logged in.');
                return res.redirect('/login');
            }

            const result = await db.query(
                `SELECT r.role_name
                 FROM public.roles r
                 JOIN public.users u ON u.role_id = r.role_id
                 WHERE u.user_id = $1`,
                [req.session.user.user_id]
            );

            if (
                result.rows.length === 0 ||
                result.rows[0].role_name !== roleName
            ) {
                req.flash('error', 'You do not have permission to access that page.');
                return res.redirect('/dashboard');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

const showUsersPage = async (req, res, next) => {
    try {
        const users = await getAllUsers();

        res.render('users', {
            title: 'Registered Users',
            users
        });
    } catch (error) {
        next(error);
    }
};
export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};