var mysql = require('mysql');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'wilson',
  password : 'wilsonburnawan',
  database : 'DO',
  port     : '3307'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});



app.listen(4000, function() {
    console.log("node listening on port 4000" )
})

// Route for getting user, given username and password
app.get("/db/user", (req,res) => {
    var userId = req.query.username
    var userPass = req.query.password

    var searchUser = "SELECT * FROM User WHERE user_id = \"" + userId + "\" AND password = \"" + userPass + "\""   

    connection.query(searchUser, (err,results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});

// Route for creating user, given username and password (later change to post)
app.post("/db/user/create", (req,res) => {
    var userId = req.body.username
    var userPass = req.body.password
    var userRegularName = req.body.userRegName

    var createUser = "INSERT INTO User (user_id, name, password) VALUES (\"" + userId + "\", \"" + userRegularName + "\", \""+ userPass + "\")" 
    connection.query(createUser, (err, results) => {
        if(err) throw err;
        console.log("Create user successful!");
        return res.send(results);
    });
    
});

// Route for deleting user, given username (later change to post)
app.get("/db/user/delete", (req,res) => {
    var userId = req.query.username
    
    var deleteUser = "DELETE FROM User Where user_id = \"" + userId + "\"" 
    connection.query(deleteUser, (err, results) => {
        if(err) throw err;
        console.log("Delete user successful!");
    });
});


// Route for getting Todolists of user
app.get("/db/user/:userId/Todolist", (req,res) => {
    var userId = req.params.userId
    var searchUserTodoList = "Select T.name, T.todolist_id FROM BelongsIn B, Todolist T WHERE B.user_id = \"" + userId + "\" AND B.todolist_id = T.todolist_id" 
    console.log(searchUserTodoList)
    connection.query(searchUserTodoList, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});

// Route for creating Todo list (Later change to post)
app.post("/db/user/:userId/Todolist/create", (req,res) => {
    var creatorUserId = req.params.userId
    var toDoListName = req.body.name

    // Query for adding new tuple to Todolist table
    var insertNewTDL = "Insert Into Todolist (name,user_id) Values (\"" + toDoListName + "\",\"" + creatorUserId + "\")" 
    connection.query(insertNewTDL, (err, result) => {
        if(err) throw err;
        console.log("new todolist Tuple inserted");
        });

    // Query for adding new tuple to Belongs in
    var getNewTDLId = "Select user_id, todolist_id from Todolist where user_id = \"" + creatorUserId + " \" AND todolist_id NOT IN(Select todolist_id from BelongsIn Where user_id = \"" + creatorUserId + "\")"
    var insertBelongsIn = "Insert Into BelongsIn (user_id, todolist_id) " + getNewTDLId 
    connection.query(insertBelongsIn, (err, result) => {
        if(err) throw err;
        console.log("new belongsIn Tuple inserted");
        });
});

// Route for joining Todolist
app.post("/db/user/:userId/Todolist/join", (req,res) => {
    var joinCode = req.body.joinCode
    var userId = req.params.userId

    var query = "Insert into BelongsIn (user_id, todolist_id) values ('" + userId + "', " + joinCode + ");"
    connection.query(query, (err, result) => {
        if(err) throw err;
        console.log("New BelongsIn has been inserted");
        });
});

// Route for leaving Todolist
app.post("/db/user/:userId/Todolist/leave", (req,res) => {
    var joinCode = req.body.toDoListId
    var userId = req.params.userId

    var query = "Delete from BelongsIn Where user_id ='" + userId+ "' and todolist_id = " + joinCode + ";"
    connection.query(query, (err, result) => {
        if(err) throw err;
        console.log("BelongsIn has been deleted");
        });
});


// Route for deleting Todolist  (Later change to post)
app.post("/db/user/:userId/Todolist/delete", (req,res) => {
    //var userId = req.params.userId not used
    var toDoListId = req.body.toDoListId
    //Query to delete entry from toDoListId, will be cascaded to belongsIn
    var deleteTDL = "Delete From Todolist Where todolist_id = " + toDoListId
    console.log(deleteTDL)
    connection.query(deleteTDL, (err, result) => {
        if(err) throw err;
        console.log("Delete Todolist successful")
    });
});


//Route for updating Todolist
app.post("/db/user/:userId/Todolist/update", (req,res) => {
    var toDoListId = req.body.toDoListId
    var updatedName = req.body.updatedName

    var updateTDL = "UPDATE Todolist SET name = \"" + updatedName + "\" WHERE todolist_id = " + toDoListId

    connection.query(updateTDL, (err,result) => {
        if(err) throw err;
        console.log("Update Todolist successful")
    })

})


// Route for getting Todo of selected todolist
app.get("/db/user/:userId/Todolist/:TodolistId/Todos/", (req,res) => {
    var todolistId = req.params.TodolistId
    var getTodo = "Select description, todo_id, user_id, time_sensitive FROM Todo WHERE todolist_id = " + todolistId 
    connection.query(getTodo, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});

// Route for adding todo to todolist (later change to post)
app.post("/db/user/:userId/Todolist/:TodolistId/Todos/", (req,res) => {
    var userId = req.params.userId
    var desc = req.body.desc
    var todolistId = req.params.TodolistId
    var timeSensitive = req.body.timeSensitive

    var insertTodo = "INSERT INTO Todo (description, user_id, todolist_id, time_sensitive) VALUES (\"" + desc + "\",\"" + userId + "\"," + todolistId + ", " + timeSensitive + ");"
    connection.query(insertTodo, (err, results) => {
        if(err) throw err;
        console.log("Adding Todo successful")
    });
});


// Route for deleting todo to todo list (later change to post)
app.post("/db/user/:userId/Todolist/:TodolistId/Todos/delete/", (req,res) => {
    var todoId = req.body.todoId

    var deleteTodo = "DELETE FROM Todo Where todo_id = " + todoId + ";"
    console.log(deleteTodo)
    connection.query(deleteTodo, (err, results) => {
        if(err) throw err;
        console.log("Delete Todo successful")
    });
});


//Route for updating Todolist
app.post("/db/user/:userId/Todolist/:TodolistId/Todos/update", (req,res) => {
    var todoId = req.body.todoId
    var updatedDesc = req.body.updatedDesc
    var updatedAssignment = req.body.updatedAssignment
    console.log(updatedAssignment)

    
    var updateTodo = "UPDATE Todo SET description = \"" + updatedDesc + "\", user_id = \"" + updatedAssignment + "\" WHERE todo_id = " + todoId

    console.log(updateTodo)
    connection.query(updateTodo, (err,result) => {
        if(err) throw err;
        console.log("Update Todo successful")
    })
})
