
import db from './db.js';

const createUser = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO public.users (name, email, password_hash, role_id)
        VALUES (
            $1,
            $2,
            $3,
            (SELECT role_id FROM public.roles WHERE role_name = 'user')
        )
        RETURNING user_id
    `;

    const result = await db.query(query, [
        name,
        email,
        passwordHash
    ]);

    return result.rows[0].user_id;
};


import bcrypt from 'bcrypt';

// Find a user by email
const findUserByEmail = async (email) => {
    const query = `
        SELECT user_id, name, email, password_hash, role_id
        FROM public.users
        WHERE email = $1
    `;

    const result = await db.query(query, [email]);

    return result.rows[0] || null;
};

// Check the submitted password
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

// Authenticate a user
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const isPasswordValid = await verifyPassword(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        return null;
    }

    const { password_hash, ...safeUser } = user;
    return safeUser;
};

const getAllUsers = async () => {
    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            r.role_name
        FROM public.users u
        JOIN public.roles r ON u.role_id = r.role_id
        ORDER BY u.user_id
    `;

    const result = await db.query(query);
    return result.rows;
};


export { createUser, authenticateUser, getAllUsers };