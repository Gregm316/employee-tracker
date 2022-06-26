// Import connection.js
const connection = require("./db/connection");
// Require Modules
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// Module for Employee Tracker logo
const logo = require('asciiart-logo');
const config = require('./package.json');
console.log(logo(config).render());

// Function to start app and user prompts
init();

function init() {
    userPrompt();
};

function userPrompt() {
    inquirer.prompt([
        {
            name: 'startInquiry',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View departments', 'View roles', 'View employees', 'View employees by manager', 'Add department', 'Add role', 'Add employee', 'Update employee\'s role', 'Update employee\'s manager', 'Delete department', 'Delete role', 'Delete employee', 'View total salary of department', 'Exit']
        }
    ]).then((response) => {
        switch (response.startInquiry) {
            case 'View departments':
                viewDepartments();    
                break;
            case 'View roles':
                viewRoles();
                break;
            case 'View employees':
                viewEmployees();
                break;
            case 'View employees by manager':
                viewEmployeesByManager();
            break;
            case 'Add department':
                addDepartment();
            break;
            case 'Add role':
                addRole();
            break;
            case 'Add employee':
                addEmployee();
            break;
            case 'Update employee\'s role':
                updateEmployeeRole();
            break;
            case 'Update employee\'s manager':
                updateEmployeesManager();
            break;
            case 'Delete department':
                deleteDepartment();
            break;
            case 'Delete role':
                deleteRole();
            break;
            case 'Delete employee':
                deleteEmployee();
            break;
            case 'View total salary of department':
                viewDepartmentSalary();
            break;
            case 'Exit':
                connection.end();
                console.log('\n You have exited the Employee Tracker! \n');
                return;
            default:
                break;
        }
    })
};
// Function to view departments
viewDepartments = () => {
    connection.query(`SELECT * FROM department ORDER BY department_id ASC;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        userPrompt();
    })
};

// Function to view roles
viewRoles = () => {
    connection.query(`SELECT role.role_id, role.title, role.salary, department.department_name, department.department_id FROM role JOIN department ON role.department_id = department.department_id ORDER BY role.role_id ASC;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        userPrompt();
    })
};

// Function to view employees
viewEmployees = () => {
    connection.query(`SELECT e.employee_id, e.first_name, e.last_name, role.title, department.department_name, role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee m RIGHT JOIN employee e ON e.manager_id = m.employee_id JOIN role ON e.role_id = role.role_id JOIN department ON department.department_id = role.department_id ORDER BY e.employee_id ASC;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        userPrompt();
    })
};

// Function to view employee by manager and prompt to select manager
viewEmployeesByManager = () => {
    connection.query(`SELECT employee_id, first_name, last_name FROM employee ORDER BY employee_id ASC;`, (err, res) => {
        if (err) throw err;
        let managers = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
        inquirer.prompt([
            {
            name: 'manager',
            type: 'list',
            message: 'Please select a manager to view their employees',
            choices: managers   
            },
        ]).then((response) => {
            connection.query(`SELECT e.employee_id, e.first_name, e.last_name, role.title, department.department_name, role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee m RIGHT JOIN employee e ON e.manager_id = m.employee_id JOIN role ON e.role_id = role.role_id JOIN department ON department.department_id = role.department_id WHERE e.manager_id = ${response.manager} ORDER BY e.employee_id ASC`, 
            (err, res) => {
                if (err) throw err;
                console.table('\n', res, '\n');
                userPrompt();
            })
        })
    })
};

// Function to add new department and user prompt to name new department
addDepartment = () => {
    inquirer.prompt([
        {
        name: 'newDept',
        type: 'input',
        message: 'What is the name of the department you want to add?'   
        }
    ]).then((response) => {
        connection.query(`INSERT INTO department SET ?`, 
        {
            department_name: response.newDept,
        },
        (err, res) => {
            if (err) throw err;
            console.log(`\n ${response.newDept} Department successfully added! \n`);
            userPrompt();
        })
    })
};

// Function to add a new role and user prompts to name role, add salary and select dept
addRole = () => {
    connection.query(`SELECT * FROM department;`, (err, res) => {
        if (err) throw err;
        let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
        inquirer.prompt([
            {
            name: 'title',
            type: 'input',
            message: 'What is the name of the role you want to add?'   
            },
            {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the role you want to add?'   
            },
            {
            name: 'deptName',
            type: 'list',
            message: 'Please select department for the new role',
            choices: departments
            },
        ]).then((response) => {
            connection.query(`INSERT INTO role SET ?`, 
            {
                title: response.title,
                salary: response.salary,
                department_id: response.deptName,
            },
            (err, res) => {
                if (err) throw err;
                console.log(`\n ${response.title} Role successfully added! \n`);
                userPrompt();
            })
        })
    })
};

// Function to add a new employee and user prompt to ad first and last name, role, and manager of employee
addEmployee = () => {
    connection.query(`SELECT * FROM role;`, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => ({name: role.title, value: role.role_id }));
        connection.query(`SELECT * FROM employee;`, (err, res) => {
            if (err) throw err;
            let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id}));
            inquirer.prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'What is the new employee\'s first name?'
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'What is the new employee\'s last name?'
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'Please select role for the new employee',
                    choices: roles
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: 'Please select new employee\'s manager',
                    choices: employees
                }
            ]).then((response) => {
                connection.query(`INSERT INTO employee SET ?`, 
                {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    role_id: response.role,
                    manager_id: response.manager,
                }, 
                (err, res) => {
                    if (err) throw err;
                })
                connection.query(`INSERT INTO role SET ?`, 
                {
                    department_id: response.dept,
                }, 
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n ${response.firstName} ${response.lastName} Employee successfully added! \n`);
                    userPrompt();
                })
            })
        })
    })
};

