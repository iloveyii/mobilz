// GET OUR URL VARS
function getUrlVars() {
	// GET URL VARS FROM BLOCKET
	document.domain = 'blocket.se';
	var vars = [], hash;
	var hashes = window.parent.location.search.slice(window.parent.location.search.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}
var myparams = getUrlVars();


// GET CAMPAIGNS FROM EAS
if (typeof EAS_found_camp_484_1 !== 'undefined') {

	if (EAS_found_camp_484_1) {
		// FIRST WRITE THE HEADER
		document.write('<div id="campaign-wrapper"><div class="mama-header"><h3 id="searchword">Tips: </h3></div>');
		EAS_484_1();
	}

	if (EAS_found_camp_484_2) {
		EAS_484_2();
	}

	if (EAS_found_camp_484_3) {
		EAS_484_3();
	}

	if (EAS_found_camp_484_4) {
		EAS_484_4();
	}
	
	// UGLY FOR EAS
	if (EAS_found_camp_484_1) {
		// BRING IN THE ENDING DIV IF FIRST SEARCH HIT ONE
		document.write('<p class="bottom_text"><a href="//www.blocketsannonswebb.se/lokalt.html">Synas h&auml;r?</a></p>');
		document.write('<div class="xtrahi">&nbsp;</div>');
		document.write('</div>');
	}
}

