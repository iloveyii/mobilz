function fif_init(_url, _use_resize_iframes){
	window.fif = window.fif || {};
	var parts = location.hash.split("|");
	fif.target = parts[0];
	fif.func = parts.length > 1 ? parts[1] : "resize_iframe";
	fif.url = _url;
	fif.tries = 0;
	fif.retrie_speed = 5;
	fif.timeout = 3000;
	fif.use_resize_iframes = !!_use_resize_iframes;

	fif.getSize = function () {

		var width = Math.max(document.body.scrollWidth, document.body.clientWidth);
		var height = Math.max(document.body.scrollHeight, document.body.clientHeight);

		if (width < "20" || height < "20") {
			return false;
		}

		return {
			width: width,
			height: height
		};
	},

	fif.resize = function () {
		if(fif.target !== "") {
			clearInterval(fif.interval);
			fif.interval = setInterval(function() {
				fif.tries++;
				var o = fif.getSize();

				if (typeof o === "object") {
					o.func = fif.func;
					o.target = fif.target;
					try {
						window.parent.postMessage(JSON.stringify(o), fif.url);
					} catch (e) {
						clearInterval(fif.interval);
					}
				}

				if (fif.retrie_speed * fif.tries > fif.timeout) {
					clearInterval(fif.interval);
				}

			}, fif.retrie_speed);
		} else if(fif.use_resize_iframes) {
			blocket.apps.all_pages.resize_iframes(window.frameElement);
		}
	}

	return fif;
}
