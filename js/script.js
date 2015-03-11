(function() {
    new Todo();
}());

function Todo() {
    var self = this;

    this.inputText = document.querySelector(".new-note");

    this.inputText.addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
            self.addTask(self.inputText.value); 
            self.inputText.value = "";               
        }
    });
}

Todo.prototype.addTask = function(taskText) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [],
        newTask = new Task(taskText, false);
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    tasks.forEach(function(cur) {
        console.log(cur.text + " " + cur.isCompleted);
    });
    (function(text) {
        var newTaskFragment = document.createDocumentFragment(),
            newTaskCheckBox = document.createElement("input"),
            newTaskRow = document.createElement("div"),
            newTaskText = document.createElement("label"),
            taskList = document.querySelector(".task-list");

        newTaskCheckBox.type = "checkbox";
        newTaskCheckBox.className = "toggle-task";
        taskList.lastChild ? newTaskText.className = "task" : newTaskText.className = "last-task";
        newTaskText.textContent = text;
        newTaskRow.appendChild(newTaskText);
        newTaskRow.appendChild(newTaskCheckBox);
        newTaskFragment.appendChild(newTaskRow);
        taskList.insertBefore(newTaskFragment, taskList.firstChild);
    }(taskText));
};

function Task(text, isCompleted) {
    this.text = text;
    this.isCompleted = isCompleted;
}