//Helper function to set multiple attributes
function setAttributes(elem, attrs) {
	for(var key in attrs) {
		elem.setAttribute(key, attrs[key]);
	}
}


//If user presses in enter in input box => triggers add button
$("#todo-input").keyup(function(event){
	if(event.keyCode == 13){
		if(online){
		add();
	} else {
		alert('You are offline. Please go online to make any changes.');
	}
	}
});


$('#add-button').click(function(){
	if(online){
		add();
	} else {
		alert("You are offline. Please go online to make any changes.");
	}
})

var allToggle=true;
$('#completeall-button').click(function(){
	if(online){
		if(allToggle){
			completeAll(this);
		} else{
			undoCompleteAll(this);
		}
		allToggle = !allToggle;
	} else {
		alert("You are offline. Please go online to make any changes.");
	}
});




$('#delete-button').click(function(){
	if(online){
		Delete();
	}else {
		alert("You are offline. Please go online to make any changes.");
	}
})

function hasClass(element, className) {
	return element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
}
