function TodoView() {
    if (!(this instanceof TodoView)) {
        return new TodoView();
    }

    this.model = new TodoModel();
    var self = this,
        inputText = document.querySelector(".new-note"),
        toggleAll = document.querySelector(".toggle-all"),
        taskList = document.querySelector(".task-list"),
        taskListChildren = taskList.childNodes,
        footer = document.querySelector(".list-footer"),
        span = document.querySelector(".items-left-counter"),
        links = document.querySelectorAll(".link"),
        allLink = document.querySelector(".all-tasks"),
        activeLink = document.querySelector(".active-tasks"),
        completedLink = document.querySelector(".completed-tasks"),
        clearCompletedLink = document.querySelector(".clear-completed-link"),
        changeLinkColors,
        createNewClickEvent;

    changeLinkColors = function() {
        var i;

        for (i = 0; i < links.length; i++) {
            links[i].style.color = "#0000EE";
        }
        this.style.color = "red";
    };

    createNewClickEvent = function() {
        var evt = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        });

        return evt;
    }

    span.addEventListener("counter-changed", function() {
       var itemStr = " items left";

       if (self.model.undoneTaskCounter() === 1) {
           itemStr = " item left";
       }
       this.textContent = self.model.undoneTaskCounter() + itemStr;
    });

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
        var task = new Task(this.value, false);
        
        if (e.keyCode === 13) {            
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
            allCheckboxes = document.getElementsByClassName("toggle-task")
            checkbox;

        for (i = 0; i < allCheckboxes.length; i++) {
            checkbox = allCheckboxes[i];
            checkbox.checked = e.target.checked;
            checkbox.dispatchEvent(new Event('change'));
        }
    });

    allLink.addEventListener("click", function(e) {
        var i;

        if (self.model.filterId !== "0"
            || document.readyState !== "complete") {
            for (i = 0; i < taskListChildren.length; i++) {
                taskListChildren[i].style.display = "inline";
            }
            changeLinkColors.call(this);
            self.model.filterId = "0";
        }
        e.preventDefault();
    });

    activeLink.addEventListener("click", function(e) {
        var i;

        if (self.model.filterId !== "1"
            || document.readyState !== "complete") {
            for (i = 0; i < taskListChildren.length; i++) {
                if (!self.model.tasks()[i].isCompleted) {
                    taskListChildren[i].style.display = "inline";
                } else {
                    taskListChildren[i].style.display = "none";
                }
            }
            changeLinkColors.call(this);
            self.model.filterId = "1";
        }
        e.preventDefault();
    });

    completedLink.addEventListener("click", function(e) {
        var i;

        if (self.model.filterId !== "2"
            || document.readyState !== "complete") {
            for (i = 0; i < taskListChildren.length; i++) {
                if (self.model.tasks()[i].isCompleted) {
                    taskListChildren[i].style.display = "inline";
                } else {
                    taskListChildren[i].style.display = "none";
                }
            }
            changeLinkColors.call(this);
            self.model.filterId = "2";
        }
        e.preventDefault();
    });

    clearCompletedLink.addEventListener("click", function(e) {
        var i = taskListChildren.length;

        while (i--) {
            if (self.model.tasks()[i].isCompleted) {
                self.model.removeTask(i);
                taskList.removeChild(taskListChildren[i]);
            }
        }
        if (self.model.taskCounter() === 0) {
            footer.style.visibility = "hidden";
        }
        e.preventDefault();
    });

    switch (this.model.filterId) {
        case "0":
            allLink.dispatchEvent(createNewClickEvent());
            break;
        case "1":
            activeLink.dispatchEvent(createNewClickEvent());
            break;
        case "2":
            completedLink.dispatchEvent(createNewClickEvent());
            break;
        default:
            allLink.dispatchEvent(evnt);
    }
}

TodoView.prototype.addTask = (function() {
    var spanCounter = document.querySelector(".items-left-counter"),
        footer = document.querySelector(".list-footer");

    return function(task, taskRoot) {
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
                index = [].slice.call(taskDivs).indexOf(parent);

            if (checkbox.checked) {
                checkbox.previousSibling.style.textDecoration = "line-through";
                parent.style.opacity = "0.5";
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

        label.className = "task";
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
            var parent = deleteBtn.parentElement,
                root = parent.parentElement,
                taskDivs = root.childNodes,
                length = taskDivs.length,
                index = [].slice.call(taskDivs).indexOf(parent);

            if (!checkbox.checked) {
                self.model.decreaseUndoneCounter();
                spanCounter.dispatchEvent(new Event("counter-changed"));
            }
            self.model.removeTask(index);
            root.removeChild(parent);
            if (self.model.taskCounter() === 0) {
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
    }
}());

TodoView.prototype.storeData = function() {
    localStorage.setItem("tasks", JSON.stringify(this.model.tasks()));
    localStorage.setItem("filterId", this.model.getFilterId());
};

function TodoModel() {
    var tasksJson = localStorage.getItem("tasks"),
        tasks = (tasksJson !== null && tasksJson !== []) ? JSON.parse(tasksJson) : [],
        filterId = localStorage.getItem("filterId") || "0",
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
        },
        get filterId() {
            return filterId;
        },
        set filterId(value) {
            var number = Number(value);
            (number >= 0 && number < 3) ? filterId = value : filterId = "0";
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
        todoView.storeData();
    });
}());