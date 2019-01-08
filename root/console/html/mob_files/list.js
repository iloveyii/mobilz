/*jshint nonstandard:true */
var hash_load_content = true;	// false = disable reloading content upon hashchange event (mainly for old IE(6,7,8) browsers as they do not support pushState, but uses cowboy hashchange instead). Set to "true" upon search col link-click or drop-select.
blocket("@apps.list.history_fallback").extend({
	globals : {
		name : "history_fallback"
	},
	init : function () {
		"use strict";
		$('<iframe id="history_fallback" src="/iframe_with_document_domain.html" />')
		.load(function () {
			console.log('iframe loaded');
			if ($(this).contents()[0].domain === document.domain) {
				console.log('Same domain');
			}
		})

		.appendTo('body');
		console.log('iframe created');
	}
});

blocket("@apps.stores").extend({
	store_expand_description : function () {
		"use strict";
		var self = this.store_expand_description;
		var $store_expand_collapse_link = $("#store_expand_collapse_link");
		var $store_body = $("#store_body");

		self.$.click(function () {
			if ($store_body.css("max-height") !== "none") {
				$store_body.css("max-height", "none");
				$(".sprite_list_store_innerbox_fade").hide();
				$store_expand_collapse_link.removeClass("sprite_list_arrow_down").addClass("sprite_list_arrow_up");
				$store_expand_collapse_link.text("Mindre info");
			} else {
				$store_body.css("max-height", $(".content_right").height() - $(".store_inner_head").height() - $(".store_tagline").height());
				$(".sprite_list_store_innerbox_fade").show();
				$store_expand_collapse_link.removeClass("sprite_list_arrow_up").addClass("sprite_list_arrow_down");
				$store_expand_collapse_link.text("Mer info");
				$("html, body").animate({ scrollTop: 0 }, "slow");
			}
		});
	},

	store_send_mail_form_submit : function (form) {
		"use strict";
		// Perform AJAX-post
		$.ajax({
			url : "/send_ar",
			data : $(form).serialize(),
			type : "post",
			dataType : "json",
			success : blocket.apps.stores.store_send_mail_callback
		});
		return false;
	},

	store_send_mail_callback : function (response) {
		"use strict";
		if (response.status === "OK") {
			var form = $("#store_send_email_form");
			form.unbind("submit");
			form.remove();
			// Show mail confirmation
			$("#ad_reply_success").fadeIn(500);

		} else if (response.status === "ERROR") {
			// Hide error texts
			$("[id^=err_]").hide();

			// Set error texts
			for (var i in response) {
				if (i !== "status" && i !== "id") {
					blocket.apps.common.set_err(i, response[i]);
				}
			}
		}
	}
});

