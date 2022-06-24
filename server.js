// Require Modules
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// Module for logo
const logo = require('asciiart-logo');
const config = require('./package.json');
console.log(logo(config).render());

// Connect to db
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db',
});

connection.connect((err) => {
    if (err) throw err;
    startApp();
});

// Starts user prompts
startApp = () => {
    inquirer.prompt([
        {
            name: 'initialInquiry',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View departments', 'View roles', 'View employees', 'View employees by manager', 'Add department', 'Add role', 'Add employee', 'Update employee\'s role', 'Update employee\'s manager', 'Delete department', 'Delete role', 'Delete employee', 'View total salary of department', 'Exit']
        }
    ]).then((response) => {
        switch (response.initialInquiry) {
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