if (typeof myparams['q'] !== 'undefined' || myparams['q'] !== '' || myparams['q'] !== '+'){
	// LOAD STUFF AFTER DOM READY
	$(document).ready(function(){


		// GET SEARCH Q FROM ARRAY
		var myheader = '';
		var strTrimmed = '';
		var strTrimmed = '';
		strTrimmed = $.trim(myparams['q']);

		if (typeof myparams['q'] !== 'undefined' && typeof myparams['q'] !== '' && strTrimmed !== '' && strTrimmed !== '+' ){
	
			strTrimmed = strTrimmed.replace( '+' , '' );
	
			myheader = myparams['q'];
			$('#campaign-wrapper').show();

			// NORMALIZE SOME URLENCODED CHARACTERS
			myheader =  unescape(myheader);
			myheader = myheader.replace('+', ' ');

			// TRUNCATE HEADER
			var myheadertrunc = myheader.substring(0,18);
			$('#searchword').append(myheadertrunc);

			// MAKE DIVS CLICKABLE
			$('.child-campaign').click(function(e){
				e.preventDefault();
				window.open($(this).find('a:first').attr('href'), '');
			});

			// $('.child-campaign:last').addClass('xtrahight');
			// $('<div class="xtrahi">&nbsp;</div>').appendTo('#campaign-wrapper');

		} else {
			
			$('#campaign-wrapper').hide();

		}
	
	});
}
