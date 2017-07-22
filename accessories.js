//Helper function to set multiple attributes
function setAttributes(elem, attrs) {
	for(var key in attrs) {
		elem.setAttribute(key, attrs[key]);
	}
}


//If user presses in enter in input box => triggers add button
$("#todo-input").keyup(function(event){
	if(event.keyCode == 13){
		add();
	}
});


$('#add-button').click(function(){
	add();
})

var allToggle=true;
$('#completeall-button').click(function(){
	if(allToggle){
		completeAll(this);
	} else{
		undoCompleteAll(this);
	}
	allToggle = !allToggle;
});



$('#delete-button').click(function(){
	Delete();
})

function hasClass(element, className) {
	return element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
}
