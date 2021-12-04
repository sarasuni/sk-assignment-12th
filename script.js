let inquirer =require("inquirer");
const fs =require('fs');
let mysql = require('mysql');
let path  = require('path');
const connection = require('./database/connection');

init();

//initialising the program
function init() {
    console.log('Welcome to the Content Management System!');
    main();
}


function main(){
    inquirer.prompt([{
        type:"list",
        name:"action",
        message:"What would you like to do?",
        choices: [
            {
                name:"View all Employes",
                value:"VIEW_EMP"
            },
            {
                name:"View all Roles",
                value:"VIEW_RLS"
            },
            {
                name:"View all Departments",
                value:"VIEW_DEPT"
            },
            {
                name:"Add Employee",
                value:"ADD_EMPLOYEE"
            },
            {
                name:"Update Employee Role",
                value:"UPDATE_EMP"
            },
            {
                name:"Add Role",
                value:"ADD_ROLE"
            },
            {
                name:"Add Departments",
                value:"ADD_DEPT"
            }


        ]
    }]).then(({action}) => {
        if(action === "VIEW_EMP"){
           viewEmployee();
        } else if (action === "VIEW_RLS"){
            viewRoles();
        }  else if (action === "ADD_EMPLOYEE"){
            addEmployee();
        } else if(action ==="ADD_DEPT"){
            addDepartment();
        } else if (action === "VIEW_DEPT"){
            viewDepartments();
        } else if (action === "UPDATE_EMP"){
            updateEmployee();
        } else if (action === "ADD_ROLE"){
            addRoles();
        }
        })
    }
//View Departments
function viewDepartments(){
    console.log("Selecting all departments...\n");
    connection.query("SELECT id AS `ID`, name as `Department Name` from department", function(err,res){
        if (err) throw err;
        //Log all results of the SELECT statement
        console.table(res);
        areYouFinished();
    });
}
function viewRoles(){
console.log("Selecting all roles...\n");
connection.query("SELECT title AS `Title`, salary AS `Salary`,department_id AS `Department Id` FROM role", function(err,res){
    if (err) throw err;
    //Log all results of the SELECT statement
    console.table(res);
    areYouFinished();
});
}
function viewEmployee() {
    console.log("Selecting all employees...\n");
    connection.query("SELECT first_name AS `First Name`, last_name AS `Last Name`, role_id AS `Role Id`, manager_id as `Manager Id` FROM employee", function (err,res){
        if (err) throw err;
        //Log all results of the SELECT statement
        console.table(res);
        areYouFinished();
    });
}
//Add employee, department, role
function addRoles(){
    //We need to get the role data
    connection.query("SELECT * FROM department", function(err,res){
        if (err) throw err;
        const departments = res.map(element =>{
            return element.id
        })
        inquirer
        .prompt([
            {
                name:"title",
                type:"input",
                message:"What is their title?"
            },
            {
                name:"salary",
                type:"input",
                message:"What is their salary?"
            },
            //Ask role questions based on role data
            {
                name:"department_id",
                type:"list",
                message:"What is thier department id?",
                choices: departments
            }
        ])
        .then(function(answer){
            //When finished promting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO role SET ?",
                answer,
                function(err){
                    if (err) throw err;
                    console.log(`${answer.title}  was added successfully`);
                    //re-prompt the user for if they want to bid or post
                    areYouFinished();
                }
            );
        });
    } )
}
function addEmployee(){
    connection.query("SELECT id,title from role", function(err,res){
        if (err) throw err;
        const roles =res.map(element=>element.title)
        inquirer.prompt([
            {
                name:"first_name",
                type:"input",
                message:"What is the new employee first name?"
            },
            {
                name:"last_name",
                type:"input",
                message:"What is the new employee last name?"
            },
            {
                name:"roles",
                type:"list",
                message:"What is the title of their role?",
                choices:roles
            }
        ]).then(answer =>{
            const chosenRole = res.find(element => {
                return element.title === answer.roles
            });
            console.log(chosenRole.id);
            const newEmployee ={
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id:chosenRole.id
            };
            connection.query("INSERT INTO employee SET ?",newEmployee,(err,success)=>{
                if(err) throw err;
                console.log(`${newEmployee.first_name} was added successfully`);
                areYouFinished();
            })
        })
    })
}
function updateEmployee(){
    connection.query("SELECT * FROM  employee",function (err,res){
        if(err) throw err;
        //New list of First and Last name
        const names =res.map(element => {
            return `${element.id}: ${element.first_name} ${element.last_name}`
        })
        connection.query("SELECT title, id from role", function(err,success){
            if (err) throw err;
            const roles = success.map(element => element.title);
            inquirer.prompt([
                {
                    name:"who",
                    type:"list",
                    choices: names,
                    message:"Whom would you like to update?"
                },
                {
                    name:"roles",
                    type:"list",
                    message:"What is the title of their new role?",
                    choices: roles
                }
            ]).then(answers => {
                console.log(answers);
                const empIdUpdate = answers.who.split(":") [0];
                console.log(empIdUpdate);
                const chosenRole = success.find(element =>{
                    return element.title === answers.roles
                });
                console.log(chosenRole.id);
                connection.query("UPDATE employee SET role_id=? where id=?", [chosenRole.id,empIdUpdate], function(err, success){
                    if (err) throw err;
                    console.log(`Role successfully changed`)
                    areYouFinished();
                })
            })
        })
    })
}
function addDepartment(){
    connection.query("SELECT * FROM department", function(err,res){
        if(err) throw err;
        const departments = res.map(element =>{
            return element.id
        })
        inquirer
        .prompt([
            {
            name:"name",
            type:"input",
            message:"What is their department?"
            }
        ])
        .then (function (answer){
            connection.query(
                "INSERT INTO department SET ?",
                answer,
                function (err){
                    if (err) throw err;
                    console.log(answer.name + ` was added successfully` );
                    areYouFinished();
                }
            );
        });
    })
}   
function areYouFinished() {
    inquirer.prompt([
        {
            type:"list",
            name:"continue",
            message:"Would you like to continue working?",
            choices:[
                {
                name:"Yes",
                value:true
                },
                {
                name:"No",
                value:false
                }
            ]
        }
    ]).then (function(answers){
        if(answers.continue){
            main()
        } else{
            console.log(`Goodbye`);
            process.exit();
        }
    })
}