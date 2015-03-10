var TODO_APP = {    
    newTaskTextStyle: "italic"
};

(function() {
    new Todo();
}());

function Todo() {
    var self = this;

    this.inputText = document.querySelector(".new-note");
    this.inputText.style.fontStyle = TODO_APP.newTaskTextStyle;

    this.inputText.addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
            
        }
    });
}