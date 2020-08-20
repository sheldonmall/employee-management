var mysql = require("mysql");
var inquirer = require("inquirer");
var clear = require("clear");
const { inherits } = require("util");

// Connection code
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Letsmms1nn!",
  database: "teslawesla",
});

// Arrays defined
var mainMenu = [
  {
    type: "list",
    message: "Choose the Database function you want to perform today: ",
    name: "mainOps",
    choices: [
      "CREATE: Department, Roles or employees",
      "REVIEW: Department, Roles or employees",
      "UPDATE: Department, Roles or employees",
      "DELETE: Department, Roles or employees",
      "Exit",
    ],
  },
];
var subMenu = [
  {
    type: "list",
    message: "Select the Table you want to perform this function on: ",
    name: "subOps",
    choices: ["Department", "Roles", "Employees", "Back to Main Menu"],
  },
];

// CREATE objects
var createDept = [
  {
    type: "input",
    message: "Enter Department Name: ",
    name: "deptName",
  },
];
var createRole = [
  {
    type: "input",
    message: "Enter Role Title: ",
    name: "roleTitle",
  },
  {
    type: "input",
    message: "Enter Salary: ",
    name: "roleSalary",
  },
  {
    type: "input",
    message: "Enter Department ID: ",
    name: "roleDeptId",
  },
];

var createEmp = [
  {
    type: "input",
    message: "Enter Employee's First Name: ",
    name: "empFName",
  },
  {
    type: "input",
    message: "Enter Employee's Last Name: ",
    name: "empLName",
  },
  {
    type: "input",
    message: "Enter Employee's Role ID: ",
    name: "empRoleId",
  },
  {
    type: "input",
    message: "Enter Employee's Manager's ID: ",
    name: "empManagerId",
  },
];

// UPDATE objects
var updateDept = [
  {
    type: "input",
    message: "Update Department Name: ",
    name: "deptName",
  },
];
var updateRole = [
  {
    type: "input",
    message: "Enter Role Title: ",
    name: "roleTitle",
  },
  {
    type: "input",
    message: "Enter Salary: ",
    name: "roleSalary",
  },
  {
    type: "input",
    message: "Enter Department ID: ",
    name: "roleDeptId",
  },
];

var updateEmp = [
  {
    type: "input",
    message: "Enter Fname of Employee to UPDATE: ",
    name: "empFname",
  },
  // {
  //   type: "input",
  //   message: "Enter ID of Employee to UPDATE: ",
  //   name: "empID",
  // },
  {
    type: "input",
    message: "Enter Employee's Role ID: ",
    name: "empRoleId",
  },
  // {
  //   type: "input",
  //   message: "Enter Employee's Manager's ID: ",
  //   name: "empManagerId",
  // },
];

// Variables defined
var roleTableName = "role";
var deptTableName = "department";
var empTableName = "employee";

// SQL queries defined
var reviewRoleQuery = `Select * from ${roleTableName}`;
var reviewDeptQuery = `Select * from ${deptTableName}`;
var reviewEmpQuery = `Select * from ${empTableName}`;

var createDeptQuery = `Insert into ${deptTableName} (depname) values (?)`;
var createRoleQuery = `Insert into ${roleTableName} (roletitle, salary, depid) values (?, ?, ?)`;
var createEmpQuery = `Insert into ${empTableName} (firstname, lastname, roleid, managerid) values (?, ?,?,?)`;

var updateEmpQuery = `update ${empTableName} set roleid=? where firstname=?`;

// Connect
connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id: " + connection.threadId);
  mainMenuFn();
});

// Main Menu
function mainMenuFn() {
  inquirer.prompt(mainMenu).then((response) => {
    var optionNum = mainMenu[0].choices.indexOf(response.mainOps);
    switch (optionNum) {
      case 0:
        createModule();
        break;
      case 1:
        reviewModule();
        break;
      case 2:
        updateModule();
        break;
      case 3:
        deleteModule();
        break;
      case 4:
        exitMain();
        break;
    }
  });
}

// CREATE modules
function createModule() {
  inquirer.prompt(subMenu).then((response) => {
    var optionNum = subMenu[0].choices.indexOf(response.subOps);
    switch (optionNum) {
      case 0:
        createDeptModule();
        break;
      case 1:
        createRoleModule();
        break;
      case 2:
        createEmpModule();
        break;
      case 3:
        exitToMain();
        break;
    }
  });
}

function createDeptModule() {
  clear();
  connection.query(reviewDeptQuery, (err, res) => {
    if (err) throw err;
    for (let ctr = 0; ctr < res.length; ctr++) {
      console.table(
        `Department ID: ${res[ctr].depid}, Department Name: ${res[ctr].depname}.`
      );
    }
    inquirer.prompt(createDept).then((response) => {
      connection.query(createDeptQuery, [response.deptName], (err, res) => {
        if (err) throw err;
        createModule();
      });
    });
  });
}

