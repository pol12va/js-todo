function TodoView() {
    if (!(this instanceof TodoView)) {
        return new TodoView();
    }
    var self = this,
        inputText = document.querySelector(".new-note"),
        toggleAll = document.querySelector(".toggle-all"),
        taskList = document.querySelector(".task-list"),
        footer = document.querySelector(".list-footer"),
        span = document.querySelector(".items-left-counter");

    this.model = new TodoModel();

    span.addEventListener("counter-changed", function() {
       var itemStr = " items left";

       if (self.model.leftTaskCounter() === 1) {
           itemStr = " item left";
       }
       this.textContent = self.model.leftTaskCounter() + itemStr;
    }, false);

    if (this.model.taskCounter() !== 0) {
        this.model.tasks().forEach(function(cur) {
            self.addTask(cur, taskList);
            if (!cur.isCompleted) {
                self.model.incCounter();
            }
        });
        footer.style.visibility = "visible";
    }
    span.dispatchEvent(new Event("counter-changed"));
    
    inputText.addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
            var task = new Task(this.value, false);
            
            self.addTask(task, taskList);
            self.model.incCounter();
            if (self.model.taskCounter() === 0) {
                footer.style.visibility = "visible";
            }
            self.model.addTask(task);
            span.dispatchEvent(new Event("counter-changed"));
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

TodoView.prototype.addTask = function(task, taskRoot) {
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
            self.model.tasks()[index].isCompleted = true;
            self.model.decCounter();
        } else {
            checkbox.previousSibling.style.textDecoration = "";
            checkbox.parentElement.style.opacity = "1";
            self.model.tasks()[index].isCompleted = false;
            self.model.incCounter();
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
            self.model.decCounter();
            spanCounter.dispatchEvent(e);
        }
        self.model.removeTask(index);
        root.removeChild(parent);
        if (self.model.taskCounter() === 0) {
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

TodoView.prototype.loadTasks = function() {  
    this.model.tasks().forEach(function(cur) {
        this.addTask(cur);
    }.bind(this));  
};

TodoView.prototype.updateTaskCounter = function() {
    var span = document.querySelector(".items-left-counter"),
        itemStr = " items left";

    if (this.model.leftTaskCounter() === 1) {
        itemStr = " item left";
    }
    span.textContent = this.model.leftTaskCounter() + itemStr; 
};

function TodoModel() {
    var tasksJson = localStorage.getItem("tasks"),
        tasks = (tasksJson !== null && tasksJson !== []) ? JSON.parse(tasksJson) : [],
        leftTaskCounter = 0;

    return {
        decCounter: function() {
            if (leftTaskCounter > 0) {
                leftTaskCounter--;
            }
        },
        incCounter: function() {
            leftTaskCounter++;
        },
        addTask: function(newTask) {
            tasks.push(newTask);
        },
        removeTask: function(pos) {
            tasks.splice(pos, 1);
        },
        leftTaskCounter: function() {
            return leftTaskCounter;
        },
        taskCounter: function() {
            return tasks.length;
        },
        tasks: function() {
            return tasks;
        }
    };
}

TodoModel.prototype.loadTasks = function() {
    var tasksJson = localStorage.getItem("tasks");

    this.tasks = (tasksJson !== null && tasksJson !== []) ? JSON.parse(tasksJson) : [];
};

TodoModel.prototype.decCounter = function() {
    if (this.leftTaskCounter > 0) {
        this.leftTaskCounter--;
    }
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
    var todoView = new TodoView();
    window.addEventListener("beforeunload", function() {
        localStorage.setItem("tasks", JSON.stringify(todoView.model.tasks()));
    });
}());