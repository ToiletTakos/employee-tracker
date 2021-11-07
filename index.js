const inquirer = require('inquirer');

const promptBusiness = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'selectionMenu',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employees role',
                'Finshed'

            ]
        }
    ])
    .then(function(choice){
        switch(choice.selectionMenu){
            case "View all departments":
                promptDepartments();
                break;
            case "View all roles":
                promptRoles();
                break;
            case "View all employees":
                promptEmployees();
                break;
            case "Add a department":
                promptAddDepartment();
                break;
            case "Add a role":
                promptAddRole();
                break;
            case "Add an employee":
                promptAddEmployee();
                break;
            case "Update an employees role":
                promptUpdateRole();
                break;
            default:
                sayBye();
        }
    })
}

const promptDepartments = () => {
    console.log("Departments");
    promptBusiness();
}

const promptRoles = () => {
    console.log("Roles");
    promptBusiness();
}

const promptEmployees = () => {
    console.log("Employees");
    promptBusiness();
}

const promptAddDepartment = () => {
    console.log("Add departments");
    promptBusiness();
}

const promptAddRole = () => {
    console.log("Add role");
    promptBusiness();
}

const promptAddEmployee = () => {
    console.log("Add employee");
    promptBusiness();
}

const promptUpdateRole = () => {
    console.log("Update employees role");
    promptBusiness();
}

const sayBye = () => console.log("Thanks for using the Database! Have a nice day!")

promptBusiness();