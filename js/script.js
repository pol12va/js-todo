function Todo() {
    if (!(this instanceof Todo)) {
        return new Todo();
    }
    var self = this,
        tasksJson = localStorage.getItem("tasks"),
        inputText = document.querySelector(".new-note"),
        toggleAll = document.querySelector(".toggle-all");

    this.tasks = (tasksJson !== null && tasksJson !== []) ? JSON.parse(tasksJson) : [];
    this.leftTaskCounter = 0;

    if (this.tasks.length !== 0) {
        this.tasks.forEach(function(cur) {
            self.addTask(cur);
            if (!cur.isCompleted) {
                self.leftTaskCounter++;
            }
        });
        self.addFooter();
    }

    inputText.addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
            var task = new Task(this.value, false);
            
            self.addTask(task);
            self.tasks.push(task);
            this.value = "";               
        }
    });

    toggleAll.addEventListener("change", function(e) {
        var i,
            allCheckboxes = document.getElementsByClassName("toggle-task");

        for (i = 0; i < allCheckboxes.length; i++) {
            allCheckboxes[i].checked = e.target.checked;
            allCheckboxes[i].dispatchEvent(new Event('change'));
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
    checkbox.addEventListener("change", function(e) {
        var parent = checkbox.parentElement,
            taskDivs = parent.parentElement.childNodes,
            index = [].slice.call(taskDivs).indexOf(parent),
            e = new Event("counter-changed"),
            spanCounter = document.querySelector(".items-left-counter");

        if (checkbox.checked) {
            checkbox.previousSibling.style.textDecoration = "line-through";
            checkbox.parentElement.style.opacity = "0.5";
            self.tasks[index].isCompleted = true;
            self.leftTaskCounter--;
        } else {
            checkbox.previousSibling.style.textDecoration = "";
            checkbox.parentElement.style.opacity = "1";
            self.tasks[index].isCompleted = false;
            self.leftTaskCounter++;
        }
        spanCounter.dispatchEvent(e);
    });

    taskList.firstChild ? label.className = "task" : label.className = "first-task";
    label.textContent = task.text;
    if (task.isCompleted) {  
        taskRow.style.opacity = "0.5";      
        label.style.textDecoration = "line-through";
        checkbox.checked = true;
    } else {
        taskRow.style.opacity = "1";
        label.style.textDecoration = "";
        checkbox.checked = false;
    }

    deleteBtn.className = "delete";
    deleteBtn.textContent = "X";
    deleteBtn.style.visibility = "hidden";
    deleteBtn.addEventListener("click", function(e) {
        var parent = checkbox.parentElement,
            taskDivs = parent.parentElement.childNodes,
            length = taskDivs.length,
            index = [].slice.call(taskDivs).indexOf(parent);

        if (index === 0 && length > 0) {
            taskDivs[1].childNodes[0].className = "first-task";
        }
        self.tasks.splice(index, 1);
        parent.parentElement.removeChild(parent);
    });

    taskRow.addEventListener("mouseenter", function(e) {
        this.lastChild.style.visibility = "visible";
    });
    taskRow.addEventListener("mouseleave", function(e) {
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

Todo.prototype.addFooter = function() {
    var taskList = document.querySelector(".task-list"),
        footer = document.createElement("div"),
        span = document.createElement("span"),
        self = this;

    span.addEventListener("counter-changed", function() {
       var itemStr = " items left";

       if (self.leftTaskCounter === 1) {
           itemStr = " item left";
       }
       this.textContent = self.leftTaskCounter + itemStr;
    }, false);
    span.className = "items-left-counter";
    span.textContent = this.leftTaskCounter + " items left";
    footer.className = "list-footer";
    footer.appendChild(span);
    taskList.appendChild(footer);   
};

Todo.prototype.updateTaskCounter = function() {
    var span = document.querySelector(".items-left-counter"),
        itemStr = " items left";

    if (this.leftTaskCounter === 1) {
        itemStr = " item left";
    }
    span.textContent = this.leftTaskCounter + itemStr; 
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