function createRoleModule() {
  clear();
  connection.query(reviewRoleQuery, (err, res) => {
    if (err) throw err;
    for (let ctr = 0; ctr < res.length; ctr++) {
      console.log(
        `Role ID: ${res[ctr].roleid}, Role Title: ${res[ctr].roletitle}, Salary: ${res[ctr].salary}, Department: ${res[ctr].depid}.`
      );
    }
    inquirer.prompt(createRole).then((response) => {
      connection.query(
        createRoleQuery,
        [response.roleTitle, response.roleSalary, response.roleDeptId],
        (err, res) => {
          if (err) throw err;
          createModule();
        }
      );
    });
  });
}

function createEmpModule() {
  clear();
  connection.query(reviewEmpQuery, (err, res) => {
    if (err) throw err;
    for (let ctr = 0; ctr < res.length; ctr++) {
      console.log(
        `Emp ID: ${res[ctr].empid}, First Name: ${res[ctr].firstname}, Last Name: ${res[ctr].lastname}, Role ID: ${res[ctr].roleid} , Manager ID: ${res[ctr].managerid}.`
      );
    }
    inquirer.prompt(createEmp).then((response) => {
      connection.query(
        createEmpQuery,
        [
          response.empFName,
          response.empLName,
          response.empRoleId,
          response.empManagerId,
        ],
        (err, res) => {
          if (err) throw err;
          createModule();
        }
      );
    });
  });
}

// REVIEW modules
function reviewModule() {
  inquirer.prompt(subMenu).then((response) => {
    var optionNum = subMenu[0].choices.indexOf(response.subOps);
    switch (optionNum) {
      case 0:
        reviewDeptModule();
        break;
      case 1:
        reviewRoleModule();
        break;
      case 2:
        reviewEmpModule();
        break;
      case 3:
        exitToMain();
        break;
    }
  });
}

function reviewDeptModule() {
  clear();
  connection.query(reviewDeptQuery, (err, res) => {
    if (err) throw err;
    for (let ctr = 0; ctr < res.length; ctr++) {
      console.table(
        `Department ID: ${res[ctr].depid}, Department Name: ${res[ctr].depname}.`
      );
    }
    reviewModule();
  });
}

function reviewRoleModule() {
  clear();
  connection.query(reviewRoleQuery, (err, res) => {
    if (err) throw err;
    for (let ctr = 0; ctr < res.length; ctr++) {
      console.log(
        `Role ID: ${res[ctr].roleid}, Role Title: ${res[ctr].roletitle}, Salary: ${res[ctr].salary}, Department: ${res[ctr].depid}.`
      );
    }
    reviewModule();
  });
}

function reviewEmpModule() {
  clear();
  connection.query(reviewEmpQuery, (err, res) => {
    if (err) throw err;
    for (let ctr = 0; ctr < res.length; ctr++) {
      console.log(
        `Emp ID: ${res[ctr].empid}, First Name: ${res[ctr].firstname}, Last Name: ${res[ctr].lastname}, Role ID: ${res[ctr].roleid} , Manager ID: ${res[ctr].managerid}.`
      );
    }
    reviewModule();
  });
}

// UPDATE modules
function updateModule() {
  inquirer.prompt(subMenu).then((response) => {
    var optionNum = subMenu[0].choices.indexOf(response.subOps);
    switch (optionNum) {
      case 0:
        updateDeptModule();
        break;
      case 1:
        updateRoleModule();
        break;
      case 2:
        updateEmpModule();
        break;
      case 3:
        exitToMain();
        break;
    }
  });
}

// function updateDeptModule() {
//   clear();
//   inquirer.prompt(updateDept).then((response) => {
//     connection.query(updateDeptQuery, [response.deptName], (err, res) => {
//       if (err) throw err;
//       createModule();
//     });
//   });
// }

// function updateRoleModule() {
//   clear();
//   connection.query(reviewRoleQuery, (err, res) => {
//     if (err) throw err;
//     for (let ctr = 0; ctr < res.length; ctr++) {
//       console.log(
//         `Role ID: ${res[ctr].roleid}, Role Title: ${res[ctr].roletitle}, Salary: ${res[ctr].salary}, Department: ${res[ctr].depid}.`
//       );
//     }
//     updateModule();
//   });
// }

function updateEmpModule() {
  clear();
  // connection.query()
  connection.query(reviewEmpQuery, (err, res) => {
    if (err) throw err;
    for (let ctr = 0; ctr < res.length; ctr++) {
      console.log(
        `Emp ID: ${res[ctr].empid}, First Name: ${res[ctr].firstname}, Last Name: ${res[ctr].lastname}, Role ID: ${res[ctr].roleid} , Manager ID: ${res[ctr].managerid}.`
      );
    }
    inquirer.prompt(updateEmp).then((response) => {
      console.log(response);
      connection.query(
        updateEmpQuery,
        [
          response.empRoleId,
          response.empFname
        ],
        // {
        //   roleid: response.empRoleId,
        //   managerid: response.empManagerId,    
        //   empid: response.empId
        // },
        (err, res) => {
          if (err) throw err;
          console.table(res);
          updateModule();
        }
      );
    });
  });
}

// EXIT modules
function exitMain() {
  connection.end();
  console.log("Thank you for using Company Database Maintenance application.");
}

function exitToMain() {
  clear();
  mainMenuFn();
}
