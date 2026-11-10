CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);


CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES project(project_id),

    FOREIGN KEY (category_id)
        REFERENCES category(category_id)
);


INSERT INTO category (name)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness');



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

SELECT
    p.title AS project,
    c.name AS category
FROM project p
JOIN project_category pc
    ON p.project_id = pc.project_id
JOIN category c
    ON pc.category_id = c.category_id
ORDER BY p.project_id;	


SELECT p.project_id, p.title
FROM project p
LEFT JOIN project_category pc
    ON p.project_id = pc.project_id
WHERE pc.project_id IS NULL;