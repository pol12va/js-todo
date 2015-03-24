function Todo() {
    if (!(this instanceof Todo)) {
        return new Todo();
    }
    var self = this,
        tasksJson = localStorage.getItem("tasks"),
        inputText = document.querySelector(".new-note"),
        toggleAll = document.querySelector(".toggle-all"),
        taskList = document.querySelector(".task-list"),
        footer = document.querySelector(".list-footer"),
        span = document.querySelector(".items-left-counter");

    this.tasks = (tasksJson !== null && tasksJson !== []) ? JSON.parse(tasksJson) : [];
    this.leftTaskCounter = 0;

    span.addEventListener("counter-changed", function() {
       var itemStr = " items left";

       if (self.leftTaskCounter === 1) {
           itemStr = " item left";
       }
       this.textContent = self.leftTaskCounter + itemStr;
    }, false);

    if (this.tasks.length !== 0) {
        this.tasks.forEach(function(cur) {
            self.addTask(cur, taskList);
            if (!cur.isCompleted) {
                self.leftTaskCounter++;
            }
        });
        footer.style.visibility = "visible";
    }
    span.textContent = this.leftTaskCounter + " items left";
    
    inputText.addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
            var task = new Task(this.value, false),
                e = new Event("counter-changed");
            
            self.addTask(task, taskList);
            self.leftTaskCounter++;
            if (self.tasks.length === 0) {
                footer.style.visibility = "visible";
            }
            self.tasks.push(task);
            span.dispatchEvent(e);
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

Todo.prototype.addTask = function(task, taskRoot) {
    var checkbox = document.createElement("input"),
        taskRow = document.createElement("div"),
        label = document.createElement("label"),
        deleteBtn = document.createElement("button"),
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

    taskRoot.firstChild ? label.className = "task" : label.className = "first-task";
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
            root = parent.parentElement,
            taskDivs = parent.parentElement.childNodes,
            length = taskDivs.length,
            index = [].slice.call(taskDivs).indexOf(parent),
            spanCounter,
            footer,
            e;

        if (index === 0 && length > 1) {
            taskDivs[1].childNodes[0].className = "first-task";
        }
        if (!checkbox.checked) {
            spanCounter = document.querySelector(".items-left-counter");
            e = new Event("counter-changed")
            self.leftTaskCounter--;
            spanCounter.dispatchEvent(e);
        }
        self.tasks.splice(index, 1);
        root.removeChild(parent);
        if (self.tasks.length === 0) {
            footer = document.querySelector(".list-footer");
            footer.style.visibility = "hidden";
        }
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
    taskRoot.appendChild(taskRow, taskRoot.firstChild);
};

Todo.prototype.loadTasks = function() {  
    this.tasks.forEach(function(cur) {
        this.addTask(cur);
    }.bind(this));  
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