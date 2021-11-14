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
    .then((choice) => {
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
                console.log("Thanks for using the Database! Have a nice day!");
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
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: "What is the new Department's name?",
            validate: department => {
                if(department) {
                    return true;
                }
                else {
                    console.log("Please enter a new Department's name!");
                    return false;
                }
            }
        }
    ])
    .then(body => {
        const sql = `INSERT INTO department (department)
                    values (?)`;

        const params = [body.department];

        db.query(sql, params, (err, result) => {
            if(err) {
                console.log(err);
                promptAddDepartment();
            };
            console.log('Department added!')
            promptBusiness();
        });

    })
}

const promptAddRole = () => {
    const Sql = `SELECT id AS value, department AS name FROM department`;
        db.query(Sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        inquirer.prompt([
            {
                type: "input",
                name: "roleTitle",
                message: "What's the title for the role you're adding?",
                validate: roleTitle => {
                    if(roleTitle) {
                        return true;
                    }
                    else {
                        console.log("Please enter a role title!");
                        return false;
                    }
                }
            },
            {
                type: "input",
                name: "roleSalary",
                message: "What's the salary for the role?",
                validate: roleSalary => {
                    if(roleSalary) {
                        return true;
                    }
                    else {
                        console.log("Please enter a salary!");
                        return false;
                    }
                }
            },
            {
                type: "list",
                name: "roleDept",
                message: "Which department does the role belong to?",
                choices: results,
            },
            ])
            .then((answers) => {
                const roleSql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                const params = [answers.roleTitle, answers.roleSalary, answers.roleDept];
                db.query(roleSql, params, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Role added!");
                    promptBusiness();
                });
            });
        });
}

const promptAddEmployee = () => {
    const sql = `SELECT id AS value, title AS name FROM role`;
          db.query(sql, (err, roles) => {
            if (err) {
              console.log(err);
            }
            const nameSql = `SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee`;
            db.query(nameSql, (err, managers) => {
              if (err) {
                console.log(err);
              }
              inquirer.prompt([
                  {
                    type: "input",
                    name: "firstName",
                    message: "What's' first name of the employee you want to add?",
                    validate: firstName => {
                        if(firstName) {
                            return true;
                        }
                        else {
                            console.log("Please enter a name!");
                            return false;
                        }
                    }
                  },
                  {
                    type: "input",
                    name: "lastName",
                    message: "What's the last name of the employee you want to add?",
                    validate: lastName => {
                        if(lastName) {
                            return true;
                        }
                        else {
                            console.log("Please enter a last name!");
                            return false;
                        }
                    }
                  },
                  {
                    type: "list",
                    name: "role",
                    message: "What's the role of this employee?",
                    choices: roles,
                  },
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managers,
                  },
                ])
                .then((answers) => {
                    const employeeSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                    const params = [answers.firstName, answers.lastName, answers.role, answers.manager];
                    db.query(employeeSql, params, function (err, results) {
                      if (err) {
                        console.log(err);
                      }
                      console.log("Employee added!");
                      promptBusiness();
                    });
                });
            });
        });
    
}

const promptUpdateRole = () => {
    const sql = `SELECT id AS value, title AS name FROM role`;
        db.query(sql, (err, roles) => {
            if (err) {
                console.log(err);
            }
            const updateRoleSql = `SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee`;
            db.query(updateRoleSql, (err, employees) => {
                if (err) {
                console.log(err);
            }
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Who is the employee that needs updating?",
                    choices: employees,
                },
                {
                    type: "list",
                    name: "updatedRole",
                    message:'What is the new role?',
                    choices: roles,
                },
                ])
                .then((answers) => {
                    const updatedRolesql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                    const params = [answers.updatedRole, answers.employee];
                    db.query(updatedRolesql, params, (err, results) => {
                      if (err) {
                        console.log(err);
                      }
                      console.log("Employee role Updated!");
                      promptBusiness();
                    });
                });
            });
        });
};


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

function welcomeMessage() {
    console.log('-------------------')
    console.log('|   Welcome to    |')
    console.log('|  Your Employee  |')
    console.log('|     Manager     |')
    console.log('-------------------')
};

welcomeMessage();
promptBusiness();