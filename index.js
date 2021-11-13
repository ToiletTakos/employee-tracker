const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table')

require('dotenv').config()

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
                break;
        }
    })
}

const promptDepartments = () => {
    const sql = `SELECT * FROM department`

    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err)
            return;
        }
        console.table(rows);
        promptBusiness();
    });
};

const promptRoles = () => {
    const sql = `SELECT role.id, role.title, role.salary, department.department
                 AS department
                 FROM role
                 LEFT JOIN department
                 ON role.department_id = department.id`;
    
    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err)
            return;
        }
        console.table(rows);
        promptBusiness();
    });
};

const promptEmployees = () => {
    const sql = `SELECT e.id, e.first_name, e.last_name, role.title, department.department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                 FROM employee e
                 LEFT JOIN role ON e.role_id = role.id
                 LEFT JOIN department ON role.department_id = department.id
                 LEFT JOIN employee m ON e.manager_id = m.id`
    
    db.query(sql, (err, rows) => {
        if(err){
            console.log(err)
            return;
        }
        console.table(rows);
        promptBusiness();
    })
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

const sayBye = () => {
    console.log("Thanks for using the Database! Have a nice day!");
}


// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: process.env.DB_USER,
      // Your MySQL password
      password: process.env.DB_PASS,
      database: 'business'
    },
    console.log('Connected to the election database.')
  );

promptBusiness();