

module.exports = function (app, taskTracker, connection, fs) {

    app.get("/", (req, res) => {
        res.render("index.ejs");
    });

    app.get("/addUserForm", (req, res) => {
        res.render("addUserForm.ejs");
    });

    app.get("/addTaskForm", (req, res) => {
        res.render("addTaskForm.ejs");
    });

    app.get("/addTask", (req, res) => {
        taskTracker.addTask(connection, req.query);
        res.redirect("/");
    });

    app.get("/addUser", (req, res) => {
        taskTracker.addUser(connection, req.query);
        res.redirect("/");
    });

    app.get("/showTasks", (req, res) => {
        taskTracker.showTasks(connection);
        let tasks = fs.readFileSync("json/tasks.json");
        res.render('showTasks.ejs', { tasks: JSON.parse(tasks) });
    });

    app.get("/updateTasks", (req, res) => {
        res.redirect("back");
    });
    app.get("/updateUsers", (req, res) => {
        res.redirect("back");
    });

    app.get("/showUsers", (req, res) => {
        taskTracker.showUsers(connection);
        let users = fs.readFileSync("json/users.json");
        res.render("showUsers.ejs", { users: JSON.parse(users) });
    });

    app.get("/editTaskForm", (req, res) => {

        let task = req.query.taskContent;
        let taskArr = task.split(",");
        let taskObj = {
            "title": taskArr[0],
            "description": taskArr[1],
            "status": taskArr[2],
            "executor": taskArr[3],
            "id": taskArr[4]
        }

        let users = JSON.parse(fs.readFileSync("json/users.json"));
        res.render("editTaskForm.ejs", { task: taskObj, users: users });
    });

    app.get("/editUserForm", (req, res) => {
        let user = req.query.userContent;
        let userArr = user.split(",");
        let userObj = {
            "id": userArr[0],
            "first_name": userArr[1],
            "last_name": userArr[2]
        }

        res.render("editUserForm.ejs", { user: userObj });
    });

    app.get("/editTask", (req, res) => {

        req.query.executor = req.query.executor_id.split(",")[1];
        req.query.executor_id = req.query.executor_id.split(",")[0];

        taskTracker.editTask(connection, req.query);
        res.redirect("/showTasks");
    });

    app.get("/editUser", (req, res) => {
        taskTracker.editUser(connection, req.query);
        taskTracker.showUsers(connection);

        let users = fs.readFileSync("json/users.json");
        res.render("showUsers.ejs", { users: JSON.parse(users) });
    });

    app.get("/deleteUser", (req, res) => {

        let user = req.query.userContent;
        let userArr = user.split(",");
        let userObj = {
            "id": userArr[0],
            "first_name": userArr[1],
            "last_name": userArr[2]
        }
        taskTracker.deleteUser(connection, userObj);
        taskTracker.showUsers(connection);
        res.redirect("/showUsers");
    });

    app.get("/deleteTask", (req, res) => {
        let task = req.query.taskContent;
        let taskArr = task.split(",");
        let taskObj = {
            "title": taskArr[0],
            "description": taskArr[1],
            "status": taskArr[2],
            "executor": taskArr[3],
            "id": taskArr[4]
        }
        taskTracker.deleteTask(connection, taskObj);
        taskTracker.showTasks(connection);
        res.redirect("/showTasks");
    });

    app.get("/sortByStatus", (req, res) => {
        let tasks = JSON.parse(taskTracker.sortByStatus(connection));
        res.render("showTasks.ejs", { tasks: tasks });
    });
    app.get("/sortById", (req, res) => {
        let tasks = JSON.parse(taskTracker.sortById(connection));
        res.render("showTasks.ejs", { tasks: tasks });
    });
}