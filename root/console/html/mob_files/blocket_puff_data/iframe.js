function EA_init(struct) {
	window.EAad = window.EAad || {};

	window.eaNoAdFallback = struct.fallback;
	window.EAad_url = struct.cqueue_url;
	window.EAad_timeout = struct.timeout || 1000;
	window.EAad_product = struct.product;
	window.EAad_push = struct.push;
	window.EAad_use_tc = struct.use_tc;

	window.eaNoAd         = false;
	//-- EasyAds script.
	window.eaNoAdCallback = function () {
		if (window.eaNoAd != true) {
			// The operation below erases the EA-tag.
			document.querySelector(".puff_body").innerHTML = window.eaNoAdFallback.replace(/__double_quote__/g, '"');
			window.eaNoAd = true;
		}
		if (eaTimeout) {
			window.clearTimeout(eaTimeout);
		}
	}

	window.eaAdOnLoadCallback = function () {
		if (eaTimeout) {
			window.clearTimeout(eaTimeout);
		}
	}

	EAad.cqueue = (EAad.cqueue || []).concat(EAad_push);

	window.eaTimeout = window.setTimeout( function () { eaNoAdCallback(); }, window.EAad_timeout);

	if (EAad.script != 1) {
		(function(d,t) {
		 EAad.script = 1;
		 var _EA = d.createElement(t); _EA.type = 'text/javascript'; _EA.async = true;
		 _EA.src = EAad_url + '?pid=' + EAad.cqueue[0][1] + (EAad_use_tc ? '&tc='+EAad.cqueue[1][1] : '') + '&dt='+new Date().getTime();
		 var s = d.getElementsByTagName(t)[0]; s.parentNode.insertBefore(_EA, s);
		 }(document,'script'));
	}
}
