const fs = require("fs");

module.exports.addTask = function (connection, task) {

    connection.query("SELECT title from tasks where title = ?", [task.title], (err, result) => {
        if (err) throw err;

        if (!result.length) {

            connection.query("INSERT INTO tasks (title,description,status) values (?,?,?)",
                [task.title, task.description, "view"],
                (err2, result) => {
                    if (err2) throw err2;
                });
        } else {
            fs.writeFileSync("json/report.json", JSON.stringify("Task allready exists"));
        }
    });
}

module.exports.addUser = function (connection, user) {

    connection.query("SELECT first_name, last_name from users where (first_name = ? AND last_name = ?)", [user.first_name, user.last_name], (err, result) => {
        if (err) throw err;
        if (!result.length) {

            connection.query("INSERT INTO users (first_name, last_name) values (?,?)",
                [user.first_name, user.last_name],
                (err2, result) => {
                    if (err2) throw err2;
                });
        }
    });
}
module.exports.showTasks = function (connection) {

    connection.query("select t.task_id,t.title,t.description,t.status,t.added_task_timestamp, u.* from tasks t left join user_task ut on t.task_id = ut.fid_task left join users u on u.user_id = ut.fid_user",
        [], (err, tasks) => {
            if (err) throw err;
            let tasksArr = [];
            tasks.forEach((task, i) => {

                let taskObj = {
                    id: task.task_id,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    added_task_timestamp: Math.round(new Date(tasks[i].added_task_timestamp).getTime() / 1000)
                }
                if (task.first_name !== null) {
                    taskObj.executor = task.first_name + " " + task.last_name;
                } else {
                    taskObj.executor = "Not defined";
                }
                tasksArr.push(taskObj);
            });
            fs.writeFile("json/tasks.json", JSON.stringify(tasksArr, null, 4), () => { });
        });
}

module.exports.showUsers = function (connection) {
    connection.query("SELECT * from users", [], (err, users) => {

        users.forEach(user => {
            user.register_timestamp = Math.round(new Date(user.register_timestamp).getTime() / 1000)
        });
        fs.writeFile("json/users.json", JSON.stringify(users, null, 4), () => { });
    });
}
module.exports.editTask = function (connection, task) {
    connection.query("UPDATE tasks SET title = ?, description = ?, status = ? where title = ?",
        [task.title, task.description, task.status, task.title],
        (err, result) => {
            if (err) throw new Error("1")
        });
    connection.query("Update user_task ut inner join tasks t on t.task_id = ut.fid_task Set fid_user = ? where t.title = ?",
        [task.executor_id, task.title],
        (err2, result2) => {
            if (err2) throw new Error("2")

        });
    connection.query("SELECT * from user_task where fid_task = ? ", [task.id], (err, result) => {
        if (err) throw new Error("3")
        if (!result.length) {

            connection.query("INSERT INTO user_task (fid_user, fid_task) values (?,?)",
                [task.executor_id, task.id],
                (err2, result) => {
                    if (err2) throw new Error("4")
                });
        }
    });
}

module.exports.editUser = function (connection, user) {
    connection.query("UPDATE users SET first_name = ?, last_name = ? where (first_name = ? AND last_name = ?)", [user.first_name, user.last_name, user.start_first_name, user.start_last_name], (err, result) => {
        if (err) throw err;
    });
}

module.exports.deleteUser = function (connection, user) {
    connection.query("Delete u, ut from users u left join user_task ut on ut.fid_user = u.user_id where (u.first_name = ? AND u.last_name = ?)", [user.first_name, user.last_name], (err, result) => {
        if (err) throw err;
    });
}

module.exports.deleteTask = function (connection, task) {
    connection.query("Delete t, ut from tasks t left join user_task ut on ut.fid_task = t.task_id where t.title = ?",
        [task.title],
        (err, result) => {
            if (err) throw err;
        });
}

module.exports.sortByStatus = function(connection){
    connection.query("select t.task_id,t.title,t.description,t.status,t.added_task_timestamp, u.* from tasks t left join user_task ut on t.task_id = ut.fid_task left join users u on u.user_id = ut.fid_user ORDER BY t.status",
        [], (err, tasks) => {
            if (err) throw err;
            let tasksArr = [];
            tasks.forEach((task, i) => {

                let taskObj = {
                    id: task.task_id,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    added_task_timestamp: Math.round(new Date(tasks[i].added_task_timestamp).getTime() / 1000)
                }
                if (task.first_name !== null) {
                    taskObj.executor = task.first_name + " " + task.last_name;
                } else {
                    taskObj.executor = "Not defined";
                }
                tasksArr.push(taskObj);
            });
            fs.writeFile("json/sortedByStatus.json", JSON.stringify(tasksArr, null, 4), () => { });
        });

    return fs.readFileSync("json/sortedByStatus.json");
}


module.exports.sortById = function(connection){
    connection.query("select t.task_id,t.title,t.description,t.status,t.added_task_timestamp, u.* from tasks t left join user_task ut on t.task_id = ut.fid_task left join users u on u.user_id = ut.fid_user ORDER BY t.task_id",
        [], (err, tasks) => {
            if (err) throw err;
            let tasksArr = [];
            tasks.forEach((task, i) => {

                let taskObj = {
                    id: task.task_id,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    added_task_timestamp: Math.round(new Date(tasks[i].added_task_timestamp).getTime() / 1000)
                }
                if (task.first_name !== null) {
                    taskObj.executor = task.first_name + " " + task.last_name;
                } else {
                    taskObj.executor = "Not defined";
                }
                tasksArr.push(taskObj);
            });
            fs.writeFile("json/sortedById.json", JSON.stringify(tasksArr, null, 4), () => { });
        });

    return fs.readFileSync("json/sortedById.json");
}