import db from './db.js';

export const getAllCategories = async () => {
    const result = await db.query(`
        SELECT
            category_id,
            name
        FROM public.category
        ORDER BY name
    `);

    return result.rows;
};


export const getCategoryDetails = async (categoryId) => {
    const result = await db.query(`
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1
    `, [categoryId]);

    return result.rows[0] || null;
};

export const getCategoriesByProjectId = async (projectId) => {
    const result = await db.query(`
        SELECT c.category_id, c.name
        FROM public.category c
        JOIN public.project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name
    `, [projectId]);

    return result.rows;
};

export const getProjectsByCategoryId = async (categoryId) => {
    const result = await db.query(`
        SELECT p.project_id, p.title
        FROM public.project p
        JOIN public.project_category pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.title
    `, [categoryId]);

    return result.rows;
};

const assignCategoryToProject = async (
    client,
    projectId,
    categoryId
) => {
    await client.query(`
        INSERT INTO public.project_category
            (project_id, category_id)
        VALUES ($1, $2)
    `, [projectId, categoryId]);
};

export const updateCategoryAssignments = async (
    projectId,
    categoryIds
) => {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // Remove existing category assignments
        await client.query(`
            DELETE FROM public.project_category
            WHERE project_id = $1
        `, [projectId]);

        // Insert the newly selected categories
        for (const categoryId of categoryIds) {
            await assignCategoryToProject(
                client,
                projectId,
                categoryId
            );
        }

        await client.query('COMMIT');

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;

    } finally {
        client.release();
    }
};
export const createCategory = async (name) => {
    const result = await db.query(`
        INSERT INTO public.category (name)
        VALUES ($1)
        RETURNING category_id;
    `, [name]);

    return result.rows[0].category_id;
};

export const updateCategory = async (categoryId, name) => {
    const result = await db.query(`
        UPDATE public.category
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `, [name, categoryId]);

    if (result.rows.length === 0) {
        const error = new Error('Category not found');
        error.status = 404;
        throw error;
    }

    return result.rows[0].category_id;
};