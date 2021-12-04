const mysql =require('mysql');
//connection for SQL database
module.exports =mysql.createConnection({
    host:"localhost",
    port: 3306,
//Your username
user:'root',
//Your password
password:'workbench2',
database:'employee_db'
});