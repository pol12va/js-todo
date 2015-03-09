var TODO_APP = {    
    newTaskTextStyle: "italic"
};

(function() {
    new Todo();
}());

function Todo() {
    this.inputText = document.querySelector(".new-note");
    this.inputText.style.fontStyle = TODO_APP.newTaskTextStyle;
}