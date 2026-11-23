import { getProjectDetails } from '../models/projects.js';

import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { body, validationResult } from 'express-validator';

const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';

        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        const categoryDetails = await getCategoryDetails(categoryId);

        if (!categoryDetails) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }

        const projects = await getProjectsByCategoryId(categoryId);

        const title = `${categoryDetails.name} Projects`;

        res.render('category', {
            title,
            categoryDetails,
            projects
        });
    } catch (error) {
        next(error);
    }
};

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        const categories = await getAllCategories();

        const assignedCategories =
            await getCategoriesByProjectId(projectId);

        res.render('assign-categories', {
            title: 'Assign Categories to Project',
            projectId,
            projectDetails,
            categories,
            assignedCategories
        });
    } catch (error) {
        next(error);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        // Check that the project exists
        const project = await getProjectDetails(projectId);

        if (!project) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        const selectedCategoryIds = req.body.categoryIds || [];

        // Convert one selected category into an array
        const categoryIds = Array.isArray(selectedCategoryIds)
            ? selectedCategoryIds
            : [selectedCategoryIds];

        await updateCategoryAssignments(projectId, categoryIds);

        req.flash('success', 'Categories updated successfully!');

        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};
const showNewCategoryForm = async (req, res) => {
    res.render('new-category', {
        title: 'Add New Category'
    });
};

const processNewCategoryForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg);
            });

            return res.redirect('/new-category');
        }

        const { name } = req.body;

        const categoryId = await createCategory(name);

        req.flash('success', 'Category created successfully!');

        return res.redirect(`/category/${categoryId}`);
    } catch (error) {
        if (error.code === '23505') {
            req.flash('error', 'A category with this name already exists.');
            return res.redirect('/new-category');
        }

        next(error);
    }
};
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        const categoryDetails = await getCategoryDetails(categoryId);

        if (!categoryDetails) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }

        res.render('edit-category', {
            title: 'Edit Category',
            categoryDetails
        });
    } catch (error) {
        next(error);
    }
};
const processEditCategoryForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            return res.redirect(`/edit-category/${req.params.id}`);
        }

        const categoryId = req.params.id;
        const { name } = req.body;

        await updateCategory(categoryId, name);

        req.flash('success', 'Category updated successfully!');

        return res.redirect(`/category/${categoryId}`);
    } catch (error) {
        if (error.code === '23505') {
            req.flash('error', 'A category with this name already exists.');
            return res.redirect(`/edit-category/${req.params.id}`);
        }

        next(error);
    }
};
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};