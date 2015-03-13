function Todo() {
    if (!(this instanceof Todo)) {
        return new Todo();
    }
    var self = this,
        tasksJson = localStorage.getItem("tasks"),
        addTask,
        inputText = document.querySelector(".new-note");

    this.tasks = (tasksJson !== null && tasksJson !== []) ? JSON.parse(tasksJson) : [];
    if (this.tasks.length !== 0) {
        this.tasks.forEach(function(cur) {
            self.addTask(cur);
        });
    }

    inputText.addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
            var task = new Task(this.value, false);
            
            self.addTask(task);
            self.tasks.push(task);
            this.value = "";               
        }
    });
}

Todo.prototype = (function() {
    return {
        addTask: function(task) {
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
        },
        loadTasks: function() {
            this.tasks.forEach(function(cur) {
                this.addTask(cur);
            }.bind(this));    
        }
    };    
}());

function Task(text, isCompleted) {
    if (!(this instanceof Task)) {
        return new Task();
    }
    this.text = text;
    this.isCompleted = isCompleted;
}

(function() {
    var todo = new Todo();
    window.addEventListener("beforeunload", function() {
        localStorage.setItem("tasks", JSON.stringify(todo.tasks));
    });
}());