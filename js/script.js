function TodoView() {
    if (!(this instanceof TodoView)) {
        return new TodoView();
    }
    var self = this,
        inputText = document.querySelector(".new-note"),
        toggleAll = document.querySelector(".toggle-all"),
        taskList = document.querySelector(".task-list"),
        footer = document.querySelector(".list-footer"),
        span = document.querySelector(".items-left-counter"),
        allLink = document.querySelector(".all-tasks"),
        activeLink = document.querySelector(".active-tasks"),
        completedLink = document.querySelector(".completed-tasks"),
        clearCompletedLink = document.querySelector(".clear-completed-link");

    this.model = new TodoModel();

    span.addEventListener("counter-changed", function() {
       var itemStr = " items left";

       if (self.model.undoneTaskCounter() === 1) {
           itemStr = " item left";
       }
       this.textContent = self.model.undoneTaskCounter() + itemStr;
    }, false);

    if (this.model.taskCounter() !== 0) {
        this.model.tasks().forEach(function(cur) {
            self.addTask(cur, taskList);
            if (!cur.isCompleted) {
                self.model.increaseUndoneCounter();
            }
        });
        footer.style.visibility = "visible";
    }
    span.dispatchEvent(new Event("counter-changed"));
    
    inputText.addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
            var task = new Task(this.value, false);
            
            self.addTask(task, taskList);
            self.model.increaseUndoneCounter();
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

    allLink.addEventListener("click", function(e) {
        var allTaskViews = taskList.childNodes,
            i;

        for (i = 0; i < allTaskViews.length; i++) {
            allTaskViews[i].style.display = "inline";
        }
        e.preventDefault();
    });

    activeLink.addEventListener("click", function(e) {
        var allTaskViews = taskList.childNodes,
            i;

        for (i = 0; i < allTaskViews.length; i++) {
            if (!self.model.tasks()[i].isCompleted) {
                allTaskViews[i].style.display = "inline";
            } else {
                allTaskViews[i].style.display = "none";
            }
        }
        e.preventDefault();
    });

    completedLink.addEventListener("click", function(e) {
        var allTaskViews = taskList.childNodes,
            i;

        for (i = 0; i < allTaskViews.length; i++) {
            if (self.model.tasks()[i].isCompleted) {
                allTaskViews[i].style.display = "inline";
            } else {
                allTaskViews[i].style.display = "none";
            }
        }
        e.preventDefault();
    });

    clearCompletedLink.addEventListener("click", function(e) {
        var root = taskList,
            allTaskViews = root.childNodes,
            i = allTaskViews.length;

        while (i--) {
            if (self.model.tasks()[i].isCompleted) {
                self.model.removeTask(i);
                root.removeChild(allTaskViews[i]);
            }
        }
        if (self.model.taskCounter() === 0) {
            footer.style.visibility = "hidden";
        }
        e.preventDefault();
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
            index = [].slice.call(taskDivs).indexOf(parent)
            spanCounter = document.querySelector(".items-left-counter");

        if (checkbox.checked) {
            checkbox.previousSibling.style.textDecoration = "line-through";
            checkbox.parentElement.style.opacity = "0.5";
            self.model.tasks()[index].isCompleted = true;
            self.model.decreaseUndoneCounter();
        } else {
            checkbox.previousSibling.style.textDecoration = "";
            checkbox.parentElement.style.opacity = "1";
            self.model.tasks()[index].isCompleted = false;
            self.model.increaseUndoneCounter();
        }
        spanCounter.dispatchEvent(new Event("counter-changed"));
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
            footer;

        if (index === 0 && length > 1) {
            taskDivs[1].childNodes[0].className = "first-task";
        }
        if (!checkbox.checked) {
            spanCounter = document.querySelector(".items-left-counter");
            self.model.decreaseUndoneCounter();
            spanCounter.dispatchEvent(new Event("counter-changed"));
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

function TodoModel() {
    var tasksJson = localStorage.getItem("tasks"),
        tasks = (tasksJson !== null && tasksJson !== []) ? JSON.parse(tasksJson) : [],
        leftTaskCounter = 0;

    return {
        decreaseUndoneCounter: function() {
            if (leftTaskCounter > 0) {
                leftTaskCounter--;
            }
        },
        increaseUndoneCounter: function() {
            leftTaskCounter++;
        },
        addTask: function(newTask) {
            tasks.push(newTask);
        },
        removeTask: function(pos) {
            tasks.splice(pos, 1);
        },
        undoneTaskCounter: function() {
            return leftTaskCounter;
        },
        taskCounter: function() {
            return tasks.length;
        },
        tasks: function() {
            return tasks.slice();
        }
    };
}

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