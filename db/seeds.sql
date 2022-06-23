INSERT INTO department (department_name)
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
('Salesperson', 80000, 1),
('Sales Lead', 100000, 1),
('Software Engineer', 120000, 2),
('Lead Engineer', 150000, 2 ),
('Accountant', 180000, 3),
('Accountant Manager', 200000, 3),
('Lawyer', 160000, 4),
('Legal Team Manager', 220000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Greg', 'Miller', 8, null),
('Joe', 'Johnson', 7, 1),
('Jane', 'Williams', 4, null),
('Mike', 'Moran', 3, 3),
('Mary', 'Martin', 2, null),
('John', 'Spencer', 1, 4),
('Brad', 'Smith', 6, null),
('Jeff', 'Adams', 5, 7);