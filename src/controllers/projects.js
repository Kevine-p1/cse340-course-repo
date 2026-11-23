import {
    getAllProjects,
    getProjectDetails,
    getUpcomingProjects,
    createProject,
    updateProject
} from '../models/projects.js';

import { getCategoriesByProjectId } from '../models/categories.js';

import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const projectValidation = [
       (req, res, next) => {
        
        next();
    },
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Title must be between 3 and 150 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),

    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 })
        .withMessage('Location cannot exceed 200 characters'),

    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Enter a valid date'),

    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt({ min: 1 })
        .withMessage('Select a valid organization')
];
 const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

        const title = 'Upcoming Service Projects';

        res.render('projects', {
            title,
            projects
        });
    } catch (error) {
        next(error);
    }
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        const project = await getProjectDetails(projectId);

        if (!project) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        const categories = await getCategoriesByProjectId(projectId);

        const title = 'Project Details';

        res.render('project', {
            title,
            project,
            categories
        });
    } catch (error) {
        next(error);
    }
};

const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        const title = 'Add New Service Project';

        res.render('new-project', {
            title,
            organizations
        });
    } catch (error) {
        next(error);
    }
};

const processNewProjectForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
         

if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
        req.flash('error', error.msg);
    });

    return res.redirect('/new-project');
}
        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;

        const newProjectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'New service project created successfully!');

        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        next(error);
    }
};

const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        const project = await getProjectDetails(projectId);

        if (!project) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        const organizations = await getAllOrganizations();

        res.render('edit-project', {
            title: 'Edit Service Project',
            project,
            organizations
        });
    } catch (error) {
        next(error);
    }
};
const processEditProjectForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            return res.redirect(`/edit-project/${req.params.id}`);
        }

        const projectId = req.params.id;

        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;

        await updateProject(
            projectId,
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'Project updated successfully!');

        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};