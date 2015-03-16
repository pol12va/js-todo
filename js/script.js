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
        this.tasks.reverse();
    }

    inputText.addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
            var task = new Task(this.value, false);
            
            self.addTask(task);
            self.tasks.unshift(task);
            this.value = "";               
        }
    });
}

Todo.prototype.addTask = function(task) {
    var checkbox = document.createElement("input"),
        taskRow = document.createElement("div"),
        label = document.createElement("label"),
        taskList = document.querySelector(".task-list"),
        self = this;

    checkbox.type = "checkbox";
    checkbox.className = "toggle-task";
    checkbox.addEventListener("click", function(event) {
        var parent = checkbox.previousSibling.parentElement,
            taskDivs = parent.parentElement.childNodes,
            index = [].slice.call(taskDivs).indexOf(parent);

        if (checkbox.checked) {
            checkbox.previousSibling.style.textDecoration = "line-through";
            self.tasks[index].isCompleted = true;
        } else {
            checkbox.previousSibling.style.textDecoration = "";
            self.tasks[index].isCompleted = false;
        }
    });
    taskList.lastChild ? label.className = "task" : label.className = "last-task";
    label.textContent = task.text;
    if (task.isCompleted) {        
        label.style.textDecoration = "line-through";
        checkbox.checked = true;
    } else {
        label.style.textDecoration = "";
        checkbox.checked = false;
    }
    taskRow.appendChild(label);
    taskRow.appendChild(checkbox);
    taskList.insertBefore(taskRow, taskList.firstChild);  
};

Todo.prototype.loadTasks = function() {  
    this.tasks.forEach(function(cur) {
        this.addTask(cur);
    }.bind(this));  
};

function Task(text, isCompleted) {
    if (!(this instanceof Task)) {
        return new Task();
    }
    this.text = text;
    this.isCompleted = isCompleted;
}

(function() {
    //localStorage.removeItem("tasks");
    var todo = new Todo();
    window.addEventListener("beforeunload", function() {
        localStorage.setItem("tasks", JSON.stringify(todo.tasks.reverse()));
    });
}());