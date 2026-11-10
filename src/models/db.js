
import { Pool } from 'pg';

// Create a PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: true
});

let db = pool;

// Enable SQL logging during development
if (
    process.env.NODE_ENV === 'development' &&
    process.env.ENABLE_SQL_LOGGING === 'true'
) {
    db = {
        async query(text, params) {
            try {
                const start = Date.now();
                const result = await pool.query(text, params);
                const duration = Date.now() - start;

                console.log('Executed query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    duration: `${duration}ms`,
                    rows: result.rowCount
                });

                return result;
            } catch (error) {
                console.error('Database query failed:', error.message);
                throw error;
            }
        },

        async close() {
            await pool.end();
        }
    };
}

// Test the database connection
const testConnection = async () => {
    try {
        const result = await db.query('SELECT NOW() AS current_time');

        console.log(
            'Database connection successful:',
            result.rows[0].current_time
        );

        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

export { db as default, testConnection };