blocket("@apps.list").extend({
	// True if the new json structure is used, currently only on Bostad.
	new_json : function () {
		"use strict";
		return ($("#search_column").attr("data-json") !== undefined && $("#search_column").attr("data-json") === "1");
	},

	run_latest_search : function () {
		"use strict";
		if (Storage !== undefined && localStorage.getItem(blocket.params.latest_search.local_storage_name) !== null && blocket.params.latest_search.enabled === "1") {
			var latest_search_list = JSON.parse(localStorage.getItem(blocket.params.latest_search.local_storage_name));
			if (latest_search_list.length > 0) {
				var image_container = $("#latest_search_image_container");
				var latest_search_container = $("#latest_search_container");
				var latest_search_items = latest_search_container.find(".latest_search_wrapper");
				var latest_search_tmpl = latest_search_items.first();

				//Remove old items
				latest_search_items.remove();
				image_container.append(latest_search_tmpl);

				latest_search_container.removeClass("hidden");

				$.each(latest_search_list, function () {
					var latest_search_wrapper = latest_search_tmpl.clone(true);
					var text_link = latest_search_wrapper.find(".latest_search_text_link");
					var img_link = latest_search_wrapper.find(".latest_search_img_link");
					var img_wrapper = latest_search_wrapper.find(".image_container");
					var img = latest_search_wrapper.find("img");

					// Preload thumb to see if it exists. Otherwise keep the no thumb placeholder.

					if (this.thumb !== undefined) {
						var no_thumb_placeholder = img[0].src;
						$(img).load(function () {
							blocket.apps.common.crop_image_to_fit_container(this, img_wrapper);
						});
						$(img).error(function () {
							this.src = no_thumb_placeholder;
						});
						img[0].src = this.thumb;
					}

					latest_search_wrapper.removeClass("hidden");

					text_link.attr("href", this.url);
					text_link.html(this.title);
					img_link.attr({
						href : this.url,
						title : this.title
					});

					image_container.append(latest_search_wrapper);
				});
			}
		}
	},

	parse_numeric_range : function (from, to, suffix) {
		"use strict";
		if (from) {
			from = from.replace(/[^\d\s,]/ig, '').trim();
		}
		to = to.replace(/[^\d\s,]/ig, '').trim();
		if (from && to) {
			return from + "-" + to + " " + suffix;
		} else if (from) {
			return from + "+ " + suffix;
		} else if (to) {
			return "0-" + to + " " + suffix;
		}
	},

	store_latest_real_estate_search : function (search_url) {
		"use strict";
		var o = {};
		o.url = search_url || document.URL;

		var subarea = $('.bootstrap-select .filter-option').text();
		var area = $('#searcharea_expanded :selected').text() +
			(subarea !== 'V\u00e4lj plats' ? ' (' + subarea + ')' : '');

		if (blocket.params.latest_search.category === "3080") {
			area = subarea !== 'V\u00e4lj plats' ? subarea : '';
		} else {
			area = $('#searcharea_expanded :selected').text() +
				(subarea !== 'V\u00e4lj plats' ? ' (' + subarea + ')' : '');
		}

		o.title = [
			area,
			$("#types input:checked").parent().text().trim(),
			blocket.apps.list.parse_numeric_range(
				$('#ps_3 :gt(0):selected').text(),
				$('#pe_3 :gt(0):selected').text(),
				'kr'
			),
			blocket.apps.list.parse_numeric_range(
				$('#ss_2 :gt(0):selected').text(),
				$('#se_2 :gt(0):selected').text(),
				'kvm'
			),
			blocket.apps.list.parse_numeric_range(
				$('#rooms_ros :gt(0):selected').text(),
				$('#rooms_roe :gt(0):selected').text(),
				'rum'
			),
			blocket.apps.list.parse_numeric_range(
				null,
				$("#max_monthly_fee_mre :gt(0):selected").text(),
				'kr/m&aring;n'
			)
		].filter(Boolean);

		localStorage.setItem("real_estate_search", JSON.stringify(o));
	},

	append_latest_real_estate_search : function () {
		"use strict";
		var o = localStorage.getItem("real_estate_search");
		if (o) {
			o = JSON.parse(o);
			$("#searchextras").append('<h4 class="latest_real_estate_search">Senaste s&ouml;kning: <a href="' + o.url + '">' + o.title.join(", ") + '</a></h4>');
		}
	},

	store_latest_search : function (search_url) {
		"use strict";
		if (Storage !== undefined && blocket.params.latest_search.enabled === "1" &&
				(blocket.params.latest_search.category !== "" || blocket.params.latest_search.search_query !== "") && $(".ads_not_found").length === 0) {
			var search_obj = {};
			if (search_url !== undefined) {
				search_obj.url = search_url;
			} else {
				search_obj.url = document.URL;
			}
			search_obj.time = new Date().getTime().toString().slice(0, -3);

			var thumbs = $(".item_image");
			if (thumbs.length > 0) {
				search_obj.thumb = thumbs[0].src;
			} else {
				search_obj.thumb =  blocket.params.latest_search.no_thumb_url;
			}
			if (blocket.params.latest_search.search_query !== "") {
				search_obj.title = blocket.params.latest_search.search_query;
			} else {
				search_obj.title = $(".search_column_heading span").text().trim();
			}

			var latest_search_array = [];
			if (localStorage.getItem(blocket.params.latest_search.local_storage_name) !== null) {
				blocket.apps.list.migrate_latest_search(); // Remove if date is after 2013-03-01
				latest_search_array = JSON.parse(localStorage.getItem(blocket.params.latest_search.local_storage_name));
			}

			var index_of_item = blocket.apps.common.index_of_object_in_array(search_obj, latest_search_array, "title");
			if (index_of_item === -1) {
				if (latest_search_array.unshift(search_obj) === blocket.params.latest_search.limit + 1) {
					latest_search_array.pop();
				}
			} else {
				// Existing search; Move element to top in array
				latest_search_array.splice(index_of_item, 1);
				latest_search_array.unshift(search_obj);
			}

			localStorage.setItem(blocket.params.latest_search.local_storage_name, JSON.stringify(latest_search_array));
		}
	},

	run_last_viewed : function () {
		"use strict";
		function remove_removed_ads_if_done(index) {
			if (index === prev_ad.length - 1) {
				blocket.apps.list.remove_items_from_localstorage(items_to_be_removed, prev_ad, "id");
			}
		}

		if (Storage !== undefined && localStorage.getItem(blocket.params.previous_ads.local_storage_name) !== null && blocket.params.previous_ads.enabled === "1") {

			var prev_ad = JSON.parse(localStorage.getItem(blocket.params.previous_ads.local_storage_name));
			var subject = "";
			if (prev_ad.length > 0) {

				var image_container = $("#last_viewed_image_container");
				var img_tmpl = $("#last_viewed_container .image_wrapper");

				$("#last_viewed_container").removeClass("hidden");

				var items_to_be_removed = [];
				var img_load_count = 0;

				$.each(prev_ad, function () {
					var that = this;
					var img_wrapper = img_tmpl.clone(true);
					var link = img_wrapper.find("a");
					var img = img_wrapper.find("img");

					if (this.subject !== "") {
						subject = this.subject.trim();
					}

					img_wrapper.removeClass("hidden");

					img_wrapper.attr({
						id : "prev_" + this.id
					});

					img.load(function () {
						blocket.apps.common.crop_image_to_fit_container(this, img_wrapper);
						remove_removed_ads_if_done(img_load_count);
						img_load_count++;
					});

					img.error(function () {
						items_to_be_removed.push(that);
						remove_removed_ads_if_done(img_load_count);
						img_load_count++;
					});

					img.attr({
						src : this.thumb
					});

					link.attr({
						href : this.url,
						title : subject
					});

					image_container.append(img_wrapper);
				});
			}
		}
	},

	migrate_latest_search : function () {
		"use strict";
		var latest_search_string = localStorage.getItem(blocket.params.latest_search.local_storage_name);

		if (latest_search_string.indexOf("&amp;" !== -1)) {
			latest_search_string = latest_search_string.replace(/&amp;/g, "&");
			localStorage.setItem(blocket.params.latest_search.local_storage_name, latest_search_string);
		}
	},

	remove_items_from_localstorage : function (items_to_be_removed, item_list, indentifier_name) {
		"use strict";
		if (items_to_be_removed.length > 0) {
			$.each(items_to_be_removed, function () {
				var i = blocket.apps.common.index_of_object_in_array(this, item_list, indentifier_name);
				$("#prev_" + this.id).remove();
				if (i !== -1) {
					item_list.splice(i, 1);
				}
			});
			localStorage.setItem("last_viewed_ads", JSON.stringify(item_list));
		}
	},
	last_viewed_off : function () {
		"use strict";
		if (Storage !== undefined) {
			var last_viewed_container = $("#last_viewed_container");

			if (localStorage.getItem(blocket.params.previous_ads.local_storage_name) !== null) {
				localStorage.removeItem(blocket.params.previous_ads.local_storage_name);
			}
			localStorage.setItem(blocket.params.previous_ads.local_storage_name + "_enabled", "false");
			last_viewed_container.addClass("hidden");
		}
	},
	last_viewed_on : function () {
		"use strict";
		localStorage.setItem(blocket.params.previous_ads.local_storage_name + "_enabled", "true");
	},
	update_search_column_groups : function (filter_groups) {
		"use strict";
		$(".search_column_group").each(function () {
			// Special case, go deeper
			if (this.id === 'group_properties') {
				$(this).children(".param_container").each(function () {
					$('ul', this).children(".search_param_item").each(function () {
						if ($.inArray(this.id, filter_groups) !== -1) {
							$(this).show();
						} else {
							$(this).hide();
						}
					});
				});
			}

			if ($.inArray(this.id.substr(6), filter_groups) !== -1) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
	},

	update_adwatch_link : function (qs) {
		"use strict";
		var $editform = $("#watch_edit_form");
		if ($editform.length > 0) {
			var action = $editform.attr("action");
			if (qs.indexOf('?') === 0 || qs.indexOf('&') === 0) {
				qs = qs.slice(1);
			}
			action = action.replace(/\?.+/, '?' + qs);
			$editform.attr("action", action);
		}
	},

	hide_from_mobile : function (class_or_id) {
		"use strict";
		var deviceAgent = navigator.userAgent.toLowerCase();
		var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
		if (agentID) {
			$(class_or_id).hide();
		}
	},

	remod_link_shelf : function () {
		"use strict";
		if ($(".renault_campaign").length > 0) {
			if ($(".renault_campaign").height() > $(".linkshelf").height()) {
				$(".linkshelf").css("height", $(".renault_campaign").height() + "px");
			}
		}
	},

	remod_space_for_linkshelf_banner : function () {
		"use strict";

		var banner = $("#inline_shelf");
		var banner_bg = $("#inline_shelf_bg_cover");
		var right_bar = $("#right_bar");
		var linkshelf = $(".linkshelf");
		var set_height;

		var run = 0;

		var doResize = function () {
			set_height = linkshelf.height() - banner.height() - 7;
			set_height = set_height + "px";
			set_height = set_height.replace("-", "");

			right_bar.css("margin-top", set_height);

			//banner.css("top", "-7px");

			banner_bg.css("top", "7px");
			banner_bg.css("height", banner.height() + "px");
			banner_bg.css("width", banner.width() + "px");
			banner_bg.show();
		};

		var set_timeout = function (pollTime) {
			setTimeout(local_go, pollTime);
		};

		var local_go = function () {

			if (banner.height() > linkshelf.height()) {
				doResize();
				run = 6;
			} else {
				if (run < 6) {
					set_timeout(1000);
					run++;
				}
			}
		};

		set_timeout(1000);
	},

	getUrlVars : function () {
		"use strict";
		var vars = [], hash;
		var hashes = window.location.search.slice(1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	},

	search_submit : function (evt) {
		"use strict";
		var form = $(this);
		var cg = form.find(":input:enabled[name='cg']").val();
		var wid = -1;

		if ($("#watch_edit_form").length > 0) {
			var vars = [], hash;
			var hashes = window.location.search.slice(1).split('&');
			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			if (vars.wid) {
				wid = vars.wid;
			}
		}
		if (parseInt(cg, 10) !== 1020) {
			// Remove cp if searching outside cg == 1020
			form.find(":input:[name='cp']").attr("disabled", "disabled");
		}
		if (cg === "9000") {
			// Blocket Jobb redirect
			var url = form.attr("data-job-url");
			url += "&" + form.find(":input:enabled[name='w']").serialize();
			url += "&" + form.find(":input:enabled[name='q']").serialize();
			if (wid >= 0) {
				url += "&wid=" + wid;
			}
			window.location.href = url;
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		}
	},

	row_click : function () {
		"use strict";
		blocket.$.mouseover(function () {
			$(this).find(".item_link").addClass("item_link_over");
		});
		blocket.$.mouseout(function () {
			$(this).find(".item_link").removeClass("item_link_over");
		});
		blocket.$.click(function (e) {
			if (e.target.href === undefined) {
				if (!e.metaKey) {
					if ($(this).hasClass("is_bostad")) {
						window.location = $(this).find(".desc .item_link").attr("href") + "&direct=1";
					} else {
						window.location = $(this).find(".desc .item_link").attr("href");
					}
					return false;
				}
			}
		});
	},
	enable_custom_stepping : function () {
		"use strict";
		blocket.$.on("click", function () {
			$.cookie("sq", $(this).attr("rel"), {path : "/", domain : document.domain}, "disable_encoding");
			$(document).location.href = $(this).attr("href");
			return false;
		});
	},
	enable_custom_stepping_manual : function (custom_href) {
		"use strict";
		var tmp_href = custom_href;
		tmp_href = tmp_href.indexOf('http://') !== -1 ? tmp_href.substring(tmp_href.indexOf('?') + 1, tmp_href.length) : tmp_href;
		tmp_href = tmp_href.substring(0, 1) === '&' ? tmp_href.substring(1, tmp_href.length - 1) : tmp_href;
		$.cookie("sq", tmp_href, {path : "/", domain : document.domain}, "disable_encoding");
		return true;
	},
	disable_filter_nohits : function (evt) {
		"use strict";
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	},
	select_param_link : function (evt) {
		"use strict";

		var $el = $(this);
		if (!$el.attr("href") || ($el.hasClass("disabled") && !$el.hasClass("selected_param"))) {
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		}

		$("#item_list").unmask();
		$("#item_list").mask("", 2000);

		var params = blocket.apps.list.update_param_links(this);
		blocket.apps.list.update_search_results(params, $(this), blocket.apps.list.new_json());

		// IE(6,7,8): Disable to reload content a second time in the hashchange event as it has already been loaded (see update_search_results in this func)
		hash_load_content = false;

		/* Sometimes we need to update input fields in the search box when filtering */
		var update_param = $el.parents(".search_filter").data("update-search");
		if (update_param) {
			var re = new RegExp("[?&]" + update_param + "=([^&]+)");
			var matches = $el.attr("href").match(re);
			if (matches) {
				var update_val = matches[1];
				$("[name=" + update_param + "]:enabled").val(update_val);
			}
		}
		return false;
	},

	select_param_drop : function (el) {
		"use strict";
		var params, re;
		if (navigator.userAgent.indexOf('MSIE 7') === -1) {
			$("#item_list").unmask();
			$("#item_list").mask("", 2000);

			params = $("#search_column").attr("data-params");

			// skip use of ca= and w= for utland
			var re_cg = new RegExp("cg=[0-9]+", "gi");
			var tmp_cg = params.match(re_cg) + "";
			tmp_cg = tmp_cg.replace("cg=", "");
			if (tmp_cg === "3080") {
				var re_skip = new RegExp("\\?ca=[0-9]+", "gi");
				params = params.replace(re_skip, '?');
				re_skip = new RegExp("&w=[0-9]+", "gi");
				params = params.replace(re_skip, '');
			}

			// remove selected param if present
			re = new RegExp("&" + $(this).attr('name') + "=[0-9]+", "gi");
			params = params.replace(re, '');
			if ($(this).val() !== "") {
				params += "&" + $(this).attr('name') + "=" + $(this).val();
				jQuery(el).addClass("selected_param");
			} else {
				jQuery(el).removeClass("selected_param");
			}

			// remove / append param on search column, sort & toggle-list/grid links
			var param = $(this).attr('name') + "=";
			var param2 = $(this).attr('name') + "=" + $(this).val();
			var param_val = $(this).val();

			// update href on search column links
			jQuery(".search_param_link, .adwatch_link").each(function () {
				var re = new RegExp("([&?])" + param + "([0-9]+|(&|$))");

				// replace old param, if present
				this.href = this.href.replace(re, '').replace(/&$/, '');

				// append new param
				if (param_val !== "") {
					this.href = this.href + "&" + param2;
				}
			});

			// update href on toggle list/grid links (top right corner)
			jQuery(".order_view_list_mode a").each(function () {
				var re = new RegExp("([&?])" + param + "([0-9]+|(&|$))");

				// replace old param, if present
				this.href = this.href.replace(re, '').replace(/&$/, '');

				// append new param
				if (param_val !== "") {
					this.href = this.href + "&" + param2;
				}
			});

			// update href on sort links (top right corner)
			jQuery(".order_view_sorting a").each(function () {
				var re = new RegExp("([&?])" + param + "([0-9]+|(&|$))");

				// replace old param, if present
				this.href = this.href.replace(re, '').replace(/&$/, '');

				// append new param
				if (param_val !== "") {
					this.href = this.href + "&" + param2;
				}
			});

			// add hidden field to search box to make this param hang on when user clicks the search button
			blocket.apps.list.append_drops_to_hidden_to_search(this);
			blocket.apps.list.update_search_results(params, $(this));

			// IE(6,7,8): Disable to reload content a second time in the
			// hashchange event as it has already been loaded (see
			// update_search_results in this func)
			hash_load_content = false;
		} else {
			// IE7
			params = window.location.search;

			// remove selected param if present
			re = new RegExp("&" + $(this).attr('name') + "=[0-9]+", "gi");
			params = params.replace(re, '');
			if ($(this).val() !== "") {
				// got value, add it
				params += "&" + $(this).attr('name') + "=" + $(this).val();
			}
			window.location.search = params;
			// remove / append param on search column, sort & toggle-list/grid links
			/*var param = $(this).attr('name') + "=";
			var param2 = $(this).attr('name') + "=" + $(this).val();
			var param_val = $(this).val();*/

		}
	},

	clean_param_string : function (params, exclude_keys) {
		"use strict";

		var splitted = params.split('&');
		var out = [];
		var found, i;

		for (i = 0; i < splitted.length; i++) {
			var key = splitted[i].replace(/^\s*/, "").replace(/\s*$/, "");
			found = false;

			if (exclude_keys !== undefined) {
				var j = 0;
				while (!found && j < exclude_keys.length) {
					if (key.match(new RegExp("^" + exclude_keys[j] + "=")) !== null) {
						found = true;
					}
					j++;
				}
			}

			if (!found) {
				out.push(key);
			}
		}
		return out.join('&');
	},

	append_drops_to_hidden_to_search : function (el) {
		"use strict";
		// add hidden field to search box to make this param hang on when user clicks the search button
		var hidden = jQuery("#search_form input[name='" + $(el).attr('name') + "']");
		if (hidden.length) {
			hidden.remove();
		}
		blocket.apps.list.add_hidden_field(null, $(el));
	},

	update_search_results : function (params, objthis, opt_skip) {
		"use strict";

		params = blocket.apps.list.clean_param_string(params);
		params = params.replace(/^&/, '?');
		params = params.replace(/&o=[0-9]*/, '');

		// receiver (paging) assumes prefixing ampersand
		var json_url = "/li/list_update.json" + (params.indexOf('?&') === -1 ? params.replace('?', '?&') : params);

		// when no gr or gr=1 AND .grid is missing, force gr=0 because grid is not allowed in this view
		if (((json_url.indexOf('&gr=') === -1 || json_url.indexOf('&gr=1') > -1) &&
				jQuery(".grid, .ads_not_found").length === 0) && jQuery(".jlist, .ads_not_found").length !== 0) {
			if (json_url.indexOf('&gr=') === -1) {
				json_url = json_url + "&gr=0";
			} else if (json_url.indexOf('&gr=1') > -1) {
				json_url = json_url.replace('&gr=1', '&gr=0');
			}
		}

		var latest_search_url; // leave undefined
		// if no cg is set in window.location.href (when friendly URL is used).
		if (window.location.href.indexOf('cg=') === -1) {
			var curr_cat = $("#catgroup option:selected").val();
			if (curr_cat !== undefined) {
				json_url = json_url + '&cg=' + $("#catgroup option:selected").val();
				// construct new url when friendly url is used
				var path_arr = window.location.href.split('/');
				var latest_search_params = params.replace(/[^=&]+=(&|$)/g, "").replace(/&$/, "");
				latest_search_url = path_arr[0] + '//' + path_arr[2] + '/li' + latest_search_params;
			}
		}

		$.ajax({
			url : json_url,
			dataType : "json",
			success : function (data) {
				blocket.apps.list.replace_search_results(data, objthis);

				if (data.address !== undefined) {
					// Bostad, use friendly URL
					if (history.replaceState) {
						history.replaceState(null, null, blocket.tools.base64.decode(data.address));
						if (data.qs !== undefined) {
							blocket.apps.list.update_adwatch_link(blocket.tools.base64.decode(data.qs));
						}
					} else {
						if (data.qs !== undefined) {
							window.location.hash = '#' + blocket.tools.base64.decode(data.qs);
						}
					}
				} else {
					// Not bostad.
					blocket.apps.list.update_adwatch_link(params);
				}

				if (opt_skip === undefined || opt_skip === false) {
					if (history.replaceState) {
						history.replaceState(null, null, params);
					} else {
						window.location.hash = '#' + params.substring(1);
					}
				}

				blocket(".search_param_link").apps.list.enable_custom_stepping_manual(window.location.href.substring(0, window.location.href.indexOf("?")) + params);

				// the search box has been replaced, so we need to recreate the hidden fields.
				if (jQuery("#search_column").length) {
					blocket.apps.list.create_hidden_search_fields();
				}
				$("#item_list").unmask();

				blocket.apps.list.store_latest_real_estate_search();
				blocket.apps.list.store_latest_search(latest_search_url);
				blocket.apps.list.run_latest_search();
			},
			error : function (jq_xhr, text_status, error_thrown) {
				console.log(jq_xhr.responseText);
				console.log(error_thrown);
				$("#item_list").unmask();
			}
		});

		// BMW campaign. Throws exception and break things if not found...
		try {
			if (blocket.params.campaign.bmw_premium.camp_id !== undefined && params.match('cp=1')) {
				$.ajax({
					url : blocket.params.campaign.bmw_premium.camp_id
				});
			}
		} catch (e) {}

		$("#search_column").attr("data-params", params);
		return false;
	},

	add_hidden_field : function (index, el) {
		"use strict";
		var names = [];
		var values = [];
		var i;
		if (jQuery(el).attr("name")) {
			names.push(jQuery(el).attr("name"));
			values.push(jQuery(el).val());
		} else {
			var tmp_name = jQuery(el).attr("data-param").toString();
			var tmp_value = jQuery(el).attr("data-val").toString();

			if (tmp_name.indexOf('|') > -1 &&
				tmp_value.indexOf('|') > -1 &&
				tmp_value.indexOf('|') === tmp_name.indexOf('|')) {

				names = tmp_name.split('|');
				values = tmp_value.split('|');
			} else {
				names.push(tmp_name);
				values.push(tmp_value);
			}
		}
		var isBostad = jQuery("#search_form").hasClass("root_cat_3000");
		for (i = 0; i < names.length; i++) {
			if (!(isBostad && (names[i] === "as" || names[i] === "m"))) {
				$("#search_form input[type=hidden][name=" + names[i] + "][value=" + values[i] + "]").remove();
				$("#search_form").append('<input type="hidden" name="' + names[i] + '" value="' + values[i] + '">');
			}
		}
	},

	create_hidden_search_fields : function () {
		"use strict";

		// hidden search fields for lists
		jQuery("#search_column .selected_param").each(blocket.apps.list.add_hidden_field);

		// hidden search fields for drops
		// add hidden field to search box to make this param hang on when user clicks the search button
		$('#search_column select').each(function (i, selected) {
			$('option:selected', selected).each(function (x, selected2) {
				if ($(selected2).val() !== "") {
					$("#search_form").append('<input type="hidden" name="' + $(selected).attr('name') + '" value="' + $(selected2).val() + '">');
				}
			});
		});
	},

	show_more_items : function () {
		"use strict";
		jQuery(this).closest(".param_container").find(".additional_values").show(100);
		jQuery(this).html("F\u00e4rre");
		jQuery(this).one("click", blocket.apps.list.show_fewer_items);
		return false;
	},

	show_fewer_items : function () {
		"use strict";
		jQuery(this).closest(".param_container").find(".additional_values").hide(100);
		jQuery(this).html("Fler");
		jQuery(this).one("click", blocket.apps.list.show_more_items);
		return false;
	},

	replace_search_results : function (data, objthis) {
		"use strict";
		var searchtext = $("#searchtext").val();

		// refresh triple banner url
		if (objthis.attr("data-param") !== "" && objthis.attr("data-val") !== "") {

			// get current source
			var iframe_bostad = $("#triple_banner_bostad").attr("src") !== undefined ? $("#triple_banner_bostad").attr("src") : '';
			var iframe_jobb = $("#triple_banner_jobb").attr("src") !== undefined ? $("#triple_banner_jobb").attr("src") : '';
			var iframe_shopping = $("#eframe_list_large_puff").attr("src") !== undefined ? $("#eframe_list_large_puff").attr("src") : '';

			// define allowed qs
			var allowed_qs_bostad = ["f", "ca", "base_parent", "st", "co", "cg", "c", "ct", "cb", "q", "parent", "category", "price", "parent_appl", "w", "m", "as", "r"];
			var allowed_qs_jobb = [];
			allowed_qs_jobb.m = "m";
			allowed_qs_jobb.r = "r";
			allowed_qs_jobb.w = "jw";
			allowed_qs_jobb.ca = "jca";
			allowed_qs_jobb.cg = "jcg";
			allowed_qs_jobb.c = "jc";
			allowed_qs_jobb.ct = "jct";
			allowed_qs_jobb.cb = "jcb";
			allowed_qs_jobb.q_raw = "jq";
			allowed_qs_jobb.parent = "jparent";
			allowed_qs_jobb.category = "jcg";
			allowed_qs_jobb.price = "jprice";
			allowed_qs_jobb.appl = "jparent_appl";

			var allowed_qs_shopping = [];
			allowed_qs_shopping.ca = "ca";
			allowed_qs_shopping.q_raw = "q";
			allowed_qs_shopping.cs = "cs";
			allowed_qs_shopping.co = "co";
			allowed_qs_shopping.all = "c";

			// check whether to add or remove param
			var regex;

			// BOSTAD
			if ($.inArray(objthis.attr("data-param"), allowed_qs_bostad) !== -1) {
				if ($("#triple_banner_bostad").length > 0) {
					var qs_bostad = objthis.attr("data-param") + "=" + objthis.attr("data-val");
					if (iframe_bostad.indexOf(qs_bostad) !== -1) {
						// remove
						regex = new RegExp("(&|\\?)" + qs_bostad, "g");
						iframe_bostad = iframe_bostad.replace(regex, "");
					} else {
						// remove as if current param is m
						if (objthis.attr("data-param") === "m") {
							regex = new RegExp("(&|\\?)as=([0-9_]{0,6})", "g");
							iframe_bostad = iframe_bostad.replace(regex, "");
						} else if (objthis.attr("data-param") === "as") {
							regex = new RegExp("(&|\\?)m=([0-9]{0,3})", "g");
							iframe_bostad = iframe_bostad.replace(regex, "");
						}
						// append
						iframe_bostad = iframe_bostad + "&" + qs_bostad;
					}

					// refresh triple banner url
					$("#triple_banner_bostad").attr("src", iframe_bostad);
				}
			}

			// JOBB
			if (allowed_qs_jobb[objthis.attr("data-param")] !== undefined) {
				if ($("#triple_banner_jobb").length > 0) {
					var qs_jobb = allowed_qs_jobb[objthis.attr("data-param")] + "=" + objthis.attr("data-val");
					if (iframe_jobb.indexOf(qs_jobb) !== -1) {
						// remove
						regex = new RegExp("(&|\\?)" + qs_jobb, "g");
						iframe_jobb = iframe_jobb.replace(regex, "");
					} else {
						// append
						iframe_jobb = iframe_jobb + "&" + qs_jobb;
					}

					// refresh triple banner url
					$("#triple_banner_jobb").attr("src", iframe_jobb);
				}
			}

			// SHOPPING
			if (allowed_qs_shopping[objthis.attr("data-param")] !== undefined) {
				if ($("#eframe_list_large_puff").length > 0) {
					var qs_shopping = allowed_qs_shopping[objthis.attr("data-param")] + "=" + objthis.attr("data-val");
					if (iframe_shopping.indexOf(qs_shopping) !== -1) {
						// remove
						regex = new RegExp("(&|\\?)" + qs_shopping, "g");
						iframe_shopping = iframe_shopping.replace(regex, "");
					} else {
						// append
						iframe_shopping = iframe_shopping + "&" + qs_shopping;
					}

					// refresh triple banner url
					$("#eframe_list_large_puff").attr("src", iframe_shopping);
				}
			}
		}

		if (data.office_space_url !== undefined) {
			var office_space_url = blocket.tools.base64.decode(data.office_space_url);

			var office_space_iframe = document.getElementById("office_space_list");
			if (office_space_iframe) {
				//add the new src only to iframes that are already loaded
				$(office_space_iframe).attr({ src : office_space_url});
			}
		}

		if (data.banner_bottom_url !== undefined) {
			var banner_bottom_url = blocket.tools.base64.decode(data.banner_bottom_url);
			var banner_bottom_target = blocket.tools.base64.decode(data.banner_bottom_target);

			var ehandel_iframe = document.getElementById("ehandel_iframe");
			if (ehandel_iframe && ehandel_iframe.style.height) {
				//add the new src only to iframes that are already loaded
				$(ehandel_iframe).attr({ src : banner_bottom_url, longdesc : banner_bottom_url, vertical_target : banner_bottom_target});
			} else {
				$(ehandel_iframe).attr({ longdesc : banner_bottom_url, vertical_target : banner_bottom_target});
			}
			if (ehandel_iframe) {
				$("#ehandel_eas_iframe").toggleClass("hidden", banner_bottom_target !== "shopping");
			}
		}

		if (data.item_list !== undefined) {
			var item_list_html = blocket.tools.base64.decode(data.item_list);
			jQuery("#item_list").replaceWith(item_list_html);
		}

		if (data.level_selector !== undefined) {
			var level_html = blocket.tools.base64.decode(data.level_selector);
			jQuery(".level_selector:parent").remove();
			var level_groups = jQuery(level_html);
			level_groups.insertAfter(jQuery(".search_column_heading"));
		}

		// Bostad, use new JSON response
		if (blocket.apps.list.new_json() && data.search_column !== undefined && data.search_column !== false) {
			var keys = [];
			for (var key in data.search_column) {
				if (data.search_column.hasOwnProperty(key)) {
					var obj = data.search_column[key];
					keys.push(key);
					for (var k in obj) {
						if (obj.hasOwnProperty(k)) {
							if (key === "properties") {
								keys.push(k);
							}
							var count = (obj[k].count !== undefined) ? obj[k].count : false;
							var href = (obj[k].link !== undefined) ? obj[k].link : false;
							// Update href
							if (href !== false) {
								$('#' + k + ' a.search_param_link').attr('href', blocket.tools.base64.decode(href));
							}
							// Update counter
							var hits = parseInt(count, 10);
							var is_disabled = $("#" + k + " > .param_wrapper > .disabled").length;
							var is_selected = $("#" + k + " > .param_wrapper.selected_menu_item").length;
							var link = $("#" + k).find(".search_param_link").first();
							var is_wid = (window.location.search !== undefined && window.location.search.indexOf('wid=') > -1) ? true : false;
							if (link.hasClass("static")) {
								//console.log("found static counter: "+ k);
							} else {
								if (!hits) {
									$("#" + k).addClass("no_hits");
								} else {
									$("#" + k).removeClass("no_hits");
								}
								if (!hits && is_selected) {
									link.find(".search_column_hits").empty();
								} else if (!hits && !is_disabled) {
									if (!link.hasClass("ignore_disable") && !is_wid) {
										link.removeClass("selected_param").addClass("disabled");
									}
								}
								else if (hits > 0 && is_disabled) {
									link.removeClass("disabled").addClass("search_param_link");
									if (link.hasClass("selected_param")) {
										link.parent().append(link.clone(true).html('<img src="/img/transparent.gif" class="close_button sprite_list_menu_close"/>'));
										link.parent().addClass("selected_menu_item");
										link.addClass("close_button_container");
									}
								}
								if (count !== false) {
									if (hits > 0) {
										jQuery("#count_" + k).html(",&nbsp;" + count);
									} else {
										jQuery("#count_" + k).html("");
									}
								}
								else {
									jQuery("#count_" + k).text("");
								}
							}
						}
					}
				}
			}
			if (keys.length) {
				blocket.apps.list.update_search_column_groups(keys);
			}
		}

		if (data.back !== undefined) {
			var beach_ball = blocket.tools.base64.decode(data.back);
			$('.heading_back_link').attr('href', beach_ball);
		}

		if (data.gallery !== undefined) {
			var gallery_html = blocket.tools.base64.decode(data.gallery);
			jQuery("#gallery_container").replaceWith(gallery_html);
		}

		if (data.list_footer !== undefined) {
			var footer_html = blocket.tools.base64.decode(data.list_footer);
			jQuery("#list_footer").replaceWith(footer_html);
		}

		if (data.breadcrumbs !== undefined) {
			var bread_html = blocket.tools.base64.decode(data.breadcrumbs);
			jQuery(".breadcrumb_top_container").replaceWith(bread_html);
		}

		if (data.top_items !== undefined) {
			var top_html = blocket.tools.base64.decode(data.top_items);
			jQuery(".top_items").replaceWith(top_html);
		}

		if (!blocket.apps.list.new_json() && data.filter_groups !== undefined) {
			blocket.apps.list.update_search_column_groups(data.filter_groups);
		}

		// Bostad: is this used at all?!
		/*
		try {
			// reload Veckans bostad
			if (EAo !== undefined && data.lkf !== undefined) {
				EAparams = data.lkf.split(',');
				for (var it = 0; it < EAparams.length; it++) {
					EAparams[it] = EAparams[it].substr(0, 4);
				}
				EAo.load('#ea_container');
			}
		} catch (err) {
			//do nuffin
		}
		*/

		// restore the contents of the search box
		$("#searchtext").val(searchtext);
		if (data.tracking !== undefined) {
			jQuery("body").append(blocket.tools.base64.decode(data.tracking));
		}

		if (data.num_hits_total !== undefined) {
			// set dynamic visibility on breadcrumb
			if (data.num_hits_total > 0) {
				jQuery(".list_filtering").removeClass("hidden");
			} else {
				jQuery(".list_filtering").addClass("hidden");
				jQuery("#right_bar").remove();
			}

			// update box title
			jQuery(".num_hits").html(data.num_hits_total);
			jQuery(".type_active").show();

		} else {
			jQuery(".type_active").hide();
		}

		if (!blocket.apps.list.new_json()) {

			var counters = [];
			if (data.counters !== undefined) {
				counters = data.counters;
			}

			$(".search_param_item").each(function () {

				var hits = parseInt(counters[this.id], 10);
				var is_disabled = $("#" + this.id + " > .param_wrapper > .disabled").length;
				var is_selected = $("#" + this.id + " > .param_wrapper.selected_menu_item").length;
				var link = $("#" + this.id).find(".search_param_link").first();
				var is_wid = (window.location.search !== undefined && window.location.search.indexOf('wid=') > -1) ? true : false;

				if ($(objthis).hasClass("static") && link.hasClass("static")) {
					//console.log("STATIC");
				} else {
					if (!hits) {
						$("#" + this.id).addClass("no_hits");
					} else {
						$("#" + this.id).removeClass("no_hits");
					}

					if (!hits && is_selected) {
						link.find(".search_column_hits").empty();
					} else if (!hits && !is_disabled) {
						if (!link.hasClass("ignore_disable") && !is_wid) {
							link.removeClass("selected_param").addClass("disabled");
						}
					} else if (hits > 0 && is_disabled) {
						link.removeClass("disabled").addClass("search_param_link");

						if (link.hasClass("selected_param")) {
							link.parent().append(link.clone(true).html('<img src="/img/transparent.gif" class="close_button sprite_list_menu_close"/>'));
							link.parent().addClass("selected_menu_item");
							link.addClass("close_button_container");
						}
					}

					if (counters[this.id] !== undefined) {
						if (hits > 0) {
							jQuery("#count_" + this.id).html(",&nbsp;" + counters[this.id]);
						} else {
							jQuery("#count_" + this.id).html("");
						}
					} else {
						jQuery("#count_" + this.id).text("");
					}
				}
			});
		}
	},

	update_param_links : function (el, opt_selected) {
		"use strict";

		var selected = opt_selected !== undefined ? opt_selected : jQuery(el).parents(".selected_menu_item").length;
		var empty_re;

		// NOTE: when # exists on init, params is undefined for some reason but there is no time to fix this now as it's not even neccessary for an init run // Richard Lagerstr\u00f6m
		var params = jQuery("#search_column").attr("data-params");
		params = blocket.apps.list.clean_param_string(params);

		// NOTE: try/catch allows init with #, and an undefined params var to run successfully without breaking the script
		try {
			if (jQuery(el).attr("data-param").toString().indexOf('|') === -1) {
				empty_re = new RegExp("([&?])" + jQuery(el).attr("data-param").toString() + "=(&|$)", "g");
				params = params.replace(empty_re, "$1");
			} else {
				var tmp_params = jQuery(el).attr("data-param").toString().split('|');
				empty_re = null;
				for (var i = 0; i < tmp_params.length; i++) {
					empty_re = new RegExp("([&?])" + tmp_params[i].toString() + "=(&|$)", "g");
					params = params.replace(empty_re, "$1");
				}
			}
		} catch (eee) {}

		if (selected) {
			return blocket.apps.list.set_param_deselected(el, params);
		} else {
			return blocket.apps.list.set_param_selected(el, params);
		}
	},

	set_param_selected : function (el, params) {
		"use strict";
		var tmp_param = [];
		var elem = jQuery(el);
		if (elem.attr("data-param").toString().indexOf('|') === -1) {
			tmp_param[tmp_param.length] = elem.attr("data-param") + "=" + elem.attr("data-val");
		} else {
			var tmp_arr = elem.attr("data-param").toString().split('|');
			var tmp_arr2 = elem.attr("data-val").toString().split('|');
			for (var i = 0; i < tmp_arr.length; i++) {
				tmp_param[tmp_param.length] = tmp_arr[i] + "=" + tmp_arr2[i];
			}
		}

		elem.addClass("selected_param");
		elem.parent().append(elem.clone(true).html('<img src="/img/transparent.gif" class="close_button sprite_list_menu_close" alt="">'));
		elem.parent().addClass("selected_menu_item");
		elem.parent().find("a").last().addClass("close_button_container");

		var set_param_selected_helper = function () {
			if (jQuery(this).parent("#" + elem.parents('.search_param_item').attr('id')).length === 0 && jQuery(this).parents('.search_param_item').find(".selected_param").length === 0) {
				jQuery(this).addClass("hidden");
				jQuery(this).removeClass("hide_on_next_change");
			}
		};

		var set_param_selected_helper2 = function () {
			if ($(this).hasClass("heading_back_link") && elem.parents(".forget_on_beach_ball").length !== 0) {
				return;
			}

			// Special case when param is cp and we build link url for the badboll.
			// Backing down to category 1020 should not keep cp param, unless a search for /bmw/i is made.
			if ($(this).hasClass("heading_back_link") && arr[0] === 'cp') {
				var filters = jQuery("#search_column").attr("data-filter_groups").toString().split(",");
				var searched = jQuery("#searchtext").val().match(/bmw/i);
				for (var i = 0; i < filters.length; i++) {
					if (filters[i] === 'car_models' && searched === null) {
						return;
					}
				}
			}

			var is_parent_of = $(this).parents().filter(elem.parents(".search_param_item").eq(0)).length;
			var is_child_of = elem.parents().filter($(this).parents(".search_param_item").eq(0)).length;
			var re;

			if (this !== el && !is_parent_of && !is_child_of) {
				this.href = this.href + "&" + param;
			} else {
				re = new RegExp("([&?])" + param + "(&|$)");
				this.href = this.href.replace(re, '$1').replace(/&$/, '');
			}

			if (window.location.search.indexOf('f=') !== -1) {
				re = new RegExp("([&?])f=a(&|$)");
				this.href = this.href.replace(re, '$1').replace(/&$/, '');
			}
		};
		var set_param_selected_helper3 = function () {
			this.href = this.href + "&" + param;
		};
		var set_param_selected_helper4 = function () {
			params = blocket.apps.list.set_param_deselected(this, params);
		};
		var set_param_selected_helper5 = function () {
			this.href = this.href.replace(re, "$1");
		};

		// iterate all params
		for (var z = 0; z < tmp_param.length; z++) {

			var param = tmp_param[z].toString();
			var arr = param.split('=');
			var data_param = arr[0];
			var data_val = (arr[1] !== undefined ? arr[1] : "");

			if (params.indexOf(param) === -1) {
				params += "&" + param;
			}

			jQuery(".hide_on_next_change").each(set_param_selected_helper);

			if (!blocket.apps.list.new_json()) {

				// update href on search column links
				jQuery(".search_param_link, .adwatch_link, .heading_back_link").each(set_param_selected_helper2);

			}

			// update href on toggle list/grid links (top right corner)
			jQuery(".order_view_list_mode a").each(set_param_selected_helper3);

			// update href on sort links (top right corner)
			jQuery(".order_view_sorting a").each(set_param_selected_helper3);

			var paren = el.parentNode;
			var hidden = jQuery("#search_form input[name='" + data_param + "'][value='" + data_val + "']");
			if (hidden.length) {
				hidden.removeAttr("disabled");
			} else {
				blocket.apps.list.add_hidden_field(null, el);
			}

			// If member of a subgroup
			if (jQuery(paren).parents(".search_param_subgroup").siblings(".selected_menu_item").length > 0) {
				// deselect subgroup parent (owner)
				params = blocket.apps.list.set_param_deselected(jQuery(paren).parents(".search_param_subgroup").siblings(".selected_menu_item").children(".search_param_link").get(0), params);
			} else if (jQuery(paren.parentNode).find(".search_param_subgroup").length > 0) {
				// Parent to a subgroup
				if (jQuery(paren.parentNode).find(".search_param_subgroup").find(".selected_param").length) {
					jQuery(paren.parentNode).find(".search_param_subgroup").find(".selected_param:first-child").each(set_param_selected_helper4);
				} else if (!blocket.apps.list.new_json()) {
					var re = new RegExp("&" + param + "(&|$)");
					jQuery(paren).find(".search_param_subgroup").find(".search_param_link").each(set_param_selected_helper5);
				}
			}
			// If member of a subgroup
		}
		return params;
	},

	set_param_deselected : function (el, params) {
		"use strict";

		var tmp_param = [];

		var tmp_names = [];
		var tmp_values = [];
		var i;

		if (jQuery(el).attr("data-param").toString().indexOf('|') === -1) {
			var tmp_name = jQuery(el).attr("data-param");
			var tmp_value = jQuery(el).attr("data-val");
			tmp_param.push(tmp_name + "=" + tmp_value);

			if (tmp_name) {
				tmp_names.push(tmp_name);
			}
			if (tmp_value) {
				tmp_values.push(tmp_value);
			}
		} else {
			tmp_names = jQuery(el).attr("data-param").toString().split('|');
			tmp_values = jQuery(el).attr("data-val").toString().split('|');
			for (i = 0; i < tmp_names.length; i++) {
				tmp_param[i] = tmp_names[i] + "=" + tmp_values[i];
			}
		}

		var set_param_deselected_helper = function () {
			if (this !== textElem) {
				this.href = this.href.replace(re, "$1");
				this.href = this.href.replace(re_un, "$1");
			} else {
				this.href = this.href + " & " + param;
			}
		};
		var set_param_deselected_helper2 = function () {
			this.href = this.href.replace(re, "$1");
			this.href = this.href.replace(re_un, "$1");
		};

		// iterate all params
		for (var z = 0; z < tmp_param.length; z++) {

			var param = tmp_param[z].toString();
			var arr = param.split('=');
			var data_param = arr[0];
			var data_val = (arr[1] !== undefined ? arr[1] : "");

			param = data_param + "=" + data_val;
			var param_unescaped = data_param + "=" + unescape(data_val);
			var re = new RegExp("&" + param + "(&|$)");
			var re_un = new RegExp("&" + param_unescaped + "(&|$)");

			params = params.replace(re, "$1");

			//get the element that is text, and not the x icon
			var textElem = jQuery(el.parentNode).find(".selected_param").eq(0).get(0);

			if (!blocket.apps.list.new_json()) {
				// update href on search column links and back link
				jQuery(".search_param_link").each(set_param_deselected_helper);
				jQuery(".heading_back_link").each(set_param_deselected_helper2);
			}

			jQuery(".adwatch_link").each(set_param_deselected_helper2);

			// update href on toggle list/grid links (top right corner)
			jQuery(".order_view_list_mode a").each(set_param_deselected_helper2);

			// update href on sort links (top right corner)
			jQuery(".order_view_sorting a").each(set_param_deselected_helper2);

			//remove the x icon
			jQuery(textElem).parent().find(".selected_param").eq(1).remove();

			jQuery(textElem).parent().removeClass("selected_menu_item");
			jQuery(textElem).removeClass("selected_param");

			if (tmp_names.length === tmp_values.length) {
				for (i = 0; i < tmp_names.length; i++) {
					jQuery("#search_form input[name='" + tmp_names[i] + "'][value='" + tmp_values[i] + "']").attr("disabled", true);
				}
			}
		}
		return params;
	},

	get_qs_diff : function (old_qs, new_qs) {
		"use strict";
		var ret = [];
		ret.added = [];
		ret.subtracted = [];
		var arro = [];
		var arrn = [];
		var i;
		var re;
		if (old_qs) {
			arro = old_qs.replace('?', '').split('&');
		}
		if (new_qs) {
			arrn = new_qs.replace('?', '').split('&');
		}

		// compare which params differate in new qs compared to old
		// check for subtracted vars (back button)
		for (i in arro) {
			if (arro.hasOwnProperty(i)) {
				re = new RegExp("(^|&)" + arro[i] + "($|&)", "");
				if (new_qs.replace('?', '').search(re) === -1) {
					ret.subtracted[ret.subtracted.length] = arro[i];
				}
			}
		}

		// check for added vars (forward button)
		for (i in arrn) {
			if (arrn.hasOwnProperty(i)) {
				re = new RegExp("(^|&)" + arrn[i] + "($|&)", "");
				if (old_qs.replace('?', '').search(re) === -1) {
					ret.added[ret.added.length] = arrn[i];
				}
			}
		}

		return ret;
	},
	redirect_via_xiti : function (e) {
		"use strict";
		e.preventDefault();
		e.stopPropagation();
		top.location.href = "" + $(this).attr('rel') + $(this).attr('href');
	},
	spawn_xiti_iframe : function () {
		"use strict";

		if (!$(this).hasClass("selected_param")) {
			return;
		}

		var xiti_atc = $(this).attr("data-xiti-atc");

		if (xiti_atc === undefined) {
			return;
		}

		var xiti_url = '/xiti_iframe_click.html?xiti_atc=' + xiti_atc;
		var xitiIframe = document.createElement("iframe");
		xitiIframe.src = xiti_url;
		xitiIframe.width = '0';
		xitiIframe.height = '0';
		xitiIframe.scrolling = 'no';
		xitiIframe.marginheight = '0';
		xitiIframe.marginwidth = '0';
		xitiIframe.frameborder = '0';
		xitiIframe.style = 'visibility:hidden;display:none';
		document.getElementById('xiti_click_iframe_target').appendChild(xitiIframe);
	},
	bind_popover_triggers : function (start_element) {
		"use strict";

		if (start_element === undefined || start_element === null) {
			start_element = $("#blocket");
		}

		var trigger_class = ".sprite_li_information, .pop_trigger",
			pop_triggers = start_element.find(trigger_class);

		var events = {
			cmc_info : 'cmc_info_popup_shown'
		};

		$(".li_popover_content").hide();

		var hidePopovers = function (triggers) {
			triggers.each(function () {
				if ($(this).data('popover').tip().is(":visible")) {
					$(this).popover('hide');
					$(this).unbind('.popover_close');
				}
			});
			$(document).add("select").unbind('.popover_close');
		};

		$(pop_triggers).each(function () {
			var popover_content_id = $(this).attr("data-popover-id");
			var elem = $("#" + popover_content_id);
			$(this).popover({
				content : elem.html(),
				trigger : 'click',
				placement : elem.attr("data-placement"),
				template : '<div class="popover"><div class="popover_close">st\u00e4ng</div><div class="arrow"></div><div class="popover-content"></div></div>',
				html : true
			});
		});

		$(pop_triggers).bind("show", function () {
			if ($(this).attr('id') !== "" && events[$(this).attr('id')] !== undefined) {
				blocket.apps.li.events.send_event(events[$(this).attr('id')]);
			}
			hidePopovers($(trigger_class));
		});

		$(pop_triggers).bind("shown", function () {
			start_element.find(".popover .popover_close").add(document).unbind('.popover_close');

			start_element.find(".popover .popover_close").bind('click.popover_close', function () {
				hidePopovers($(trigger_class));
			});

			start_element.find("select").not(".content select").bind("focus.popover_close", function () {
				hidePopovers($(trigger_class));
			});

			$(document).bind('keyup.popover_close', function (e) {
				if (e.keyCode === 27) {
					hidePopovers($(trigger_class));
				}
			});

			$(document).bind('click.popover_close', function (e) {
				if ($(e.target).hasClass("sprite_li_information") || $(e.target).hasClass("pop_trigger")) {
					return;
				}

				var popover = $(".popover"),
					child = $(popover).has(e.target);

				if (child[0] === undefined && e.target !== popover[0]) {
					hidePopovers($(trigger_class));
				}
			});
		});
	}
});

var is_init = true;		// limits stuff to be loaded only once
blocket("@init.list.self").extend(function () {
	"use strict";

	//Truncate breadcrumb
	blocket.tools.breadcrumb_truncator();

	$('a.xiti_link').click(blocket.apps.list.redirect_via_xiti);

	// Handle job category redirect on search
	$("#search_form").submit(blocket.apps.list.search_submit);

	// Truncate news if they're too long
	blocket.apps.news.truncate();

	// Expand and collapse store body
	var $store_body = $("#store_body");
	$store_body.css("max-height", $(".content_right").height() - $(".store_inner_head").height() - $(".store_tagline").height());

	if ($store_body.length > 0 && $store_body.height() === parseInt($store_body.css("max-height").split("px")[0], 10)) {
		$("#store_expand_collapse_link_container").removeClass("hidden");
		blocket("#store_expand_collapse_link").apps.stores.store_expand_description();
	}

	// Enable custom stepping for "Next" button in VI that needs the new qs vars st (sell type: h/s/u etc) and sb (sold by: b(broker)/p/(private))
	blocket(".custom_stepping").apps.list.enable_custom_stepping();

	if (navigator.userAgent.indexOf('MSIE 7') === -1) {
		jQuery(".search_param_link:not(.noajax)").on("click", blocket.apps.list.select_param_link);

		// Count clicks in the search column which case a param to become selected
		jQuery(".search_param_link:not(.selected_param,.disabled,.noajax)").on("click", function () {
			var click_name = $($(this).parents('.search_column_group').find('.param_title').get(0)).data("title") + "_" + $('#search_column').data("level");
			click_name = click_name.toLocaleLowerCase().replace(' ', '_', 'g').replace(/[\u00e5\u00e4]/g, 'a').replace(/\u00f6/g, 'o');
			xt_med('C', xtn2, click_name, 'A');
			if (navigator.userAgent.indexOf('MSIE 7') === -1 || $(this).hasClass('noajax')) {
				return true;
			} else {
				return false;
			}
		});
	}
	jQuery("#search_column .search_param_item a.disabled").on("click", blocket.apps.list.disable_filter_nohits);
	jQuery("#search_column select").bind("change", blocket.apps.list.select_param_drop);

	if ($("#letsdeal.searchbox_mini_v2").length > 0) {
		var letsdeal_header_text = $(".searchbox_mini_v2").find(".whitelink");
		if (letsdeal_header_text.width() > ($(".searchbox_mini_v2").width() - 10)) {
			var k = letsdeal_header_text.html();

			letsdeal_header_text.html("");
			var str = "";

			for (var i = 0; i < k.length; i++) {
				str = k.substring(0, i);

				letsdeal_header_text.html(str + "...");
				if (letsdeal_header_text.width() >= ($(".searchbox_mini_v2").width() - 20)) {
					break;
				}
			}
		}
	}

	if ($("#searchextras").length) {
		$("#catgroup").bind("change", function () {
			blocket.apps.searchbox.SearchCrit(false);
		});
	} else {
		$("#catgroup").bind("change", function () {
			$('.set_hidden').attr('disabled', true);
		});
	}

	/* When changing from city to region, or from all of sweden/neighbouring
	 * regions to the home region, clear all of the hidden munic/subarea/region
	 * fields, so that a search will search the whole region
	 */
	$("#search_form .search_where").bind("change", function () {
		var val = $(this).val();
		var prev_val = $(this).data("prev-val");
		if (!prev_val) {
			prev_val = blocket.common.queryString("w");
		}
		if (val === prev_val) {
			return;
		}

		$("#search_form input[type=hidden][name=m], #search_form input[type=hidden][name=as]").attr("disabled", true);
		$("#search_form input[type=hidden][name=r]").attr("disabled", true);

		$(this).data("prev-val", val);
	});

	jQuery(".show_more_items").not(".expanded_list .show_more_items").one("click", blocket.apps.list.show_more_items);
	jQuery(".expanded_list .show_more_items").one("click", blocket.apps.list.show_fewer_items);

	if (jQuery("#search_column").length) {
		blocket.apps.list.create_hidden_search_fields();
	}

	blocket(".renault_campaign").apps.list.remod_link_shelf();
	blocket(".breadcrumb_top_container").apps.list.hide_from_mobile('.shopping_wishlist');
	blocket("#blocket").apps.list.hide_from_mobile('.mobile_kill');
	blocket(".ie9_tip").apps.list.show_ie9_box();

	switch (blocket.apps.all_pages.os.major) {
		case "ios":
		case "mac_os":
		case "symbian":
			blocket(".list_mode_thumb .item_row").apps.list.row_click();
	}

	$(".list_ad_clickable_url").mouseover(function () {
		$(this).parent().parent().find(".item_link").removeClass("item_link_over");
		return false;
	});

	$(".list_ad_clickable_url").click(function (e) {
		e.stopPropagation();
	});

	if ($("#inline_shelf").length > 0) {
		blocket.apps.list.remod_space_for_linkshelf_banner();
	}

	// Bind popover triggers for the left sidebar.
	if ($("#blocket").find(".pop_trigger").length > 0) {
		blocket.apps.list.bind_popover_triggers();
	}

	$("#blocket").find(".xiti_activate_click").on('click', blocket.apps.list.spawn_xiti_iframe);

	$(".cmc_puff_click").click(function () {
		// Find the element which has data-cmc="1" and activate click
		$("#blocket").find("[data-param='cmc'][data-val='1']").trigger('click');
	});
	/* START EAS BOTTOM BANNER */
	var lazy_container = $(".bottom_banner_980");

	// Check if wrapper is available
	if (lazy_container.get(0) !== undefined) {

		var lazy_iframe = $("#lazy_iframe", lazy_container);
		var lazy_loaded = false;
		var load_offset = 700; // how much above our container do we want to start loading
		var top_of_lazy = lazy_container.offset().top;
		var browser_height = $(window).height();
		var scrolled_to = 0;
		var top;
		var meet;

		// Create and load iframe
		var load_lazy = function () {
			/* IMPORTANT - use this way of setting the src since otherwise the history of
			/* the browser is modified and the backbutton won't work in explorer */
			if (lazy_iframe.contentWindow !== undefined) {
				lazy_iframe.contentWindow.location.replace(lazy_iframe.attr("longdesc"));
			} else if (lazy_iframe.contentDocument !== undefined) {
				lazy_iframe.contentDocument.location.replace(lazy_iframe.attr("longdesc"));
			} else {
				lazy_iframe.attr('src', lazy_iframe.attr('longdesc'));
			}
		};

		// Check if we should load iframe
		var should_load = function () {

			scrolled_to = $(document).scrollTop();
			top = top_of_lazy - load_offset;
			meet = scrolled_to + browser_height;

			return (meet >= top);
		};

		// Show only if it should be visible
		if (!lazy_loaded && should_load()) {
			lazy_loaded = true;
			load_lazy();
		} else {

			$(window).bind("scroll", function () {

				if (!lazy_loaded && should_load()) {
					lazy_loaded = true;
					load_lazy();
				}

			});

		}

	}
	/* END */

	// Truncate news if they're too long
	blocket.apps.news.truncate();

	/* XXX this should not be javascript */
	if ($(".linkshelf .column").size() === 0) {
		$(".linkshelf").css("border-bottom", "none");

		if ($(".showmap").length) {
			$(".showmap").hide();
		}
	}

	// Check for back button trigger (simulate a made up event that would be good "window.onbackbuttonclick")
	is_init = false;

	var filter_groups = $("#search_column").attr("data-filter_groups");
	if (filter_groups) {
		blocket.apps.list.update_search_column_groups(filter_groups.split(","));
	}
});
