(function() {
    var todo = new Todo();
    window.addEventListener("beforeunload", function() {
        localStorage.setItem("tasks", JSON.stringify(todo.tasks));
    });
}());

function Todo() {
    var self = this,
        tasksJson = localStorage.getItem("tasks"),
        addTask;

    this.inputText = document.querySelector(".new-note");
    this.tasks = (tasksJson !== null && tasksJson !== []) ? JSON.parse(tasksJson) : [];

    addTask = function(task) {
        var checkbox = document.createElement("input"),
            taskRow = document.createElement("div"),
            label = document.createElement("label"),
            taskList = document.querySelector(".task-list");

        checkbox.type = "checkbox";
        checkbox.className = "toggle-task";
        taskList.lastChild ? label.className = "task" : label.className = "last-task";
        label.textContent = task.text;
        taskRow.appendChild(label);
        taskRow.appendChild(checkbox);
        taskList.insertBefore(taskRow, taskList.firstChild);
    };

    if (this.tasks.length !== 0) {
        this.tasks.forEach(function(cur) {
            addTask(cur);
        });
    }

    this.inputText.addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
            var task = new Task(self.inputText.value, false);
            
            addTask(task);
            self.tasks.push(task);
            self.inputText.value = "";               
        }
    });
}

function Task(text, isCompleted) {
    this.text = text;
    this.isCompleted = isCompleted;
}