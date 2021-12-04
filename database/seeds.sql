USE employee_db;

INSERT INTO department (id, name) VALUES ("1", "Sales");
INSERT INTO department (id, name) VALUES ("2", "Finance");
INSERT INTO department (id, name) VALUES ("3", "HR");

INSERT INTO role (id, title, salary, department_id) VALUES ("1", "Manager", "80000", "1");
INSERT INTO role (id, title, salary, department_id) VALUES ("2", "Associate", "50000", "2");
INSERT INTO role (id, title, salary, department_id) VALUES ("3", "Developer", "40000", "3");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("1", "Micheal", "Scott", "1", NULL);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("2", "Dwight", "Schrute", "1", "1");
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ("3", "Jim", "Halpert", "2", "1");