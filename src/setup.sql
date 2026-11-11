
-- CSE 340 Database Setup
-- Create the tables in dependency order.

-- 1. ORGANIZATIONS

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization
(name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders',
 'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
 'info@brightfuturebuilders.org',
 'brightfuture-logo.png'),

('GreenHarvest Growers',
 'An urban farming collective promoting food sustainability and education in local neighborhoods.',
 'contact@greenharvest.org',
 'greenharvest-logo.png'),

('UnityServe Volunteers',
 'A volunteer coordination group supporting local charities and service initiatives.',
 'hello@unityserve.org',
 'unityserve-logo.png');


-- 2. SERVICE PROJECTS

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);

INSERT INTO project
(organization_id, title, description, location, date)
VALUES
-- BrightFuture Builders
(1, 'Community Center Renovation',
 'Renovate a community center for local residents.',
 'Kigali', '2026-12-01'),

(1, 'School Building Repairs',
 'Repair classrooms and school facilities.',
 'Huye', '2026-12-05'),

(1, 'Community Playground',
 'Build a safe playground for children.',
 'Musanze', '2026-12-10'),

(1, 'Home Repair Assistance',
 'Repair homes for vulnerable families.',
 'Rubavu', '2026-12-15'),

(1, 'Library Renovation',
 'Improve a public library facility.',
 'Kigali', '2026-12-20'),

-- GreenHarvest Growers
(2, 'Community Garden',
 'Plant vegetables in a community garden.',
 'Kigali', '2026-12-02'),

(2, 'Tree Planting',
 'Plant trees to improve the local environment.',
 'Huye', '2026-12-06'),

(2, 'Urban Farming Workshop',
 'Teach sustainable urban farming techniques.',
 'Musanze', '2026-12-11'),

(2, 'Neighborhood Cleanup',
 'Clean public green spaces.',
 'Rubavu', '2026-12-16'),

(2, 'School Garden Project',
 'Create a garden for students.',
 'Kigali', '2026-12-21'),

-- UnityServe Volunteers
(3, 'Food Donation Drive',
 'Collect food for families in need.',
 'Kigali', '2026-12-03'),

(3, 'Clothing Collection',
 'Collect clothing for vulnerable communities.',
 'Huye', '2026-12-07'),

(3, 'Community Health Outreach',
 'Support community health education.',
 'Musanze', '2026-12-12'),

(3, 'Elderly Support Program',
 'Provide assistance to elderly residents.',
 'Rubavu', '2026-12-17'),

(3, 'Youth Mentorship',
 'Mentor young people through educational activities.',
 'Kigali', '2026-12-22');


-- 3. CATEGORIES

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

INSERT INTO category (name)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness');


-- 4. PROJECT-CATEGORY RELATIONSHIPS

CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES project(project_id),

    FOREIGN KEY (category_id)
        REFERENCES category(category_id)
);

INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
JOIN category c ON c.name =
    CASE
        WHEN p.title IN (
            'Community Garden',
            'Tree Planting',
            'Urban Farming Workshop',
            'Neighborhood Cleanup',
            'School Garden Project'
        ) THEN 'Environmental'

        WHEN p.title IN (
            'School Building Repairs',
            'Library Renovation',
            'Youth Mentorship'
        ) THEN 'Educational'

        WHEN p.title = 'Community Health Outreach'
            THEN 'Health and Wellness'

        ELSE 'Community Service'
    END;
