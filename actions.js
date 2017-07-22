//Controller for checkbox click
function imageClick(img){
	if($(img).hasClass('check')){
		console.log('true');
		$(img).attr('src','img/square.png');
		$(img).removeClass('check');
		$(img).parent().siblings().removeClass('strikethrough');

	} else {
		$(img).attr('src','img/check.png');
		$(img).addClass('check');
		$(img).parent().siblings().addClass('strikethrough');
		
	}
	var title = $(img).parent().siblings().text();
	emitInProgress(title);
}

//Function corresponding to the Complete All button
var buttonTextToggle=true;
function completeAll(button){
	if(buttonTextToggle){
		button.innerHTML = 'Uncomplete All';
	} else {
		button.innerHTML = 'Complete All';
	}
	buttonTextToggle = !buttonTextToggle;

	$('img').each(function(){
		//checks html elements if they contain a class name. Method in accessories.js
		//Cannot use jquery hasClass() on html elements passed as a param
		if(!(jQuery(this).hasClass('check'))){
			imageClick(this);
			
		}

	});



	$('#undoButton').css('display','inline-block');
}
//Function corresponding to the Undo button
function undoCompleteAll(button){
	button.innerHTML = 'Complete All';
	$('img').each(function(){
		if(jQuery(this).hasClass('check')){
			imageClick(this);
		}
	});

}  