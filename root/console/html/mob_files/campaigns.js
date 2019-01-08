blocket("@apps.list").extend({
	show_ie9_box: function () {
		"use strict";
		blocket.$.click(function () {
			blocket.apps.lightbox.open({
				type : "url",
				data : "/ie9_pin.htm"
			});
			return false;
		});
	}
});
blocket("@apps.index").extend({

	onReady: function () {
		"use strict";
		blocket.apps.common.campaign("index", blocket.apps.index.ready_klart);
	},

	klart_news: {

		duration: 150,
		province: "",
		default_province: "",
		default_province_name: "",

		mouseover: function (province, province_name) {
			"use strict";

			var that = this;

			if (province === "") {
				province = this.default_province;
				province_name = this.default_province_name;
			}

			if (this.province !== province && that.json.data !== undefined) {

				if (province_name) {
					this.province = province_name;
				} else {
					this.province = province;
				}

				/* Don't fade in IE */
				if ($.browser.msie) {
					if (province_name) {
						$("#klart_news .province").text(province_name);
					} else {
						$("#klart_news .province").text(province);
					}

					$("#klart_news .icon").attr("src", "/img/weather/" + that.json.data[province].now.symbol + "s" + that.json.header.symbol_type);
				} else {
					$("#klart_news .province")
					.stop()
					.animate({opacity: "0"}, {duration: this.duration, complete: function () {

						if (province_name) {
							$("#klart_news .province").text(province_name);
						} else {
							$("#klart_news .province").text(province);
						}

						$(this).animate({opacity: "1"}, {duration: that.duration});
					}});

					$("#klart_news .icon")
					.stop()
					.animate({opacity: "0"}, {duration: this.duration, complete: function () {

						$("#klart_news .icon").attr("src", "/img/weather/" + that.json.data[province].now.symbol + "s" + that.json.header.symbol_type);

						$(this).animate({opacity: "1"}, {duration: that.duration});
					}});
				}

				$("#klart_news .temperature").text(that.json.data[province].now.temperature + " " + that.json.header.temp_unit);
			}
		},

		mouseout: function () {
			"use strict";
			// Looks ugly if current icon fades out, just to fade in again
			this.mouseover(this.default_province, this.default_province_name);
		},

		// This object is populated from js_globals
		json: {

		}
	},

	ready_klart: function () {
		"use strict";


		// mouse over region list
		
		$(".regions a").mouseover(function () {
			var num = this.id.substring(this.id.indexOf("_") + 1);
			blocket.apps.index.klart_news.mouseover($("#area_" + num).text());
		});

		$(".regions a").mouseout(function () {
			var num = this.id.substring(this.id.indexOf("_") + 1);
			blocket.apps.index.klart_news.mouseout($("#area_" + num).text());
		});


		if ($("#sweden_2d").length > 0) {
			$("#sweden_2d area").mouseover(function () {

				var num = this.id.substring(this.id.indexOf("_") + 1);
				blocket.apps.index.klart_news.mouseover($("#area_" + num).text());
			});

			$("#sweden_2d area").mouseout(function () {
				var num = this.id.substring(this.id.indexOf("_") + 1);
				blocket.apps.index.klart_news.mouseout($("#area_" + num).text());
			});
		} else {
			$("#sweden_svg g")
				.mouseover(function () {
					var num = $(this).attr('id').replace(/a/, "");
					blocket.apps.index.klart_news.mouseover($("#area_" + num).text());
				})
				.mouseout(function () {
					blocket.apps.index.klart_news.mouseout();
				});
		}
	}
});
// Listen for event "enterfullscreen" and "exitfullscreen" that is triggered
// when a user clicks the fullscreen button and close button.
// Due to our old jQuery version we use bind instead of
// .on()
// TODO: change this when we upgrade jQuery

blocket("@apps.view.fullscreen").extend({

	onReady: function () {
		"use strict";
		$(document).bind("webkitfullscreenchange mozfullscreenchange fullscreenchange", function () {
			if (blocket.apps.view.isFullScreen()) {
				blocket.apps.view.fullscreen.lendoFullscreenOn();
			} else {
				blocket.apps.view.fullscreen.lendoFullscreenOff();
			}
		});
	},

	lendoFullscreenOn: function () {
		"use strict";

		if ($("#eas_1793>iframe").length > 0) {
			var lendo_iframe = $("#eas_1793>iframe");
			var lendo_iframe_eas_src = lendo_iframe.attr("eas_src");

			lendo_iframe_eas_src = lendo_iframe_eas_src.replace(/&amp;now=[0-9]+|&amp;fullscreen=on/gi, "");

			lendo_iframe.remove();

			window.EAS_load_fif("eas_1793", lendo_iframe_eas_src + "&amp;fullscreen=on", 200, 0, "");

		}
	},

	lendoFullscreenOff: function () {
		"use strict";
		if ($("#eas_1793>iframe").length > 0) {
			var lendo_iframe = $("#eas_1793>iframe");
			var lendo_iframe_eas_src = lendo_iframe.attr("eas_src");

			lendo_iframe_eas_src = lendo_iframe_eas_src.replace(/&amp;now=[0-9]+|&amp;fullscreen=on/gi, "");

			lendo_iframe.remove();

			window.EAS_load_fif("eas_1793", lendo_iframe_eas_src, 200, 0, "");
		}
	}
});
blocket("@init.support.self").extend(function () {
	"use strict";

	$("#open_safe_shop_quiz").click(function () {
		blocket.apps.lightbox.open({
			type: "url",
			data: "/handlatryggtskolan.htm",
			callback: function () {
//				$("#open_safe_shop_quiz").unbind("click");
			}
		});
	});
});

blocket("@apps.support").extend({
	quiz_container_event : function (e) {
		"use strict";
		if (e !== undefined) {
			if (e.type === 'keydown' && e.keyCode && e.keyCode === 27) {
				$('#close_quiz_window').trigger("click");
				return false;
			}
		}
	}
});
blocket("@apps.index").extend({
	mediamarkt_init: function () {
		"use strict";
		$('<div class="mediamarkt_popout absolute hidden"><p></p></div>')
			.appendTo('.regions');
		$('.regionslist a[data-region]')
			.mouseover(blocket.apps.index.show_mediamarkt_popout)
			.mouseout(blocket.apps.index.hide_mediamarkt_popout);
		$("#sweden_2d area, #sweden_svg g")
			.mouseover(blocket.apps.index.show_mediamarkt_popout)
			.mouseout(blocket.apps.index.hide_mediamarkt_popout);
	},

	show_mediamarkt_popout: function () {
		"use strict";
		var id = $(this).attr('data-region') || $(this).attr('id').replace(/a/, '');
		var link = $('.regionslist a[data-region="' + id + '"]');
		var pos = link.position();
		var popout = $('.mediamarkt_popout');
		$('p', popout).text(mediamarkt[id]);
		popout.css({top: pos.top + 35, left: pos.left + link.outerWidth() + 40 }).removeClass('hidden');
	},

	hide_mediamarkt_popout: function () {
		"use strict";
		$('.mediamarkt_popout').addClass('hidden');
	}
});
$(function () {
	"use strict";
	$('#telge-click-left, #telge-click-right').click(function (ev) {
		ev.preventDefault();
		window.open($('#telge-link').attr('href'));
	});
});

$('#insurance .search_param_link:not(.selected_param)').on('click', function () {
	"use strict";
	xt_click(this.parentNode, 'C', '11', 'BBF_filtrering', 'A');
});



