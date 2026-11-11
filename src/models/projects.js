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

export const getProjectsByOrganizationId = async (organizationId) => {
    const result = await db.query(`
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM public.project
        WHERE organization_id = $1
        ORDER BY date
    `, [organizationId]);

    return result.rows;
};

export const getProjectDetails = async (projectId) => {
    const result = await db.query(`
        SELECT
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1
    `, [projectId]);

    return result.rows[0] || null;
};
export const getUpcomingProjects = async (number_of_projects) => {
    const result = await db.query(`
        SELECT
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1
    `, [number_of_projects]);

    return result.rows;
};