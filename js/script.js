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

Todo.prototype.addTask = function(task) {
    var checkbox = document.createElement("input"),
        taskRow = document.createElement("div"),
        label = document.createElement("label"),
        deleteBtn = document.createElement("button"),
        taskList = document.querySelector(".task-list"),
        self = this;

    checkbox.type = "checkbox";
    checkbox.className = "toggle-task";
    checkbox.addEventListener("click", function(event) {
        var parent = checkbox.parentElement,
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

    label.className = "task";
    label.textContent = task.text;
    if (task.isCompleted) {        
        label.style.textDecoration = "line-through";
        checkbox.checked = true;
    } else {
        label.style.textDecoration = "";
        checkbox.checked = false;
    }

    deleteBtn.className = "delete";
    deleteBtn.textContent = "X";
    deleteBtn.style.visibility = "hidden";
    deleteBtn.addEventListener("click", function(event) {
        var parent = checkbox.parentElement,
            taskDivs = parent.parentElement.childNodes,
            index = [].slice.call(taskDivs).indexOf(parent);
        self.tasks.splice(index, 1);
        parent.parentElement.removeChild(parent);
    });

    taskRow.addEventListener("mouseenter", function(event) {
        this.lastChild.style.visibility = "visible";
    });
    taskRow.addEventListener("mouseleave", function(event) {
        this.lastChild.style.visibility = "hidden";
    });
    taskRow.appendChild(label);
    taskRow.appendChild(checkbox);
    taskRow.appendChild(deleteBtn);
    taskList.appendChild(taskRow, taskList.firstChild);  
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
        localStorage.setItem("tasks", JSON.stringify(todo.tasks));
    });
}());