// Function to update employee role and user prompt to select employee and select new role
updateEmployeeRole = () => {
    connection.query(`SELECT * FROM role;`, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => ({name: role.title, value: role.role_id }));
        connection.query(`SELECT * FROM employee;`, (err, res) => {
            if (err) throw err;
            let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: 'Which employee\'s role do you want to update?',
                    choices: employees
                },
                {
                    name: 'newRole',
                    type: 'list',
                    message: 'Please select the employee\'s new role',
                    choices: roles
                },
            ]).then((response) => {
                connection.query(`UPDATE employee SET ? WHERE ?`, 
                [
                    {
                        role_id: response.newRole,
                    },
                    {
                        employee_id: response.employee,
                    },
                ], 
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n Employee's role successfully updated! \n`);
                    userPrompt();
                })
            })
        })
    })
};

// Function to update employee manager and user prompt to select employee and select new manager
updateEmployeesManager = () => {
    connection.query(`SELECT * FROM employee;`, (err, res) => {
        if (err) throw err;
        let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
        inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee would you like to update the manager for?',
                choices: employees
            },
            {
                name: 'newManager',
                type: 'list',
                message: 'Who should the employee\'s new manager be?',
                choices: employees
            },
        ]).then((response) => {
            connection.query(`UPDATE employee SET ? WHERE ?`, 
            [
                {
                    manager_id: response.newManager,
                },
                {
                    employee_id: response.employee,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Employee's manager successfully updated! \n`);
                userPrompt();
            })
        })
    })
};

// Function to delete a department and user prompt to select dept to delete
deleteDepartment = () => {
    connection.query(`SELECT * FROM department ORDER BY department_id ASC;`, (err, res) => {
        if (err) throw err;
        let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
        inquirer.prompt([
            {
            name: 'deptName',
            type: 'list',
            message: 'Which department would you like to delete?',
            choices: departments
            },
        ]).then((response) => {
            connection.query(`DELETE FROM department WHERE ?`, 
            [
                {
                    department_id: response.deptName,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Department successfully deleted! \n`);
                userPrompt();
            })
        })
    })
};

// Function to delete a role and user prompt to select role to delete
deleteRole = () => {
    connection.query(`SELECT * FROM role ORDER BY role_id ASC;`, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => ({name: role.title, value: role.role_id }));
        inquirer.prompt([
            {
            name: 'title',
            type: 'list',
            message: 'Which role would you like to delete?',
            choices: roles
            },
        ]).then((response) => {
            connection.query(`DELETE FROM role WHERE ?`, 
            [
                {
                    role_id: response.title,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Role successfully deleted! \n`);
                userPrompt();
            })
        })
    })
};

// Function to delete an employee and user prompt to select employee to delete
deleteEmployee = () => {
    connection.query(`SELECT * FROM employee ORDER BY employee_id ASC;`, (err, res) => {
        if (err) throw err;
        let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
        inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee would you like to delete?',
                choices: employees
            },
        ]).then((response) => {
            connection.query(`DELETE FROM employee WHERE ?`, 
            [
                {
                    employee_id: response.employee,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Employee successfully deleted! \n`);
                userPrompt();
            })
        })
    })
};

// Function to view department by salary and user prompt to select dept to view
viewDepartmentSalary = () => {
    connection.query(`SELECT * FROM department ORDER BY department_id ASC;`, (err, res) => {
        if (err) throw err;
        let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
        inquirer.prompt([
            {
            name: 'deptName',
            type: 'list',
            message: 'Please select a department',
            choices: departments
            },
            ]).then((response) => {
            connection.query(`SELECT department_id, SUM(role.salary) AS total_salary FROM role WHERE ?`, 
            [
                {
                    department_id: response.deptName,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n The salary total for the ${response.deptName} department is $ \n`);
                console.table('\n', res, '\n');
                userPrompt();
            })
        })
    })
};