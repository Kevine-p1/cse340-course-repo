import express from 'express';

import { showHomePage } from './controllers/index.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    organizationValidation,
    processEditOrganizationForm
} from './controllers/organizations.js';
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    categoryValidation,
    showEditCategoryForm,
    processEditCategoryForm,
} from './controllers/categories.js';
import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
} from './controllers/users.js';
import { testErrorPage } from './controllers/errors.js';


const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.get('/new-project', showNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.get('/new-category', showNewCategoryForm);
router.get('/edit-category/:id', showEditCategoryForm);
router.post(
    '/new-category',
    categoryValidation,
    processNewCategoryForm
);
router.post(
    '/new-organization',
    organizationValidation,
    processNewOrganizationForm
);

router.post(
    '/edit-organization/:id',
    organizationValidation,
    processEditOrganizationForm
);
router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

router.post(
    '/edit-project/:id',
    projectValidation,
    processEditProjectForm
);
router.post(
    '/assign-categories/:projectId',
    processAssignCategoriesForm
);
router.post(
    '/edit-category/:id',
    categoryValidation,
    processEditCategoryForm
);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
// User registration
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);

// User logout
router.post('/logout', processLogout);

router.get('/dashboard', requireLogin, showDashboard);

router.get(
    '/users',
    requireLogin,
    requireRole('admin'),
    showUsersPage
);
// Test route for server errors
router.get('/test-error', testErrorPage);

export default router;
