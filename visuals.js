//Controller for checkbox click
function imageClick(img){
    if($(img).hasClass('check')){
        $(img).attr('src','img/square.png');
        $(img).removeClass('check');
        $(img).parent().siblings().removeClass('strikethrough');

    } else {
        $(img).attr('src','img/check.png');
        $(img).addClass('check');
        $(img).parent().siblings().addClass('strikethrough');
        
    }
}

//Function corresponding to the Complete All button
function completeAll(button){
    button.innerHTML = 'Uncomplete All';
    setAttributes(button, {'onclick': 'undoCompleteAll(this)'});
    $('img').each(function(img){
    	$(img).addClass('test');
        if(!($(img).hasClass('check'))){
        	imageClick(this);
        	$(img).addClass('check');
        }
        
    });
    
    $('#undoButton').css('display','inline-block');
}