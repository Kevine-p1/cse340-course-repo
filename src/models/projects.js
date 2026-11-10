import db from './db.js';

export const getAllProjects = async () => {
    const result = await db.query(`
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.date
    `);

    return result.rows;
};