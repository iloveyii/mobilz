/*!** Begin TMP_BUILDblocket_thirdparty_all.js package ***/
/*!** Begin file: inception.js ***/

/*
	Copyright (c) 2010-2012 Filip Moberg, (filip@mcsquare.se)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

	Author:		Filip Moberg
	Name:		inception.js
	Version:	1.2.4-6-g5b491b7.71
	Codename:	Awesomenessism
	Released:	2012-09-10 13:26:44 +0200
*/


// Root reference combatibility (for execution in a non browser environment)
(function () {

	if (typeof window === "undefined") {
		window = this;
		var __isBrowser = false;
	} else {
		var __isBrowser = true;
	}
})();


// Sandbox the environment
/** @param {...undefined} undefined */
(function(window, undefined) { 

	// Declare environment variables
	var document = window.document, navigator = window.navigator, location = window.location;


	// Create function in window object
	/** @constructor */
	window.inception = (function inception(oo) {

		var env = this;
		var self = this;
		var core = env.__core__;

		// Make sure core function is instantiated
		if (this === window) {
			return new inception(arguments[0]);
		}

		// Declare core object (with core functions)
		this.__core__ = {

			onload: [],
			instance: arguments[0],

			// Create deep copy of target object
			clone: function() {
				return this.extend({to: {}, from: arguments[0]});
			},
			// Count child objects
			count : function(o) {

				var c = 0, i;

				for (i in o) {
					if (o.hasOwnProperty(o)) {
						++c;
					}
				}

				return c;
			},
			// Error handling
			error: function() {
				var core = env.__core__;

				if (core.settings.error.show === true) {
					throw new Error(arguments[0]);
				}
				return
			},
			// Extend a primary object with a secondary
			extend: function(o) {

				// Make sure the environment is from the global scope.
                                if (env && env.__core__ && window[env.__core__.instance]) {
                                        env = window[env.__core__.instance];
                                }	

				// If set to true, the returned object will be a copy instead of reference
				if (o.clone === true) {
					o.from = this.clone(o.from); 
				}

				for (var n in o.from) {
					if (o.from.hasOwnProperty(n) === false) {
						continue;
					}

					if (o.construct === true && typeof o.from[n] === "function" && n !== "wrapper") {

						// Make a clone so the use of multiple selectors won't construct the same function twice
						o.from = this.clone(o.from);
						var core = env.__core__, node = [core.instance].concat(o.node.replace(/@/g, "").split(".")), wrapper = node[0], cache;
						o.wrapper = [];

						cache = core.wrapper.cache[core.instance];

						if (typeof cache === "function") {
							o.wrapper.push(cache);
						}

						for (var i=1; i < node.length; ++i) {
							wrapper = wrapper + "__" + node[i];
							cache = core.wrapper.cache[wrapper];
							if (typeof cache === "function") {
								o.wrapper.push(cache);
							}
						}

						for (var i=o.wrapper.length; i >= 0; --i) {

							// Construct the function
							o.from[n] = this.functionConstructor({method: o.from[n], func: n, node: o.node, loop: o.loop, wrapper: o.wrapper[i]});
						}

						// onReady executer
						this.onready({method: o.from[n], func: n, node: o.node, loop: o.loop});
					}

					if (typeof o.from[n] === "object" && n !== "selector" && n !== "$") {

						if (typeof o.to[n] === "undefined") {
							if (o.from[n] === null) {
								o.to[n] = null;
							} else if (o.from[n].constructor.toString().indexOf("Array") !== -1) {
								o.to[n] = [];
							} else {
								o.to[n] = {};
							}
						}

						this.extend({to: o.to[n], from: o.from[n], construct: o.construct, node: o.node, loop: o.loop});
					} else {
						o.to[n] = o.from[n];
					}
				}

				return o.to;
			},
			// Construct user function(s)
			functionConstructor: function(o) {

				var self = this;
				var core = env.__core__;

				// Construct function as ordinary
				return function() {

					if (typeof this[o.func] === "function") {

						// Set up selector
						this[o.func].selector = this[o.func].$ = core.selector;

						// Set up selector (for new methods, if the current method is used as a constructor)
						if (this[o.func].prototype) {
							this[o.func].prototype.selector = this[o.func].prototype.$ = core.selector;
						}

						// Set up node
						this[o.func].node = core.clone(core.node);

						// This line is for legacy purposes only (where the selector is called from the global object)
						window[core.instance].$ = window[core.instance].selector = core.selector;
					}

					// Execute user function in correct environment
					if (typeof o.wrapper === "function") {
						var self = this;
						var args = arguments;

						// Execute user function inside wrappers (if available)
						return o.wrapper.call({
							call: function() {

								// Apply method with its parent object as reference
								return o.method.apply(self, args);
							}
						});
					} else {
						// Execute user function as ordinary (if there are no wrappers defined for this object)
						return o.method.apply(this, arguments);
					}
				};
			},
			// Construct user function(s)
			onready: function(o) {

				var self = this;
				var core = env.__core__;

				switch(o.func) {

					// If function is an onReady function and it's the first node selector, load it into jQuery ready - else, load it straight after the window object.
					case "onReady":
						if (o.loop === "0" && typeof o.method !== "undefined") {

							if (typeof window.jQuery === "function") {

								window.jQuery(window[core.settings.jQuery.ready]).ready(function() {

									o.nodeKeys = o.node.split(".");
									o.parentNode = window[self.instance];
									for (var i in o.nodeKeys) {
										if (o.nodeKeys.hasOwnProperty(i) === false) {
											continue;
										}
										
										o.parentNode = o.parentNode[o.nodeKeys[i]];
									}

									// Call method with its parent object as reference
									o.method.call(o.parentNode);
								});

							} else {

								this.onload.push(o.method);

								window.onload = function() {
									for (o in self.onload) {
										if (self.onload.hasOwnProperty(o) === false) {
											continue;
										}
										
										o.nodeKeys = o.node.split(".");
										o.parentNode = window[self.instance];
										for (var i in o.nodeKeys) {
											if (o.nodeKeys.hasOwnProperty(i) === false) {
												continue;
											}
											
											o.parentNode = o.parentNode[o.nodeKeys[i]];
										}

										// Call method with its parent object as reference
										self.onload[o].call(o.parentNode);
									}
								}
							}
						}
						break;
				}
			},
			settings: {
				jQuery: {
					ready: "document"
				},
				error: {
					show: true
				}
			},
			// Create array from node string
			stringToArray: function() {
				return arguments[0].replace(/ /g, "").split("@").slice(1);
			},
			// Create object from node string
			stringToObject: function() {

				var selector = arguments[0].replace(/ /g, "").split("@").slice(1), a = [], s, o, i, node, shell;

				for (s in selector) {
					if (selector.hasOwnProperty(s) === false) {
						continue;
					}
					node = selector[s].split(".");

					if (node[0] !== "") {
						o = {};
						shell = o;

						for (i = 0; i < node.length-1; ++i) {
							o = o[node[i]] = {};
						}

						if (arguments[1]) {
							o = o[node[i]] = arguments[1];
						} else {
							o = o[node[i]] = {};
						}

						a.push(shell);
					}
				}

				return a;
			},
			// Create selector from node string
			stringToSelector: function() {
				var a = [], n = this.stringToArray(arguments[0]), i, x;

				for (i in n) {
					if (n.hasOwnProperty(i) === false) {
						continue;
					}
					var s = n[i].split(".");
					var node = env;

					for (x in s) {
						if (s.hasOwnProperty(x) === false) {
							continue;
						}
						
						if (typeof node[s[x]] !== "undefined") {
							node = node[s[x]];
						}
					}

					if (node !== env) {
						a.push(node);
					}
				}

				return a;
			},
			// Wrapper engine. Used for fetching stored wrappers in runtime.
			wrapper: {
				cache: {
				},

				get: function(o) {
					var wrapper, core = env.__core__, node = [core.instance].concat(o.node.replace(/@/g, "").split(".")), n, i;

					for (i in node) {
						if (node.hasOwnProperty(i) === false) {
							continue;
						}

						if (!n) {
							n = node[i];
						} else {
							n = n + "__" + node[i];
						}
						if (typeof core.wrapper.cache[n] === "function") {
							wrapper = core.wrapper.cache[n];
						}
					}
					return wrapper;
				}
			}
		};

		// Make the global object a reference to the instance function and return it
		/** @constructor */
		return new (window[arguments[0]] = function() {

			var extended, core = env.__core__;

			// Extend core object with instance object internally
			// Declare user functions and variables
			extended = core.extend({to: env, from: {

				// Default node and selector values
				__core__: {
					node: {
						getString: "",
						getArray: []
					},
					selector: []
				},

				// a DOM helper, to easily create new elements through jQuery. This actually is more of a jQuery plugin, but it's often useful - so I included it.
				append: function() {
					var core = env.__core__, o = arguments[0], jQuery = window.jQuery;

					// Faster than jQueries append, but lets you pass through css, bind and attribute objects to jQuery.
					if (typeof window.jQuery === "function") {
						return core.$.each(function() {

							if (o.element) {
								var obj = document.createElement(o.element);
								this.appendChild(obj);
							}

							if (o.css) {
								jQuery(obj).css(o.css);
							}

							if (o.attr) {
								jQuery(obj).attr(o.attr);
							}

							if (o.bind) {
								for (var k in o.bind) {
									if (o.bind.hasOwnProperty(k) === false) {
										continue;
									}
									
									jQuery(obj).bind(k, o.bind[k]);
								}
							}
						});
					}

					return env;
				},
				// Create a new instance and extend with a copy of selected objects
				clone: function() {

					var name = [], arg = arguments[0], i;

					if (arg) {
						name.push(arg);
					} else {
						name = core.node.getArray; 
					}

					for (i in name) {
						if (name.hasOwnProperty(i) === false) {
							continue;
						}
						
						// Create a new instance 
						new inception(name[i]);

						// Extend with core object
						core.extend({to: window[name[i]], from: core.clone(env)});

						// Extend with inner object
						core.extend({to: window[name[i]](), from: core.clone(env)});
					}

					return env;
				},
				// Extend selected node(s) with given object/function
				extend: function() {
					var shell, s = [], node;

					// Error on invalid node selector
					if (typeof core.node.getArray[0] === "undefined") {
						return core.error("inception.js: Trying to extend with invalid node selector.");
					}

					// Error on false input object
					if (typeof arguments[0] === "undefined") {
						return core.error("inception.js: Trying to extend with invalid input object.");
					}

					// Create shell object of selector node(s)
					shell = core.stringToObject(core.node.getString, arguments[0]);

					// Match shell with node array
					node = core.node.getArray;

					// Iterate over shell and extend each node
					for (var i in shell) {
						core.extend({to: this, from: shell[i], construct: true, node: node[i], loop: i});
						s.push(shell[i]);
					}

					// Extend up to the global object
					window[core.instance] = core.extend({to: window[core.instance], from: this});

					// Return inception object
					return env;
				},
				// Used to read and set new environment settings
				settings: function() {
					var core = env.__core__, settings = arguments[0];

					return core.extend({to: core.settings, from: settings});
				},
				// Crate a wrapper that sticks to a specified node, and then wraps the calling function with itself.
				wrap: function() {

					var a, i;

					if (typeof arguments[0] === "function") {

						a = core.node.getString.replace(/\./g, "__").replace(/ /g, "").split("@").slice(1);

						if (a.length === 0) {

							// Set wrapper cache
							core.wrapper.cache[core.instance] = arguments[0];
						}

						for (i in a) {
							if (a.hasOwnProperty(i) === false) {
								continue;
							}
							

							// Set wrapper cache
							core.wrapper.cache[core.instance + "__" + a[i]] = arguments[0];

							// Extend to core object
							core.extend({to: window[core.instance].__core__.wrapper, from: core.wrapper});
						}
					}

					return env;
				}
			}});

			// Extend up to the global object
			window[core.instance] = core.extend({to: window[core.instance], from: extended});

			// Append correct selector
			if (typeof arguments[0] === "string" && arguments[0].indexOf("@") !== -1) {

				// Set selector to an inception selector
				core.$ = core.selector = core.stringToSelector(arguments[0]);

				// Save original selector string
				core.node.getString = arguments[0];
				core.node.getArray = core.stringToArray(arguments[0]);

			} else if (typeof window.jQuery === "function") {

				// Set selector to a jQuery selector (if it's not an inception selector and if jQuery is present)
				core.$ = core.selector = window.jQuery(arguments[0]);
			} else if (arguments[0] && __isBrowser) {

				// Use native javascript CSS selector
				core.$ = core.selector = document.querySelectorAll(arguments[0]);
			} else {

				// Clear all old selectors
				core.node.getString = "";
				core.node.getArray = "";
				core.$ = core.selector = [];
			}
		
			// Return extended core object
			return extended;
		});
	});

})(window);
/*!** End file: inception.js ***/
/*!** Begin file: json2.js ***/
/*
    json2.js
    2013-05-26

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());/*!** End file: json2.js ***/
/*!** Begin file: jquery-ui-1.10.3.min.js ***/
/*! jQuery UI - v1.10.3 - 2013-05-03
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.ui.effect.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js, jquery.ui.menu.js, jquery.ui.position.js, jquery.ui.progressbar.js, jquery.ui.slider.js, jquery.ui.spinner.js, jquery.ui.tabs.js, jquery.ui.tooltip.js
* Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */
(function(t,e){function i(e,i){var n,o,a,r=e.nodeName.toLowerCase();return"area"===r?(n=e.parentNode,o=n.name,e.href&&o&&"map"===n.nodeName.toLowerCase()?(a=t("img[usemap=#"+o+"]")[0],!!a&&s(a)):!1):(/input|select|textarea|button|object/.test(r)?!e.disabled:"a"===r?e.href||i:i)&&s(e)}function s(e){return t.expr.filters.visible(e)&&!t(e).parents().addBack().filter(function(){return"hidden"===t.css(this,"visibility")}).length}var n=0,o=/^ui-id-\d+$/;t.ui=t.ui||{},t.extend(t.ui,{version:"1.10.3",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),t.fn.extend({focus:function(e){return function(i,s){return"number"==typeof i?this.each(function(){var e=this;setTimeout(function(){t(e).focus(),s&&s.call(e)},i)}):e.apply(this,arguments)}}(t.fn.focus),scrollParent:function(){var e;return e=t.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(t.css(this,"position"))&&/(auto|scroll)/.test(t.css(this,"overflow")+t.css(this,"overflow-y")+t.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(t.css(this,"overflow")+t.css(this,"overflow-y")+t.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!e.length?t(document):e},zIndex:function(i){if(i!==e)return this.css("zIndex",i);if(this.length)for(var s,n,o=t(this[0]);o.length&&o[0]!==document;){if(s=o.css("position"),("absolute"===s||"relative"===s||"fixed"===s)&&(n=parseInt(o.css("zIndex"),10),!isNaN(n)&&0!==n))return n;o=o.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++n)})},removeUniqueId:function(){return this.each(function(){o.test(this.id)&&t(this).removeAttr("id")})}}),t.extend(t.expr[":"],{data:t.expr.createPseudo?t.expr.createPseudo(function(e){return function(i){return!!t.data(i,e)}}):function(e,i,s){return!!t.data(e,s[3])},focusable:function(e){return i(e,!isNaN(t.attr(e,"tabindex")))},tabbable:function(e){var s=t.attr(e,"tabindex"),n=isNaN(s);return(n||s>=0)&&i(e,!n)}}),t("<a>").outerWidth(1).jquery||t.each(["Width","Height"],function(i,s){function n(e,i,s,n){return t.each(o,function(){i-=parseFloat(t.css(e,"padding"+this))||0,s&&(i-=parseFloat(t.css(e,"border"+this+"Width"))||0),n&&(i-=parseFloat(t.css(e,"margin"+this))||0)}),i}var o="Width"===s?["Left","Right"]:["Top","Bottom"],a=s.toLowerCase(),r={innerWidth:t.fn.innerWidth,innerHeight:t.fn.innerHeight,outerWidth:t.fn.outerWidth,outerHeight:t.fn.outerHeight};t.fn["inner"+s]=function(i){return i===e?r["inner"+s].call(this):this.each(function(){t(this).css(a,n(this,i)+"px")})},t.fn["outer"+s]=function(e,i){return"number"!=typeof e?r["outer"+s].call(this,e):this.each(function(){t(this).css(a,n(this,e,!0,i)+"px")})}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(t.fn.removeData=function(e){return function(i){return arguments.length?e.call(this,t.camelCase(i)):e.call(this)}}(t.fn.removeData)),t.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),t.support.selectstart="onselectstart"in document.createElement("div"),t.fn.extend({disableSelection:function(){return this.bind((t.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(t){t.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),t.extend(t.ui,{plugin:{add:function(e,i,s){var n,o=t.ui[e].prototype;for(n in s)o.plugins[n]=o.plugins[n]||[],o.plugins[n].push([i,s[n]])},call:function(t,e,i){var s,n=t.plugins[e];if(n&&t.element[0].parentNode&&11!==t.element[0].parentNode.nodeType)for(s=0;n.length>s;s++)t.options[n[s][0]]&&n[s][1].apply(t.element,i)}},hasScroll:function(e,i){if("hidden"===t(e).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",n=!1;return e[s]>0?!0:(e[s]=1,n=e[s]>0,e[s]=0,n)}})})(jQuery),function(t,e){var i=0,s=Array.prototype.slice,n=t.cleanData;t.cleanData=function(e){for(var i,s=0;null!=(i=e[s]);s++)try{t(i).triggerHandler("remove")}catch(o){}n(e)},t.widget=function(i,s,n){var o,a,r,h,l={},c=i.split(".")[0];i=i.split(".")[1],o=c+"-"+i,n||(n=s,s=t.Widget),t.expr[":"][o.toLowerCase()]=function(e){return!!t.data(e,o)},t[c]=t[c]||{},a=t[c][i],r=t[c][i]=function(t,i){return this._createWidget?(arguments.length&&this._createWidget(t,i),e):new r(t,i)},t.extend(r,a,{version:n.version,_proto:t.extend({},n),_childConstructors:[]}),h=new s,h.options=t.widget.extend({},h.options),t.each(n,function(i,n){return t.isFunction(n)?(l[i]=function(){var t=function(){return s.prototype[i].apply(this,arguments)},e=function(t){return s.prototype[i].apply(this,t)};return function(){var i,s=this._super,o=this._superApply;return this._super=t,this._superApply=e,i=n.apply(this,arguments),this._super=s,this._superApply=o,i}}(),e):(l[i]=n,e)}),r.prototype=t.widget.extend(h,{widgetEventPrefix:a?h.widgetEventPrefix:i},l,{constructor:r,namespace:c,widgetName:i,widgetFullName:o}),a?(t.each(a._childConstructors,function(e,i){var s=i.prototype;t.widget(s.namespace+"."+s.widgetName,r,i._proto)}),delete a._childConstructors):s._childConstructors.push(r),t.widget.bridge(i,r)},t.widget.extend=function(i){for(var n,o,a=s.call(arguments,1),r=0,h=a.length;h>r;r++)for(n in a[r])o=a[r][n],a[r].hasOwnProperty(n)&&o!==e&&(i[n]=t.isPlainObject(o)?t.isPlainObject(i[n])?t.widget.extend({},i[n],o):t.widget.extend({},o):o);return i},t.widget.bridge=function(i,n){var o=n.prototype.widgetFullName||i;t.fn[i]=function(a){var r="string"==typeof a,h=s.call(arguments,1),l=this;return a=!r&&h.length?t.widget.extend.apply(null,[a].concat(h)):a,r?this.each(function(){var s,n=t.data(this,o);return n?t.isFunction(n[a])&&"_"!==a.charAt(0)?(s=n[a].apply(n,h),s!==n&&s!==e?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):e):t.error("no such method '"+a+"' for "+i+" widget instance"):t.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+a+"'")}):this.each(function(){var e=t.data(this,o);e?e.option(a||{})._init():t.data(this,o,new n(a,this))}),l}},t.Widget=function(){},t.Widget._childConstructors=[],t.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(e,s){s=t(s||this.defaultElement||this)[0],this.element=t(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=t.widget.extend({},this.options,this._getCreateOptions(),e),this.bindings=t(),this.hoverable=t(),this.focusable=t(),s!==this&&(t.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===s&&this.destroy()}}),this.document=t(s.style?s.ownerDocument:s.document||s),this.window=t(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:t.noop,_getCreateEventData:t.noop,_create:t.noop,_init:t.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:t.noop,widget:function(){return this.element},option:function(i,s){var n,o,a,r=i;if(0===arguments.length)return t.widget.extend({},this.options);if("string"==typeof i)if(r={},n=i.split("."),i=n.shift(),n.length){for(o=r[i]=t.widget.extend({},this.options[i]),a=0;n.length-1>a;a++)o[n[a]]=o[n[a]]||{},o=o[n[a]];if(i=n.pop(),s===e)return o[i]===e?null:o[i];o[i]=s}else{if(s===e)return this.options[i]===e?null:this.options[i];r[i]=s}return this._setOptions(r),this},_setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return this.options[t]=e,"disabled"===t&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!e).attr("aria-disabled",e),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,n){var o,a=this;"boolean"!=typeof i&&(n=s,s=i,i=!1),n?(s=o=t(s),this.bindings=this.bindings.add(s)):(n=s,s=this.element,o=this.widget()),t.each(n,function(n,r){function h(){return i||a.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled")?("string"==typeof r?a[r]:r).apply(a,arguments):e}"string"!=typeof r&&(h.guid=r.guid=r.guid||h.guid||t.guid++);var l=n.match(/^(\w+)\s*(.*)$/),c=l[1]+a.eventNamespace,u=l[2];u?o.delegate(u,c,h):s.bind(c,h)})},_off:function(t,e){e=(e||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.unbind(e).undelegate(e)},_delay:function(t,e){function i(){return("string"==typeof t?s[t]:t).apply(s,arguments)}var s=this;return setTimeout(i,e||0)},_hoverable:function(e){this.hoverable=this.hoverable.add(e),this._on(e,{mouseenter:function(e){t(e.currentTarget).addClass("ui-state-hover")},mouseleave:function(e){t(e.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(e){this.focusable=this.focusable.add(e),this._on(e,{focusin:function(e){t(e.currentTarget).addClass("ui-state-focus")},focusout:function(e){t(e.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(e,i,s){var n,o,a=this.options[e];if(s=s||{},i=t.Event(i),i.type=(e===this.widgetEventPrefix?e:this.widgetEventPrefix+e).toLowerCase(),i.target=this.element[0],o=i.originalEvent)for(n in o)n in i||(i[n]=o[n]);return this.element.trigger(i,s),!(t.isFunction(a)&&a.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},t.each({show:"fadeIn",hide:"fadeOut"},function(e,i){t.Widget.prototype["_"+e]=function(s,n,o){"string"==typeof n&&(n={effect:n});var a,r=n?n===!0||"number"==typeof n?i:n.effect||i:e;n=n||{},"number"==typeof n&&(n={duration:n}),a=!t.isEmptyObject(n),n.complete=o,n.delay&&s.delay(n.delay),a&&t.effects&&t.effects.effect[r]?s[e](n):r!==e&&s[r]?s[r](n.duration,n.easing,o):s.queue(function(i){t(this)[e](),o&&o.call(s[0]),i()})}})}(jQuery),function(t){var e=!1;t(document).mouseup(function(){e=!1}),t.widget("ui.mouse",{version:"1.10.3",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var e=this;this.element.bind("mousedown."+this.widgetName,function(t){return e._mouseDown(t)}).bind("click."+this.widgetName,function(i){return!0===t.data(i.target,e.widgetName+".preventClickEvent")?(t.removeData(i.target,e.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):undefined}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&t(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(i){if(!e){this._mouseStarted&&this._mouseUp(i),this._mouseDownEvent=i;var s=this,n=1===i.which,o="string"==typeof this.options.cancel&&i.target.nodeName?t(i.target).closest(this.options.cancel).length:!1;return n&&!o&&this._mouseCapture(i)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){s.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(i)&&this._mouseDelayMet(i)&&(this._mouseStarted=this._mouseStart(i)!==!1,!this._mouseStarted)?(i.preventDefault(),!0):(!0===t.data(i.target,this.widgetName+".preventClickEvent")&&t.removeData(i.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(t){return s._mouseMove(t)},this._mouseUpDelegate=function(t){return s._mouseUp(t)},t(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),i.preventDefault(),e=!0,!0)):!0}},_mouseMove:function(e){return t.ui.ie&&(!document.documentMode||9>document.documentMode)&&!e.button?this._mouseUp(e):this._mouseStarted?(this._mouseDrag(e),e.preventDefault()):(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,e)!==!1,this._mouseStarted?this._mouseDrag(e):this._mouseUp(e)),!this._mouseStarted)},_mouseUp:function(e){return t(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,e.target===this._mouseDownEvent.target&&t.data(e.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(e)),!1},_mouseDistanceMet:function(t){return Math.max(Math.abs(this._mouseDownEvent.pageX-t.pageX),Math.abs(this._mouseDownEvent.pageY-t.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})}(jQuery),function(t){t.widget("ui.draggable",t.ui.mouse,{version:"1.10.3",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"!==this.options.helper||/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy()},_mouseCapture:function(e){var i=this.options;return this.helper||i.disabled||t(e.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(e),this.handle?(t(i.iframeFix===!0?"iframe":i.iframeFix).each(function(){t("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(t(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(e){var i=this.options;return this.helper=this._createHelper(e),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),t.ui.ddmanager&&(t.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offsetParent=this.helper.offsetParent(),this.offsetParentCssPosition=this.offsetParent.css("position"),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},this.offset.scroll=!1,t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",e)===!1?(this._clear(),!1):(this._cacheHelperProportions(),t.ui.ddmanager&&!i.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this._mouseDrag(e,!0),t.ui.ddmanager&&t.ui.ddmanager.dragStart(this,e),!0)},_mouseDrag:function(e,i){if("fixed"===this.offsetParentCssPosition&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),!i){var s=this._uiHash();if(this._trigger("drag",e,s)===!1)return this._mouseUp({}),!1;this.position=s.position}return this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),!1},_mouseStop:function(e){var i=this,s=!1;return t.ui.ddmanager&&!this.options.dropBehaviour&&(s=t.ui.ddmanager.drop(this,e)),this.dropped&&(s=this.dropped,this.dropped=!1),"original"!==this.options.helper||t.contains(this.element[0].ownerDocument,this.element[0])?("invalid"===this.options.revert&&!s||"valid"===this.options.revert&&s||this.options.revert===!0||t.isFunction(this.options.revert)&&this.options.revert.call(this.element,s)?t(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",e)!==!1&&i._clear()}):this._trigger("stop",e)!==!1&&this._clear(),!1):!1},_mouseUp:function(e){return t("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),t.ui.ddmanager&&t.ui.ddmanager.dragStop(this,e),t.ui.mouse.prototype._mouseUp.call(this,e)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(e){return this.options.handle?!!t(e.target).closest(this.element.find(this.options.handle)).length:!0},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return s.parents("body").length||s.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),s[0]===this.element[0]||/(fixed|absolute)/.test(s.css("position"))||s.css("position","absolute"),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.element.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;return n.containment?"window"===n.containment?(this.containment=[t(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,t(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,t(window).scrollLeft()+t(window).width()-this.helperProportions.width-this.margins.left,t(window).scrollTop()+(t(window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],undefined):"document"===n.containment?(this.containment=[0,0,t(document).width()-this.helperProportions.width-this.margins.left,(t(document).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],undefined):n.containment.constructor===Array?(this.containment=n.containment,undefined):("parent"===n.containment&&(n.containment=this.helper[0].parentNode),i=t(n.containment),s=i[0],s&&(e="hidden"!==i.css("overflow"),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(e?Math.max(s.scrollWidth,s.offsetWidth):s.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(e?Math.max(s.scrollHeight,s.offsetHeight):s.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=i),undefined):(this.containment=null,undefined)},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent;return this.offset.scroll||(this.offset.scroll={top:n.scrollTop(),left:n.scrollLeft()}),{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top)*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)*s}},_generatePosition:function(e){var i,s,n,o,a=this.options,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=e.pageX,l=e.pageY;return this.offset.scroll||(this.offset.scroll={top:r.scrollTop(),left:r.scrollLeft()}),this.originalPosition&&(this.containment&&(this.relative_container?(s=this.relative_container.offset(),i=[this.containment[0]+s.left,this.containment[1]+s.top,this.containment[2]+s.left,this.containment[3]+s.top]):i=this.containment,e.pageX-this.offset.click.left<i[0]&&(h=i[0]+this.offset.click.left),e.pageY-this.offset.click.top<i[1]&&(l=i[1]+this.offset.click.top),e.pageX-this.offset.click.left>i[2]&&(h=i[2]+this.offset.click.left),e.pageY-this.offset.click.top>i[3]&&(l=i[3]+this.offset.click.top)),a.grid&&(n=a.grid[1]?this.originalPageY+Math.round((l-this.originalPageY)/a.grid[1])*a.grid[1]:this.originalPageY,l=i?n-this.offset.click.top>=i[1]||n-this.offset.click.top>i[3]?n:n-this.offset.click.top>=i[1]?n-a.grid[1]:n+a.grid[1]:n,o=a.grid[0]?this.originalPageX+Math.round((h-this.originalPageX)/a.grid[0])*a.grid[0]:this.originalPageX,h=i?o-this.offset.click.left>=i[0]||o-this.offset.click.left>i[2]?o:o-this.offset.click.left>=i[0]?o-a.grid[0]:o+a.grid[0]:o)),{top:l-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top),left:h-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(e,i,s){return s=s||this._uiHash(),t.ui.plugin.call(this,e,[i,s]),"drag"===e&&(this.positionAbs=this._convertPositionTo("absolute")),t.Widget.prototype._trigger.call(this,e,i,s)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),t.ui.plugin.add("draggable","connectToSortable",{start:function(e,i){var s=t(this).data("ui-draggable"),n=s.options,o=t.extend({},i,{item:s.element});s.sortables=[],t(n.connectToSortable).each(function(){var i=t.data(this,"ui-sortable");i&&!i.options.disabled&&(s.sortables.push({instance:i,shouldRevert:i.options.revert}),i.refreshPositions(),i._trigger("activate",e,o))})},stop:function(e,i){var s=t(this).data("ui-draggable"),n=t.extend({},i,{item:s.element});t.each(s.sortables,function(){this.instance.isOver?(this.instance.isOver=0,s.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=this.shouldRevert),this.instance._mouseStop(e),this.instance.options.helper=this.instance.options._helper,"original"===s.options.helper&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",e,n))})},drag:function(e,i){var s=t(this).data("ui-draggable"),n=this;t.each(s.sortables,function(){var o=!1,a=this;this.instance.positionAbs=s.positionAbs,this.instance.helperProportions=s.helperProportions,this.instance.offset.click=s.offset.click,this.instance._intersectsWith(this.instance.containerCache)&&(o=!0,t.each(s.sortables,function(){return this.instance.positionAbs=s.positionAbs,this.instance.helperProportions=s.helperProportions,this.instance.offset.click=s.offset.click,this!==a&&this.instance._intersectsWith(this.instance.containerCache)&&t.contains(a.instance.element[0],this.instance.element[0])&&(o=!1),o})),o?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=t(n).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return i.helper[0]},e.target=this.instance.currentItem[0],this.instance._mouseCapture(e,!0),this.instance._mouseStart(e,!0,!0),this.instance.offset.click.top=s.offset.click.top,this.instance.offset.click.left=s.offset.click.left,this.instance.offset.parent.left-=s.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=s.offset.parent.top-this.instance.offset.parent.top,s._trigger("toSortable",e),s.dropped=this.instance.element,s.currentItem=s.element,this.instance.fromOutside=s),this.instance.currentItem&&this.instance._mouseDrag(e)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",e,this.instance._uiHash(this.instance)),this.instance._mouseStop(e,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),s._trigger("fromSortable",e),s.dropped=!1)})}}),t.ui.plugin.add("draggable","cursor",{start:function(){var e=t("body"),i=t(this).data("ui-draggable").options;e.css("cursor")&&(i._cursor=e.css("cursor")),e.css("cursor",i.cursor)},stop:function(){var e=t(this).data("ui-draggable").options;e._cursor&&t("body").css("cursor",e._cursor)}}),t.ui.plugin.add("draggable","opacity",{start:function(e,i){var s=t(i.helper),n=t(this).data("ui-draggable").options;s.css("opacity")&&(n._opacity=s.css("opacity")),s.css("opacity",n.opacity)},stop:function(e,i){var s=t(this).data("ui-draggable").options;s._opacity&&t(i.helper).css("opacity",s._opacity)}}),t.ui.plugin.add("draggable","scroll",{start:function(){var e=t(this).data("ui-draggable");e.scrollParent[0]!==document&&"HTML"!==e.scrollParent[0].tagName&&(e.overflowOffset=e.scrollParent.offset())},drag:function(e){var i=t(this).data("ui-draggable"),s=i.options,n=!1;i.scrollParent[0]!==document&&"HTML"!==i.scrollParent[0].tagName?(s.axis&&"x"===s.axis||(i.overflowOffset.top+i.scrollParent[0].offsetHeight-e.pageY<s.scrollSensitivity?i.scrollParent[0].scrollTop=n=i.scrollParent[0].scrollTop+s.scrollSpeed:e.pageY-i.overflowOffset.top<s.scrollSensitivity&&(i.scrollParent[0].scrollTop=n=i.scrollParent[0].scrollTop-s.scrollSpeed)),s.axis&&"y"===s.axis||(i.overflowOffset.left+i.scrollParent[0].offsetWidth-e.pageX<s.scrollSensitivity?i.scrollParent[0].scrollLeft=n=i.scrollParent[0].scrollLeft+s.scrollSpeed:e.pageX-i.overflowOffset.left<s.scrollSensitivity&&(i.scrollParent[0].scrollLeft=n=i.scrollParent[0].scrollLeft-s.scrollSpeed))):(s.axis&&"x"===s.axis||(e.pageY-t(document).scrollTop()<s.scrollSensitivity?n=t(document).scrollTop(t(document).scrollTop()-s.scrollSpeed):t(window).height()-(e.pageY-t(document).scrollTop())<s.scrollSensitivity&&(n=t(document).scrollTop(t(document).scrollTop()+s.scrollSpeed))),s.axis&&"y"===s.axis||(e.pageX-t(document).scrollLeft()<s.scrollSensitivity?n=t(document).scrollLeft(t(document).scrollLeft()-s.scrollSpeed):t(window).width()-(e.pageX-t(document).scrollLeft())<s.scrollSensitivity&&(n=t(document).scrollLeft(t(document).scrollLeft()+s.scrollSpeed)))),n!==!1&&t.ui.ddmanager&&!s.dropBehaviour&&t.ui.ddmanager.prepareOffsets(i,e)}}),t.ui.plugin.add("draggable","snap",{start:function(){var e=t(this).data("ui-draggable"),i=e.options;e.snapElements=[],t(i.snap.constructor!==String?i.snap.items||":data(ui-draggable)":i.snap).each(function(){var i=t(this),s=i.offset();this!==e.element[0]&&e.snapElements.push({item:this,width:i.outerWidth(),height:i.outerHeight(),top:s.top,left:s.left})})},drag:function(e,i){var s,n,o,a,r,h,l,c,u,d,p=t(this).data("ui-draggable"),f=p.options,g=f.snapTolerance,m=i.offset.left,v=m+p.helperProportions.width,_=i.offset.top,b=_+p.helperProportions.height;for(u=p.snapElements.length-1;u>=0;u--)r=p.snapElements[u].left,h=r+p.snapElements[u].width,l=p.snapElements[u].top,c=l+p.snapElements[u].height,r-g>v||m>h+g||l-g>b||_>c+g||!t.contains(p.snapElements[u].item.ownerDocument,p.snapElements[u].item)?(p.snapElements[u].snapping&&p.options.snap.release&&p.options.snap.release.call(p.element,e,t.extend(p._uiHash(),{snapItem:p.snapElements[u].item})),p.snapElements[u].snapping=!1):("inner"!==f.snapMode&&(s=g>=Math.abs(l-b),n=g>=Math.abs(c-_),o=g>=Math.abs(r-v),a=g>=Math.abs(h-m),s&&(i.position.top=p._convertPositionTo("relative",{top:l-p.helperProportions.height,left:0}).top-p.margins.top),n&&(i.position.top=p._convertPositionTo("relative",{top:c,left:0}).top-p.margins.top),o&&(i.position.left=p._convertPositionTo("relative",{top:0,left:r-p.helperProportions.width}).left-p.margins.left),a&&(i.position.left=p._convertPositionTo("relative",{top:0,left:h}).left-p.margins.left)),d=s||n||o||a,"outer"!==f.snapMode&&(s=g>=Math.abs(l-_),n=g>=Math.abs(c-b),o=g>=Math.abs(r-m),a=g>=Math.abs(h-v),s&&(i.position.top=p._convertPositionTo("relative",{top:l,left:0}).top-p.margins.top),n&&(i.position.top=p._convertPositionTo("relative",{top:c-p.helperProportions.height,left:0}).top-p.margins.top),o&&(i.position.left=p._convertPositionTo("relative",{top:0,left:r}).left-p.margins.left),a&&(i.position.left=p._convertPositionTo("relative",{top:0,left:h-p.helperProportions.width}).left-p.margins.left)),!p.snapElements[u].snapping&&(s||n||o||a||d)&&p.options.snap.snap&&p.options.snap.snap.call(p.element,e,t.extend(p._uiHash(),{snapItem:p.snapElements[u].item})),p.snapElements[u].snapping=s||n||o||a||d)}}),t.ui.plugin.add("draggable","stack",{start:function(){var e,i=this.data("ui-draggable").options,s=t.makeArray(t(i.stack)).sort(function(e,i){return(parseInt(t(e).css("zIndex"),10)||0)-(parseInt(t(i).css("zIndex"),10)||0)});s.length&&(e=parseInt(t(s[0]).css("zIndex"),10)||0,t(s).each(function(i){t(this).css("zIndex",e+i)}),this.css("zIndex",e+s.length))}}),t.ui.plugin.add("draggable","zIndex",{start:function(e,i){var s=t(i.helper),n=t(this).data("ui-draggable").options;s.css("zIndex")&&(n._zIndex=s.css("zIndex")),s.css("zIndex",n.zIndex)},stop:function(e,i){var s=t(this).data("ui-draggable").options;s._zIndex&&t(i.helper).css("zIndex",s._zIndex)}})}(jQuery),function(t){function e(t,e,i){return t>e&&e+i>t}t.widget("ui.droppable",{version:"1.10.3",widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var e=this.options,i=e.accept;this.isover=!1,this.isout=!0,this.accept=t.isFunction(i)?i:function(t){return t.is(i)
},this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight},t.ui.ddmanager.droppables[e.scope]=t.ui.ddmanager.droppables[e.scope]||[],t.ui.ddmanager.droppables[e.scope].push(this),e.addClasses&&this.element.addClass("ui-droppable")},_destroy:function(){for(var e=0,i=t.ui.ddmanager.droppables[this.options.scope];i.length>e;e++)i[e]===this&&i.splice(e,1);this.element.removeClass("ui-droppable ui-droppable-disabled")},_setOption:function(e,i){"accept"===e&&(this.accept=t.isFunction(i)?i:function(t){return t.is(i)}),t.Widget.prototype._setOption.apply(this,arguments)},_activate:function(e){var i=t.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),i&&this._trigger("activate",e,this.ui(i))},_deactivate:function(e){var i=t.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),i&&this._trigger("deactivate",e,this.ui(i))},_over:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",e,this.ui(i)))},_out:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",e,this.ui(i)))},_drop:function(e,i){var s=i||t.ui.ddmanager.current,n=!1;return s&&(s.currentItem||s.element)[0]!==this.element[0]?(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var e=t.data(this,"ui-droppable");return e.options.greedy&&!e.options.disabled&&e.options.scope===s.options.scope&&e.accept.call(e.element[0],s.currentItem||s.element)&&t.ui.intersect(s,t.extend(e,{offset:e.element.offset()}),e.options.tolerance)?(n=!0,!1):undefined}),n?!1:this.accept.call(this.element[0],s.currentItem||s.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",e,this.ui(s)),this.element):!1):!1},ui:function(t){return{draggable:t.currentItem||t.element,helper:t.helper,position:t.position,offset:t.positionAbs}}}),t.ui.intersect=function(t,i,s){if(!i.offset)return!1;var n,o,a=(t.positionAbs||t.position.absolute).left,r=a+t.helperProportions.width,h=(t.positionAbs||t.position.absolute).top,l=h+t.helperProportions.height,c=i.offset.left,u=c+i.proportions.width,d=i.offset.top,p=d+i.proportions.height;switch(s){case"fit":return a>=c&&u>=r&&h>=d&&p>=l;case"intersect":return a+t.helperProportions.width/2>c&&u>r-t.helperProportions.width/2&&h+t.helperProportions.height/2>d&&p>l-t.helperProportions.height/2;case"pointer":return n=(t.positionAbs||t.position.absolute).left+(t.clickOffset||t.offset.click).left,o=(t.positionAbs||t.position.absolute).top+(t.clickOffset||t.offset.click).top,e(o,d,i.proportions.height)&&e(n,c,i.proportions.width);case"touch":return(h>=d&&p>=h||l>=d&&p>=l||d>h&&l>p)&&(a>=c&&u>=a||r>=c&&u>=r||c>a&&r>u);default:return!1}},t.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(e,i){var s,n,o=t.ui.ddmanager.droppables[e.options.scope]||[],a=i?i.type:null,r=(e.currentItem||e.element).find(":data(ui-droppable)").addBack();t:for(s=0;o.length>s;s++)if(!(o[s].options.disabled||e&&!o[s].accept.call(o[s].element[0],e.currentItem||e.element))){for(n=0;r.length>n;n++)if(r[n]===o[s].element[0]){o[s].proportions.height=0;continue t}o[s].visible="none"!==o[s].element.css("display"),o[s].visible&&("mousedown"===a&&o[s]._activate.call(o[s],i),o[s].offset=o[s].element.offset(),o[s].proportions={width:o[s].element[0].offsetWidth,height:o[s].element[0].offsetHeight})}},drop:function(e,i){var s=!1;return t.each((t.ui.ddmanager.droppables[e.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&t.ui.intersect(e,this,this.options.tolerance)&&(s=this._drop.call(this,i)||s),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],e.currentItem||e.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,i)))}),s},dragStart:function(e,i){e.element.parentsUntil("body").bind("scroll.droppable",function(){e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)})},drag:function(e,i){e.options.refreshPositions&&t.ui.ddmanager.prepareOffsets(e,i),t.each(t.ui.ddmanager.droppables[e.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var s,n,o,a=t.ui.intersect(e,this,this.options.tolerance),r=!a&&this.isover?"isout":a&&!this.isover?"isover":null;r&&(this.options.greedy&&(n=this.options.scope,o=this.element.parents(":data(ui-droppable)").filter(function(){return t.data(this,"ui-droppable").options.scope===n}),o.length&&(s=t.data(o[0],"ui-droppable"),s.greedyChild="isover"===r)),s&&"isover"===r&&(s.isover=!1,s.isout=!0,s._out.call(s,i)),this[r]=!0,this["isout"===r?"isover":"isout"]=!1,this["isover"===r?"_over":"_out"].call(this,i),s&&"isout"===r&&(s.isout=!1,s.isover=!0,s._over.call(s,i)))}})},dragStop:function(e,i){e.element.parentsUntil("body").unbind("scroll.droppable"),e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)}}}(jQuery),function(t){function e(t){return parseInt(t,10)||0}function i(t){return!isNaN(parseInt(t,10))}t.widget("ui.resizable",t.ui.mouse,{version:"1.10.3",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_create:function(){var e,i,s,n,o,a=this,r=this.options;if(this.element.addClass("ui-resizable"),t.extend(this,{_aspectRatio:!!r.aspectRatio,aspectRatio:r.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:r.helper||r.ghost||r.animate?r.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(t("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.data("ui-resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=r.handles||(t(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),e=this.handles.split(","),this.handles={},i=0;e.length>i;i++)s=t.trim(e[i]),o="ui-resizable-"+s,n=t("<div class='ui-resizable-handle "+o+"'></div>"),n.css({zIndex:r.zIndex}),"se"===s&&n.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[s]=".ui-resizable-"+s,this.element.append(n);this._renderAxis=function(e){var i,s,n,o;e=e||this.element;for(i in this.handles)this.handles[i].constructor===String&&(this.handles[i]=t(this.handles[i],this.element).show()),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)&&(s=t(this.handles[i],this.element),o=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),n=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),e.css(n,o),this._proportionallyResize()),t(this.handles[i]).length},this._renderAxis(this.element),this._handles=t(".ui-resizable-handle",this.element).disableSelection(),this._handles.mouseover(function(){a.resizing||(this.className&&(n=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),a.axis=n&&n[1]?n[1]:"se")}),r.autoHide&&(this._handles.hide(),t(this.element).addClass("ui-resizable-autohide").mouseenter(function(){r.disabled||(t(this).removeClass("ui-resizable-autohide"),a._handles.show())}).mouseleave(function(){r.disabled||a.resizing||(t(this).addClass("ui-resizable-autohide"),a._handles.hide())})),this._mouseInit()},_destroy:function(){this._mouseDestroy();var e,i=function(e){t(e).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),e=this.element,this.originalElement.css({position:e.css("position"),width:e.outerWidth(),height:e.outerHeight(),top:e.css("top"),left:e.css("left")}).insertAfter(e),e.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_mouseCapture:function(e){var i,s,n=!1;for(i in this.handles)s=t(this.handles[i])[0],(s===e.target||t.contains(s,e.target))&&(n=!0);return!this.options.disabled&&n},_mouseStart:function(i){var s,n,o,a=this.options,r=this.element.position(),h=this.element;return this.resizing=!0,/absolute/.test(h.css("position"))?h.css({position:"absolute",top:h.css("top"),left:h.css("left")}):h.is(".ui-draggable")&&h.css({position:"absolute",top:r.top,left:r.left}),this._renderProxy(),s=e(this.helper.css("left")),n=e(this.helper.css("top")),a.containment&&(s+=t(a.containment).scrollLeft()||0,n+=t(a.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:s,top:n},this.size=this._helper?{width:h.outerWidth(),height:h.outerHeight()}:{width:h.width(),height:h.height()},this.originalSize=this._helper?{width:h.outerWidth(),height:h.outerHeight()}:{width:h.width(),height:h.height()},this.originalPosition={left:s,top:n},this.sizeDiff={width:h.outerWidth()-h.width(),height:h.outerHeight()-h.height()},this.originalMousePosition={left:i.pageX,top:i.pageY},this.aspectRatio="number"==typeof a.aspectRatio?a.aspectRatio:this.originalSize.width/this.originalSize.height||1,o=t(".ui-resizable-"+this.axis).css("cursor"),t("body").css("cursor","auto"===o?this.axis+"-resize":o),h.addClass("ui-resizable-resizing"),this._propagate("start",i),!0},_mouseDrag:function(e){var i,s=this.helper,n={},o=this.originalMousePosition,a=this.axis,r=this.position.top,h=this.position.left,l=this.size.width,c=this.size.height,u=e.pageX-o.left||0,d=e.pageY-o.top||0,p=this._change[a];return p?(i=p.apply(this,[e,u,d]),this._updateVirtualBoundaries(e.shiftKey),(this._aspectRatio||e.shiftKey)&&(i=this._updateRatio(i,e)),i=this._respectSize(i,e),this._updateCache(i),this._propagate("resize",e),this.position.top!==r&&(n.top=this.position.top+"px"),this.position.left!==h&&(n.left=this.position.left+"px"),this.size.width!==l&&(n.width=this.size.width+"px"),this.size.height!==c&&(n.height=this.size.height+"px"),s.css(n),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),t.isEmptyObject(n)||this._trigger("resize",e,this.ui()),!1):!1},_mouseStop:function(e){this.resizing=!1;var i,s,n,o,a,r,h,l=this.options,c=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),n=s&&t.ui.hasScroll(i[0],"left")?0:c.sizeDiff.height,o=s?0:c.sizeDiff.width,a={width:c.helper.width()-o,height:c.helper.height()-n},r=parseInt(c.element.css("left"),10)+(c.position.left-c.originalPosition.left)||null,h=parseInt(c.element.css("top"),10)+(c.position.top-c.originalPosition.top)||null,l.animate||this.element.css(t.extend(a,{top:h,left:r})),c.helper.height(c.size.height),c.helper.width(c.size.width),this._helper&&!l.animate&&this._proportionallyResize()),t("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",e),this._helper&&this.helper.remove(),!1},_updateVirtualBoundaries:function(t){var e,s,n,o,a,r=this.options;a={minWidth:i(r.minWidth)?r.minWidth:0,maxWidth:i(r.maxWidth)?r.maxWidth:1/0,minHeight:i(r.minHeight)?r.minHeight:0,maxHeight:i(r.maxHeight)?r.maxHeight:1/0},(this._aspectRatio||t)&&(e=a.minHeight*this.aspectRatio,n=a.minWidth/this.aspectRatio,s=a.maxHeight*this.aspectRatio,o=a.maxWidth/this.aspectRatio,e>a.minWidth&&(a.minWidth=e),n>a.minHeight&&(a.minHeight=n),a.maxWidth>s&&(a.maxWidth=s),a.maxHeight>o&&(a.maxHeight=o)),this._vBoundaries=a},_updateCache:function(t){this.offset=this.helper.offset(),i(t.left)&&(this.position.left=t.left),i(t.top)&&(this.position.top=t.top),i(t.height)&&(this.size.height=t.height),i(t.width)&&(this.size.width=t.width)},_updateRatio:function(t){var e=this.position,s=this.size,n=this.axis;return i(t.height)?t.width=t.height*this.aspectRatio:i(t.width)&&(t.height=t.width/this.aspectRatio),"sw"===n&&(t.left=e.left+(s.width-t.width),t.top=null),"nw"===n&&(t.top=e.top+(s.height-t.height),t.left=e.left+(s.width-t.width)),t},_respectSize:function(t){var e=this._vBoundaries,s=this.axis,n=i(t.width)&&e.maxWidth&&e.maxWidth<t.width,o=i(t.height)&&e.maxHeight&&e.maxHeight<t.height,a=i(t.width)&&e.minWidth&&e.minWidth>t.width,r=i(t.height)&&e.minHeight&&e.minHeight>t.height,h=this.originalPosition.left+this.originalSize.width,l=this.position.top+this.size.height,c=/sw|nw|w/.test(s),u=/nw|ne|n/.test(s);return a&&(t.width=e.minWidth),r&&(t.height=e.minHeight),n&&(t.width=e.maxWidth),o&&(t.height=e.maxHeight),a&&c&&(t.left=h-e.minWidth),n&&c&&(t.left=h-e.maxWidth),r&&u&&(t.top=l-e.minHeight),o&&u&&(t.top=l-e.maxHeight),t.width||t.height||t.left||!t.top?t.width||t.height||t.top||!t.left||(t.left=null):t.top=null,t},_proportionallyResize:function(){if(this._proportionallyResizeElements.length){var t,e,i,s,n,o=this.helper||this.element;for(t=0;this._proportionallyResizeElements.length>t;t++){if(n=this._proportionallyResizeElements[t],!this.borderDif)for(this.borderDif=[],i=[n.css("borderTopWidth"),n.css("borderRightWidth"),n.css("borderBottomWidth"),n.css("borderLeftWidth")],s=[n.css("paddingTop"),n.css("paddingRight"),n.css("paddingBottom"),n.css("paddingLeft")],e=0;i.length>e;e++)this.borderDif[e]=(parseInt(i[e],10)||0)+(parseInt(s[e],10)||0);n.css({height:o.height()-this.borderDif[0]-this.borderDif[2]||0,width:o.width()-this.borderDif[1]-this.borderDif[3]||0})}}},_renderProxy:function(){var e=this.element,i=this.options;this.elementOffset=e.offset(),this._helper?(this.helper=this.helper||t("<div style='overflow:hidden;'></div>"),this.helper.addClass(this._helper).css({width:this.element.outerWidth()-1,height:this.element.outerHeight()-1,position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(t,e){return{width:this.originalSize.width+e}},w:function(t,e){var i=this.originalSize,s=this.originalPosition;return{left:s.left+e,width:i.width-e}},n:function(t,e,i){var s=this.originalSize,n=this.originalPosition;return{top:n.top+i,height:s.height-i}},s:function(t,e,i){return{height:this.originalSize.height+i}},se:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},sw:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[e,i,s]))},ne:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},nw:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[e,i,s]))}},_propagate:function(e,i){t.ui.plugin.call(this,e,[i,this.ui()]),"resize"!==e&&this._trigger(e,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),t.ui.plugin.add("resizable","animate",{stop:function(e){var i=t(this).data("ui-resizable"),s=i.options,n=i._proportionallyResizeElements,o=n.length&&/textarea/i.test(n[0].nodeName),a=o&&t.ui.hasScroll(n[0],"left")?0:i.sizeDiff.height,r=o?0:i.sizeDiff.width,h={width:i.size.width-r,height:i.size.height-a},l=parseInt(i.element.css("left"),10)+(i.position.left-i.originalPosition.left)||null,c=parseInt(i.element.css("top"),10)+(i.position.top-i.originalPosition.top)||null;i.element.animate(t.extend(h,c&&l?{top:c,left:l}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseInt(i.element.css("width"),10),height:parseInt(i.element.css("height"),10),top:parseInt(i.element.css("top"),10),left:parseInt(i.element.css("left"),10)};n&&n.length&&t(n[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",e)}})}}),t.ui.plugin.add("resizable","containment",{start:function(){var i,s,n,o,a,r,h,l=t(this).data("ui-resizable"),c=l.options,u=l.element,d=c.containment,p=d instanceof t?d.get(0):/parent/.test(d)?u.parent().get(0):d;p&&(l.containerElement=t(p),/document/.test(d)||d===document?(l.containerOffset={left:0,top:0},l.containerPosition={left:0,top:0},l.parentData={element:t(document),left:0,top:0,width:t(document).width(),height:t(document).height()||document.body.parentNode.scrollHeight}):(i=t(p),s=[],t(["Top","Right","Left","Bottom"]).each(function(t,n){s[t]=e(i.css("padding"+n))}),l.containerOffset=i.offset(),l.containerPosition=i.position(),l.containerSize={height:i.innerHeight()-s[3],width:i.innerWidth()-s[1]},n=l.containerOffset,o=l.containerSize.height,a=l.containerSize.width,r=t.ui.hasScroll(p,"left")?p.scrollWidth:a,h=t.ui.hasScroll(p)?p.scrollHeight:o,l.parentData={element:p,left:n.left,top:n.top,width:r,height:h}))},resize:function(e){var i,s,n,o,a=t(this).data("ui-resizable"),r=a.options,h=a.containerOffset,l=a.position,c=a._aspectRatio||e.shiftKey,u={top:0,left:0},d=a.containerElement;d[0]!==document&&/static/.test(d.css("position"))&&(u=h),l.left<(a._helper?h.left:0)&&(a.size.width=a.size.width+(a._helper?a.position.left-h.left:a.position.left-u.left),c&&(a.size.height=a.size.width/a.aspectRatio),a.position.left=r.helper?h.left:0),l.top<(a._helper?h.top:0)&&(a.size.height=a.size.height+(a._helper?a.position.top-h.top:a.position.top),c&&(a.size.width=a.size.height*a.aspectRatio),a.position.top=a._helper?h.top:0),a.offset.left=a.parentData.left+a.position.left,a.offset.top=a.parentData.top+a.position.top,i=Math.abs((a._helper?a.offset.left-u.left:a.offset.left-u.left)+a.sizeDiff.width),s=Math.abs((a._helper?a.offset.top-u.top:a.offset.top-h.top)+a.sizeDiff.height),n=a.containerElement.get(0)===a.element.parent().get(0),o=/relative|absolute/.test(a.containerElement.css("position")),n&&o&&(i-=a.parentData.left),i+a.size.width>=a.parentData.width&&(a.size.width=a.parentData.width-i,c&&(a.size.height=a.size.width/a.aspectRatio)),s+a.size.height>=a.parentData.height&&(a.size.height=a.parentData.height-s,c&&(a.size.width=a.size.height*a.aspectRatio))},stop:function(){var e=t(this).data("ui-resizable"),i=e.options,s=e.containerOffset,n=e.containerPosition,o=e.containerElement,a=t(e.helper),r=a.offset(),h=a.outerWidth()-e.sizeDiff.width,l=a.outerHeight()-e.sizeDiff.height;e._helper&&!i.animate&&/relative/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:h,height:l}),e._helper&&!i.animate&&/static/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:h,height:l})}}),t.ui.plugin.add("resizable","alsoResize",{start:function(){var e=t(this).data("ui-resizable"),i=e.options,s=function(e){t(e).each(function(){var e=t(this);e.data("ui-resizable-alsoresize",{width:parseInt(e.width(),10),height:parseInt(e.height(),10),left:parseInt(e.css("left"),10),top:parseInt(e.css("top"),10)})})};"object"!=typeof i.alsoResize||i.alsoResize.parentNode?s(i.alsoResize):i.alsoResize.length?(i.alsoResize=i.alsoResize[0],s(i.alsoResize)):t.each(i.alsoResize,function(t){s(t)})},resize:function(e,i){var s=t(this).data("ui-resizable"),n=s.options,o=s.originalSize,a=s.originalPosition,r={height:s.size.height-o.height||0,width:s.size.width-o.width||0,top:s.position.top-a.top||0,left:s.position.left-a.left||0},h=function(e,s){t(e).each(function(){var e=t(this),n=t(this).data("ui-resizable-alsoresize"),o={},a=s&&s.length?s:e.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];t.each(a,function(t,e){var i=(n[e]||0)+(r[e]||0);i&&i>=0&&(o[e]=i||null)}),e.css(o)})};"object"!=typeof n.alsoResize||n.alsoResize.nodeType?h(n.alsoResize):t.each(n.alsoResize,function(t,e){h(t,e)})},stop:function(){t(this).removeData("resizable-alsoresize")}}),t.ui.plugin.add("resizable","ghost",{start:function(){var e=t(this).data("ui-resizable"),i=e.options,s=e.size;e.ghost=e.originalElement.clone(),e.ghost.css({opacity:.25,display:"block",position:"relative",height:s.height,width:s.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass("string"==typeof i.ghost?i.ghost:""),e.ghost.appendTo(e.helper)},resize:function(){var e=t(this).data("ui-resizable");e.ghost&&e.ghost.css({position:"relative",height:e.size.height,width:e.size.width})},stop:function(){var e=t(this).data("ui-resizable");e.ghost&&e.helper&&e.helper.get(0).removeChild(e.ghost.get(0))}}),t.ui.plugin.add("resizable","grid",{resize:function(){var e=t(this).data("ui-resizable"),i=e.options,s=e.size,n=e.originalSize,o=e.originalPosition,a=e.axis,r="number"==typeof i.grid?[i.grid,i.grid]:i.grid,h=r[0]||1,l=r[1]||1,c=Math.round((s.width-n.width)/h)*h,u=Math.round((s.height-n.height)/l)*l,d=n.width+c,p=n.height+u,f=i.maxWidth&&d>i.maxWidth,g=i.maxHeight&&p>i.maxHeight,m=i.minWidth&&i.minWidth>d,v=i.minHeight&&i.minHeight>p;i.grid=r,m&&(d+=h),v&&(p+=l),f&&(d-=h),g&&(p-=l),/^(se|s|e)$/.test(a)?(e.size.width=d,e.size.height=p):/^(ne)$/.test(a)?(e.size.width=d,e.size.height=p,e.position.top=o.top-u):/^(sw)$/.test(a)?(e.size.width=d,e.size.height=p,e.position.left=o.left-c):(e.size.width=d,e.size.height=p,e.position.top=o.top-u,e.position.left=o.left-c)}})}(jQuery),function(t){t.widget("ui.selectable",t.ui.mouse,{version:"1.10.3",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch",selected:null,selecting:null,start:null,stop:null,unselected:null,unselecting:null},_create:function(){var e,i=this;this.element.addClass("ui-selectable"),this.dragged=!1,this.refresh=function(){e=t(i.options.filter,i.element[0]),e.addClass("ui-selectee"),e.each(function(){var e=t(this),i=e.offset();t.data(this,"selectable-item",{element:this,$element:e,left:i.left,top:i.top,right:i.left+e.outerWidth(),bottom:i.top+e.outerHeight(),startselected:!1,selected:e.hasClass("ui-selected"),selecting:e.hasClass("ui-selecting"),unselecting:e.hasClass("ui-unselecting")})})},this.refresh(),this.selectees=e.addClass("ui-selectee"),this._mouseInit(),this.helper=t("<div class='ui-selectable-helper'></div>")},_destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item"),this.element.removeClass("ui-selectable ui-selectable-disabled"),this._mouseDestroy()},_mouseStart:function(e){var i=this,s=this.options;this.opos=[e.pageX,e.pageY],this.options.disabled||(this.selectees=t(s.filter,this.element[0]),this._trigger("start",e),t(s.appendTo).append(this.helper),this.helper.css({left:e.pageX,top:e.pageY,width:0,height:0}),s.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var s=t.data(this,"selectable-item");s.startselected=!0,e.metaKey||e.ctrlKey||(s.$element.removeClass("ui-selected"),s.selected=!1,s.$element.addClass("ui-unselecting"),s.unselecting=!0,i._trigger("unselecting",e,{unselecting:s.element}))}),t(e.target).parents().addBack().each(function(){var s,n=t.data(this,"selectable-item");return n?(s=!e.metaKey&&!e.ctrlKey||!n.$element.hasClass("ui-selected"),n.$element.removeClass(s?"ui-unselecting":"ui-selected").addClass(s?"ui-selecting":"ui-unselecting"),n.unselecting=!s,n.selecting=s,n.selected=s,s?i._trigger("selecting",e,{selecting:n.element}):i._trigger("unselecting",e,{unselecting:n.element}),!1):undefined}))},_mouseDrag:function(e){if(this.dragged=!0,!this.options.disabled){var i,s=this,n=this.options,o=this.opos[0],a=this.opos[1],r=e.pageX,h=e.pageY;return o>r&&(i=r,r=o,o=i),a>h&&(i=h,h=a,a=i),this.helper.css({left:o,top:a,width:r-o,height:h-a}),this.selectees.each(function(){var i=t.data(this,"selectable-item"),l=!1;i&&i.element!==s.element[0]&&("touch"===n.tolerance?l=!(i.left>r||o>i.right||i.top>h||a>i.bottom):"fit"===n.tolerance&&(l=i.left>o&&r>i.right&&i.top>a&&h>i.bottom),l?(i.selected&&(i.$element.removeClass("ui-selected"),i.selected=!1),i.unselecting&&(i.$element.removeClass("ui-unselecting"),i.unselecting=!1),i.selecting||(i.$element.addClass("ui-selecting"),i.selecting=!0,s._trigger("selecting",e,{selecting:i.element}))):(i.selecting&&((e.metaKey||e.ctrlKey)&&i.startselected?(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.$element.addClass("ui-selected"),i.selected=!0):(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.startselected&&(i.$element.addClass("ui-unselecting"),i.unselecting=!0),s._trigger("unselecting",e,{unselecting:i.element}))),i.selected&&(e.metaKey||e.ctrlKey||i.startselected||(i.$element.removeClass("ui-selected"),i.selected=!1,i.$element.addClass("ui-unselecting"),i.unselecting=!0,s._trigger("unselecting",e,{unselecting:i.element})))))}),!1}},_mouseStop:function(e){var i=this;return this.dragged=!1,t(".ui-unselecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");s.$element.removeClass("ui-unselecting"),s.unselecting=!1,s.startselected=!1,i._trigger("unselected",e,{unselected:s.element})}),t(".ui-selecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");s.$element.removeClass("ui-selecting").addClass("ui-selected"),s.selecting=!1,s.selected=!0,s.startselected=!0,i._trigger("selected",e,{selected:s.element})}),this._trigger("stop",e),this.helper.remove(),!1}})}(jQuery),function(t){function e(t,e,i){return t>e&&e+i>t}function i(t){return/left|right/.test(t.css("float"))||/inline|table-cell/.test(t.css("display"))}t.widget("ui.sortable",t.ui.mouse,{version:"1.10.3",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_create:function(){var t=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?"x"===t.axis||i(this.items[0].item):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();for(var t=this.items.length-1;t>=0;t--)this.items[t].item.removeData(this.widgetName+"-item");return this},_setOption:function(e,i){"disabled"===e?(this.options[e]=i,this.widget().toggleClass("ui-sortable-disabled",!!i)):t.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(e,i){var s=null,n=!1,o=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(e),t(e.target).parents().each(function(){return t.data(this,o.widgetName+"-item")===o?(s=t(this),!1):undefined}),t.data(e.target,o.widgetName+"-item")===o&&(s=t(e.target)),s?!this.options.handle||i||(t(this.options.handle,s).find("*").addBack().each(function(){this===e.target&&(n=!0)}),n)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(e,i,s){var n,o,a=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(e),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,a.cursorAt&&this._adjustOffsetFromHelper(a.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),a.containment&&this._setContainment(),a.cursor&&"auto"!==a.cursor&&(o=this.document.find("body"),this.storedCursor=o.css("cursor"),o.css("cursor",a.cursor),this.storedStylesheet=t("<style>*{ cursor: "+a.cursor+" !important; }</style>").appendTo(o)),a.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",a.opacity)),a.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",a.zIndex)),this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",e,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(n=this.containers.length-1;n>=0;n--)this.containers[n]._trigger("activate",e,this._uiHash(this));return t.ui.ddmanager&&(t.ui.ddmanager.current=this),t.ui.ddmanager&&!a.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(e),!0},_mouseDrag:function(e){var i,s,n,o,a=this.options,r=!1;for(this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-e.pageY<a.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+a.scrollSpeed:e.pageY-this.overflowOffset.top<a.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-a.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-e.pageX<a.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+a.scrollSpeed:e.pageX-this.overflowOffset.left<a.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-a.scrollSpeed)):(e.pageY-t(document).scrollTop()<a.scrollSensitivity?r=t(document).scrollTop(t(document).scrollTop()-a.scrollSpeed):t(window).height()-(e.pageY-t(document).scrollTop())<a.scrollSensitivity&&(r=t(document).scrollTop(t(document).scrollTop()+a.scrollSpeed)),e.pageX-t(document).scrollLeft()<a.scrollSensitivity?r=t(document).scrollLeft(t(document).scrollLeft()-a.scrollSpeed):t(window).width()-(e.pageX-t(document).scrollLeft())<a.scrollSensitivity&&(r=t(document).scrollLeft(t(document).scrollLeft()+a.scrollSpeed))),r!==!1&&t.ui.ddmanager&&!a.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],n=s.item[0],o=this._intersectsWithPointer(s),o&&s.instance===this.currentContainer&&n!==this.currentItem[0]&&this.placeholder[1===o?"next":"prev"]()[0]!==n&&!t.contains(this.placeholder[0],n)&&("semi-dynamic"===this.options.type?!t.contains(this.element[0],n):!0)){if(this.direction=1===o?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;
this._rearrange(e,s),this._trigger("change",e,this._uiHash());break}return this._contactContainers(e),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),this._trigger("sort",e,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(e,i){if(e){if(t.ui.ddmanager&&!this.options.dropBehaviour&&t.ui.ddmanager.drop(this,e),this.options.revert){var s=this,n=this.placeholder.offset(),o=this.options.axis,a={};o&&"x"!==o||(a.left=n.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollLeft)),o&&"y"!==o||(a.top=n.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,t(this.helper).animate(a,parseInt(this.options.revert,10)||500,function(){s._clear(e)})}else this._clear(e,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp({target:null}),"original"===this.options.helper?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var e=this.containers.length-1;e>=0;e--)this.containers[e]._trigger("deactivate",null,this._uiHash(this)),this.containers[e].containerCache.over&&(this.containers[e]._trigger("out",null,this._uiHash(this)),this.containers[e].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),t.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?t(this.domPosition.prev).after(this.currentItem):t(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},t(i).each(function(){var i=(t(e.item||this).attr(e.attribute||"id")||"").match(e.expression||/(.+)[\-=_](.+)/);i&&s.push((e.key||i[1]+"[]")+"="+(e.key&&e.expression?i[1]:i[2]))}),!s.length&&e.key&&s.push(e.key+"="),s.join("&")},toArray:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},i.each(function(){s.push(t(e.item||this).attr(e.attribute||"id")||"")}),s},_intersectsWith:function(t){var e=this.positionAbs.left,i=e+this.helperProportions.width,s=this.positionAbs.top,n=s+this.helperProportions.height,o=t.left,a=o+t.width,r=t.top,h=r+t.height,l=this.offset.click.top,c=this.offset.click.left,u="x"===this.options.axis||s+l>r&&h>s+l,d="y"===this.options.axis||e+c>o&&a>e+c,p=u&&d;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>t[this.floating?"width":"height"]?p:e+this.helperProportions.width/2>o&&a>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>r&&h>n-this.helperProportions.height/2},_intersectsWithPointer:function(t){var i="x"===this.options.axis||e(this.positionAbs.top+this.offset.click.top,t.top,t.height),s="y"===this.options.axis||e(this.positionAbs.left+this.offset.click.left,t.left,t.width),n=i&&s,o=this._getDragVerticalDirection(),a=this._getDragHorizontalDirection();return n?this.floating?a&&"right"===a||"down"===o?2:1:o&&("down"===o?2:1):!1},_intersectsWithSides:function(t){var i=e(this.positionAbs.top+this.offset.click.top,t.top+t.height/2,t.height),s=e(this.positionAbs.left+this.offset.click.left,t.left+t.width/2,t.width),n=this._getDragVerticalDirection(),o=this._getDragHorizontalDirection();return this.floating&&o?"right"===o&&s||"left"===o&&!s:n&&("down"===n&&i||"up"===n&&!i)},_getDragVerticalDirection:function(){var t=this.positionAbs.top-this.lastPositionAbs.top;return 0!==t&&(t>0?"down":"up")},_getDragHorizontalDirection:function(){var t=this.positionAbs.left-this.lastPositionAbs.left;return 0!==t&&(t>0?"right":"left")},refresh:function(t){return this._refreshItems(t),this.refreshPositions(),this},_connectWith:function(){var t=this.options;return t.connectWith.constructor===String?[t.connectWith]:t.connectWith},_getItemsAsjQuery:function(e){var i,s,n,o,a=[],r=[],h=this._connectWith();if(h&&e)for(i=h.length-1;i>=0;i--)for(n=t(h[i]),s=n.length-1;s>=0;s--)o=t.data(n[s],this.widgetFullName),o&&o!==this&&!o.options.disabled&&r.push([t.isFunction(o.options.items)?o.options.items.call(o.element):t(o.options.items,o.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),o]);for(r.push([t.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):t(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),i=r.length-1;i>=0;i--)r[i][0].each(function(){a.push(this)});return t(a)},_removeCurrentsFromItems:function(){var e=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=t.grep(this.items,function(t){for(var i=0;e.length>i;i++)if(e[i]===t.item[0])return!1;return!0})},_refreshItems:function(e){this.items=[],this.containers=[this];var i,s,n,o,a,r,h,l,c=this.items,u=[[t.isFunction(this.options.items)?this.options.items.call(this.element[0],e,{item:this.currentItem}):t(this.options.items,this.element),this]],d=this._connectWith();if(d&&this.ready)for(i=d.length-1;i>=0;i--)for(n=t(d[i]),s=n.length-1;s>=0;s--)o=t.data(n[s],this.widgetFullName),o&&o!==this&&!o.options.disabled&&(u.push([t.isFunction(o.options.items)?o.options.items.call(o.element[0],e,{item:this.currentItem}):t(o.options.items,o.element),o]),this.containers.push(o));for(i=u.length-1;i>=0;i--)for(a=u[i][1],r=u[i][0],s=0,l=r.length;l>s;s++)h=t(r[s]),h.data(this.widgetName+"-item",a),c.push({item:h,instance:a,width:0,height:0,left:0,top:0})},refreshPositions:function(e){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,n,o;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(n=this.options.toleranceElement?t(this.options.toleranceElement,s.item):s.item,e||(s.width=n.outerWidth(),s.height=n.outerHeight()),o=n.offset(),s.left=o.left,s.top=o.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)o=this.containers[i].element.offset(),this.containers[i].containerCache.left=o.left,this.containers[i].containerCache.top=o.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(e){e=e||this;var i,s=e.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=e.currentItem[0].nodeName.toLowerCase(),n=t("<"+s+">",e.document[0]).addClass(i||e.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper");return"tr"===s?e.currentItem.children().each(function(){t("<td>&#160;</td>",e.document[0]).attr("colspan",t(this).attr("colspan")||1).appendTo(n)}):"img"===s&&n.attr("src",e.currentItem.attr("src")),i||n.css("visibility","hidden"),n},update:function(t,n){(!i||s.forcePlaceholderSize)&&(n.height()||n.height(e.currentItem.innerHeight()-parseInt(e.currentItem.css("paddingTop")||0,10)-parseInt(e.currentItem.css("paddingBottom")||0,10)),n.width()||n.width(e.currentItem.innerWidth()-parseInt(e.currentItem.css("paddingLeft")||0,10)-parseInt(e.currentItem.css("paddingRight")||0,10)))}}),e.placeholder=t(s.placeholder.element.call(e.element,e.currentItem)),e.currentItem.after(e.placeholder),s.placeholder.update(e,e.placeholder)},_contactContainers:function(s){var n,o,a,r,h,l,c,u,d,p,f=null,g=null;for(n=this.containers.length-1;n>=0;n--)if(!t.contains(this.currentItem[0],this.containers[n].element[0]))if(this._intersectsWith(this.containers[n].containerCache)){if(f&&t.contains(this.containers[n].element[0],f.element[0]))continue;f=this.containers[n],g=n}else this.containers[n].containerCache.over&&(this.containers[n]._trigger("out",s,this._uiHash(this)),this.containers[n].containerCache.over=0);if(f)if(1===this.containers.length)this.containers[g].containerCache.over||(this.containers[g]._trigger("over",s,this._uiHash(this)),this.containers[g].containerCache.over=1);else{for(a=1e4,r=null,p=f.floating||i(this.currentItem),h=p?"left":"top",l=p?"width":"height",c=this.positionAbs[h]+this.offset.click[h],o=this.items.length-1;o>=0;o--)t.contains(this.containers[g].element[0],this.items[o].item[0])&&this.items[o].item[0]!==this.currentItem[0]&&(!p||e(this.positionAbs.top+this.offset.click.top,this.items[o].top,this.items[o].height))&&(u=this.items[o].item.offset()[h],d=!1,Math.abs(u-c)>Math.abs(u+this.items[o][l]-c)&&(d=!0,u+=this.items[o][l]),a>Math.abs(u-c)&&(a=Math.abs(u-c),r=this.items[o],this.direction=d?"up":"down"));if(!r&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[g])return;r?this._rearrange(s,r,null,!0):this._rearrange(s,null,this.containers[g].element,!0),this._trigger("change",s,this._uiHash()),this.containers[g]._trigger("change",s,this._uiHash(this)),this.currentContainer=this.containers[g],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[g]._trigger("over",s,this._uiHash(this)),this.containers[g].containerCache.over=1}},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||t("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.currentItem.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;"parent"===n.containment&&(n.containment=this.helper[0].parentNode),("document"===n.containment||"window"===n.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,t("document"===n.containment?document:window).width()-this.helperProportions.width-this.margins.left,(t("document"===n.containment?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(n.containment)||(e=t(n.containment)[0],i=t(n.containment).offset(),s="hidden"!==t(e).css("overflow"),this.containment=[i.left+(parseInt(t(e).css("borderLeftWidth"),10)||0)+(parseInt(t(e).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(t(e).css("borderTopWidth"),10)||0)+(parseInt(t(e).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(e.scrollWidth,e.offsetWidth):e.offsetWidth)-(parseInt(t(e).css("borderLeftWidth"),10)||0)-(parseInt(t(e).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(t(e).css("borderTopWidth"),10)||0)-(parseInt(t(e).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,o=/(html|body)/i.test(n[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():o?0:n.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():o?0:n.scrollLeft())*s}},_generatePosition:function(e){var i,s,n=this.options,o=e.pageX,a=e.pageY,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=/(html|body)/i.test(r[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==document&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(e.pageX-this.offset.click.left<this.containment[0]&&(o=this.containment[0]+this.offset.click.left),e.pageY-this.offset.click.top<this.containment[1]&&(a=this.containment[1]+this.offset.click.top),e.pageX-this.offset.click.left>this.containment[2]&&(o=this.containment[2]+this.offset.click.left),e.pageY-this.offset.click.top>this.containment[3]&&(a=this.containment[3]+this.offset.click.top)),n.grid&&(i=this.originalPageY+Math.round((a-this.originalPageY)/n.grid[1])*n.grid[1],a=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-n.grid[1]:i+n.grid[1]:i,s=this.originalPageX+Math.round((o-this.originalPageX)/n.grid[0])*n.grid[0],o=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-n.grid[0]:s+n.grid[0]:s)),{top:a-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():h?0:r.scrollTop()),left:o-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():h?0:r.scrollLeft())}},_rearrange:function(t,e,i,s){i?i[0].appendChild(this.placeholder[0]):e.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?e.item[0]:e.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var n=this.counter;this._delay(function(){n===this.counter&&this.refreshPositions(!s)})},_clear:function(t,e){this.reverting=!1;var i,s=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(i in this._storedCSS)("auto"===this._storedCSS[i]||"static"===this._storedCSS[i])&&(this._storedCSS[i]="");this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!e&&s.push(function(t){this._trigger("receive",t,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||e||s.push(function(t){this._trigger("update",t,this._uiHash())}),this!==this.currentContainer&&(e||(s.push(function(t){this._trigger("remove",t,this._uiHash())}),s.push(function(t){return function(e){t._trigger("receive",e,this._uiHash(this))}}.call(this,this.currentContainer)),s.push(function(t){return function(e){t._trigger("update",e,this._uiHash(this))}}.call(this,this.currentContainer)))),i=this.containers.length-1;i>=0;i--)e||s.push(function(t){return function(e){t._trigger("deactivate",e,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over&&(s.push(function(t){return function(e){t._trigger("out",e,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,this.cancelHelperRemoval){if(!e){for(this._trigger("beforeStop",t,this._uiHash()),i=0;s.length>i;i++)s[i].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!1}if(e||this._trigger("beforeStop",t,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null,!e){for(i=0;s.length>i;i++)s[i].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){t.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(e){var i=e||this;return{helper:i.helper,placeholder:i.placeholder||t([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:e?e.element:null}}})}(jQuery),function(t,e){var i="ui-effects-";t.effects={effect:{}},function(t,e){function i(t,e,i){var s=u[e.type]||{};return null==t?i||!e.def?null:e.def:(t=s.floor?~~t:parseFloat(t),isNaN(t)?e.def:s.mod?(t+s.mod)%s.mod:0>t?0:t>s.max?s.max:t)}function s(i){var s=l(),n=s._rgba=[];return i=i.toLowerCase(),f(h,function(t,o){var a,r=o.re.exec(i),h=r&&o.parse(r),l=o.space||"rgba";return h?(a=s[l](h),s[c[l].cache]=a[c[l].cache],n=s._rgba=a._rgba,!1):e}),n.length?("0,0,0,0"===n.join()&&t.extend(n,o.transparent),s):o[i]}function n(t,e,i){return i=(i+1)%1,1>6*i?t+6*(e-t)*i:1>2*i?e:2>3*i?t+6*(e-t)*(2/3-i):t}var o,a="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",r=/^([\-+])=\s*(\d+\.?\d*)/,h=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[t[1],t[2],t[3],t[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[2.55*t[1],2.55*t[2],2.55*t[3],t[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(t){return[t[1],t[2]/100,t[3]/100,t[4]]}}],l=t.Color=function(e,i,s,n){return new t.Color.fn.parse(e,i,s,n)},c={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},u={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},d=l.support={},p=t("<p>")[0],f=t.each;p.style.cssText="background-color:rgba(1,1,1,.5)",d.rgba=p.style.backgroundColor.indexOf("rgba")>-1,f(c,function(t,e){e.cache="_"+t,e.props.alpha={idx:3,type:"percent",def:1}}),l.fn=t.extend(l.prototype,{parse:function(n,a,r,h){if(n===e)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=t(n).css(a),a=e);var u=this,d=t.type(n),p=this._rgba=[];return a!==e&&(n=[n,a,r,h],d="array"),"string"===d?this.parse(s(n)||o._default):"array"===d?(f(c.rgba.props,function(t,e){p[e.idx]=i(n[e.idx],e)}),this):"object"===d?(n instanceof l?f(c,function(t,e){n[e.cache]&&(u[e.cache]=n[e.cache].slice())}):f(c,function(e,s){var o=s.cache;f(s.props,function(t,e){if(!u[o]&&s.to){if("alpha"===t||null==n[t])return;u[o]=s.to(u._rgba)}u[o][e.idx]=i(n[t],e,!0)}),u[o]&&0>t.inArray(null,u[o].slice(0,3))&&(u[o][3]=1,s.from&&(u._rgba=s.from(u[o])))}),this):e},is:function(t){var i=l(t),s=!0,n=this;return f(c,function(t,o){var a,r=i[o.cache];return r&&(a=n[o.cache]||o.to&&o.to(n._rgba)||[],f(o.props,function(t,i){return null!=r[i.idx]?s=r[i.idx]===a[i.idx]:e})),s}),s},_space:function(){var t=[],e=this;return f(c,function(i,s){e[s.cache]&&t.push(i)}),t.pop()},transition:function(t,e){var s=l(t),n=s._space(),o=c[n],a=0===this.alpha()?l("transparent"):this,r=a[o.cache]||o.to(a._rgba),h=r.slice();return s=s[o.cache],f(o.props,function(t,n){var o=n.idx,a=r[o],l=s[o],c=u[n.type]||{};null!==l&&(null===a?h[o]=l:(c.mod&&(l-a>c.mod/2?a+=c.mod:a-l>c.mod/2&&(a-=c.mod)),h[o]=i((l-a)*e+a,n)))}),this[n](h)},blend:function(e){if(1===this._rgba[3])return this;var i=this._rgba.slice(),s=i.pop(),n=l(e)._rgba;return l(t.map(i,function(t,e){return(1-s)*n[e]+s*t}))},toRgbaString:function(){var e="rgba(",i=t.map(this._rgba,function(t,e){return null==t?e>2?1:0:t});return 1===i[3]&&(i.pop(),e="rgb("),e+i.join()+")"},toHslaString:function(){var e="hsla(",i=t.map(this.hsla(),function(t,e){return null==t&&(t=e>2?1:0),e&&3>e&&(t=Math.round(100*t)+"%"),t});return 1===i[3]&&(i.pop(),e="hsl("),e+i.join()+")"},toHexString:function(e){var i=this._rgba.slice(),s=i.pop();return e&&i.push(~~(255*s)),"#"+t.map(i,function(t){return t=(t||0).toString(16),1===t.length?"0"+t:t}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),l.fn.parse.prototype=l.fn,c.hsla.to=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e,i,s=t[0]/255,n=t[1]/255,o=t[2]/255,a=t[3],r=Math.max(s,n,o),h=Math.min(s,n,o),l=r-h,c=r+h,u=.5*c;return e=h===r?0:s===r?60*(n-o)/l+360:n===r?60*(o-s)/l+120:60*(s-n)/l+240,i=0===l?0:.5>=u?l/c:l/(2-c),[Math.round(e)%360,i,u,null==a?1:a]},c.hsla.from=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e=t[0]/360,i=t[1],s=t[2],o=t[3],a=.5>=s?s*(1+i):s+i-s*i,r=2*s-a;return[Math.round(255*n(r,a,e+1/3)),Math.round(255*n(r,a,e)),Math.round(255*n(r,a,e-1/3)),o]},f(c,function(s,n){var o=n.props,a=n.cache,h=n.to,c=n.from;l.fn[s]=function(s){if(h&&!this[a]&&(this[a]=h(this._rgba)),s===e)return this[a].slice();var n,r=t.type(s),u="array"===r||"object"===r?s:arguments,d=this[a].slice();return f(o,function(t,e){var s=u["object"===r?t:e.idx];null==s&&(s=d[e.idx]),d[e.idx]=i(s,e)}),c?(n=l(c(d)),n[a]=d,n):l(d)},f(o,function(e,i){l.fn[e]||(l.fn[e]=function(n){var o,a=t.type(n),h="alpha"===e?this._hsla?"hsla":"rgba":s,l=this[h](),c=l[i.idx];return"undefined"===a?c:("function"===a&&(n=n.call(this,c),a=t.type(n)),null==n&&i.empty?this:("string"===a&&(o=r.exec(n),o&&(n=c+parseFloat(o[2])*("+"===o[1]?1:-1))),l[i.idx]=n,this[h](l)))})})}),l.hook=function(e){var i=e.split(" ");f(i,function(e,i){t.cssHooks[i]={set:function(e,n){var o,a,r="";if("transparent"!==n&&("string"!==t.type(n)||(o=s(n)))){if(n=l(o||n),!d.rgba&&1!==n._rgba[3]){for(a="backgroundColor"===i?e.parentNode:e;(""===r||"transparent"===r)&&a&&a.style;)try{r=t.css(a,"backgroundColor"),a=a.parentNode}catch(h){}n=n.blend(r&&"transparent"!==r?r:"_default")}n=n.toRgbaString()}try{e.style[i]=n}catch(h){}}},t.fx.step[i]=function(e){e.colorInit||(e.start=l(e.elem,i),e.end=l(e.end),e.colorInit=!0),t.cssHooks[i].set(e.elem,e.start.transition(e.end,e.pos))}})},l.hook(a),t.cssHooks.borderColor={expand:function(t){var e={};return f(["Top","Right","Bottom","Left"],function(i,s){e["border"+s+"Color"]=t}),e}},o=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(jQuery),function(){function i(e){var i,s,n=e.ownerDocument.defaultView?e.ownerDocument.defaultView.getComputedStyle(e,null):e.currentStyle,o={};if(n&&n.length&&n[0]&&n[n[0]])for(s=n.length;s--;)i=n[s],"string"==typeof n[i]&&(o[t.camelCase(i)]=n[i]);else for(i in n)"string"==typeof n[i]&&(o[i]=n[i]);return o}function s(e,i){var s,n,a={};for(s in i)n=i[s],e[s]!==n&&(o[s]||(t.fx.step[s]||!isNaN(parseFloat(n)))&&(a[s]=n));return a}var n=["add","remove","toggle"],o={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};t.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(e,i){t.fx.step[i]=function(t){("none"!==t.end&&!t.setAttr||1===t.pos&&!t.setAttr)&&(jQuery.style(t.elem,i,t.end),t.setAttr=!0)}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.effects.animateClass=function(e,o,a,r){var h=t.speed(o,a,r);return this.queue(function(){var o,a=t(this),r=a.attr("class")||"",l=h.children?a.find("*").addBack():a;l=l.map(function(){var e=t(this);return{el:e,start:i(this)}}),o=function(){t.each(n,function(t,i){e[i]&&a[i+"Class"](e[i])})},o(),l=l.map(function(){return this.end=i(this.el[0]),this.diff=s(this.start,this.end),this}),a.attr("class",r),l=l.map(function(){var e=this,i=t.Deferred(),s=t.extend({},h,{queue:!1,complete:function(){i.resolve(e)}});return this.el.animate(this.diff,s),i.promise()}),t.when.apply(t,l.get()).done(function(){o(),t.each(arguments,function(){var e=this.el;t.each(this.diff,function(t){e.css(t,"")})}),h.complete.call(a[0])})})},t.fn.extend({addClass:function(e){return function(i,s,n,o){return s?t.effects.animateClass.call(this,{add:i},s,n,o):e.apply(this,arguments)}}(t.fn.addClass),removeClass:function(e){return function(i,s,n,o){return arguments.length>1?t.effects.animateClass.call(this,{remove:i},s,n,o):e.apply(this,arguments)}}(t.fn.removeClass),toggleClass:function(i){return function(s,n,o,a,r){return"boolean"==typeof n||n===e?o?t.effects.animateClass.call(this,n?{add:s}:{remove:s},o,a,r):i.apply(this,arguments):t.effects.animateClass.call(this,{toggle:s},n,o,a)}}(t.fn.toggleClass),switchClass:function(e,i,s,n,o){return t.effects.animateClass.call(this,{add:i,remove:e},s,n,o)}})}(),function(){function s(e,i,s,n){return t.isPlainObject(e)&&(i=e,e=e.effect),e={effect:e},null==i&&(i={}),t.isFunction(i)&&(n=i,s=null,i={}),("number"==typeof i||t.fx.speeds[i])&&(n=s,s=i,i={}),t.isFunction(s)&&(n=s,s=null),i&&t.extend(e,i),s=s||i.duration,e.duration=t.fx.off?0:"number"==typeof s?s:s in t.fx.speeds?t.fx.speeds[s]:t.fx.speeds._default,e.complete=n||i.complete,e}function n(e){return!e||"number"==typeof e||t.fx.speeds[e]?!0:"string"!=typeof e||t.effects.effect[e]?t.isFunction(e)?!0:"object"!=typeof e||e.effect?!1:!0:!0}t.extend(t.effects,{version:"1.10.3",save:function(t,e){for(var s=0;e.length>s;s++)null!==e[s]&&t.data(i+e[s],t[0].style[e[s]])},restore:function(t,s){var n,o;for(o=0;s.length>o;o++)null!==s[o]&&(n=t.data(i+s[o]),n===e&&(n=""),t.css(s[o],n))},setMode:function(t,e){return"toggle"===e&&(e=t.is(":hidden")?"show":"hide"),e},getBaseline:function(t,e){var i,s;switch(t[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=t[0]/e.height}switch(t[1]){case"left":s=0;break;case"center":s=.5;break;case"right":s=1;break;default:s=t[1]/e.width}return{x:s,y:i}},createWrapper:function(e){if(e.parent().is(".ui-effects-wrapper"))return e.parent();var i={width:e.outerWidth(!0),height:e.outerHeight(!0),"float":e.css("float")},s=t("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),n={width:e.width(),height:e.height()},o=document.activeElement;try{o.id}catch(a){o=document.body}return e.wrap(s),(e[0]===o||t.contains(e[0],o))&&t(o).focus(),s=e.parent(),"static"===e.css("position")?(s.css({position:"relative"}),e.css({position:"relative"})):(t.extend(i,{position:e.css("position"),zIndex:e.css("z-index")}),t.each(["top","left","bottom","right"],function(t,s){i[s]=e.css(s),isNaN(parseInt(i[s],10))&&(i[s]="auto")}),e.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),e.css(n),s.css(i).show()},removeWrapper:function(e){var i=document.activeElement;return e.parent().is(".ui-effects-wrapper")&&(e.parent().replaceWith(e),(e[0]===i||t.contains(e[0],i))&&t(i).focus()),e},setTransition:function(e,i,s,n){return n=n||{},t.each(i,function(t,i){var o=e.cssUnit(i);o[0]>0&&(n[i]=o[0]*s+o[1])}),n}}),t.fn.extend({effect:function(){function e(e){function s(){t.isFunction(o)&&o.call(n[0]),t.isFunction(e)&&e()}var n=t(this),o=i.complete,r=i.mode;(n.is(":hidden")?"hide"===r:"show"===r)?(n[r](),s()):a.call(n[0],i,s)}var i=s.apply(this,arguments),n=i.mode,o=i.queue,a=t.effects.effect[i.effect];return t.fx.off||!a?n?this[n](i.duration,i.complete):this.each(function(){i.complete&&i.complete.call(this)}):o===!1?this.each(e):this.queue(o||"fx",e)},show:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="show",this.effect.call(this,i)}}(t.fn.show),hide:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="hide",this.effect.call(this,i)}}(t.fn.hide),toggle:function(t){return function(e){if(n(e)||"boolean"==typeof e)return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="toggle",this.effect.call(this,i)}}(t.fn.toggle),cssUnit:function(e){var i=this.css(e),s=[];return t.each(["em","px","%","pt"],function(t,e){i.indexOf(e)>0&&(s=[parseFloat(i),e])}),s}})}(),function(){var e={};t.each(["Quad","Cubic","Quart","Quint","Expo"],function(t,i){e[i]=function(e){return Math.pow(e,t+2)}}),t.extend(e,{Sine:function(t){return 1-Math.cos(t*Math.PI/2)},Circ:function(t){return 1-Math.sqrt(1-t*t)},Elastic:function(t){return 0===t||1===t?t:-Math.pow(2,8*(t-1))*Math.sin((80*(t-1)-7.5)*Math.PI/15)},Back:function(t){return t*t*(3*t-2)},Bounce:function(t){for(var e,i=4;((e=Math.pow(2,--i))-1)/11>t;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*e-2)/22-t,2)}}),t.each(e,function(e,i){t.easing["easeIn"+e]=i,t.easing["easeOut"+e]=function(t){return 1-i(1-t)},t.easing["easeInOut"+e]=function(t){return.5>t?i(2*t)/2:1-i(-2*t+2)/2}})}()}(jQuery),function(t){var e=0,i={},s={};i.height=i.paddingTop=i.paddingBottom=i.borderTopWidth=i.borderBottomWidth="hide",s.height=s.paddingTop=s.paddingBottom=s.borderTopWidth=s.borderBottomWidth="show",t.widget("ui.accordion",{version:"1.10.3",options:{active:0,animate:{},collapsible:!1,event:"click",header:"> li > :first-child,> :not(li):even",heightStyle:"auto",icons:{activeHeader:"ui-icon-triangle-1-s",header:"ui-icon-triangle-1-e"},activate:null,beforeActivate:null},_create:function(){var e=this.options;this.prevShow=this.prevHide=t(),this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role","tablist"),e.collapsible||e.active!==!1&&null!=e.active||(e.active=0),this._processPanels(),0>e.active&&(e.active+=this.headers.length),this._refresh()},_getCreateEventData:function(){return{header:this.active,panel:this.active.length?this.active.next():t(),content:this.active.length?this.active.next():t()}},_createIcons:function(){var e=this.options.icons;e&&(t("<span>").addClass("ui-accordion-header-icon ui-icon "+e.header).prependTo(this.headers),this.active.children(".ui-accordion-header-icon").removeClass(e.header).addClass(e.activeHeader),this.headers.addClass("ui-accordion-icons"))
},_destroyIcons:function(){this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()},_destroy:function(){var t;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"),this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),this._destroyIcons(),t=this.headers.next().css("display","").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),"content"!==this.options.heightStyle&&t.css("height","")},_setOption:function(t,e){return"active"===t?(this._activate(e),undefined):("event"===t&&(this.options.event&&this._off(this.headers,this.options.event),this._setupEvents(e)),this._super(t,e),"collapsible"!==t||e||this.options.active!==!1||this._activate(0),"icons"===t&&(this._destroyIcons(),e&&this._createIcons()),"disabled"===t&&this.headers.add(this.headers.next()).toggleClass("ui-state-disabled",!!e),undefined)},_keydown:function(e){if(!e.altKey&&!e.ctrlKey){var i=t.ui.keyCode,s=this.headers.length,n=this.headers.index(e.target),o=!1;switch(e.keyCode){case i.RIGHT:case i.DOWN:o=this.headers[(n+1)%s];break;case i.LEFT:case i.UP:o=this.headers[(n-1+s)%s];break;case i.SPACE:case i.ENTER:this._eventHandler(e);break;case i.HOME:o=this.headers[0];break;case i.END:o=this.headers[s-1]}o&&(t(e.target).attr("tabIndex",-1),t(o).attr("tabIndex",0),o.focus(),e.preventDefault())}},_panelKeyDown:function(e){e.keyCode===t.ui.keyCode.UP&&e.ctrlKey&&t(e.currentTarget).prev().focus()},refresh:function(){var e=this.options;this._processPanels(),e.active===!1&&e.collapsible===!0||!this.headers.length?(e.active=!1,this.active=t()):e.active===!1?this._activate(0):this.active.length&&!t.contains(this.element[0],this.active[0])?this.headers.length===this.headers.find(".ui-state-disabled").length?(e.active=!1,this.active=t()):this._activate(Math.max(0,e.active-1)):e.active=this.headers.index(this.active),this._destroyIcons(),this._refresh()},_processPanels:function(){this.headers=this.element.find(this.options.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all"),this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide()},_refresh:function(){var i,s=this.options,n=s.heightStyle,o=this.element.parent(),a=this.accordionId="ui-accordion-"+(this.element.attr("id")||++e);this.active=this._findActive(s.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all"),this.active.next().addClass("ui-accordion-content-active").show(),this.headers.attr("role","tab").each(function(e){var i=t(this),s=i.attr("id"),n=i.next(),o=n.attr("id");s||(s=a+"-header-"+e,i.attr("id",s)),o||(o=a+"-panel-"+e,n.attr("id",o)),i.attr("aria-controls",o),n.attr("aria-labelledby",s)}).next().attr("role","tabpanel"),this.headers.not(this.active).attr({"aria-selected":"false",tabIndex:-1}).next().attr({"aria-expanded":"false","aria-hidden":"true"}).hide(),this.active.length?this.active.attr({"aria-selected":"true",tabIndex:0}).next().attr({"aria-expanded":"true","aria-hidden":"false"}):this.headers.eq(0).attr("tabIndex",0),this._createIcons(),this._setupEvents(s.event),"fill"===n?(i=o.height(),this.element.siblings(":visible").each(function(){var e=t(this),s=e.css("position");"absolute"!==s&&"fixed"!==s&&(i-=e.outerHeight(!0))}),this.headers.each(function(){i-=t(this).outerHeight(!0)}),this.headers.next().each(function(){t(this).height(Math.max(0,i-t(this).innerHeight()+t(this).height()))}).css("overflow","auto")):"auto"===n&&(i=0,this.headers.next().each(function(){i=Math.max(i,t(this).css("height","").height())}).height(i))},_activate:function(e){var i=this._findActive(e)[0];i!==this.active[0]&&(i=i||this.active[0],this._eventHandler({target:i,currentTarget:i,preventDefault:t.noop}))},_findActive:function(e){return"number"==typeof e?this.headers.eq(e):t()},_setupEvents:function(e){var i={keydown:"_keydown"};e&&t.each(e.split(" "),function(t,e){i[e]="_eventHandler"}),this._off(this.headers.add(this.headers.next())),this._on(this.headers,i),this._on(this.headers.next(),{keydown:"_panelKeyDown"}),this._hoverable(this.headers),this._focusable(this.headers)},_eventHandler:function(e){var i=this.options,s=this.active,n=t(e.currentTarget),o=n[0]===s[0],a=o&&i.collapsible,r=a?t():n.next(),h=s.next(),l={oldHeader:s,oldPanel:h,newHeader:a?t():n,newPanel:r};e.preventDefault(),o&&!i.collapsible||this._trigger("beforeActivate",e,l)===!1||(i.active=a?!1:this.headers.index(n),this.active=o?t():n,this._toggle(l),s.removeClass("ui-accordion-header-active ui-state-active"),i.icons&&s.children(".ui-accordion-header-icon").removeClass(i.icons.activeHeader).addClass(i.icons.header),o||(n.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"),i.icons&&n.children(".ui-accordion-header-icon").removeClass(i.icons.header).addClass(i.icons.activeHeader),n.next().addClass("ui-accordion-content-active")))},_toggle:function(e){var i=e.newPanel,s=this.prevShow.length?this.prevShow:e.oldPanel;this.prevShow.add(this.prevHide).stop(!0,!0),this.prevShow=i,this.prevHide=s,this.options.animate?this._animate(i,s,e):(s.hide(),i.show(),this._toggleComplete(e)),s.attr({"aria-expanded":"false","aria-hidden":"true"}),s.prev().attr("aria-selected","false"),i.length&&s.length?s.prev().attr("tabIndex",-1):i.length&&this.headers.filter(function(){return 0===t(this).attr("tabIndex")}).attr("tabIndex",-1),i.attr({"aria-expanded":"true","aria-hidden":"false"}).prev().attr({"aria-selected":"true",tabIndex:0})},_animate:function(t,e,n){var o,a,r,h=this,l=0,c=t.length&&(!e.length||t.index()<e.index()),u=this.options.animate||{},d=c&&u.down||u,p=function(){h._toggleComplete(n)};return"number"==typeof d&&(r=d),"string"==typeof d&&(a=d),a=a||d.easing||u.easing,r=r||d.duration||u.duration,e.length?t.length?(o=t.show().outerHeight(),e.animate(i,{duration:r,easing:a,step:function(t,e){e.now=Math.round(t)}}),t.hide().animate(s,{duration:r,easing:a,complete:p,step:function(t,i){i.now=Math.round(t),"height"!==i.prop?l+=i.now:"content"!==h.options.heightStyle&&(i.now=Math.round(o-e.outerHeight()-l),l=0)}}),undefined):e.animate(i,r,a,p):t.animate(s,r,a,p)},_toggleComplete:function(t){var e=t.oldPanel;e.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all"),e.length&&(e.parent()[0].className=e.parent()[0].className),this._trigger("activate",null,t)}})}(jQuery),function(t){var e=0;t.widget("ui.autocomplete",{version:"1.10.3",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},pending:0,_create:function(){var e,i,s,n=this.element[0].nodeName.toLowerCase(),o="textarea"===n,a="input"===n;this.isMultiLine=o?!0:a?!1:this.element.prop("isContentEditable"),this.valueMethod=this.element[o||a?"val":"text"],this.isNewMenu=!0,this.element.addClass("ui-autocomplete-input").attr("autocomplete","off"),this._on(this.element,{keydown:function(n){if(this.element.prop("readOnly"))return e=!0,s=!0,i=!0,undefined;e=!1,s=!1,i=!1;var o=t.ui.keyCode;switch(n.keyCode){case o.PAGE_UP:e=!0,this._move("previousPage",n);break;case o.PAGE_DOWN:e=!0,this._move("nextPage",n);break;case o.UP:e=!0,this._keyEvent("previous",n);break;case o.DOWN:e=!0,this._keyEvent("next",n);break;case o.ENTER:case o.NUMPAD_ENTER:this.menu.active&&(e=!0,n.preventDefault(),this.menu.select(n));break;case o.TAB:this.menu.active&&this.menu.select(n);break;case o.ESCAPE:this.menu.element.is(":visible")&&(this._value(this.term),this.close(n),n.preventDefault());break;default:i=!0,this._searchTimeout(n)}},keypress:function(s){if(e)return e=!1,(!this.isMultiLine||this.menu.element.is(":visible"))&&s.preventDefault(),undefined;if(!i){var n=t.ui.keyCode;switch(s.keyCode){case n.PAGE_UP:this._move("previousPage",s);break;case n.PAGE_DOWN:this._move("nextPage",s);break;case n.UP:this._keyEvent("previous",s);break;case n.DOWN:this._keyEvent("next",s)}}},input:function(t){return s?(s=!1,t.preventDefault(),undefined):(this._searchTimeout(t),undefined)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,undefined):(clearTimeout(this.searching),this.close(t),this._change(t),undefined)}}),this._initSource(),this.menu=t("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({role:null}).hide().data("ui-menu"),this._on(this.menu.element,{mousedown:function(e){e.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur});var i=this.menu.element[0];t(e.target).closest(".ui-menu-item").length||this._delay(function(){var e=this;this.document.one("mousedown",function(s){s.target===e.element[0]||s.target===i||t.contains(i,s.target)||e.close()})})},menufocus:function(e,i){if(this.isNewMenu&&(this.isNewMenu=!1,e.originalEvent&&/^mouse/.test(e.originalEvent.type)))return this.menu.blur(),this.document.one("mousemove",function(){t(e.target).trigger(e.originalEvent)}),undefined;var s=i.item.data("ui-autocomplete-item");!1!==this._trigger("focus",e,{item:s})?e.originalEvent&&/^key/.test(e.originalEvent.type)&&this._value(s.value):this.liveRegion.text(s.value)},menuselect:function(t,e){var i=e.item.data("ui-autocomplete-item"),s=this.previous;this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s,this.selectedItem=i})),!1!==this._trigger("select",t,{item:i})&&this._value(i.value),this.term=this._value(),this.close(t),this.selectedItem=i}}),this.liveRegion=t("<span>",{role:"status","aria-live":"polite"}).addClass("ui-helper-hidden-accessible").insertBefore(this.element),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(t,e){this._super(t,e),"source"===t&&this._initSource(),"appendTo"===t&&this.menu.element.appendTo(this._appendTo()),"disabled"===t&&e&&this.xhr&&this.xhr.abort()},_appendTo:function(){var e=this.options.appendTo;return e&&(e=e.jquery||e.nodeType?t(e):this.document.find(e).eq(0)),e||(e=this.element.closest(".ui-front")),e.length||(e=this.document[0].body),e},_initSource:function(){var e,i,s=this;t.isArray(this.options.source)?(e=this.options.source,this.source=function(i,s){s(t.ui.autocomplete.filter(e,i.term))}):"string"==typeof this.options.source?(i=this.options.source,this.source=function(e,n){s.xhr&&s.xhr.abort(),s.xhr=t.ajax({url:i,data:e,dataType:"json",success:function(t){n(t)},error:function(){n([])}})}):this.source=this.options.source},_searchTimeout:function(t){clearTimeout(this.searching),this.searching=this._delay(function(){this.term!==this._value()&&(this.selectedItem=null,this.search(null,t))},this.options.delay)},search:function(t,e){return t=null!=t?t:this._value(),this.term=this._value(),t.length<this.options.minLength?this.close(e):this._trigger("search",e)!==!1?this._search(t):undefined},_search:function(t){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:t},this._response())},_response:function(){var t=this,i=++e;return function(s){i===e&&t.__response(s),t.pending--,t.pending||t.element.removeClass("ui-autocomplete-loading")}},__response:function(t){t&&(t=this._normalize(t)),this._trigger("response",null,{content:t}),!this.options.disabled&&t&&t.length&&!this.cancelSearch?(this._suggest(t),this._trigger("open")):this._close()},close:function(t){this.cancelSearch=!0,this._close(t)},_close:function(t){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",t))},_change:function(t){this.previous!==this._value()&&this._trigger("change",t,{item:this.selectedItem})},_normalize:function(e){return e.length&&e[0].label&&e[0].value?e:t.map(e,function(e){return"string"==typeof e?{label:e,value:e}:t.extend({label:e.label||e.value,value:e.value||e.label},e)})},_suggest:function(e){var i=this.menu.element.empty();this._renderMenu(i,e),this.isNewMenu=!0,this.menu.refresh(),i.show(),this._resizeMenu(),i.position(t.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next()},_resizeMenu:function(){var t=this.menu.element;t.outerWidth(Math.max(t.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(e,i){var s=this;t.each(i,function(t,i){s._renderItemData(e,i)})},_renderItemData:function(t,e){return this._renderItem(t,e).data("ui-autocomplete-item",e)},_renderItem:function(e,i){return t("<li>").append(t("<a>").text(i.label)).appendTo(e)},_move:function(t,e){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(t)||this.menu.isLastItem()&&/^next/.test(t)?(this._value(this.term),this.menu.blur(),undefined):(this.menu[t](e),undefined):(this.search(null,e),undefined)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(t,e){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(t,e),e.preventDefault())}}),t.extend(t.ui.autocomplete,{escapeRegex:function(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(e,i){var s=RegExp(t.ui.autocomplete.escapeRegex(i),"i");return t.grep(e,function(t){return s.test(t.label||t.value||t)})}}),t.widget("ui.autocomplete",t.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(t){return t+(t>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(t){var e;this._superApply(arguments),this.options.disabled||this.cancelSearch||(e=t&&t.length?this.options.messages.results(t.length):this.options.messages.noResults,this.liveRegion.text(e))}})}(jQuery),function(t){var e,i,s,n,o="ui-button ui-widget ui-state-default ui-corner-all",a="ui-state-hover ui-state-active ",r="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",h=function(){var e=t(this);setTimeout(function(){e.find(":ui-button").button("refresh")},1)},l=function(e){var i=e.name,s=e.form,n=t([]);return i&&(i=i.replace(/'/g,"\\'"),n=s?t(s).find("[name='"+i+"']"):t("[name='"+i+"']",e.ownerDocument).filter(function(){return!this.form})),n};t.widget("ui.button",{version:"1.10.3",defaultElement:"<button>",options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset"+this.eventNamespace).bind("reset"+this.eventNamespace,h),"boolean"!=typeof this.options.disabled?this.options.disabled=!!this.element.prop("disabled"):this.element.prop("disabled",this.options.disabled),this._determineButtonType(),this.hasTitle=!!this.buttonElement.attr("title");var a=this,r=this.options,c="checkbox"===this.type||"radio"===this.type,u=c?"":"ui-state-active",d="ui-state-focus";null===r.label&&(r.label="input"===this.type?this.buttonElement.val():this.buttonElement.html()),this._hoverable(this.buttonElement),this.buttonElement.addClass(o).attr("role","button").bind("mouseenter"+this.eventNamespace,function(){r.disabled||this===e&&t(this).addClass("ui-state-active")}).bind("mouseleave"+this.eventNamespace,function(){r.disabled||t(this).removeClass(u)}).bind("click"+this.eventNamespace,function(t){r.disabled&&(t.preventDefault(),t.stopImmediatePropagation())}),this.element.bind("focus"+this.eventNamespace,function(){a.buttonElement.addClass(d)}).bind("blur"+this.eventNamespace,function(){a.buttonElement.removeClass(d)}),c&&(this.element.bind("change"+this.eventNamespace,function(){n||a.refresh()}),this.buttonElement.bind("mousedown"+this.eventNamespace,function(t){r.disabled||(n=!1,i=t.pageX,s=t.pageY)}).bind("mouseup"+this.eventNamespace,function(t){r.disabled||(i!==t.pageX||s!==t.pageY)&&(n=!0)})),"checkbox"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){return r.disabled||n?!1:undefined}):"radio"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){if(r.disabled||n)return!1;t(this).addClass("ui-state-active"),a.buttonElement.attr("aria-pressed","true");var e=a.element[0];l(e).not(e).map(function(){return t(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")}):(this.buttonElement.bind("mousedown"+this.eventNamespace,function(){return r.disabled?!1:(t(this).addClass("ui-state-active"),e=this,a.document.one("mouseup",function(){e=null}),undefined)}).bind("mouseup"+this.eventNamespace,function(){return r.disabled?!1:(t(this).removeClass("ui-state-active"),undefined)}).bind("keydown"+this.eventNamespace,function(e){return r.disabled?!1:((e.keyCode===t.ui.keyCode.SPACE||e.keyCode===t.ui.keyCode.ENTER)&&t(this).addClass("ui-state-active"),undefined)}).bind("keyup"+this.eventNamespace+" blur"+this.eventNamespace,function(){t(this).removeClass("ui-state-active")}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(e){e.keyCode===t.ui.keyCode.SPACE&&t(this).click()})),this._setOption("disabled",r.disabled),this._resetButton()},_determineButtonType:function(){var t,e,i;this.type=this.element.is("[type=checkbox]")?"checkbox":this.element.is("[type=radio]")?"radio":this.element.is("input")?"input":"button","checkbox"===this.type||"radio"===this.type?(t=this.element.parents().last(),e="label[for='"+this.element.attr("id")+"']",this.buttonElement=t.find(e),this.buttonElement.length||(t=t.length?t.siblings():this.element.siblings(),this.buttonElement=t.filter(e),this.buttonElement.length||(this.buttonElement=t.find(e))),this.element.addClass("ui-helper-hidden-accessible"),i=this.element.is(":checked"),i&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.prop("aria-pressed",i)):this.buttonElement=this.element},widget:function(){return this.buttonElement},_destroy:function(){this.element.removeClass("ui-helper-hidden-accessible"),this.buttonElement.removeClass(o+" "+a+" "+r).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()),this.hasTitle||this.buttonElement.removeAttr("title")},_setOption:function(t,e){return this._super(t,e),"disabled"===t?(e?this.element.prop("disabled",!0):this.element.prop("disabled",!1),undefined):(this._resetButton(),undefined)},refresh:function(){var e=this.element.is("input, button")?this.element.is(":disabled"):this.element.hasClass("ui-button-disabled");e!==this.options.disabled&&this._setOption("disabled",e),"radio"===this.type?l(this.element[0]).each(function(){t(this).is(":checked")?t(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):t(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}):"checkbox"===this.type&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"))},_resetButton:function(){if("input"===this.type)return this.options.label&&this.element.val(this.options.label),undefined;var e=this.buttonElement.removeClass(r),i=t("<span></span>",this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(e.empty()).text(),s=this.options.icons,n=s.primary&&s.secondary,o=[];s.primary||s.secondary?(this.options.text&&o.push("ui-button-text-icon"+(n?"s":s.primary?"-primary":"-secondary")),s.primary&&e.prepend("<span class='ui-button-icon-primary ui-icon "+s.primary+"'></span>"),s.secondary&&e.append("<span class='ui-button-icon-secondary ui-icon "+s.secondary+"'></span>"),this.options.text||(o.push(n?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||e.attr("title",t.trim(i)))):o.push("ui-button-text-only"),e.addClass(o.join(" "))}}),t.widget("ui.buttonset",{version:"1.10.3",options:{items:"button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(t,e){"disabled"===t&&this.buttons.button("option",t,e),this._super(t,e)},refresh:function(){var e="rtl"===this.element.css("direction");this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return t(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(e?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(e?"ui-corner-left":"ui-corner-right").end().end()},_destroy:function(){this.element.removeClass("ui-buttonset"),this.buttons.map(function(){return t(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy")}})}(jQuery),function(t,e){function i(){this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},t.extend(this._defaults,this.regional[""]),this.dpDiv=s(t("<div id='"+this._mainDivId+"' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))}function s(e){var i="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return e.delegate(i,"mouseout",function(){t(this).removeClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&t(this).removeClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&t(this).removeClass("ui-datepicker-next-hover")}).delegate(i,"mouseover",function(){t.datepicker._isDisabledDatepicker(o.inline?e.parent()[0]:o.input[0])||(t(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),t(this).addClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&t(this).addClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&t(this).addClass("ui-datepicker-next-hover"))})}function n(e,i){t.extend(e,i);for(var s in i)null==i[s]&&(e[s]=i[s]);return e}t.extend(t.ui,{datepicker:{version:"1.10.3"}});var o,a="datepicker";t.extend(i.prototype,{markerClassName:"hasDatepicker",maxRows:4,_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(t){return n(this._defaults,t||{}),this},_attachDatepicker:function(e,i){var s,n,o;s=e.nodeName.toLowerCase(),n="div"===s||"span"===s,e.id||(this.uuid+=1,e.id="dp"+this.uuid),o=this._newInst(t(e),n),o.settings=t.extend({},i||{}),"input"===s?this._connectDatepicker(e,o):n&&this._inlineDatepicker(e,o)},_newInst:function(e,i){var n=e[0].id.replace(/([^A-Za-z0-9_\-])/g,"\\\\$1");return{id:n,input:e,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:i,dpDiv:i?s(t("<div class='"+this._inlineClass+" ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")):this.dpDiv}},_connectDatepicker:function(e,i){var s=t(e);i.append=t([]),i.trigger=t([]),s.hasClass(this.markerClassName)||(this._attachments(s,i),s.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp),this._autoSize(i),t.data(e,a,i),i.settings.disabled&&this._disableDatepicker(e))},_attachments:function(e,i){var s,n,o,a=this._get(i,"appendText"),r=this._get(i,"isRTL");i.append&&i.append.remove(),a&&(i.append=t("<span class='"+this._appendClass+"'>"+a+"</span>"),e[r?"before":"after"](i.append)),e.unbind("focus",this._showDatepicker),i.trigger&&i.trigger.remove(),s=this._get(i,"showOn"),("focus"===s||"both"===s)&&e.focus(this._showDatepicker),("button"===s||"both"===s)&&(n=this._get(i,"buttonText"),o=this._get(i,"buttonImage"),i.trigger=t(this._get(i,"buttonImageOnly")?t("<img/>").addClass(this._triggerClass).attr({src:o,alt:n,title:n}):t("<button type='button'></button>").addClass(this._triggerClass).html(o?t("<img/>").attr({src:o,alt:n,title:n}):n)),e[r?"before":"after"](i.trigger),i.trigger.click(function(){return t.datepicker._datepickerShowing&&t.datepicker._lastInput===e[0]?t.datepicker._hideDatepicker():t.datepicker._datepickerShowing&&t.datepicker._lastInput!==e[0]?(t.datepicker._hideDatepicker(),t.datepicker._showDatepicker(e[0])):t.datepicker._showDatepicker(e[0]),!1}))},_autoSize:function(t){if(this._get(t,"autoSize")&&!t.inline){var e,i,s,n,o=new Date(2009,11,20),a=this._get(t,"dateFormat");a.match(/[DM]/)&&(e=function(t){for(i=0,s=0,n=0;t.length>n;n++)t[n].length>i&&(i=t[n].length,s=n);return s},o.setMonth(e(this._get(t,a.match(/MM/)?"monthNames":"monthNamesShort"))),o.setDate(e(this._get(t,a.match(/DD/)?"dayNames":"dayNamesShort"))+20-o.getDay())),t.input.attr("size",this._formatDate(t,o).length)}},_inlineDatepicker:function(e,i){var s=t(e);s.hasClass(this.markerClassName)||(s.addClass(this.markerClassName).append(i.dpDiv),t.data(e,a,i),this._setDate(i,this._getDefaultDate(i),!0),this._updateDatepicker(i),this._updateAlternate(i),i.settings.disabled&&this._disableDatepicker(e),i.dpDiv.css("display","block"))},_dialogDatepicker:function(e,i,s,o,r){var h,l,c,u,d,p=this._dialogInst;return p||(this.uuid+=1,h="dp"+this.uuid,this._dialogInput=t("<input type='text' id='"+h+"' style='position: absolute; top: -100px; width: 0px;'/>"),this._dialogInput.keydown(this._doKeyDown),t("body").append(this._dialogInput),p=this._dialogInst=this._newInst(this._dialogInput,!1),p.settings={},t.data(this._dialogInput[0],a,p)),n(p.settings,o||{}),i=i&&i.constructor===Date?this._formatDate(p,i):i,this._dialogInput.val(i),this._pos=r?r.length?r:[r.pageX,r.pageY]:null,this._pos||(l=document.documentElement.clientWidth,c=document.documentElement.clientHeight,u=document.documentElement.scrollLeft||document.body.scrollLeft,d=document.documentElement.scrollTop||document.body.scrollTop,this._pos=[l/2-100+u,c/2-150+d]),this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),p.settings.onSelect=s,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),t.blockUI&&t.blockUI(this.dpDiv),t.data(this._dialogInput[0],a,p),this},_destroyDatepicker:function(e){var i,s=t(e),n=t.data(e,a);s.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),t.removeData(e,a),"input"===i?(n.append.remove(),n.trigger.remove(),s.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):("div"===i||"span"===i)&&s.removeClass(this.markerClassName).empty())},_enableDatepicker:function(e){var i,s,n=t(e),o=t.data(e,a);n.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),"input"===i?(e.disabled=!1,o.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().removeClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)),this._disabledInputs=t.map(this._disabledInputs,function(t){return t===e?null:t}))},_disableDatepicker:function(e){var i,s,n=t(e),o=t.data(e,a);n.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),"input"===i?(e.disabled=!0,o.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().addClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)),this._disabledInputs=t.map(this._disabledInputs,function(t){return t===e?null:t}),this._disabledInputs[this._disabledInputs.length]=e)},_isDisabledDatepicker:function(t){if(!t)return!1;for(var e=0;this._disabledInputs.length>e;e++)if(this._disabledInputs[e]===t)return!0;return!1},_getInst:function(e){try{return t.data(e,a)}catch(i){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(i,s,o){var a,r,h,l,c=this._getInst(i);return 2===arguments.length&&"string"==typeof s?"defaults"===s?t.extend({},t.datepicker._defaults):c?"all"===s?t.extend({},c.settings):this._get(c,s):null:(a=s||{},"string"==typeof s&&(a={},a[s]=o),c&&(this._curInst===c&&this._hideDatepicker(),r=this._getDateDatepicker(i,!0),h=this._getMinMaxDate(c,"min"),l=this._getMinMaxDate(c,"max"),n(c.settings,a),null!==h&&a.dateFormat!==e&&a.minDate===e&&(c.settings.minDate=this._formatDate(c,h)),null!==l&&a.dateFormat!==e&&a.maxDate===e&&(c.settings.maxDate=this._formatDate(c,l)),"disabled"in a&&(a.disabled?this._disableDatepicker(i):this._enableDatepicker(i)),this._attachments(t(i),c),this._autoSize(c),this._setDate(c,r),this._updateAlternate(c),this._updateDatepicker(c)),e)},_changeDatepicker:function(t,e,i){this._optionDatepicker(t,e,i)},_refreshDatepicker:function(t){var e=this._getInst(t);e&&this._updateDatepicker(e)},_setDateDatepicker:function(t,e){var i=this._getInst(t);i&&(this._setDate(i,e),this._updateDatepicker(i),this._updateAlternate(i))},_getDateDatepicker:function(t,e){var i=this._getInst(t);return i&&!i.inline&&this._setDateFromField(i,e),i?this._getDate(i):null},_doKeyDown:function(e){var i,s,n,o=t.datepicker._getInst(e.target),a=!0,r=o.dpDiv.is(".ui-datepicker-rtl");if(o._keyEvent=!0,t.datepicker._datepickerShowing)switch(e.keyCode){case 9:t.datepicker._hideDatepicker(),a=!1;break;case 13:return n=t("td."+t.datepicker._dayOverClass+":not(."+t.datepicker._currentClass+")",o.dpDiv),n[0]&&t.datepicker._selectDay(e.target,o.selectedMonth,o.selectedYear,n[0]),i=t.datepicker._get(o,"onSelect"),i?(s=t.datepicker._formatDate(o),i.apply(o.input?o.input[0]:null,[s,o])):t.datepicker._hideDatepicker(),!1;
case 27:t.datepicker._hideDatepicker();break;case 33:t.datepicker._adjustDate(e.target,e.ctrlKey?-t.datepicker._get(o,"stepBigMonths"):-t.datepicker._get(o,"stepMonths"),"M");break;case 34:t.datepicker._adjustDate(e.target,e.ctrlKey?+t.datepicker._get(o,"stepBigMonths"):+t.datepicker._get(o,"stepMonths"),"M");break;case 35:(e.ctrlKey||e.metaKey)&&t.datepicker._clearDate(e.target),a=e.ctrlKey||e.metaKey;break;case 36:(e.ctrlKey||e.metaKey)&&t.datepicker._gotoToday(e.target),a=e.ctrlKey||e.metaKey;break;case 37:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,r?1:-1,"D"),a=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&t.datepicker._adjustDate(e.target,e.ctrlKey?-t.datepicker._get(o,"stepBigMonths"):-t.datepicker._get(o,"stepMonths"),"M");break;case 38:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,-7,"D"),a=e.ctrlKey||e.metaKey;break;case 39:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,r?-1:1,"D"),a=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&t.datepicker._adjustDate(e.target,e.ctrlKey?+t.datepicker._get(o,"stepBigMonths"):+t.datepicker._get(o,"stepMonths"),"M");break;case 40:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,7,"D"),a=e.ctrlKey||e.metaKey;break;default:a=!1}else 36===e.keyCode&&e.ctrlKey?t.datepicker._showDatepicker(this):a=!1;a&&(e.preventDefault(),e.stopPropagation())},_doKeyPress:function(i){var s,n,o=t.datepicker._getInst(i.target);return t.datepicker._get(o,"constrainInput")?(s=t.datepicker._possibleChars(t.datepicker._get(o,"dateFormat")),n=String.fromCharCode(null==i.charCode?i.keyCode:i.charCode),i.ctrlKey||i.metaKey||" ">n||!s||s.indexOf(n)>-1):e},_doKeyUp:function(e){var i,s=t.datepicker._getInst(e.target);if(s.input.val()!==s.lastVal)try{i=t.datepicker.parseDate(t.datepicker._get(s,"dateFormat"),s.input?s.input.val():null,t.datepicker._getFormatConfig(s)),i&&(t.datepicker._setDateFromField(s),t.datepicker._updateAlternate(s),t.datepicker._updateDatepicker(s))}catch(n){}return!0},_showDatepicker:function(e){if(e=e.target||e,"input"!==e.nodeName.toLowerCase()&&(e=t("input",e.parentNode)[0]),!t.datepicker._isDisabledDatepicker(e)&&t.datepicker._lastInput!==e){var i,s,o,a,r,h,l;i=t.datepicker._getInst(e),t.datepicker._curInst&&t.datepicker._curInst!==i&&(t.datepicker._curInst.dpDiv.stop(!0,!0),i&&t.datepicker._datepickerShowing&&t.datepicker._hideDatepicker(t.datepicker._curInst.input[0])),s=t.datepicker._get(i,"beforeShow"),o=s?s.apply(e,[e,i]):{},o!==!1&&(n(i.settings,o),i.lastVal=null,t.datepicker._lastInput=e,t.datepicker._setDateFromField(i),t.datepicker._inDialog&&(e.value=""),t.datepicker._pos||(t.datepicker._pos=t.datepicker._findPos(e),t.datepicker._pos[1]+=e.offsetHeight),a=!1,t(e).parents().each(function(){return a|="fixed"===t(this).css("position"),!a}),r={left:t.datepicker._pos[0],top:t.datepicker._pos[1]},t.datepicker._pos=null,i.dpDiv.empty(),i.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),t.datepicker._updateDatepicker(i),r=t.datepicker._checkOffset(i,r,a),i.dpDiv.css({position:t.datepicker._inDialog&&t.blockUI?"static":a?"fixed":"absolute",display:"none",left:r.left+"px",top:r.top+"px"}),i.inline||(h=t.datepicker._get(i,"showAnim"),l=t.datepicker._get(i,"duration"),i.dpDiv.zIndex(t(e).zIndex()+1),t.datepicker._datepickerShowing=!0,t.effects&&t.effects.effect[h]?i.dpDiv.show(h,t.datepicker._get(i,"showOptions"),l):i.dpDiv[h||"show"](h?l:null),t.datepicker._shouldFocusInput(i)&&i.input.focus(),t.datepicker._curInst=i))}},_updateDatepicker:function(e){this.maxRows=4,o=e,e.dpDiv.empty().append(this._generateHTML(e)),this._attachHandlers(e),e.dpDiv.find("."+this._dayOverClass+" a").mouseover();var i,s=this._getNumberOfMonths(e),n=s[1],a=17;e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),n>1&&e.dpDiv.addClass("ui-datepicker-multi-"+n).css("width",a*n+"em"),e.dpDiv[(1!==s[0]||1!==s[1]?"add":"remove")+"Class"]("ui-datepicker-multi"),e.dpDiv[(this._get(e,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),e===t.datepicker._curInst&&t.datepicker._datepickerShowing&&t.datepicker._shouldFocusInput(e)&&e.input.focus(),e.yearshtml&&(i=e.yearshtml,setTimeout(function(){i===e.yearshtml&&e.yearshtml&&e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml),i=e.yearshtml=null},0))},_shouldFocusInput:function(t){return t.input&&t.input.is(":visible")&&!t.input.is(":disabled")&&!t.input.is(":focus")},_checkOffset:function(e,i,s){var n=e.dpDiv.outerWidth(),o=e.dpDiv.outerHeight(),a=e.input?e.input.outerWidth():0,r=e.input?e.input.outerHeight():0,h=document.documentElement.clientWidth+(s?0:t(document).scrollLeft()),l=document.documentElement.clientHeight+(s?0:t(document).scrollTop());return i.left-=this._get(e,"isRTL")?n-a:0,i.left-=s&&i.left===e.input.offset().left?t(document).scrollLeft():0,i.top-=s&&i.top===e.input.offset().top+r?t(document).scrollTop():0,i.left-=Math.min(i.left,i.left+n>h&&h>n?Math.abs(i.left+n-h):0),i.top-=Math.min(i.top,i.top+o>l&&l>o?Math.abs(o+r):0),i},_findPos:function(e){for(var i,s=this._getInst(e),n=this._get(s,"isRTL");e&&("hidden"===e.type||1!==e.nodeType||t.expr.filters.hidden(e));)e=e[n?"previousSibling":"nextSibling"];return i=t(e).offset(),[i.left,i.top]},_hideDatepicker:function(e){var i,s,n,o,r=this._curInst;!r||e&&r!==t.data(e,a)||this._datepickerShowing&&(i=this._get(r,"showAnim"),s=this._get(r,"duration"),n=function(){t.datepicker._tidyDialog(r)},t.effects&&(t.effects.effect[i]||t.effects[i])?r.dpDiv.hide(i,t.datepicker._get(r,"showOptions"),s,n):r.dpDiv["slideDown"===i?"slideUp":"fadeIn"===i?"fadeOut":"hide"](i?s:null,n),i||n(),this._datepickerShowing=!1,o=this._get(r,"onClose"),o&&o.apply(r.input?r.input[0]:null,[r.input?r.input.val():"",r]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),t.blockUI&&(t.unblockUI(),t("body").append(this.dpDiv))),this._inDialog=!1)},_tidyDialog:function(t){t.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(e){if(t.datepicker._curInst){var i=t(e.target),s=t.datepicker._getInst(i[0]);(i[0].id!==t.datepicker._mainDivId&&0===i.parents("#"+t.datepicker._mainDivId).length&&!i.hasClass(t.datepicker.markerClassName)&&!i.closest("."+t.datepicker._triggerClass).length&&t.datepicker._datepickerShowing&&(!t.datepicker._inDialog||!t.blockUI)||i.hasClass(t.datepicker.markerClassName)&&t.datepicker._curInst!==s)&&t.datepicker._hideDatepicker()}},_adjustDate:function(e,i,s){var n=t(e),o=this._getInst(n[0]);this._isDisabledDatepicker(n[0])||(this._adjustInstDate(o,i+("M"===s?this._get(o,"showCurrentAtPos"):0),s),this._updateDatepicker(o))},_gotoToday:function(e){var i,s=t(e),n=this._getInst(s[0]);this._get(n,"gotoCurrent")&&n.currentDay?(n.selectedDay=n.currentDay,n.drawMonth=n.selectedMonth=n.currentMonth,n.drawYear=n.selectedYear=n.currentYear):(i=new Date,n.selectedDay=i.getDate(),n.drawMonth=n.selectedMonth=i.getMonth(),n.drawYear=n.selectedYear=i.getFullYear()),this._notifyChange(n),this._adjustDate(s)},_selectMonthYear:function(e,i,s){var n=t(e),o=this._getInst(n[0]);o["selected"+("M"===s?"Month":"Year")]=o["draw"+("M"===s?"Month":"Year")]=parseInt(i.options[i.selectedIndex].value,10),this._notifyChange(o),this._adjustDate(n)},_selectDay:function(e,i,s,n){var o,a=t(e);t(n).hasClass(this._unselectableClass)||this._isDisabledDatepicker(a[0])||(o=this._getInst(a[0]),o.selectedDay=o.currentDay=t("a",n).html(),o.selectedMonth=o.currentMonth=i,o.selectedYear=o.currentYear=s,this._selectDate(e,this._formatDate(o,o.currentDay,o.currentMonth,o.currentYear)))},_clearDate:function(e){var i=t(e);this._selectDate(i,"")},_selectDate:function(e,i){var s,n=t(e),o=this._getInst(n[0]);i=null!=i?i:this._formatDate(o),o.input&&o.input.val(i),this._updateAlternate(o),s=this._get(o,"onSelect"),s?s.apply(o.input?o.input[0]:null,[i,o]):o.input&&o.input.trigger("change"),o.inline?this._updateDatepicker(o):(this._hideDatepicker(),this._lastInput=o.input[0],"object"!=typeof o.input[0]&&o.input.focus(),this._lastInput=null)},_updateAlternate:function(e){var i,s,n,o=this._get(e,"altField");o&&(i=this._get(e,"altFormat")||this._get(e,"dateFormat"),s=this._getDate(e),n=this.formatDate(i,s,this._getFormatConfig(e)),t(o).each(function(){t(this).val(n)}))},noWeekends:function(t){var e=t.getDay();return[e>0&&6>e,""]},iso8601Week:function(t){var e,i=new Date(t.getTime());return i.setDate(i.getDate()+4-(i.getDay()||7)),e=i.getTime(),i.setMonth(0),i.setDate(1),Math.floor(Math.round((e-i)/864e5)/7)+1},parseDate:function(i,s,n){if(null==i||null==s)throw"Invalid arguments";if(s="object"==typeof s?""+s:s+"",""===s)return null;var o,a,r,h,l=0,c=(n?n.shortYearCutoff:null)||this._defaults.shortYearCutoff,u="string"!=typeof c?c:(new Date).getFullYear()%100+parseInt(c,10),d=(n?n.dayNamesShort:null)||this._defaults.dayNamesShort,p=(n?n.dayNames:null)||this._defaults.dayNames,f=(n?n.monthNamesShort:null)||this._defaults.monthNamesShort,g=(n?n.monthNames:null)||this._defaults.monthNames,m=-1,v=-1,_=-1,b=-1,y=!1,w=function(t){var e=i.length>o+1&&i.charAt(o+1)===t;return e&&o++,e},k=function(t){var e=w(t),i="@"===t?14:"!"===t?20:"y"===t&&e?4:"o"===t?3:2,n=RegExp("^\\d{1,"+i+"}"),o=s.substring(l).match(n);if(!o)throw"Missing number at position "+l;return l+=o[0].length,parseInt(o[0],10)},x=function(i,n,o){var a=-1,r=t.map(w(i)?o:n,function(t,e){return[[e,t]]}).sort(function(t,e){return-(t[1].length-e[1].length)});if(t.each(r,function(t,i){var n=i[1];return s.substr(l,n.length).toLowerCase()===n.toLowerCase()?(a=i[0],l+=n.length,!1):e}),-1!==a)return a+1;throw"Unknown name at position "+l},D=function(){if(s.charAt(l)!==i.charAt(o))throw"Unexpected literal at position "+l;l++};for(o=0;i.length>o;o++)if(y)"'"!==i.charAt(o)||w("'")?D():y=!1;else switch(i.charAt(o)){case"d":_=k("d");break;case"D":x("D",d,p);break;case"o":b=k("o");break;case"m":v=k("m");break;case"M":v=x("M",f,g);break;case"y":m=k("y");break;case"@":h=new Date(k("@")),m=h.getFullYear(),v=h.getMonth()+1,_=h.getDate();break;case"!":h=new Date((k("!")-this._ticksTo1970)/1e4),m=h.getFullYear(),v=h.getMonth()+1,_=h.getDate();break;case"'":w("'")?D():y=!0;break;default:D()}if(s.length>l&&(r=s.substr(l),!/^\s+/.test(r)))throw"Extra/unparsed characters found in date: "+r;if(-1===m?m=(new Date).getFullYear():100>m&&(m+=(new Date).getFullYear()-(new Date).getFullYear()%100+(u>=m?0:-100)),b>-1)for(v=1,_=b;;){if(a=this._getDaysInMonth(m,v-1),a>=_)break;v++,_-=a}if(h=this._daylightSavingAdjust(new Date(m,v-1,_)),h.getFullYear()!==m||h.getMonth()+1!==v||h.getDate()!==_)throw"Invalid date";return h},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:1e7*60*60*24*(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925)),formatDate:function(t,e,i){if(!e)return"";var s,n=(i?i.dayNamesShort:null)||this._defaults.dayNamesShort,o=(i?i.dayNames:null)||this._defaults.dayNames,a=(i?i.monthNamesShort:null)||this._defaults.monthNamesShort,r=(i?i.monthNames:null)||this._defaults.monthNames,h=function(e){var i=t.length>s+1&&t.charAt(s+1)===e;return i&&s++,i},l=function(t,e,i){var s=""+e;if(h(t))for(;i>s.length;)s="0"+s;return s},c=function(t,e,i,s){return h(t)?s[e]:i[e]},u="",d=!1;if(e)for(s=0;t.length>s;s++)if(d)"'"!==t.charAt(s)||h("'")?u+=t.charAt(s):d=!1;else switch(t.charAt(s)){case"d":u+=l("d",e.getDate(),2);break;case"D":u+=c("D",e.getDay(),n,o);break;case"o":u+=l("o",Math.round((new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime()-new Date(e.getFullYear(),0,0).getTime())/864e5),3);break;case"m":u+=l("m",e.getMonth()+1,2);break;case"M":u+=c("M",e.getMonth(),a,r);break;case"y":u+=h("y")?e.getFullYear():(10>e.getYear()%100?"0":"")+e.getYear()%100;break;case"@":u+=e.getTime();break;case"!":u+=1e4*e.getTime()+this._ticksTo1970;break;case"'":h("'")?u+="'":d=!0;break;default:u+=t.charAt(s)}return u},_possibleChars:function(t){var e,i="",s=!1,n=function(i){var s=t.length>e+1&&t.charAt(e+1)===i;return s&&e++,s};for(e=0;t.length>e;e++)if(s)"'"!==t.charAt(e)||n("'")?i+=t.charAt(e):s=!1;else switch(t.charAt(e)){case"d":case"m":case"y":case"@":i+="0123456789";break;case"D":case"M":return null;case"'":n("'")?i+="'":s=!0;break;default:i+=t.charAt(e)}return i},_get:function(t,i){return t.settings[i]!==e?t.settings[i]:this._defaults[i]},_setDateFromField:function(t,e){if(t.input.val()!==t.lastVal){var i=this._get(t,"dateFormat"),s=t.lastVal=t.input?t.input.val():null,n=this._getDefaultDate(t),o=n,a=this._getFormatConfig(t);try{o=this.parseDate(i,s,a)||n}catch(r){s=e?"":s}t.selectedDay=o.getDate(),t.drawMonth=t.selectedMonth=o.getMonth(),t.drawYear=t.selectedYear=o.getFullYear(),t.currentDay=s?o.getDate():0,t.currentMonth=s?o.getMonth():0,t.currentYear=s?o.getFullYear():0,this._adjustInstDate(t)}},_getDefaultDate:function(t){return this._restrictMinMax(t,this._determineDate(t,this._get(t,"defaultDate"),new Date))},_determineDate:function(e,i,s){var n=function(t){var e=new Date;return e.setDate(e.getDate()+t),e},o=function(i){try{return t.datepicker.parseDate(t.datepicker._get(e,"dateFormat"),i,t.datepicker._getFormatConfig(e))}catch(s){}for(var n=(i.toLowerCase().match(/^c/)?t.datepicker._getDate(e):null)||new Date,o=n.getFullYear(),a=n.getMonth(),r=n.getDate(),h=/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,l=h.exec(i);l;){switch(l[2]||"d"){case"d":case"D":r+=parseInt(l[1],10);break;case"w":case"W":r+=7*parseInt(l[1],10);break;case"m":case"M":a+=parseInt(l[1],10),r=Math.min(r,t.datepicker._getDaysInMonth(o,a));break;case"y":case"Y":o+=parseInt(l[1],10),r=Math.min(r,t.datepicker._getDaysInMonth(o,a))}l=h.exec(i)}return new Date(o,a,r)},a=null==i||""===i?s:"string"==typeof i?o(i):"number"==typeof i?isNaN(i)?s:n(i):new Date(i.getTime());return a=a&&"Invalid Date"==""+a?s:a,a&&(a.setHours(0),a.setMinutes(0),a.setSeconds(0),a.setMilliseconds(0)),this._daylightSavingAdjust(a)},_daylightSavingAdjust:function(t){return t?(t.setHours(t.getHours()>12?t.getHours()+2:0),t):null},_setDate:function(t,e,i){var s=!e,n=t.selectedMonth,o=t.selectedYear,a=this._restrictMinMax(t,this._determineDate(t,e,new Date));t.selectedDay=t.currentDay=a.getDate(),t.drawMonth=t.selectedMonth=t.currentMonth=a.getMonth(),t.drawYear=t.selectedYear=t.currentYear=a.getFullYear(),n===t.selectedMonth&&o===t.selectedYear||i||this._notifyChange(t),this._adjustInstDate(t),t.input&&t.input.val(s?"":this._formatDate(t))},_getDate:function(t){var e=!t.currentYear||t.input&&""===t.input.val()?null:this._daylightSavingAdjust(new Date(t.currentYear,t.currentMonth,t.currentDay));return e},_attachHandlers:function(e){var i=this._get(e,"stepMonths"),s="#"+e.id.replace(/\\\\/g,"\\");e.dpDiv.find("[data-handler]").map(function(){var e={prev:function(){t.datepicker._adjustDate(s,-i,"M")},next:function(){t.datepicker._adjustDate(s,+i,"M")},hide:function(){t.datepicker._hideDatepicker()},today:function(){t.datepicker._gotoToday(s)},selectDay:function(){return t.datepicker._selectDay(s,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return t.datepicker._selectMonthYear(s,this,"M"),!1},selectYear:function(){return t.datepicker._selectMonthYear(s,this,"Y"),!1}};t(this).bind(this.getAttribute("data-event"),e[this.getAttribute("data-handler")])})},_generateHTML:function(t){var e,i,s,n,o,a,r,h,l,c,u,d,p,f,g,m,v,_,b,y,w,k,x,D,C,I,P,T,M,S,z,A,H,E,N,W,O,F,R,L=new Date,j=this._daylightSavingAdjust(new Date(L.getFullYear(),L.getMonth(),L.getDate())),Y=this._get(t,"isRTL"),B=this._get(t,"showButtonPanel"),V=this._get(t,"hideIfNoPrevNext"),K=this._get(t,"navigationAsDateFormat"),U=this._getNumberOfMonths(t),q=this._get(t,"showCurrentAtPos"),Q=this._get(t,"stepMonths"),X=1!==U[0]||1!==U[1],$=this._daylightSavingAdjust(t.currentDay?new Date(t.currentYear,t.currentMonth,t.currentDay):new Date(9999,9,9)),G=this._getMinMaxDate(t,"min"),J=this._getMinMaxDate(t,"max"),Z=t.drawMonth-q,te=t.drawYear;if(0>Z&&(Z+=12,te--),J)for(e=this._daylightSavingAdjust(new Date(J.getFullYear(),J.getMonth()-U[0]*U[1]+1,J.getDate())),e=G&&G>e?G:e;this._daylightSavingAdjust(new Date(te,Z,1))>e;)Z--,0>Z&&(Z=11,te--);for(t.drawMonth=Z,t.drawYear=te,i=this._get(t,"prevText"),i=K?this.formatDate(i,this._daylightSavingAdjust(new Date(te,Z-Q,1)),this._getFormatConfig(t)):i,s=this._canAdjustMonth(t,-1,te,Z)?"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>":V?"":"<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>",n=this._get(t,"nextText"),n=K?this.formatDate(n,this._daylightSavingAdjust(new Date(te,Z+Q,1)),this._getFormatConfig(t)):n,o=this._canAdjustMonth(t,1,te,Z)?"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>":V?"":"<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>",a=this._get(t,"currentText"),r=this._get(t,"gotoCurrent")&&t.currentDay?$:j,a=K?this.formatDate(a,r,this._getFormatConfig(t)):a,h=t.inline?"":"<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>"+this._get(t,"closeText")+"</button>",l=B?"<div class='ui-datepicker-buttonpane ui-widget-content'>"+(Y?h:"")+(this._isInRange(t,r)?"<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>"+a+"</button>":"")+(Y?"":h)+"</div>":"",c=parseInt(this._get(t,"firstDay"),10),c=isNaN(c)?0:c,u=this._get(t,"showWeek"),d=this._get(t,"dayNames"),p=this._get(t,"dayNamesMin"),f=this._get(t,"monthNames"),g=this._get(t,"monthNamesShort"),m=this._get(t,"beforeShowDay"),v=this._get(t,"showOtherMonths"),_=this._get(t,"selectOtherMonths"),b=this._getDefaultDate(t),y="",k=0;U[0]>k;k++){for(x="",this.maxRows=4,D=0;U[1]>D;D++){if(C=this._daylightSavingAdjust(new Date(te,Z,t.selectedDay)),I=" ui-corner-all",P="",X){if(P+="<div class='ui-datepicker-group",U[1]>1)switch(D){case 0:P+=" ui-datepicker-group-first",I=" ui-corner-"+(Y?"right":"left");break;case U[1]-1:P+=" ui-datepicker-group-last",I=" ui-corner-"+(Y?"left":"right");break;default:P+=" ui-datepicker-group-middle",I=""}P+="'>"}for(P+="<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix"+I+"'>"+(/all|left/.test(I)&&0===k?Y?o:s:"")+(/all|right/.test(I)&&0===k?Y?s:o:"")+this._generateMonthYearHeader(t,Z,te,G,J,k>0||D>0,f,g)+"</div><table class='ui-datepicker-calendar'><thead>"+"<tr>",T=u?"<th class='ui-datepicker-week-col'>"+this._get(t,"weekHeader")+"</th>":"",w=0;7>w;w++)M=(w+c)%7,T+="<th"+((w+c+6)%7>=5?" class='ui-datepicker-week-end'":"")+">"+"<span title='"+d[M]+"'>"+p[M]+"</span></th>";for(P+=T+"</tr></thead><tbody>",S=this._getDaysInMonth(te,Z),te===t.selectedYear&&Z===t.selectedMonth&&(t.selectedDay=Math.min(t.selectedDay,S)),z=(this._getFirstDayOfMonth(te,Z)-c+7)%7,A=Math.ceil((z+S)/7),H=X?this.maxRows>A?this.maxRows:A:A,this.maxRows=H,E=this._daylightSavingAdjust(new Date(te,Z,1-z)),N=0;H>N;N++){for(P+="<tr>",W=u?"<td class='ui-datepicker-week-col'>"+this._get(t,"calculateWeek")(E)+"</td>":"",w=0;7>w;w++)O=m?m.apply(t.input?t.input[0]:null,[E]):[!0,""],F=E.getMonth()!==Z,R=F&&!_||!O[0]||G&&G>E||J&&E>J,W+="<td class='"+((w+c+6)%7>=5?" ui-datepicker-week-end":"")+(F?" ui-datepicker-other-month":"")+(E.getTime()===C.getTime()&&Z===t.selectedMonth&&t._keyEvent||b.getTime()===E.getTime()&&b.getTime()===C.getTime()?" "+this._dayOverClass:"")+(R?" "+this._unselectableClass+" ui-state-disabled":"")+(F&&!v?"":" "+O[1]+(E.getTime()===$.getTime()?" "+this._currentClass:"")+(E.getTime()===j.getTime()?" ui-datepicker-today":""))+"'"+(F&&!v||!O[2]?"":" title='"+O[2].replace(/'/g,"&#39;")+"'")+(R?"":" data-handler='selectDay' data-event='click' data-month='"+E.getMonth()+"' data-year='"+E.getFullYear()+"'")+">"+(F&&!v?"&#xa0;":R?"<span class='ui-state-default'>"+E.getDate()+"</span>":"<a class='ui-state-default"+(E.getTime()===j.getTime()?" ui-state-highlight":"")+(E.getTime()===$.getTime()?" ui-state-active":"")+(F?" ui-priority-secondary":"")+"' href='#'>"+E.getDate()+"</a>")+"</td>",E.setDate(E.getDate()+1),E=this._daylightSavingAdjust(E);P+=W+"</tr>"}Z++,Z>11&&(Z=0,te++),P+="</tbody></table>"+(X?"</div>"+(U[0]>0&&D===U[1]-1?"<div class='ui-datepicker-row-break'></div>":""):""),x+=P}y+=x}return y+=l,t._keyEvent=!1,y},_generateMonthYearHeader:function(t,e,i,s,n,o,a,r){var h,l,c,u,d,p,f,g,m=this._get(t,"changeMonth"),v=this._get(t,"changeYear"),_=this._get(t,"showMonthAfterYear"),b="<div class='ui-datepicker-title'>",y="";if(o||!m)y+="<span class='ui-datepicker-month'>"+a[e]+"</span>";else{for(h=s&&s.getFullYear()===i,l=n&&n.getFullYear()===i,y+="<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",c=0;12>c;c++)(!h||c>=s.getMonth())&&(!l||n.getMonth()>=c)&&(y+="<option value='"+c+"'"+(c===e?" selected='selected'":"")+">"+r[c]+"</option>");y+="</select>"}if(_||(b+=y+(!o&&m&&v?"":"&#xa0;")),!t.yearshtml)if(t.yearshtml="",o||!v)b+="<span class='ui-datepicker-year'>"+i+"</span>";else{for(u=this._get(t,"yearRange").split(":"),d=(new Date).getFullYear(),p=function(t){var e=t.match(/c[+\-].*/)?i+parseInt(t.substring(1),10):t.match(/[+\-].*/)?d+parseInt(t,10):parseInt(t,10);return isNaN(e)?d:e},f=p(u[0]),g=Math.max(f,p(u[1]||"")),f=s?Math.max(f,s.getFullYear()):f,g=n?Math.min(g,n.getFullYear()):g,t.yearshtml+="<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";g>=f;f++)t.yearshtml+="<option value='"+f+"'"+(f===i?" selected='selected'":"")+">"+f+"</option>";t.yearshtml+="</select>",b+=t.yearshtml,t.yearshtml=null}return b+=this._get(t,"yearSuffix"),_&&(b+=(!o&&m&&v?"":"&#xa0;")+y),b+="</div>"},_adjustInstDate:function(t,e,i){var s=t.drawYear+("Y"===i?e:0),n=t.drawMonth+("M"===i?e:0),o=Math.min(t.selectedDay,this._getDaysInMonth(s,n))+("D"===i?e:0),a=this._restrictMinMax(t,this._daylightSavingAdjust(new Date(s,n,o)));t.selectedDay=a.getDate(),t.drawMonth=t.selectedMonth=a.getMonth(),t.drawYear=t.selectedYear=a.getFullYear(),("M"===i||"Y"===i)&&this._notifyChange(t)},_restrictMinMax:function(t,e){var i=this._getMinMaxDate(t,"min"),s=this._getMinMaxDate(t,"max"),n=i&&i>e?i:e;return s&&n>s?s:n},_notifyChange:function(t){var e=this._get(t,"onChangeMonthYear");e&&e.apply(t.input?t.input[0]:null,[t.selectedYear,t.selectedMonth+1,t])},_getNumberOfMonths:function(t){var e=this._get(t,"numberOfMonths");return null==e?[1,1]:"number"==typeof e?[1,e]:e},_getMinMaxDate:function(t,e){return this._determineDate(t,this._get(t,e+"Date"),null)},_getDaysInMonth:function(t,e){return 32-this._daylightSavingAdjust(new Date(t,e,32)).getDate()},_getFirstDayOfMonth:function(t,e){return new Date(t,e,1).getDay()},_canAdjustMonth:function(t,e,i,s){var n=this._getNumberOfMonths(t),o=this._daylightSavingAdjust(new Date(i,s+(0>e?e:n[0]*n[1]),1));return 0>e&&o.setDate(this._getDaysInMonth(o.getFullYear(),o.getMonth())),this._isInRange(t,o)},_isInRange:function(t,e){var i,s,n=this._getMinMaxDate(t,"min"),o=this._getMinMaxDate(t,"max"),a=null,r=null,h=this._get(t,"yearRange");return h&&(i=h.split(":"),s=(new Date).getFullYear(),a=parseInt(i[0],10),r=parseInt(i[1],10),i[0].match(/[+\-].*/)&&(a+=s),i[1].match(/[+\-].*/)&&(r+=s)),(!n||e.getTime()>=n.getTime())&&(!o||e.getTime()<=o.getTime())&&(!a||e.getFullYear()>=a)&&(!r||r>=e.getFullYear())},_getFormatConfig:function(t){var e=this._get(t,"shortYearCutoff");return e="string"!=typeof e?e:(new Date).getFullYear()%100+parseInt(e,10),{shortYearCutoff:e,dayNamesShort:this._get(t,"dayNamesShort"),dayNames:this._get(t,"dayNames"),monthNamesShort:this._get(t,"monthNamesShort"),monthNames:this._get(t,"monthNames")}},_formatDate:function(t,e,i,s){e||(t.currentDay=t.selectedDay,t.currentMonth=t.selectedMonth,t.currentYear=t.selectedYear);var n=e?"object"==typeof e?e:this._daylightSavingAdjust(new Date(s,i,e)):this._daylightSavingAdjust(new Date(t.currentYear,t.currentMonth,t.currentDay));return this.formatDate(this._get(t,"dateFormat"),n,this._getFormatConfig(t))}}),t.fn.datepicker=function(e){if(!this.length)return this;t.datepicker.initialized||(t(document).mousedown(t.datepicker._checkExternalClick),t.datepicker.initialized=!0),0===t("#"+t.datepicker._mainDivId).length&&t("body").append(t.datepicker.dpDiv);var i=Array.prototype.slice.call(arguments,1);return"string"!=typeof e||"isDisabled"!==e&&"getDate"!==e&&"widget"!==e?"option"===e&&2===arguments.length&&"string"==typeof arguments[1]?t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this[0]].concat(i)):this.each(function(){"string"==typeof e?t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this].concat(i)):t.datepicker._attachDatepicker(this,e)}):t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this[0]].concat(i))},t.datepicker=new i,t.datepicker.initialized=!1,t.datepicker.uuid=(new Date).getTime(),t.datepicker.version="1.10.3"}(jQuery),function(t){var e={buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},i={maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0};t.widget("ui.dialog",{version:"1.10.3",options:{appendTo:"body",autoOpen:!0,buttons:[],closeOnEscape:!0,closeText:"close",dialogClass:"",draggable:!0,hide:null,height:"auto",maxHeight:null,maxWidth:null,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(e){var i=t(this).css(e).offset().top;0>i&&t(this).css("top",e.top-i)}},resizable:!0,show:null,title:null,width:300,beforeClose:null,close:null,drag:null,dragStart:null,dragStop:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null},_create:function(){this.originalCss={display:this.element[0].style.display,width:this.element[0].style.width,minHeight:this.element[0].style.minHeight,maxHeight:this.element[0].style.maxHeight,height:this.element[0].style.height},this.originalPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.originalTitle=this.element.attr("title"),this.options.title=this.options.title||this.originalTitle,this._createWrapper(),this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog),this._createTitlebar(),this._createButtonPane(),this.options.draggable&&t.fn.draggable&&this._makeDraggable(),this.options.resizable&&t.fn.resizable&&this._makeResizable(),this._isOpen=!1},_init:function(){this.options.autoOpen&&this.open()},_appendTo:function(){var e=this.options.appendTo;return e&&(e.jquery||e.nodeType)?t(e):this.document.find(e||"body").eq(0)},_destroy:function(){var t,e=this.originalPosition;this._destroyOverlay(),this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach(),this.uiDialog.stop(!0,!0).remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),t=e.parent.children().eq(e.index),t.length&&t[0]!==this.element[0]?t.before(this.element):e.parent.append(this.element)},widget:function(){return this.uiDialog},disable:t.noop,enable:t.noop,close:function(e){var i=this;this._isOpen&&this._trigger("beforeClose",e)!==!1&&(this._isOpen=!1,this._destroyOverlay(),this.opener.filter(":focusable").focus().length||t(this.document[0].activeElement).blur(),this._hide(this.uiDialog,this.options.hide,function(){i._trigger("close",e)}))},isOpen:function(){return this._isOpen},moveToTop:function(){this._moveToTop()},_moveToTop:function(t,e){var i=!!this.uiDialog.nextAll(":visible").insertBefore(this.uiDialog).length;return i&&!e&&this._trigger("focus",t),i},open:function(){var e=this;return this._isOpen?(this._moveToTop()&&this._focusTabbable(),undefined):(this._isOpen=!0,this.opener=t(this.document[0].activeElement),this._size(),this._position(),this._createOverlay(),this._moveToTop(null,!0),this._show(this.uiDialog,this.options.show,function(){e._focusTabbable(),e._trigger("focus")}),this._trigger("open"),undefined)},_focusTabbable:function(){var t=this.element.find("[autofocus]");t.length||(t=this.element.find(":tabbable")),t.length||(t=this.uiDialogButtonPane.find(":tabbable")),t.length||(t=this.uiDialogTitlebarClose.filter(":tabbable")),t.length||(t=this.uiDialog),t.eq(0).focus()},_keepFocus:function(e){function i(){var e=this.document[0].activeElement,i=this.uiDialog[0]===e||t.contains(this.uiDialog[0],e);i||this._focusTabbable()}e.preventDefault(),i.call(this),this._delay(i)},_createWrapper:function(){this.uiDialog=t("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front "+this.options.dialogClass).hide().attr({tabIndex:-1,role:"dialog"}).appendTo(this._appendTo()),this._on(this.uiDialog,{keydown:function(e){if(this.options.closeOnEscape&&!e.isDefaultPrevented()&&e.keyCode&&e.keyCode===t.ui.keyCode.ESCAPE)return e.preventDefault(),this.close(e),undefined;if(e.keyCode===t.ui.keyCode.TAB){var i=this.uiDialog.find(":tabbable"),s=i.filter(":first"),n=i.filter(":last");e.target!==n[0]&&e.target!==this.uiDialog[0]||e.shiftKey?e.target!==s[0]&&e.target!==this.uiDialog[0]||!e.shiftKey||(n.focus(1),e.preventDefault()):(s.focus(1),e.preventDefault())}},mousedown:function(t){this._moveToTop(t)&&this._focusTabbable()}}),this.element.find("[aria-describedby]").length||this.uiDialog.attr({"aria-describedby":this.element.uniqueId().attr("id")})},_createTitlebar:function(){var e;this.uiDialogTitlebar=t("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog),this._on(this.uiDialogTitlebar,{mousedown:function(e){t(e.target).closest(".ui-dialog-titlebar-close")||this.uiDialog.focus()}}),this.uiDialogTitlebarClose=t("<button></button>").button({label:this.options.closeText,icons:{primary:"ui-icon-closethick"},text:!1}).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar),this._on(this.uiDialogTitlebarClose,{click:function(t){t.preventDefault(),this.close(t)}}),e=t("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar),this._title(e),this.uiDialog.attr({"aria-labelledby":e.attr("id")})},_title:function(t){this.options.title||t.html("&#160;"),t.text(this.options.title)},_createButtonPane:function(){this.uiDialogButtonPane=t("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),this.uiButtonSet=t("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane),this._createButtons()},_createButtons:function(){var e=this,i=this.options.buttons;return this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),t.isEmptyObject(i)||t.isArray(i)&&!i.length?(this.uiDialog.removeClass("ui-dialog-buttons"),undefined):(t.each(i,function(i,s){var n,o;s=t.isFunction(s)?{click:s,text:i}:s,s=t.extend({type:"button"},s),n=s.click,s.click=function(){n.apply(e.element[0],arguments)},o={icons:s.icons,text:s.showText},delete s.icons,delete s.showText,t("<button></button>",s).button(o).appendTo(e.uiButtonSet)}),this.uiDialog.addClass("ui-dialog-buttons"),this.uiDialogButtonPane.appendTo(this.uiDialog),undefined)},_makeDraggable:function(){function e(t){return{position:t.position,offset:t.offset}}var i=this,s=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(s,n){t(this).addClass("ui-dialog-dragging"),i._blockFrames(),i._trigger("dragStart",s,e(n))},drag:function(t,s){i._trigger("drag",t,e(s))},stop:function(n,o){s.position=[o.position.left-i.document.scrollLeft(),o.position.top-i.document.scrollTop()],t(this).removeClass("ui-dialog-dragging"),i._unblockFrames(),i._trigger("dragStop",n,e(o))}})},_makeResizable:function(){function e(t){return{originalPosition:t.originalPosition,originalSize:t.originalSize,position:t.position,size:t.size}
}var i=this,s=this.options,n=s.resizable,o=this.uiDialog.css("position"),a="string"==typeof n?n:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:s.maxWidth,maxHeight:s.maxHeight,minWidth:s.minWidth,minHeight:this._minHeight(),handles:a,start:function(s,n){t(this).addClass("ui-dialog-resizing"),i._blockFrames(),i._trigger("resizeStart",s,e(n))},resize:function(t,s){i._trigger("resize",t,e(s))},stop:function(n,o){s.height=t(this).height(),s.width=t(this).width(),t(this).removeClass("ui-dialog-resizing"),i._unblockFrames(),i._trigger("resizeStop",n,e(o))}}).css("position",o)},_minHeight:function(){var t=this.options;return"auto"===t.height?t.minHeight:Math.min(t.minHeight,t.height)},_position:function(){var t=this.uiDialog.is(":visible");t||this.uiDialog.show(),this.uiDialog.position(this.options.position),t||this.uiDialog.hide()},_setOptions:function(s){var n=this,o=!1,a={};t.each(s,function(t,s){n._setOption(t,s),t in e&&(o=!0),t in i&&(a[t]=s)}),o&&(this._size(),this._position()),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option",a)},_setOption:function(t,e){var i,s,n=this.uiDialog;"dialogClass"===t&&n.removeClass(this.options.dialogClass).addClass(e),"disabled"!==t&&(this._super(t,e),"appendTo"===t&&this.uiDialog.appendTo(this._appendTo()),"buttons"===t&&this._createButtons(),"closeText"===t&&this.uiDialogTitlebarClose.button({label:""+e}),"draggable"===t&&(i=n.is(":data(ui-draggable)"),i&&!e&&n.draggable("destroy"),!i&&e&&this._makeDraggable()),"position"===t&&this._position(),"resizable"===t&&(s=n.is(":data(ui-resizable)"),s&&!e&&n.resizable("destroy"),s&&"string"==typeof e&&n.resizable("option","handles",e),s||e===!1||this._makeResizable()),"title"===t&&this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))},_size:function(){var t,e,i,s=this.options;this.element.show().css({width:"auto",minHeight:0,maxHeight:"none",height:0}),s.minWidth>s.width&&(s.width=s.minWidth),t=this.uiDialog.css({height:"auto",width:s.width}).outerHeight(),e=Math.max(0,s.minHeight-t),i="number"==typeof s.maxHeight?Math.max(0,s.maxHeight-t):"none","auto"===s.height?this.element.css({minHeight:e,maxHeight:i,height:"auto"}):this.element.height(Math.max(0,s.height-t)),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())},_blockFrames:function(){this.iframeBlocks=this.document.find("iframe").map(function(){var e=t(this);return t("<div>").css({position:"absolute",width:e.outerWidth(),height:e.outerHeight()}).appendTo(e.parent()).offset(e.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_allowInteraction:function(e){return t(e.target).closest(".ui-dialog").length?!0:!!t(e.target).closest(".ui-datepicker").length},_createOverlay:function(){if(this.options.modal){var e=this,i=this.widgetFullName;t.ui.dialog.overlayInstances||this._delay(function(){t.ui.dialog.overlayInstances&&this.document.bind("focusin.dialog",function(s){e._allowInteraction(s)||(s.preventDefault(),t(".ui-dialog:visible:last .ui-dialog-content").data(i)._focusTabbable())})}),this.overlay=t("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo()),this._on(this.overlay,{mousedown:"_keepFocus"}),t.ui.dialog.overlayInstances++}},_destroyOverlay:function(){this.options.modal&&this.overlay&&(t.ui.dialog.overlayInstances--,t.ui.dialog.overlayInstances||this.document.unbind("focusin.dialog"),this.overlay.remove(),this.overlay=null)}}),t.ui.dialog.overlayInstances=0,t.uiBackCompat!==!1&&t.widget("ui.dialog",t.ui.dialog,{_position:function(){var e,i=this.options.position,s=[],n=[0,0];i?(("string"==typeof i||"object"==typeof i&&"0"in i)&&(s=i.split?i.split(" "):[i[0],i[1]],1===s.length&&(s[1]=s[0]),t.each(["left","top"],function(t,e){+s[t]===s[t]&&(n[t]=s[t],s[t]=e)}),i={my:s[0]+(0>n[0]?n[0]:"+"+n[0])+" "+s[1]+(0>n[1]?n[1]:"+"+n[1]),at:s.join(" ")}),i=t.extend({},t.ui.dialog.prototype.options.position,i)):i=t.ui.dialog.prototype.options.position,e=this.uiDialog.is(":visible"),e||this.uiDialog.show(),this.uiDialog.position(i),e||this.uiDialog.hide()}})}(jQuery),function(t){var e=/up|down|vertical/,i=/up|left|vertical|horizontal/;t.effects.effect.blind=function(s,n){var o,a,r,h=t(this),l=["position","top","bottom","left","right","height","width"],c=t.effects.setMode(h,s.mode||"hide"),u=s.direction||"up",d=e.test(u),p=d?"height":"width",f=d?"top":"left",g=i.test(u),m={},v="show"===c;h.parent().is(".ui-effects-wrapper")?t.effects.save(h.parent(),l):t.effects.save(h,l),h.show(),o=t.effects.createWrapper(h).css({overflow:"hidden"}),a=o[p](),r=parseFloat(o.css(f))||0,m[p]=v?a:0,g||(h.css(d?"bottom":"right",0).css(d?"top":"left","auto").css({position:"absolute"}),m[f]=v?r:a+r),v&&(o.css(p,0),g||o.css(f,r+a)),o.animate(m,{duration:s.duration,easing:s.easing,queue:!1,complete:function(){"hide"===c&&h.hide(),t.effects.restore(h,l),t.effects.removeWrapper(h),n()}})}}(jQuery),function(t){t.effects.effect.bounce=function(e,i){var s,n,o,a=t(this),r=["position","top","bottom","left","right","height","width"],h=t.effects.setMode(a,e.mode||"effect"),l="hide"===h,c="show"===h,u=e.direction||"up",d=e.distance,p=e.times||5,f=2*p+(c||l?1:0),g=e.duration/f,m=e.easing,v="up"===u||"down"===u?"top":"left",_="up"===u||"left"===u,b=a.queue(),y=b.length;for((c||l)&&r.push("opacity"),t.effects.save(a,r),a.show(),t.effects.createWrapper(a),d||(d=a["top"===v?"outerHeight":"outerWidth"]()/3),c&&(o={opacity:1},o[v]=0,a.css("opacity",0).css(v,_?2*-d:2*d).animate(o,g,m)),l&&(d/=Math.pow(2,p-1)),o={},o[v]=0,s=0;p>s;s++)n={},n[v]=(_?"-=":"+=")+d,a.animate(n,g,m).animate(o,g,m),d=l?2*d:d/2;l&&(n={opacity:0},n[v]=(_?"-=":"+=")+d,a.animate(n,g,m)),a.queue(function(){l&&a.hide(),t.effects.restore(a,r),t.effects.removeWrapper(a),i()}),y>1&&b.splice.apply(b,[1,0].concat(b.splice(y,f+1))),a.dequeue()}}(jQuery),function(t){t.effects.effect.clip=function(e,i){var s,n,o,a=t(this),r=["position","top","bottom","left","right","height","width"],h=t.effects.setMode(a,e.mode||"hide"),l="show"===h,c=e.direction||"vertical",u="vertical"===c,d=u?"height":"width",p=u?"top":"left",f={};t.effects.save(a,r),a.show(),s=t.effects.createWrapper(a).css({overflow:"hidden"}),n="IMG"===a[0].tagName?s:a,o=n[d](),l&&(n.css(d,0),n.css(p,o/2)),f[d]=l?o:0,f[p]=l?0:o/2,n.animate(f,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){l||a.hide(),t.effects.restore(a,r),t.effects.removeWrapper(a),i()}})}}(jQuery),function(t){t.effects.effect.drop=function(e,i){var s,n=t(this),o=["position","top","bottom","left","right","opacity","height","width"],a=t.effects.setMode(n,e.mode||"hide"),r="show"===a,h=e.direction||"left",l="up"===h||"down"===h?"top":"left",c="up"===h||"left"===h?"pos":"neg",u={opacity:r?1:0};t.effects.save(n,o),n.show(),t.effects.createWrapper(n),s=e.distance||n["top"===l?"outerHeight":"outerWidth"](!0)/2,r&&n.css("opacity",0).css(l,"pos"===c?-s:s),u[l]=(r?"pos"===c?"+=":"-=":"pos"===c?"-=":"+=")+s,n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===a&&n.hide(),t.effects.restore(n,o),t.effects.removeWrapper(n),i()}})}}(jQuery),function(t){t.effects.effect.explode=function(e,i){function s(){b.push(this),b.length===u*d&&n()}function n(){p.css({visibility:"visible"}),t(b).remove(),g||p.hide(),i()}var o,a,r,h,l,c,u=e.pieces?Math.round(Math.sqrt(e.pieces)):3,d=u,p=t(this),f=t.effects.setMode(p,e.mode||"hide"),g="show"===f,m=p.show().css("visibility","hidden").offset(),v=Math.ceil(p.outerWidth()/d),_=Math.ceil(p.outerHeight()/u),b=[];for(o=0;u>o;o++)for(h=m.top+o*_,c=o-(u-1)/2,a=0;d>a;a++)r=m.left+a*v,l=a-(d-1)/2,p.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-a*v,top:-o*_}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:v,height:_,left:r+(g?l*v:0),top:h+(g?c*_:0),opacity:g?0:1}).animate({left:r+(g?0:l*v),top:h+(g?0:c*_),opacity:g?1:0},e.duration||500,e.easing,s)}}(jQuery),function(t){t.effects.effect.fade=function(e,i){var s=t(this),n=t.effects.setMode(s,e.mode||"toggle");s.animate({opacity:n},{queue:!1,duration:e.duration,easing:e.easing,complete:i})}}(jQuery),function(t){t.effects.effect.fold=function(e,i){var s,n,o=t(this),a=["position","top","bottom","left","right","height","width"],r=t.effects.setMode(o,e.mode||"hide"),h="show"===r,l="hide"===r,c=e.size||15,u=/([0-9]+)%/.exec(c),d=!!e.horizFirst,p=h!==d,f=p?["width","height"]:["height","width"],g=e.duration/2,m={},v={};t.effects.save(o,a),o.show(),s=t.effects.createWrapper(o).css({overflow:"hidden"}),n=p?[s.width(),s.height()]:[s.height(),s.width()],u&&(c=parseInt(u[1],10)/100*n[l?0:1]),h&&s.css(d?{height:0,width:c}:{height:c,width:0}),m[f[0]]=h?n[0]:c,v[f[1]]=h?n[1]:0,s.animate(m,g,e.easing).animate(v,g,e.easing,function(){l&&o.hide(),t.effects.restore(o,a),t.effects.removeWrapper(o),i()})}}(jQuery),function(t){t.effects.effect.highlight=function(e,i){var s=t(this),n=["backgroundImage","backgroundColor","opacity"],o=t.effects.setMode(s,e.mode||"show"),a={backgroundColor:s.css("backgroundColor")};"hide"===o&&(a.opacity=0),t.effects.save(s,n),s.show().css({backgroundImage:"none",backgroundColor:e.color||"#ffff99"}).animate(a,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===o&&s.hide(),t.effects.restore(s,n),i()}})}}(jQuery),function(t){t.effects.effect.pulsate=function(e,i){var s,n=t(this),o=t.effects.setMode(n,e.mode||"show"),a="show"===o,r="hide"===o,h=a||"hide"===o,l=2*(e.times||5)+(h?1:0),c=e.duration/l,u=0,d=n.queue(),p=d.length;for((a||!n.is(":visible"))&&(n.css("opacity",0).show(),u=1),s=1;l>s;s++)n.animate({opacity:u},c,e.easing),u=1-u;n.animate({opacity:u},c,e.easing),n.queue(function(){r&&n.hide(),i()}),p>1&&d.splice.apply(d,[1,0].concat(d.splice(p,l+1))),n.dequeue()}}(jQuery),function(t){t.effects.effect.puff=function(e,i){var s=t(this),n=t.effects.setMode(s,e.mode||"hide"),o="hide"===n,a=parseInt(e.percent,10)||150,r=a/100,h={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()};t.extend(e,{effect:"scale",queue:!1,fade:!0,mode:n,complete:i,percent:o?a:100,from:o?h:{height:h.height*r,width:h.width*r,outerHeight:h.outerHeight*r,outerWidth:h.outerWidth*r}}),s.effect(e)},t.effects.effect.scale=function(e,i){var s=t(this),n=t.extend(!0,{},e),o=t.effects.setMode(s,e.mode||"effect"),a=parseInt(e.percent,10)||(0===parseInt(e.percent,10)?0:"hide"===o?0:100),r=e.direction||"both",h=e.origin,l={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()},c={y:"horizontal"!==r?a/100:1,x:"vertical"!==r?a/100:1};n.effect="size",n.queue=!1,n.complete=i,"effect"!==o&&(n.origin=h||["middle","center"],n.restore=!0),n.from=e.from||("show"===o?{height:0,width:0,outerHeight:0,outerWidth:0}:l),n.to={height:l.height*c.y,width:l.width*c.x,outerHeight:l.outerHeight*c.y,outerWidth:l.outerWidth*c.x},n.fade&&("show"===o&&(n.from.opacity=0,n.to.opacity=1),"hide"===o&&(n.from.opacity=1,n.to.opacity=0)),s.effect(n)},t.effects.effect.size=function(e,i){var s,n,o,a=t(this),r=["position","top","bottom","left","right","width","height","overflow","opacity"],h=["position","top","bottom","left","right","overflow","opacity"],l=["width","height","overflow"],c=["fontSize"],u=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],d=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],p=t.effects.setMode(a,e.mode||"effect"),f=e.restore||"effect"!==p,g=e.scale||"both",m=e.origin||["middle","center"],v=a.css("position"),_=f?r:h,b={height:0,width:0,outerHeight:0,outerWidth:0};"show"===p&&a.show(),s={height:a.height(),width:a.width(),outerHeight:a.outerHeight(),outerWidth:a.outerWidth()},"toggle"===e.mode&&"show"===p?(a.from=e.to||b,a.to=e.from||s):(a.from=e.from||("show"===p?b:s),a.to=e.to||("hide"===p?b:s)),o={from:{y:a.from.height/s.height,x:a.from.width/s.width},to:{y:a.to.height/s.height,x:a.to.width/s.width}},("box"===g||"both"===g)&&(o.from.y!==o.to.y&&(_=_.concat(u),a.from=t.effects.setTransition(a,u,o.from.y,a.from),a.to=t.effects.setTransition(a,u,o.to.y,a.to)),o.from.x!==o.to.x&&(_=_.concat(d),a.from=t.effects.setTransition(a,d,o.from.x,a.from),a.to=t.effects.setTransition(a,d,o.to.x,a.to))),("content"===g||"both"===g)&&o.from.y!==o.to.y&&(_=_.concat(c).concat(l),a.from=t.effects.setTransition(a,c,o.from.y,a.from),a.to=t.effects.setTransition(a,c,o.to.y,a.to)),t.effects.save(a,_),a.show(),t.effects.createWrapper(a),a.css("overflow","hidden").css(a.from),m&&(n=t.effects.getBaseline(m,s),a.from.top=(s.outerHeight-a.outerHeight())*n.y,a.from.left=(s.outerWidth-a.outerWidth())*n.x,a.to.top=(s.outerHeight-a.to.outerHeight)*n.y,a.to.left=(s.outerWidth-a.to.outerWidth)*n.x),a.css(a.from),("content"===g||"both"===g)&&(u=u.concat(["marginTop","marginBottom"]).concat(c),d=d.concat(["marginLeft","marginRight"]),l=r.concat(u).concat(d),a.find("*[width]").each(function(){var i=t(this),s={height:i.height(),width:i.width(),outerHeight:i.outerHeight(),outerWidth:i.outerWidth()};f&&t.effects.save(i,l),i.from={height:s.height*o.from.y,width:s.width*o.from.x,outerHeight:s.outerHeight*o.from.y,outerWidth:s.outerWidth*o.from.x},i.to={height:s.height*o.to.y,width:s.width*o.to.x,outerHeight:s.height*o.to.y,outerWidth:s.width*o.to.x},o.from.y!==o.to.y&&(i.from=t.effects.setTransition(i,u,o.from.y,i.from),i.to=t.effects.setTransition(i,u,o.to.y,i.to)),o.from.x!==o.to.x&&(i.from=t.effects.setTransition(i,d,o.from.x,i.from),i.to=t.effects.setTransition(i,d,o.to.x,i.to)),i.css(i.from),i.animate(i.to,e.duration,e.easing,function(){f&&t.effects.restore(i,l)})})),a.animate(a.to,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){0===a.to.opacity&&a.css("opacity",a.from.opacity),"hide"===p&&a.hide(),t.effects.restore(a,_),f||("static"===v?a.css({position:"relative",top:a.to.top,left:a.to.left}):t.each(["top","left"],function(t,e){a.css(e,function(e,i){var s=parseInt(i,10),n=t?a.to.left:a.to.top;return"auto"===i?n+"px":s+n+"px"})})),t.effects.removeWrapper(a),i()}})}}(jQuery),function(t){t.effects.effect.shake=function(e,i){var s,n=t(this),o=["position","top","bottom","left","right","height","width"],a=t.effects.setMode(n,e.mode||"effect"),r=e.direction||"left",h=e.distance||20,l=e.times||3,c=2*l+1,u=Math.round(e.duration/c),d="up"===r||"down"===r?"top":"left",p="up"===r||"left"===r,f={},g={},m={},v=n.queue(),_=v.length;for(t.effects.save(n,o),n.show(),t.effects.createWrapper(n),f[d]=(p?"-=":"+=")+h,g[d]=(p?"+=":"-=")+2*h,m[d]=(p?"-=":"+=")+2*h,n.animate(f,u,e.easing),s=1;l>s;s++)n.animate(g,u,e.easing).animate(m,u,e.easing);n.animate(g,u,e.easing).animate(f,u/2,e.easing).queue(function(){"hide"===a&&n.hide(),t.effects.restore(n,o),t.effects.removeWrapper(n),i()}),_>1&&v.splice.apply(v,[1,0].concat(v.splice(_,c+1))),n.dequeue()}}(jQuery),function(t){t.effects.effect.slide=function(e,i){var s,n=t(this),o=["position","top","bottom","left","right","width","height"],a=t.effects.setMode(n,e.mode||"show"),r="show"===a,h=e.direction||"left",l="up"===h||"down"===h?"top":"left",c="up"===h||"left"===h,u={};t.effects.save(n,o),n.show(),s=e.distance||n["top"===l?"outerHeight":"outerWidth"](!0),t.effects.createWrapper(n).css({overflow:"hidden"}),r&&n.css(l,c?isNaN(s)?"-"+s:-s:s),u[l]=(r?c?"+=":"-=":c?"-=":"+=")+s,n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===a&&n.hide(),t.effects.restore(n,o),t.effects.removeWrapper(n),i()}})}}(jQuery),function(t){t.effects.effect.transfer=function(e,i){var s=t(this),n=t(e.to),o="fixed"===n.css("position"),a=t("body"),r=o?a.scrollTop():0,h=o?a.scrollLeft():0,l=n.offset(),c={top:l.top-r,left:l.left-h,height:n.innerHeight(),width:n.innerWidth()},u=s.offset(),d=t("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(e.className).css({top:u.top-r,left:u.left-h,height:s.innerHeight(),width:s.innerWidth(),position:o?"fixed":"absolute"}).animate(c,e.duration,e.easing,function(){d.remove(),i()})}}(jQuery),function(t){t.widget("ui.menu",{version:"1.10.3",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}).bind("click"+this.eventNamespace,t.proxy(function(t){this.options.disabled&&t.preventDefault()},this)),this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true"),this._on({"mousedown .ui-menu-item > a":function(t){t.preventDefault()},"click .ui-state-disabled > a":function(t){t.preventDefault()},"click .ui-menu-item:has(a)":function(e){var i=t(e.target).closest(".ui-menu-item");!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.mouseHandled=!0,this.select(e),i.has(".ui-menu").length?this.expand(e):this.element.is(":focus")||(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(e){var i=t(e.currentTarget);i.siblings().children(".ui-state-active").removeClass("ui-state-active"),this.focus(e,i)},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(t,e){var i=this.active||this.element.children(".ui-menu-item").eq(0);e||this.focus(t,i)},blur:function(e){this._delay(function(){t.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(e)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(e){t(e.target).closest(".ui-menu").length||this.collapseAll(e),this.mouseHandled=!1}})},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var e=t(this);e.data("ui-menu-submenu-carat")&&e.remove()}),this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")},_keydown:function(e){function i(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var s,n,o,a,r,h=!0;switch(e.keyCode){case t.ui.keyCode.PAGE_UP:this.previousPage(e);break;case t.ui.keyCode.PAGE_DOWN:this.nextPage(e);break;case t.ui.keyCode.HOME:this._move("first","first",e);break;case t.ui.keyCode.END:this._move("last","last",e);break;case t.ui.keyCode.UP:this.previous(e);break;case t.ui.keyCode.DOWN:this.next(e);break;case t.ui.keyCode.LEFT:this.collapse(e);break;case t.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(e);break;case t.ui.keyCode.ENTER:case t.ui.keyCode.SPACE:this._activate(e);break;case t.ui.keyCode.ESCAPE:this.collapse(e);break;default:h=!1,n=this.previousFilter||"",o=String.fromCharCode(e.keyCode),a=!1,clearTimeout(this.filterTimer),o===n?a=!0:o=n+o,r=RegExp("^"+i(o),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())}),s=a&&-1!==s.index(this.active.next())?this.active.nextAll(".ui-menu-item"):s,s.length||(o=String.fromCharCode(e.keyCode),r=RegExp("^"+i(o),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())})),s.length?(this.focus(e,s),s.length>1?(this.previousFilter=o,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter):delete this.previousFilter}h&&e.preventDefault()},_activate:function(t){this.active.is(".ui-state-disabled")||(this.active.children("a[aria-haspopup='true']").length?this.expand(t):this.select(t))},refresh:function(){var e,i=this.options.icons.submenu,s=this.element.find(this.options.menus);s.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var e=t(this),s=e.prev("a"),n=t("<span>").addClass("ui-menu-icon ui-icon "+i).data("ui-menu-submenu-carat",!0);s.attr("aria-haspopup","true").prepend(n),e.attr("aria-labelledby",s.attr("id"))}),e=s.add(this.element),e.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","presentation").children("a").uniqueId().addClass("ui-corner-all").attr({tabIndex:-1,role:this._itemRole()}),e.children(":not(.ui-menu-item)").each(function(){var e=t(this);/[^\-\u2014\u2013\s]/.test(e.text())||e.addClass("ui-widget-content ui-menu-divider")}),e.children(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!t.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(t,e){"icons"===t&&this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(e.submenu),this._super(t,e)},focus:function(t,e){var i,s;this.blur(t,t&&"focus"===t.type),this._scrollIntoView(e),this.active=e.first(),s=this.active.children("a").addClass("ui-state-focus"),this.options.role&&this.element.attr("aria-activedescendant",s.attr("id")),this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"),t&&"keydown"===t.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),i=e.children(".ui-menu"),i.length&&/^mouse/.test(t.type)&&this._startOpening(i),this.activeMenu=e.parent(),this._trigger("focus",t,{item:e})},_scrollIntoView:function(e){var i,s,n,o,a,r;this._hasScroll()&&(i=parseFloat(t.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(t.css(this.activeMenu[0],"paddingTop"))||0,n=e.offset().top-this.activeMenu.offset().top-i-s,o=this.activeMenu.scrollTop(),a=this.activeMenu.height(),r=e.height(),0>n?this.activeMenu.scrollTop(o+n):n+r>a&&this.activeMenu.scrollTop(o+n-a+r))},blur:function(t,e){e||clearTimeout(this.timer),this.active&&(this.active.children("a").removeClass("ui-state-focus"),this.active=null,this._trigger("blur",t,{item:this.active}))},_startOpening:function(t){clearTimeout(this.timer),"true"===t.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(t)},this.delay))},_open:function(e){var i=t.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(e.parents(".ui-menu")).hide().attr("aria-hidden","true"),e.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(e,i){clearTimeout(this.timer),this.timer=this._delay(function(){var s=i?this.element:t(e&&e.target).closest(this.element.find(".ui-menu"));s.length||(s=this.element),this._close(s),this.blur(e),this.activeMenu=s},this.delay)},_close:function(t){t||(t=this.active?this.active.parent():this.element),t.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find("a.ui-state-active").removeClass("ui-state-active")},collapse:function(t){var e=this.active&&this.active.parent().closest(".ui-menu-item",this.element);e&&e.length&&(this._close(),this.focus(t,e))},expand:function(t){var e=this.active&&this.active.children(".ui-menu ").children(".ui-menu-item").first();e&&e.length&&(this._open(e.parent()),this._delay(function(){this.focus(t,e)}))},next:function(t){this._move("next","first",t)},previous:function(t){this._move("prev","last",t)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(t,e,i){var s;this.active&&(s="first"===t||"last"===t?this.active["first"===t?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[t+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.children(".ui-menu-item")[e]()),this.focus(i,s)},nextPage:function(e){var i,s,n;return this.active?(this.isLastItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=t(this),0>i.offset().top-s-n}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item")[this.active?"last":"first"]())),undefined):(this.next(e),undefined)},previousPage:function(e){var i,s,n;return this.active?(this.isFirstItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=t(this),i.offset().top-s+n>0}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item").first())),undefined):(this.next(e),undefined)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(e){this.active=this.active||t(e.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(e,!0),this._trigger("select",e,i)}})}(jQuery),function(t,e){function i(t,e,i){return[parseFloat(t[0])*(p.test(t[0])?e/100:1),parseFloat(t[1])*(p.test(t[1])?i/100:1)]}function s(e,i){return parseInt(t.css(e,i),10)||0}function n(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}t.ui=t.ui||{};var o,a=Math.max,r=Math.abs,h=Math.round,l=/left|center|right/,c=/top|center|bottom/,u=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=t.fn.position;t.position={scrollbarWidth:function(){if(o!==e)return o;var i,s,n=t("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),a=n.children()[0];return t("body").append(n),i=a.offsetWidth,n.css("overflow","scroll"),s=a.offsetWidth,i===s&&(s=n[0].clientWidth),n.remove(),o=i-s},getScrollInfo:function(e){var i=e.isWindow?"":e.element.css("overflow-x"),s=e.isWindow?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,o="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:o?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]);return{element:i,isWindow:s,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s?i.width():i.outerWidth(),height:s?i.height():i.outerHeight()}}},t.fn.position=function(e){if(!e||!e.of)return f.apply(this,arguments);e=t.extend({},e);var o,p,g,m,v,_,b=t(e.of),y=t.position.getWithinInfo(e.within),w=t.position.getScrollInfo(y),k=(e.collision||"flip").split(" "),x={};return _=n(b),b[0].preventDefault&&(e.at="left top"),p=_.width,g=_.height,m=_.offset,v=t.extend({},m),t.each(["my","at"],function(){var t,i,s=(e[this]||"").split(" ");1===s.length&&(s=l.test(s[0])?s.concat(["center"]):c.test(s[0])?["center"].concat(s):["center","center"]),s[0]=l.test(s[0])?s[0]:"center",s[1]=c.test(s[1])?s[1]:"center",t=u.exec(s[0]),i=u.exec(s[1]),x[this]=[t?t[0]:0,i?i[0]:0],e[this]=[d.exec(s[0])[0],d.exec(s[1])[0]]}),1===k.length&&(k[1]=k[0]),"right"===e.at[0]?v.left+=p:"center"===e.at[0]&&(v.left+=p/2),"bottom"===e.at[1]?v.top+=g:"center"===e.at[1]&&(v.top+=g/2),o=i(x.at,p,g),v.left+=o[0],v.top+=o[1],this.each(function(){var n,l,c=t(this),u=c.outerWidth(),d=c.outerHeight(),f=s(this,"marginLeft"),_=s(this,"marginTop"),D=u+f+s(this,"marginRight")+w.width,C=d+_+s(this,"marginBottom")+w.height,I=t.extend({},v),P=i(x.my,c.outerWidth(),c.outerHeight());"right"===e.my[0]?I.left-=u:"center"===e.my[0]&&(I.left-=u/2),"bottom"===e.my[1]?I.top-=d:"center"===e.my[1]&&(I.top-=d/2),I.left+=P[0],I.top+=P[1],t.support.offsetFractions||(I.left=h(I.left),I.top=h(I.top)),n={marginLeft:f,marginTop:_},t.each(["left","top"],function(i,s){t.ui.position[k[i]]&&t.ui.position[k[i]][s](I,{targetWidth:p,targetHeight:g,elemWidth:u,elemHeight:d,collisionPosition:n,collisionWidth:D,collisionHeight:C,offset:[o[0]+P[0],o[1]+P[1]],my:e.my,at:e.at,within:y,elem:c})}),e.using&&(l=function(t){var i=m.left-I.left,s=i+p-u,n=m.top-I.top,o=n+g-d,h={target:{element:b,left:m.left,top:m.top,width:p,height:g},element:{element:c,left:I.left,top:I.top,width:u,height:d},horizontal:0>s?"left":i>0?"right":"center",vertical:0>o?"top":n>0?"bottom":"middle"};u>p&&p>r(i+s)&&(h.horizontal="center"),d>g&&g>r(n+o)&&(h.vertical="middle"),h.important=a(r(i),r(s))>a(r(n),r(o))?"horizontal":"vertical",e.using.call(this,t,h)}),c.offset(t.extend(I,{using:l}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,o=s.width,r=t.left-e.collisionPosition.marginLeft,h=n-r,l=r+e.collisionWidth-o-n;e.collisionWidth>o?h>0&&0>=l?(i=t.left+h+e.collisionWidth-o-n,t.left+=h-i):t.left=l>0&&0>=h?n:h>l?n+o-e.collisionWidth:n:h>0?t.left+=h:l>0?t.left-=l:t.left=a(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,o=e.within.height,r=t.top-e.collisionPosition.marginTop,h=n-r,l=r+e.collisionHeight-o-n;e.collisionHeight>o?h>0&&0>=l?(i=t.top+h+e.collisionHeight-o-n,t.top+=h-i):t.top=l>0&&0>=h?n:h>l?n+o-e.collisionHeight:n:h>0?t.top+=h:l>0?t.top-=l:t.top=a(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,o=n.offset.left+n.scrollLeft,a=n.width,h=n.isWindow?n.scrollLeft:n.offset.left,l=t.left-e.collisionPosition.marginLeft,c=l-h,u=l+e.collisionWidth-a-h,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-a-o,(0>i||r(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-h,(s>0||u>r(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,o=n.offset.top+n.scrollTop,a=n.height,h=n.isWindow?n.scrollTop:n.offset.top,l=t.top-e.collisionPosition.marginTop,c=l-h,u=l+e.collisionHeight-a-h,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,g=-2*e.offset[1];0>c?(s=t.top+p+f+g+e.collisionHeight-a-o,t.top+p+f+g>c&&(0>s||r(c)>s)&&(t.top+=p+f+g)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+g-h,t.top+p+f+g>u&&(i>0||u>r(i))&&(t.top+=p+f+g))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}},function(){var e,i,s,n,o,a=document.getElementsByTagName("body")[0],r=document.createElement("div");e=document.createElement(a?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},a&&t.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(o in s)e.style[o]=s[o];e.appendChild(r),i=a||document.documentElement,i.insertBefore(e,i.firstChild),r.style.cssText="position: absolute; left: 10.7432222px;",n=t(r).offset().left,t.support.offsetFractions=n>10&&11>n,e.innerHTML="",i.removeChild(e)}()}(jQuery),function(t,e){t.widget("ui.progressbar",{version:"1.10.3",options:{max:100,value:0,change:null,complete:null},min:0,_create:function(){this.oldValue=this.options.value=this._constrainedValue(),this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min}),this.valueDiv=t("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element),this._refreshValue()},_destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.valueDiv.remove()
},value:function(t){return t===e?this.options.value:(this.options.value=this._constrainedValue(t),this._refreshValue(),e)},_constrainedValue:function(t){return t===e&&(t=this.options.value),this.indeterminate=t===!1,"number"!=typeof t&&(t=0),this.indeterminate?!1:Math.min(this.options.max,Math.max(this.min,t))},_setOptions:function(t){var e=t.value;delete t.value,this._super(t),this.options.value=this._constrainedValue(e),this._refreshValue()},_setOption:function(t,e){"max"===t&&(e=Math.max(this.min,e)),this._super(t,e)},_percentage:function(){return this.indeterminate?100:100*(this.options.value-this.min)/(this.options.max-this.min)},_refreshValue:function(){var e=this.options.value,i=this._percentage();this.valueDiv.toggle(this.indeterminate||e>this.min).toggleClass("ui-corner-right",e===this.options.max).width(i.toFixed(0)+"%"),this.element.toggleClass("ui-progressbar-indeterminate",this.indeterminate),this.indeterminate?(this.element.removeAttr("aria-valuenow"),this.overlayDiv||(this.overlayDiv=t("<div class='ui-progressbar-overlay'></div>").appendTo(this.valueDiv))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":e}),this.overlayDiv&&(this.overlayDiv.remove(),this.overlayDiv=null)),this.oldValue!==e&&(this.oldValue=e,this._trigger("change")),e===this.options.max&&this._trigger("complete")}})}(jQuery),function(t){var e=5;t.widget("ui.slider",t.ui.mouse,{version:"1.10.3",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null,change:null,slide:null,start:null,stop:null},_create:function(){this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget"+" ui-widget-content"+" ui-corner-all"),this._refresh(),this._setOption("disabled",this.options.disabled),this._animateOff=!1},_refresh:function(){this._createRange(),this._createHandles(),this._setupEvents(),this._refreshValue()},_createHandles:function(){var e,i,s=this.options,n=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),o="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",a=[];for(i=s.values&&s.values.length||1,n.length>i&&(n.slice(i).remove(),n=n.slice(0,i)),e=n.length;i>e;e++)a.push(o);this.handles=n.add(t(a.join("")).appendTo(this.element)),this.handle=this.handles.eq(0),this.handles.each(function(e){t(this).data("ui-slider-handle-index",e)})},_createRange:function(){var e=this.options,i="";e.range?(e.range===!0&&(e.values?e.values.length&&2!==e.values.length?e.values=[e.values[0],e.values[0]]:t.isArray(e.values)&&(e.values=e.values.slice(0)):e.values=[this._valueMin(),this._valueMin()]),this.range&&this.range.length?this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({left:"",bottom:""}):(this.range=t("<div></div>").appendTo(this.element),i="ui-slider-range ui-widget-header ui-corner-all"),this.range.addClass(i+("min"===e.range||"max"===e.range?" ui-slider-range-"+e.range:""))):this.range=t([])},_setupEvents:function(){var t=this.handles.add(this.range).filter("a");this._off(t),this._on(t,this._handleEvents),this._hoverable(t),this._focusable(t)},_destroy:function(){this.handles.remove(),this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"),this._mouseDestroy()},_mouseCapture:function(e){var i,s,n,o,a,r,h,l,c=this,u=this.options;return u.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),i={x:e.pageX,y:e.pageY},s=this._normValueFromMouse(i),n=this._valueMax()-this._valueMin()+1,this.handles.each(function(e){var i=Math.abs(s-c.values(e));(n>i||n===i&&(e===c._lastChangedValue||c.values(e)===u.min))&&(n=i,o=t(this),a=e)}),r=this._start(e,a),r===!1?!1:(this._mouseSliding=!0,this._handleIndex=a,o.addClass("ui-state-active").focus(),h=o.offset(),l=!t(e.target).parents().addBack().is(".ui-slider-handle"),this._clickOffset=l?{left:0,top:0}:{left:e.pageX-h.left-o.width()/2,top:e.pageY-h.top-o.height()/2-(parseInt(o.css("borderTopWidth"),10)||0)-(parseInt(o.css("borderBottomWidth"),10)||0)+(parseInt(o.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(e,a,s),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(t){var e={x:t.pageX,y:t.pageY},i=this._normValueFromMouse(e);return this._slide(t,this._handleIndex,i),!1},_mouseStop:function(t){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(t,this._handleIndex),this._change(t,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation="vertical"===this.options.orientation?"vertical":"horizontal"},_normValueFromMouse:function(t){var e,i,s,n,o;return"horizontal"===this.orientation?(e=this.elementSize.width,i=t.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(e=this.elementSize.height,i=t.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),s=i/e,s>1&&(s=1),0>s&&(s=0),"vertical"===this.orientation&&(s=1-s),n=this._valueMax()-this._valueMin(),o=this._valueMin()+s*n,this._trimAlignValue(o)},_start:function(t,e){var i={handle:this.handles[e],value:this.value()};return this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._trigger("start",t,i)},_slide:function(t,e,i){var s,n,o;this.options.values&&this.options.values.length?(s=this.values(e?0:1),2===this.options.values.length&&this.options.range===!0&&(0===e&&i>s||1===e&&s>i)&&(i=s),i!==this.values(e)&&(n=this.values(),n[e]=i,o=this._trigger("slide",t,{handle:this.handles[e],value:i,values:n}),s=this.values(e?0:1),o!==!1&&this.values(e,i,!0))):i!==this.value()&&(o=this._trigger("slide",t,{handle:this.handles[e],value:i}),o!==!1&&this.value(i))},_stop:function(t,e){var i={handle:this.handles[e],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._trigger("stop",t,i)},_change:function(t,e){if(!this._keySliding&&!this._mouseSliding){var i={handle:this.handles[e],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._lastChangedValue=e,this._trigger("change",t,i)}},value:function(t){return arguments.length?(this.options.value=this._trimAlignValue(t),this._refreshValue(),this._change(null,0),undefined):this._value()},values:function(e,i){var s,n,o;if(arguments.length>1)return this.options.values[e]=this._trimAlignValue(i),this._refreshValue(),this._change(null,e),undefined;if(!arguments.length)return this._values();if(!t.isArray(arguments[0]))return this.options.values&&this.options.values.length?this._values(e):this.value();for(s=this.options.values,n=arguments[0],o=0;s.length>o;o+=1)s[o]=this._trimAlignValue(n[o]),this._change(null,o);this._refreshValue()},_setOption:function(e,i){var s,n=0;switch("range"===e&&this.options.range===!0&&("min"===i?(this.options.value=this._values(0),this.options.values=null):"max"===i&&(this.options.value=this._values(this.options.values.length-1),this.options.values=null)),t.isArray(this.options.values)&&(n=this.options.values.length),t.Widget.prototype._setOption.apply(this,arguments),e){case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue();break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),s=0;n>s;s+=1)this._change(null,s);this._animateOff=!1;break;case"min":case"max":this._animateOff=!0,this._refreshValue(),this._animateOff=!1;break;case"range":this._animateOff=!0,this._refresh(),this._animateOff=!1}},_value:function(){var t=this.options.value;return t=this._trimAlignValue(t)},_values:function(t){var e,i,s;if(arguments.length)return e=this.options.values[t],e=this._trimAlignValue(e);if(this.options.values&&this.options.values.length){for(i=this.options.values.slice(),s=0;i.length>s;s+=1)i[s]=this._trimAlignValue(i[s]);return i}return[]},_trimAlignValue:function(t){if(this._valueMin()>=t)return this._valueMin();if(t>=this._valueMax())return this._valueMax();var e=this.options.step>0?this.options.step:1,i=(t-this._valueMin())%e,s=t-i;return 2*Math.abs(i)>=e&&(s+=i>0?e:-e),parseFloat(s.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var e,i,s,n,o,a=this.options.range,r=this.options,h=this,l=this._animateOff?!1:r.animate,c={};this.options.values&&this.options.values.length?this.handles.each(function(s){i=100*((h.values(s)-h._valueMin())/(h._valueMax()-h._valueMin())),c["horizontal"===h.orientation?"left":"bottom"]=i+"%",t(this).stop(1,1)[l?"animate":"css"](c,r.animate),h.options.range===!0&&("horizontal"===h.orientation?(0===s&&h.range.stop(1,1)[l?"animate":"css"]({left:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({width:i-e+"%"},{queue:!1,duration:r.animate})):(0===s&&h.range.stop(1,1)[l?"animate":"css"]({bottom:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({height:i-e+"%"},{queue:!1,duration:r.animate}))),e=i}):(s=this.value(),n=this._valueMin(),o=this._valueMax(),i=o!==n?100*((s-n)/(o-n)):0,c["horizontal"===this.orientation?"left":"bottom"]=i+"%",this.handle.stop(1,1)[l?"animate":"css"](c,r.animate),"min"===a&&"horizontal"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({width:i+"%"},r.animate),"max"===a&&"horizontal"===this.orientation&&this.range[l?"animate":"css"]({width:100-i+"%"},{queue:!1,duration:r.animate}),"min"===a&&"vertical"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({height:i+"%"},r.animate),"max"===a&&"vertical"===this.orientation&&this.range[l?"animate":"css"]({height:100-i+"%"},{queue:!1,duration:r.animate}))},_handleEvents:{keydown:function(i){var s,n,o,a,r=t(i.target).data("ui-slider-handle-index");switch(i.keyCode){case t.ui.keyCode.HOME:case t.ui.keyCode.END:case t.ui.keyCode.PAGE_UP:case t.ui.keyCode.PAGE_DOWN:case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(i.preventDefault(),!this._keySliding&&(this._keySliding=!0,t(i.target).addClass("ui-state-active"),s=this._start(i,r),s===!1))return}switch(a=this.options.step,n=o=this.options.values&&this.options.values.length?this.values(r):this.value(),i.keyCode){case t.ui.keyCode.HOME:o=this._valueMin();break;case t.ui.keyCode.END:o=this._valueMax();break;case t.ui.keyCode.PAGE_UP:o=this._trimAlignValue(n+(this._valueMax()-this._valueMin())/e);break;case t.ui.keyCode.PAGE_DOWN:o=this._trimAlignValue(n-(this._valueMax()-this._valueMin())/e);break;case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:if(n===this._valueMax())return;o=this._trimAlignValue(n+a);break;case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(n===this._valueMin())return;o=this._trimAlignValue(n-a)}this._slide(i,r,o)},click:function(t){t.preventDefault()},keyup:function(e){var i=t(e.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(e,i),this._change(e,i),t(e.target).removeClass("ui-state-active"))}}})}(jQuery),function(t){function e(t){return function(){var e=this.element.val();t.apply(this,arguments),this._refresh(),e!==this.element.val()&&this._trigger("change")}}t.widget("ui.spinner",{version:"1.10.3",defaultElement:"<input>",widgetEventPrefix:"spin",options:{culture:null,icons:{down:"ui-icon-triangle-1-s",up:"ui-icon-triangle-1-n"},incremental:!0,max:null,min:null,numberFormat:null,page:10,step:1,change:null,spin:null,start:null,stop:null},_create:function(){this._setOption("max",this.options.max),this._setOption("min",this.options.min),this._setOption("step",this.options.step),this._value(this.element.val(),!0),this._draw(),this._on(this._events),this._refresh(),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_getCreateOptions:function(){var e={},i=this.element;return t.each(["min","max","step"],function(t,s){var n=i.attr(s);void 0!==n&&n.length&&(e[s]=n)}),e},_events:{keydown:function(t){this._start(t)&&this._keydown(t)&&t.preventDefault()},keyup:"_stop",focus:function(){this.previous=this.element.val()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,void 0):(this._stop(),this._refresh(),this.previous!==this.element.val()&&this._trigger("change",t),void 0)},mousewheel:function(t,e){if(e){if(!this.spinning&&!this._start(t))return!1;this._spin((e>0?1:-1)*this.options.step,t),clearTimeout(this.mousewheelTimer),this.mousewheelTimer=this._delay(function(){this.spinning&&this._stop(t)},100),t.preventDefault()}},"mousedown .ui-spinner-button":function(e){function i(){var t=this.element[0]===this.document[0].activeElement;t||(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s}))}var s;s=this.element[0]===this.document[0].activeElement?this.previous:this.element.val(),e.preventDefault(),i.call(this),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,i.call(this)}),this._start(e)!==!1&&this._repeat(null,t(e.currentTarget).hasClass("ui-spinner-up")?1:-1,e)},"mouseup .ui-spinner-button":"_stop","mouseenter .ui-spinner-button":function(e){return t(e.currentTarget).hasClass("ui-state-active")?this._start(e)===!1?!1:(this._repeat(null,t(e.currentTarget).hasClass("ui-spinner-up")?1:-1,e),void 0):void 0},"mouseleave .ui-spinner-button":"_stop"},_draw:function(){var t=this.uiSpinner=this.element.addClass("ui-spinner-input").attr("autocomplete","off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());this.element.attr("role","spinbutton"),this.buttons=t.find(".ui-spinner-button").attr("tabIndex",-1).button().removeClass("ui-corner-all"),this.buttons.height()>Math.ceil(.5*t.height())&&t.height()>0&&t.height(t.height()),this.options.disabled&&this.disable()},_keydown:function(e){var i=this.options,s=t.ui.keyCode;switch(e.keyCode){case s.UP:return this._repeat(null,1,e),!0;case s.DOWN:return this._repeat(null,-1,e),!0;case s.PAGE_UP:return this._repeat(null,i.page,e),!0;case s.PAGE_DOWN:return this._repeat(null,-i.page,e),!0}return!1},_uiSpinnerHtml:function(){return"<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>"},_buttonHtml:function(){return"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon "+this.options.icons.up+"'>&#9650;</span>"+"</a>"+"<a class='ui-spinner-button ui-spinner-down ui-corner-br'>"+"<span class='ui-icon "+this.options.icons.down+"'>&#9660;</span>"+"</a>"},_start:function(t){return this.spinning||this._trigger("start",t)!==!1?(this.counter||(this.counter=1),this.spinning=!0,!0):!1},_repeat:function(t,e,i){t=t||500,clearTimeout(this.timer),this.timer=this._delay(function(){this._repeat(40,e,i)},t),this._spin(e*this.options.step,i)},_spin:function(t,e){var i=this.value()||0;this.counter||(this.counter=1),i=this._adjustValue(i+t*this._increment(this.counter)),this.spinning&&this._trigger("spin",e,{value:i})===!1||(this._value(i),this.counter++)},_increment:function(e){var i=this.options.incremental;return i?t.isFunction(i)?i(e):Math.floor(e*e*e/5e4-e*e/500+17*e/200+1):1},_precision:function(){var t=this._precisionOf(this.options.step);return null!==this.options.min&&(t=Math.max(t,this._precisionOf(this.options.min))),t},_precisionOf:function(t){var e=""+t,i=e.indexOf(".");return-1===i?0:e.length-i-1},_adjustValue:function(t){var e,i,s=this.options;return e=null!==s.min?s.min:0,i=t-e,i=Math.round(i/s.step)*s.step,t=e+i,t=parseFloat(t.toFixed(this._precision())),null!==s.max&&t>s.max?s.max:null!==s.min&&s.min>t?s.min:t},_stop:function(t){this.spinning&&(clearTimeout(this.timer),clearTimeout(this.mousewheelTimer),this.counter=0,this.spinning=!1,this._trigger("stop",t))},_setOption:function(t,e){if("culture"===t||"numberFormat"===t){var i=this._parse(this.element.val());return this.options[t]=e,this.element.val(this._format(i)),void 0}("max"===t||"min"===t||"step"===t)&&"string"==typeof e&&(e=this._parse(e)),"icons"===t&&(this.buttons.first().find(".ui-icon").removeClass(this.options.icons.up).addClass(e.up),this.buttons.last().find(".ui-icon").removeClass(this.options.icons.down).addClass(e.down)),this._super(t,e),"disabled"===t&&(e?(this.element.prop("disabled",!0),this.buttons.button("disable")):(this.element.prop("disabled",!1),this.buttons.button("enable")))},_setOptions:e(function(t){this._super(t),this._value(this.element.val())}),_parse:function(t){return"string"==typeof t&&""!==t&&(t=window.Globalize&&this.options.numberFormat?Globalize.parseFloat(t,10,this.options.culture):+t),""===t||isNaN(t)?null:t},_format:function(t){return""===t?"":window.Globalize&&this.options.numberFormat?Globalize.format(t,this.options.numberFormat,this.options.culture):t},_refresh:function(){this.element.attr({"aria-valuemin":this.options.min,"aria-valuemax":this.options.max,"aria-valuenow":this._parse(this.element.val())})},_value:function(t,e){var i;""!==t&&(i=this._parse(t),null!==i&&(e||(i=this._adjustValue(i)),t=this._format(i))),this.element.val(t),this._refresh()},_destroy:function(){this.element.removeClass("ui-spinner-input").prop("disabled",!1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.uiSpinner.replaceWith(this.element)},stepUp:e(function(t){this._stepUp(t)}),_stepUp:function(t){this._start()&&(this._spin((t||1)*this.options.step),this._stop())},stepDown:e(function(t){this._stepDown(t)}),_stepDown:function(t){this._start()&&(this._spin((t||1)*-this.options.step),this._stop())},pageUp:e(function(t){this._stepUp((t||1)*this.options.page)}),pageDown:e(function(t){this._stepDown((t||1)*this.options.page)}),value:function(t){return arguments.length?(e(this._value).call(this,t),void 0):this._parse(this.element.val())},widget:function(){return this.uiSpinner}})}(jQuery),function(t,e){function i(){return++n}function s(t){return t.hash.length>1&&decodeURIComponent(t.href.replace(o,""))===decodeURIComponent(location.href.replace(o,""))}var n=0,o=/#.*$/;t.widget("ui.tabs",{version:"1.10.3",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_create:function(){var e=this,i=this.options;this.running=!1,this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",i.collapsible).delegate(".ui-tabs-nav > li","mousedown"+this.eventNamespace,function(e){t(this).is(".ui-state-disabled")&&e.preventDefault()}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){t(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this._processTabs(),i.active=this._initialActive(),t.isArray(i.disabled)&&(i.disabled=t.unique(i.disabled.concat(t.map(this.tabs.filter(".ui-state-disabled"),function(t){return e.tabs.index(t)}))).sort()),this.active=this.options.active!==!1&&this.anchors.length?this._findActive(i.active):t(),this._refresh(),this.active.length&&this.load(i.active)},_initialActive:function(){var i=this.options.active,s=this.options.collapsible,n=location.hash.substring(1);return null===i&&(n&&this.tabs.each(function(s,o){return t(o).attr("aria-controls")===n?(i=s,!1):e}),null===i&&(i=this.tabs.index(this.tabs.filter(".ui-tabs-active"))),(null===i||-1===i)&&(i=this.tabs.length?0:!1)),i!==!1&&(i=this.tabs.index(this.tabs.eq(i)),-1===i&&(i=s?!1:0)),!s&&i===!1&&this.anchors.length&&(i=0),i},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):t()}},_tabKeydown:function(i){var s=t(this.document[0].activeElement).closest("li"),n=this.tabs.index(s),o=!0;if(!this._handlePageNav(i)){switch(i.keyCode){case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:n++;break;case t.ui.keyCode.UP:case t.ui.keyCode.LEFT:o=!1,n--;break;case t.ui.keyCode.END:n=this.anchors.length-1;break;case t.ui.keyCode.HOME:n=0;break;case t.ui.keyCode.SPACE:return i.preventDefault(),clearTimeout(this.activating),this._activate(n),e;case t.ui.keyCode.ENTER:return i.preventDefault(),clearTimeout(this.activating),this._activate(n===this.options.active?!1:n),e;default:return}i.preventDefault(),clearTimeout(this.activating),n=this._focusNextTab(n,o),i.ctrlKey||(s.attr("aria-selected","false"),this.tabs.eq(n).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",n)},this.delay))}},_panelKeydown:function(e){this._handlePageNav(e)||e.ctrlKey&&e.keyCode===t.ui.keyCode.UP&&(e.preventDefault(),this.active.focus())},_handlePageNav:function(i){return i.altKey&&i.keyCode===t.ui.keyCode.PAGE_UP?(this._activate(this._focusNextTab(this.options.active-1,!1)),!0):i.altKey&&i.keyCode===t.ui.keyCode.PAGE_DOWN?(this._activate(this._focusNextTab(this.options.active+1,!0)),!0):e},_findNextTab:function(e,i){function s(){return e>n&&(e=0),0>e&&(e=n),e}for(var n=this.tabs.length-1;-1!==t.inArray(s(),this.options.disabled);)e=i?e+1:e-1;return e},_focusNextTab:function(t,e){return t=this._findNextTab(t,e),this.tabs.eq(t).focus(),t},_setOption:function(t,i){return"active"===t?(this._activate(i),e):"disabled"===t?(this._setupDisabled(i),e):(this._super(t,i),"collapsible"===t&&(this.element.toggleClass("ui-tabs-collapsible",i),i||this.options.active!==!1||this._activate(0)),"event"===t&&this._setupEvents(i),"heightStyle"===t&&this._setupHeightStyle(i),e)},_tabId:function(t){return t.attr("aria-controls")||"ui-tabs-"+i()},_sanitizeSelector:function(t){return t?t.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var e=this.options,i=this.tablist.children(":has(a[href])");e.disabled=t.map(i.filter(".ui-state-disabled"),function(t){return i.index(t)}),this._processTabs(),e.active!==!1&&this.anchors.length?this.active.length&&!t.contains(this.tablist[0],this.active[0])?this.tabs.length===e.disabled.length?(e.active=!1,this.active=t()):this._activate(this._findNextTab(Math.max(0,e.active-1),!1)):e.active=this.tabs.index(this.active):(e.active=!1,this.active=t()),this._refresh()},_refresh:function(){this._setupDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-expanded":"false","aria-hidden":"true"}),this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-expanded":"true","aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var e=this;this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist"),this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1}),this.anchors=this.tabs.map(function(){return t("a",this)[0]}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1}),this.panels=t(),this.anchors.each(function(i,n){var o,a,r,h=t(n).uniqueId().attr("id"),l=t(n).closest("li"),c=l.attr("aria-controls");s(n)?(o=n.hash,a=e.element.find(e._sanitizeSelector(o))):(r=e._tabId(l),o="#"+r,a=e.element.find(o),a.length||(a=e._createPanel(r),a.insertAfter(e.panels[i-1]||e.tablist)),a.attr("aria-live","polite")),a.length&&(e.panels=e.panels.add(a)),c&&l.data("ui-tabs-aria-controls",c),l.attr({"aria-controls":o.substring(1),"aria-labelledby":h}),a.attr("aria-labelledby",h)}),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel")},_getList:function(){return this.element.find("ol,ul").eq(0)},_createPanel:function(e){return t("<div>").attr("id",e).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)},_setupDisabled:function(e){t.isArray(e)&&(e.length?e.length===this.anchors.length&&(e=!0):e=!1);for(var i,s=0;i=this.tabs[s];s++)e===!0||-1!==t.inArray(s,e)?t(i).addClass("ui-state-disabled").attr("aria-disabled","true"):t(i).removeClass("ui-state-disabled").removeAttr("aria-disabled");this.options.disabled=e},_setupEvents:function(e){var i={click:function(t){t.preventDefault()}};e&&t.each(e.split(" "),function(t,e){i[e]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(this.anchors,i),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(e){var i,s=this.element.parent();"fill"===e?(i=s.height(),i-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var e=t(this),s=e.css("position");"absolute"!==s&&"fixed"!==s&&(i-=e.outerHeight(!0))}),this.element.children().not(this.panels).each(function(){i-=t(this).outerHeight(!0)}),this.panels.each(function(){t(this).height(Math.max(0,i-t(this).innerHeight()+t(this).height()))}).css("overflow","auto")):"auto"===e&&(i=0,this.panels.each(function(){i=Math.max(i,t(this).height("").height())}).height(i))},_eventHandler:function(e){var i=this.options,s=this.active,n=t(e.currentTarget),o=n.closest("li"),a=o[0]===s[0],r=a&&i.collapsible,h=r?t():this._getPanelForTab(o),l=s.length?this._getPanelForTab(s):t(),c={oldTab:s,oldPanel:l,newTab:r?t():o,newPanel:h};e.preventDefault(),o.hasClass("ui-state-disabled")||o.hasClass("ui-tabs-loading")||this.running||a&&!i.collapsible||this._trigger("beforeActivate",e,c)===!1||(i.active=r?!1:this.tabs.index(o),this.active=a?t():o,this.xhr&&this.xhr.abort(),l.length||h.length||t.error("jQuery UI Tabs: Mismatching fragment identifier."),h.length&&this.load(this.tabs.index(o),e),this._toggle(e,c))},_toggle:function(e,i){function s(){o.running=!1,o._trigger("activate",e,i)}function n(){i.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),a.length&&o.options.show?o._show(a,o.options.show,s):(a.show(),s())}var o=this,a=i.newPanel,r=i.oldPanel;this.running=!0,r.length&&this.options.hide?this._hide(r,this.options.hide,function(){i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),n()}):(i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),r.hide(),n()),r.attr({"aria-expanded":"false","aria-hidden":"true"}),i.oldTab.attr("aria-selected","false"),a.length&&r.length?i.oldTab.attr("tabIndex",-1):a.length&&this.tabs.filter(function(){return 0===t(this).attr("tabIndex")}).attr("tabIndex",-1),a.attr({"aria-expanded":"true","aria-hidden":"false"}),i.newTab.attr({"aria-selected":"true",tabIndex:0})},_activate:function(e){var i,s=this._findActive(e);s[0]!==this.active[0]&&(s.length||(s=this.active),i=s.find(".ui-tabs-anchor")[0],this._eventHandler({target:i,currentTarget:i,preventDefault:t.noop}))},_findActive:function(e){return e===!1?t():this.tabs.eq(e)},_getIndex:function(t){return"string"==typeof t&&(t=this.anchors.index(this.anchors.filter("[href$='"+t+"']"))),t},_destroy:function(){this.xhr&&this.xhr.abort(),this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"),this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"),this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(),this.tabs.add(this.panels).each(function(){t.data(this,"ui-tabs-destroy")?t(this).remove():t(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")}),this.tabs.each(function(){var e=t(this),i=e.data("ui-tabs-aria-controls");i?e.attr("aria-controls",i).removeData("ui-tabs-aria-controls"):e.removeAttr("aria-controls")}),this.panels.show(),"content"!==this.options.heightStyle&&this.panels.css("height","")},enable:function(i){var s=this.options.disabled;s!==!1&&(i===e?s=!1:(i=this._getIndex(i),s=t.isArray(s)?t.map(s,function(t){return t!==i?t:null}):t.map(this.tabs,function(t,e){return e!==i?e:null})),this._setupDisabled(s))},disable:function(i){var s=this.options.disabled;if(s!==!0){if(i===e)s=!0;else{if(i=this._getIndex(i),-1!==t.inArray(i,s))return;s=t.isArray(s)?t.merge([i],s).sort():[i]}this._setupDisabled(s)}},load:function(e,i){e=this._getIndex(e);var n=this,o=this.tabs.eq(e),a=o.find(".ui-tabs-anchor"),r=this._getPanelForTab(o),h={tab:o,panel:r};s(a[0])||(this.xhr=t.ajax(this._ajaxSettings(a,i,h)),this.xhr&&"canceled"!==this.xhr.statusText&&(o.addClass("ui-tabs-loading"),r.attr("aria-busy","true"),this.xhr.success(function(t){setTimeout(function(){r.html(t),n._trigger("load",i,h)},1)}).complete(function(t,e){setTimeout(function(){"abort"===e&&n.panels.stop(!1,!0),o.removeClass("ui-tabs-loading"),r.removeAttr("aria-busy"),t===n.xhr&&delete n.xhr},1)})))},_ajaxSettings:function(e,i,s){var n=this;return{url:e.attr("href"),beforeSend:function(e,o){return n._trigger("beforeLoad",i,t.extend({jqXHR:e,ajaxSettings:o},s))}}},_getPanelForTab:function(e){var i=t(e).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+i))}})}(jQuery),function(t){function e(e,i){var s=(e.attr("aria-describedby")||"").split(/\s+/);s.push(i),e.data("ui-tooltip-id",i).attr("aria-describedby",t.trim(s.join(" ")))}function i(e){var i=e.data("ui-tooltip-id"),s=(e.attr("aria-describedby")||"").split(/\s+/),n=t.inArray(i,s);-1!==n&&s.splice(n,1),e.removeData("ui-tooltip-id"),s=t.trim(s.join(" ")),s?e.attr("aria-describedby",s):e.removeAttr("aria-describedby")}var s=0;t.widget("ui.tooltip",{version:"1.10.3",options:{content:function(){var e=t(this).attr("title")||"";return t("<a>").text(e).html()},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,tooltipClass:null,track:!1,close:null,open:null},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.options.disabled&&this._disable()},_setOption:function(e,i){var s=this;return"disabled"===e?(this[i?"_disable":"_enable"](),this.options[e]=i,void 0):(this._super(e,i),"content"===e&&t.each(this.tooltips,function(t,e){s._updateContent(e)}),void 0)},_disable:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur");n.target=n.currentTarget=s[0],e.close(n,!0)}),this.element.find(this.options.items).addBack().each(function(){var e=t(this);e.is("[title]")&&e.data("ui-tooltip-title",e.attr("title")).attr("title","")})},_enable:function(){this.element.find(this.options.items).addBack().each(function(){var e=t(this);e.data("ui-tooltip-title")&&e.attr("title",e.data("ui-tooltip-title"))})},open:function(e){var i=this,s=t(e?e.target:this.element).closest(this.options.items);s.length&&!s.data("ui-tooltip-id")&&(s.attr("title")&&s.data("ui-tooltip-title",s.attr("title")),s.data("ui-tooltip-open",!0),e&&"mouseover"===e.type&&s.parents().each(function(){var e,s=t(this);s.data("ui-tooltip-open")&&(e=t.Event("blur"),e.target=e.currentTarget=this,i.close(e,!0)),s.attr("title")&&(s.uniqueId(),i.parents[this.id]={element:this,title:s.attr("title")},s.attr("title",""))}),this._updateContent(s,e))},_updateContent:function(t,e){var i,s=this.options.content,n=this,o=e?e.type:null;return"string"==typeof s?this._open(e,t,s):(i=s.call(t[0],function(i){t.data("ui-tooltip-open")&&n._delay(function(){e&&(e.type=o),this._open(e,t,i)})}),i&&this._open(e,t,i),void 0)},_open:function(i,s,n){function o(t){l.of=t,a.is(":hidden")||a.position(l)}var a,r,h,l=t.extend({},this.options.position);
if(n){if(a=this._find(s),a.length)return a.find(".ui-tooltip-content").html(n),void 0;s.is("[title]")&&(i&&"mouseover"===i.type?s.attr("title",""):s.removeAttr("title")),a=this._tooltip(s),e(s,a.attr("id")),a.find(".ui-tooltip-content").html(n),this.options.track&&i&&/^mouse/.test(i.type)?(this._on(this.document,{mousemove:o}),o(i)):a.position(t.extend({of:s},this.options.position)),a.hide(),this._show(a,this.options.show),this.options.show&&this.options.show.delay&&(h=this.delayedShow=setInterval(function(){a.is(":visible")&&(o(l.of),clearInterval(h))},t.fx.interval)),this._trigger("open",i,{tooltip:a}),r={keyup:function(e){if(e.keyCode===t.ui.keyCode.ESCAPE){var i=t.Event(e);i.currentTarget=s[0],this.close(i,!0)}},remove:function(){this._removeTooltip(a)}},i&&"mouseover"!==i.type||(r.mouseleave="close"),i&&"focusin"!==i.type||(r.focusout="close"),this._on(!0,s,r)}},close:function(e){var s=this,n=t(e?e.currentTarget:this.element),o=this._find(n);this.closing||(clearInterval(this.delayedShow),n.data("ui-tooltip-title")&&n.attr("title",n.data("ui-tooltip-title")),i(n),o.stop(!0),this._hide(o,this.options.hide,function(){s._removeTooltip(t(this))}),n.removeData("ui-tooltip-open"),this._off(n,"mouseleave focusout keyup"),n[0]!==this.element[0]&&this._off(n,"remove"),this._off(this.document,"mousemove"),e&&"mouseleave"===e.type&&t.each(this.parents,function(e,i){t(i.element).attr("title",i.title),delete s.parents[e]}),this.closing=!0,this._trigger("close",e,{tooltip:o}),this.closing=!1)},_tooltip:function(e){var i="ui-tooltip-"+s++,n=t("<div>").attr({id:i,role:"tooltip"}).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content "+(this.options.tooltipClass||""));return t("<div>").addClass("ui-tooltip-content").appendTo(n),n.appendTo(this.document[0].body),this.tooltips[i]=e,n},_find:function(e){var i=e.data("ui-tooltip-id");return i?t("#"+i):t()},_removeTooltip:function(t){t.remove(),delete this.tooltips[t.attr("id")]},_destroy:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur");n.target=n.currentTarget=s[0],e.close(n,!0),t("#"+i).remove(),s.data("ui-tooltip-title")&&(s.attr("title",s.data("ui-tooltip-title")),s.removeData("ui-tooltip-title"))})}})}(jQuery);/*!** End file: jquery-ui-1.10.3.min.js ***/
/*!** Begin file: hframecom.compressed.js ***/
function HFrameParent(d,e,b){var a=arguments[2]||100;this.callback=e;if(typeof(d)=="string"){this.frame=document.getElementById(d)}else{if(typeof(d)=="object"){this.frame=d}}this.childUrl=this.frame.src;var c=this;if(window.postMessage){HFrameLib.addDomListener(window,"message",function(f){c.receive.call(c,f)})}else{if(a>0){this.interval=window.setInterval(function(){c.receive.call(c)},a)}}}HFrameParent.prototype.send=function(a){if(window.postMessage){this.frame.contentWindow.postMessage(a,this.childUrl)}else{this.frame.src=this.childUrl+"#"+encodeURIComponent(a)}};HFrameParent.prototype.receive=function(a){var b=HFrameLib.receiveMessage(a);if(b){this.callback(b)}};function HFrameChild(d,b){var a=arguments[1]||100;this.callback=d;var c=this;if(window.postMessage){HFrameLib.addDomListener(window,"message",function(e){c.receive.call(c,e)})}else{if(a>0){this.interval=window.setInterval(function(){c.receive.call(c)},a)}}}HFrameChild.prototype.send=function(a){if(!document.referrer){return}if(window.postMessage){parent.postMessage(a,document.referrer)}else{parent.location=document.referrer+"#"+encodeURIComponent(a)}};HFrameChild.prototype.receive=function(a){var b=HFrameLib.receiveMessage(a);if(b){this.callback(b)}};var HFrameLib={addDomListener:function(c,a,b){if(c.addEventListener){c.addEventListener(a,b,false)}else{if(c.attachEvent){c.attachEvent("on"+a,b)}}},receiveMessage:function(a){var b="";if(a&&a.data){b=a.data}else{if(location.hash===""||location.hash=="#"||location.hash=="#-"){return false}b=decodeURIComponent(location.hash.substring(1));location.hash="#-"}return b}};/*!** End file: hframecom.compressed.js ***/
/*!** Begin file: jquery.cookie.js ***/
/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options, disableencoding) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options = $.extend({}, options); // clone object since it's unexpected behavior if the expired property were changed
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // NOTE Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', (typeof(disableencoding) == 'undefined' ? encodeURIComponent(value) : value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
/*!** End file: jquery.cookie.js ***/
/*!** Begin file: jquery.easing.1.3.js ***/
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
/*!** End file: jquery.easing.1.3.js ***/
/*!** Begin file: jquery.ui.touch.punch.js ***/
/*!
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function ($) {

  // Detect touch support
  $.support.touch = 'ontouchend' in document;

  // Ignore browsers without touch support
  if (!$.support.touch) {
    return;
  }

  var mouseProto = $.ui.mouse.prototype,
      _mouseInit = mouseProto._mouseInit,
      touchHandled;

  /**
   * Simulate a mouse event based on a corresponding touch event
   * @param {Object} event A touch event
   * @param {String} simulatedType The corresponding mouse event
   */
  function simulateMouseEvent (event, simulatedType) {

    // Ignore multi-touch events
    if (event.originalEvent.touches.length > 1) {
      return;
    }

    event.preventDefault();

    var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');
    
    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
      simulatedType,    // type
      true,             // bubbles                    
      true,             // cancelable                 
      window,           // view                       
      1,                // detail                     
      touch.screenX,    // screenX                    
      touch.screenY,    // screenY                    
      touch.clientX,    // clientX                    
      touch.clientY,    // clientY                    
      false,            // ctrlKey                    
      false,            // altKey                     
      false,            // shiftKey                   
      false,            // metaKey                    
      0,                // button                     
      null              // relatedTarget              
    );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
  }

  /**
   * Handle the jQuery UI widget's touchstart events
   * @param {Object} event The widget element's touchstart event
   */
  mouseProto._touchStart = function (event) {

    var self = this;

    // Ignore the event if another widget is already being handled
    if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
      return;
    }

    // Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true;

    // Track movement to determine if interaction was a click
    self._touchMoved = false;

    // Simulate the mouseover event
    simulateMouseEvent(event, 'mouseover');

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');

    // Simulate the mousedown event
    simulateMouseEvent(event, 'mousedown');
  };

  /**
   * Handle the jQuery UI widget's touchmove events
   * @param {Object} event The document's touchmove event
   */
  mouseProto._touchMove = function (event) {

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Interaction was not a click
    this._touchMoved = true;

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
  };

  /**
   * Handle the jQuery UI widget's touchend events
   * @param {Object} event The document's touchend event
   */
  mouseProto._touchEnd = function (event) {

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Simulate the mouseup event
    simulateMouseEvent(event, 'mouseup');

    // Simulate the mouseout event
    simulateMouseEvent(event, 'mouseout');

    // If the touch interaction did not move, it should trigger a click
    if (!this._touchMoved) {

      // Simulate the click event
      simulateMouseEvent(event, 'click');
    }

    // Unset the flag to allow other widgets to inherit the touch event
    touchHandled = false;
  };

  /**
   * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
   * This method extends the widget with bound touch event handlers that
   * translate touch events to mouse events and pass them to the widget's
   * original mouse event handling methods.
   */
  mouseProto._mouseInit = function () {
    
    var self = this;

    // Delegate the touch handlers to the widget's element
    self.element
      .bind('touchstart', $.proxy(self, '_touchStart'))
      .bind('touchmove', $.proxy(self, '_touchMove'))
      .bind('touchend', $.proxy(self, '_touchEnd'));

    // Call the original $.ui.mouse init method
    _mouseInit.call(self);
  };

})(jQuery);
/*!** End file: jquery.ui.touch.punch.js ***/
/*!** Begin file: jquery-ui-datepicker-sv.js ***/
/* Swedish initialisation for the jQuery UI date picker plugin. */
/* Written by Anders Ekdahl ( anders@nomadiz.se). */

jQuery(function($){
    $.datepicker.regional['sv'] = {
		closeText: 'Stäng',
		prevText: '&laquo; Föregående månad',
		nextText: 'Nästa månad &raquo;',
		currentText: 'Idag',
		monthNames: ['Januari','Februari','Mars','April','Maj','Juni',
		'Juli','Augusti','September','Oktober','November','December'],
		monthNamesShort: ['Jan','Feb','Mar','Apr','Maj','Jun',
		'Jul','Aug','Sep','Okt','Nov','Dec'],
		dayNamesShort: ['Sön','Mån','Tis','Ons','Tor','Fre','Lör'],
		dayNames: ['Söndag','Måndag','Tisdag','Onsdag','Torsdag','Fredag','Lördag'],
		dayNamesMin: ['Sö','Må','Ti','On','To','Fr','Lö'],
		dateFormat: 'yy-mm-dd', firstDay: 1,
		isRTL: false,
		minDate: new Date(),
		hideIfNoPrevNext: false};
	$.datepicker.setDefaults($.datepicker.regional['sv']);
});
/*!** End file: jquery-ui-datepicker-sv.js ***/
/*!** Begin file: jquery.lazyload.js ***/
/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2011 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.6.0-dev
 *
 */
(function($) {

    $.lazyload = function(options) {
        var settings = {
            threshold   : 0,
            failurelimit    : 0,
            event       : "scroll",
            effect      : "show",
            selector    : ".lazyload",
            container   : window
        };

        if (options) {
            $.extend(settings, options);
        }

        $(settings.container).bind(settings.event, function(event) {
            var counter = 0;
            $(settings.selector).each(function() {
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        load_img(this);
                } else {
                    if (counter++ > settings.failurelimit) {
                        return false;
                    }
                }
            });
        });

        var load_img = function(self) {
            self.loaded = false;

            if (!self.loaded) {
                $(self)
                    .removeClass("lazyload")
                    .addClass("lazyloaded")
                    .attr("src", $(self).attr("longdesc"));
            }
        }

        /* Force initial check if images should appear. */
        $(settings.container).trigger(settings.event);

        return this;

    };

    /* Convenience methods in jQuery namespace.                               */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).height() + $(window).scrollTop();
        } else {
            var fold = $(settings.container).offset().top + $(settings.container).height();
        }
        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).width() + $(window).scrollLeft();
        } else {
            var fold = $(settings.container).offset().left + $(settings.container).width();
        }
        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).scrollTop();
        } else {
            var fold = $(settings.container).offset().top;
        }
        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).scrollLeft();
        } else {
            var fold = $(settings.container).offset().left;
        }
        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };
    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() */

    $.extend($.expr[':'], {
        "below-the-fold" : "$.belowthefold(a, {threshold : 0, container: window})",
        "above-the-fold" : "!$.belowthefold(a, {threshold : 0, container: window})",
        "right-of-fold"  : "$.rightoffold(a, {threshold : 0, container: window})",
        "left-of-fold"   : "!$.rightoffold(a, {threshold : 0, container: window})"
    });

})(jQuery);/*!** End file: jquery.lazyload.js ***/
/*!** Begin file: jquery.colorbox.js ***/
/*!
    Colorbox v1.4.33 - 2013-10-31
    jQuery lightbox and modal window plugin
    (c) 2013 Jack Moore - http://www.jacklmoore.com/colorbox
    license: http://www.opensource.org/licenses/mit-license.php
*/
(function ($, document, window) {
    var
    // Default settings object.
    // See http://jacklmoore.com/colorbox for details.
    defaults = {
        // data sources
        html: false,
        photo: false,
        iframe: false,
        inline: false,

        // behavior and appearance
        transition: "elastic",
        speed: 300,
        fadeOut: 300,
        width: false,
        initialWidth: "600",
        innerWidth: false,
        maxWidth: false,
        height: false,
        initialHeight: "450",
        innerHeight: false,
        maxHeight: false,
        scalePhotos: true,
        scrolling: true,
        href: false,
        title: false,
        rel: false,
        opacity: 0.9,
        preloading: true,
        className: false,
        overlayClose: true,
        escKey: true,
        arrowKey: true,
        top: false,
        bottom: false,
        left: false,
        right: false,
        fixed: false,
        data: undefined,
        closeButton: true,
        fastIframe: true,
        open: false,
        reposition: true,
        loop: true,
        slideshow: false,
        slideshowAuto: true,
        slideshowSpeed: 2500,
        slideshowStart: "start slideshow",
        slideshowStop: "stop slideshow",
        photoRegex: /\.(gif|png|jp(e|g|eg)|bmp|ico|webp)((#|\?).*)?$/i,

        // alternate image paths for high-res displays
        retinaImage: false,
        retinaUrl: false,
        retinaSuffix: '@2x.$1',

        // internationalization
        current: "image {current} of {total}",
        previous: "previous",
        next: "next",
        close: "close",
        xhrError: "This content failed to load.",
        imgError: "This image failed to load.",

        // accessbility
        returnFocus: true,
        trapFocus: true,

        // callbacks
        onOpen: false,
        onLoad: false,
        onComplete: false,
        onCleanup: false,
        onClosed: false
    },
    
    // Abstracting the HTML and event identifiers for easy rebranding
    colorbox = 'colorbox',
    prefix = 'cbox',
    boxElement = prefix + 'Element',
    
    // Events
    event_open = prefix + '_open',
    event_load = prefix + '_load',
    event_complete = prefix + '_complete',
    event_cleanup = prefix + '_cleanup',
    event_closed = prefix + '_closed',
    event_purge = prefix + '_purge',

    // Cached jQuery Object Variables
    $overlay,
    $box,
    $wrap,
    $content,
    $topBorder,
    $leftBorder,
    $rightBorder,
    $bottomBorder,
    $related,
    $window,
    $loaded,
    $loadingBay,
    $loadingOverlay,
    $title,
    $current,
    $slideshow,
    $next,
    $prev,
    $close,
    $groupControls,
    $events = $('<a/>'), // $([]) would be prefered, but there is an issue with jQuery 1.4.2
    
    // Variables for cached values or use across multiple functions
    settings,
    interfaceHeight,
    interfaceWidth,
    loadedHeight,
    loadedWidth,
    element,
    index,
    photo,
    open,
    active,
    closing,
    loadingTimer,
    publicMethod,
    div = "div",
    className,
    requests = 0,
    previousCSS = {},
    init;

    // ****************
    // HELPER FUNCTIONS
    // ****************
    
    // Convenience function for creating new jQuery objects
    function $tag(tag, id, css) {
        var element = document.createElement(tag);

        if (id) {
            element.id = prefix + id;
        }

        if (css) {
            element.style.cssText = css;
        }

        return $(element);
    }
    
    // Get the window height using innerHeight when available to avoid an issue with iOS
    // http://bugs.jquery.com/ticket/6724
    function winheight() {
        return window.innerHeight ? window.innerHeight : $(window).height();
    }

    // Determine the next and previous members in a group.
    function getIndex(increment) {
        var
        max = $related.length,
        newIndex = (index + increment) % max;
        
        return (newIndex < 0) ? max + newIndex : newIndex;
    }

    // Convert '%' and 'px' values to integers
    function setSize(size, dimension) {
        return Math.round((/%/.test(size) ? ((dimension === 'x' ? $window.width() : winheight()) / 100) : 1) * parseInt(size, 10));
    }
    
    // Checks an href to see if it is a photo.
    // There is a force photo option (photo: true) for hrefs that cannot be matched by the regex.
    function isImage(settings, url) {
        return settings.photo || settings.photoRegex.test(url);
    }

    function retinaUrl(settings, url) {
        return settings.retinaUrl && window.devicePixelRatio > 1 ? url.replace(settings.photoRegex, settings.retinaSuffix) : url;
    }

    function trapFocus(e) {
        if ('contains' in $box[0] && !$box[0].contains(e.target)) {
            e.stopPropagation();
            $box.focus();
        }
    }

    // Assigns function results to their respective properties
    function makeSettings() {
        var i,
            data = $.data(element, colorbox);
        
        if (data == null) {
            settings = $.extend({}, defaults);
            if (console && console.log) {
                console.log('Error: cboxElement missing settings object');
            }
        } else {
            settings = $.extend({}, data);
        }
        
        for (i in settings) {
            if ($.isFunction(settings[i]) && i.slice(0, 2) !== 'on') { // checks to make sure the function isn't one of the callbacks, they will be handled at the appropriate time.
                settings[i] = settings[i].call(element);
            }
        }
        
        settings.rel = settings.rel || element.rel || $(element).data('rel') || 'nofollow';
        settings.href = settings.href || $(element).attr('href');
        settings.title = settings.title || element.title;
        
        if (typeof settings.href === "string") {
            settings.href = $.trim(settings.href);
        }
    }

    function trigger(event, callback) {
        // for external use
        $(document).trigger(event);

        // for internal use
        $events.triggerHandler(event);

        if ($.isFunction(callback)) {
            callback.call(element);
        }
    }


    var slideshow = (function(){
        var active,
            className = prefix + "Slideshow_",
            click = "click." + prefix,
            timeOut;

        function clear () {
            clearTimeout(timeOut);
        }

        function set() {
            if (settings.loop || $related[index + 1]) {
                clear();
                timeOut = setTimeout(publicMethod.next, settings.slideshowSpeed);
            }
        }

        function start() {
            $slideshow
                .html(settings.slideshowStop)
                .unbind(click)
                .one(click, stop);

            $events
                .bind(event_complete, set)
                .bind(event_load, clear);

            $box.removeClass(className + "off").addClass(className + "on");
        }

        function stop() {
            clear();
            
            $events
                .unbind(event_complete, set)
                .unbind(event_load, clear);

            $slideshow
                .html(settings.slideshowStart)
                .unbind(click)
                .one(click, function () {
                    publicMethod.next();
                    start();
                });

            $box.removeClass(className + "on").addClass(className + "off");
        }

        function reset() {
            active = false;
            $slideshow.hide();
            clear();
            $events
                .unbind(event_complete, set)
                .unbind(event_load, clear);
            $box.removeClass(className + "off " + className + "on");
        }

        return function(){
            if (active) {
                if (!settings.slideshow) {
                    $events.unbind(event_cleanup, reset);
                    reset();
                }
            } else {
                if (settings.slideshow && $related[1]) {
                    active = true;
                    $events.one(event_cleanup, reset);
                    if (settings.slideshowAuto) {
                        start();
                    } else {
                        stop();
                    }
                    $slideshow.show();
                }
            }
        };

    }());


    function launch(target) {
        if (!closing) {
            
            element = target;
            
            makeSettings();
            
            $related = $(element);
            
            index = 0;
            
            if (settings.rel !== 'nofollow') {
                $related = $('.' + boxElement).filter(function () {
                    var data = $.data(this, colorbox),
                        relRelated;

                    if (data) {
                        relRelated =  $(this).data('rel') || data.rel || this.rel;
                    }
                    
                    return (relRelated === settings.rel);
                });
                index = $related.index(element);
                
                // Check direct calls to Colorbox.
                if (index === -1) {
                    $related = $related.add(element);
                    index = $related.length - 1;
                }
            }
            
            $overlay.css({
                opacity: parseFloat(settings.opacity),
                cursor: settings.overlayClose ? "pointer" : "auto",
                visibility: 'visible'
            }).show();
            

            if (className) {
                $box.add($overlay).removeClass(className);
            }
            if (settings.className) {
                $box.add($overlay).addClass(settings.className);
            }
            className = settings.className;

            if (settings.closeButton) {
                $close.html(settings.close).appendTo($content);
            } else {
                $close.appendTo('<div/>');
            }

            if (!open) {
                open = active = true; // Prevents the page-change action from queuing up if the visitor holds down the left or right keys.
                
                // Show colorbox so the sizes can be calculated in older versions of jQuery
                $box.css({visibility:'hidden', display:'block'});
                
                $loaded = $tag(div, 'LoadedContent', 'width:0; height:0; overflow:hidden');
                $content.css({width:'', height:''}).append($loaded);

                // Cache values needed for size calculations
                interfaceHeight = $topBorder.height() + $bottomBorder.height() + $content.outerHeight(true) - $content.height();
                interfaceWidth = $leftBorder.width() + $rightBorder.width() + $content.outerWidth(true) - $content.width();
                loadedHeight = $loaded.outerHeight(true);
                loadedWidth = $loaded.outerWidth(true);

                // Opens inital empty Colorbox prior to content being loaded.
                settings.w = setSize(settings.initialWidth, 'x');
                settings.h = setSize(settings.initialHeight, 'y');
                $loaded.css({width:'', height:settings.h});
                publicMethod.position();

                trigger(event_open, settings.onOpen);
                
                $groupControls.add($title).hide();

                $box.focus();
                
                if (settings.trapFocus) {
                    // Confine focus to the modal
                    // Uses event capturing that is not supported in IE8-
                    if (document.addEventListener) {

                        document.addEventListener('focus', trapFocus, true);
                        
                        $events.one(event_closed, function () {
                            document.removeEventListener('focus', trapFocus, true);
                        });
                    }
                }

                // Return focus on closing
                if (settings.returnFocus) {
                    $events.one(event_closed, function () {
                        $(element).focus();
                    });
                }
            }
            load();
        }
    }

    // Colorbox's markup needs to be added to the DOM prior to being called
    // so that the browser will go ahead and load the CSS background images.
    function appendHTML() {
        if (!$box && document.body) {
            init = false;
            $window = $(window);
            $box = $tag(div).attr({
                id: colorbox,
                'class': $.support.opacity === false ? prefix + 'IE' : '', // class for optional IE8 & lower targeted CSS.
                role: 'dialog',
                tabindex: '-1'
            }).hide();
            $overlay = $tag(div, "Overlay").hide();
            $loadingOverlay = $([$tag(div, "LoadingOverlay")[0],$tag(div, "LoadingGraphic")[0]]);
            $wrap = $tag(div, "Wrapper");
            $content = $tag(div, "Content").append(
                $title = $tag(div, "Title"),
                $current = $tag(div, "Current"),
                $prev = $('<button type="button"/>').attr({id:prefix+'Previous'}),
                $next = $('<button type="button"/>').attr({id:prefix+'Next'}),
                $slideshow = $tag('button', "Slideshow"),
                $loadingOverlay
            );

            $close = $('<button type="button"/>').attr({id:prefix+'Close'});
            
            $wrap.append( // The 3x3 Grid that makes up Colorbox
                $tag(div).append(
                    $tag(div, "TopLeft"),
                    $topBorder = $tag(div, "TopCenter"),
                    $tag(div, "TopRight")
                ),
                $tag(div, false, 'clear:left').append(
                    $leftBorder = $tag(div, "MiddleLeft"),
                    $content,
                    $rightBorder = $tag(div, "MiddleRight")
                ),
                $tag(div, false, 'clear:left').append(
                    $tag(div, "BottomLeft"),
                    $bottomBorder = $tag(div, "BottomCenter"),
                    $tag(div, "BottomRight")
                )
            ).find('div div').css({'float': 'left'});
            
            $loadingBay = $tag(div, false, 'position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;');
            
            $groupControls = $next.add($prev).add($current).add($slideshow);

            $(document.body).append($overlay, $box.append($wrap, $loadingBay));
        }
    }

    // Add Colorbox's event bindings
    function addBindings() {
        function clickHandler(e) {
            // ignore non-left-mouse-clicks and clicks modified with ctrl / command, shift, or alt.
            // See: http://jacklmoore.com/notes/click-events/
            if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                launch(this);
            }
        }

        if ($box) {
            if (!init) {
                init = true;

                // Anonymous functions here keep the public method from being cached, thereby allowing them to be redefined on the fly.
                $next.click(function () {
                    publicMethod.next();
                });
                $prev.click(function () {
                    publicMethod.prev();
                });
                $close.click(function () {
                    publicMethod.close();
                });
                $overlay.click(function () {
                    if (settings.overlayClose) {
                        publicMethod.close();
                    }
                });
                
                // Key Bindings
                $(document).bind('keydown.' + prefix, function (e) {
                    var key = e.keyCode;
                    if (open && settings.escKey && key === 27) {
                        e.preventDefault();
                        publicMethod.close();
                    }
                    if (open && settings.arrowKey && $related[1] && !e.altKey) {
                        if (key === 37) {
                            e.preventDefault();
                            $prev.click();
                        } else if (key === 39) {
                            e.preventDefault();
                            $next.click();
                        }
                    }
                });

                if ($.isFunction($.fn.on)) {
                    // For jQuery 1.7+
                    $(document).on('click.'+prefix, '.'+boxElement, clickHandler);
                } else {
                    // For jQuery 1.3.x -> 1.6.x
                    // This code is never reached in jQuery 1.9, so do not contact me about 'live' being removed.
                    // This is not here for jQuery 1.9, it's here for legacy users.
                    $('.'+boxElement).live('click.'+prefix, clickHandler);
                }
            }
            return true;
        }
        return false;
    }

    // Don't do anything if Colorbox already exists.
    if ($.colorbox) {
        return;
    }

    // Append the HTML when the DOM loads
    $(appendHTML);


    // ****************
    // PUBLIC FUNCTIONS
    // Usage format: $.colorbox.close();
    // Usage from within an iframe: parent.jQuery.colorbox.close();
    // ****************
    
    publicMethod = $.fn[colorbox] = $[colorbox] = function (options, callback) {
        var $this = this;
        
        options = options || {};
        
        appendHTML();

        if (addBindings()) {
            if ($.isFunction($this)) { // assume a call to $.colorbox
                $this = $('<a/>');
                options.open = true;
            } else if (!$this[0]) { // colorbox being applied to empty collection
                return $this;
            }
            
            if (callback) {
                options.onComplete = callback;
            }
            
            $this.each(function () {
                $.data(this, colorbox, $.extend({}, $.data(this, colorbox) || defaults, options));
            }).addClass(boxElement);
            
            if (($.isFunction(options.open) && options.open.call($this)) || options.open) {
                launch($this[0]);
            }
        }
        
        return $this;
    };

    publicMethod.position = function (speed, loadedCallback) {
        var
        css,
        top = 0,
        left = 0,
        offset = $box.offset(),
        scrollTop,
        scrollLeft;
        
        $window.unbind('resize.' + prefix);

        // remove the modal so that it doesn't influence the document width/height
        $box.css({top: -9e4, left: -9e4});

        scrollTop = $window.scrollTop();
        scrollLeft = $window.scrollLeft();

        if (settings.fixed) {
            offset.top -= scrollTop;
            offset.left -= scrollLeft;
            $box.css({position: 'fixed'});
        } else {
            top = scrollTop;
            left = scrollLeft;
            $box.css({position: 'absolute'});
        }

        // keeps the top and left positions within the browser's viewport.
        if (settings.right !== false) {
            left += Math.max($window.width() - settings.w - loadedWidth - interfaceWidth - setSize(settings.right, 'x'), 0);
        } else if (settings.left !== false) {
            left += setSize(settings.left, 'x');
        } else {
            left += Math.round(Math.max($window.width() - settings.w - loadedWidth - interfaceWidth, 0) / 2);
        }
        
        if (settings.bottom !== false) {
            top += Math.max(winheight() - settings.h - loadedHeight - interfaceHeight - setSize(settings.bottom, 'y'), 0);
        } else if (settings.top !== false) {
            top += setSize(settings.top, 'y');
        } else {
            top += Math.round(Math.max(winheight() - settings.h - loadedHeight - interfaceHeight, 0) / 2);
        }

        $box.css({top: offset.top, left: offset.left, visibility:'visible'});
        
        // this gives the wrapper plenty of breathing room so it's floated contents can move around smoothly,
        // but it has to be shrank down around the size of div#colorbox when it's done.  If not,
        // it can invoke an obscure IE bug when using iframes.
        $wrap[0].style.width = $wrap[0].style.height = "9999px";
        
        function modalDimensions() {
            $topBorder[0].style.width = $bottomBorder[0].style.width = $content[0].style.width = (parseInt($box[0].style.width,10) - interfaceWidth)+'px';
            $content[0].style.height = $leftBorder[0].style.height = $rightBorder[0].style.height = (parseInt($box[0].style.height,10) - interfaceHeight)+'px';
        }

        css = {width: settings.w + loadedWidth + interfaceWidth, height: settings.h + loadedHeight + interfaceHeight, top: top, left: left};

        // setting the speed to 0 if the content hasn't changed size or position
        if (speed) {
            var tempSpeed = 0;
            $.each(css, function(i){
                if (css[i] !== previousCSS[i]) {
                    tempSpeed = speed;
                    return;
                }
            });
            speed = tempSpeed;
        }

        previousCSS = css;

        if (!speed) {
            $box.css(css);
        }

        $box.dequeue().animate(css, {
            duration: speed || 0,
            complete: function () {
                modalDimensions();
                
                active = false;
                
                // shrink the wrapper down to exactly the size of colorbox to avoid a bug in IE's iframe implementation.
                $wrap[0].style.width = (settings.w + loadedWidth + interfaceWidth) + "px";
                $wrap[0].style.height = (settings.h + loadedHeight + interfaceHeight) + "px";
                
                if (settings.reposition) {
                    setTimeout(function () {  // small delay before binding onresize due to an IE8 bug.
                        $window.bind('resize.' + prefix, publicMethod.position);
                    }, 1);
                }

                if (loadedCallback) {
                    loadedCallback();
                }
            },
            step: modalDimensions
        });
    };

    publicMethod.resize = function (options) {
        var scrolltop;
        
        if (open) {
            options = options || {};
            
            if (options.width) {
                settings.w = setSize(options.width, 'x') - loadedWidth - interfaceWidth;
            }

            if (options.innerWidth) {
                settings.w = setSize(options.innerWidth, 'x');
            }

            $loaded.css({width: settings.w});
            
            if (options.height) {
                settings.h = setSize(options.height, 'y') - loadedHeight - interfaceHeight;
            }

            if (options.innerHeight) {
                settings.h = setSize(options.innerHeight, 'y');
            }

            if (!options.innerHeight && !options.height) {
                scrolltop = $loaded.scrollTop();
                $loaded.css({height: "auto"});
                settings.h = $loaded.height();
            }

            $loaded.css({height: settings.h});

            if(scrolltop) {
                $loaded.scrollTop(scrolltop);
            }
            
            publicMethod.position(settings.transition === "none" ? 0 : settings.speed);
        }
    };

    publicMethod.prep = function (object) {
        if (!open) {
            return;
        }
        
        var callback, speed = settings.transition === "none" ? 0 : settings.speed;

        $loaded.empty().remove(); // Using empty first may prevent some IE7 issues.

        $loaded = $tag(div, 'LoadedContent').append(object);
        
        function getWidth() {
            settings.w = settings.w || $loaded.width();
            settings.w = settings.mw && settings.mw < settings.w ? settings.mw : settings.w;
            return settings.w;
        }
        function getHeight() {
            settings.h = settings.h || $loaded.height();
            settings.h = settings.mh && settings.mh < settings.h ? settings.mh : settings.h;
            return settings.h;
        }
        
        $loaded.hide()
        .appendTo($loadingBay.show())// content has to be appended to the DOM for accurate size calculations.
        .css({width: getWidth(), overflow: settings.scrolling ? 'auto' : 'hidden'})
        .css({height: getHeight()})// sets the height independently from the width in case the new width influences the value of height.
        .prependTo($content);
        
        $loadingBay.hide();
        
        // floating the IMG removes the bottom line-height and fixed a problem where IE miscalculates the width of the parent element as 100% of the document width.
        
        $(photo).css({'float': 'none'});

        callback = function () {
            var total = $related.length,
                iframe,
                frameBorder = 'frameBorder',
                allowTransparency = 'allowTransparency',
                complete;
            
            if (!open) {
                return;
            }
            
            function removeFilter() { // Needed for IE7 & IE8 in versions of jQuery prior to 1.7.2
                if ($.support.opacity === false) {
                    $box[0].style.removeAttribute('filter');
                }
            }
            
            complete = function () {
                clearTimeout(loadingTimer);
                $loadingOverlay.hide();
                trigger(event_complete, settings.onComplete);
            };

            
            $title.html(settings.title).add($loaded).show();
            
            if (total > 1) { // handle grouping
                if (typeof settings.current === "string") {
                    $current.html(settings.current.replace('{current}', index + 1).replace('{total}', total)).show();
                }
                
                $next[(settings.loop || index < total - 1) ? "show" : "hide"]().html(settings.next);
                $prev[(settings.loop || index) ? "show" : "hide"]().html(settings.previous);
                
                slideshow();
                
                // Preloads images within a rel group
                if (settings.preloading) {
                    $.each([getIndex(-1), getIndex(1)], function(){
                        var src,
                            img,
                            i = $related[this],
                            data = $.data(i, colorbox);

                        if (data && data.href) {
                            src = data.href;
                            if ($.isFunction(src)) {
                                src = src.call(i);
                            }
                        } else {
                            src = $(i).attr('href');
                        }

                        if (src && isImage(data, src)) {
                            src = retinaUrl(data, src);
                            img = document.createElement('img');
                            img.src = src;
                        }
                    });
                }
            } else {
                $groupControls.hide();
            }
            
            if (settings.iframe) {
                iframe = $tag('iframe')[0];
                
                if (frameBorder in iframe) {
                    iframe[frameBorder] = 0;
                }
                
                if (allowTransparency in iframe) {
                    iframe[allowTransparency] = "true";
                }

                if (!settings.scrolling) {
                    iframe.scrolling = "no";
                }
                
                $(iframe)
                    .attr({
                        src: settings.href,
                        name: (new Date()).getTime(), // give the iframe a unique name to prevent caching
                        'class': prefix + 'Iframe',
                        allowFullScreen : true, // allow HTML5 video to go fullscreen
                        webkitAllowFullScreen : true,
                        mozallowfullscreen : true
                    })
                    .one('load', complete)
                    .appendTo($loaded);
                
                $events.one(event_purge, function () {
                    iframe.src = "//about:blank";
                });

                if (settings.fastIframe) {
                    $(iframe).trigger('load');
                }
            } else {
                complete();
            }
            
            if (settings.transition === 'fade') {
                $box.fadeTo(speed, 1, removeFilter);
            } else {
                removeFilter();
            }
        };
        
        if (settings.transition === 'fade') {
            $box.fadeTo(speed, 0, function () {
                publicMethod.position(0, callback);
            });
        } else {
            publicMethod.position(speed, callback);
        }
    };

    function load () {
        var href, setResize, prep = publicMethod.prep, $inline, request = ++requests;
        
        active = true;
        
        photo = false;
        
        element = $related[index];
        
        makeSettings();
        
        trigger(event_purge);
        
        trigger(event_load, settings.onLoad);
        
        settings.h = settings.height ?
                setSize(settings.height, 'y') - loadedHeight - interfaceHeight :
                settings.innerHeight && setSize(settings.innerHeight, 'y');
        
        settings.w = settings.width ?
                setSize(settings.width, 'x') - loadedWidth - interfaceWidth :
                settings.innerWidth && setSize(settings.innerWidth, 'x');
        
        // Sets the minimum dimensions for use in image scaling
        settings.mw = settings.w;
        settings.mh = settings.h;
        
        // Re-evaluate the minimum width and height based on maxWidth and maxHeight values.
        // If the width or height exceed the maxWidth or maxHeight, use the maximum values instead.
        if (settings.maxWidth) {
            settings.mw = setSize(settings.maxWidth, 'x') - loadedWidth - interfaceWidth;
            settings.mw = settings.w && settings.w < settings.mw ? settings.w : settings.mw;
        }
        if (settings.maxHeight) {
            settings.mh = setSize(settings.maxHeight, 'y') - loadedHeight - interfaceHeight;
            settings.mh = settings.h && settings.h < settings.mh ? settings.h : settings.mh;
        }
        
        href = settings.href;
        
        loadingTimer = setTimeout(function () {
            $loadingOverlay.show();
        }, 100);
        
        if (settings.inline) {
            // Inserts an empty placeholder where inline content is being pulled from.
            // An event is bound to put inline content back when Colorbox closes or loads new content.
            $inline = $tag(div).hide().insertBefore($(href)[0]);

            $events.one(event_purge, function () {
                $inline.replaceWith($loaded.children());
            });

            prep($(href));
        } else if (settings.iframe) {
            // IFrame element won't be added to the DOM until it is ready to be displayed,
            // to avoid problems with DOM-ready JS that might be trying to run in that iframe.
            prep(" ");
        } else if (settings.html) {
            prep(settings.html);
        } else if (isImage(settings, href)) {

            href = retinaUrl(settings, href);

            photo = document.createElement('img');

            $(photo)
            .addClass(prefix + 'Photo')
            .bind('error',function () {
                settings.title = false;
                prep($tag(div, 'Error').html(settings.imgError));
            })
            .one('load', function () {
                var percent;

                if (request !== requests) {
                    return;
                }

                $.each(['alt', 'longdesc', 'aria-describedby'], function(i,val){
                    var attr = $(element).attr(val) || $(element).attr('data-'+val);
                    if (attr) {
                        photo.setAttribute(val, attr);
                    }
                });

                if (settings.retinaImage && window.devicePixelRatio > 1) {
                    photo.height = photo.height / window.devicePixelRatio;
                    photo.width = photo.width / window.devicePixelRatio;
                }

                if (settings.scalePhotos) {
                    setResize = function () {
                        photo.height -= photo.height * percent;
                        photo.width -= photo.width * percent;
                    };
                    if (settings.mw && photo.width > settings.mw) {
                        percent = (photo.width - settings.mw) / photo.width;
                        setResize();
                    }
                    if (settings.mh && photo.height > settings.mh) {
                        percent = (photo.height - settings.mh) / photo.height;
                        setResize();
                    }
                }
                
                if (settings.h) {
                    photo.style.marginTop = Math.max(settings.mh - photo.height, 0) / 2 + 'px';
                }
                
                if ($related[1] && (settings.loop || $related[index + 1])) {
                    photo.style.cursor = 'pointer';
                    photo.onclick = function () {
                        publicMethod.next();
                    };
                }

                photo.style.width = photo.width + 'px';
                photo.style.height = photo.height + 'px';

                setTimeout(function () { // A pause because Chrome will sometimes report a 0 by 0 size otherwise.
                    prep(photo);
                }, 1);
            });
            
            setTimeout(function () { // A pause because Opera 10.6+ will sometimes not run the onload function otherwise.
                photo.src = href;
            }, 1);
        } else if (href) {
            $loadingBay.load(href, settings.data, function (data, status) {
                if (request === requests) {
                    prep(status === 'error' ? $tag(div, 'Error').html(settings.xhrError) : $(this).contents());
                }
            });
        }
    }
        
    // Navigates to the next page/image in a set.
    publicMethod.next = function () {
        if (!active && $related[1] && (settings.loop || $related[index + 1])) {
            index = getIndex(1);
            launch($related[index]);
        }
    };
    
    publicMethod.prev = function () {
        if (!active && $related[1] && (settings.loop || index)) {
            index = getIndex(-1);
            launch($related[index]);
        }
    };

    // Note: to use this within an iframe use the following format: parent.jQuery.colorbox.close();
    publicMethod.close = function () {
        if (open && !closing) {
            
            closing = true;
            
            open = false;
            
            trigger(event_cleanup, settings.onCleanup);
            
            $window.unbind('.' + prefix);
            
            $overlay.fadeTo(settings.fadeOut || 0, 0);
            
            $box.stop().fadeTo(settings.fadeOut || 0, 0, function () {
            
                $box.add($overlay).css({'opacity': 1, cursor: 'auto'}).hide();
                
                trigger(event_purge);
                
                $loaded.empty().remove(); // Using empty first may prevent some IE7 issues.
                
                setTimeout(function () {
                    closing = false;
                    trigger(event_closed, settings.onClosed);
                }, 1);
            });
        }
    };

    // Removes changes Colorbox made to the document, but does not remove the plugin.
    publicMethod.remove = function () {
        if (!$box) { return; }

        $box.stop();
        $.colorbox.close();
        $box.stop().remove();
        $overlay.remove();
        closing = false;
        $box = null;
        $('.' + boxElement)
            .removeData(colorbox)
            .removeClass(boxElement);

        $(document).unbind('click.'+prefix);
    };

    // A method for fetching the current element Colorbox is referencing.
    // returns a jQuery object.
    publicMethod.element = function () {
        return $(element);
    };

    publicMethod.settings = defaults;

}(jQuery, document, window));/*!** End file: jquery.colorbox.js ***/
/*!** Begin file: ufo.js ***/
/*	Unobtrusive Flash Objects (UFO) v3.22 <http://www.bobbyvandersluis.com/ufo/>
	Copyright 2005-2007 Bobby van der Sluis
	This software is licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>
*/

var UFO = {
	req: ["movie", "width", "height", "majorversion", "build"],
	opt: ["play", "loop", "menu", "quality", "scale", "salign", "wmode", "bgcolor", "base", "flashvars", "devicefont", "allowscriptaccess", "seamlesstabbing", "allownetworking"],
	optAtt: ["id", "name", "align"],
	optExc: ["swliveconnect"],
	ximovie: "ufo.swf",
	xiwidth: "215",
	xiheight: "138",
	ua: navigator.userAgent.toLowerCase(),
	pluginType: "",
	fv: [0,0],
	foList: [],
		
	create: function(FO, id) {
		if (!UFO.uaHas("w3cdom") || UFO.uaHas("ieMac")) return;
		UFO.getFlashVersion();
		UFO.foList[id] = UFO.updateFO(FO);
		UFO.createCSS("#" + id, "visibility:hidden;");
		UFO.domLoad(id);
	},

	updateFO: function(FO) {
		if (typeof FO.xi != "undefined" && FO.xi == "true") {
			if (typeof FO.ximovie == "undefined") FO.ximovie = UFO.ximovie;
			if (typeof FO.xiwidth == "undefined") FO.xiwidth = UFO.xiwidth;
			if (typeof FO.xiheight == "undefined") FO.xiheight = UFO.xiheight;
		}
		FO.mainCalled = false;
		return FO;
	},

	domLoad: function(id) {
		var _t = setInterval(function() {
			if ((document.getElementsByTagName("body")[0] != null || document.body != null) && document.getElementById(id) != null) {
				UFO.main(id);
				clearInterval(_t);
			}
		}, 250);
		if (typeof document.addEventListener != "undefined") {
			document.addEventListener("DOMContentLoaded", function() { UFO.main(id); clearInterval(_t); } , null); // Gecko, Opera 9+
		}
	},

	main: function(id) {
		var _fo = UFO.foList[id];
		if (_fo.mainCalled) return;
		UFO.foList[id].mainCalled = true;
		document.getElementById(id).style.visibility = "hidden";
		if (UFO.hasRequired(id)) {
			if (UFO.hasFlashVersion(parseInt(_fo.majorversion, 10), parseInt(_fo.build, 10))) {
				if (typeof _fo.setcontainercss != "undefined" && _fo.setcontainercss == "true") UFO.setContainerCSS(id);
				UFO.writeSWF(id);
			}
			else if (_fo.xi == "true" && UFO.hasFlashVersion(6, 65)) {
				UFO.createDialog(id);
			}
		}
		document.getElementById(id).style.visibility = "visible";
	},
	
	createCSS: function(selector, declaration) {
		var _h = document.getElementsByTagName("head")[0]; 
		var _s = UFO.createElement("style");
		if (!UFO.uaHas("ieWin")) _s.appendChild(document.createTextNode(selector + " {" + declaration + "}")); // bugs in IE/Win
		_s.setAttribute("type", "text/css");
		_s.setAttribute("media", "screen"); 
		_h.appendChild(_s);
		if (UFO.uaHas("ieWin") && document.styleSheets && document.styleSheets.length > 0) {
			var _ls = document.styleSheets[document.styleSheets.length - 1];
			if (typeof _ls.addRule == "object") _ls.addRule(selector, declaration);
		}
	},
	
	setContainerCSS: function(id) {
		var _fo = UFO.foList[id];
		var _w = /%/.test(_fo.width) ? "" : "px";
		var _h = /%/.test(_fo.height) ? "" : "px";
		UFO.createCSS("#" + id, "width:" + _fo.width + _w +"; height:" + _fo.height + _h +";");
		if (_fo.width == "100%") {
			UFO.createCSS("body", "margin-left:0; margin-right:0; padding-left:0; padding-right:0;");
		}
		if (_fo.height == "100%") {
			UFO.createCSS("html", "height:100%; overflow:hidden;");
			UFO.createCSS("body", "margin-top:0; margin-bottom:0; padding-top:0; padding-bottom:0; height:100%;");
		}
	},

	createElement: function(el) {
		return (UFO.uaHas("xml") && typeof document.createElementNS != "undefined") ?  document.createElementNS("http://www.w3.org/1999/xhtml", el) : document.createElement(el);
	},

	createObjParam: function(el, aName, aValue) {
		var _p = UFO.createElement("param");
		_p.setAttribute("name", aName);	
		_p.setAttribute("value", aValue);
		el.appendChild(_p);
	},

	uaHas: function(ft) {
		var _u = UFO.ua;
		switch(ft) {
			case "w3cdom":
				return (typeof document.getElementById != "undefined" && typeof document.getElementsByTagName != "undefined" && (typeof document.createElement != "undefined" || typeof document.createElementNS != "undefined"));
			case "xml":
				var _m = document.getElementsByTagName("meta");
				var _l = _m.length;
				for (var i = 0; i < _l; i++) {
					if (/content-type/i.test(_m[i].getAttribute("http-equiv")) && /xml/i.test(_m[i].getAttribute("content"))) return true;
				}
				return false;
			case "ieMac":
				return /msie/.test(_u) && !/opera/.test(_u) && /mac/.test(_u);
			case "ieWin":
				return /msie/.test(_u) && !/opera/.test(_u) && /win/.test(_u);
			case "gecko":
				return /gecko/.test(_u) && !/applewebkit/.test(_u);
			case "opera":
				return /opera/.test(_u);
			case "safari":
				return /applewebkit/.test(_u);
			default:
				return false;
		}
	},
	
	getFlashVersion: function() {
		if (UFO.fv[0] != 0) return;  
		if (navigator.plugins && typeof navigator.plugins["Shockwave Flash"] == "object") {
			UFO.pluginType = "npapi";
			var _d = navigator.plugins["Shockwave Flash"].description;
			if (typeof _d != "undefined") {
				_d = _d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
				var _m = parseInt(_d.replace(/^(.*)\..*$/, "$1"), 10);
				var _r = /r/.test(_d) ? parseInt(_d.replace(/^.*r(.*)$/, "$1"), 10) : 0;
				UFO.fv = [_m, _r];
			}
		}
		else if (window.ActiveXObject) {
			UFO.pluginType = "ax";
			try { // avoid fp 6 crashes
				var _a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
			}
			catch(e) {
				try { 
					var _a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
					UFO.fv = [6, 0];
					_a.AllowScriptAccess = "always"; // throws if fp < 6.47 
				}
				catch(e) {
					if (UFO.fv[0] == 6) return;
				}
				try {
					var _a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
				}
				catch(e) {}
			}
			if (typeof _a == "object") {
				var _d = _a.GetVariable("$version"); // bugs in fp 6.21/6.23
				if (typeof _d != "undefined") {
					_d = _d.replace(/^\S+\s+(.*)$/, "$1").split(",");
					UFO.fv = [parseInt(_d[0], 10), parseInt(_d[2], 10)];
				}
			}
		}
	},

	hasRequired: function(id) {
		var _l = UFO.req.length;
		for (var i = 0; i < _l; i++) {
			if (typeof UFO.foList[id][UFO.req[i]] == "undefined") return false;
		}
		return true;
	},
	
	hasFlashVersion: function(major, release) {
		return (UFO.fv[0] > major || (UFO.fv[0] == major && UFO.fv[1] >= release)) ? true : false;
	},

	writeSWF: function(id) {
		var _fo = UFO.foList[id];
		var _e = document.getElementById(id);
		if (UFO.pluginType == "npapi") {
			if (UFO.uaHas("gecko") || UFO.uaHas("xml")) {
				while(_e.hasChildNodes()) {
					_e.removeChild(_e.firstChild);
				}
				var _obj = UFO.createElement("object");
				_obj.id = id + "_obj";
				_obj.setAttribute("type", "application/x-shockwave-flash");
				_obj.setAttribute("data", _fo.movie);
				_obj.setAttribute("width", _fo.width);
				_obj.setAttribute("height", _fo.height);
				_obj.setAttribute("bgcolor", "#000000");
				var _l = UFO.optAtt.length;
				for (var i = 0; i < _l; i++) {
					if (typeof _fo[UFO.optAtt[i]] != "undefined") _obj.setAttribute(UFO.optAtt[i], _fo[UFO.optAtt[i]]);
				}
				var _o = UFO.opt.concat(UFO.optExc);
				var _l = _o.length;
				for (var i = 0; i < _l; i++) {
					if (typeof _fo[_o[i]] != "undefined") UFO.createObjParam(_obj, _o[i], _fo[_o[i]]);
				}
				_e.appendChild(_obj);
			}
			else {
				var _emb = "";
				var _o = UFO.opt.concat(UFO.optAtt).concat(UFO.optExc);
				var _l = _o.length;
				for (var i = 0; i < _l; i++) {
					if (typeof _fo[_o[i]] != "undefined") _emb += ' ' + _o[i] + '="' + _fo[_o[i]] + '"';
				}
				_e.innerHTML = '<embed type="application/x-shockwave-flash" src="' + _fo.movie + '" bgcolor="#000000" width="' + _fo.width + '" height="' + _fo.height + '" pluginspage="http://www.macromedia.com/go/getflashplayer"' + _emb + '></embed>';
			}
		}
		else if (UFO.pluginType == "ax") {
			var _objAtt = "";
			var _l = UFO.optAtt.length;
			for (var i = 0; i < _l; i++) {
				if (typeof _fo[UFO.optAtt[i]] != "undefined") _objAtt += ' ' + UFO.optAtt[i] + '="' + _fo[UFO.optAtt[i]] + '"';
			}
			var _objPar = "";
			var _l = UFO.opt.length;
			for (var i = 0; i < _l; i++) {
				if (typeof _fo[UFO.opt[i]] != "undefined") _objPar += '<param name="' + UFO.opt[i] + '" value="' + _fo[UFO.opt[i]] + '" />';
			}
			var _p = window.location.protocol == "https:" ? "https:" : "http:";
			_e.innerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + _objAtt + ' width="' + _fo.width + '" height="' + _fo.height + '" codebase="' + _p + '//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + _fo.majorversion + ',0,' + _fo.build + ',0"><param name="BGCOLOR" value="#000000"><param name="movie" value="' + _fo.movie + '" />' + _objPar + '</object>';
		}
	},

	createDialog: function(id) {
		var _fo = UFO.foList[id];
		UFO.createCSS("html", "height:100%; overflow:hidden;");
		UFO.createCSS("body", "height:100%; overflow:hidden;");
		UFO.createCSS("#xi-con", "position:absolute; left:0; top:0; z-index:1000; width:100%; height:100%; background-color:#fff; filter:alpha(opacity:75); opacity:0.75;");
		UFO.createCSS("#xi-dia", "position:absolute; left:50%; top:50%; margin-left: -" + Math.round(parseInt(_fo.xiwidth, 10) / 2) + "px; margin-top: -" + Math.round(parseInt(_fo.xiheight, 10) / 2) + "px; width:" + _fo.xiwidth + "px; height:" + _fo.xiheight + "px;");
		var _b = document.getElementsByTagName("body")[0];
		var _c = UFO.createElement("div");
		_c.setAttribute("id", "xi-con");
		var _d = UFO.createElement("div");
		_d.setAttribute("id", "xi-dia");
		_c.appendChild(_d);
		_b.appendChild(_c);
		var _mmu = window.location;
		if (UFO.uaHas("xml") && UFO.uaHas("safari")) {
			var _mmd = document.getElementsByTagName("title")[0].firstChild.nodeValue = document.getElementsByTagName("title")[0].firstChild.nodeValue.slice(0, 47) + " - Flash Player Installation";
		}
		else {
			var _mmd = document.title = document.title.slice(0, 47) + " - Flash Player Installation";
		}
		var _mmp = UFO.pluginType == "ax" ? "ActiveX" : "PlugIn";
		var _uc = typeof _fo.xiurlcancel != "undefined" ? "&xiUrlCancel=" + _fo.xiurlcancel : "";
		var _uf = typeof _fo.xiurlfailed != "undefined" ? "&xiUrlFailed=" + _fo.xiurlfailed : "";
		UFO.foList["xi-dia"] = { movie:_fo.ximovie, width:_fo.xiwidth, height:_fo.xiheight, majorversion:"6", build:"65", flashvars:"MMredirectURL=" + _mmu + "&MMplayerType=" + _mmp + "&MMdoctitle=" + _mmd + _uc + _uf };
		UFO.writeSWF("xi-dia");
	},

	expressInstallCallback: function() {
		var _b = document.getElementsByTagName("body")[0];
		var _c = document.getElementById("xi-con");
		_b.removeChild(_c);
		UFO.createCSS("body", "height:auto; overflow:auto;");
		UFO.createCSS("html", "height:auto; overflow:auto;");
	},

	cleanupIELeaks: function() {
		var _o = document.getElementsByTagName("object");
		var _l = _o.length
		for (var i = 0; i < _l; i++) {
			_o[i].style.display = "none";
			for (var x in _o[i]) {
				if (typeof _o[i][x] == "function") {
					_o[i][x] = null;
				}
			}
		}
	}

};

if (typeof window.attachEvent != "undefined" && UFO.uaHas("ieWin")) {
	window.attachEvent("onunload", UFO.cleanupIELeaks);
}
/*!** End file: ufo.js ***/
/*!** Begin file: jquery.scrollTo.js ***/
/*!
 * jQuery.ScrollTo
 * Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 *
 * @projectDescription Easy element scrolling using jQuery.
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 * @author Ariel Flesler
 * @version 1.4.6
 *
 * @id jQuery.scrollTo
 * @id jQuery.fn.scrollTo
 * @param {String, Number, DOMElement, jQuery, Object} target Where to scroll the matched elements.
 *	  The different options for target are:
 *		- A number position (will be applied to all axes).
 *		- A string position ('44', '100px', '+=90', etc ) will be applied to all axes
 *		- A jQuery/DOM element ( logically, child of the element to scroll )
 *		- A string selector, that will be relative to the element to scroll ( 'li:eq(2)', etc )
 *		- A hash { top:x, left:y }, x and y can be any kind of number/string like above.
 *		- A percentage of the container's dimension/s, for example: 50% to go to the middle.
 *		- The string 'max' for go-to-end. 
 * @param {Number, Function} duration The OVERALL length of the animation, this argument can be the settings object instead.
 * @param {Object,Function} settings Optional set of settings or the onAfter callback.
 *	 @option {String} axis Which axis must be scrolled, use 'x', 'y', 'xy' or 'yx'.
 *	 @option {Number, Function} duration The OVERALL length of the animation.
 *	 @option {String} easing The easing method for the animation.
 *	 @option {Boolean} margin If true, the margin of the target element will be deducted from the final position.
 *	 @option {Object, Number} offset Add/deduct from the end position. One number for both axes or { top:x, left:y }.
 *	 @option {Object, Number} over Add/deduct the height/width multiplied by 'over', can be { top:x, left:y } when using both axes.
 *	 @option {Boolean} queue If true, and both axis are given, the 2nd axis will only be animated after the first one ends.
 *	 @option {Function} onAfter Function to be called after the scrolling ends. 
 *	 @option {Function} onAfterFirst If queuing is activated, this function will be called after the first scrolling ends.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 * @desc Scroll to a fixed position
 * @example $('div').scrollTo( 340 );
 *
 * @desc Scroll relatively to the actual position
 * @example $('div').scrollTo( '+=340px', { axis:'y' } );
 *
 * @desc Scroll using a selector (relative to the scrolled element)
 * @example $('div').scrollTo( 'p.paragraph:eq(2)', 500, { easing:'swing', queue:true, axis:'xy' } );
 *
 * @desc Scroll to a DOM element (same for jQuery object)
 * @example var second_child = document.getElementById('container').firstChild.nextSibling;
 *			$('#container').scrollTo( second_child, { duration:500, axis:'x', onAfter:function(){
 *				alert('scrolled!!');																   
 *			}});
 *
 * @desc Scroll on both axes, to different values
 * @example $('div').scrollTo( { top: 300, left:'+=200' }, { axis:'xy', offset:-20 } );
 */

;(function( $ ){
	
	var $scrollTo = $.scrollTo = function( target, duration, settings ){
		$(window).scrollTo( target, duration, settings );
	};

	$scrollTo.defaults = {
		axis:'xy',
		duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1,
		limit:true
	};

	// Returns the element that needs to be animated to scroll the window.
	// Kept for backwards compatibility (specially for localScroll & serialScroll)
	$scrollTo.window = function( scope ){
		return $(window)._scrollable();
	};

	// Hack, hack, hack :)
	// Returns the real elements to scroll (supports window/iframes, documents and regular nodes)
	$.fn._scrollable = function(){
		return this.map(function(){
			var elem = this,
				isWin = !elem.nodeName || $.inArray( elem.nodeName.toLowerCase(), ['iframe','#document','html','body'] ) != -1;

				if( !isWin )
					return elem;

			var doc = (elem.contentWindow || elem).document || elem.ownerDocument || elem;
			
			return /webkit/i.test(navigator.userAgent) || doc.compatMode == 'BackCompat' ?
				doc.body : 
				doc.documentElement;
		});
	};

	$.fn.scrollTo = function( target, duration, settings ){
		if( typeof duration == 'object' ){
			settings = duration;
			duration = 0;
		}
		if( typeof settings == 'function' )
			settings = { onAfter:settings };
			
		if( target == 'max' )
			target = 9e9;
			
		settings = $.extend( {}, $scrollTo.defaults, settings );
		// Speed is still recognized for backwards compatibility
		duration = duration || settings.duration;
		// Make sure the settings are given right
		settings.queue = settings.queue && settings.axis.length > 1;
		
		if( settings.queue )
			// Let's keep the overall duration
			duration /= 2;
		settings.offset = both( settings.offset );
		settings.over = both( settings.over );

		return this._scrollable().each(function(){
			// Null target yields nothing, just like jQuery does
			if (target == null) return;

			var elem = this,
				$elem = $(elem),
				targ = target, toff, attr = {},
				win = $elem.is('html,body');

			switch( typeof targ ){
				// A number will pass the regex
				case 'number':
				case 'string':
					if( /^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ) ){
						targ = both( targ );
						// We are done
						break;
					}
					// Relative selector, no break!
					targ = $(targ,this);
					if (!targ.length) return;
				case 'object':
					// DOMElement / jQuery
					if( targ.is || targ.style )
						// Get the real position of the target 
						toff = (targ = $(targ)).offset();
			}
			$.each( settings.axis.split(''), function( i, axis ){
				var Pos	= axis == 'x' ? 'Left' : 'Top',
					pos = Pos.toLowerCase(),
					key = 'scroll' + Pos,
					old = elem[key],
					max = $scrollTo.max(elem, axis);

				if( toff ){// jQuery / DOMElement
					attr[key] = toff[pos] + ( win ? 0 : old - $elem.offset()[pos] );

					// If it's a dom element, reduce the margin
					if( settings.margin ){
						attr[key] -= parseInt(targ.css('margin'+Pos)) || 0;
						attr[key] -= parseInt(targ.css('border'+Pos+'Width')) || 0;
					}
					
					attr[key] += settings.offset[pos] || 0;
					
					if( settings.over[pos] )
						// Scroll to a fraction of its width/height
						attr[key] += targ[axis=='x'?'width':'height']() * settings.over[pos];
				}else{ 
					var val = targ[pos];
					// Handle percentage values
					attr[key] = val.slice && val.slice(-1) == '%' ? 
						parseFloat(val) / 100 * max
						: val;
				}

				// Number or 'number'
				if( settings.limit && /^\d+$/.test(attr[key]) )
					// Check the limits
					attr[key] = attr[key] <= 0 ? 0 : Math.min( attr[key], max );

				// Queueing axes
				if( !i && settings.queue ){
					// Don't waste time animating, if there's no need.
					if( old != attr[key] )
						// Intermediate animation
						animate( settings.onAfterFirst );
					// Don't animate this axis again in the next iteration.
					delete attr[key];
				}
			});

			animate( settings.onAfter );			

			function animate( callback ){
				$elem.animate( attr, duration, settings.easing, callback && function(){
					callback.call(this, targ, settings);
				});
			};

		}).end();
	};
	
	// Max scrolling position, works on quirks mode
	// It only fails (not too badly) on IE, quirks mode.
	$scrollTo.max = function( elem, axis ){
		var Dim = axis == 'x' ? 'Width' : 'Height',
			scroll = 'scroll'+Dim;
		
		if( !$(elem).is('html,body') )
			return elem[scroll] - $(elem)[Dim.toLowerCase()]();
		
		var size = 'client' + Dim,
			html = elem.ownerDocument.documentElement,
			body = elem.ownerDocument.body;

		return Math.max( html[scroll], body[scroll] ) 
			 - Math.min( html[size]  , body[size]   );
	};

	function both( val ){
		return typeof val == 'object' ? val : { top:val, left:val };
	};

})( jQuery );/*!** End file: jquery.scrollTo.js ***/
/*!** Begin file: EAS_tag.1.0.js ***/
EAS_flash = 1;
EAS_proto = "http:";
if (location.protocol == "https:") {
   EAS_proto = "https:";
}
if (document.getElementById) {
   EAS_dom = true;
} else {
   EAS_dom = false;
}
EAS_server = EAS_proto + "//booking6.emediate.eu/booking";

//TEMP FIX FOR JS ERRORS 120807:
document.domain = document.domain.split('.').slice(-2).join('.');

function EAS_load(url) {
	if (typeof(url) === 'undefined' || url === '') return;
	document.write('<scr' + 'ipt language="JavaScript" src="' + url + '"></sc' + 'ript>');
}

function EAS_init(pages, parameters) {
  var EAS_ord=new Date().getTime();
  var EAS_url = EAS_server + "/eas?target=_blank&EASformat=jsvars&EAScus=" + pages + "&ord=" + EAS_ord;

  EAS_detect_flash();

  EAS_url += "&EASflash=" + EAS_flash;

  if (parameters) EAS_url += "&" + parameters;

  EAS_load(EAS_url);

  return;
}

function EAS_detect_flash() {
   if (EAS_flash > 1) return;

  var maxVersion = 11;
  var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;
  var isIE = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
  var isWin = (navigator.appVersion.indexOf("Windows") != -1) ? true : false;

  // write vbscript detection if we're not on mac.
  if(isIE && isWin && !isOpera){ 
    document.write('<SCR' + 'IPT LANGUAGE=VBScript\> \n');
    document.write('on error resume next \nDim eas_flobj(' + maxVersion + ') \n');
    for (i = 2; i < maxVersion; i++) {
      document.write('Set eas_flobj(' + i + ') = CreateObject("ShockwaveFlash.ShockwaveFlash.' + i + '") \n');
      document.write('if(IsObject(eas_flobj(' + i + '))) Then EAS_flash='+i+' \n');
    }
    document.write('</SCR' + 'IPT\> \n'); // break up end tag so it doesn't end our script
  } else if (navigator.plugins) {
    if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]){

      var isVersion2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
      var flashDescription = navigator.plugins["Shockwave Flash" + isVersion2].description;
      var flashVersion = parseInt(flashDescription.substr(flashDescription.indexOf(".") - 2, 2), 10);

      if (flashVersion > 1) EAS_flash = flashVersion;
    }
  }

  // alert("Version is " + EAS_flash);

}

function EAS_show_flash(width, height, src, extra) {
	if (typeof(src) === 'undefined' || src === '') return;

   var EAS_args = [];
   if (extra) EAS_args = extra.split(",");

   document.write('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + width + '" height="' + height + '"><param name=src value=' + src + '>');
   for (i = 0; i < EAS_args.length; i++) {
      EAS_eq = EAS_args[i].indexOf('=');
      EAS_nv0 = EAS_args[i].substring(0, EAS_eq );
      EAS_nv1 = EAS_args[i].substring(EAS_eq+1, EAS_args[i].length);
      document.write('<param name="' + EAS_nv0 + '" value="' + EAS_nv1 + '">');
   }
   document.write('<embed src="' + src + '" width="' + width + '" height="' + height + '" type="application/x-shockwave-flash"');
   for (i = 0; i < EAS_args.length; i++) {
      EAS_eq = EAS_args[i].indexOf('=');
      EAS_nv0 = EAS_args[i].substring(0, EAS_eq );
      EAS_nv1 = EAS_args[i].substring(EAS_eq+1, EAS_args[i].length);

      document.write(' ' + EAS_nv0 + '="' + EAS_nv1 + '"');
   }
   document.write('></embed></object>');
}

function EAS_embed_flash(width, height, src, params, flashvars, events, eventurl) {
	if (typeof(src) === 'undefined' || src === '') return;
   var par = "";
   var flashID = new Date().getTime() + "" + Math.floor(Math.random() * 11);
   if (params) {
      var args = [];
      var eq, nv0, nv1;
      args = params.split(',');
      for (i = 0; i < args.length; i++) {
         eq = args[i].indexOf('=');
         nv0 = args[i].substring(0, eq);
         nv1 = args[i].substring(eq + 1, args[i].length);
         if (nv0.toLowerCase() == 'flashvars')
            flashvars += (flashvars ? "&" : "") + nv1;
         else
            par += '<param name="' + nv0 + '" value="' + nv1 + '" />';
      }
   }

   if (events && eventurl) {
      var args = [];
      args = events.split(",");
      for (i = 0; i < args.length; i++) {
         flashvars += (flashvars ? "&" : "") + args[i] + "=" + eventurl + args[i];
      }
   }

   if (flashvars)
      par += '<param name="FlashVars" value="' + flashvars + '" />';

   document.write('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + width + '" height="' + height + '" id="eas_' + flashID + '"><param name="movie" value="' + src + '" />');
   if (params) document.write(par);

   document.write('<!--[if !IE]>-->');
   document.write('<object type="application/x-shockwave-flash" data="' + src + '" width="' + width + '" height="' + height + '">');
   if (params) document.write(par);
   document.write('</object>');
   document.write('<!--<![endif]-->');

   document.write('</object>');

   return;
}

function EAS_statistics() {

   var t = new Date();
   var EAS_time = t.getTime();
   var bWidth = 0;
   var bHeight = 0;
   var cdepth = 0;
   var plugins = "";
   var tmz = t.getTimezoneOffset() / 60;
   if (navigator.plugins) {
      var p = navigator.plugins;
      var pArr = new Array();
      for (var i = 0; i < p.length; i++) {
         if (p[i].name.indexOf("RealPlayer") != -1) pArr[0] = 1;
         else if (p[i].name.indexOf("Adobe Reader") != -1) pArr[1] = 1;
         else if (p[i].name.indexOf("Adobe Acrobat") != -1) pArr[1] = 1;
         else if (p[i].name.indexOf("Windows Media Player") != -1) pArr[2] = 1;
         else if (p[i].name.indexOf("QuickTime") != -1) pArr[3] = 1;
      }
      for (var i = 0; i < 4; i++) if (pArr[i]) plugins += i + ",";
   }

   if (typeof(EAS_cu) == "undefined") return;
   if (EAS_flash == 1) EAS_detect_flash();

   if (screen && screen.colorDepth) cdepth = screen.colorDepth;

   if (document.body && document.body.clientHeight > 50) {
      bWidth = document.body.clientWidth;
      bHeight = document.body.clientHeight;
   } else if (document.documentElement && document.documentElement.clientHeight > 50) {
      bWidth = document.documentElement.clientWidth;
      bHeight = document.documentElement.clientHeight;
   } else if (typeof(window.innerHeight == 'number')) {
      bWidth = window.innerWidth;
      bHeight = window.innerHeight;
   }

   var EAS_stat_tag = EAS_server + '/eas?cu=' + EAS_cu + ';ord=' + EAS_time;
   EAS_stat_tag += ';logrest=width=' + screen.width + ';height=' + screen.height + ';bwidth=' + bWidth + ';bheight=' + bHeight + ';time=' + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
   EAS_stat_tag += ";tmz=" + tmz;
   if (EAS_flash > 2) EAS_stat_tag += ';flash=' + EAS_flash;
   if (typeof(EAS_page) != "undefined") EAS_stat_tag += ';page=' + EAS_page;
   if (typeof(java) != "undefined" && java.installed) EAS_stat_tag += ';jversion=' + java.lang.System.getProperty("java.version");
   if (typeof(EAS_jsversion) != "undefined") EAS_stat_tag += ';jsversion=' + EAS_jsversion;
   if (cdepth) EAS_stat_tag += ';cdepth=' + cdepth;
   if (plugins) EAS_stat_tag += ';plugins=' + plugins;
   if (document.referrer) EAS_stat_tag += ';ref=' + escape(document.referrer);
   if (document.location) EAS_stat_tag += ';url=' + escape(document.location);
   if (typeof(EAS_capture) != "undefined") EAS_stat_tag += ';EAScapture=' + escape(EAS_capture);

   document.write('<img width="1" height="1" src="' + EAS_stat_tag + '">');
}

function EAS_duplicate(cu, expires) {
   var cookie_arr = document.cookie.split('; ');
   var nv_arr;
   var cu_arr;
   var duplicate = 0;
   var found_cu = 0;
   var now = Math.round(new Date().getTime() / 1000);
   var new_cookie = "";
   if (cookie_arr.length > 0) {
      for (var i = 0; i < cookie_arr.length; i++) {
         nv_arr = cookie_arr[i].split('=');
         if (nv_arr[0] == 'eas_dup') {
            cu_arr = nv_arr[1].split(':');
            for (var j = 0; j < cu_arr.length; j++) {
               cu_val = cu_arr[j].split('_');
               if (now - cu_val[1] < expires) {
                  if (cu_val[0] == cu) {
                     found_cu = 1;
                     duplicate = 1;
                     break;
                  } else {
                     if (new_cookie) new_cookie += ":";
                     new_cookie += cu_arr[j];
                  }
               }
            }
            break;
         }
      }
   }

   if (!duplicate) {
      if (!found_cu) {
         if (new_cookie) new_cookie += ":";
         new_cookie += cu + "_" + now;
      }
      document.cookie = "eas_dup=" + new_cookie + "; path=/; expires=Mon, 16-Mar-20 01:00:00 GMT;";
   }
   if (duplicate) return true;
   return false;
}

function EAS_place_ad(cus, EAS_options) {
   if(!EAS_dom) return;
   var set_size = 1;
   var safe_log = 0;
   var move_pos = 1;
   if (EAS_options) {
      var EAS_options_arr = EAS_options.split(",");
      for (var i = 0; i < EAS_options_arr.length; i++) {
         var EAS_temp = EAS_options_arr[i].split("=");
         var EAS_temp_val = 0;
         if (EAS_temp[1] == "1" || EAS_temp[1] == "y" || EAS_temp[1] == "yes") {
            EAS_temp_val = 1;
         }
         if (EAS_temp[0] == "set_size") set_size = EAS_temp_val;
         else if (EAS_temp[0] == "safe_log") safe_log = EAS_temp_val;
         else if (EAS_temp[0] == "move_pos") move_pos = EAS_temp_val;
      }
   }

   var EAS_cu_arr = cus.split(",");
   for (var i = 0; i < EAS_cu_arr.length; i++) {
      var EAS_cu = EAS_cu_arr[i];
      if (set_size || move_pos) {
         var EAS_temp = "EAS_position_" + EAS_cu;
         var EAS_div_position = document.getElementById(EAS_temp);
         if (EAS_div_position) {
            EAS_temp = "EAS_tag_" + EAS_cu;
            var EAS_div_tag = document.getElementById(EAS_temp);
            if (EAS_div_tag) {
               if (set_size) {
                  var EAS_width = eval("EAS_found_width_" + EAS_cu);
                  var EAS_height = eval("EAS_found_height_" + EAS_cu);
                  if (EAS_width && EAS_height) {
                     EAS_div_position.style.width = EAS_width + "px";
                     EAS_div_position.style.height = EAS_height + "px";
                  }
               }
               if (move_pos) {
                  var EAS_pos_top = EAS_pos_left = 0;
                  var EAS_pos_obj = EAS_div_position;
                  if (EAS_pos_obj.offsetParent) {
                     do {
                        EAS_pos_top += EAS_pos_obj.offsetTop;
                        EAS_pos_left += EAS_pos_obj.offsetLeft;
                     } while (EAS_pos_obj = EAS_pos_obj.offsetParent);
                     EAS_div_tag.style.position = "absolute";
                     EAS_div_tag.style.top = EAS_pos_top + "px";
                     EAS_div_tag.style.left = EAS_pos_left + "px";
                  }
               }
               EAS_div_tag.style.display = "block";
            }
         }
      }
      if (safe_log) {
         var confirm_img_src = eval("EAS_confirm_" + EAS_cu);
         if (confirm_img_src) {
            var confirm_img = new Image(1,1);
            confirm_img.src = confirm_img_src;
         }
      }
   }
}


function EAS_set_params(easSrc){

	if(typeof(easSrc) === 'undefined' || easSrc =="" || easSrc =="undefined"){
		return;
	}

   // get params
    var url = easSrc;

    // get the parameters
    url.match(/\?(.+)$/);
    var params = RegExp.$1;

    // split up the query string and store in an
    // associative array

	var params = params.split(";");
	var queryStringList = {};
 
    for(var i=0;i<params.length;i++){
         var tmp = params[i].split("=");
         queryStringList[tmp[0]] = unescape(tmp[1]);
     }

	return queryStringList["EAS_thumb"];
}


function EAS_load_fif(divId, easSrc, width, height, cls) {
	if (typeof(easSrc) === 'undefined' || easSrc === '') return;
	var d = document,
	fif = d.createElement("iframe"),
	div = d.getElementById(divId);

	easSrc += "&amp;now=" + new Date().getTime();

	$(fif).attr({
		EAS_src: easSrc,
		longdesc: easSrc
	});
	fif.src = "//" + location.host + "/EAS_fif.html";

	if (typeof cls !== "undefined") {
		fif.className = cls;
	}
	fif.frameBorder = "0";
	fif.style.width = width + "px";
	fif.style.height = height + "px";
	fif.style.margin = "0px";
	fif.style.borderWidth = "0px";
	fif.style.padding = "0px";
	fif.scrolling = "no";
	fif.longdesc = easSrc;
	div.appendChild(fif);
}

function EAS_resize_fif(expand, width, height) {
   if (typeof inDapIF !== "undefined") {
      var fif = window.frameElement;

      if (expand) {
         fif._width = fif.style.width;
         fif._height = fif.style.height;
         fif.style.width = width + "px";
         fif.style.height = height + "px";
      } else {
         fif.style.width = fif._width;
         fif.style.height = fif._height;
      }
   }
}
/*!** End file: EAS_tag.1.0.js ***/
/*!** Begin file: history.adapter.jquery.js ***/
/**
 * History.js jQuery Adapter
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

// Closure
(function(window,undefined){
	"use strict";

	// Localise Globals
	var
		History = window.History = window.History||{},
		jQuery = window.jQuery;

	// Check Existence
	if ( typeof History.Adapter !== 'undefined' ) {
		throw new Error('History.js Adapter has already been loaded...');
	}

	// Add the Adapter
	History.Adapter = {
		/**
		 * History.Adapter.bind(el,event,callback)
		 * @param {Element|string} el
		 * @param {string} event - custom and standard events
		 * @param {function} callback
		 * @return {void}
		 */
		bind: function(el,event,callback){
			jQuery(el).bind(event,callback);
		},

		/**
		 * History.Adapter.trigger(el,event)
		 * @param {Element|string} el
		 * @param {string} event - custom and standard events
		 * @param {Object=} extra - a object of extra event data (optional)
		 * @return {void}
		 */
		trigger: function(el,event,extra){
			jQuery(el).trigger(event,extra);
		},

		/**
		 * History.Adapter.extractEventData(key,event,extra)
		 * @param {string} key - key for the event data to extract
		 * @param {string} event - custom and standard events
		 * @param {Object=} extra - a object of extra event data (optional)
		 * @return {mixed}
		 */
		extractEventData: function(key,event,extra){
			// jQuery Native then jQuery Custom
			var result = (event && event.originalEvent && event.originalEvent[key]) || (extra && extra[key]) || undefined;

			// Return
			return result;
		},

		/**
		 * History.Adapter.onDomLoad(callback)
		 * @param {function} callback
		 * @return {void}
		 */
		onDomLoad: function(callback) {
			jQuery(callback);
		}
	};

	// Try and Initialise History
	if ( typeof History.init !== 'undefined' ) {
		History.init();
	}

})(window);
/*!** End file: history.adapter.jquery.js ***/
/*!** Begin file: history.js ***/
/**
 * History.js Core
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(window,undefined){
	"use strict";

	// ========================================================================
	// Initialise

	// Localise Globals
	var
		console = window.console||undefined, // Prevent a JSLint complain
		document = window.document, // Make sure we are using the correct document
		navigator = window.navigator, // Make sure we are using the correct navigator
		sessionStorage = window.sessionStorage||false, // sessionStorage
		setTimeout = window.setTimeout,
		clearTimeout = window.clearTimeout,
		setInterval = window.setInterval,
		clearInterval = window.clearInterval,
		JSON = window.JSON,
		alert = window.alert,
		History = window.History = window.History||{}, // Public History Object
		history = window.history; // Old History Object

	try {
		sessionStorage.setItem('TEST', '1');
		sessionStorage.removeItem('TEST');
	} catch(e) {
		sessionStorage = false;
	}

	// MooTools Compatibility
	JSON.stringify = JSON.stringify||JSON.encode;
	JSON.parse = JSON.parse||JSON.decode;

	// Check Existence
	if ( typeof History.init !== 'undefined' ) {
		throw new Error('History.js Core has already been loaded...');
	}

	// Initialise History
	History.init = function(options){
		// Check Load Status of Adapter
		if ( typeof History.Adapter === 'undefined' ) {
			return false;
		}

		// Check Load Status of Core
		if ( typeof History.initCore !== 'undefined' ) {
			History.initCore();
		}

		// Check Load Status of HTML4 Support
		if ( typeof History.initHtml4 !== 'undefined' ) {
			History.initHtml4();
		}

		// Return true
		return true;
	};


	// ========================================================================
	// Initialise Core

	// Initialise Core
	History.initCore = function(options){
		// Initialise
		if ( typeof History.initCore.initialized !== 'undefined' ) {
			// Already Loaded
			return false;
		}
		else {
			History.initCore.initialized = true;
		}


		// ====================================================================
		// Options

		/**
		 * History.options
		 * Configurable options
		 */
		History.options = History.options||{};

		/**
		 * History.options.hashChangeInterval
		 * How long should the interval be before hashchange checks
		 */
		History.options.hashChangeInterval = History.options.hashChangeInterval || 100;

		/**
		 * History.options.safariPollInterval
		 * How long should the interval be before safari poll checks
		 */
		History.options.safariPollInterval = History.options.safariPollInterval || 500;

		/**
		 * History.options.doubleCheckInterval
		 * How long should the interval be before we perform a double check
		 */
		History.options.doubleCheckInterval = History.options.doubleCheckInterval || 500;

		/**
		 * History.options.disableSuid
		 * Force History not to append suid
		 */
		History.options.disableSuid = History.options.disableSuid || false;

		/**
		 * History.options.storeInterval
		 * How long should we wait between store calls
		 */
		History.options.storeInterval = History.options.storeInterval || 1000;

		/**
		 * History.options.busyDelay
		 * How long should we wait between busy events
		 */
		History.options.busyDelay = History.options.busyDelay || 250;

		/**
		 * History.options.debug
		 * If true will enable debug messages to be logged
		 */
		History.options.debug = History.options.debug || false;

		/**
		 * History.options.initialTitle
		 * What is the title of the initial state
		 */
		History.options.initialTitle = History.options.initialTitle || document.title;

		/**
		 * History.options.html4Mode
		 * If true, will force HTMl4 mode (hashtags)
		 */
		History.options.html4Mode = History.options.html4Mode || false;

		/**
		 * History.options.delayInit
		 * Want to override default options and call init manually.
		 */
		History.options.delayInit = History.options.delayInit || false;


		// ====================================================================
		// Interval record

		/**
		 * History.intervalList
		 * List of intervals set, to be cleared when document is unloaded.
		 */
		History.intervalList = [];

		/**
		 * History.clearAllIntervals
		 * Clears all setInterval instances.
		 */
		History.clearAllIntervals = function(){
			var i, il = History.intervalList;
			if (typeof il !== "undefined" && il !== null) {
				for (i = 0; i < il.length; i++) {
					clearInterval(il[i]);
				}
				History.intervalList = null;
			}
		};


		// ====================================================================
		// Debug

		/**
		 * History.debug(message,...)
		 * Logs the passed arguments if debug enabled
		 */
		History.debug = function(){
			if ( (History.options.debug||false) ) {
				History.log.apply(History,arguments);
			}
		};

		/**
		 * History.log(message,...)
		 * Logs the passed arguments
		 */
		History.log = function(){
			// Prepare
			var
				consoleExists = !(typeof console === 'undefined' || typeof console.log === 'undefined' || typeof console.log.apply === 'undefined'),
				textarea = document.getElementById('log'),
				message,
				i,n,
				args,arg
				;

			// Write to Console
			if ( consoleExists ) {
				args = Array.prototype.slice.call(arguments);
				message = args.shift();
				if ( typeof console.debug !== 'undefined' ) {
					console.debug.apply(console,[message,args]);
				}
				else {
					console.log.apply(console,[message,args]);
				}
			}
			else {
				message = ("\n"+arguments[0]+"\n");
			}

			// Write to log
			for ( i=1,n=arguments.length; i<n; ++i ) {
				arg = arguments[i];
				if ( typeof arg === 'object' && typeof JSON !== 'undefined' ) {
					try {
						arg = JSON.stringify(arg);
					}
					catch ( Exception ) {
						// Recursive Object
					}
				}
				message += "\n"+arg+"\n";
			}

			// Textarea
			if ( textarea ) {
				textarea.value += message+"\n-----\n";
				textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
			}
			// No Textarea, No Console
			else if ( !consoleExists ) {
				alert(message);
			}

			// Return true
			return true;
		};


		// ====================================================================
		// Emulated Status

		/**
		 * History.getInternetExplorerMajorVersion()
		 * Get's the major version of Internet Explorer
		 * @return {integer}
		 * @license Public Domain
		 * @author Benjamin Arthur Lupton <contact@balupton.com>
		 * @author James Padolsey <https://gist.github.com/527683>
		 */
		History.getInternetExplorerMajorVersion = function(){
			var result = History.getInternetExplorerMajorVersion.cached =
					(typeof History.getInternetExplorerMajorVersion.cached !== 'undefined')
				?	History.getInternetExplorerMajorVersion.cached
				:	(function(){
						var v = 3,
								div = document.createElement('div'),
								all = div.getElementsByTagName('i');
						while ( (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->') && all[0] ) {}
						return (v > 4) ? v : false;
					})()
				;
			return result;
		};

		/**
		 * History.isInternetExplorer()
		 * Are we using Internet Explorer?
		 * @return {boolean}
		 * @license Public Domain
		 * @author Benjamin Arthur Lupton <contact@balupton.com>
		 */
		History.isInternetExplorer = function(){
			var result =
				History.isInternetExplorer.cached =
				(typeof History.isInternetExplorer.cached !== 'undefined')
					?	History.isInternetExplorer.cached
					:	Boolean(History.getInternetExplorerMajorVersion())
				;
			return result;
		};

		/**
		 * History.emulated
		 * Which features require emulating?
		 */

		if (History.options.html4Mode) {
			History.emulated = {
				pushState : true,
				hashChange: true
			};
		}

		else {

			History.emulated = {
				pushState: !Boolean(
					window.history && window.history.pushState && window.history.replaceState
					&& !(
						(/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i).test(navigator.userAgent) /* disable for versions of iOS before version 4.3 (8F190) */
						|| (/AppleWebKit\/5([0-2]|3[0-2])/i).test(navigator.userAgent) /* disable for the mercury iOS browser, or at least older versions of the webkit engine */
					)
				),
				hashChange: Boolean(
					!(('onhashchange' in window) || ('onhashchange' in document))
					||
					(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8)
				)
			};
		}

		/**
		 * History.enabled
		 * Is History enabled?
		 */
		History.enabled = !History.emulated.pushState;

		/**
		 * History.bugs
		 * Which bugs are present
		 */
		History.bugs = {
			/**
			 * Safari 5 and Safari iOS 4 fail to return to the correct state once a hash is replaced by a `replaceState` call
			 * https://bugs.webkit.org/show_bug.cgi?id=56249
			 */
			setHash: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

			/**
			 * Safari 5 and Safari iOS 4 sometimes fail to apply the state change under busy conditions
			 * https://bugs.webkit.org/show_bug.cgi?id=42940
			 */
			safariPoll: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

			/**
			 * MSIE 6 and 7 sometimes do not apply a hash even it was told to (requiring a second call to the apply function)
			 */
			ieDoubleCheck: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8),

			/**
			 * MSIE 6 requires the entire hash to be encoded for the hashes to trigger the onHashChange event
			 */
			hashEscape: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 7)
		};

		/**
		 * History.isEmptyObject(obj)
		 * Checks to see if the Object is Empty
		 * @param {Object} obj
		 * @return {boolean}
		 */
		History.isEmptyObject = function(obj) {
			for ( var name in obj ) {
				if ( obj.hasOwnProperty(name) ) {
					return false;
				}
			}
			return true;
		};

		/**
		 * History.cloneObject(obj)
		 * Clones a object and eliminate all references to the original contexts
		 * @param {Object} obj
		 * @return {Object}
		 */
		History.cloneObject = function(obj) {
			var hash,newObj;
			if ( obj ) {
				hash = JSON.stringify(obj);
				newObj = JSON.parse(hash);
			}
			else {
				newObj = {};
			}
			return newObj;
		};


		// ====================================================================
		// URL Helpers

		/**
		 * History.getRootUrl()
		 * Turns "http://mysite.com/dir/page.html?asd" into "http://mysite.com"
		 * @return {String} rootUrl
		 */
		History.getRootUrl = function(){
			// Create
			var rootUrl = document.location.protocol+'//'+(document.location.hostname||document.location.host);
			if ( document.location.port||false ) {
				rootUrl += ':'+document.location.port;
			}
			rootUrl += '/';

			// Return
			return rootUrl;
		};

		/**
		 * History.getBaseHref()
		 * Fetches the `href` attribute of the `<base href="...">` element if it exists
		 * @return {String} baseHref
		 */
		History.getBaseHref = function(){
			// Create
			var
				baseElements = document.getElementsByTagName('base'),
				baseElement = null,
				baseHref = '';

			// Test for Base Element
			if ( baseElements.length === 1 ) {
				// Prepare for Base Element
				baseElement = baseElements[0];
				baseHref = baseElement.href.replace(/[^\/]+$/,'');
			}

			// Adjust trailing slash
			baseHref = baseHref.replace(/\/+$/,'');
			if ( baseHref ) baseHref += '/';

			// Return
			return baseHref;
		};

		/**
		 * History.getBaseUrl()
		 * Fetches the baseHref or basePageUrl or rootUrl (whichever one exists first)
		 * @return {String} baseUrl
		 */
		History.getBaseUrl = function(){
			// Create
			var baseUrl = History.getBaseHref()||History.getBasePageUrl()||History.getRootUrl();

			// Return
			return baseUrl;
		};

		/**
		 * History.getPageUrl()
		 * Fetches the URL of the current page
		 * @return {String} pageUrl
		 */
		History.getPageUrl = function(){
			// Fetch
			var
				State = History.getState(false,false),
				stateUrl = (State||{}).url||History.getLocationHref(),
				pageUrl;

			// Create
			pageUrl = stateUrl.replace(/\/+$/,'').replace(/[^\/]+$/,function(part,index,string){
				return (/\./).test(part) ? part : part+'/';
			});

			// Return
			return pageUrl;
		};

		/**
		 * History.getBasePageUrl()
		 * Fetches the Url of the directory of the current page
		 * @return {String} basePageUrl
		 */
		History.getBasePageUrl = function(){
			// Create
			var basePageUrl = (History.getLocationHref()).replace(/[#\?].*/,'').replace(/[^\/]+$/,function(part,index,string){
				return (/[^\/]$/).test(part) ? '' : part;
			}).replace(/\/+$/,'')+'/';

			// Return
			return basePageUrl;
		};

		/**
		 * History.getFullUrl(url)
		 * Ensures that we have an absolute URL and not a relative URL
		 * @param {string} url
		 * @param {Boolean} allowBaseHref
		 * @return {string} fullUrl
		 */
		History.getFullUrl = function(url,allowBaseHref){
			// Prepare
			var fullUrl = url, firstChar = url.substring(0,1);
			allowBaseHref = (typeof allowBaseHref === 'undefined') ? true : allowBaseHref;

			// Check
			if ( /[a-z]+\:\/\//.test(url) ) {
				// Full URL
			}
			else if ( firstChar === '/' ) {
				// Root URL
				fullUrl = History.getRootUrl()+url.replace(/^\/+/,'');
			}
			else if ( firstChar === '#' ) {
				// Anchor URL
				fullUrl = History.getPageUrl().replace(/#.*/,'')+url;
			}
			else if ( firstChar === '?' ) {
				// Query URL
				fullUrl = History.getPageUrl().replace(/[\?#].*/,'')+url;
			}
			else {
				// Relative URL
				if ( allowBaseHref ) {
					fullUrl = History.getBaseUrl()+url.replace(/^(\.\/)+/,'');
				} else {
					fullUrl = History.getBasePageUrl()+url.replace(/^(\.\/)+/,'');
				}
				// We have an if condition above as we do not want hashes
				// which are relative to the baseHref in our URLs
				// as if the baseHref changes, then all our bookmarks
				// would now point to different locations
				// whereas the basePageUrl will always stay the same
			}

			// Return
			return fullUrl.replace(/\#$/,'');
		};

		/**
		 * History.getShortUrl(url)
		 * Ensures that we have a relative URL and not a absolute URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.getShortUrl = function(url){
			// Prepare
			var shortUrl = url, baseUrl = History.getBaseUrl(), rootUrl = History.getRootUrl();

			// Trim baseUrl
			if ( History.emulated.pushState ) {
				// We are in a if statement as when pushState is not emulated
				// The actual url these short urls are relative to can change
				// So within the same session, we the url may end up somewhere different
				shortUrl = shortUrl.replace(baseUrl,'');
			}

			// Trim rootUrl
			shortUrl = shortUrl.replace(rootUrl,'/');

			// Ensure we can still detect it as a state
			if ( History.isTraditionalAnchor(shortUrl) ) {
				shortUrl = './'+shortUrl;
			}

			// Clean It
			shortUrl = shortUrl.replace(/^(\.\/)+/g,'./').replace(/\#$/,'');

			// Return
			return shortUrl;
		};

		/**
		 * History.getLocationHref(document)
		 * Returns a normalized version of document.location.href
		 * accounting for browser inconsistencies, etc.
		 *
		 * This URL will be URI-encoded and will include the hash
		 *
		 * @param {object} document
		 * @return {string} url
		 */
		History.getLocationHref = function(doc) {
			doc = doc || document;

			// most of the time, this will be true
			if (doc.URL === doc.location.href)
				return doc.location.href;

			// some versions of webkit URI-decode document.location.href
			// but they leave document.URL in an encoded state
			if (doc.location.href === decodeURIComponent(doc.URL))
				return doc.URL;

			// FF 3.6 only updates document.URL when a page is reloaded
			// document.location.href is updated correctly
			if (doc.location.hash && decodeURIComponent(doc.location.href.replace(/^[^#]+/, "")) === doc.location.hash)
				return doc.location.href;

			if (doc.URL.indexOf('#') == -1 && doc.location.href.indexOf('#') != -1)
				return doc.location.href;
			
			return doc.URL || doc.location.href;
		};


		// ====================================================================
		// State Storage

		/**
		 * History.store
		 * The store for all session specific data
		 */
		History.store = {};

		/**
		 * History.idToState
		 * 1-1: State ID to State Object
		 */
		History.idToState = History.idToState||{};

		/**
		 * History.stateToId
		 * 1-1: State String to State ID
		 */
		History.stateToId = History.stateToId||{};

		/**
		 * History.urlToId
		 * 1-1: State URL to State ID
		 */
		History.urlToId = History.urlToId||{};

		/**
		 * History.storedStates
		 * Store the states in an array
		 */
		History.storedStates = History.storedStates||[];

		/**
		 * History.savedStates
		 * Saved the states in an array
		 */
		History.savedStates = History.savedStates||[];

		/**
		 * History.noramlizeStore()
		 * Noramlize the store by adding necessary values
		 */
		History.normalizeStore = function(){
			History.store.idToState = History.store.idToState||{};
			History.store.urlToId = History.store.urlToId||{};
			History.store.stateToId = History.store.stateToId||{};
		};

		/**
		 * History.getState()
		 * Get an object containing the data, title and url of the current state
		 * @param {Boolean} friendly
		 * @param {Boolean} create
		 * @return {Object} State
		 */
		History.getState = function(friendly,create){
			// Prepare
			if ( typeof friendly === 'undefined' ) { friendly = true; }
			if ( typeof create === 'undefined' ) { create = true; }

			// Fetch
			var State = History.getLastSavedState();

			// Create
			if ( !State && create ) {
				State = History.createStateObject();
			}

			// Adjust
			if ( friendly ) {
				State = History.cloneObject(State);
				State.url = State.cleanUrl||State.url;
			}

			// Return
			return State;
		};

		/**
		 * History.getIdByState(State)
		 * Gets a ID for a State
		 * @param {State} newState
		 * @return {String} id
		 */
		History.getIdByState = function(newState){

			// Fetch ID
			var id = History.extractId(newState.url),
				str;

			if ( !id ) {
				// Find ID via State String
				str = History.getStateString(newState);
				if ( typeof History.stateToId[str] !== 'undefined' ) {
					id = History.stateToId[str];
				}
				else if ( typeof History.store.stateToId[str] !== 'undefined' ) {
					id = History.store.stateToId[str];
				}
				else {
					// Generate a new ID
					while ( true ) {
						id = (new Date()).getTime() + String(Math.random()).replace(/\D/g,'');
						if ( typeof History.idToState[id] === 'undefined' && typeof History.store.idToState[id] === 'undefined' ) {
							break;
						}
					}

					// Apply the new State to the ID
					History.stateToId[str] = id;
					History.idToState[id] = newState;
				}
			}

			// Return ID
			return id;
		};

		/**
		 * History.normalizeState(State)
		 * Expands a State Object
		 * @param {object} State
		 * @return {object}
		 */
		History.normalizeState = function(oldState){
			// Variables
			var newState, dataNotEmpty;

			// Prepare
			if ( !oldState || (typeof oldState !== 'object') ) {
				oldState = {};
			}

			// Check
			if ( typeof oldState.normalized !== 'undefined' ) {
				return oldState;
			}

			// Adjust
			if ( !oldState.data || (typeof oldState.data !== 'object') ) {
				oldState.data = {};
			}

			// ----------------------------------------------------------------

			// Create
			newState = {};
			newState.normalized = true;
			newState.title = oldState.title||'';
			newState.url = History.getFullUrl(oldState.url?oldState.url:(History.getLocationHref()));
			newState.hash = History.getShortUrl(newState.url);
			newState.data = History.cloneObject(oldState.data);

			// Fetch ID
			newState.id = History.getIdByState(newState);

			// ----------------------------------------------------------------

			// Clean the URL
			newState.cleanUrl = newState.url.replace(/\??\&_suid.*/,'');
			newState.url = newState.cleanUrl;

			// Check to see if we have more than just a url
			dataNotEmpty = !History.isEmptyObject(newState.data);

			// Apply
			if ( (newState.title || dataNotEmpty) && History.options.disableSuid !== true ) {
				// Add ID to Hash
				newState.hash = History.getShortUrl(newState.url).replace(/\??\&_suid.*/,'');
				if ( !/\?/.test(newState.hash) ) {
					newState.hash += '?';
				}
				newState.hash += '&_suid='+newState.id;
			}

			// Create the Hashed URL
			newState.hashedUrl = History.getFullUrl(newState.hash);

			// ----------------------------------------------------------------

			// Update the URL if we have a duplicate
			if ( (History.emulated.pushState || History.bugs.safariPoll) && History.hasUrlDuplicate(newState) ) {
				newState.url = newState.hashedUrl;
			}

			// ----------------------------------------------------------------

			// Return
			return newState;
		};

		/**
		 * History.createStateObject(data,title,url)
		 * Creates a object based on the data, title and url state params
		 * @param {object} data
		 * @param {string} title
		 * @param {string} url
		 * @return {object}
		 */
		History.createStateObject = function(data,title,url){
			// Hashify
			var State = {
				'data': data,
				'title': title,
				'url': url
			};

			// Expand the State
			State = History.normalizeState(State);

			// Return object
			return State;
		};

		/**
		 * History.getStateById(id)
		 * Get a state by it's UID
		 * @param {String} id
		 */
		History.getStateById = function(id){
			// Prepare
			id = String(id);

			// Retrieve
			var State = History.idToState[id] || History.store.idToState[id] || undefined;

			// Return State
			return State;
		};

		/**
		 * Get a State's String
		 * @param {State} passedState
		 */
		History.getStateString = function(passedState){
			// Prepare
			var State, cleanedState, str;

			// Fetch
			State = History.normalizeState(passedState);

			// Clean
			cleanedState = {
				data: State.data,
				title: passedState.title,
				url: passedState.url
			};

			// Fetch
			str = JSON.stringify(cleanedState);

			// Return
			return str;
		};

		/**
		 * Get a State's ID
		 * @param {State} passedState
		 * @return {String} id
		 */
		History.getStateId = function(passedState){
			// Prepare
			var State, id;

			// Fetch
			State = History.normalizeState(passedState);

			// Fetch
			id = State.id;

			// Return
			return id;
		};

		/**
		 * History.getHashByState(State)
		 * Creates a Hash for the State Object
		 * @param {State} passedState
		 * @return {String} hash
		 */
		History.getHashByState = function(passedState){
			// Prepare
			var State, hash;

			// Fetch
			State = History.normalizeState(passedState);

			// Hash
			hash = State.hash;

			// Return
			return hash;
		};

		/**
		 * History.extractId(url_or_hash)
		 * Get a State ID by it's URL or Hash
		 * @param {string} url_or_hash
		 * @return {string} id
		 */
		History.extractId = function ( url_or_hash ) {
			// Prepare
			var id,parts,url, tmp;

			// Extract
			
			// If the URL has a #, use the id from before the #
			if (url_or_hash.indexOf('#') != -1)
			{
				tmp = url_or_hash.split("#")[0];
			}
			else
			{
				tmp = url_or_hash;
			}
			
			parts = /(.*)\&_suid=([0-9]+)$/.exec(tmp);
			url = parts ? (parts[1]||url_or_hash) : url_or_hash;
			id = parts ? String(parts[2]||'') : '';

			// Return
			return id||false;
		};

		/**
		 * History.isTraditionalAnchor
		 * Checks to see if the url is a traditional anchor or not
		 * @param {String} url_or_hash
		 * @return {Boolean}
		 */
		History.isTraditionalAnchor = function(url_or_hash){
			// Check
			var isTraditional = !(/[\/\?\.]/.test(url_or_hash));

			// Return
			return isTraditional;
		};

		/**
		 * History.extractState
		 * Get a State by it's URL or Hash
		 * @param {String} url_or_hash
		 * @return {State|null}
		 */
		History.extractState = function(url_or_hash,create){
			// Prepare
			var State = null, id, url;
			create = create||false;

			// Fetch SUID
			id = History.extractId(url_or_hash);
			if ( id ) {
				State = History.getStateById(id);
			}

			// Fetch SUID returned no State
			if ( !State ) {
				// Fetch URL
				url = History.getFullUrl(url_or_hash);

				// Check URL
				id = History.getIdByUrl(url)||false;
				if ( id ) {
					State = History.getStateById(id);
				}

				// Create State
				if ( !State && create && !History.isTraditionalAnchor(url_or_hash) ) {
					State = History.createStateObject(null,null,url);
				}
			}

			// Return
			return State;
		};

		/**
		 * History.getIdByUrl()
		 * Get a State ID by a State URL
		 */
		History.getIdByUrl = function(url){
			// Fetch
			var id = History.urlToId[url] || History.store.urlToId[url] || undefined;

			// Return
			return id;
		};

		/**
		 * History.getLastSavedState()
		 * Get an object containing the data, title and url of the current state
		 * @return {Object} State
		 */
		History.getLastSavedState = function(){
			return History.savedStates[History.savedStates.length-1]||undefined;
		};

		/**
		 * History.getLastStoredState()
		 * Get an object containing the data, title and url of the current state
		 * @return {Object} State
		 */
		History.getLastStoredState = function(){
			return History.storedStates[History.storedStates.length-1]||undefined;
		};

		/**
		 * History.hasUrlDuplicate
		 * Checks if a Url will have a url conflict
		 * @param {Object} newState
		 * @return {Boolean} hasDuplicate
		 */
		History.hasUrlDuplicate = function(newState) {
			// Prepare
			var hasDuplicate = false,
				oldState;

			// Fetch
			oldState = History.extractState(newState.url);

			// Check
			hasDuplicate = oldState && oldState.id !== newState.id;

			// Return
			return hasDuplicate;
		};

		/**
		 * History.storeState
		 * Store a State
		 * @param {Object} newState
		 * @return {Object} newState
		 */
		History.storeState = function(newState){
			// Store the State
			History.urlToId[newState.url] = newState.id;

			// Push the State
			History.storedStates.push(History.cloneObject(newState));

			// Return newState
			return newState;
		};

		/**
		 * History.isLastSavedState(newState)
		 * Tests to see if the state is the last state
		 * @param {Object} newState
		 * @return {boolean} isLast
		 */
		History.isLastSavedState = function(newState){
			// Prepare
			var isLast = false,
				newId, oldState, oldId;

			// Check
			if ( History.savedStates.length ) {
				newId = newState.id;
				oldState = History.getLastSavedState();
				oldId = oldState.id;

				// Check
				isLast = (newId === oldId);
			}

			// Return
			return isLast;
		};

		/**
		 * History.saveState
		 * Push a State
		 * @param {Object} newState
		 * @return {boolean} changed
		 */
		History.saveState = function(newState){
			// Check Hash
			if ( History.isLastSavedState(newState) ) {
				return false;
			}

			// Push the State
			History.savedStates.push(History.cloneObject(newState));

			// Return true
			return true;
		};

		/**
		 * History.getStateByIndex()
		 * Gets a state by the index
		 * @param {integer} index
		 * @return {Object}
		 */
		History.getStateByIndex = function(index){
			// Prepare
			var State = null;

			// Handle
			if ( typeof index === 'undefined' ) {
				// Get the last inserted
				State = History.savedStates[History.savedStates.length-1];
			}
			else if ( index < 0 ) {
				// Get from the end
				State = History.savedStates[History.savedStates.length+index];
			}
			else {
				// Get from the beginning
				State = History.savedStates[index];
			}

			// Return State
			return State;
		};
		
		/**
		 * History.getCurrentIndex()
		 * Gets the current index
		 * @return (integer)
		*/
		History.getCurrentIndex = function(){
			// Prepare
			var index = null;
			
			// No states saved
			if(History.savedStates.length < 1) {
				index = 0;
			}
			else {
				index = History.savedStates.length-1;
			}
			return index;
		};

		// ====================================================================
		// Hash Helpers

		/**
		 * History.getHash()
		 * @param {Location=} location
		 * Gets the current document hash
		 * Note: unlike location.hash, this is guaranteed to return the escaped hash in all browsers
		 * @return {string}
		 */
		History.getHash = function(doc){
			var url = History.getLocationHref(doc),
				hash;
			hash = History.getHashByUrl(url);
			return hash;
		};

		/**
		 * History.unescapeHash()
		 * normalize and Unescape a Hash
		 * @param {String} hash
		 * @return {string}
		 */
		History.unescapeHash = function(hash){
			// Prepare
			var result = History.normalizeHash(hash);

			// Unescape hash
			result = decodeURIComponent(result);

			// Return result
			return result;
		};

		/**
		 * History.normalizeHash()
		 * normalize a hash across browsers
		 * @return {string}
		 */
		History.normalizeHash = function(hash){
			// Prepare
			var result = hash.replace(/[^#]*#/,'').replace(/#.*/, '');

			// Return result
			return result;
		};

		/**
		 * History.setHash(hash)
		 * Sets the document hash
		 * @param {string} hash
		 * @return {History}
		 */
		History.setHash = function(hash,queue){
			// Prepare
			var State, pageUrl;

			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				//History.debug('History.setHash: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.setHash,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Log
			//History.debug('History.setHash: called',hash);

			// Make Busy + Continue
			History.busy(true);

			// Check if hash is a state
			State = History.extractState(hash,true);
			if ( State && !History.emulated.pushState ) {
				// Hash is a state so skip the setHash
				//History.debug('History.setHash: Hash is a state so skipping the hash set with a direct pushState call',arguments);

				// PushState
				History.pushState(State.data,State.title,State.url,false);
			}
			else if ( History.getHash() !== hash ) {
				// Hash is a proper hash, so apply it

				// Handle browser bugs
				if ( History.bugs.setHash ) {
					// Fix Safari Bug https://bugs.webkit.org/show_bug.cgi?id=56249

					// Fetch the base page
					pageUrl = History.getPageUrl();

					// Safari hash apply
					History.pushState(null,null,pageUrl+'#'+hash,false);
				}
				else {
					// Normal hash apply
					document.location.hash = hash;
				}
			}

			// Chain
			return History;
		};

		/**
		 * History.escape()
		 * normalize and Escape a Hash
		 * @return {string}
		 */
		History.escapeHash = function(hash){
			// Prepare
			var result = History.normalizeHash(hash);

			// Escape hash
			result = window.encodeURIComponent(result);

			// IE6 Escape Bug
			if ( !History.bugs.hashEscape ) {
				// Restore common parts
				result = result
					.replace(/\%21/g,'!')
					.replace(/\%26/g,'&')
					.replace(/\%3D/g,'=')
					.replace(/\%3F/g,'?');
			}

			// Return result
			return result;
		};

		/**
		 * History.getHashByUrl(url)
		 * Extracts the Hash from a URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.getHashByUrl = function(url){
			// Extract the hash
			var hash = String(url)
				.replace(/([^#]*)#?([^#]*)#?(.*)/, '$2')
				;

			// Unescape hash
			hash = History.unescapeHash(hash);

			// Return hash
			return hash;
		};

		/**
		 * History.setTitle(title)
		 * Applies the title to the document
		 * @param {State} newState
		 * @return {Boolean}
		 */
		History.setTitle = function(newState){
			// Prepare
			var title = newState.title,
				firstState;

			// Initial
			if ( !title ) {
				firstState = History.getStateByIndex(0);
				if ( firstState && firstState.url === newState.url ) {
					title = firstState.title||History.options.initialTitle;
				}
			}

			// Apply
			try {
				document.getElementsByTagName('title')[0].innerHTML = title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
			}
			catch ( Exception ) { }
			document.title = title;

			// Chain
			return History;
		};


		// ====================================================================
		// Queueing

		/**
		 * History.queues
		 * The list of queues to use
		 * First In, First Out
		 */
		History.queues = [];

		/**
		 * History.busy(value)
		 * @param {boolean} value [optional]
		 * @return {boolean} busy
		 */
		History.busy = function(value){
			// Apply
			if ( typeof value !== 'undefined' ) {
				//History.debug('History.busy: changing ['+(History.busy.flag||false)+'] to ['+(value||false)+']', History.queues.length);
				History.busy.flag = value;
			}
			// Default
			else if ( typeof History.busy.flag === 'undefined' ) {
				History.busy.flag = false;
			}

			// Queue
			if ( !History.busy.flag ) {
				// Execute the next item in the queue
				clearTimeout(History.busy.timeout);
				var fireNext = function(){
					var i, queue, item;
					if ( History.busy.flag ) return;
					for ( i=History.queues.length-1; i >= 0; --i ) {
						queue = History.queues[i];
						if ( queue.length === 0 ) continue;
						item = queue.shift();
						History.fireQueueItem(item);
						History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
					}
				};
				History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
			}

			// Return
			return History.busy.flag;
		};

		/**
		 * History.busy.flag
		 */
		History.busy.flag = false;

		/**
		 * History.fireQueueItem(item)
		 * Fire a Queue Item
		 * @param {Object} item
		 * @return {Mixed} result
		 */
		History.fireQueueItem = function(item){
			return item.callback.apply(item.scope||History,item.args||[]);
		};

		/**
		 * History.pushQueue(callback,args)
		 * Add an item to the queue
		 * @param {Object} item [scope,callback,args,queue]
		 */
		History.pushQueue = function(item){
			// Prepare the queue
			History.queues[item.queue||0] = History.queues[item.queue||0]||[];

			// Add to the queue
			History.queues[item.queue||0].push(item);

			// Chain
			return History;
		};

		/**
		 * History.queue (item,queue), (func,queue), (func), (item)
		 * Either firs the item now if not busy, or adds it to the queue
		 */
		History.queue = function(item,queue){
			// Prepare
			if ( typeof item === 'function' ) {
				item = {
					callback: item
				};
			}
			if ( typeof queue !== 'undefined' ) {
				item.queue = queue;
			}

			// Handle
			if ( History.busy() ) {
				History.pushQueue(item);
			} else {
				History.fireQueueItem(item);
			}

			// Chain
			return History;
		};

		/**
		 * History.clearQueue()
		 * Clears the Queue
		 */
		History.clearQueue = function(){
			History.busy.flag = false;
			History.queues = [];
			return History;
		};


		// ====================================================================
		// IE Bug Fix

		/**
		 * History.stateChanged
		 * States whether or not the state has changed since the last double check was initialised
		 */
		History.stateChanged = false;

		/**
		 * History.doubleChecker
		 * Contains the timeout used for the double checks
		 */
		History.doubleChecker = false;

		/**
		 * History.doubleCheckComplete()
		 * Complete a double check
		 * @return {History}
		 */
		History.doubleCheckComplete = function(){
			// Update
			History.stateChanged = true;

			// Clear
			History.doubleCheckClear();

			// Chain
			return History;
		};

		/**
		 * History.doubleCheckClear()
		 * Clear a double check
		 * @return {History}
		 */
		History.doubleCheckClear = function(){
			// Clear
			if ( History.doubleChecker ) {
				clearTimeout(History.doubleChecker);
				History.doubleChecker = false;
			}

			// Chain
			return History;
		};

		/**
		 * History.doubleCheck()
		 * Create a double check
		 * @return {History}
		 */
		History.doubleCheck = function(tryAgain){
			// Reset
			History.stateChanged = false;
			History.doubleCheckClear();

			// Fix IE6,IE7 bug where calling history.back or history.forward does not actually change the hash (whereas doing it manually does)
			// Fix Safari 5 bug where sometimes the state does not change: https://bugs.webkit.org/show_bug.cgi?id=42940
			if ( History.bugs.ieDoubleCheck ) {
				// Apply Check
				History.doubleChecker = setTimeout(
					function(){
						History.doubleCheckClear();
						if ( !History.stateChanged ) {
							//History.debug('History.doubleCheck: State has not yet changed, trying again', arguments);
							// Re-Attempt
							tryAgain();
						}
						return true;
					},
					History.options.doubleCheckInterval
				);
			}

			// Chain
			return History;
		};


		// ====================================================================
		// Safari Bug Fix

		/**
		 * History.safariStatePoll()
		 * Poll the current state
		 * @return {History}
		 */
		History.safariStatePoll = function(){
			// Poll the URL

			// Get the Last State which has the new URL
			var
				urlState = History.extractState(History.getLocationHref()),
				newState;

			// Check for a difference
			if ( !History.isLastSavedState(urlState) ) {
				newState = urlState;
			}
			else {
				return;
			}

			// Check if we have a state with that url
			// If not create it
			if ( !newState ) {
				//History.debug('History.safariStatePoll: new');
				newState = History.createStateObject();
			}

			// Apply the New State
			//History.debug('History.safariStatePoll: trigger');
			History.Adapter.trigger(window,'popstate');

			// Chain
			return History;
		};


		// ====================================================================
		// State Aliases

		/**
		 * History.back(queue)
		 * Send the browser history back one item
		 * @param {Integer} queue [optional]
		 */
		History.back = function(queue){
			//History.debug('History.back: called', arguments);

			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				//History.debug('History.back: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.back,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Make Busy + Continue
			History.busy(true);

			// Fix certain browser bugs that prevent the state from changing
			History.doubleCheck(function(){
				History.back(false);
			});

			// Go back
			history.go(-1);

			// End back closure
			return true;
		};

		/**
		 * History.forward(queue)
		 * Send the browser history forward one item
		 * @param {Integer} queue [optional]
		 */
		History.forward = function(queue){
			//History.debug('History.forward: called', arguments);

			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				//History.debug('History.forward: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.forward,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Make Busy + Continue
			History.busy(true);

			// Fix certain browser bugs that prevent the state from changing
			History.doubleCheck(function(){
				History.forward(false);
			});

			// Go forward
			history.go(1);

			// End forward closure
			return true;
		};

		/**
		 * History.go(index,queue)
		 * Send the browser history back or forward index times
		 * @param {Integer} queue [optional]
		 */
		History.go = function(index,queue){
			//History.debug('History.go: called', arguments);

			// Prepare
			var i;

			// Handle
			if ( index > 0 ) {
				// Forward
				for ( i=1; i<=index; ++i ) {
					History.forward(queue);
				}
			}
			else if ( index < 0 ) {
				// Backward
				for ( i=-1; i>=index; --i ) {
					History.back(queue);
				}
			}
			else {
				throw new Error('History.go: History.go requires a positive or negative integer passed.');
			}

			// Chain
			return History;
		};


		// ====================================================================
		// HTML5 State Support

		// Non-Native pushState Implementation
		if ( History.emulated.pushState ) {
			/*
			 * Provide Skeleton for HTML4 Browsers
			 */

			// Prepare
			var emptyFunction = function(){};
			History.pushState = History.pushState||emptyFunction;
			History.replaceState = History.replaceState||emptyFunction;
		} // History.emulated.pushState

		// Native pushState Implementation
		else {
			/*
			 * Use native HTML5 History API Implementation
			 */

			/**
			 * History.onPopState(event,extra)
			 * Refresh the Current State
			 */
			History.onPopState = function(event,extra){
				// Prepare
				var stateId = false, newState = false, currentHash, currentState;

				// Reset the double check
				History.doubleCheckComplete();

				// Check for a Hash, and handle apporiatly
				currentHash = History.getHash();
				if ( currentHash ) {
					// Expand Hash
					currentState = History.extractState(currentHash||History.getLocationHref(),true);
					if ( currentState ) {
						// We were able to parse it, it must be a State!
						// Let's forward to replaceState
						//History.debug('History.onPopState: state anchor', currentHash, currentState);
						History.replaceState(currentState.data, currentState.title, currentState.url, false);
					}
					else {
						// Traditional Anchor
						//History.debug('History.onPopState: traditional anchor', currentHash);
						History.Adapter.trigger(window,'anchorchange');
						History.busy(false);
					}

					// We don't care for hashes
					History.expectedStateId = false;
					return false;
				}

				// Ensure
				stateId = History.Adapter.extractEventData('state',event,extra) || false;

				// Fetch State
				if ( stateId ) {
					// Vanilla: Back/forward button was used
					newState = History.getStateById(stateId);
				}
				else if ( History.expectedStateId ) {
					// Vanilla: A new state was pushed, and popstate was called manually
					newState = History.getStateById(History.expectedStateId);
				}
				else {
					// Initial State
					newState = History.extractState(History.getLocationHref());
				}

				// The State did not exist in our store
				if ( !newState ) {
					// Regenerate the State
					newState = History.createStateObject(null,null,History.getLocationHref());
				}

				// Clean
				History.expectedStateId = false;

				// Check if we are the same state
				if ( History.isLastSavedState(newState) ) {
					// There has been no change (just the page's hash has finally propagated)
					//History.debug('History.onPopState: no change', newState, History.savedStates);
					History.busy(false);
					return false;
				}

				// Store the State
				History.storeState(newState);
				History.saveState(newState);

				// Force update of the title
				History.setTitle(newState);

				// Fire Our Event
				History.Adapter.trigger(window,'statechange');
				History.busy(false);

				// Return true
				return true;
			};
			History.Adapter.bind(window,'popstate',History.onPopState);

			/**
			 * History.pushState(data,title,url)
			 * Add a new State to the history object, become it, and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.pushState = function(data,title,url,queue){
				//History.debug('History.pushState: called', arguments);

				// Check the State
				if ( History.getHashByUrl(url) && History.emulated.pushState ) {
					throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.pushState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.pushState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy + Continue
				History.busy(true);

				// Create the newState
				var newState = History.createStateObject(data,title,url);

				// Check it
				if ( History.isLastSavedState(newState) ) {
					// Won't be a change
					History.busy(false);
				}
				else {
					// Store the newState
					History.storeState(newState);
					History.expectedStateId = newState.id;

					// Push the newState
					history.pushState(newState.id,newState.title,newState.url);

					// Fire HTML5 Event
					History.Adapter.trigger(window,'popstate');
				}

				// End pushState closure
				return true;
			};

			/**
			 * History.replaceState(data,title,url)
			 * Replace the State and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.replaceState = function(data,title,url,queue){
				//History.debug('History.replaceState: called', arguments);

				// Check the State
				if ( History.getHashByUrl(url) && History.emulated.pushState ) {
					throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.replaceState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.replaceState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy + Continue
				History.busy(true);

				// Create the newState
				var newState = History.createStateObject(data,title,url);

				// Check it
				if ( History.isLastSavedState(newState) ) {
					// Won't be a change
					History.busy(false);
				}
				else {
					// Store the newState
					History.storeState(newState);
					History.expectedStateId = newState.id;

					// Push the newState
					history.replaceState(newState.id,newState.title,newState.url);

					// Fire HTML5 Event
					History.Adapter.trigger(window,'popstate');
				}

				// End replaceState closure
				return true;
			};

		} // !History.emulated.pushState


		// ====================================================================
		// Initialise

		/**
		 * Load the Store
		 */
		if ( sessionStorage ) {
			// Fetch
			try {
				History.store = JSON.parse(sessionStorage.getItem('History.store'))||{};
			}
			catch ( err ) {
				History.store = {};
			}

			// Normalize
			History.normalizeStore();
		}
		else {
			// Default Load
			History.store = {};
			History.normalizeStore();
		}

		/**
		 * Clear Intervals on exit to prevent memory leaks
		 */
		History.Adapter.bind(window,"unload",History.clearAllIntervals);

		/**
		 * Create the initial State
		 */
		History.saveState(History.storeState(History.extractState(History.getLocationHref(),true)));

		/**
		 * Bind for Saving Store
		 */
		if ( sessionStorage ) {
			// When the page is closed
			History.onUnload = function(){
				// Prepare
				var	currentStore, item, currentStoreString;

				// Fetch
				try {
					currentStore = JSON.parse(sessionStorage.getItem('History.store'))||{};
				}
				catch ( err ) {
					currentStore = {};
				}

				// Ensure
				currentStore.idToState = currentStore.idToState || {};
				currentStore.urlToId = currentStore.urlToId || {};
				currentStore.stateToId = currentStore.stateToId || {};

				// Sync
				for ( item in History.idToState ) {
					if ( !History.idToState.hasOwnProperty(item) ) {
						continue;
					}
					currentStore.idToState[item] = History.idToState[item];
				}
				for ( item in History.urlToId ) {
					if ( !History.urlToId.hasOwnProperty(item) ) {
						continue;
					}
					currentStore.urlToId[item] = History.urlToId[item];
				}
				for ( item in History.stateToId ) {
					if ( !History.stateToId.hasOwnProperty(item) ) {
						continue;
					}
					currentStore.stateToId[item] = History.stateToId[item];
				}

				// Update
				History.store = currentStore;
				History.normalizeStore();

				// In Safari, going into Private Browsing mode causes the
				// Session Storage object to still exist but if you try and use
				// or set any property/function of it it throws the exception
				// "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to
				// add something to storage that exceeded the quota." infinitely
				// every second.
				currentStoreString = JSON.stringify(currentStore);
				try {
					// Store
					sessionStorage.setItem('History.store', currentStoreString);
				}
				catch (e) {
					if (e.code === DOMException.QUOTA_EXCEEDED_ERR) {
						if (sessionStorage.length) {
							// Workaround for a bug seen on iPads. Sometimes the quota exceeded error comes up and simply
							// removing/resetting the storage can work.
							sessionStorage.removeItem('History.store');
							sessionStorage.setItem('History.store', currentStoreString);
						} else {
							// Otherwise, we're probably private browsing in Safari, so we'll ignore the exception.
						}
					} else {
						throw e;
					}
				}
			};

			// For Internet Explorer
			History.intervalList.push(setInterval(History.onUnload,History.options.storeInterval));

			// For Other Browsers
			History.Adapter.bind(window,'beforeunload',History.onUnload);
			History.Adapter.bind(window,'unload',History.onUnload);

			// Both are enabled for consistency
		}

		// Non-Native pushState Implementation
		if ( !History.emulated.pushState ) {
			// Be aware, the following is only for native pushState implementations
			// If you are wanting to include something for all browsers
			// Then include it above this if block

			/**
			 * Setup Safari Fix
			 */
			if ( History.bugs.safariPoll ) {
				History.intervalList.push(setInterval(History.safariStatePoll, History.options.safariPollInterval));
			}

			/**
			 * Ensure Cross Browser Compatibility
			 */
			if ( navigator.vendor === 'Apple Computer, Inc.' || (navigator.appCodeName||'') === 'Mozilla' ) {
				/**
				 * Fix Safari HashChange Issue
				 */

				// Setup Alias
				History.Adapter.bind(window,'hashchange',function(){
					History.Adapter.trigger(window,'popstate');
				});

				// Initialise Alias
				if ( History.getHash() ) {
					History.Adapter.onDomLoad(function(){
						History.Adapter.trigger(window,'hashchange');
					});
				}
			}

		} // !History.emulated.pushState


	}; // History.initCore

	// Try to Initialise History
	if (!History.options || !History.options.delayInit) {
		History.init();
	}

})(window);/*!** End file: history.js ***/
/*!** Begin file: history.html4.js ***/
/**
 * History.js HTML4 Support
 * Depends on the HTML5 Support
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(window,undefined){
	"use strict";

	// ========================================================================
	// Initialise

	// Localise Globals
	var
		document = window.document, // Make sure we are using the correct document
		setTimeout = window.setTimeout||setTimeout,
		clearTimeout = window.clearTimeout||clearTimeout,
		setInterval = window.setInterval||setInterval,
		History = window.History = window.History||{}; // Public History Object

	// Check Existence
	if ( typeof History.initHtml4 !== 'undefined' ) {
		throw new Error('History.js HTML4 Support has already been loaded...');
	}


	// ========================================================================
	// Initialise HTML4 Support

	// Initialise HTML4 Support
	History.initHtml4 = function(){
		// Initialise
		if ( typeof History.initHtml4.initialized !== 'undefined' ) {
			// Already Loaded
			return false;
		}
		else {
			History.initHtml4.initialized = true;
		}


		// ====================================================================
		// Properties

		/**
		 * History.enabled
		 * Is History enabled?
		 */
		History.enabled = true;


		// ====================================================================
		// Hash Storage

		/**
		 * History.savedHashes
		 * Store the hashes in an array
		 */
		History.savedHashes = [];

		/**
		 * History.isLastHash(newHash)
		 * Checks if the hash is the last hash
		 * @param {string} newHash
		 * @return {boolean} true
		 */
		History.isLastHash = function(newHash){
			// Prepare
			var oldHash = History.getHashByIndex(),
				isLast;

			// Check
			isLast = newHash === oldHash;

			// Return isLast
			return isLast;
		};

		/**
		 * History.isHashEqual(newHash, oldHash)
		 * Checks to see if two hashes are functionally equal
		 * @param {string} newHash
		 * @param {string} oldHash
		 * @return {boolean} true
		 */
		History.isHashEqual = function(newHash, oldHash){
			newHash = encodeURIComponent(newHash).replace(/%25/g, "%");
			oldHash = encodeURIComponent(oldHash).replace(/%25/g, "%");
			return newHash === oldHash;
		};

		/**
		 * History.saveHash(newHash)
		 * Push a Hash
		 * @param {string} newHash
		 * @return {boolean} true
		 */
		History.saveHash = function(newHash){
			// Check Hash
			if ( History.isLastHash(newHash) ) {
				return false;
			}

			// Push the Hash
			History.savedHashes.push(newHash);

			// Return true
			return true;
		};

		/**
		 * History.getHashByIndex()
		 * Gets a hash by the index
		 * @param {integer} index
		 * @return {string}
		 */
		History.getHashByIndex = function(index){
			// Prepare
			var hash = null;

			// Handle
			if ( typeof index === 'undefined' ) {
				// Get the last inserted
				hash = History.savedHashes[History.savedHashes.length-1];
			}
			else if ( index < 0 ) {
				// Get from the end
				hash = History.savedHashes[History.savedHashes.length+index];
			}
			else {
				// Get from the beginning
				hash = History.savedHashes[index];
			}

			// Return hash
			return hash;
		};


		// ====================================================================
		// Discarded States

		/**
		 * History.discardedHashes
		 * A hashed array of discarded hashes
		 */
		History.discardedHashes = {};

		/**
		 * History.discardedStates
		 * A hashed array of discarded states
		 */
		History.discardedStates = {};

		/**
		 * History.discardState(State)
		 * Discards the state by ignoring it through History
		 * @param {object} State
		 * @return {true}
		 */
		History.discardState = function(discardedState,forwardState,backState){
			//History.debug('History.discardState', arguments);
			// Prepare
			var discardedStateHash = History.getHashByState(discardedState),
				discardObject;

			// Create Discard Object
			discardObject = {
				'discardedState': discardedState,
				'backState': backState,
				'forwardState': forwardState
			};

			// Add to DiscardedStates
			History.discardedStates[discardedStateHash] = discardObject;

			// Return true
			return true;
		};

		/**
		 * History.discardHash(hash)
		 * Discards the hash by ignoring it through History
		 * @param {string} hash
		 * @return {true}
		 */
		History.discardHash = function(discardedHash,forwardState,backState){
			//History.debug('History.discardState', arguments);
			// Create Discard Object
			var discardObject = {
				'discardedHash': discardedHash,
				'backState': backState,
				'forwardState': forwardState
			};

			// Add to discardedHash
			History.discardedHashes[discardedHash] = discardObject;

			// Return true
			return true;
		};

		/**
		 * History.discardedState(State)
		 * Checks to see if the state is discarded
		 * @param {object} State
		 * @return {bool}
		 */
		History.discardedState = function(State){
			// Prepare
			var StateHash = History.getHashByState(State),
				discarded;

			// Check
			discarded = History.discardedStates[StateHash]||false;

			// Return true
			return discarded;
		};

		/**
		 * History.discardedHash(hash)
		 * Checks to see if the state is discarded
		 * @param {string} State
		 * @return {bool}
		 */
		History.discardedHash = function(hash){
			// Check
			var discarded = History.discardedHashes[hash]||false;

			// Return true
			return discarded;
		};

		/**
		 * History.recycleState(State)
		 * Allows a discarded state to be used again
		 * @param {object} data
		 * @param {string} title
		 * @param {string} url
		 * @return {true}
		 */
		History.recycleState = function(State){
			//History.debug('History.recycleState', arguments);
			// Prepare
			var StateHash = History.getHashByState(State);

			// Remove from DiscardedStates
			if ( History.discardedState(State) ) {
				delete History.discardedStates[StateHash];
			}

			// Return true
			return true;
		};


		// ====================================================================
		// HTML4 HashChange Support

		if ( History.emulated.hashChange ) {
			/*
			 * We must emulate the HTML4 HashChange Support by manually checking for hash changes
			 */

			/**
			 * History.hashChangeInit()
			 * Init the HashChange Emulation
			 */
			History.hashChangeInit = function(){
				// Define our Checker Function
				History.checkerFunction = null;

				// Define some variables that will help in our checker function
				var lastDocumentHash = '',
					iframeId, iframe,
					lastIframeHash, checkerRunning,
					startedWithHash = Boolean(History.getHash());

				// Handle depending on the browser
				if ( History.isInternetExplorer() ) {
					// IE6 and IE7
					// We need to use an iframe to emulate the back and forward buttons

					// Create iFrame
					iframeId = 'historyjs-iframe';
					iframe = document.createElement('iframe');

					// Adjust iFarme
					// IE 6 requires iframe to have a src on HTTPS pages, otherwise it will throw a
					// "This page contains both secure and nonsecure items" warning.
					iframe.setAttribute('id', iframeId);
					iframe.setAttribute('src', '#');
					iframe.style.display = 'none';

					// Append iFrame
					document.body.appendChild(iframe);

					// Create initial history entry
					iframe.contentWindow.document.open();
					iframe.contentWindow.document.close();

					// Define some variables that will help in our checker function
					lastIframeHash = '';
					checkerRunning = false;

					// Define the checker function
					History.checkerFunction = function(){
						// Check Running
						if ( checkerRunning ) {
							return false;
						}

						// Update Running
						checkerRunning = true;

						// Fetch
						var
							documentHash = History.getHash(),
							iframeHash = History.getHash(iframe.contentWindow.document);

						// The Document Hash has changed (application caused)
						if ( documentHash !== lastDocumentHash ) {
							// Equalise
							lastDocumentHash = documentHash;

							// Create a history entry in the iframe
							if ( iframeHash !== documentHash ) {
								//History.debug('hashchange.checker: iframe hash change', 'documentHash (new):', documentHash, 'iframeHash (old):', iframeHash);

								// Equalise
								lastIframeHash = iframeHash = documentHash;

								// Create History Entry
								iframe.contentWindow.document.open();
								iframe.contentWindow.document.close();

								// Update the iframe's hash
								iframe.contentWindow.document.location.hash = History.escapeHash(documentHash);
							}

							// Trigger Hashchange Event
							History.Adapter.trigger(window,'hashchange');
						}

						// The iFrame Hash has changed (back button caused)
						else if ( iframeHash !== lastIframeHash ) {
							//History.debug('hashchange.checker: iframe hash out of sync', 'iframeHash (new):', iframeHash, 'documentHash (old):', documentHash);

							// Equalise
							lastIframeHash = iframeHash;
							
							// If there is no iframe hash that means we're at the original
							// iframe state.
							// And if there was a hash on the original request, the original
							// iframe state was replaced instantly, so skip this state and take
							// the user back to where they came from.
							if (startedWithHash && iframeHash === '') {
								History.back();
							}
							else {
								// Update the Hash
								History.setHash(iframeHash,false);
							}
						}

						// Reset Running
						checkerRunning = false;

						// Return true
						return true;
					};
				}
				else {
					// We are not IE
					// Firefox 1 or 2, Opera

					// Define the checker function
					History.checkerFunction = function(){
						// Prepare
						var documentHash = History.getHash()||'';

						// The Document Hash has changed (application caused)
						if ( documentHash !== lastDocumentHash ) {
							// Equalise
							lastDocumentHash = documentHash;

							// Trigger Hashchange Event
							History.Adapter.trigger(window,'hashchange');
						}

						// Return true
						return true;
					};
				}

				// Apply the checker function
				History.intervalList.push(setInterval(History.checkerFunction, History.options.hashChangeInterval));

				// Done
				return true;
			}; // History.hashChangeInit

			// Bind hashChangeInit
			History.Adapter.onDomLoad(History.hashChangeInit);

		} // History.emulated.hashChange


		// ====================================================================
		// HTML5 State Support

		// Non-Native pushState Implementation
		if ( History.emulated.pushState ) {
			/*
			 * We must emulate the HTML5 State Management by using HTML4 HashChange
			 */

			/**
			 * History.onHashChange(event)
			 * Trigger HTML5's window.onpopstate via HTML4 HashChange Support
			 */
			History.onHashChange = function(event){
				//History.debug('History.onHashChange', arguments);

				// Prepare
				var currentUrl = ((event && event.newURL) || History.getLocationHref()),
					currentHash = History.getHashByUrl(currentUrl),
					currentState = null,
					currentStateHash = null,
					currentStateHashExits = null,
					discardObject;

				// Check if we are the same state
				if ( History.isLastHash(currentHash) ) {
					// There has been no change (just the page's hash has finally propagated)
					//History.debug('History.onHashChange: no change');
					History.busy(false);
					return false;
				}

				// Reset the double check
				History.doubleCheckComplete();

				// Store our location for use in detecting back/forward direction
				History.saveHash(currentHash);

				// Expand Hash
				if ( currentHash && History.isTraditionalAnchor(currentHash) ) {
					//History.debug('History.onHashChange: traditional anchor', currentHash);
					// Traditional Anchor Hash
					History.Adapter.trigger(window,'anchorchange');
					History.busy(false);
					return false;
				}

				// Create State
				currentState = History.extractState(History.getFullUrl(currentHash||History.getLocationHref()),true);

				// Check if we are the same state
				if ( History.isLastSavedState(currentState) ) {
					//History.debug('History.onHashChange: no change');
					// There has been no change (just the page's hash has finally propagated)
					History.busy(false);
					return false;
				}

				// Create the state Hash
				currentStateHash = History.getHashByState(currentState);

				// Check if we are DiscardedState
				discardObject = History.discardedState(currentState);
				if ( discardObject ) {
					// Ignore this state as it has been discarded and go back to the state before it
					if ( History.getHashByIndex(-2) === History.getHashByState(discardObject.forwardState) ) {
						// We are going backwards
						//History.debug('History.onHashChange: go backwards');
						History.back(false);
					} else {
						// We are going forwards
						//History.debug('History.onHashChange: go forwards');
						History.forward(false);
					}
					return false;
				}

				// Push the new HTML5 State
				//History.debug('History.onHashChange: success hashchange');
				History.pushState(currentState.data,currentState.title,encodeURI(currentState.url),false);

				// End onHashChange closure
				return true;
			};
			History.Adapter.bind(window,'hashchange',History.onHashChange);

			/**
			 * History.pushState(data,title,url)
			 * Add a new State to the history object, become it, and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.pushState = function(data,title,url,queue){
				//History.debug('History.pushState: called', arguments);

				// We assume that the URL passed in is URI-encoded, but this makes
				// sure that it's fully URI encoded; any '%'s that are encoded are
				// converted back into '%'s
				url = encodeURI(url).replace(/%25/g, "%");

				// Check the State
				if ( History.getHashByUrl(url) ) {
					throw new Error('History.js does not support states with fragment-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.pushState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.pushState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy
				History.busy(true);

				// Fetch the State Object
				var newState = History.createStateObject(data,title,url),
					newStateHash = History.getHashByState(newState),
					oldState = History.getState(false),
					oldStateHash = History.getHashByState(oldState),
					html4Hash = History.getHash(),
					wasExpected = History.expectedStateId == newState.id;

				// Store the newState
				History.storeState(newState);
				History.expectedStateId = newState.id;

				// Recycle the State
				History.recycleState(newState);

				// Force update of the title
				History.setTitle(newState);

				// Check if we are the same State
				if ( newStateHash === oldStateHash ) {
					//History.debug('History.pushState: no change', newStateHash);
					History.busy(false);
					return false;
				}

				// Update HTML5 State
				History.saveState(newState);

				// Fire HTML5 Event
				if(!wasExpected)
					History.Adapter.trigger(window,'statechange');

				// Update HTML4 Hash
				if ( !History.isHashEqual(newStateHash, html4Hash) && !History.isHashEqual(newStateHash, History.getShortUrl(History.getLocationHref())) ) {
					History.setHash(newStateHash,false);
				}
				
				History.busy(false);

				// End pushState closure
				return true;
			};

			/**
			 * History.replaceState(data,title,url)
			 * Replace the State and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.replaceState = function(data,title,url,queue){
				//History.debug('History.replaceState: called', arguments);

				// We assume that the URL passed in is URI-encoded, but this makes
				// sure that it's fully URI encoded; any '%'s that are encoded are
				// converted back into '%'s
				url = encodeURI(url).replace(/%25/g, "%");

				// Check the State
				if ( History.getHashByUrl(url) ) {
					throw new Error('History.js does not support states with fragment-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.replaceState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.replaceState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy
				History.busy(true);

				// Fetch the State Objects
				var newState        = History.createStateObject(data,title,url),
					newStateHash = History.getHashByState(newState),
					oldState        = History.getState(false),
					oldStateHash = History.getHashByState(oldState),
					previousState   = History.getStateByIndex(-2);

				// Discard Old State
				History.discardState(oldState,newState,previousState);

				// If the url hasn't changed, just store and save the state
				// and fire a statechange event to be consistent with the
				// html 5 api
				if ( newStateHash === oldStateHash ) {
					// Store the newState
					History.storeState(newState);
					History.expectedStateId = newState.id;
	
					// Recycle the State
					History.recycleState(newState);
	
					// Force update of the title
					History.setTitle(newState);
					
					// Update HTML5 State
					History.saveState(newState);

					// Fire HTML5 Event
					//History.debug('History.pushState: trigger popstate');
					History.Adapter.trigger(window,'statechange');
					History.busy(false);
				}
				else {
					// Alias to PushState
					History.pushState(newState.data,newState.title,newState.url,false);
				}

				// End replaceState closure
				return true;
			};

		} // History.emulated.pushState



		// ====================================================================
		// Initialise

		// Non-Native pushState Implementation
		if ( History.emulated.pushState ) {
			/**
			 * Ensure initial state is handled correctly
			 */
			if ( History.getHash() && !History.emulated.hashChange ) {
				History.Adapter.onDomLoad(function(){
					History.Adapter.trigger(window,'hashchange');
				});
			}

		} // History.emulated.pushState

	}; // History.initHtml4

	// Try to Initialise History
	if ( typeof History.init !== 'undefined' ) {
		History.init();
	}

})(window);/*!** End file: history.html4.js ***/
/*!** Begin file: jquery.file-plugin.js ***/
jQuery.fn.file = function(fn) {
	return this.each(function() {
		var el = $(this);
		var holder = $('<div></div>').appendTo(el).css({
			position:'absolute',
			overflow:'hidden',
			'-moz-opacity':'1',
			filter:'alpha(opacity: 1)',
			opacity:'1',
			zoom:'1',
			width:el.width()+'px',
			height:el.height()+'px',
			'z-index':1
		});	

		var wid = 0;
		var inp;

		var addInput = function() {
			var current = inp = holder.html('<input '+(window.FormData ? 'multiple ' : '')+'type="file" style="border:none; position:absolute">').find('input');

			wid = wid || current.width();

			current.one('change', function() {
				addInput();
				fn(current[0]);
			})
			.css({
				'-moz-opacity':'0',
				filter:'alpha(opacity: 0)',
				opacity:'0',
				cursor:'pointer'
			});
		};
		var position = function(e) {
			holder.offset(el.offset());					

			if (e) {
				inp.offset({left:e.pageX-wid+25, top:e.pageY-10});						
			}
		};

		addInput();

		el.mouseover(position);
		el.mousemove(position);
		position();		
	});
};
/*!** End file: jquery.file-plugin.js ***/
/*!** Begin file: jquery.loadmask.js ***/
/**
 * Copyright (c) 2009 Sergiy Kovalchuk (serg472@gmail.com)
 * 
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *  
 * Following code is based on Element.mask() implementation from ExtJS framework (http://extjs.com/)
 *
 */
;(function($){
	
	/**
	 * Displays loading mask over selected element(s). Accepts both single and multiple selectors.
	 *
	 * @param label Text message that will be displayed on top of the mask besides a spinner (optional). 
	 * 				If not provided only mask will be displayed without a label or a spinner.  	
	 * @param delay Delay in milliseconds before element is masked (optional). If unmask() is called 
	 *              before the delay times out, no mask is displayed. This can be used to prevent unnecessary 
	 *              mask display for quick processes.   	
	 */
	$.fn.mask = function(label, delay){
		$(this).each(function() {
			if(delay !== undefined && delay > 0) {
		        var element = $(this);
		        element.data("_mask_timeout", setTimeout(function() { $.maskElement(element, label)}, delay));
			} else {
				$.maskElement($(this), label);
			}
		});
	};
	
	/**
	 * Removes mask from the element(s). Accepts both single and multiple selectors.
	 */
	$.fn.unmask = function(){
		$(this).each(function() {
			$.unmaskElement($(this));
		});
	};
	
	/**
	 * Checks if a single element is masked. Returns false if mask is delayed or not displayed. 
	 */
	$.fn.isMasked = function(){
		return this.hasClass("masked");
	};

	$.maskElement = function(element, label){
	
		//if this element has delayed mask scheduled then remove it and display the new one
		if (element.data("_mask_timeout") !== undefined) {
			clearTimeout(element.data("_mask_timeout"));
			element.removeData("_mask_timeout");
		}

		if(element.isMasked()) {
			$.unmaskElement(element);
		}
		
		if(element.css("position") == "static") {
			element.addClass("masked-relative");
		}
		
		element.addClass("masked");
		
		var maskDiv = $('<div class="loadmask"></div>');
		
		//auto height fix for IE
		if(navigator.userAgent.toLowerCase().indexOf("msie") > -1){
			maskDiv.height(element.height() + parseInt(element.css("padding-top")) + parseInt(element.css("padding-bottom")));
			maskDiv.width(element.width() + parseInt(element.css("padding-left")) + parseInt(element.css("padding-right")));
		}
		
		//fix for z-index bug with selects in IE6
		if(navigator.userAgent.toLowerCase().indexOf("msie 6") > -1){
			element.find("select").addClass("masked-hidden");
		}
		
		element.append(maskDiv);
		
		if(label !== undefined && label != "") {
			var maskMsgDiv = $('<div class="loadmask-msg" style="display:none;"></div>');
			maskMsgDiv.append('<div>' + label + '</div>');
			element.append(maskMsgDiv);
			
			//calculate center position
			//maskMsgDiv.css("top", Math.round(element.height() / 2 - (maskMsgDiv.height() - parseInt(maskMsgDiv.css("padding-top")) - parseInt(maskMsgDiv.css("padding-bottom"))) / 2)+"px");
			maskMsgDiv.css("top", "150px");
			maskMsgDiv.css("left", Math.round(element.width() / 2 - (maskMsgDiv.width() - parseInt(maskMsgDiv.css("padding-left")) - parseInt(maskMsgDiv.css("padding-right"))) / 2)+"px");
			
			maskMsgDiv.show();
		} 
		
	};
	
	$.unmaskElement = function(element){
		//if this element has delayed mask scheduled then remove it
		if (element.data("_mask_timeout") !== undefined) {
			clearTimeout(element.data("_mask_timeout"));
			element.removeData("_mask_timeout");
		}
		
		element.find(".loadmask-msg,.loadmask").remove();
		element.removeClass("masked");
		element.removeClass("masked-relative");
		element.find("select").removeClass("masked-hidden");
	};
 
})(jQuery);
/*!** End file: jquery.loadmask.js ***/
/*!** Begin file: bootstrap.js ***/
/* ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        if ('ontouchstart' in document.documentElement) {
          // if mobile we we use a backdrop because click events don't delegate
          $('<div class="dropdown-backdrop"/>').insertBefore($(this)).on('click', clearMenus)
        }
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $('.dropdown-backdrop').remove()
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
/*!** End file: bootstrap.js ***/
/*!** Begin file: bootstrap-select.js ***/
/* global  $:false*/
(function($) {
	"use strict";

	var Selectpicker = function(element, options, e) {
		if (e ) {
			e.stopPropagation();
			e.preventDefault();
		}
		this.$element = $(element);
		this.$newElement = null;
		this.button = null;

		//Merge defaults, options and data-attributes to make our options
		this.options = $.extend({}, $.fn.selectpicker.defaults, this.$element.data(), (typeof options === "object") ? options : {});

		//If we have no title yet, check the attribute 'title' (this is missed by jq as its not a data-attribute
		if (this.options.title === null) {
			this.options.title = this.$element.attr("title");
		}

		//Expose public methods
		this.val = Selectpicker.prototype.val;
		this.render = Selectpicker.prototype.render;
		this.refresh = Selectpicker.prototype.refresh;
		this.selectAll = Selectpicker.prototype.selectAll;
		this.deselectAll = Selectpicker.prototype.deselectAll;
		this.init();
	};

	Selectpicker.prototype = {

		constructor: Selectpicker,

		init: function () {
			if (!this.options.container) {
				this.$element.hide();
			} else {
				this.$element.css("visibility", "hidden");
			}

			this.multiple = this.$element.prop("multiple");

			var classList = this.$element.attr("class") !== undefined ? this.$element.attr("class").split(/\s+/) : "";
			var id = this.$element.attr("id");

			this.$element.after( this.createView() );
			this.$newElement = this.$element.next(".bootstrap-select");

			if (this.options.container) {
				this.selectPosition();
			}

			this.button = this.$newElement.find("> button");

			if (id !== undefined) {
				var _this = this;

				this.button.attr("data-id", id);

				$("label[for=''" + id + "']").click(function() {
					_this.$newElement.find("button[data-id="+id+"]").focus();
				});
			}

			for (var i = 0; i < classList.length; i++) {
				if (classList[i] != "selectpicker") {
					this.$newElement.addClass(classList[i]);
				}
			}

			//If we are multiple, then add the show-tick class by default
			if (this.multiple) {
				 this.$newElement.addClass("show-tick");
			}

			this.button.addClass(this.options.style);
			this.checkDisabled();
			this.checkTabIndex();
			this.clickListener();

			this.render();
			this.setSize();
		},

		createDropdown: function() {
			var drop =
				"<div class='btn-group bootstrap-select'>" +
					"<button type='button' class='btn dropdown-toggle' data-toggle='dropdown'>" +
						"<span class='filter-option pull-left'></span>&nbsp;" +
						"<span class='caret'></span>" +
					"</button>" +
					"<ul class='dropdown-menu' role='menu'>" +
					"</ul>" +
				"</div>";

			return $(drop);
		},


		createView: function() {
			var $drop = this.createDropdown();
			var $li = this.createLi();
			$drop.find("ul").append($li);
			return $drop;
		},

		reloadLi: function() {
			//Remove all children.
			this.destroyLi();

			//Re build
			var $li = this.createLi();
			this.$newElement.find("ul").append( $li );
		},

		destroyLi: function() {
			this.$newElement.find("li").remove();
		},

		createLi: function() {

			var _this = this;
			var _li = [];
			var _liA = [];
			var _liHtml = "";

			this.$element.find("option").each(function(){
				_li.push($(this).text());
			});

			this.$element.find("option").each(function() {
				var $this = $(this);

				//Get the class and text for the option
				var optionClass = $this.attr("class") !== undefined ? $this.attr("class") : "";
				var text =  $this.text();
				var subtext = $this.data("subtext") !== undefined ? "<small class='muted'>" + $this.data("subtext") + "</small>" : "";
				var icon = $this.data("icon") !== undefined ? "<i class='" + $this.data("icon") + "'></i>" : "";

				if ($this.is(":disabled") || $this.parent().is(":disabled")) {
					icon = "<span>" + icon + "</span>";
				}

				//Prepend any icon and append any subtext to the main text.
				 text = icon + "<span class='text'>" + text + subtext + "</span>";

				if (_this.options.hideDisabled && ($this.is(":disabled") || $this.parent().is(":disabled"))) {
					_liA.push("<a style='min-height: 0; padding: 0;'></a>");
				} else if ($this.parent().is("optgroup") && $this.data("divider") !== true) {
					if ($this.index() === 0) {
						//Get the opt group label
						var label = $this.parent().attr("label");
						var labelSubtext = $this.parent().data("subtext") !== undefined ? "<small class='muted'>" + $this.parent().data("subtext") + "</small>" : "";
						var labelIcon = $this.parent().data("icon") ? "<i class='" + $this.parent().data("icon") + "''></i> " : "";
						label = labelIcon + "<span class='text'>" + label + labelSubtext + "</span>";

						if ($this[0].index !== 0) {
							_liA.push(
								"<div class='div-contain'><div class='divider'></div></div>"+
								"<dt>" + label + "</dt>"+
								_this.createA(text, "opt " + optionClass )
								);
						} else {
							_liA.push(
								"<dt>" + label + "</dt>"+
								_this.createA(text, "opt " + optionClass )
								);
						}
					} else {
						 _liA.push( _this.createA(text, "opt " + optionClass )  );
					}
				} else if ($this.data("divider") === true) {
					_liA.push("<div class='div-contain'><div class='divider'></div></div>");
				} else if ($(this).data("hidden") === true) {
					_liA.push("");
				} else {
					_liA.push( _this.createA(text, optionClass ) );
				}
			});

			if (_li.length > 0) {
				for (var i = 0; i < _li.length; i++) {
					_liHtml += "<li rel=" + i + ">" + _liA[i] + "</li>";
				}
			}

			//If we are not multiple, and we dont have a selected item, and we dont have a title, select the first element so something is set in the button
			if (!this.multiple && this.$element.find("option:selected").length === 0 && !_this.options.title) {
				this.$element.find("option").eq(0).prop("selected", true).attr("selected", "selected");
			}

			return $(_liHtml);
		},

		createA: function(text, classes) {
		 return "<a tabindex='0' class='" + classes + "'><span class='text-wrapper'>" +
				 text +
				 "<i class='sprite_list_menu_close'></i></span>" +
				 "</a>";
		},

		render: function() {
			var _this = this;

			//Update the LI to match the SELECT
			this.$element.find("option").each(function(index) {
			   _this.setDisabled(index, $(this).is(":disabled") || $(this).parent().is(":disabled") );
			   _this.setSelected(index, $(this).is(":selected") );
			});

			var selectedItems = this.$element.find("option:selected").map(function() {
				var subtext;

				if (_this.options.showSubtext && $(this).attr("data-subtext") && !_this.multiple) {
					subtext = " <small class='muted'>" + $(this).data("subtext") + "</small>";
				} else {
					subtext = "";
				}

				if ($(this).attr("title") !== undefined) {
					return $(this).attr("title");
				} else {
					return $(this).text() + subtext;
				}
			}).toArray();

			//Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
			//Convert all the values into a comma delimited string
			var title = !this.multiple ? selectedItems[0] : selectedItems.join(", ");

			//If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
			if (_this.multiple && _this.options.selectedTextFormat.indexOf("count") > -1) {
				var max = _this.options.selectedTextFormat.split(">");
				var notDisabled = this.options.hideDisabled ? ":not([disabled])" : "";

				if ( (max.length > 1 && selectedItems.length > max[1]) || (max.length === 1 && selectedItems.length >= 2)) {
					title = selectedItems.length + " of " + this.$element.find("option:not([data-divider='true']):not([data-hidden='true'])" + notDisabled).length + " selected";
				}
			 }

			//If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
			if (!title) {
				title = _this.options.title !== undefined ? _this.options.title : _this.options.noneSelectedText;
			}

			var subtext;
			if (this.options.showSubtext && this.$element.find("option:selected").attr("data-subtext")) {
				subtext = " <small class='muted'>" + this.$element.find("option:selected").data("subtext") + "</small>";
			} else {
				subtext = "";
			}
			
			// Truncate fix...
			var new_title = title + subtext;
			var suffix = "...";
			var limit = 25;
			if (new_title.length > limit) {
				new_title = new_title.slice(0, limit) + suffix;
			}

			_this.$newElement.find(".filter-option").html( new_title );
		},

		setSize: function() {
			if (this.options.container) {
				// Show $newElement before perfoming size calculations
				this.$newElement.toggle(this.$element.parent().is(":visible"));
			}

			var _this = this;
			var menu = this.$newElement.find(".dropdown-menu");
			var liHeight = this.$newElement.addClass("open").find(".dropdown-menu li > a").outerHeight();
			this.$newElement.removeClass("open");
			var divHeight = menu.find("li .divider").outerHeight(true);
			var selectOffset_top = this.$newElement.offset().top;
			var selectHeight = this.$newElement.outerHeight();
			var menuPadding = parseInt(menu.css("padding-top"), 10) + parseInt(menu.css("padding-bottom"), 10) + parseInt(menu.css("border-top-width"), 10) + parseInt(menu.css("border-bottom-width"), 10);
			var notDisabled = this.options.hideDisabled ? ":not(.disabled)" : "";
			var menuHeight;

			if (this.options.size === "auto") {
				var getSize = function() {
					var selectOffset_top_scroll = selectOffset_top - $(window).scrollTop();
					var windowHeight = window.innerHeight;
					var menuExtras = menuPadding + parseInt(menu.css("margin-top"), 10) + parseInt(menu.css("margin-bottom"), 10) + 2;
					var selectOffset_bot = windowHeight - selectOffset_top_scroll - selectHeight - menuExtras;
					var minHeight;
					menuHeight = selectOffset_bot;

					if (_this.$newElement.hasClass("dropup")) {
						menuHeight = selectOffset_top_scroll - menuExtras;
					}

					if ((menu.find("li").length + menu.find("dt").length) > 3) {
						minHeight = liHeight * 3 + menuExtras - 2;
					} else {
						minHeight = 0;
					}

					if (minHeight + selectOffset_top_scroll >= windowHeight && _this.$newElement.hasClass("dropup") === false) {
						var padding = 30;
						minHeight = windowHeight - selectOffset_top_scroll - padding;
					}

					menu.css({"max-height" : menuHeight + "px", "overflow-y" : "auto", "min-height" : minHeight + "px"});
				};

				getSize();
				$(window).resize(getSize);
				$(window).scroll(getSize);
			} else if (this.options.size && this.options.size !== "auto" && this.options.size !== "fixed" && menu.find("li" + notDisabled).length > this.options.size) {
				var optIndex = menu.find("li" + notDisabled + " > *").filter(":not(.div-contain)").slice(0, this.options.size).last().parent().index();
				var divLength = menu.find("li").slice(0,optIndex + 1).find(".div-contain").length;
				menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding;
				menu.css({
					"max-height" : menuHeight + "px",
					"overflow-y" : "auto"
				});
				//menu.css({"overflow-y" : "auto"});
			}

			//Set width of select
			if (this.options.width == "auto") {
				this.$newElement.find(".dropdown-menu").css("min-width", 0);
				var ulWidth = this.$newElement.find(".dropdown-menu").css("width");
				this.$newElement.css("width", ulWidth);

				if (this.options.container) {
					this.$element.css("width", ulWidth);
				}
			} else if (this.options.width) {
				if (this.options.container) {
					// Note: options.width can be %
					this.$element.css("width", this.options.width);

					// Set pixel width of $newElement based on $element's pixel width
					this.$newElement.width(this.$element.outerWidth());
				} else {
					this.$newElement.css("width", this.options.width);
				}
			} else if (this.options.container) {
				// Set width of $newElement based on $element
				this.$newElement.width(this.$element.outerWidth());
			}
		},

		selectPosition: function() {
			var containerOffset = $(this.options.container).offset();
			var eltOffset = this.$element.offset();

			if (containerOffset && eltOffset) {
				var selectElementTop = eltOffset.top - containerOffset.top;
				var selectElementLeft = eltOffset.left - containerOffset.left;
				this.$newElement.appendTo(this.options.container);
				this.$newElement.css({
					"position" : "absolute",
					"top" : selectElementTop + "px",
					"left" : selectElementLeft + "px"
				});
			}
		},

		refresh: function() {
			this.reloadLi();
			this.render();
			this.setSize();
			this.checkDisabled();

			if (this.options.container) {
				this.selectPosition();
			}
		},

		setSelected: function(index, selected) {
			if (selected) {
				this.$newElement.find("li").eq(index).addClass("selected");
			} else {
				this.$newElement.find("li").eq(index).removeClass("selected");
			}
		},

		setDisabled: function(index, disabled) {
			if (disabled) {
				this.$newElement.find("li").eq(index).addClass("disabled").find("a").attr("href", "#").attr("tabindex", -1);
			} else {
				this.$newElement.find("li").eq(index).removeClass("disabled").find("a").removeAttr("href").attr("tabindex", 0);
			}
		},

		isDisabled: function() {
				return this.$element.is(":disabled") || this.$element.attr("readonly");
		},

		checkDisabled: function() {
			if (this.isDisabled()) {
				this.button.addClass("disabled");

				this.button.click(function(e) {
					e.preventDefault();
				});

				this.button.attr("tabindex", -1);
			} else if (!this.isDisabled() && this.button.hasClass("disabled")) {
				this.button.removeClass("disabled");

				this.button.click(function() {
					return true;
				});

				this.button.removeAttr("tabindex");
			}
		},

		checkTabIndex: function() {
			if (this.$element.is("[tabindex]")) {
				var tabindex = this.$element.attr("tabindex");
				this.button.attr("tabindex", tabindex);
			}
		},

		clickListener: function() {
			var _this = this;

			$("body").on("touchstart.dropdown", ".dropdown-menu", function (e) {
				e.stopPropagation();
			});

			this.$newElement.on("click", "li a", function(e){
				var clickedIndex = $(this).parent().index(),
					$this = $(this).parent(),
					$select = $this.parents(".bootstrap-select"),
					prevValue = _this.$element.val();

				//Dont close on multi choice menu
				if (_this.multiple) {
					e.stopPropagation();
				}

				e.preventDefault();

				//Dont run if we have been disabled
				if (_this.$element.not(":disabled") && !$(this).parent().hasClass("disabled")) {
					//Deselect all others if not multi select box
					if (!_this.multiple) {
						_this.$element.find("option").prop("selected", false);
						_this.$element.find("option").eq(clickedIndex).prop("selected", true);
					}
					//Else toggle the one we have chosen if we are multi select.
					else {
						var selected = _this.$element.find("option").eq(clickedIndex).prop("selected");

						if (selected) {
							_this.$element.find("option").eq(clickedIndex).prop("selected", false);
						} else {
							_this.$element.find("option").eq(clickedIndex).prop("selected", true);
						}
					}


					$select.find(".filter-option").html($this.text());
					$select.find("button").focus();

					// Trigger select "change"
					if (prevValue != _this.$element.val()) {
						_this.$element.trigger("change");
					}

					_this.render();
				}

			});

		   this.$newElement.on("click", "li.disabled a, li dt, li .div-contain", function(e) {
				e.preventDefault();
				e.stopPropagation();
				var $select = $(this).parent().parents(".bootstrap-select");
				$select.find("button").focus();
			});

			this.$element.on("change", function() {
				_this.render();
			});
		},

		val: function(value) {

			if (value !== undefined) {
				this.$element.val( value );
				this.$element.trigger("change");
				return this.$element;
			} else {
				return this.$element.val();
			}
		},

		selectAll: function() {
			this.$element.find("option").prop("selected", true).attr("selected", "selected");
			this.render();
		},

		deselectAll: function() {
			this.$element.find("option").prop("selected", false).removeAttr("selected");
			this.render();
		},

		keydown: function (e) {
			var $this,
				$items,
				$parent,
				index,
				next,
				first,
				last,
				prev,
				nextPrev;

			$this = $(this);

			$parent = $this.parent();

			$items = $("[role=menu] li:not(.divider):visible a", $parent);

			if (!$items.length) return;

			if (/(38|40)/.test(e.keyCode)) {

				index = $items.index($items.filter(":focus"));

				first = $items.parent(":not(.disabled)").first().index();
				last = $items.parent(":not(.disabled)").last().index();
				next = $items.eq(index).parent().nextAll(":not(.disabled)").eq(0).index();
				prev = $items.eq(index).parent().prevAll(":not(.disabled)").eq(0).index();
				nextPrev = $items.eq(next).parent().prevAll(":not(.disabled)").eq(0).index();

				if (e.keyCode == 38) {
					if (index != nextPrev && index > prev) index = prev;
					if (index < first) index = first;
				}

				if (e.keyCode == 40) {
					if (index != nextPrev && index < next) index = next;
					if (index > last) index = last;
				}

				$items.eq(index).focus();
			} else {
				var keyCodeMap = {
					48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8", 57:"9", 59:";",
					65:"a", 66:"b", 67:"c", 68:"d", 69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l",
					77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z",
					96:"0", 97:"1", 98:"2", 99:"3", 100:"4", 101:"5", 102:"6", 103:"7", 104:"8", 105:"9"
				};

				var keyIndex = [];

				$items.each(function() {
					if ($(this).parent().is(":not(.disabled)")) {
						if ($.trim($(this).text().toLowerCase()).slice(0, 1) === keyCodeMap[e.keyCode]) {
							keyIndex.push($(this).parent().index());
						}
					}
				});

				var count = $(document).data("keycount");
				count++;
				$(document).data("keycount", count);

				var prevKey = $.trim($(":focus").text().toLowerCase()).slice(0, 1);

				if (prevKey != keyCodeMap[e.keyCode]) {
					count = 1;
					$(document).data("keycount", count);
				} else if (count >= keyIndex.length) {
					$(document).data("keycount", 0);
				}

				$items.eq(keyIndex[count - 1]).focus();
			}

			if (/(13)/.test(e.keyCode)) {
				$(":focus").click();
				$parent.addClass("open");
				$(document).data("keycount", 0);
			}
		}
	};

	$.fn.selectpicker = function(option, event) {
	   //get the args of the outer function..
	   var args = arguments;
	   var value;
	   var chain = this.each(function () {
			if ($(this).is("select")) {
				var $this = $(this),
					data = $this.data("selectpicker"),
					options = typeof option === "object" && option;

				if (!data) {
					$this.data("selectpicker", (data = new Selectpicker(this, options, event)));
				} else if (options){
					for (var i in options) {
					   data.options[i]=options[i];
					}
				}

				if (typeof option == "string") {
					//Copy the value of option, as once we shift the arguments
					//it also shifts the value of option.
					var property = option;

					if (data[property] instanceof Function) {
						[].shift.apply(args);
						value = data[property].apply(data, args);
					} else {
						value = data.options[property];
					}
				}
			}
		});

		if (value !== undefined) {
			return value;
		} else {
			return chain;
		}
	};

	$.fn.selectpicker.defaults = {
		style: null,
		size: "auto",
		title: null,
		selectedTextFormat : "values",
		noneSelectedText : "Nothing selected",
		width: null,
		container: false,
		hideDisabled: false,
		showSubtext: false
	};

	$(document)
		.data("keycount", 0)
		.on("keydown", "[data-toggle=dropdown], [role=menu]" , Selectpicker.prototype.keydown);

})(window.jQuery);
$(document).ready(function(){
	"use strict";
	$("#bostad_multiselect .selectpicker").selectpicker({
		size: "auto"
	});
});
/*!** End file: bootstrap-select.js ***/
/*!** Begin file: flowplayer.min.js ***/
/*!

   Flowplayer Commercial v5.4.3 (Wednesday, 05. June 2013 11:10AM) | flowplayer.org/license

*/
!function(e){function n(n,t){var o="obj"+(""+Math.random()).slice(2,15),r='<object class="fp-engine" id="'+o+'" name="'+o+'" ';r+=e.browser.msie?'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">':' data="'+n+'" type="application/x-shockwave-flash">';var i={width:"100%",height:"100%",allowscriptaccess:"always",wmode:"transparent",quality:"high",flashvars:"",movie:n+(e.browser.msie?"?"+o:""),name:o};return e.each(t,function(e,n){i.flashvars+=e+"="+n+"&"}),e.each(i,function(e,n){r+='<param name="'+e+'" value="'+n+'"/>'}),r+="</object>",e(r)}function t(e){return Math.round(100*e)/100}function o(e){return/mpegurl/i.test(e)?"application/x-mpegurl":"video/"+e}function r(e){return/^(video|application)/.test(e)||(e=o(e)),!!g.canPlayType(e).replace("no","")}function i(n,t){var o=e.grep(n,function(e){return e.type===t});return o.length?o[0]:null}function a(e){var n=e.attr("src"),t=e.attr("type")||"",o=n.split(b)[1];return t=/mpegurl/.test(t)?"mpegurl":t.replace("video/",""),{src:n,suffix:o||t,type:t||o}}function s(n){var t=this,o=[];e("source",n).each(function(){o.push(a(e(this)))}),o.length||o.push(a(n)),t.initialSources=o,t.resolve=function(n){return n?(e.isArray(n)?n={sources:e.map(n,function(n){var t,o=e.extend({},n);return e.each(n,function(e){t=e}),o.type=t,o.src=n[t],delete o[t],o})}:"string"==typeof n&&(n={src:n,sources:[]},e.each(o,function(e,t){"flash"!=t.type&&n.sources.push({type:t.type,src:n.src.replace(b,"."+t.suffix+"$2")})})),n):{sources:o}}}function l(e){return e=parseInt(e,10),e>=10?e:"0"+e}function c(e){e=e||0;var n=Math.floor(e/3600),t=Math.floor(e/60);return e-=60*t,n>=1?(t-=60*n,n+":"+l(t)+":"+l(e)):l(t)+":"+l(e)}!function(e){if(!e.browser){var n=e.browser={},t=navigator.userAgent.toLowerCase(),o=/(chrome)[ \/]([\w.]+)/.exec(t)||/(safari)[ \/]([\w.]+)/.exec(t)||/(webkit)[ \/]([\w.]+)/.exec(t)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(t)||/(msie) ([\w.]+)/.exec(t)||t.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(t)||[];o[1]&&(n[o[1]]=!0,n.version=o[2]||"0")}}(jQuery),e(function(){"function"==typeof e.fn.flowplayer&&e("video").parent(".flowplayer").flowplayer()});var d=[],u=[],f=window.navigator.userAgent;window.flowplayer=function(n){return e.isFunction(n)?u.push(n):"number"==typeof n||void 0===n?d[n||0]:e(n).data("flowplayer")},e(window).on("beforeunload",function(){e.each(d,function(n,t){t.conf.splash?t.unload():t.bind("error",function(){e(".flowplayer.is-error .fp-message").remove()})})}),e.extend(flowplayer,{version:"5.4.3",engine:{},conf:{},support:{},defaults:{debug:!1,disabled:!1,engine:"html5",fullscreen:window==window.top,keyboard:!0,ratio:9/16,adaptiveRatio:!1,flashfit:!1,rtmp:0,splash:!1,swf:"//releases.flowplayer.org/5.4.3/commercial/flowplayer.swf",speeds:[.25,.5,1,1.5,2],tooltip:!0,volume:"object"!=typeof localStorage?1:"true"==localStorage.muted?0:isNaN(localStorage.volume)?1:localStorage.volume||1,errors:["","Video loading aborted","Network error","Video not properly encoded","Video file not found","Unsupported video","Skin not found","SWF file not found","Subtitles not found","Invalid RTMP URL","Unsupported video format. Try installing Adobe Flash."],errorUrls:["","","","","","","","","","","http://get.adobe.com/flashplayer/"],playlist:[]}});var p=1;e.fn.flowplayer=function(n,t){return"string"==typeof n&&(n={swf:n}),e.isFunction(n)&&(t=n,n={}),!n&&this.data("flowplayer")||this.each(function(){var o,r,i=e(this).addClass("is-loading"),a=e.extend({},flowplayer.defaults,flowplayer.conf,n,i.data()),l=e("video",i).addClass("fp-engine").removeAttr("controls"),c=l.length?new s(l):null,f={};if(a.playlist.length){var m,g=l.attr("preload");l.length&&l.replaceWith(m=e("<p />")),l=e("<video />").addClass("fp-engine"),m?m.replaceWith(l):i.prepend(l),l.attr("preload",g),"string"==typeof a.playlist[0]?l.attr("src",a.playlist[0]):e.each(a.playlist[0],function(n,t){for(var o in t)t.hasOwnProperty(o)&&l.append(e("<source />").attr({type:"video/"+o,src:t[o]}))}),c=new s(l)}var v=i.data("flowplayer");v&&v.unload(),i.data("fp-player_id",i.data("fp-player_id")||p++);try{f=window.localStorage||f}catch(h){}var b=this.currentStyle&&"rtl"===this.currentStyle.direction||window.getComputedStyle&&"rtl"===window.getComputedStyle(this,null).getPropertyValue("direction");b&&i.addClass("is-rtl");var y=v||{conf:a,currentSpeed:1,volumeLevel:"undefined"==typeof a.volume?1*f.volume:a.volume,video:{},disabled:!1,finished:!1,loading:!1,muted:"true"==f.muted||a.muted,paused:!1,playing:!1,ready:!1,splash:!1,rtl:b,load:function(n,t){if(!(y.error||y.loading||y.disabled)){if(n=c.resolve(n),e.extend(n,r.pick(n.sources)),n.src){var o=e.Event("load");i.trigger(o,[y,n,r]),o.isDefaultPrevented()?y.loading=!1:(r.load(n),e.isFunction(n)&&(t=n),t&&i.one("ready",t))}return y}},pause:function(e){return!y.ready||y.seeking||y.disabled||y.loading||(r.pause(),y.one("pause",e)),y},resume:function(){return y.ready&&y.paused&&!y.disabled&&(r.resume(),y.finished&&(y.trigger("resume"),y.finished=!1)),y},toggle:function(){return y.ready?y.paused?y.resume():y.pause():y.load()},seek:function(n,t){if(y.ready){if("boolean"==typeof n){var a=.1*y.video.duration;n=y.video.time+(n?a:-a)}n=o=Math.min(Math.max(n,0),y.video.duration).toFixed(1);var s=e.Event("beforeseek");i.trigger(s,[y,n]),s.isDefaultPrevented()?(y.seeking=!1,i.toggleClass("is-seeking",y.seeking)):(r.seek(n),e.isFunction(t)&&i.one("seek",t))}return y},seekTo:function(e,n){var t=void 0===e?o:.1*y.video.duration*e;return y.seek(t,n)},mute:function(e){return void 0===e&&(e=!y.muted),f.muted=y.muted=e,f.volume=isNaN(f.volume)?a.volume:f.volume,y.volume(e?0:f.volume,!0),y.trigger("mute",e),y},volume:function(e,n){return y.ready&&(e=Math.min(Math.max(e,0),1),n||(f.volume=e),r.volume(e)),y},speed:function(n,t){return y.ready&&("boolean"==typeof n&&(n=a.speeds[e.inArray(y.currentSpeed,a.speeds)+(n?1:-1)]||y.currentSpeed),r.speed(n),t&&i.one("speed",t)),y},stop:function(){return y.ready&&(y.pause(),y.seek(0,function(){i.trigger("stop")})),y},unload:function(){return i.hasClass("is-embedding")||(a.splash?(y.trigger("unload"),r.unload()):y.stop()),y},disable:function(e){return void 0===e&&(e=!y.disabled),e!=y.disabled&&(y.disabled=e,y.trigger("disable",e)),y}};y.conf=e.extend(y.conf,a),e.each(["bind","one","unbind"],function(e,n){y[n]=function(e,t){return i[n](e,t),y}}),y.trigger=function(e,n){return i.trigger(e,[y,n]),y},i.data("flowplayer")||i.bind("boot",function(){return e.each(["autoplay","loop","preload","poster"],function(e,n){var t=l.attr(n);void 0!==t&&(a[n]=t?t:!0)}),(a.splash||i.hasClass("is-splash")||!flowplayer.support.firstframe)&&(y.forcedSplash=!a.splash&&!i.hasClass("is-splash"),y.splash=a.splash=a.autoplay=!0,i.addClass("is-splash"),l.attr("preload","none")),e.each(u,function(){this(y,i)}),r=flowplayer.engine[a.engine],r&&(r=r(y,i)),r.pick(c.initialSources)?y.engine=a.engine:e.each(flowplayer.engine,function(e){return e!=a.engine?(r=this(y,i),r.pick(c.initialSources)&&(y.engine=e),!1):void 0}),d.push(y),y.engine?(a.splash?y.unload():y.load(),a.disabled&&y.disable(),r.volume(y.volumeLevel),i.one("ready",t),void 0):y.trigger("error",{code:flowplayer.support.flashVideo?5:10})}).bind("load",function(n,t){a.splash&&e(".flowplayer").filter(".is-ready, .is-loading").not(i).each(function(){var n=e(this).data("flowplayer");n.conf.splash&&n.unload()}),i.addClass("is-loading"),t.loading=!0}).bind("ready",function(e,n,t){function o(){i.removeClass("is-loading"),n.loading=!1}t.time=0,n.video=t,a.splash?i.one("progress",o):o(),n.muted?n.mute(!0):n.volume(n.volumeLevel)}).bind("unload",function(){a.splash&&l.remove(),i.removeClass("is-loading"),y.loading=!1}).bind("ready unload",function(e){var n="ready"==e.type;i.toggleClass("is-splash",!n).toggleClass("is-ready",n),y.ready=n,y.splash=!n}).bind("progress",function(e,n,t){n.video.time=t}).bind("speed",function(e,n,t){n.currentSpeed=t}).bind("volume",function(e,n,t){n.volumeLevel=Math.round(100*t)/100,n.muted?t&&n.mute(!1):f.volume=t}).bind("beforeseek seek",function(e){y.seeking="beforeseek"==e.type,i.toggleClass("is-seeking",y.seeking)}).bind("ready pause resume unload finish stop",function(e,n,t){y.paused=/pause|finish|unload|stop/.test(e.type),"ready"==e.type&&(y.paused="none"==a.preload,t&&(y.paused=!t.duration||!a.autoplay&&"none"!=a.preload)),y.playing=!y.paused,i.toggleClass("is-paused",y.paused).toggleClass("is-playing",y.playing),y.load.ed||y.pause()}).bind("finish",function(){y.finished=!0}).bind("error",function(){l.remove()}),i.trigger("boot",[y,i]).data("flowplayer",y)})},!function(){var n=function(e){var n=/Version\/(\d\.\d)/.exec(e);return n&&n.length>1?parseFloat(n[1],10):0},t=flowplayer.support,o=e.browser,r=e("<video loop autoplay preload/>")[0],i=o.msie,a=navigator.userAgent,s=/iPad|MeeGo/.test(a)&&!/CriOS/.test(a),l=/iPad/.test(a)&&/CriOS/.test(a),c=/iP(hone|od)/i.test(a)&&!/iPad/.test(a),d=/Android/.test(a)&&!/Firefox/.test(a),u=/Android/.test(a)&&/Firefox/.test(a),f=/Silk/.test(a),p=/IEMobile/.test(a),m=(s?n(a):0,d?parseFloat(/Android\ (\d\.\d)/.exec(a)[1],10):0);e.extend(t,{subtitles:!!r.addTextTrack,fullscreen:!d&&("function"==typeof document.webkitCancelFullScreen&&!/Mac OS X 10_5.+Version\/5\.0\.\d Safari/.test(a)||document.mozFullScreenEnabled||"function"==typeof document.exitFullscreen),inlineBlock:!(i&&o.version<8),touch:"ontouchstart"in window,dataload:!s&&!c&&!p,zeropreload:!i&&!d,volume:!(s||d||c||f||l),cachedVideoTag:!(s||c||l||p),firstframe:!(c||s||d||f||l||p||u),inlineVideo:!c&&!f&&!p&&(!d||m>=3),hlsDuration:!o.safari||s||c||l,seekable:!s&&!l});try{var g=i?new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version"):navigator.plugins["Shockwave Flash"].description;g=g.split(/\D+/),g.length&&!g[0]&&(g=g.slice(1)),t.flashVideo=g[0]>9||9==g[0]&&g[3]>=115}catch(v){}try{t.video=!!r.canPlayType,t.video&&r.canPlayType("video/mp4")}catch(h){t.video=!1}t.animation=function(){for(var n=["","Webkit","Moz","O","ms","Khtml"],t=e("<p/>")[0],o=0;o<n.length;o++)if("undefined"!==t.style[n[o]+"AnimationName"])return!0}()}(),window.attachEvent&&window.attachEvent("onbeforeunload",function(){__flash_savedUnloadHandler=__flash_unloadHandler=function(){}}),flowplayer.engine.flash=function(t,o){var r,i,a,s=t.conf;t.video;var l={pick:function(n){if(flowplayer.support.flashVideo){var t=e.grep(n,function(e){return"flash"==e.type})[0];if(t)return t;for(var o,r=0;r<n.length;r++)if(o=n[r],/mp4|flv/.test(o.type))return o}},load:function(l){function c(e){return e.replace(/&amp;/g,"%26").replace(/&/g,"%26").replace(/=/g,"%3D")}var d=e("video",o),u=c(l.src);if(is_absolute=/^https?:/.test(u),d.length>0&&flowplayer.support.video&&d[0].pause(),d.remove(),is_absolute||s.rtmp||(u=e("<img/>").attr("src",u)[0].src),a)a.__play(u);else{r="fp"+(""+Math.random()).slice(3,15);var f={hostname:s.embedded?s.hostname:location.hostname,url:u,callback:"jQuery."+r};o.data("origin")&&(f.origin=o.data("origin")),is_absolute&&delete s.rtmp,e.each(["key","autoplay","preload","rtmp","loop","debug","preload","splash"],function(e,n){s[n]&&(f[n]=s[n])}),f.rtmp&&(f.rtmp=c(f.rtmp)),i=n(s.swf,f),i.prependTo(o),a=i[0],setTimeout(function(){try{if(!a.PercentLoaded())return o.trigger("error",[t,{code:7,url:s.swf}])}catch(e){}},5e3),e[r]=function(n,o){s.debug&&"status"!=n&&console.log("--",n,o);var r=e.Event(n);switch(n){case"ready":o=e.extend(l,o);break;case"click":r.flash=!0;break;case"keydown":r.which=o;break;case"seek":l.time=o;break;case"buffered":l.buffered=!0;break;case"status":t.trigger("progress",o.time),o.buffer<=l.bytes&&!l.buffered?(l.buffer=o.buffer/l.bytes*l.duration,t.trigger("buffer",l.buffer)):l.buffered&&t.trigger("buffered")}setTimeout(function(){t.trigger(r,o)},1)}}},speed:e.noop,unload:function(){a&&a.__unload&&a.__unload(),delete e[r],e("object",o).remove(),a=0}};e.each("pause,resume,seek,volume".split(","),function(e,n){l[n]=function(e){t.ready&&("seek"==n&&t.video.time&&!t.paused&&t.trigger("beforeseek"),void 0===e?a["__"+n]():a["__"+n](e))}});var c=e(window);return t.bind("ready fullscreen fullscreen-exit",function(n){var r=o.height(),i=o.width();if(t.conf.flashfit||/full/.test(n.type)){var a,s,l=t.isFullscreen,d=l&&F,u=!flowplayer.support.inlineBlock,f=l?d?screen.availWidth:c.width():i,p=l?d?screen.availHeight:c.height():r,m=d?screen.width-screen.availWidth:0,g=d?screen.height-screen.availHeight:0,v=u?i:"",h=u?r:"";(t.conf.flashfit||"fullscreen"===n.type)&&(a=t.video.width/t.video.height,s=t.video.height/t.video.width,h=Math.max(s*f),v=Math.max(a*p),h=h>p?v*s:h,h=Math.min(Math.round(h),p),v=v>f?h*a:v,v=Math.min(Math.round(v),f),g=Math.max(Math.round((p+g-h)/2),0),m=Math.max(Math.round((f+m-v)/2),0)),e("object",o).css({width:v,height:h,marginTop:g,marginLeft:m})}}),l};var m,g=e("<video/>")[0],v={ended:"finish",pause:"pause",play:"resume",progress:"buffer",timeupdate:"progress",volumechange:"volume",ratechange:"speed",seeked:"seek",loadeddata:"ready",error:"error",dataunavailable:"error"},h=function(n){return m?m.attr({type:o(n.type),src:n.src}):m=e("<video/>",{src:n.src,type:o(n.type),"class":"fp-engine",autoplay:"autoplay",preload:"none","x-webkit-airplay":"allow"})};flowplayer.engine.html5=function(n,o){function a(i,a,s){i.listeners&&i.listeners.hasOwnProperty(o.data("fp-player_id"))||((i.listeners||(i.listeners={}))[o.data("fp-player_id")]=!0,a.bind("error",function(t){try{if(t.originalEvent&&e(t.originalEvent.originalTarget).is("img"))return t.preventDefault();r(e(t.target).attr("type"))&&n.trigger("error",{code:4})}catch(o){}}),e.each(v,function(r,a){i.addEventListener(r,function(c){if("progress"==a&&c.srcElement&&0===c.srcElement.readyState&&setTimeout(function(){n.video.duration||(a="error",n.trigger(a,{code:4}))},1e4),p.debug&&!/progress/.test(a)&&console.log(r,"->",a,c),(n.ready||/ready|error/.test(a))&&a&&e("video",o).length){var d,f=e.Event(a);switch(a){case"ready":d=e.extend(s,{duration:i.duration,width:i.videoWidth,height:i.videoHeight,url:i.currentSrc,src:i.currentSrc});try{d.seekable=i.seekable&&i.seekable.end(null)}catch(m){}if(l=l||setInterval(function(){try{d.buffer=i.buffered.end(null)}catch(e){}d.buffer&&(d.buffer<=d.duration&&!d.buffered?n.trigger("buffer",c):d.buffered||(d.buffered=!0,n.trigger("buffer",c).trigger("buffered",c),clearInterval(l),l=0))},250),!d.duration&&!u.hlsDuration&&"loadeddata"===r){var g=function(){d.duration=i.duration;try{d.seekable=i.seekable&&i.seekable.end(null)}catch(e){}n.trigger(f,d),i.removeEventListener("durationchange",g)};return i.addEventListener("durationchange",g),void 0}break;case"progress":case"seek":if(n.video.duration,i.currentTime>0){d=Math.max(i.currentTime,0);break}if("progress"==a)return;case"speed":d=t(i.playbackRate);break;case"volume":d=t(i.volume);break;case"error":try{d=(c.srcElement||c.originalTarget).error}catch(v){return}}n.trigger(f,d)}},!1)}))}var s,l,c,d=e("video",o),u=flowplayer.support,f=e("track",d),p=n.conf;return s={pick:function(e){if(u.video){if(p.videoTypePreference){var n=i(e,p.videoTypePreference);if(n)return n}for(var t=0;t<e.length;t++)if(r(e[t].type))return e[t]}},load:function(t){if(p.splash&&!c)d=h(t).prependTo(o),u.inlineVideo||d.css({position:"absolute",top:"-9999em"}),f.length&&d.append(f.attr("default","")),p.loop&&d.attr("loop","loop"),c=d[0];else{c=d[0];var r=d.find("source");!c.src&&r.length&&(c.src=t.src,r.remove()),n.video.src&&t.src!=n.video.src?(d.attr("autoplay","autoplay"),c.src=t.src):"none"!=p.preload&&u.dataload||(u.zeropreload?n.trigger("ready",t).trigger("pause").one("ready",function(){o.trigger("resume")}):n.one("ready",function(){o.trigger("pause")}))}a(c,e("source",d).add(d),t),"none"==p.preload&&u.zeropreload&&u.dataload||c.load(),p.splash&&c.load()},pause:function(){c.pause()},resume:function(){c.play()},speed:function(e){c.playbackRate=e},seek:function(e){try{var t=n.paused;c.currentTime=e,t&&c.pause()}catch(o){}},volume:function(e){c.volume=e},unload:function(){e("video.fp-engine",o).remove(),u.cachedVideoTag||(m=null),l=clearInterval(l),c=0}}};var b=/\.(\w{3,4})(\?.*)?$/i;e.throttle=function(e,n){var t;return function(){t||(e.apply(this,arguments),t=1,setTimeout(function(){t=0},n))}},e.fn.slider2=function(n){var t=/iPad/.test(navigator.userAgent)&&!/CriOS/.test(navigator.userAgent);return this.each(function(){var o,r,i,a,s,l,c,d,u=e(this),f=e(document),p=u.children(":last"),m=!1,g=function(){r=u.offset(),i=u.width(),a=u.height(),l=s?a:i,d=y(c)},v=function(e){o||e==w.value||c&&!(c>e)||(u.trigger("slide",[e]),w.value=e)},h=function(e){var t=e.pageX;!t&&e.originalEvent&&e.originalEvent.touches&&e.originalEvent.touches.length&&(t=e.originalEvent.touches[0].pageX);var o=s?e.pageY-r.top:t-r.left;o=Math.max(0,Math.min(d||l,o));var i=o/l;return s&&(i=1-i),n&&(i=1-i),b(i,0,!0)},b=function(e,n){void 0===n&&(n=0),e>1&&(e=1);var o=Math.round(1e3*e)/10+"%";return(!c||c>=e)&&(t||p.stop(),m?p.css("width",o):p.animate(s?{height:o}:{width:o},n,"linear")),e},y=function(e){return Math.max(0,Math.min(l,s?(1-e)*a:e*i))},w={max:function(e){c=e},disable:function(e){o=e},slide:function(e,n,t){g(),t&&v(e),b(e,n)},disableAnimation:function(e){m=e!==!1}};g(),u.data("api",w).bind("mousedown.sld touchstart",function(n){if(n.preventDefault(),!o){var t=e.throttle(v,100);g(),w.dragging=!0,u.addClass("is-dragging"),v(h(n)),f.bind("mousemove.sld touchmove",function(e){e.preventDefault(),t(h(e))}).one("mouseup touchend",function(){w.dragging=!1,u.removeClass("is-dragging"),f.unbind("mousemove.sld touchmove")})}})})},flowplayer(function(n,t){function o(n){return e(".fp-"+n,t)}function r(n){("0px"===t.css("width")||"0px"===t.css("height")||n!==flowplayer.defaults.ratio)&&(parseInt(b,10)||g.css("paddingTop",100*n+"%")),l.inlineBlock||e("object",t).height(t.height())}function i(e){t.toggleClass("is-mouseover",e).toggleClass("is-mouseout",!e)}var a,s=n.conf,l=flowplayer.support;t.find(".fp-ratio,.fp-ui").remove(),t.addClass("flowplayer").append('      <div class="ratio"/>      <div class="ui">         <div class="waiting"><em/><em/><em/></div>         <a class="fullscreen"/>         <a class="unload"/>         <p class="speed"/>         <div class="controls">            <a class="play"></a>            <div class="timeline">               <div class="buffer"/>               <div class="progress"/>            </div>            <div class="volume">               <a class="mute"></a>               <div class="volumeslider">                  <div class="volumelevel"/>               </div>            </div>         </div>         <div class="time">            <em class="elapsed">00:00</em>            <em class="remaining"/>            <em class="duration">00:00</em>         </div>         <div class="message"><h2/><p/></div>      </div>'.replace(/class="/g,'class="fp-'));var d=o("progress"),u=o("buffer"),f=o("elapsed"),p=o("remaining"),m=o("waiting"),g=o("ratio"),v=o("speed"),h=o("duration"),b=g.css("paddingTop"),y=o("timeline").slider2(n.rtl),w=y.data("api"),k=(o("volume"),o("fullscreen")),x=o("volumeslider").slider2(n.rtl),C=x.data("api"),T=t.is(".fixed-controls, .no-toggle");w.disableAnimation(t.hasClass("is-touch")),l.animation||m.html("<p>loading &hellip;</p>"),r(s.ratio);try{s.fullscreen||k.remove()}catch(S){k.remove()}n.bind("ready",function(){var e=n.video.duration;w.disable(n.disabled||!e),s.adaptiveRatio&&r(n.video.height/n.video.width),h.add(p).html(c(e)),e>=3600&&t.addClass("is-long")||t.removeClass("is-long"),C.slide(n.volumeLevel)}).bind("unload",function(){b||g.css("paddingTop","")}).bind("buffer",function(){var e=n.video,t=e.buffer/e.duration;!e.seekable&&l.seekable&&w.max(t),1>t?u.css("width",100*t+"%"):u.css({width:"100%"})}).bind("speed",function(e,n,t){v.text(t+"x").addClass("fp-hilite"),setTimeout(function(){v.removeClass("fp-hilite")},1e3)}).bind("buffered",function(){u.css({width:"100%"}),w.max(1)}).bind("progress",function(){var e=n.video.time,t=n.video.duration;w.dragging||w.slide(e/t,n.seeking?0:250),f.html(c(e)),p.html("-"+c(t-e))}).bind("finish resume seek",function(e){t.toggleClass("is-finished","finish"==e.type)}).bind("stop",function(){f.html(c(0)),w.slide(0,100)}).bind("finish",function(){f.html(c(n.video.duration)),w.slide(1,100),t.removeClass("is-seeking")}).bind("beforeseek",function(){d.stop()}).bind("volume",function(){C.slide(n.volumeLevel)}).bind("disable",function(){var e=n.disabled;w.disable(e),C.disable(e),t.toggleClass("is-disabled",n.disabled)}).bind("mute",function(e,n,o){t.toggleClass("is-muted",o)}).bind("error",function(n,o,r){if(t.removeClass("is-loading").addClass("is-error"),r){r.message=s.errors[r.code],o.error=!0;var i=e(".fp-message",t);e("h2",i).text((o.engine||"html5")+": "+r.message),e("p",i).text(r.url||o.video.url||o.video.src||s.errorUrls[r.code]),t.unbind("mouseenter click").removeClass("is-mouseover")}}).bind("mouseenter mouseleave",function(e){if(!T){var n,o="mouseenter"==e.type;i(o),o?(t.bind("pause.x mousemove.x volume.x",function(){i(!0),n=new Date}),a=setInterval(function(){new Date-n>5e3&&(i(!1),n=new Date)},100)):(t.unbind(".x"),clearInterval(a))}}).bind("mouseleave",function(){(w.dragging||C.dragging)&&t.addClass("is-mouseover").removeClass("is-mouseout")}).bind("click.player",function(t){return e(t.target).is(".fp-ui, .fp-engine")||t.flash?(t.preventDefault(),n.toggle()):void 0}),s.poster&&t.css("backgroundImage","url("+s.poster+")");var F=t.css("backgroundColor"),_="none"!=t.css("backgroundImage")||F&&"rgba(0, 0, 0, 0)"!=F&&"transparent"!=F;!_||s.splash||s.autoplay||n.bind("ready stop",function(){t.addClass("is-poster").one("progress",function(){t.removeClass("is-poster")})}),!_&&n.forcedSplash&&t.css("backgroundColor","#555"),e(".fp-toggle, .fp-play",t).click(n.toggle),e.each(["mute","fullscreen","unload"],function(e,t){o(t).click(function(){n[t]()})}),y.bind("slide",function(e,t){n.seeking=!0,n.seek(t*n.video.duration)}),x.bind("slide",function(e,t){n.volume(t)}),o("time").click(function(){e(this).toggleClass("is-inverted")}),i(T)});var y,w,k="is-help";e(document).bind("keydown.fp",function(n){var t=y,o=n.ctrlKey||n.metaKey||n.altKey,r=n.which,i=t&&t.conf;if(t&&i.keyboard&&!t.disabled){if(-1!=e.inArray(r,[63,187,191,219]))return w.toggleClass(k),!1;if(27==r&&w.hasClass(k))return w.toggleClass(k),!1;if(!o&&t.ready){if(n.preventDefault(),n.shiftKey)return 39==r?t.speed(!0):37==r&&t.speed(!1),void 0;if(58>r&&r>47)return t.seekTo(r-48);switch(r){case 38:case 75:t.volume(t.volumeLevel+.15);break;case 40:case 74:t.volume(t.volumeLevel-.15);break;case 39:case 76:t.seeking=!0,t.seek(!0);break;case 37:case 72:t.seeking=!0,t.seek(!1);break;case 190:t.seekTo();break;case 32:t.toggle();break;case 70:i.fullscreen&&t.fullscreen();break;case 77:t.mute();break;case 27:t[t.isFullscreen?"fullscreen":"unload"]()}}}}),flowplayer(function(n,t){n.conf.keyboard&&(t.bind("mouseenter mouseleave",function(e){y=n.disabled||"mouseenter"!=e.type?0:n,y&&(w=t)}),t.append('      <div class="fp-help">         <a class="fp-close"></a>         <div class="fp-help-section fp-help-basics">            <p><em>space</em>play / pause</p>            <p><em>esc</em>stop</p>            <p><em>f</em>fullscreen</p>            <p><em>shift</em> + <em>&#8592;</em><em>&#8594;</em>slower / faster <small>(latest Chrome and Safari)</small></p>         </div>         <div class="fp-help-section">            <p><em>&#8593;</em><em>&#8595;</em>volume</p>            <p><em>m</em>mute</p>         </div>         <div class="fp-help-section">            <p><em>&#8592;</em><em>&#8594;</em>seek</p>            <p><em>&nbsp;. </em>seek to previous            </p><p><em>1</em><em>2</em>&hellip;<em>6</em> seek to 10%, 20%, &hellip;60% </p>         </div>      </div>   '),n.conf.tooltip&&e(".fp-ui",t).attr("title","Hit ? for help").on("mouseout.tip",function(){e(this).removeAttr("title").off("mouseout.tip")}),e(".fp-close",t).click(function(){t.toggleClass(k)}))});var x,C=e.browser.mozilla?"moz":"webkit",T="fullscreen",S="fullscreen-exit",F=flowplayer.support.fullscreen,_="function"==typeof document.exitFullscreen,E=navigator.userAgent.toLowerCase(),M=/(safari)[ \/]([\w.]+)/.exec(E)&&!/(chrome)[ \/]([\w.]+)/.exec(E);e(document).bind(_?"fullscreenchange":C+"fullscreenchange",function(n){var t=e(document.webkitCurrentFullScreenElement||document.mozFullScreenElement||document.fullscreenElement||n.target);t.length&&!x?x=t.trigger(T,[t]):(x.trigger(S,[x]),x=null)}),flowplayer(function(n,t){if(n.conf.fullscreen){var o,r=e(window),i={pos:0,play:!1};n.isFullscreen=!1,n.fullscreen=function(e){return n.disabled?void 0:(void 0===e&&(e=!n.isFullscreen),e&&(o=r.scrollTop()),F?e?_?t[0].requestFullscreen():(t[0][C+"RequestFullScreen"](Element.ALLOW_KEYBOARD_INPUT),!M||document.webkitCurrentFullScreenElement||document.mozFullScreenElement||t[0][C+"RequestFullScreen"]()):_?document.exitFullscreen():document[C+"CancelFullScreen"]():("flash"===n.engine&&n.conf.rtmp&&(i={pos:n.video.time,play:n.playing}),n.trigger(e?T:S,[n])),n)};var a;t.bind("mousedown.fs",function(){+new Date-a<150&&n.ready&&n.fullscreen(),a=+new Date}),n.bind(T,function(){t.addClass("is-fullscreen"),n.isFullscreen=!0}).bind(S,function(){t.removeClass("is-fullscreen"),n.isFullscreen=!1,r.scrollTop(o)}).bind("ready",function(){i.pos&&!isNaN(i.pos)&&setTimeout(function(){n.play(),n.seek(i.pos),i.play||setTimeout(function(){n.pause()},100),i={pos:0,play:!1}},250)})}}),flowplayer(function(n,t){function o(){return e(i.query,t)}function r(){return e(i.query+"."+a,t)}var i=e.extend({active:"is-active",advance:!0,query:".fp-playlist a"},n.conf),a=i.active;n.play=function(t){return void 0===t?n.resume():"number"!=typeof t||n.conf.playlist[t]?("number"!=typeof t&&n.load.apply(null,arguments),n.unbind("resume.fromfirst"),n.video.index=t,n.load("string"==typeof n.conf.playlist[t]?n.conf.playlist[t].toString():e.map(n.conf.playlist[t],function(n){return e.extend({},n)})),n):n},n.next=function(e){e&&e.preventDefault();var t=n.video.index;return-1!=t&&(t=t===n.conf.playlist.length-1?0:t+1,n.play(t)),n},n.prev=function(e){e&&e.preventDefault();var t=n.video.index;return-1!=t&&(t=0===t?n.conf.playlist.length-1:t-1,n.play(t)),n},e(".fp-next",t).click(n.next),e(".fp-prev",t).click(n.prev),i.advance&&t.unbind("finish.pl").bind("finish.pl",function(e,n){var o=n.video.index+1;o<n.conf.playlist.length||i.loop?(o=o===n.conf.playlist.length?0:o,t.removeClass("is-finished"),setTimeout(function(){n.play(o)})):(t.addClass("is-playing"),n.conf.playlist.length>1&&n.one("resume.fromfirst",function(){return n.play(0),!1}))});var s=!1;if(n.conf.playlist.length){s=!0;var l=t.find(".fp-playlist");if(!l.length){l=e('<div class="fp-playlist"></div>');var c=e(".fp-next,.fp-prev",t).eq(0).before(l);c.length||e("video",t).after(l)}l.empty(),e.each(n.conf.playlist,function(n,t){var o;if("string"==typeof t)o=t;else for(var r in t[0])if(t[0].hasOwnProperty(r)){o=t[0][r];break}l.append(e("<a />").attr({href:o,"data-index":n}))})}if(o().length){s||(n.conf.playlist=[],o().each(function(){var t=e(this).attr("href");e(this).attr("data-index",n.conf.playlist.length),n.conf.playlist.push(t)})),t.on("click",i.query,function(t){t.preventDefault();var o=e(t.target).closest(i.query),r=Number(o.attr("data-index"));-1!=r&&n.play(r)});var d=o().filter("[data-cuepoints]").length;n.bind("load",function(o,i,s){var l=r().removeClass(a),c=l.attr("data-index"),u=s.index=n.video.index||0,f=e('a[data-index="'+u+'"]',t).addClass(a),p=u==n.conf.playlist.length-1;t.removeClass("video"+c).addClass("video"+u).toggleClass("last-video",p),s.index=i.video.index=u,s.is_last=i.video.is_last=p,d&&(n.cuepoints=f.data("cuepoints"))}).bind("unload.pl",function(){r().toggleClass(a)})}n.conf.playlist.length&&(n.conf.loop=!1)});var j=/ ?cue\d+ ?/;flowplayer(function(n,t){function o(e){t[0].className=t[0].className.replace(j," "),e>=0&&t.addClass("cue"+e)}var r=0;n.cuepoints=n.conf.cuepoints||[],n.bind("progress",function(e,i,a){if(r&&.015>a-r)return r=a;r=a;for(var s,l=n.cuepoints||[],c=0;c<l.length;c++)s=l[c],isNaN(s)||(s={time:s}),s.time<0&&(s.time=n.video.duration+s.time),s.index=c,Math.abs(s.time-a)<.125*n.currentSpeed&&(o(c),t.trigger("cuepoint",[n,s]))}).bind("unload seek",o),n.conf.generate_cuepoints&&n.bind("load",function(){e(".fp-cuepoint",t).remove()}).bind("ready",function(){var o=n.cuepoints||[],r=n.video.duration,i=e(".fp-timeline",t).css("overflow","visible");e.each(o,function(t,o){var a=o.time||o;0>a&&(a=r+o);var s=e("<a/>").addClass("fp-cuepoint fp-cuepoint"+t).css("left",100*(a/r)+"%");s.appendTo(i).mousedown(function(){return n.seek(a),!1})})})}),flowplayer(function(n,t){function o(e){var n=e.split(":");return 2==n.length&&n.unshift(0),60*60*n[0]+60*n[1]+parseFloat(n[2].replace(",","."))}var r=e("track",t),i=n.conf;if(!flowplayer.support.subtitles||(n.subtitles=r.length&&r[0].track,!i.nativesubtitles||"html5"!=i.engine)){r.remove();var a=/^(([0-9]{2}:)?[0-9]{2}:[0-9]{2}[,.]{1}[0-9]{3}) --\> (([0-9]{2}:)?[0-9]{2}:[0-9]{2}[,.]{1}[0-9]{3})(.*)/;n.subtitles=[];var s=r.attr("src");if(s){e.get(s,function(t){for(var r,i,s,l,c=0,d=t.split("\n"),u=d.length,f={};u>c;c++)if(i=a.exec(d[c])){for(r=d[c-1],s="<p>"+d[++c]+"</p><br/>";e.trim(d[++c])&&c<d.length;)s+="<p>"+d[c]+"</p><br/>";f={title:r,startTime:o(i[1]),endTime:o(i[2]||i[3]),text:s},l={time:f.startTime,subtitle:f},n.subtitles.push(f),n.cuepoints.push(l),n.cuepoints.push({time:f.endTime,subtitleEnd:r}),0===f.startTime&&n.trigger("cuepoint",l)}}).fail(function(){return n.trigger("error",{code:8,url:s}),!1});var l,c=e("<div class='fp-subtitle'/>",t).appendTo(t);n.bind("cuepoint",function(e,n,t){t.subtitle?(l=t.index,c.html(t.subtitle.text).addClass("fp-active")):t.subtitleEnd&&(c.removeClass("fp-active"),l=t.index)}).bind("seek",function(t,o,r){l&&n.cuepoints[l]&&n.cuepoints[l].time>r&&(c.removeClass("fp-active"),l=null),e.each(n.cuepoints||[],function(e,t){var o=t.subtitle;o&&l!=t.index?r>=t.time&&(!o.endTime||r<=o.endTime)&&n.trigger("cuepoint",t):t.subtitleEnd&&r>=t.time&&t.index==l+1&&n.trigger("cuepoint",t)})})}}}),flowplayer(function(n,t){function o(){if(i&&"undefined"!=typeof _gat){var e=_gat._getTracker(r),o=n.video;e._setAllowLinker(!0),e._trackEvent("Video / Seconds played",n.engine+"/"+o.type,t.attr("title")||o.src.split("/").slice(-1)[0].replace(b,""),Math.round(i/1e3)),i=0}}var r=n.conf.analytics,i=0,a=0;r&&("undefined"==typeof _gat&&e.getScript("//google-analytics.com/ga.js"),n.bind("load unload",o).bind("progress",function(){n.seeking||(i+=a?+new Date-a:0,a=+new Date)}).bind("pause",function(){a=0}),e(window).unload(o))});var A=/IEMobile/.test(f);(flowplayer.support.touch||A)&&flowplayer(function(n,t){var o=/Android/.test(f)&&!/Firefox/.test(f)&&!/Opera/.test(f),r=/Silk/.test(f);if(o){n.conf.videoTypePreference="mp4";var i=n.load;n.load=function(){var e=i.apply(n,arguments);return n.trigger("ready",n,n.video),e}}flowplayer.support.volume||t.addClass("no-volume no-mute"),t.addClass("is-touch"),t.find(".fp-timeline").data("api").disableAnimation();var a=!1;t.bind("touchmove",function(){a=!0}).bind("touchend click",function(){return a?(a=!1,void 0):n.playing&&!t.hasClass("is-mouseover")?(t.addClass("is-mouseover").removeClass("is-mouseout"),!1):(n.paused&&t.hasClass("is-mouseout")&&n.toggle(),n.paused&&A&&e("video",t)[0].play(),void 0)}),n.conf.native_fullscreen&&(e.browser.webkit||e.browser.safari)&&(n.fullscreen=function(){var n=e("video",t);n[0].webkitEnterFullScreen(),n.one("webkitendfullscreen",function(){n.prop("controls",!0).prop("controls",!1)})}),(o||r)&&n.bind("ready",function(){var o=e("video",t);o.one("canplay",function(){o[0].play()}),o[0].play(),n.bind("progress.dur",function(){var r=o[0].duration;1!==r&&(n.video.duration=r,e(".fp-duration",t).html(c(r)),n.unbind("progress.dur"))})})}),flowplayer(function(n,t){if(n.conf.embed!==!1){var o=n.conf,r=e(".fp-ui",t),i=e("<a/>",{"class":"fp-embed",title:"Copy to your site"}).appendTo(r),a=e("<div/>",{"class":"fp-embed-code"}).append("<label>Paste this HTML code on your site to embed.</label><textarea/>").appendTo(r),s=e("textarea",a);n.embedCode=function(){var r=n.video,i=r.width||t.width(),a=r.height||t.height(),s=e("<div/>",{"class":"flowplayer",css:{width:i,height:a}}),l=e("<video/>").appendTo(s);
e.each(["origin","analytics","logo","key","rtmp"],function(e,n){o[n]&&s.attr("data-"+n,o[n])}),e.each(r.sources,function(n,t){l.append(e("<source/>",{type:"video/"+t.type,src:t.src}))});var c={src:"//embed.flowplayer.org/5.4.3/embed.min.js"};e.isPlainObject(o.embed)&&(c["data-swf"]=o.embed.swf,c["data-library"]=o.embed.library,c.src=o.embed.script||c.src,o.embed.skin&&(c["data-skin"]=o.embed.skin));var d=e("<foo/>",c).append(s);return e("<p/>").append(d).html().replace(/<(\/?)foo/g,"<$1script")},t.fptip(".fp-embed","is-embedding"),s.click(function(){this.select()}),i.click(function(){s.text(n.embedCode()),s[0].focus(),s[0].select()})}}),e.fn.fptip=function(n,t){return this.each(function(){function o(){r.removeClass(t),e(document).unbind(".st")}var r=e(this);e(n||"a",this).click(function(n){n.preventDefault(),r.toggleClass(t),r.hasClass(t)&&e(document).bind("keydown.st",function(e){27==e.which&&o()}).bind("click.st",function(n){e(n.target).parents("."+t).length||o()})})})}}(jQuery),flowplayer(function(e,n){function t(e){var n=i("<a/>")[0];return n.href=e,n.hostname}function o(e){var n="co.uk,org.uk,ltd.uk,plc.uk,me.uk,br.com,cn.com,eu.com,hu.com,no.com,qc.com,sa.comse.com,se.net,us.com,uy.com,co.ac,gv.ac,or.ac,ac.ac,ac.at,co.at,gv.at,or.atasn.au,com.au,edu.au,org.au,net.au,id.au,ac.be,adm.br,adv.br,am.br,arq.br,art.brbio.br,cng.br,cnt.br,com.br,ecn.br,eng.br,esp.br,etc.br,eti.br,fm.br,fot.br,fst.brg12.br,gov.br,ind.br,inf.br,jor.br,lel.br,med.br,mil.br,net.br,nom.br,ntr.brodo.br,org.br,ppg.br,pro.br,psc.br,psi.br,rec.br,slg.br,tmp.br,tur.br,tv.br,vet.brzlg.br,ab.ca,bc.ca,mb.ca,nb.ca,nf.ca,ns.ca,nt.ca,on.ca,pe.ca,qc.ca,sk.ca,yk.caac.cn,com.cn,edu.cn,gov.cn,org.cn,bj.cn,sh.cn,tj.cn,cq.cn,he.cn,nm.cn,ln.cnjl.cn,hl.cn,js.cn,zj.cn,ah.cn,gd.cn,gx.cn,hi.cn,sc.cn,gz.cn,yn.cn,xz.cn,sn.cngs.cn,qh.cn,nx.cn,xj.cn,tw.cn,hk.cn,mo.cn,com.ec,tm.fr,com.fr,asso.fr,presse.frco.il,net.il,ac.il,k12.il,gov.il,muni.il,ac.in,co.in,org.in,ernet.in,gov.innet.in,res.in,ac.jp,co.jp,go.jp,or.jp,ne.jp,ac.kr,co.kr,go.kr,ne.kr,nm.kr,or.krasso.mc,tm.mc,com.mm,org.mm,net.mm,edu.mm,gov.mm,org.ro,store.ro,tm.ro,firm.rowww.ro,arts.ro,rec.ro,info.ro,nom.ro,nt.ro,com.sg,org.sg,net.sg,gov.sg,ac.th,co.thgo.th,mi.th,net.th,or.th,com.tr,edu.tr,gov.tr,k12.tr,net.tr,org.tr,com.tw,org.twnet.tw,ac.uk,uk.com,uk.net,gb.com,gb.net,com.hk,org.hk,net.hk,edu.hk,eu.lv,co.nzorg.nz,net.nz,maori.nz,iwi.nz,com.pt,edu.pt,com.ve,net.ve,org.ve,web.ve,info.veco.ve,net.ru,org.ru,com.hr,tv.tr,com.qa,edu.qa,gov.qa,gov.au,com.my,edu.my,gov.myco.za,com.ar,com.pl,com.ua,biz.pl,biz.tr,co.gl,co.mg,co.ms,co.vi,co.za,com.agcom.ai,com.cy,com.de,com.do,com.es,com.fj,com.gl,com.gt,com.hu,com.kg,com.kicom.lc,com.mg,com.ms,com.mt,com.mu,com.mx,com.nf,com.ng,com.ni,com.pa,com.phcom.ro,com.ru,com.sb,com.sc,com.sv,de.com,de.org,firm.in,gen.in,idv.tw,ind.ininfo.pl,info.tr,kr.com,me.uk,net.ag,net.ai,net.cn,net.do,net.gl,net.kg,net.kinet.lc,net.mg,net.mu,net.ni,net.pl,net.sb,net.sc,nom.ni,off.ai,org.ag,org.aiorg.do,org.es,org.gl,org.kg,org.ki,org.lc,org.mg,org.ms,org.nf,org.ni,org.plorg.sb,org.sc,gov.tw".split(",");e=e.toLowerCase();var t=e.split("."),o=t.length;if(2>o)return e;var r=t.slice(-2).join(".");return o>=3&&i.inArray(r,n)>=0?t.slice(-3).join("."):r}function r(e,n){"localhost"==n||parseInt(n.split(".").slice(-1))||(n=o(n));for(var t=0,r=n.length-1;r>=0;r--)t+=2983723987*n.charCodeAt(r);for(t=(""+t).substring(0,7),r=0;r<e.length;r++)if(t===e[r].substring(1,8))return 1}var i=jQuery,a=e.conf,s=a.swf.indexOf("flowplayer.org")&&a.e&&n.data("origin"),l=s?t(s):location.hostname,c=a.key;if("file:"==location.protocol&&(l="localhost"),e.load.ed=1,a.hostname=l,a.origin=s||location.href,s&&n.addClass("is-embedded"),"string"==typeof c&&(c=c.split(/,\s*/)),c&&"function"==typeof r&&r(c,l))a.logo&&n.append(i("<a>",{"class":"fp-logo",href:s}).append(i("<img/>",{src:a.logo})));else{var d=i("<a/>").attr("href","http://flowplayer.org").appendTo(n);i(".fp-controls",n),e.bind("pause resume finish unload",function(e,n){var t=n.video.src?n.video.src.indexOf("://my.flowplayer.org"):-1;/pause|resume/.test(e.type)&&"flash"!=n.engine&&4!=t&&5!=t?(d.show().css({position:"absolute",left:16,bottom:36,zIndex:99999,width:100,height:20,backgroundImage:"url("+[".png","logo","/",".net",".cloudfront","d32wqyuo10o653","//"].reverse().join("")+")"}),n.load.ed=d.is(":visible"),n.load.ed||n.pause()):d.hide()})}});
/*!** End file: flowplayer.min.js ***/
/*!** End TMP_BUILDblocket_thirdparty_all.js package ***/
/*!** Begin blocket_common_all.js package ***/
/*!** Begin file: common.js ***/
jQuery.browser = {};
jQuery.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
/*
	* Initialize blocket top node, and set global wrappers.
	* IMPORTANT! -> This affects ALL js functions within the blocket namespace.
	*/
new inception("blocket");

blocket("@apps @common @campaigns").wrap(function() {
	try {
		return this.call();
	} catch(e) {
		if (typeof(blocket.params) != "undefined" && blocket.params.regress == 1) {
			// soon... alert(e.message);
		}
		if (e.fileName !== undefined) {
			console.log(e.fileName + ":" + e.lineNumber + ": " + e.message);
		} else {
			console.log("Caught exception: " + e.message);
		}
	}
});

/* Create init functionality for application level */

blocket("@init.base @init.clean @init.simple").extend(function() {
	var application = blocket.params.application;

	blocket.init.common();

	if (typeof(blocket.init[application]) === "function") {
		blocket.init[application]();
	}

	for (var key in blocket.init[application]) {
		if (typeof(blocket.init[application][key]) === "function") {
			blocket.init[application][key]();
		}
	}

	/* Execute campaigns */
	var func_arr = blocket.apps.common.campaigns[application];

	if (typeof func_arr !== "undefined") {
		for (var i = 0; i < func_arr.length; ++i) {
			if (typeof func_arr[i] === "function") {
				func_arr[i]();
			}
		}
	}
});



blocket("@init.common").extend(function() {

	// Clear No JavaScript cookie
	$.cookie("nojs", null, {path: "/", domain: document.domain})

	blocket.common.BrowserDetect.init();
	blocket.common.fix_next_image();

	/// Lazy load images
	if ((blocket.params.application == "view" && lazy_load_conf.vi_enabled == 1) ||
		(blocket.params.application == "list" && lazy_load_conf.li_enabled == 1)) {

		/* Lazyload on scroll */
		$.lazyload({
			placeholder : lazy_load_conf.placeholder,
			threshold : lazy_load_conf.threshold,
			event : "scroll",
			container : window
		});

		/* Lazyload on DOM change */
		$.lazyload({
			placeholder : lazy_load_conf.placeholder,
			threshold : lazy_load_conf.threshold,
			event : "DOMSubtreeModified",
			container : window
		});
	}

	// Make middle mouse button clicks work on .link-elements
	$(".link").mouseup(function(event) {
		if (event.which == 2) {
			event.preventDefault();
			$(this).click();
		}
	});
	$(".link").mousedown(function(event) {
		if (event.which == 2) {
			event.preventDefault();
			$(this).click();
		}
	});

	$(".set_sq").bind("click", function(ev) {
		var sq = $(this).data("sq");
		if (sq)
			$.cookie("sq", sq, {path: "/", domain: document.domain}, "disable_encoding");
	});

	//set target="_blank" to links with class target_blank
	jQuery(".target_blank").attr("target", "_blank");


	blocket.apps.all_pages.document_write_org = document.write;
	document.write = blocket.apps.all_pages.document_write_override;
	//blocket.tools.breadcrumb_shortener();

	$('.link_disable').on("click", function(e) {
		e.preventDefault();
	});

	// Makes banners visible at the same time
	blocket.common.onload_queue.add( {
		onload_function: function(obj) {
			new lazy_iframe();
		}
	}, 'medium' );

	/* Avoid breaking */
	if (typeof(console) == "undefined") {
		console = {};
		console.log = function(str) {};
	}

	//xiti ehandel
	jQuery(document).ready(function() {
		jQuery('.xiti_estore_navbar').click(function(event) {
			event.preventDefault();
			window.location.href = 'http://logc89.xiti.com/go.url?xts=459270&xtor=AD-3-[ad_version1]-[text_link]-[0]-[www.blocket.se]-[0]-[ecommerce_from_navbar]&url=' + this.href;
		});
	});

	// This prevents multiple form submits. Disables submit-button after submit.
	$('form').bind("submit", function() {
		$(".one_click", $(this)).attr('value', 'Vänta...').prop('disabled', true);
	});

	// Determine and set OS variables
	blocket.apps.all_pages.detect_os(navigator.userAgent);

	// Ugliest fix ever. See below. (for friendly iframes - apparently, not so friendly with Safari...)
	blocket.apps.common.safari_ugly_fix.append();

	// Invoke impression counter on Bostad triplebanner
	blocket.apps.all_pages.invoke_impression();
});



blocket("@tools").extend({
	set_iframe_height : function(minHeight) {
		var elem = window.frameElement;
		var i = 0;

		if (elem != null) {
			var interval = setInterval(function() {
				var height = Math.max(document.body.scrollHeight, document.body.clientHeight);
				if (height > minHeight){
					clearInterval(interval);
					elem.height = height;
					elem.style.height = height + "px";
				}
				if(i > 3000){
					clearInterval(interval);
				}
				i++;

			}, 1);
		}
	},

	/*
	 * Truncate breadcrumbs, starting from the first element after the the First Page element.
	 * Reduces the size of the elments in #breadcrumb_container until it fits within #breadcrumb
	 */

	breadcrumb_truncator : function(max_breadcrumb_width) {
		var current_width;
		var current_height;
		var max_width = max_breadcrumb_width || 600;
		var $breadcrumb;
		var breadcrumb_elements;
		var bc_element;
		var current_label;

		if (blocket.params.application == "view" || blocket.params.application == "list") {
			if ($(".list_stores")[0]) // XXX Use sub_application instead?
				return;

		} else {
			return;
		}

		$breadcrumb = $("#breadcrumb_container");
		breadcrumb_elements = $breadcrumb.find("a");
		current_width = $breadcrumb.width();
		current_height = $breadcrumb.height();

		var i = 2;
		var number_of_elements = breadcrumb_elements.length;
		while ((current_width > max_width || current_height > 30) && i < number_of_elements) {
			bc_element = $(breadcrumb_elements[i]); // Element to truncate
			current_label = bc_element.html();
			if (current_label.length > 3) {
				bc_element.attr("title", bc_element.text());
				bc_element.html(current_label.substring(0, 3) + "...");
			}
			current_width = $breadcrumb.width();
			current_height = $breadcrumb.height();
			i++;
		}
	},

	parse_url: function(url) {
		/* http[colon]//www.blocket.se[colon2]port[slash]path[questionmark]query[hash]id */
		var colon = url.indexOf(":");
		var colon2 = url.indexOf(":", (colon !== -1) ? colon + 1 : 0);
		var slash = url.indexOf("/", (colon !== -1) ? colon + 3 : 0);
		var questionmark = url.indexOf("?");
		var hash = url.indexOf("#");

		var host_start;
		var host_end;

		var url_obj = {
			protocol: "",
			hostname: "",
			port: "",
			pathname: "",
			search: "",
			qs: {},
			hash: ""
		};

		/* Protocol */
		if (colon !== -1) {
			url_obj.protocol = url.slice(0, colon + 1);
			host_start = colon + 3;
		} else {
			host_start = 0;
		}

		/* Hostname */
		host_end = (colon2 !== -1) ? colon2 : slash;
		url_obj.hostname = url.slice(host_start, host_end);

		/* Port */
		if (colon2 !== -1) {
			url_obj.port = url.slice(colon2 + 1, (slash !== -1) ? slash : url.length);
		}

		/* Pathname */
		if (slash !== -1) {
			var path_end = (questionmark !== -1) ? questionmark : ((hash !== -1 ) ? hash : url.length);
			url_obj.pathname = url.slice(slash, path_end);

			/* Default */
			if (url_obj.pathname == "") {
				url_obj.pathname = "/";
			}
		}

		/* Query string */
		if (questionmark !== -1) {
			url_obj.search = (hash !== -1) ? url.slice(questionmark, hash) : url.slice(questionmark);

			var qs = url_obj.search.slice(1).split("&");

			for (var i = 0; i < qs.length; ++i) {
				var split = qs[i].split("=");
				url_obj.qs[split[0]] = split[1];
			}
		}



		/* Hash */
		if (hash !== -1) {
			url_obj.hash = url.slice(hash);
		}

		var qs_sep = url.indexOf()

		return url_obj;
	}
});

blocket("@apps.common").extend({

	campaigns: {},

	campaign: function(app, func) {
		if (typeof this.campaigns[app] === "undefined") {
			this.campaigns[app] = [];
		}
		this.campaigns[app].push(func);
	},

	dialog_settings: {
		show_preload_text: true,
		pretext: {
			"phonenumber" : "Laddar telefonnummer...",
			"mail" : "Laddar mejlformuläret...",
			"tellafriend" : "Laddar mejlformuläret...",
			"trustly" : "Laddar direktbetalning...",
			"default" : "Laddar..."
		},
		prevent_scroll: false
	},

	print_ad_action_dialog: function(args) {
	 	"use strict";

		var $contact_container;
		var $contact_container_content;


		// grab container
		$contact_container = $("#contact_container")
		$contact_container_content = $("#contact_container_content");
		$contact_container_content.empty();

		//set defaults of args
		args = args || {};
		args.skin = args.skin || "skin_default";
		args.pretext = args.pretext || "Laddar...";

		// build preload text box
		if (blocket.apps.common.dialog_settings.show_preload_text) {

				var frag = document.createDocumentFragment();
				var new_div = document.createElement("div");
				new_div.setAttribute("class","preload_indicator")
				frag.appendChild(new_div);
				$contact_container_content[0].appendChild(frag);


			var contact_dialog_preload_text_interval = window.setTimeout(function() {
					$(".preload_indicator").text(args.pretext);
			}, 300);

		}

		// Add/remove skin css class
		if (args.skin === "skin_default") {
			args.remove_skin = "skin_raw";
		} else if (args.skin === "skin_raw") {
			args.remove_skin = "skin_default";
		}
		$contact_container.removeClass(args.remove_skin);
		$contact_container.addClass(args.skin);

		// Close link position
		$("#contact_container_close_link").css("top","0px");

		blocket.apps.common.show_contact_container(args.prevent_scroll);

		// Return data-append function for later execution
		return function(data) {

			// clear preload text interval
			window.clearTimeout(contact_dialog_preload_text_interval);

			// Reset container
			$contact_container_content.empty();

			// Add new data to the container
			$contact_container_content.append(data);

			// Placeholder fallback
			blocket.apps.common.init_placeholder_fallback();
		}

	},

	open_ad_action_dialog : function(args) {

		var $contact_container, $contact_container_content, insert_new_data;

		args.prevent_scroll = args.prevent_scroll || false;
		args.whoami = args.whoami || "default";

		// Reset dialog box and return data execute function
		insert_new_data = blocket.apps.common.print_ad_action_dialog({
			"prevent_scroll":args.prevent_scroll,
			"skin":"skin_default",
			"pretext": blocket.apps.common.dialog_settings.pretext[args.whoami]
		});

		if(args.url == "TRUSTLY"){

			/*
			---- Use again when trustly have released the new layout ----
			$contact_container.removeClass("skin_default");
			$contact_container.addClass("skin_raw");

			$("#contact_container_close_link").css("top","10px");
			*/

			url = trustly_iframe_url + '?h=' + blocket.params.trustly_h;
			var ifrm = document.createElement("IFRAME");
			ifrm.setAttribute("id", "trustly_iframe");
			ifrm.setAttribute("src", url);
			ifrm.setAttribute("class", "span14 float_none");
	 		ifrm.setAttribute("scrolling", "no");
	 		ifrm.setAttribute("frameBorder", "0");

			insert_new_data(ifrm);

		}else{
			$.ajax({
				url: args.url,
				context: "html",
				success: function(data) {
					insert_new_data(data);	
				},
				error: function(err, textStatus, errorThrown) {
					console.log(err,textStatus, errorThrown);
				}
			});
		}
		return false;
	},

	show_contact_container : function(prevent_scroll) {
		var contact_container = $("#contact_container");
		contact_container.show();

		if(!prevent_scroll) {
			var $win = $(window);
			var fold = $(document).scrollTop();
			var offset = 50;
			var top_margin = 20;
			var limit_bottom = fold + $(window).height();
			var scrollTop = 0;
			var element_bottom = contact_container.offset().top + contact_container.height() + offset;
			var element_top = contact_container.offset().top - offset;


			// Will scroll when object is above OR under window. 
			if(element_bottom > limit_bottom || fold > element_top) {
				scrollTop = contact_container.offset().top - top_margin;
				blocket.apps.scrollto.open({top: scrollTop, left: 0});
			}
		}
	},

	hide_contact_container : function() {
		$("#contact_container").hide();
		$("#contact_container_content").empty();
	},

	set_highlight: function(field, text, classprefix, idprefix) {
		var input_field = $('#' + field);
		var input_field_parent = input_field.closest('.field_container');

		if(input_field_parent.length == 0) {
			return;
		}

		input_field_parent.find('#' + idprefix + field).remove();
		if(text != null) {
			var ndiv = document.createElement('div');
			ndiv.id = idprefix + field;
			ndiv.className = classprefix + 'text';
			ndiv.innerHTML = text;
			input_field_parent.append(ndiv);
			input_field_parent.addClass(classprefix + 'highlight');
		} else {
			input_field_parent.find('div.' + classprefix + 'text[id=' + idprefix + field +']').remove();
			if(input_field_parent.find('div.' + classprefix + 'text').length == 0) {
				input_field_parent.removeClass(classprefix + 'highlight');
			}
		}
		input_field_parent.removeClass('backend_error');
	},

	set_err: function(field, err) {
		blocket.apps.common.set_highlight(field, err, 'error_', 'err_');
	},

	set_warning: function(field, warning) {
		blocket.apps.common.set_highlight(field, warning, 'warning_', 'warn_');
	},

	fetch_phone_number : function(callback) {
		var phone_challenge = $("#ph_link").attr("href");

		if (typeof(phone_challenge) != "undefined" && phone_challenge.length > 1) {
			phone_challenge = phone_challenge.substring(1);

			$("#ph_link").remove();
			$("#ph_num").remove();

			$.ajax({
				type: "GET",
				url: "/phoneview.json",
				data: { list_id: blocket.params.list_id, h: phone_challenge },
				dataType: "json"
				})
			.done(function(data) {
				if (typeof(data) != "undefined") {
					if (typeof(data.error) != "undefined" && typeof(data.message) != "undefined") {
						$("#ph_container").append($('<span class="text error">' + data.message + '</span>'));
					}
					if (typeof(callback) != "undefined") {
						$("#ph_container").bind("phone_shown", function() {
							callback();
						});
					}
					
					if (typeof(data.phone_text) != "undefined") { 
						$("#ph_container").append($('<span id="ph_num">' + data.phone_text + '</span>'))
						$("#ph_container").trigger("phone_shown");
						xt_med('C','','phoneview_show_number','A');
					}
					if (typeof(data.phone_img) != "undefined")  {
						var phone_image = $('<img id="ph_num" class="phone_gif" alt="" src="' + data.phone_img + '"></img>').load(function() {
							$("#ph_container").trigger("phone_shown");
						});
						$("#ph_container").append(phone_image);
						xt_med('C','','phoneview_show_number','A');
					}
				}
			});
		}
	},

	// Binds the events for displaying the category price to the user
	bind_category_dropdowns: function() {
		$("#price_info_category_group").change(blocket.apps.common.show_price);
		$("#price_info_sub_category").change(blocket.apps.common.show_price);
		$("#pi_c_ad").change(blocket.apps.common.show_price);
		$("#pi_p_ad").change(blocket.apps.common.show_price);
		blocket.apps.common.show_price();
	},

	// Finds the price for a category from bconf. Note that the result is only valid if the category used is
	// a category that ads are actually assigned to.
	find_category_price: function(category, company_ad, parent_category) {
		var price_obj = company_ad ? company_prices : private_prices;
		// bconf lookup
		var price_data = blocket.common.split_setting(
			blocket.common.get_settings(
				'price',
				function (key) {
					if (key == "company_ad"){
						return company_ad ? 1 : 0; // Makes it work with bool as input
					}
					if (key == "category"){
						return category;
					}
					if (key == "parent"){
						return parent_category;
					}
				},
				price_obj
			)
		);
		// The prices are returned as an object with price as key. If we get an object, there is only one price in the array.
		var price_out = null;
		for (var i in price_data) {
			price_out = i;
		}
		return price_out;
	},

	// Tries to find the price for a category group. Returns a price if there is a unique price for the group, otherwise
	// it returns null.
	find_category_group_price: function(category_group, company_ad) {
		var is_leaf = category_list[category_group]['leaf'] == 1;
		if (is_leaf) {
			// There is a single price, return it
			return blocket.apps.common.find_category_price(category_group, company_ad, null);
		} else {
			// Find all the sub cats and see if they have a single unique price
			// If they do, return it. Else return null.
			var price_out = null;
			for (var u = 0; u < category_order.length; u++) {
				if (category_list[category_order[u]]['parent'] == category_group) {
					var cat_id = category_order[u];
					var cat_price = blocket.apps.common.find_category_price(cat_id, company_ad, category_group);
					if (price_out == null) {
						price_out = cat_price;
					} else if (price_out != cat_price) {
						// At least two different prices exist
						return null;
					}
				}
			}
			return price_out;
		}
	},

	// Provides logic to determine if we have a single unique price to display for the current selection in the price
	// lightbox, or if we need further information in the form of a selected subcategory/category group.
	show_price: function() {
		var company_ad = $('#pi_c_ad').prop("checked") ? 1 : 0;
		var cat_group = document.getElementById('price_info_category_group').value;
		var sub_cat_dropdown = document.getElementById("price_info_sub_category");
		// Make sure that the category group selected is a proper group (a level 1 category), or if it is JOBB
		if (category_list[cat_group] != undefined && (category_list[cat_group]['level'] == 1 || cat_group == 9000)) {
			// Test if we can find a single price for the category group
			var price_out = blocket.apps.common.find_category_group_price(cat_group, company_ad);
			if (price_out != null) {
				// Display the price and hide the sub category dropdown
				$("#price_p span:first").html(price_out).closest("#price_p").show();
				sub_cat_dropdown.style.display = 'none';
				sub_cat_dropdown.enabled = false;
			} else {
				// If there's a selected sub category for the current category group, then we have a price
				var sub_category = sub_cat_dropdown.value;
				if (category_list[sub_category] && category_list[sub_category]['parent'] == cat_group) {
					price_out = blocket.apps.common.find_category_price(sub_category, company_ad, cat_group);
					$("#price_p span:first").html(price_out).closest("#price_p").show();
					sub_cat_dropdown.style.display = 'block';
					sub_cat_dropdown.enabled = true;
				} else {
					// Fill the sub category dropdown with options and display it
					sub_cat_dropdown.options.length = 1; // Reset options
					var option_count = 0;
					for (var u = 0; u < category_order.length; u++) {
						if (category_list[category_order[u]]['parent'] == cat_group) {
							option_count++;
							var cat_id = category_order[u];
							var name = category_list[cat_id]['name'];
							sub_cat_dropdown.options[option_count] = new Option(name, cat_id);
						}
					}
					$("#price_p").hide();
					sub_cat_dropdown.style.display = 'block';
					sub_cat_dropdown.enabled = true;
				}
			}
		} else {
			// The user needs to select a category group
			$("#price_p").hide();
			sub_cat_dropdown.style.display = 'none';
			sub_cat_dropdown.enabled = false;
		}
	},

	index_of_object_in_array : function(item, list, identifier_name) {
		var i = 0;
		var in_array = false;
		if (typeof(item) == "object" && typeof(list) == "object" && item.hasOwnProperty(identifier_name)) {
			while (!in_array && i < list.length) {
				if (list[i].hasOwnProperty(identifier_name) && list[i][identifier_name].toLowerCase() === item[identifier_name].toLowerCase()) {
					in_array = true;
					break;
				}
				i++;
			}
		}
		return in_array ? i : -1;
	},

	crop_image_to_fit_container : function(image, image_container) {
		if (image.width > 1 && image.height > 1) {
			var image_ratio = image.height / image.width;
			var container_height = image_container.height();
			var container_width = image_container.width();
			var container_ratio = container_height / container_width;
			if (image_ratio < container_ratio) {
				$(image).css("height", container_height);
				$(image).css("margin-left", Math.round((image.width - container_width) / 2)*-1);
			} else if (image_ratio >= container_ratio) {
				$(image).css("width", container_width);
				$(image).css("margin-top", Math.round((image.height - container_height) / 2)*-1);
			}
		}
	},

	lazy_load_content : function(element_to_load, call_back) {
		if (blocket.apps.common.is_element_within_screen(element_to_load)) {
			call_back();
		} else {
			var id = $(element_to_load).attr("id");
			var event_namespace = "scroll.lazy_load_content";
			if(id.length > 0) {
				event_namespace += "_" + id;
			}
			$(window).bind(event_namespace, function(event) {
				var fold = $(document).scrollTop();
				var offset = 150;
				var limit = fold + $(window).height() + offset;
				var element_y = $(element_to_load).offset().top;
				if (limit >= element_y) {
					call_back();
					$(window).unbind(event_namespace);
				}
			});
		}
	},

	is_element_within_screen : function(element) {
		var window_scroll_top = $(window).scrollTop();
		var element_position = $(element).offset().top
		return (window_scroll_top < element_position && element_position < ($(window).height() + window_scroll_top));
	},

	crop_text: function(text_container, max_chars) {
		if (typeof text_container === "object") {
			if (jQuery(text_container).length > 0) {
				var str = jQuery(text_container).text().trim();
				if (str.length > max_chars) {
					str = str.substring(0, max_chars);
					str += "...";
				jQuery(text_container).text(str);
				}
			}
		}
	},

	load_EAS_fif_with_rsi_segs : function(divId, easSrc, width, height, cls) {

		var cookie_value = $.cookie("rsi_segs");
		var cookie_value2 = $.cookie("nPsegs");

		if (cookie_value != null) {
			// Only a maximum of 20 values are supported
			var value_list = cookie_value.split("|").slice(0, 20).join("|");
			easSrc += "&amp;EASTbt=" + value_list;
		}

		if (cookie_value2 != null) {
			var value_list2 = cookie_value2.split("|").slice(0, 20).join("|");
			easSrc += "&amp;EASTnp=" + value_list2;
		}
		EAS_load_fif(divId, easSrc, width, height, cls);
	},
	toggle_placeholder : function(element, placeholders) {
		if(element != null) {
			if((element.value == null) || (typeof(element.value) == "undefined") || element.value == "") {
				$(placeholders[element.id]).removeClass("hidden");
			} else {
				$(placeholders[element.id]).addClass("hidden");
			}
		}
	},
	init_placeholder_fallback : function(start_element) {
		if('placeholder' in document.createElement('input')) {
			return;
		}

		if(start_element == null) {
			start_element = $("#blocket");
		}

		var placeholders = new Array();
		var parent, wrapper, label, id;
		start_element.find("input[placeholder], textarea[placeholder]").each(function() {
			if(!this.parentNode.className.match(/\binput_placeholder\b/)) {
				parent = this.parentNode;
				wrapper = document.createElement('div');
				wrapper.className = "input_placeholder";
				parent.replaceChild(wrapper, this);
				wrapper.appendChild(this);
				label = document.createElement('label');
				label.className = 'placeholder';
				label.setAttribute('for', this.id);
				label.innerHTML = this.getAttribute('placeholder') === null ? this.getAttribute('data-placeholder') : this.getAttribute('placeholder');
				wrapper.appendChild(label);
			}
		});

		start_element.find("label.placeholder").each(function(index, element) {
			id = element.getAttribute("for"),
			    input_field = $("#" + id);

			if(placeholders[id] == undefined) {
				placeholders[id] = [];
			}
			placeholders[id].push(element);
			blocket.apps.common.toggle_placeholder(input_field[0], placeholders);

			input_field.unbind("input.placeholder propertychange.placeholder paste.placeholder cut.placeholder drop.placeholder change.placeholder");
			input_field.bind("input.placeholder propertychange.placeholder paste.placeholder cut.placeholder drop.placeholder change.placeholder", function(e){
				blocket.apps.common.toggle_placeholder(e.target, placeholders);
			});
		});
	}
});


blocket("@apps.all_pages").extend({
	invoke_impression : function() { 
	    if (typeof EAad == 'undefined' && typeof count_impression == 'function') {
		count_impression();
	    }
	},
	resize_eas_frame : function(self, max_width, max_height, extras) {
		/*
		 * Auto resize iframe
		 */

		try {
			var agent = navigator.userAgent.toLowerCase();

			if (!document.org_domain)
				document.org_domain = document.domain;

			/* Only domain, no subdomain */
			var domain = location.host;

			if (domain.match(/^([0-9].){4}/)) {
				if (domain.indexOf(':'))
					domain = domain.substr(0, domain.indexOf(':'));
			} else {
				var domain_arr = domain.split(".");
				if (domain_arr.length >= 2)
					domain = domain_arr[domain_arr.length - 2] + '.' + domain_arr[domain_arr.length - 1];
			}
			document.domain = domain;
		} catch(e) {
		}

		/* if src is not set the next checks are futile */
		if (typeof(self.src) == 'undefined' || self.src == "") {
			return;
		}
		var content = self.contentWindow ?
			self.contentWindow.document :
			self.contentDocument.document;

		if (max_height) {
			self.height = Math.min(max_height, content.body.scrollHeight);
		} else if (content.body.scrollHeight > 30) {
			self.height = content.body.scrollHeight;
		}

		if (self.height > 20) {
			self.style.margin='';
			if (content.body.scrollWidth < max_width)
				self.width = content.body.scrollWidth;
			else if (max_width)
				self.width = max_width;

			if (extras != null) {
				for (var i = 0; i < extras.length; ++i) {
					$('#' + extras[i]).css('display', 'block');
				}
			}
		} else {
			self.width = "0px";
			self.style.margin = "0px";
			$(self).removeClass("box_space");
		}
	},
	resize_iframes : function(elements, max_height, offset_height) {
		var iframes = jQuery(elements);
		var offset = 0;
		for (var i = 0; i < iframes.length; i++) {
			var iframe = jQuery(iframes[i]);
			var doc = iframe[0].contentDocument || iframe[0].contentWindow.document;
			var body = $("body", doc);
			var height = doc.body.scrollHeight;
			if (iframe.height() == height) {
				height = doc.body.offsetHeight + 20;
			}
			if (height > 20 && typeof(offset_height) != "undefined") {
				offset = offset_height;
			}
			if (max_height != null && height > max_height) {
				iframe.height(max_height + offset);
			} else {
				iframe.height(height + offset);
				if (height > 20) {
					$(iframe).addClass("box_space");
				} else {
					var iframe_parent = $(iframe).parent();
					if ($(iframe_parent).hasClass("eas_container")) {
						$(iframe_parent).hide();
					}
					$(iframe).remove();
				}
			}
		}
	},
	resize_iframes_in_list : function(elements, max_height, offset_height) {
		var iframes = jQuery(elements);
		var offset = 0;

		for(var i=0; i < iframes.length; i++) {
			var iframe = jQuery(iframes.get(i));
			var innerDoc = (iframe.get(0).contentDocument) ? iframe.get(0).contentDocument : iframe.get(0).contentWindow.document;

			if (innerDoc.body.scrollHeight > 20 && typeof(offset_height) != "undefined") {
				offset = offset_height;
			}

			if (typeof(max_height) != "undefined" && innerDoc.body.scrollHeight > max_height) {
				iframe.height(max_height + offset);
			} else {
				iframe.height(innerDoc.body.scrollHeight + offset);
			}
		}
	},
	resize_li_bottom_980 : function(elements, max_height){

		var iframes = jQuery(elements);
		var offset = 0;
		var offset_height = 0;

		for(var i=0; i < iframes.length; i++) {
			var iframe = jQuery(iframes.get(i));
			var innerDoc = (iframe.get(0).contentDocument) ? iframe.get(0).contentDocument : iframe.get(0).contentWindow.document;

			if (innerDoc.body.scrollHeight > 10 && typeof(offset_height) != "undefined") {
				offset = offset_height;
			}

			var set_height = 0;
			if (typeof(max_height) != "undefined" && innerDoc.body.scrollHeight > max_height) {
				set_height = max_height + offset;
			} else {
				set_height = innerDoc.body.scrollHeight + offset;
			}

			iframe.height(set_height);
			iframe.width(980);
			// Light up Iframe if there is a content
			if(set_height > 10){
				jQuery(".bottom_banner_980").removeClass("hidden");
				jQuery(".nospiral_content_simulation").height(set_height);
			}
		}
	},
	resize_jframe : function(self) {
		/*
		 * Auto resize jobb and bostad gallery iframe
		 */
		try {
			if (!document.org_domain) {
				document.org_domain = document.domain;
			}
			/* Only domain, no subdomain */
			var domain = location.host;

			if (domain.match(/^([0-9].){4}/)) {
				if (domain.indexOf(':')) {
					domain = domain.substr(0, domain.indexOf(':'));
				}
			} else {
				var domain_arr = domain.split(".");
				if (domain_arr.length >= 2) {
					domain = domain_arr[domain_arr.length - 2] + '.' + domain_arr[domain_arr.length - 1];
				}
			}
			document.domain = domain;
		} catch(e) {
			console.log(e);
		}

		var content = self.contentWindow ? self.contentWindow.document : self.contentDocument.document;

		/* if src is not set the next checks are futile */
		if (typeof(self.src) == 'undefined' || self.src == ""){
			return;
		}
		if (content.getElementById("eframe_container") != null && content.getElementById("eframe_container").scrollHeight > 35) {
			self.style.height = content.getElementById("eframe_container").scrollHeight + "px";
			$(self).addClass("box_space");
		} else {
			self.style.height = "0px";
			$(self).removeClass("box_space");
		}
	},
	resize_eframe : function(self) {
		/*
		 * Auto resize estore iframe
		 */

		try {
			if (!document.org_domain) {
				document.org_domain = document.domain;
			}
			/* Only domain, no subdomain */
			var domain = location.host;

			if (domain.match(/^(dev[0-9]{1,2}.)/)) {
				if (domain.indexOf(':')) {
					domain = domain.substr(0, domain.indexOf(':'));
				}
			}

			var domain_arr = domain.split(".");
			if (domain_arr.length >= 2) {
				domain = domain_arr[domain_arr.length - 2] + '.' + domain_arr[domain_arr.length - 1];
			}
			document.domain='blocket.bin';
		} catch(e) {
		}
		var content = self.contentWindow ? self.contentWindow.document : self.contentDocument.document;

		/* if src is not set the next checks are futile */
		if (typeof(self.src) == 'undefined' || self.src == "") {
			return;
		}
		if (content.getElementById("eframe_container") != null && content.getElementById("eframe_container").scrollHeight > 20) {
			self.style.height = content.getElementById("eframe_container").scrollHeight + "px";
			$(self).addClass("box_space");
		} else {
			self.style.height = "0px";
			$(self).removeClass("box_space");
		}
	},

	resize_eframe_eas_iframe_bottom : function(self) {
		this.resize_eframe(self);
		$(self).toggleClass("hidden",(self.id == "ehandel_eas_iframe" && self.getAttribute("vertical_target") != document.getElementById("ehandel_iframe").getAttribute("vertical_target")));
	},

	selectField : function(field_id,mode) {
		$("#"+field_id).prop("checked", mode);
	},

	ajax_check : function() {
		var xmlhttp = false;
		try {
			xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {
			return false;
		}
		return true;
	},

	preload_image : function(_image) {
		var image = new Image;
		image.src = _image;
	},

	clickcounter : function(name) {
		if (this.ajax_check()) {
			var httpreq = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			httpreq.open('GET', '/redir?nc=1&s=' + name, true);
			httpreq.send(null);
		}
	},

	include_script : function(src, callback) {
		if (typeof(src) === 'undefined' || src === '') return;
		var script = document.createElement('script');
		script.src = src;
		script.type = 'text/javascript';
		if (callback) {
			script.onload = callback;
			script.onreadystatechange = function () {
				if (this.readyState == "complete" || this.readyState == "loaded") {
					this.onload();
					this.onload = this.onreadystatechange = null;
				}
			};
		}
		document.getElementsByTagName('body')[0].appendChild(script);
	},

	document_write_override : function(str) {
		if (str.toLowerCase().indexOf('src=') > 0) {
			if (str.toLowerCase().indexOf('script') >= 0) {
				str = str.substring(str.toLowerCase().indexOf('src'));
				var script = str.replace(/^[^"']+["']/, '').replace(/["'].+$/, '');
				this.include_script(script);
				return;
			} else if (str.toLowerCase().indexOf('img') >= 0) {
				/**
				 * This is a hack to avoid xiti's document.write and instead
				 * use createelement to append the xiti stats image
				 */
				// '<img width="1" height="1" src="'+url+'">
				// '<img width="1" height="1" src="'js_comment_override1'">
				str = str.substring(str.toLowerCase().indexOf('src'));
				var script = str.replace(/^[^"']+["']/, '').replace(/["'].+$/, '');
				var img = new Image;
				img.src = script;
				return;
			}
		}

		document.write = this.document_write_org;
		document.write(str);
		document.write = this.document_write_override;
	},

	xiti_debug_info: function () {
		var html = "Xiti-status: " + (xtpage.length > 0 ? (xtn2.length > 0 ? (xtpage.search("\:\:\:\:")>0 ? "Invalid" : "Found") : "Unclassified") : "missing!") + "<br />";
		for (var k in window) {
			if (k.substr(0,2) == "xt" && typeof(window[k]) == "string")
				html += k + ": " + window[k] +"<br />";
		}
		$(".xiti_box").html(html);
	},

	reset_iframe_opacity : function(iframeid) {
		$(iframeid).css("opacity",'1');
	},

	get_outerwidth : function(element) {
		var total_width = 0;
		var item = jQuery(element);
		total_width += item.width();
		total_width += parseInt(item.css("padding-left"), 10) + parseInt(item.css("padding-right"), 10); //Total Padding Width
		total_width += parseInt(item.css("margin-left"), 10) + parseInt(item.css("margin-right"), 10); //Total Margin Width
		total_width += parseInt(item.css("borderLeftWidth"), 10) + parseInt(item.css("borderRightWidth"), 10); //Total Border Width
		return total_width;
	},

	get_innerwidth : function(element) {
		var total_width = 0;
		var item = jQuery(element);
		total_width += item.width();
		total_width -= parseInt(item.css("padding-left"), 10) + parseInt(item.css("padding-right"), 10); //Total Padding Width
		return total_width;
	},

	resize_list_items : function(data) {
		var options = { 	//Optionals
			offset : 0
		};
		jQuery.extend(options, data);
		var target_items = jQuery(options.target_items);
		var list_items = jQuery(options.list_items);
		var offset = options.offset;
		var word_containers = options.word_containers;
		var max_width = blocket.apps.all_pages.get_innerwidth(options.parent_container);

		var items_width = 0;
		for(var i=0; i<list_items.length; i++) {
			items_width += blocket.apps.all_pages.get_outerwidth(list_items.get(i));
		}
		if (items_width > max_width) {
			var over = parseInt((items_width - max_width) + offset);
			var longest = null;
			while(over > 0) {
				for(var i=0; i < target_items.length; i++) {
					var item = jQuery(target_items.get(i));
					if (longest != null && item.width() > longest.width())
						longest = item;
					else if (longest == null)
						longest = item;
				}
				word = longest.find(word_containers);
				before = word.width();
				word.html(word.html().slice(0, (word.html().length - 1)));
				over -= before - word.width()
			}
		}

	},

	detect_os: function(ua) {

		var match;

		// Store the OS variables in "non-volatile" memory
		window.params = { os: {} };
		blocket.apps.all_pages.os = window.params.os;

		// Windows
		if (match = ua.match(/Windows NT (\d\.\d)/)) {
			blocket.apps.all_pages.os.major = "windows";
			switch (match[1]) {
				case "6.1":
					blocket.apps.all_pages.os.minor = "windows_7";
					return;
				case "6.0":
					blocket.apps.all_pages.os.minor = "windows_vista";
					return;
				case "5.2":
					blocket.apps.all_pages.os.minor = "windows_xp64"; // And Server 2003
					return;
				case "5.1":
					blocket.apps.all_pages.os.minor = "windows_xp";
					return;
			}
			blocket.apps.all_pages.os.minor = "windows_" + match[1];
			return;
		} else if (match = ua.match(/Windows (\d\d)/)) {
			blocket.apps.all_pages.os.major = "windows";
			blocket.apps.all_pages.os.minor = "windows_" + match[1];
			return;
		}

		// Mac OS X
		if (match = ua.match(/Mac OS X 10.(\d)/)) {
			blocket.apps.all_pages.os.major = "mac_os";
			switch (match[1]) {
				case "7":
					blocket.apps.all_pages.os.minor = "mac_os_lion";
					return;
				case "6":
					blocket.apps.all_pages.os.minor = "mac_os_snow_leopard";
					return;
				case "5":
					blocket.apps.all_pages.os.minor = "mac_os_leopard";
					return;
				case "4":
					blocket.apps.all_pages.os.minor = "mac_os_tiger";
					return;
			}
			blocket.apps.all_pages.os.minor = "mac_os_10." + match[1];
			return;
		}

		// iPad
		if (ua.indexOf("iPad") != -1) {
			blocket.apps.all_pages.os.major = "ios";
			blocket.apps.all_pages.os.minor = "ipad";
		}

		// iPhone
		if (ua.indexOf("iPhone") != -1) {
			blocket.apps.all_pages.os.major = "ios";
			blocket.apps.all_pages.os.minor = "iphone";
		}

		// Android
		if (match = ua.match(/Android (\d)\.(\d)/)) {
			blocket.apps.all_pages.os.major = "android";
			switch (match[1]) {
				case "3":
					blocket.apps.all_pages.os.minor = "android_honeycomb";
					return;
				case "2":
					switch (match[2]) {
						case "3":
							blocket.apps.all_pages.os.minor = "android_gingerbread";
							return;
						case "2":
							blocket.apps.all_pages.os.minor = "android_froyo";
							return;
						case "1":
						case "0":
							blocket.apps.all_pages.os.minor = "android_eclair";
							return;
						default:
							blocket.apps.all_pages.os.minor = "android_2." + match[2];
							return;
					}
				case "1":
					switch (match[2]) {
					case "6":
						blocket.apps.all_pages.os.minor = "android_donut";
						return;
					case "4":
						blocket.apps.all_pages.os.minor = "android_cupcake";
						return;
					default:
						blocket.apps.all_pages.os.minor = "android_1." + match[2];
						return;
				}
			}
			blocket.apps.all_pages.os.minor = "android_" + match[1] + "." + + match[2];
		}

		// Symbian
		if (ua.match(/Symb(ian|OS)/)) {
			blocket.apps.all_pages.os.major = "symbian";
			blocket.apps.all_pages.os.minor = "unknown";
		}

		// Linux
		if (ua.indexOf("Linux") != -1) {
			blocket.apps.all_pages.os.major = "linux";
			blocket.apps.all_pages.os.minor = "unknown";
		}

	}
});



// An ugly bug deserves an ugly solution. Safari doesn't render flash in dynamically created iframes,
// unless there is some form of triggered change that makes the browser rerender the item. Here we
// modify the width with one pixel, and then reverts the modification within one millisecond - for
// five seconds with a 250 ms interval (hopefully long enough time to let the flash banner load).

blocket("@apps.common.safari_ugly_fix").extend({
	append: function() {
		if ($.browser.webkit) {
			this.time = new Date().getTime();
			this.interval = setInterval(function() {

				var self = blocket.apps.common.safari_ugly_fix;
				var now = new Date().getTime();

				if (self.time + 5000 > now) {

					$(".safari .fif iframe").each(function() {
						var o = this;
						var w = parseInt(o.style.width.replace("px", ""));
						o.style.width = w + 1 + "px";
					});

					setTimeout(function() {

						$(".safari .fif iframe").each(function() {
							var o = this;
							var w = parseInt(o.style.width.replace("px", ""));
							o.style.width = w - 1 + "px";
						});
					}, 1);

				} else {
					clearInterval(blocket.apps.common.safari_ugly_fix.interval);
				}

			}, 250);
		}
	}
});

blocket("@apps.news").extend({
	/*
	 * Truncate each news element matching the class .newstext
	 * until the object #news reaches or is shorter than max_width
	 * by removing 4 characters at a time and suffixing with "..."
	 * (Will stop after 50 truncates)
	 */
	truncate : function(max_width) {
		if(!max_width) {
			max_width = $("#news").width();
		}
		max_width -= 18; //CSS bug in ie7 needs this ofset to correctly truncate the third element
		var news_container = $("#news");
		var links = $(".newstext");
		var link_widths = 0;
		$(".newsitem").each(function() {
			link_widths += parseInt($(this).width());
			link_widths += parseInt($(this).css("margin-right"));
			link_widths += parseInt($(this).css("margin-left"));
		});
		if(($(news_container).length == 0) || (links.length < 1 && link_widths <= max_width)) {
			return;
		}
		for(var i = 0; i < 50 && link_widths > max_width; i++) {
			var link = $(links[i % links.length])
			var str = link.html();

			str = str.substring(0, str.length - 4);

			if (str.length == 0) {
				link.parent().hide();
				break;
			}

			// Trim
			if (typeof str != 'undefined') {
				str = str.replace(/^\s+|\s+$/g,"") + "...";
				link.html(str);
			}
			link_widths = 0;
			$(".newsitem").each(function() {
				link_widths += parseInt($(this).width());
				link_widths += parseInt($(this).css("margin-right"));
				link_widths += parseInt($(this).css("margin-left"));
			});
		}

	}
});

blocket("@common").extend({
	last_clicked_at: 0,

	/* Browser detection */
	BrowserDetect: {
		init: function () {
			this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
			this.version = this.searchVersion(navigator.userAgent)
				|| this.searchVersion(navigator.appVersion)
				|| "an unknown version";
			this.OS = this.searchString(this.dataOS) || "an unknown OS";
		},
		searchString: function (data) {
			for (var i=0;i<data.length;i++) {
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch || data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1)
						return data[i].identity;
				}
				else if (dataProp)
					return data[i].identity;
			}
		},
		searchVersion: function (dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1) return;
			var version = dataString.substring(index+this.versionSearchString.length+1);

			if (version.indexOf(' ') > 0) {
				version = version.substring(0, version.indexOf(' '));
			}

			return version;
		},
		isValid: function (browsers) {
			var i = 0;
			var valid = false;

			for (i = 0; i < browsers.length; i++) {
				if (browsers[i].agent == this.browser) {
					if (blocket.common.compare_version(browsers[i].version, this.version) >= 0) {
						valid = true;
						break;
					}
				}
			}

			return valid;
		},
		dataBrowser: [
			 {
				string: navigator.vendor,
				subString: "Google",
				identity: "Chrome",
				versionSearch: "Chrome"
			},
			 {
				string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			},
			 {
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari"
			},
			 {
				prop: window.opera,
				identity: "Opera"
			},
			 {
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			},
			 {
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			},
			 {
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			},
			 {
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			},
			{	// for newer Netscapes (6+)
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			},
			 {
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "Explorer",
				versionSearch: "MSIE"
			},
			 {
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			},
			{	// for older Netscapes (4-)
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
		],
		dataOS : [
			 {
				string: navigator.platform,
				subString: "Win",
				identity: "Windows"
			},
			 {
				string: navigator.platform,
				subString: "Mac",
				identity: "Mac"
			},
			 {
				string: navigator.platform,
				subString: "Linux",
				identity: "Linux"
			}
		]

	},

	FeatureDetect: {
		localStorage: function() {
			try {
				localStorage.setItem("test", "test");
				localStorage.removeItem("test");
				return true;
			} catch(e) {
				return false;
			}
		},
		pushState: function() {
			return !!((window.history && history.pushState) || (window.History && History.enabled));
		},
		replaceState: function() {
			return !!((window.history && history.replaceState) || (window.History && History.enabled));
		}
	},

	compare_version: function(ver1, ver2) {
		if (typeof(ver1) == 'string')
			ver1 = ver1.split('.');
		else if (typeof(ver1) == 'number')
			ver1 = [ver1];

		if (typeof(ver2) == 'string')
			ver2 = ver2.split('.');
		else if (typeof(ver2) == 'number')
			ver2 = [ver2];

		var i = 0;
		while (1) {
			if (!ver1[i]) {
				if (!ver2[i])
					return 0;
				else
					return 1;
			} else if (!ver2[i])
				return -1;

			if (parseInt(ver1[i]) > parseInt(ver2[i]))
				return -1;
			else if (parseInt(ver1[i]) < parseInt(ver2[i]))
				return 1;

			i++;
		}
	},

	/**
	*
	*  MD5 (Message-Digest Algorithm)
	*  http://www.webtoolkit.info/
	*
	**/
	MD5: function (string) {
		function RotateLeft(lValue, iShiftBits) {
			return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
		}

		function AddUnsigned(lX,lY) {
			var lX4,lY4,lX8,lY8,lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		}

		function F(x,y,z) { return (x & y) | ((~x) & z); }
		function G(x,y,z) { return (x & z) | (y & (~z)); }
		function H(x,y,z) { return (x ^ y ^ z); }
		function I(x,y,z) { return (y ^ (x | (~z))); }

		function FF(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function GG(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function HH(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function II(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function ConvertToWordArray(string) {
			var lWordCount;
			var lMessageLength = string.length;
			var lNumberOfWords_temp1=lMessageLength + 8;
			var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
			var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
			var lWordArray=Array(lNumberOfWords-1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while ( lByteCount < lMessageLength ) {
				lWordCount = (lByteCount-(lByteCount % 4))/4;
				lBytePosition = (lByteCount % 4)*8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
			lWordArray[lNumberOfWords-2] = lMessageLength<<3;
			lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
			return lWordArray;
		};

		function WordToHex(lValue) {
			var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
			for (lCount = 0;lCount<=3;lCount++) {
				lByte = (lValue>>>(lCount*8)) & 255;
				WordToHexValue_temp = "0" + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
			}
			return WordToHexValue;
		};

		function Utf8Encode(string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";

			for (var n = 0; n < string.length; n++) {

				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}

			return utftext;
		};

		var x=Array();
		var k,AA,BB,CC,DD,a,b,c,d;
		var S11=7, S12=12, S13=17, S14=22;
		var S21=5, S22=9 , S23=14, S24=20;
		var S31=4, S32=11, S33=16, S34=23;
		var S41=6, S42=10, S43=15, S44=21;

		string = Utf8Encode(string);

		x = ConvertToWordArray(string);

		a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

		for (k=0;k<x.length;k+=16) {
			AA=a; BB=b; CC=c; DD=d;
			a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
			d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
			c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
			b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
			a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
			d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
			c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
			b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
			a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
			d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
			c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
			b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
			a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
			d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
			c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
			b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
			a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
			d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
			c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
			b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
			a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
			d=GG(d,a,b,c,x[k+10],S22,0x2441453);
			c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
			b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
			a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
			d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
			c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
			b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
			a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
			d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
			c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
			b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
			a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
			d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
			c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
			b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
			a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
			d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
			c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
			b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
			a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
			d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
			c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
			b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
			a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
			d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
			c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
			b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
			a=II(a,b,c,d,x[k+0], S41,0xF4292244);
			d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
			c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
			b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
			a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
			d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
			c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
			b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
			a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
			d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
			c=II(c,d,a,b,x[k+6], S43,0xA3014314);
			b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
			a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
			d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
			c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
			b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
			a=AddUnsigned(a,AA);
			b=AddUnsigned(b,BB);
			c=AddUnsigned(c,CC);
			d=AddUnsigned(d,DD);
		}

		var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

		return temp.toLowerCase();
	},

	/* ----------------------------------------------------------------------- */
	// file: pagequery_api.js
	// javascript query string parsing utils
	// pass location.search to the constructor: var page = new PageQuery(location.search)
	// get values like: var myValue = page.getValue("param1") etc.
	// djohnson@ibsys.com {{djohnson}}
	// you may use this file as you wish but please keep this header with it thanks
	/* ----------------------------------------------------------------------- */
	PageQuery: function(q) {
		if (q.length > 1) this.q = q.substring(1, q.length);
		else this.q = null;
		this.keyValuePairs = new Array();
		if (q) {
			for(var i=0; i < this.q.split("&").length; i++) {
				this.keyValuePairs[i] = this.q.split("&")[i];
			}
		}
		this.getKeyValuePairs = function() { return this.keyValuePairs; }
		this.getValue = function(s) {
			for(var j=0; j < this.keyValuePairs.length; j++) {
				if (this.keyValuePairs[j].split("=")[0] == s)
					return this.keyValuePairs[j].split("=")[1];
			}
			return -1;
		}
		this.getParameters = function() {
			var a = new Array(this.getLength());
			for(var j=0; j < this.keyValuePairs.length; j++) {
				a[j] = this.keyValuePairs[j].split("=")[0];
			}
			return a;
		}
		this.getLength = function() { return this.keyValuePairs.length; }
	},

	queryString: function(key) {
			var page = new blocket.common.PageQuery(window.location.search);
			return unescape(page.getValue(key));
	},

	/*
	 * Array handling
	 */
	isInArray: function(needle, arrayHaystack) {
		if (!arrayHaystack || arrayHaystack.length == 0)
			return false;

		for (var x in arrayHaystack) {
			if (arrayHaystack[x].split(":")[0] == needle)
				return true;
		}

		return false;
	},

	/*
	 * Cookie handling
	 */
	setCookie: function(name, value, expires, path, domain, secure, dont_escape) {
		var today = new Date();

		today.setTime(today.getTime());

		if (expires)
			expires = expires * 1000 * 60 * 60 * 24;

		var expires_date = new Date(today.getTime() + (expires));

		document.cookie = name + '=' + (dont_escape ? value : blocket.common.escape_component(value)) +
			((expires) ? ';expires=' + expires_date.toGMTString() : '') + //expires.toGMTString()
			((path) ? ';path=' + path : '') +
			((domain) ? ';domain=' + domain : '') +
			((secure) ? ';secure' : '' );
	},

	getCookie: function(name) {
		var start = document.cookie.indexOf(name + "=");
		var len = start + name.length + 1;

		if (!start && name != document.cookie.substring(0, name.length))
			return null;

		if (start == -1)
			return null;

		var end = document.cookie.indexOf( ';', len );
		if (end == -1)
			end = document.cookie.length;

		return unescape(document.cookie.substring(len, end));
	},

	deleteCookie: function(name, path, domain) {
		if (blocket.common.getCookie(name)) {
			document.cookie = name + '=' +
				((path) ? ';path=' + path : '') +
				((domain) ? ';domain=' + domain : '' ) +
				';expires=Thu, 01-Jan-1970 00:00:01 GMT';
		}
	},

	/*
	 * Check if the given feature has been selected
	 */
	setFeatureVal: function(_feat, _id) {
		var Item = typeof(_id) == "string" ? getElementById(_id) : _id;

		var cookie_str = blocket.common.getCookie('features');
		var feat_elements = Item.length;
		if (cookie_str && cookie_str.indexOf(_feat) >= 0) {
			var feature = parseInt(cookie_str.substr(cookie_str.indexOf(_feat+': ')+_feat.length+1));
			for (var i = 0; i < feat_elements; i++) {
				if (feature == Item.options[i].value)
					Item.options[i].selected = true;
			}
		}
	},


	/*
	 * Check if the given feature has been selected
	 */
	setRadioVal: function() {
		var cookie_str = blocket.common.getCookie('features');
		if (cookie_str && cookie_str.indexOf("st") >= 0) {
			var feature = cookie_str.substr(cookie_str.indexOf('st: ')+3);
			for (var j = 0; j < document.f.st.length; j++) {
				if (document.f.st[j].value == feature) {
					document.f.st[j].checked = true;
				}
			}
		}
	},

	/*
	 * Layer handling
	 */
	showField: function() {
		var ShowItem = document.getElementById(blocket.common.showField.arguments[0]);
		if (ShowItem)
			ShowItem.style.display = blocket.common.showField.arguments[1];
		if (blocket.common.showField.arguments.length == 3) {
			ShowItem.innerHTML = blocket.common.showField.arguments[2];
		}

	},

	showElement: function(id, showHide, retval) {
		var element = document.getElementById(id);
		if (element)
			element.style.display = showHide == true ? "block" : "none";
		if (retval != null)
			return retval;
	},

	scrollToTop: function() {
		window.scrollTo(0, 0);
	},

	scrollToBottom: function() {
		window.scrollTo(0, 10000);
	},

	scrollToObject: function(offsetTrail) {
		var offsetLeft = 0;
		var offsetTop = 0;

		// Calculate the position
		while (offsetTrail) {
			offsetLeft += offsetTrail.offsetLeft;
			offsetTop += offsetTrail.offsetTop;
			offsetTrail = offsetTrail.offsetParent;
		}

		// Scroll
		window.scrollTo(0, offsetTop);
	},

	focused: false,

	scrollToError: function(elemId) {
		if (this.focused) return;
		var offsetTrail = document.getElementById(elemId);

		blocket.common.scrollToObject(offsetTrail);

		if (document.getElementById(elemId))
			document.getElementById(elemId).focus();
		this.focused = true;
	},

	setFocus: function(_field) {
		if (document.getElementById(_field)) {
			document.getElementById(_field).focus();
		}
	},

	setChecked: function(_Id, _check) {
		var Item = document.getElementById(_Id);
		if (Item == null) return;
		Item.checked = _check;
	},

	setValue: function(_Id, _check) {
		var Item = typeof(_Id) == "string" ? document.getElementById(_Id) : _Id;
		if (Item == null) return;

		Item.value = _check;
	},

	/*
	 * Popup
	 */
	//window.name = "shl";
	newWin: "",

	popUp: function(page, name, details) {
		this.newWin = window.open(page, name, details);
		this.newWin.focus();
		return false;
	},

	newsPopUp: function(page) {
		this.newWin = window.open(page, '_blank', ' width=800, height=' +Math.round(window.screen.availHeight * 0.8)+', scrollbars=yes, screenX = 0, screenY = 0, top = 0, left = 0');
		this.newWin.focus();
		return false;
	},

	/*
	 * Based on info at
	 * http://www.dynamic-tools.net/toolbox/isMouseLeaveOrEnter/
	 */
	eventWithinElement: function(ev, el) {
		var targ;

		if (typeof(ev.relatedTarget) == 'object' && ev.relatedTarget)
			targ = ev.relatedTarget;
		else if (ev.type == "mouseout")
			targ = ev.toElement;
		else
			targ = ev.fromElement;

		while (targ && targ != el)
			targ = targ.parentNode;

		return targ == el;
	},

	/*
	 * Table row hiliting
	 */
	tableRowHilite: function() {
		if (document.getElementById("hl") == null) return;
		
		var table = document.getElementById("hl");
		var rows = table.getElementsByTagName('tr');
		
		for (var i = 0; i < rows.length; i++)	{
			rows[i].onmouseover = function(ev) {
				if (typeof(ev) == "undefined" && window.event)
					ev = window.event;
				if (blocket.common.eventWithinElement(ev, this))
					return;

				var myid = this.id.replace("adrow_", "");
				this.className += 'hilite';
				if (typeof(hittacom) !== 'undefined' && myid) {
					hittacom.send("open=" + myid);
				}
			}
			
			rows[i].onmouseout = function(ev) {
				if (typeof(ev) == "undefined" && window.event)
					ev = window.event;
				if (blocket.common.eventWithinElement(ev, this))
					return;

				var myid = this.id.replace("adrow_", "");
				this.className = this.className.replace('hilite', '');
				if (typeof(hittacom) !== 'undefined' && myid) {
					hittacom.send("close=" + myid);
				}
			}
		}
			
		blocket.common.onload_queue.add({
			onload_function : function(obj) {
					var hittaframe = document.getElementById('hittaframe');
					if (hittaframe)
						hittaframe.style.width = hittaframe.scrollWidth + "px";
					}
				}, 'medium' );	
	},

	/*
	 * Disable and enable input fields in forms
	 */
	enable_field: function(_name) {
		var Item = typeof(_name) == "string" ? document.getElementById(_name) : _name;

		if (Item == null) return;

		if (Item.disabled)
			Item.disabled = false;
	},

	disable_field: function(_name) {
		var Item = typeof(_name) == "string" ? document.getElementById(_name) : _name;

		if (Item == null) return;

		if (!Item.disabled)
			Item.disabled = true;
	},

	check_dc: function(_key) {
		var date = new Date;
		var time = date.getTime();

		if ((blocket.common.last_clicked_at + 2500) >= time) {
			document.getElementById(_key).value = 1;
		} else {
			document.getElementById(_key).value = 0;
		}

		blocket.common.last_clicked_at = time;
	},

	/*
	 * Text area limit
	 */
	maxlength: function(e, obj, max) {
		if (!e) e = window.event; // IE

		if (e.which) {
			var keycode = e.which; // Mozilla
			var ie = false;
		} else {
			var keycode = e.keyCode; // IE
			var ie = true;
		}

		x = obj.value.length;

		if (x > max) {
			obj.value = obj.value.substr(0, max);
			x = max;
		}

		if (keycode == 0 && ie) { // PASTE ONLY FOR IE
			var select_range = document.selection.createRange();
			var max_insert = max - x + select_range.text.length;
			var data = window.clipboardData.getData("Text").substr(0, max_insert);
			select_range.text = data;
		} else if (x == max && (keycode != 8 && keycode != 46)) {
			return false;
		}

		return true;
	},

	/*
	 * Positioning of elements
	 */
	findPosX: function(obj, end) {
		var curleft = 0;
		var width = obj.clientWidth;

		if (obj.offsetParent) {
			while (obj.offsetParent) {
				curleft += obj.offsetLeft;
				obj = obj.offsetParent;
			}
		} else if (obj.x)
			curleft += obj.x;

		return curleft + (end?width: 0);
	},

	findPosY: function(obj, end) {
		var curtop = 0;
		var height = obj.clientHeight;

		if (obj.offsetParent) {
			while (obj.offsetParent) {
				curtop += obj.offsetTop
					obj = obj.offsetParent;
			}
		} else if (obj.y)
			curtop += obj.y;

		return curtop + (end?height: 0);
	},

	/*
	 * Progress bar
	 */
	ProgressBar: function(_container) {
		this.clear = function () {
			this.progress = [];

			var container = document.getElementById(this.container);
			if (!container) return;

			while (container.childNodes.length > 0)
				container.removeChild(container.childNodes[0]);
		};

		this.update = function (progress, total) {
			if (this.completed) return;

			var id = this.progress.length;
			var time = new Date();
			this.progress[id] = {progress: progress, total: total, time: time.getTime()};
			this.completed = progress == total;
		};

		this.current = function () {
			var id = this.progress.length;

			if (id == 0) return;

			return this.progress[id - 1];
		};

		this.procent = function (_id) {
			var progress = this.progress[_id] || this.current();

			if (progress && progress.progress)
				return Math.round( progress.progress / progress.total * 100 );

			return 0;
		};

		this.speed = function () {
			if (this.progress.length == 0) return;

			var start_at = this.progress.length - Math.floor(this.progress.length * this.SPEED_CALC_LATEST / 100) - 1;

			if (start_at < 0)
				start_at = 0;

			var first = this.progress[start_at];
			var current = this.current();

			var current_progress = current.progress - first.progress;
			var time = (current.time - first.time);

			return (current_progress / time);
		};

		this.estimate = function () {
			if (this.procent() < this.ESTIMATE_MIN_PROGRESS) return ;

			var speed = this.speed();
			var progress = this.current();

			var remaining_progress = progress.total - progress.progress;
			var remaining_time = Math.round(remaining_progress / speed);

			return remaining_time;
		};

		this.draw = function () {
			var container = document.getElementById(this.container);
			if (!container) return;
			container.style.display = 'block';

			var estimate = this.estimate() / 1000;
			var speed = this.speed();
			var procent = this.procent();

			if (container.childNodes.length) {
				var progress_bar = container.getElementsByTagName('div')[0];
				var progress_cell = container.getElementsByTagName('div')[1];
				//progress_cell.style.width = Math.round((progress_bar.offsetWidth - 2) * procent / 100)+'px';

				var debug = container.getElementsByTagName('div')[2];
				var minutes_left = Math.floor(estimate / 60);
				var seconds_left = Math.round(estimate - minutes_left * 60);
				var time_left = '';

				if (minutes_left  + seconds_left > 0)
					time_left = js_info['TIME_LEFT'] + ': ';
				if (minutes_left > 0)
					time_left += minutes_left + " min ";
				if (seconds_left > 0)
					time_left += seconds_left + " s";

				debug.innerHTML = procent + "%&nbsp;&nbsp;&nbsp;" + time_left;
			}
		};

		this.update_draw = function(progress, total) {
			if (this.completed) return;

			this.update(progress, total);
			this.draw();
		};

		this.progress = [];
		this.container = _container || 'progressbar_container';
		this.completed = false;

		/* Don't show estimate until progress reach (x) procent */
		this.ESTIMATE_MIN_PROGRESS = 10;
		/* Speed calculation include latest (x) procent */
		this.SPEED_CALC_LATEST = 30;

		/* Clear container */
		this.clear();

		/* Init the container */

		var container = document.getElementById(this.container);
		if (!container)
			return;

		/* Create progress table */
		var progress_bar = document.createElement('div');
		progress_bar.className = 'progress_bar';

		var progress_cell = document.createElement('div');
		progress_cell.className = 'progress_blue';
		progress_cell.style.width = '0px';

		var debug = document.createElement('div');
		debug.className = 'progress_debug';
		debug.id = 'progress_debug_id';

		progress_bar.appendChild(progress_cell);
		container.appendChild(progress_bar);
		container.appendChild(debug);
		container.appendChild(document.createElement('br'));
	},

	startProgressBar: function(pos) {
		var loading = document.getElementById('loading');
		var dots = "";

		pos %= 4;
		for (var i = 0; i < pos; i++)
			dots += ".";

		document.getElementById('loading_dots').innerHTML = dots;

		pos++;
		loading.timer = setTimeout('blocket.common.startProgressBar('+pos+')', 500);
	},

	/*
	 * Position progress bar
	 */
	showProgressBar: function(obj, posY) {
		var loading = document.getElementById('loading');

		if (!posY)
			posY = 0;

		blocket.common.startProgressBar(1);
		if ($.browser.msie && $.browser.version == "6.0") {
			var pos_fixY = posY-12;
			var pos_fixX = 0;
		} else if ($.browser.msie) {
			var pos_fixY = posY-12;
			var pos_fixX = 170;
		} else {
			var pos_fixY = posY-18;
			var pos_fixX = 70;

		}
		//loading.style.top = '' + (blocket.common.findPosY(obj, true) + pos_fix) + 'px';
		//loading.style.left = '' + (blocket.common.findPosX(obj, true) + 80) + 'px';
		//loading.style.top = '' + (blocket.common.findPosY(obj, true) + pos_fixY) + 'px';
		//loading.style.left = '' + (blocket.common.findPosX(obj, true) + pos_fixX) + 'px';
		loading.style.display = "inline";
	},

	hideProgressBar: function() {
		var loading = document.getElementById('loading');

		clearTimeout(loading.timer);
		loading.style.display = 'none';
		blocket.common.showElement("TipBox", true);
	},

	select_all_weeks: function(_name, _form, _select) {
		for (var i = 1; i < 53; i++) {
			var week = eval("document." + _form + "." + _name + i);

			week.checked = _select;
		}
	},

	/*
	 * Display images. Show border and display large image
	 */

	// If we don't try to do and image load, the resize wont be correct
	// Directly after load we remove the image cause we need next_image to be false for the functions
	fix_next_image: function() {
		var next_image_load = new Image;
		var timestamp = new Date().getTime() / 1000;
		var randomflux = Math.floor(Math.random()*10000);
		next_image_load.src = "/img/" + Math.floor(timestamp) + randomflux + "/none.gif";
	},

	waitForNextImage: function(next_image, ad_id) {
		var ad_id = ad_id ? ad_id : "";
		var image = document.getElementById("display_image" + ad_id).firstChild;

		if (next_image.width > 0) {
			image.width = next_image.width;
			image.height = next_image.height;
		} else {
			setTimeout(function () { blocket.common.waitForNextImage(next_image, ad_id); }, 100);
		}
	},

	resizeImage: function(image, path, next_image, admin) {
		if (!next_image) {
			next_image = new Image;
			next_image.src = path;
		}

		if (next_image.width == 0) {
			next_image.onload = setTimeout(function () { blocket.common.resizeImage(image, path, next_image, admin); }, 0);
			return;
		}

		image.src = next_image.src;

		if (admin && next_image.width > 400) {
			var factor = (next_image.width - 400) / next_image.width;
			image.height = next_image.height * (1 - factor);
			image.width = 400;
		} else {
			image.width = next_image.width;
			image.height = next_image.height;
		}
	},

	showLargeImage: function(strDisplayPath, ad_id, admin) {
		var ad_id = ad_id ? ad_id : "";
		var admin = admin ? admin : false;
		var image = $("#display_image" + ad_id + " > img")[0];
		var map = document.getElementById("hittaframe");

		if (map) {
			map.style.display = 'none';
		}
		if (admin) {
			blocket.common.resizeImage(image, strDisplayPath, null, admin);
		} else {
			if (navigator.userAgent.toLowerCase().indexOf('safari') > 0) {
				var next_image = new Image;
				next_image.src = strDisplayPath;

				image.style.width = 'auto';
				image.style.height = 'auto';
				image.src = next_image.src;
				blocket.common.waitForNextImage(next_image, ad_id);
			} else {
				image.style.width = 'auto';
				image.style.height = 'auto';
				image.src = strDisplayPath;
			}
		}
	},

	flowplayer_conf_new: function(auto_play, auto_buffer) {
		var conf = new Object();

		conf.swf = "/swf/flowplayer.swf";
		conf.fullscreen = false;
		conf.embed = false;
		conf.key = '$298969198910939';

		conf.clip = new Object();
		conf.clip.scaling = 'fit';
		conf.clip.bufferLength = 10;

		if (auto_play) {
			conf.clip.autoPlay = auto_play;
		}

		if (auto_buffer) {
			conf.clip.autoBuffering = auto_buffer;
		}

		return conf;
	},

	/* Video */
	flowplayer_conf: function(video_flv, add_splash, auto_buffer, image_path) {
		var conf = new Object();
		var image_path = image_path ? image_path : false;

		conf.showLoopButton = false;
		conf.showMenu = false;
		conf.autoPlay = false;
		conf.loop = false;
		conf.initialScale = 'fit';
		conf.showFullScreenButton = false;
		conf.useNativeFullScreen = false;
		conf.bufferLength = 10;
		conf.videoFile = video_flv;

		if (auto_buffer) {
			conf.autoBuffering = true;
		} else if (add_splash && video_flv.indexOf('videos') > 0) {
			var video_splash = '';
			if (image_path == false) {
				video_splash = video_flv.replace(/.*videos/, add_splash).replace(/flv/, 'jpg');
			} else {
				var image_id = video_flv.substring(video_flv.lastIndexOf("/"));
				image_id = image_id.replace(/flv/, "jpg");
				video_splash = image_path + image_id.substring(0, 3) + image_id;
			}

			conf.autoBuffering = false;
			conf.splashImageFile = video_splash;
			conf.scaleSplash = true;
		} else if (add_splash && video_flv.indexOf('flush') > 0) {
			var video_splash = video_flv.replace(/flv/, 'splash');

			conf.splashImageFile = video_splash+'/.jpg';
			conf.scaleSplash = true;
		}


		return conf;
	},

	flowplayer_conf_to_string: function(conf) {
		var conf_string = '{';
		for (var i in conf) {
			conf_string += i + ':' + (typeof(conf[i]) == 'string'?"'":'') + conf[i] + (typeof(conf[i]) == 'string'?"'": '');
			conf_string += ',';
		}
		conf_string = conf_string.substring(0, conf_string.length - 1);
		conf_string += '}';
		return conf_string;
	},

	hide_video: function(ad_id) {
		ad_id = ad_id || '';

		var video = document.getElementById('flowplayerholder' + ad_id);
		var image = document.getElementById('display_image' + ad_id);

		if (video) {
			video.style.display = 'none';
			var container = video.parentNode;
			container.removeChild(video);
		}

		if (image)
			image.style.display = 'block';
	},

	show_video: function(video_file, width, height, ad_id) {
		ad_id = ad_id || '';
		var image = document.getElementById('display_image' + ad_id);
		var video = document.getElementById('flowplayerholder' + ad_id);
		var container;
		if (image) {
			container = image.parentNode;
		} else {
			container = video.parentNode;
		}
		var map = document.getElementById('hittaframe');

		var conf = blocket.common.flowplayer_conf(video_file, false);
		conf.autoPlay = true;
		conf = blocket.common.flowplayer_conf_to_string(conf);

		if (ad_id && width > 400)  {
			height = Math.round(400 / width * height);
			width = 400;
		}

		if (map)
			map.style.display = 'none';
		if (!video || container == video.parentNode) {
			if (!video) {
				video = document.createElement('div');
				video.id = 'flowplayerholder' + ad_id;
				container.appendChild(video);
			}

			if (image)
				image.style.display = 'none';

			var fo = {
				movie:"/swf/FlowPlayer.swf",
				width:width,
				height:height,
				majorversion:"7",
				build:"0",
				allowscriptaccess: "never",
				flashvars:"config=" + conf
				};

			UFO.create(fo, "flowplayerholder" + ad_id);

		} else if (video.style.display == 'none')  {
			image.style.display = 'none';
			video.style.display = 'block';
		} else {
			var fo = document.getElementById("flowplayerholder" + ad_id + "_obj");
			var time = fo.getTime();
			var dur = fo.getDuration();
			if (time >= dur)
				fo.Seek(0);


			if (!fo.getIsPaused() && fo.getIsPlaying())  {
				fo.Pause();
			} else {
				fo.DoPlay();
			}
		}
	},

	next_image: function(type) {
		if (!images[counter])
			counter = 0;

		/* If next item is an video, play video */
		if (blocket.common.video_exist == 1 && counter == 0) {
			var v_thumb = document.getElementById('thumb' + images.length);
			v_thumb.name = 'video';
			counter = 0;

			blocket.common.thumbnailBorder(v_thumb, images.length + 1, '', type);
			blocket.common.show_video(video_url, video_width, video_height);

			return;
		}

		/* Preload next image */
		var thumb = document.getElementById('thumb' + counter);
		var image = new Image;
		image.src = images[counter];

		blocket.common.showLargeImage(images[counter]);
		blocket.common.thumbnailBorder(thumb, images.length, '', type);

		blocket.common.set_alt_title('main_pict');

		counter++;
	},

	set_alt_title: function(call_div) {
		var main_image = document.getElementById('main_image');
		var adder = 0;

		if (call_div == 'thumb') {
			adder = 1;
		}

		/* When next thumb is a video, display other alt/title */
		if (blocket.common.video_exist == 1 && counter == images.length - 1 + adder)
		 {
			main_image.alt = js_info['SHOW_AD_VIDEO'];
			main_image.title = js_info['SHOW_AD_VIDEO'];
		} else {
			main_image.alt = js_info['CLICK_FOR_NEXT_IMAGE'];
			main_image.title = js_info['CLICK_FOR_NEXT_IMAGE'];
		}
	},

	styles: [],

	styles_name: [],

	thumbnailBorder: function(thumb, image_num, ad_id, type) {
		var ad_id = ad_id ? ad_id : "";

		if (!thumb)
			return;

		if (thumb.name != 'video')
			blocket.common.hide_video(ad_id);

		if (type == undefined) {
			for (i = 0; i < image_num; i++) {
				var thumb_obj = document.getElementById('thumb' + i + ad_id);
				if (!blocket.common.styles[i]) {
					blocket.common.styles[i] = thumb_obj.className.replace("ad_border_solid_black", "ad_border_solid_grey");
				}

				if (thumb.id == thumb_obj.id) {
					thumb_obj.className = "ad_thumb ad_border_solid_black";
				} else {
					thumb_obj.className = blocket.common.styles[i];
				}
			}

			var thumb_obj = document.getElementById('thumbmap' + ad_id);
			if (thumb_obj) {
				if (!blocket.common.styles_name['thumbmap']) {
					blocket.common.styles_name['thumbmap'] = thumb_obj.className.replace("ad_border_solid_black", "ad_border_solid_grey");
				}

				if (thumb.id == thumb_obj.id) {
					thumb_obj.className = "ad_thumb ad_border_solid_black";
				} else {
					thumb_obj.className = blocket.common.styles_name['thumbmap'];
				}
			}
		} else if (type == 'ikea') {
			for (i = 0; i < image_num; i++) {
				$("#thumb"+i+ad_id).removeClass("thumb_active").addClass("thumb_inactive");
			}
			$(thumb).removeClass("thumb_inactive").addClass("thumb_active");
		}
	},

	goto_hitta: function(link, address_id, zipcode_id, postal_city_id) {
		var address = document.getElementById(address_id);
		var zipcode = document.getElementById(zipcode_id);
		var postal_city = document.getElementById(postal_city_id);

		link.href = "http://www.hitta.se/SearchCombi.aspx?UCSB%3aTextBoxWhere=" + blocket.common.escape_component(address.value) + "+" + zipcode.value.replace(/ /, "") + "+" + blocket.common.escape_component(postal_city.value);
		link.target = '_blank';

		blocket.common.trafikfonden.register_trafikfonden(link, 'http: //www.hitta.se'); /* common.trafikfonden.hitta */

		return true;
	},

	/* Hide image and display image-add input */
	delete_image: function(element_show, element_hide, hidden) {
		var obj1 = document.getElementById(element_show);
		var obj2 = document.getElementById(element_hide);
		blocket.common.showField(obj1.id, "block");

		obj2.innerHTML = "<input type='hidden' name='" + hidden + "' value='1'>";

		return false;
	},

	getElementsByClassName: function(oElm, strTagName, strClassName) {
		var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
		var arrReturnElements = new Array();
		strClassName = strClassName.replace(/\-/g, "\\-");
		var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
		var oElement;
		for(var i=0; i<arrElements.length; i++) {
			oElement = arrElements[i];
			if (oRegExp.test(oElement.className)) {
				arrReturnElements[arrReturnElements.length] = oElement;
			}
		}
		return (arrReturnElements)
	},

	show_hidden_elements: function() {
		var elements = blocket.common.getElementsByClassName(document, "*", 'hide');
		for (var i = 0; i < elements.length; i++) {
			elements[i].className = elements[i].className.replace(/hide/, '');
		}
	},

	show_tabbed_data: function() {
		document.getElementById("tabbed_data").style.display = "block";
		document.getElementById("show_tabbed_text").style.display = "none";
	},

	hide_tabbed_data: function() {
		document.getElementById("tabbed_data").style.display = "none";
		document.getElementById("show_tabbed_text").style.display = "block";
	},

	get_settings: function(setting_name, keylookup_func, settings_root, extra) {
		if (!settings_root)
			settings_root = settings;

		var res;

		for (var i in settings_root[setting_name]) {
			var setting = settings_root[setting_name][i];
			var val;

			val = null;
			if (settings_root[setting_name][i]['keys']) {
				for (var j in settings_root[setting_name][i]['keys']) {
					var key = settings_root[setting_name][i]['keys'][j];
					var key_val = keylookup_func(key, extra);

					if (setting[key_val]) {
						setting = setting[key_val];
					} else {
						if (setting['*']) {
							setting = setting['*'];
						} else {
							break;
						}
					}
				}
				if (setting['value'])
					val = setting['value'];
			} else if (settings_root[setting_name][i]['default']) {
				val = settings_root[setting_name][i]['default'];
			}
			if (val) {
				if (res)
					res += ',' + val;
				else
					res = val;
				if (!settings_root[setting_name][i]['continue'])
					break;
			}
		}

		return res;
	},

	split_setting: function(val) {
		if (!val)
			return {};

		parts = val.replace(/\\,/g, "&44;").split(",");

		var arr = new Array();

		for(i in parts)
		{
		   part = parts[i].replace(/&44;/g, ",");
		   arr.push(part);
		}

		var res = {};

		for (i = 0; i < arr.length; i++) {
			var kv = arr[i].split(':', 2);

			if (kv && kv.length > 1) {
				if (kv[0] in res) {
					res[kv[0]] = [res[kv[0]], kv[1]];
				} else {
					res[kv[0]] = kv[1];
				}
			} else {
				res[arr[i]] = 1;
			}
		}

		return res;
	},

	mergeElementValues: function(arr, htmlCollection) {
		for (var ii = 0; ii < htmlCollection.length; ii++) {
			var elem = htmlCollection[ii];

			if (!elem.getAttribute('name'))
				continue;

			var key = null;
			var options = null;
			if (elem.className) {
				var element_group = elem.className.replace(/.*element_group([0-9]+).*/, "$1");
				if (element_group != "")
					element_group += ".";
				key = element_group + elem.getAttribute('name');

				if (elem.className.match(/(^| )cat_data_select($| )/)) {
					var a = [];
					for (var i = 0; i < elem.options.length; i++) {
						a[i] = elem.options[i];
					}
					options = a;
				}
			} else
				key = elem.getAttribute('name');
			if (key.match(/\[\]$/) && elem.value)
				key += elem.value;
			if (((elem.type == 'radio' || elem.type == 'checkbox') && !elem.checked)) {
				if (typeof arr[key] != "undefined")
					delete arr[key];
			} else if ((elem.value || options) && !elem.disabled) {
				arr[key] = elem.value;
				if (options)
					arr[key + ".options"] = options;
			} else {
				arr[key] = "";
				if (typeof arr[key + ".options"] != "undefined")
					delete arr[key + ".options"];
			}
		}

		return arr;
	},

	setElementValues: function(arr, htmlCollection) {
		for (var ii = 0; ii < htmlCollection.length; ii++) {
			var elem = htmlCollection[ii];

			var options = null;
			if (elem.className) {
				var element_group = elem.className.replace(/.*element_group([0-9]+).*/, "$1");
				if (element_group != "")
					element_group += ".";
				key = element_group + elem.getAttribute('name');
				if (elem.className.match(/(^| )cat_data_select($| )/)) {
					options = arr[key + ".options"];
				}
			} else
				key = elem.getAttribute('name');
			if (key.match(/\[\]$/) && elem.value)
				key += elem.value;
			var value = arr[key];

			if (elem.type == 'radio' || elem.type == 'checkbox') {
				if (value == elem.value)
					elem.checked = true;
			} else if (value || options) {
				if (options) {
					elem.options.length = 0;
					for (var i = 0; i < options.length; i++) {
						elem.options[i] = options[i];
					}
					elem.disabled = false;
				}
				elem.value = value;
			}
		}
	},

	/*
	 * AJAX
	 */

	running_xmlhttp_objects: 0,

	ajax_request: function(dest, post, callback, params, evaluate, method) {
		var xmlhttp = false;
		if (method == null) {
			method = "POST";
		}

		if (typeof evaluate == "undefined")
			evaluate = true;
		try {
			xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {
			// browser doesn't support ajax. handle however you want
			// XXX ? callback(false, xmlhttp, params);
		}

		if (xmlhttp !== false) {
			if (callback) {
				xmlhttp.onreadystatechange = function () { blocket.common.ajax_callback(callback, params, xmlhttp, evaluate); };
			}
			xmlhttp.open(method, dest, true);
			xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			blocket.common.running_xmlhttp_objects++;
			xmlhttp.send(post);
		}
	},

	ajax_callback: function(callback, params, xmlhttp, evaluate) {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200 && xmlhttp.responseText.indexOf('<!DOCTYPE') < 0) {
				if (evaluate)
					callback(eval("(" + xmlhttp.responseText + ")"), xmlhttp, params);
				else
					callback(xmlhttp.responseText, xmlhttp, params);
			} else {
				callback(false, xmlhttp, params);
			}
			blocket.common.running_xmlhttp_objects--;
		}
	},

	escape_component: function(str) {
		return escape(str).replace('+', '%2b');
	},

	gallery_price_update: function(checkbox) {
		$("#inv_price_checked").toggle();
		$("#inv_price_unchecked").toggle();
	},

	quiz_result: function(result, xmlhttp, form) {
		if (!result) {
			$(".prize_info").hide();
			$(".errors").show();
			$(".error").hide();
			$("#err_quiz_pnr").show();
			result = new Array();
			result['status'] = 'ERROR';
		} else if (result['status'] == 'OK') {
			form.reset();
			var divs = form.getElementsByTagName('div');
			for(var i in divs) {
				var e = divs[i];
				if (e.className && e.className.match(/okey/)) {
					e.style.display = 'block';
				}
			}
			$("#quiz_thanks").show();
			$(".prize_tickets").hide();
		} else {
			$(".prize_info").hide();
			$(".errors").show();
			$(".error").hide();
			for(var key in result) {
				var err = document.getElementById('err_quiz_' + key);
				if (err) {
					err.style.display = 'block';
				}
			}
		}
	},

	quiz_submit: function(form) {
		var post = '';
		var action = form.getAttribute('action');
		for (var i = 0; i < form.elements.length; i++) {
			var temp = form.elements[i];
			if (temp.name) {
				if (temp.type == "radio") {
					if (temp.checked)
						post += temp.name + '='+temp.value+'&';
				} else if (temp.type == "checkbox") {
					post += temp.name + '=' + (temp.checked ? '1' : '0') + '&';
				} else {
					post += temp.name + '=' + blocket.common.escape_component(temp.value).replace(/%u[0-9][0-9][0-9][0-9]/g, '%3F') + '&';
				}
			}
		}
		var divs = form.getElementsByTagName('div');
		for(var i in divs) {
			var e = divs[i];
			if ((e.id && e.id.match(/^err_/)) || (e.className && e.className.match(/okey/))) {
				e.style.display = 'none';
			}
		}
		blocket.common.ajax_request(action, post, blocket.common.quiz_result, form, true, "POST");
		return false;
	},

	eframe_category: function(ecommerce_url,cat_id) {
		$("#e_li_frame").attr('onload', '');
		$("#e_li_frame").attr('src', ecommerce_url+ "/puff_search?cat_id=" + cat_id);
	},

	/* Log to Firebug console */
	log: function(message) {
		if (typeof(console) !== 'undefined' && console != null && blocket.common.getCookie('console_log') == '1')
			console.log(message);
	},
	is_location: function(location_name) {
		if (typeof location_name === 'object'){
			for (var key in location_name){
				if (new RegExp('/'+location_name[key]+'/','i').test(document.location.pathname)){
					return true;
				}
			}
		} else {
			return (new RegExp('/'+location_name+'/','i').test(document.location.pathname));
		}
	},
	setAreas: function(region_selector, area_selector, area_readonly) {
		var munics;
		var i = 1;
		var region = region_selector.value;

		if (region > 0)
			munics = regionArray[region]['municipality'];

		if (!munics)
			return;

		var arr = Array();
		for (var k in munics) {
			var areas = munics[k]['subarea'];

			arr[k] = new Array();
			arr[k]['area'] = munics[k]['name'];
			if (areas) {
				for (var a in areas) 
					arr[k][a] = ' \xa0  - ' + areas[a]['name'];
			}
		}

		var oldArea = area_selector.value;
		area_selector.options.length = 1;
		var firstArea;
		var str;
		for (var a in arr) {
			area_selector.options[i] = new Option(arr[a]['area'], a);
			if (oldArea == a)
				area_selector.options[i].selected = true;

			for (var b in arr[a]) {
				if ( b != 'area' ) {
					if (i++ == 1)
						firstArea = arr[a]['area'];

					str= a + ':' + b;
					area_selector.options[i] = new Option(arr[a][b], str);
					if (oldArea == str)
						area_selector.options[i].selected = true;
				}

			}

			if (i++ == 1)
				firstArea = arr[a]['area'];
		}
		if (i == 2) {
			area_selector.style.display = "none";
			area_selector.options[1].selected = true;
			area_readonly.innerHTML = firstArea;
		} else {
			area_selector.style.display = "block";
			area_readonly.innerHTML = '';
		}
	}
});


// USAGE
// eventListner.bind(*'[function|string]', *[function], [namespace])
// eventListner.bind('blocket.apps.news.truncate', function() {console.log('truncate')}, 'truncate')

// eventListner.unbind(*'[function|string]', [namespace])
// eventListner.unbind('blocket.apps.news.truncate', 'truncate')

eventListener = {
        find: function(trigger) {

		if (typeof trigger === 'undefined') {
			throw 'TypeError: arguments[0] is undefined';
		} else if (typeof trigger !== 'string') {
			throw 'TypeError: arguments[0] is not a string';
		} 

                var c = trigger.split('.');
                var func = window;
                var name = 'window';
                var depth = window;

                (function search(o) {
                        func = func[o[0]];
                        name = o.shift();
                        if (o.length > 0) {
				if (typeof func === 'undefined') {
					throw 'TypeError: ' + trigger.split('.' + o[0])[0] + ' is undefined';
				}
				depth = func;
                                search(c);
                        }
                })(c);

		if (typeof depth[name] === 'undefined') {
			throw 'TypeError: ' + trigger + ' is undefined';
		}

                return {
                        func: func,
                        name: name,
                        depth: depth
                }
        },
        bind: function(trigger, action, namespace) {
                var
                        t = trigger,
                        a = action,
                        n = namespace

                t = this.find(t);

                var     d = '___' + t.name;


		if (typeof a === 'undefined') {
			throw 'TypeError: arguments[1] is undefined';
		} else if (typeof a !== 'function') {
			throw 'TypeError: arguments[1] is not a function';
		} 
		if (typeof n !== 'undefined' && typeof n !== 'string') {
			throw 'TypeError: arguments[2] is not a string';
		} 


		if (typeof t.depth[d] === 'undefined') {
                        t.depth[d] = t.func;
                        t.depth[d].__proto__.___actions = [];
		}
		if (typeof n !== 'undefined') {
			t.depth[d].___actions[n] = a;
		} else {
			t.depth[d].___actions.push(a);
		}

		if (typeof t.depth[t.name] === 'function') {
			t.depth[t.name] = function() {
				var result = t.depth[d].apply(t.depth, arguments);
				for (var k in t.depth[d].___actions) {
					if (typeof t.depth[d].___actions[k] === 'function') {
					    t.depth[d].___actions[k].call(t.depth, arguments, result);
					}
				}
				return result
			}
		} else if (typeof t.depth[t.name] === 'number' || typeof t.depth[t.name] === 'string') {
			t.depth.__defineSetter__(t.name, function(v) {
				var from = t.depth[d];
				t.depth[d] = v;
				for (var k in t.depth[d].___actions) {
					if (typeof t.depth[d].___actions[k] === 'function') {
					    t.depth[d].___actions[k](from, arguments[0]);
					}
				}
			});
			t.depth.__defineGetter__(t.name, function() {
				return t.depth[d];
			});
		}
		for (var k in t.depth[d]) {
			t.depth[t.name][k] = t.depth[d][k];
		}
                return true
        },
        unbind: function(trigger, namespace) {
                var
                        t = trigger,
                        n = namespace

                t = this.find(t);
                        
		if (typeof n !== 'undefined' && typeof n !== 'string') {
			throw 'TypeError: arguments[2] is not a string';
		} 

                var     d = '___' + t.name;

                if (typeof t.depth[d] !== 'undefined') {
                        if (typeof n === 'string') {
				var i = 0;
                                for (var k in t.depth[d].___actions) {
                                        if (k === n) {
                                                t.depth[d].___actions.splice(i,1);
						break;
                                        }
					i++;
                                }
				return false
                        } else {
				t.depth[d].___actions.splice(0,t.depth[d].___actions.length)
                        }
                }
                return true
        }
}
/*!** End file: common.js ***/
/*!** Begin file: inception.extensions.js ***/
blocket("@tools.base64").extend({

	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
		}
 
		return output;
	},

	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}

		return output;
	},

	recursiveDecode : function(node) {
		for (var x in node) {
			if (typeof(node[x]) == "object") {
				node[x] = this.recursiveDecode(node[x]);
			} else {
				node[x] = this.decode(node[x]);
			}
		}
		return node;
	}
});

blocket("@tools").extend({
	leetify : function() {
		$("strong,div,a,span,p,h1,h2").each(function () {
			if($(this).children().length > 0)
				return;
			$(this).text($(this).text().replace("O","0")); 
			$(this).text($(this).text().replace("o","0")); 
			$(this).text($(this).text().replace("S","5")); 
			$(this).text($(this).text().replace("s","5")); 
			$(this).text($(this).text().replace("A","4")); 
			$(this).text($(this).text().replace("a","4")); 
			$(this).text($(this).text().replace("E","3")); 
			$(this).text($(this).text().replace("e","3")); 
			$(this).text($(this).text().replace("E","3")); 
			$(this).text($(this).text().replace("e","3")); 
			$(this).text($(this).text().replace("T","7")); 
			$(this).text($(this).text().replace("t","7")); 
			$(this).text($(this).text().replace("I","1")); 
			$(this).text($(this).text().replace("i","1")); 
			$(this).text($(this).text().replace("B","8")); 
			$(this).text($(this).text().replace("b","6")); 
		} );
		alert("Istället för att köra det här tycker vi att du ska skicka ditt CV till jobb@blocket.se eller gå in på www.blocket.se/jobb");
	}
});

blocket("@tools").extend({

	nodeCount : function(o) {
		var c = 0;
		for (var k in o) {
			if (o.hasOwnProperty(k)) {
				++c;
			}
		}
		return c;
	},

	sort : function(o) {

	}
});

blocket("@tools").extend({

	swfobject : function() {
		blocket.include("/js/swfobject.js");
	}
});


/*!** End file: inception.extensions.js ***/
/*!** Begin file: b_onload.js ***/
/**
 * Blocket onload queue handler
 *
 */

blocket("@common.onload_queue").extend({
	queue: [],

	/**
	 * Process all functions added to a queue with specified prio
	 */
	handler: function(prio) {
		if (typeof(this.queue[prio]) == "undefined") {
			return;
		}

		for(var i = 0; i < this.queue[prio].length; i++) {
			try {
				this.queue[prio][i].onload_function(this.queue[prio][i]);
			} catch(ex) {
				console.log(ex);
			}
		}
	},

	/**
	 * Add an object to a specific queue
	 * The object must contain a function parameter to be valid
	 */
	add: function(obj, prio) {
		if (typeof(this.queue[prio]) == "undefined") {
			this.queue[prio] = Array();
		}

		try {
			this.queue[prio][this.queue[prio].length] = obj;
		} catch(ex) {
			console.log(ex);
		}
	},

	original_onload: window.onload
});

window.onload = function() {
	blocket.common.onload_queue.handler('high');
	blocket.common.onload_queue.handler('medium');
	blocket.common.onload_queue.handler('low');
	if (blocket.common.onload_queue.original_onload) {
		blocket.common.onload_queue.original_onload();
	}
};
/*!** End file: b_onload.js ***/
/*!** Begin file: prototypes.js ***/
/* Add support for trim to < IE8 */
if (typeof(String.prototype.trim) != "function") {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g,"");
	}
}

/**
* Returns the week number for this date. dowOffset is the day of week the week
* "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
* the week returned is the ISO 8601 week number.
* @param int dowOffset
* @return int
*/
Date.prototype.getWeek = function (dowOffset) {
	/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

	var newYear = new Date(this.getFullYear(),0,1);
	var day = newYear.getDay() - dowOffset; //the day of week the year begins on
	day = (day >= 0 ? day : day + 7);
	var daynum = Math.floor((this.getTime() - newYear.getTime() -
				(this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
	var weeknum;
	//if the year starts before the middle of a week
	if(day < 4) {
		weeknum = Math.floor((daynum+day-1)/7) + 1;
		if(weeknum > 52) {
			nYear = new Date(this.getFullYear() + 1,0,1);
			nday = nYear.getDay() - dowOffset;
			nday = nday >= 0 ? nday : nday + 7;
			/*if the next year starts before the middle of
			the week, it is week #1 of that year*/
			weeknum = nday < 4 ? 1 : 53;
		}
	} else {
		weeknum = Math.floor((daynum+day-1)/7);
		if (weeknum == 0) {
			var d = newYear;
			d.setDate(0);
			return d.getWeek(dowOffset);
		}
	}
	return weeknum;
};

/* Global elementary functions */
function isDefined(obj) {
	return typeof obj !== "undefined" && obj !== null;
}


/* var_dump like function */
function dump(arr, level) {
	var dumped_text = "";

	if (!level) {
		level = 0;
	}

	// The padding given at the beginning of the line
	var level_padding = "";

	for (var j =  0; j < level + 1; ++j) {
		level_padding += "    ";
	}

	if (typeof(arr) == "object") { // Arrays/Objects
		for (var item in arr) {
			var value = arr[item];

			if (value != null) {
				if (typeof(value) == "object") { // If it is an array
					dumped_text += level_padding + "'" + item + "' (" + value.length + ")\n";
					dumped_text += dump(value, level + 1);
				} else {
					dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
				}
			} else {
				dumped_text += level_padding + "'" + item + ": NULL \n";
			}
		}
	} else { // Strings/Booleans/Numbers etc.
		dumped_text = "===>" + arr + "<===(" + typeof(arr) + ")";
	}

	return dumped_text;
}
/*!** End file: prototypes.js ***/
/*!** Begin file: events.js ***/
blocket("@common.events").extend({
	global_pending_events: 0,
	service_status: [],

	set_service_status: function(service, status) {
		blocket.common.events.service_status[service] = status;
	},

	check_service: function(e, args) {
		if (service_enabled[args.service] != "1") {
			blocket.common.events.set_service_status(args.service, false);
			return;	
		}

		$.ajax({
			type: "GET",
			url: "/service.xml?service="+args.service,
			success: function(msg){
				blocket.common.events.set_service_status(args.service, (msg.getElementsByTagName('status')[0].firstChild.nodeValue == "OK"));
				blocket.common.category_dropdown.update_freespee_info(e,args);
			}
		});

		blocket.common.events.set_service_status(args.service, true);
	},

	clear_textarea_if: function(e, args) {
		var elem = document.getElementById(args.id);

		if (elem) {
			var v = elem.getAttribute(args.condvar);
			if (v && v == "1") {
				elem.setAttribute(args.condvar, '0');
				elem.value='';
			}
		}
	},


	display_element: function(e, args) {
		var elem = document.getElementById(args.id);

		if (elem) {
			elem.style.display = args.style;

			if(/^\s*$/.test(elem.innerHTML)) {
				elem.style.display = "none";
			}
		}
	},

	info_text: function(e, args) {
		var elem = document.getElementById(args.id);

		if (elem == null)
			return;

		if (elem.value == js_info[args.key] && args.style == "none") {
			elem.value = '';
			$(elem).removeClass('text_info');
			elem.removeAttribute("spellcheck");
		} else if (args.style == "block" && elem.value == "") {
			elem.value = js_info[args.key];
			$(elem).addClass('text_info');
			elem.setAttribute("spellcheck", "false");
		}
	},

	set_html: function(e, args) {
		var elem = document.getElementById(args.id);

		if (elem)
			elem.innerHTML = args.html;
	},

	set_focus: function(e, args) {
		if (args.check_focused && blocket.common.focused)
			return;
		for (var i in args.id) {
			var id = args.id[i];

			if (args.sel_id)
				id += this.getAttribute("sel_id");

			var element = document.getElementById(id);
			if (element && element.offsetWidth) {
				if (!args.only_if_empty || !element.value || element.value.length == 0)
					element.focus();
				break;
			}
		}
	},

	show_by_feature: function(e, args) {
		var id = args.id;
		var feat = args.feat;
		var klfun = args.klfun;
		var style = args.style;

		var elem = document.getElementById(id);
		if (!elem)
			return;

		if (!feat)
			feat = id;
		if (!klfun)
			klfun = blocket.common.category_dropdown.form_key_lookup;
		if (!style)
			style = '';
		
		var f = blocket.common.split_setting(blocket.common.get_settings(feat, klfun, category_features));
		if (f && f.show > 0) {
			elem.style.display = style;
		} else {
			elem.style.display = 'none';
		}
	},

	/*
	 * Registers all events to objects
	 * (uses root so that object searching can be narrower)
	 */
	register_events: function(events, root) {
		for (var event_id in events) {
			var current_event = events[event_id];
			var elements = [];

			/* Get all involved elements */
			if (current_event.id) {
				var element = root.getElementById(current_event.id);
				if (element)
					elements = [element];
			} else if (current_event.name) {
				elements = root.getElementsByName(current_event.name);
			} else if (current_event.array_name) {
				var element;
				var i = 0;
				while (element = root.getElementsByName(current_event.array_name + '[' + i + ']')[0]) {
					elements[i++] = element;
				}	
			} else if (current_event.array_id) {
				var element;
				var i = 0;
				while (element = root.getElementById(current_event.array_id + i)) {
					elements[i++] = element;
				}	
			}

			/* Check if object exists to attach event to */
			for (var element_index = 0; element_index < elements.length; element_index++) { 
				var element = elements[element_index];

				/* Init event id array */
				if (!element.event_ids)
					element.event_ids = [];

				/* Check if current event already have been attached to the object */
				if (blocket.common.isInArray(event_id, element.event_ids))
					continue;

				/* Store current event id */
				element.event_ids[element.event_ids.length] = event_id;

				/* Hijack the element, create an event array */
				if (!element.events)
					element.events = [];

				/* Create array for each event trigger (Support for multiple events each event) */
				if (!element.events[current_event.trigger])
					element.events[current_event.trigger] = [];

				/* Store the event in the objects event array */
				element.events[current_event.trigger][element.events[current_event.trigger].length] = current_event;

				/* Load events */
				if (current_event.trigger == 'init') {
					blocket.common.events.call_event_timeout(element, 'init', 0);
				} else if (element.attachEvent) {
					/* Add an event listener to the object */
					element.attachEvent("on" +  current_event.trigger, /* The event trigger name */
							blocket.common.events.call_event /* Event callback */
							);
				} else {
					element.addEventListener(current_event.trigger, /* The event trigger name */
							blocket.common.events.call_event, /* Event callback */
							true); /* Event bubbling */
				}
			}
		}
	},

	/*
	 * Event call back handler
	 */
	call_event: function(e) {
		/* This element */
		var element = this;
		var type = e.type;

		/* TODO srcElement is not necessarily the element we registered to. */
		if (window.event)
			element = window.event.srcElement;

		if (element.asyncs > 0) {
			/* Already running, reschedule ourselves. */
			blocket.common.events.call_event_timeout(element, type, 50);
			return;
		}

		blocket.common.events.global_pending_events++;
		element.asyncs = 1;

		/* Go through all events linked to the element event type */
		for (var ep in element.events[type]) {
			var current_event = element.events[type][ep];

			if (!current_event.bubble) {
				/* Don't do events below this object*/
				if (window.event) {
					window.event.cancelBubble = true;
				} else if (e && e.stopPropagation) {
					e.stopPropagation();
				}
			}

			/* Execute all actions in the current event */
			for (var function_index in current_event.action) {
				var function_conf = current_event.action[function_index];
				var f = eval(function_conf.name);
				var args = function_conf.args;

				/* 
				 * (element, f, args) need local binding within the higher order function. To bind them, we need to
				 * create a higher higher order function and evalutate it to force the binding.
				 */
				var run_me = (function (element, f, args) {
						return (function () {
							/* Get function reference */
							/* Execute function as if it was called by THIS, and send the event argument */
							f.call(element, [element, type], args);
						});
					})(element, f, args);

				if (function_conf.async) {
					blocket.common.events.global_pending_events++;
					element.asyncs++;
					run_me();
				} else
					blocket.common.events.queue_document_change([element, type], run_me);
				run_me = null;
			}
		}

		blocket.common.events.global_pending_events--;
		if (--element.asyncs == 0) {
			blocket.common.events.run_document_changes(element);
		}
	},

	queue_document_change: function(e, f) {
		var element = e[0];

		if (!element.document_changes || element.document_changes === "")
			element.document_changes = [];
		element.document_changes[element.document_changes.length] = f;
	},

	event_async_done: function(e) {
		var element = e[0];
		var type = e[1];

		blocket.common.events.global_pending_events--;
		element.asyncs--;

		if (element.asyncs == 0) {
			blocket.common.events.run_document_changes(element);
		}
	},

	run_document_changes: function(element) {
		while (element.document_changes) {
			var to_run = element.document_changes;
			element.document_changes = "";

			/* LIFO */
			for (var i = to_run.length - 1; i >= 0; i--) {
				var f = to_run[i];

				f();
			}
		}
	},

	call_event_timeout: function(element, type, time) {
		setTimeout(function() { blocket.common.events.call_event.call(element, {'type' : type}) }, time);
	}
});
/*!** End file: events.js ***/
/*!** Begin file: compatmode_tracking.js ***/
blocket.common.onload_queue.add( {
	onload_function: function(obj) {
		var ua = navigator.userAgent.match(/MSIE [0-9]*/);

		if (ua && document.documentMode !== undefined) {
			var version = parseInt(ua[0].replace(/[^0-9]/g, ""));
			if (version !== document.documentMode) {
				var img = document.createElement("IMG");
				var time = new Date().getTime();
				img.style.display = "none";
				img.alt = "EmediateAd";
				img.src = "//ads.aftonbladet.se/eas?camp=70457;cre=img;ord=" + time.toString();
				document.getElementsByTagName("body")[0].appendChild(img);
			}
		}
	}
}, 'low' );

/*!** End file: compatmode_tracking.js ***/
/*!** Begin file: ajax.js ***/
blocket("@common.ajax").extend({
	form_submit_result: function(result, xmlhttp, form) {

		if (!result) {
			result = new Array();
			result['status'] = 'ERROR';
		}

		if (result['status'] == 'OK') {
			form.reset();
			var divs = form.getElementsByTagName('div');
			for(var i in divs) {
				var e = divs[i];
				if (e.className && e.className.match(/okey/)) {
					e.style.display = 'block';
					$(e).removeClass("hide");
				}
			}
		} else {
			for(var key in result) {
				var err = document.getElementById('err_' + key);

				if (err) {
					err.innerHTML = result[key];
					err.style.display = 'inline';
				} 
			}
		}
	},

	form_ajax_submit: function(form) {
		var post = '';

		var action = form.getAttribute('action');

		for (var i = 0; i < form.elements.length; i++) {
			var temp = form.elements[i];

			if (temp.name) {
				if (temp.type == "radio") {
					if (temp.checked)
						post += temp.name + '='+temp.value+'&';
				} else if (temp.type == "checkbox") {
					post += temp.name + '=' + (temp.checked ? '1' : '0') + '&';
				} else {
					post += temp.name + '=' + blocket.common.escape_component(temp.value).replace(/%u[0-9][0-9][0-9][0-9]/g, '%3F') + '&';
				}
			}
		}
		var divs = form.getElementsByTagName('div');
		for(var i in divs) {
			var e = divs[i];
			if ((e.id && e.id.match(/^err_/)) || (e.className && e.className.match(/okey/))) {
				e.style.display = 'none';
			}
		}
		blocket.common.ajax_request(action, post, blocket.common.ajax.form_submit_result, form, true, "POST");

		return false;
	}
});
/*!** End file: ajax.js ***/
/*!** Begin file: category_dropdown.js ***/
blocket("@common.category_dropdown").extend({
	form_key_lookup: function(key, sel_id) {
		sel_id = sel_id ? sel_id : '';

		if (key == 'b__lang') {
			return lang;
		}

		if (key == 'type') {
			var selectType = document.getElementById("type" + sel_id);

			if (selectType && selectType.tagName != 'SELECT') /* IE fix */
				selectType = false;

			if (selectType) {
				return selectType.value;
			} else {
				var cont = document.getElementById("type_container" + sel_id);
				var inputs = cont.getElementsByTagName('INPUT');

				for (var idx = 0; idx < inputs.length; idx++) {
					if (inputs[idx].type == 'radio' && inputs[idx].checked)
						return inputs[idx].value;
				}
				return 's';
			}
		}

		var category_group = document.getElementById("category_group" + sel_id);
		var sub_cat = document.getElementById("sub_category" + sel_id);
		var cat_id_elem = document.getElementById("cat_id");
		var cat_id;

		if (cat_id_elem && cat_id_elem.value != 0)
			cat_id = cat_id_elem.value;
		else if (sub_cat && sub_cat.style && sub_cat.style.display != 'none' && sub_cat.value != 0 && category_list[sub_cat.value].parent == category_group.value)
			cat_id = sub_cat.value;
		else
			cat_id = category_group.value;

		if (key == "category")
			return cat_id;
		if (key == "parent" && category_list[cat_id])
			return category_list[cat_id]['parent'];

		if (key == "has_store" || key == "store") {
			var store_row = document.getElementById('store_row');
			var res;

			if (store_row)
				res = store_row.style.display != 'none';
			else
				res = document.getElementById('store_holder') != null;
			if (res)
				return 1;
			else
				return 0;
		}
		
		if (key == "company_ad") {
			if ($('#c_ad').attr('type') == 'radio') {
				return document.getElementById('c_ad').checked ? 1 : 0;
			} else {
				return $('#c_ad').val();
			}
		}

		var elem = document.getElementById(key + sel_id);
		if (elem) {
			return elem.value;
		}
	},

	show_category_types: function(e, args) {
		var sel_id = this.getAttribute("sel_id");
		var selectType = document.getElementById("type" + sel_id);
		var selected;

		/* Don't display type radio buttons when editing an old category ad */
		if (selectType && selectType.type == 'hidden')
			return 0;

		if (selectType && selectType.tagName != 'SELECT')
			selectType = false;

		/* Get the selected type */
		if (selectType) {
			for (i = 0; i < selectType.options.length; i++) {
				if (selectType[i].selected)
					selected = selectType[i].value;
			}
		}

		var types = blocket.common.get_settings('types', blocket.common.category_dropdown.form_key_lookup, category_settings, sel_id);
		var type = types.split(',');

		if (!selectType) {
			for (var t in type) {
				var radio = document.getElementById("r" + type[t] + sel_id);
				if (radio && radio.checked) {
					selected = type[t];
					break;
				}
			}
		}

		/* Store new type options for this category */
		if (selectType) {
			selectType.options.length = 1;
			for (i = 0; i < type.length; i++) {
				selectType.options[i+1] = new Option(typeList[type[i]], type[i]);
				
				if (selected == type[i])
					selectType.options[i+1].selected = true;
			}
		} else {
			/* Don't try to optimize this code, it wont work for older ie if you do! */
			var cont = document.getElementById("type_container" + sel_id);

			cont.innerHTML = '';

			if (type.length > 1) {
				var inner_html = ''; 

				for (var i in type) {
					var t = type[i];
					if (inner_html != "")
						inner_html += "&nbsp;";
					inner_html += '<input name="type" value="' + t + '" ' + (t == "s" ? 'checked="checked"' : '') + ' id="r' + t + sel_id + '" type="radio" sel_id="' + sel_id + '"> <label for="r' + t + sel_id + '">' +typeList[t] + '</label>&nbsp;';
				}

				cont.innerHTML = inner_html;
			}

			blocket.common.events.register_events(jsevents.ai, document);

			if (selected) { 
				blocket.common.setChecked("r" + selected + sel_id, true);
			}
		}
	},

	set_category_changed: function() {
		var sel_id = this.getAttribute("sel_id");
		var selectType = document.getElementById("type" + sel_id);
		if (document.getElementById('category_changed' + sel_id)) {
			var cat_id = blocket.common.category_dropdown.form_key_lookup('category', sel_id);
			document.getElementById('category_changed' + sel_id).value = (cat_id != document.getElementById('original_category' + sel_id).value) ? '1' : '0';
		}
	},

	show_sub_category: function(e, args) {
		var sel_id = this.getAttribute("sel_id");

		var ikea_categories = 0;
		if (this.getAttribute('ikea_categories') == '1')
			ikea_categories = 1;

		var show_price = 1;
		var cat_list = category_list;
		var cat_order = category_order;

		if (args && args.noprice)
			show_price = 0;

		if (ikea_categories > 0) {
			cat_list = category_list_ikea;
			show_price = 0;
		}

		var category_group = document.getElementById("category_group" + sel_id);
		var sub_cat = document.getElementById("sub_category" + sel_id);
		var company_ad = $('#pi_c_ad').attr("checked") ? 1 : 0;
		var par_id = category_group.value;

		var sub_cats = Array();
		if (cat_list[par_id] && cat_list[par_id]['level'] > 0) {
			for (var u = 0; u < cat_order.length; u++) {
				if (cat_list[cat_order[u]]['parent'] == par_id)
					sub_cats[sub_cats.length] = cat_order[u];
			}
		}

		if (sub_cats.length > 0) {
			sub_cat.options.length = 1;
			for (var i = 0; i < sub_cats.length; i++) {
				var cat_id = sub_cats[i];
				var name = cat_list[cat_id]['name'];
				if (show_price > 0) {
					var price = blocket.common.split_setting(blocket.common.get_settings('price', 
								 function (key) {
									if (key == "company_ad")
										return company_ad;
									if (key == "category")
										return cat_id;
									if (key == "parent" && cat_list[cat_id])
										return cat_list[cat_id]['parent'];
								 },
								 category_settings));

					if (price)
						name += " \xA0 " + price.price + " " + js_info['MONETARY_UNIT'];
				}
				sub_cat.options[i + 1] = new Option(name, sub_cats[i]);
			}
			sub_cat.style.display = 'block';
			sub_cat.disabled = false;
		} else {
			sub_cat.style.display = 'none';
			sub_cat.disabled = true;
		}
	},

	update_freespee_info: function(e, args) {
		var sel_id = document.getElementById("p_ad");
		if (!sel_id) {
			return;
		}
		sel_id = sel_id.getAttribute("company_ad");
		var fs = blocket.common.split_setting(blocket.common.get_settings('freespee', blocket.common.category_dropdown.form_key_lookup, freespee_settings, sel_id));

		if (document.getElementById('freespee') == null) {
			return;
		}

		var cb = document.getElementById('freespee');

		if (blocket.common.events.service_status && fs) {
			var fs_elem = document.getElementById('freespee_info');
			var fs_elem_label = document.getElementById('freespee_info_label');
			var new_vis = "none";

			if ((cb.checked == true || blocket.common.events.service_status['freespee'] == true) && fs['visible'] == 1) {
				var fs_text = document.getElementById('freespee_text');
				if (fs_text) {
					var freespee_price = blocket.common.split_setting(blocket.common.get_settings('freespee_price', blocket.common.category_dropdown.form_key_lookup, freespee_settings, sel_id));
					if (freespee_price && freespee_price['price'])
						pinfo = js_info['INFO_AI_FREESPEE_PRICEINFO'].replace('#freespee_price#', freespee_price['price']);
					else
						pinfo = '';
					var ca = 11;
					/* ca = blocket.common.queryString('ca'); if (!ca || ca == -1) ca = '11'; */
					var s = js_info['INFO_AI_FREESPEE'].replace('#freespee_price_info#', pinfo).replace('#caller#', ca);
					fs_text.innerHTML = s;
				}
				new_vis = "block";
			} else {
				if (cb)
					cb.checked = false;
			}
			if (fs_elem)
				fs_elem.style.display = new_vis;
			if (fs_elem_label)
				fs_elem_label.style.display = new_vis;
		}
	}
});
/*!** End file: category_dropdown.js ***/
/*!** Begin file: clean_form.js ***/
blocket("@common.clean_form").extend({
	set_on_change: function(e, args) {
		var elements = $(":"+args.type+"");

		elements.each(function() { 
			var re = /[^\x04\s\x1e-\xfe]/g;
			if ($(this).is('textarea#body')) 
				/* Allow bullets (U+2022), but only in the body text. */
				var re = /[^\x04\s\x1e-\xfe\u2022\u25AA\u25AB]/g;

			$(this).unbind('change.clean_form');

			$(this).bind('change.clean_form', function() {
				blocket.common.clean_form.clean_field($(this), re);
			}); 
		});
	},

	clean_field: function(field, remove_regex) {
		if (field.attr("type") != "file") {
			var s = field.val().replace(remove_regex, "");
			s = s.replace(/\x04/g, "\n");
			field.val(s);
		}
	}
});

blocket("@init.common.clean_form").extend(function() {
	var args = Array();
	args['type'] = "input";
	blocket.common.clean_form.set_on_change(null, args);
});
/*!** End file: clean_form.js ***/
/*!** Begin file: searchbox.js ***/
/* Searchbox car extras */ blocket("@apps.searchbox").extend({ types_checked: null,
	toggle_carcolor: function(color, color_name) {
		var car_color = $("#car_" + color);

		if (car_color.hasClass("car_" + color + "_off")) {
				// Set color class as on
				car_color.addClass("car_" + color + "_on");
				car_color.removeClass("car_" + color + "_off");
				car_color.prop("alt", color_name+" vald");
				car_color.prop("title", color_name + " vald");
				car_color.removeClass("sprite_list_car_color_" + color).addClass("sprite_list_car_color_" + color + "_on");

				// Activate and set hidden input value
				$("#cx_car_" + color).val("1");
				$("#cx_car_" + color).removeAttr("disabled");
		} else {
				// Set color class as on
				car_color.addClass("car_" + color + "_off");
				car_color.removeClass("car_" + color + "_on");
				car_color.prop("alt", color_name);
				car_color.prop("title", color_name);
				car_color.removeClass("sprite_list_car_color_" + color + "_on").addClass("sprite_list_car_color_" + color);

				// Activate and set hidden input value
				var hidden = $("#cx_car_" + color);
				hidden.val("");
				hidden.prop("disabled", true);
		}

	},

	bind_multiselect_option_click: function() {
		var isBostadMap = location.pathname.substr(0, 6) == "/karta";
		$(".bootstrap-select .dropdown-menu li").each(function(index) {
			var val = $("#searcharea_region_multiselect").find("option:eq(" + index + ")").val();
			$(this).attr("data-value", val);
		}).click(function() {
			var me = $(this);
			if (me.hasClass("selected"))
				return;
			if (me.find(".text").text().substr(0, 1) == "-") {
				// We clicked on a subgroup, find parent and remove selection there, if any
				var parent = me.attr("data-value").split("_")[0];
				if (me.closest(".dropdown-menu").find("li.selected[data-value=" + parent + "]").length == 1) {
					// Parent is selected, deselect it
					var selections = [];
					me.closest(".dropdown-menu").find("li.selected").each(function() {
						var val = $(this).attr("data-value");
						if (val != parent)
							selections.push(val);
					});
					$(".selectpicker").selectpicker("val", selections);
				}
			}
			else {
				// Deselect any possible subgroup to this element
				var myVal = me.attr("data-value");
				var nextVal = me.next().attr("data-value");
				if (nextVal.indexOf("_") > -1) {
					// A subgroup belongs to this element so we need to deselect all of them
					var selections = [];
                    me.closest(".dropdown-menu").find("li.selected").each(function() {
                            var val = $(this).attr("data-value");
                            if (!(val.substr(0, myVal.length) == myVal && val.indexOf("_") > -1))
                                    selections.push(val);
                    });
                    $(".selectpicker").selectpicker("val", selections);
				}
			}
			if (isBostadMap) {
				// Ugly way for us to be able to reuse this code in the map
				// We need a way to trigger some kind of change whenever a value is selected here
				$("#map-search").submit();
			}
		});
	},
	
	on_search_expanded_change: function(e) {
		var cg = jQuery("#catgroup").val();
		var w = parseInt(jQuery(e).val());
		var reg = jQuery("input[name=ca]").val();
		if (reg.indexOf("_") !== -1) {
			reg = reg.substring(0, reg.indexOf("_"));
		}
		var data = {
			w: isNaN(w) ? 0 : w, 
			reg: w >= 100 ? w - 100 : reg,
			cg: cg
		};
		var last_w = (cg == "3080") ? -1 : w;
		if (last_w != window.blocket_searchbox_last_w || $(".bootstrap-select").length == 0) {
			$('#bostad_multiselect').load('/bostad_multiselect.html #searcharea_region_multiselect', data, function() {
				$(".bootstrap-select").remove();
				$('.selectpicker').selectpicker({size:'fixed'});
				blocket.apps.searchbox.bind_multiselect_option_click();
				$('#bostad_multiselect').removeClass('hide');
				$("#bostad_multiselect").show();
				window.blocket_searchbox_last_w = last_w;
			});
		}
		$(".bootstrap-select").removeClass('open');
	},

	on_submit: function() {
		var cg = parseInt($('#catgroup').val());
		var f_b = $("#search_form input[type=hidden][name=f][value=b]");
		
		if(f_b.length && cg > 0 && (cg < 3000 || cg >= 4000) && cg != 7060) {
			f_b.remove()
		}

		if($("#search_form input[name=st]:checked").val() != "s") {
			$("#search_form input[name=cp]").prop("disabled", true);
		}

		$('.forget_on_search .selected_param').each(function () {
			var el = $(this);
			var tmp_name = el.prop("data-param").toString();
			var tmp_value = el.prop("data-val").toString();
			var names = [],
			values = [];

			if (tmp_name.indexOf('|') > -1 &&
				tmp_value.indexOf('|') > -1 &&
				tmp_value.indexOf('|') == tmp_name.indexOf('|')) {

				names = tmp_name.split('|');	
				values = tmp_value.split('|');	
			} else {
				names.push(tmp_name);
				values.push(tmp_value);
			}
			var i=0;
			for (i=0; i<names.length; i++) {
				if (names[i] != "f" && values[i] != "f") {
					$("#search_form input[type=hidden][name="+names[i]+"][value="+values[i]+"]").remove();
				}
			}
		});

		var regdate_rs_val = jQuery('#regdate_rs').val();
		var regdate_re_val = jQuery('#regdate_re').val();
		if(regdate_re_val < regdate_rs_val && regdate_rs_val != '' && regdate_re_val != '') {
			if(parseInt(regdate_rs_val) <= 1970) {
				regdate_rs_val = parseInt(regdate_rs_val) + 9;
			}
			if(parseInt(regdate_re_val) <= 1979) {
				regdate_re_val = parseInt(regdate_re_val) - 9;
			}
			jQuery('#regdate_re').val(regdate_rs_val);
			jQuery('#regdate_rs').val(regdate_re_val);
		}
		var regdate_mc_rs_val = jQuery('#regdate_mc_rs').val();
		var regdate_mc_re_val = jQuery('#regdate_mc_re').val();
		if(parseInt(regdate_mc_re_val) < parseInt(regdate_mc_rs_val) && regdate_mc_rs_val != '' && regdate_mc_re_val != '') {
			jQuery('#regdate_mc_re').val(regdate_mc_rs_val);
			jQuery('#regdate_mc_rs').val(regdate_mc_re_val);
		}

		if ($("#search-wrapper").hasClass("root_cat_3000")) {
			jQuery("input:hidden[name=co]").remove();
			jQuery("input:hidden[name=m]").remove();
			jQuery("input[name=sp]").remove();
		}
		else {
			// Special sorting is only done for bostad
			jQuery("input:hidden[name=sort]").remove();
		}
	},

	reset_value: function(name) {
		var elems = document.getElementsByName(name);

		if (elems) {
			for (var e in elems)
				e.disabled = true;
		}
	},

	search_key_lookup: function(key, data) {
		if (key == "parent") {
			if (data['category'] && category_list[data['category']])
				return category_list[data['category']]["parent"];
			else if (data['cg'] && category_list[data['cg']])
				return category_list[data['cg']]["parent"];

			return null;
		}
		if (key == "b__lang") {
			return lang;
		}
		return data[key];
	},

	hide_atv_checkbox: function(cat) {
		var cat_mc = document.getElementById("cat_mc");

		if (cat_mc && (cat_mc.value == "" || cat_mc.value == 0)) {
			blocket.common.showField('xc_container', 'inline');
		} else {
			document.getElementById('xc').checked = false;
			blocket.common.showField('xc_container', 'none');
		}
	},

	rb_page_load: function(st) {
		blocket.apps.searchbox.on_submit();
		$("input[name=sort]").remove();
		document.forms["search_form"].submit();
	},

	/*
	* Show/hide searchextras
	*/
	SearchCrit: function(_checkCat, adType, additional_key) {

		/* Get selected values only if same category as in query string or called _checkCat */
		var get_selected = (_checkCat || blocket.common.queryString("cg") == $("#catgroup").val()) ? true : false;
		var appl = ($("#wid").size() == 0) ? 'li' : 'adwatch';
		var fk = $("#fk").size() > 0 ? 1 : 0;
		var caller = blocket.common.queryString("ca");
		var additional_key_val = additional_key ? $("#" + additional_key).val() : null;
		var lookup_data = Array();
		var types;

		$("#blocket_apps").show();
		$(".hide_on_expand").show();

		if (!adType && !fk) {
			adType = $('input[name="st"]:checked').val();
			if (!adType) {
				adType = 's';
			}
		}

		var adt = adType;

		var $extra_st = $('input[id="type_' + adt + '"]');
		var $right_st =	$('input[id="type_' + adt + '_right"]');

		if ($("#catgroup").val() == "1020") {
			$right_st.prop('checked', 'checked');
		} else {
			$extra_st.prop('checked', 'checked');
		}


		var qs_cat = blocket.common.queryString("cg");

		if (!blocket.apps.searchbox.types_checked ) {
			blocket.apps.searchbox.types_checked = {};
			for (var i in default_types) {
				blocket.apps.searchbox.types_checked[default_types[i]] = true;
			}
		}

		if (!_checkCat) {
			var Category = document.getElementById("cat") ? document.getElementById("cat").value : blocket.common.queryString("c");
			var Categorygroup = document.getElementById("cat") ? document.getElementById("catgroup").value : blocket.common.queryString("cg");
		} else {
			var Category = (_checkCat > 0 || blocket.common.queryString("c") < 0) ? _checkCat : blocket.common.queryString("c");
			document.getElementById("cat").value = Category;
		}

		/* Update category drops */
		var catgroup_value = $('#catgroup').val();
		var cat_id = "cat";
		if (catgroup_value == 1140) {
			cat_id = "cat_mc";
			blocket.common.showField('xc_container', 'inline');
		}
		
		types = blocket.common.split_setting(blocket.common.get_settings('types', blocket.apps.searchbox.search_key_lookup, category_settings, {'category':catgroup_value, 'appl' : appl}));

		lookup_data['cg'] = catgroup_value;
		lookup_data['appl'] = appl;
		lookup_data['w'] = $('select[name=w]:enabled').val();

		var searchbox_display = blocket.common.split_setting(blocket.common.get_settings('searchbox_display', blocket.apps.searchbox.search_key_lookup, list_settings, lookup_data));

		lookup_data_curr = [];
		lookup_data_curr['cg'] = blocket.common.queryString('cg');
		lookup_data_curr['appl'] = appl;
		lookup_data_curr['w'] = blocket.common.queryString('w');

		var searchbox_display_curr = blocket.common.split_setting(blocket.common.get_settings('searchbox_display', blocket.apps.searchbox.search_key_lookup, list_settings, lookup_data_curr));

		if (searchbox_display_curr['class'] !== 'no_params') {
			$("#search").attr('class', '');
			if (!$.isArray(searchbox_display['class']))
				$("#search").addClass('searchbox_' + searchbox_display['class']);
			else {
				$.each(searchbox_display['class'], function(i, cls) {$("#search").addClass('searchbox_' + cls)});
			}
		}

		if (additional_key && additional_key_val) {
			var offs = additional_key.search(/[0-9]/);
			var key = additional_key;
			if (offs > -1)
				key = key.substr(0, offs - 1);
			if (key.match(/^cat/))
				key = "subcategory";
			else
				key = additional_key;

			lookup_data[key] = additional_key_val;
		}

		lookup_data['type'] = adt;

		// Show searchhelp for cars
		if (searchbox_display['help'] == "cars") {
			$("#search_help_cars").show();
			$("#search_help").hide();
			$(".searchbox_mini").hide();
			$(".searchbox_mini_v2").hide();
			$(".search_banner_box").hide();
		} else if (searchbox_display['help'] == 'default') {
			$(".searchbox_mini").show();
			$(".searchbox_mini_v2").show();
			$("#search_help").show();
			$(".search_banner_box").show();
			$("#search_help_cars").hide();
		} else {
			$(".searchbox_mini").show();
			$(".searchbox_mini_v2").hide();
			$("#search_help_cars").hide();
			$("#search_help").hide();
			$(".search_banner_box").hide();
		}

		if (catgroup_value == 1020) {
			$("div .search_size_small").css("display", "none");
			$("div .search_size_full").css("display", "block");
		} else {
			$("div .search_size_small").css("display", "block");
			$("div .search_size_full").css("display", "none");
		}

		if (catgroup_value == 1020 && adt != "k") {
			var clear_aref = $('#clear_aref').prop('href');
			var oRegExpCg = new RegExp('cg=');
			if (!oRegExpCg.test(clear_aref))
				$('#clear_aref').prop('href',clear_aref + '&cg=' + catgroup_value);
			$("#search_button_feature_container").css("margin-top", "12px");
		} else {
			$("#cx_* :input").prop('disabled', true);
			$("#search_button_feature_container").css("margin-top", "0px");
			for (var i in cx_colors["keys"]) {
				var color = cx_colors["keys"][i];
				$("#car_"+color).addClass("car_"+color+"_off");
				$("#car_"+color).removeClass("car_"+color+"_on");
				$("#cx_" + color).val("");
			}
		}

		var $latest_real_estate_search = $(".latest_real_estate_search");
		if($latest_real_estate_search.length > 0 && catgroup_value) {
			$latest_real_estate_search.toggle(catgroup_value.charAt(0) === "3");
		}


		/* set_hidden, used to store input vars between specific categories, where applicable */
		var set_hidden = blocket.common.split_setting(blocket.common.get_settings('searchbox_set_hidden', blocket.apps.searchbox.search_key_lookup, list_settings, lookup_data));

		$('.set_hidden').prop('disabled', true);

		if(set_hidden["params"]) {
			set_hidden = set_hidden["params"].split(";");

			for (var i in set_hidden) {
				$('#' + set_hidden[i]).removeAttr('disabled');
			}
		}

		/* Old stuff */
		var extras = blocket.common.split_setting(blocket.common.get_settings('searchextras', blocket.apps.searchbox.search_key_lookup, list_settings, lookup_data));
		//var fields = blocket.common.getElementsByClassName(document.getElementById('search'), 'div', 'featurebox');
		var fields = $("#search div.featurebox");

		var subcat = document.getElementById(cat_id);
		subcat.options.length = 1;
		subcat.options[0] = new Option(extras["sub" + cat_id], "0");

		var i = 1;
		for (var u = 0; u < category_order.length; u++) {
			if (category_list[category_order[u]]["level"] == 2 && category_list[category_order[u]]["parent"] == catgroup_value) {
				subcat.options[i] = new Option(category_list[category_order[u]]["name"], category_order[u]);
				if (Category == category_order[u])
					subcat.selectedIndex = i;
				i++;
			}
		}

		var hasExtras = false;
		for (var e in extras) {
			if (e != 'none') {
				hasExtras = true;
				break;
			}
		}

		if (!hasExtras) {
			blocket.common.showField('searchextras', 'none');
		}

		for (var i = 0; i < fields.length; i++) {
			var select = fields[i].getElementsByTagName('select');
			var inputs = fields[i].getElementsByTagName('input');
			var eid = Array();
			var offs = fields[i].id.search(/[0-9]/);

			if (offs > -1) {
				eid[0] = fields[i].id.substr(0, offs - 1);
				eid[1] = fields[i].id.substr(offs);
			} else {
				eid[0] = fields[i].id;
			}

			if ((eid.length == 2 && extras[eid[0]] == eid[1]) || (eid.length == 1 && extras[eid[0]]) || extras[fields[i].id]) {
				if (extras["display_none"] != eid[0]) {
					blocket.common.showField(fields[i].id, 'block');
				}
				if (select) {
					for (var j = 0; j < select.length; j++) {
						blocket.common.enable_field(select[j]);
					}
				}

				if (inputs) {
					/* Types are handle specially, below. */
					for (var j = 0; j < inputs.length; j++) {
						if (inputs[j].type == "radio") {
							if ((additional_key == inputs[j].id) || inputs[j].id.substr(inputs[j].id.length-2, 2) == "_0")
								inputs[j].checked = "checked";
						}
						if (inputs[j].id.substr(0, 3) != 'cx_') {
						blocket.common.enable_field(inputs[j]);
						}
					}
				}
			} else {
				blocket.common.showField(fields[i].id, 'none');
				if (select) {
					for (var j = 0; j < select.length; j++) {
						blocket.common.setValue(select[j], "");
						blocket.common.disable_field(select[j]);
					}
				}

				if (inputs && fields[i].id != 'types') {
					/* Types are handle specially, below. */
					for (var j = 0; j < inputs.length; j++) {
						blocket.common.disable_field(inputs[j]);
					}
				}
			}
		}
		if (catgroup_value == 0) {
			$("#search-wrapper").attr("class", "");
		} else {
			var category_info = category_list[catgroup_value];
			var root_cat = (category_info.level != 0) ? category_list[catgroup_value]["parent"] : catgroup_value;
			$("#search-wrapper").attr("class", "root_cat_" + root_cat);
			if (root_cat == "3000") {
				if ($("#bostad_multiselect").length == 0) {
					$('<div id="bostad_multiselect"></div>').insertAfter($("select[name=w]:last"));
				}
				blocket.apps.searchbox.on_search_expanded_change($("select[name=w]:visible"));
			}
		}
		
		var labels = blocket.common.getElementsByClassName(document.getElementById('search_form'), 'label', 'st_label');
		if (extras['type_boxes'] || extras['types']) {
			var none_checked = true;
			var l_all;
			var inp_all;
			var checked;
			var showbox = typeof(extras['type_boxes']) != 'undefined';
			var t_sfx;

			if (typeof(extras['types']) == 'undefined' || extras['types'] == "1" || extras['types'] == "all") {
				t_sfx = "";
			} else {
				t_sfx = extras['types'];
			}

			if (showbox) {
				blocket.common.showField('type_boxes', 'block');
				blocket.common.showField('types', 'none');
				blocket.common.showField('types_right', 'none');
			} else {
				blocket.common.showField('type_boxes', 'none');
				blocket.common.showField('types_right', 'none');
				blocket.common.showField('types' + t_sfx, 'block');
			}

			/* LOOP ALL LABELS */
			for (var i = 0; i < labels.length; i++) {
				var l = labels[i];
				var t;
				var t_id;
				var inp;
				var isbox = (l.id.match(/boxes/) == 'boxes');

				if (isbox) {
					t_id = l.id.replace("label_boxes_st_", "");
					t = t_id.substr(0, 1);
					inp = document.getElementById("type_boxes_" + t_id);
				} else {
					t_id = l.id.replace("label_st_", "");
					t = t_id.substr(0, 1);
					inp = document.getElementById("type_" + t_id);
					if (types[t] && inp.checked && (!t_sfx || t_sfx == "" || (t_id.indexOf(t_sfx) > 0))) {
						none_checked = false;
					}
				}

				if (t == "a") {
					l_all = l;
					inp_all = inp;
				} else if (isbox == showbox && ((t + t_sfx == t_id && types[t]) || catgroup_value == 0)) {
					if (isbox && inp.disabled) {
						inp.checked = blocket.apps.searchbox.types_checked[t];
					}
					inp.disabled = false;
					l.style.display = 'inline';
				} else {
					if (isbox && !inp.disabled) {
						blocket.apps.searchbox.types_checked[t] = inp.checked;
					}
					l.style.display = 'none';
					inp.disabled = true;
					inp.checked = false;
				}
			}

			if (typeof(inp_all) != 'undefined') {
				if (extras['types'] == 'all') {
					if (inp_all.disabled) {
						inp_all.checked = true;
					}
					inp_all.disabled = false;
					l_all.style.display='inline';
				} else {
					inp_all.disabled = true;
					inp_all.checked = false;
					l_all.style.display='none';
					if (!showbox && none_checked) {
						document.getElementById('type_s' + t_sfx).checked = true;
					}
				}
			}
		} else {
			for (var i = 0; i < labels.length; i++) {
				var l = labels[i];
				var t_id;
				var inp;
				var isbox = (l.id.match(/boxes/) == 'boxes');

				if (isbox) {
					t_id = l.id.replace("label_boxes_st_", "");
					inp = document.getElementById("type_boxes_" + t_id);
				} else {
					t_id = l.id.replace("label_st_", "");
					inp = document.getElementById("type_" + t_id);
				}

				blocket.common.showField('types', 'none');
				blocket.common.showField('types', 'none');
				blocket.common.showField('types_right', 'none');

				inp.disabled = true;
				inp.checked = false;
				l.style.display = 'none';
			}
		}
		if (extras['subcat']) {
			subcat.options[0].innerHTML = extras['subcat'];
		}
		if (hasExtras)
			blocket.common.showField('searchextras', 'block');

		var search_where = blocket.common.split_setting(blocket.common.get_settings('search_where', blocket.apps.searchbox.search_key_lookup, list_settings,
								{'cg': catgroup_value,
								'subcategory':document.getElementById("cat").value,
								'type':adt, 'appl' : appl, 'fk' : fk}));

		var wheretype = 'simple';

		if(search_where['country'])
			wheretype = 'country';
		else if(search_where['subarea'])
			wheretype = 'subarea';
		else if(search_where['expanded'])
			wheretype = 'expanded';
		else if (search_where['none'])
			wheretype = 'none';

		var selectedwhere = $(".search_where:enabled").val();

		$(".search_region").hide();
		$(".search_region").prop('disabled', 'disabled');

		$("#searcharea_" + wheretype).show();
		$("#searcharea_" + wheretype).removeAttr('disabled');

		if(selectedwhere)
			$(".search_where:enabled").val(selectedwhere);

		/* Display/hide searchbox tip */
		var searchbox_tips = blocket.common.split_setting(blocket.common.get_settings('searchbox_tip', blocket.apps.searchbox.search_key_lookup, list_settings, {'category':catgroup_value, 'appl' : appl}));
		var searchbox_tip = searchbox_tips['tip'];
		var searchbox_href = searchbox_tips['href'];

		if (searchbox_tip) {
			var sbtip = document.getElementById('searchbox_tip');
			if (sbtip) {
				if (jQuery(searchbox_tip).prop("id") === "industrial_tip")
					searchbox_href += '&w='+jQuery("#searcharea_simple option:selected").val();
					
				/* build href string and replace it in tip */
				var ca = blocket.common.queryString('ca');
				if (ca)
					searchbox_href += '&ca=' + ca;

				searchbox_tip = searchbox_tip.replace(/#href#/g, searchbox_href);

				sbtip.innerHTML = searchbox_tip;
				blocket.common.showField('searchbox_tip', 'block');
			}
		} else {
			blocket.common.showField('searchbox_tip', 'none');
		}

		/* Any action hides the job banner */
		var mb = document.getElementById("job_blocket");
		if (mb)
			mb.style.display = 'none';
		
		blocket.apps.searchbox.set_action_url();
		
		if (catgroup_value == 0) {
			$("#search_form").attr("class", "");
		} else {
			var category_info = category_list[catgroup_value];
			var root_cat = (category_info.level != 0) ? category_list[catgroup_value]["parent"] : catgroup_value;
			$("#search_form").attr("class", "root_cat_" + root_cat);
			if (root_cat == "3000") {
				if ($("#bostad_multiselect").length == 0) {
					$('<div id="bostad_multiselect"></div>').insertAfter($("select[name=w]:last"));
				}
				blocket.apps.searchbox.on_search_expanded_change($("select[name=w]:visible"));
			}
		}

	},
	
	/* Blocket jobb*/
	set_action_url: function() {
		var search_form = $('#search_form');
		if ($('#catgroup').val() == 9000) {
			$('#type_boxes').hide();
			search_form.prop("action", search_form.prop("data-job-url"));
		} else {
			search_form.prop("action", search_form.prop("data-blocket-url"));
		}
	},

	get_radio_value: function(radio_container) {
		if(!radio_container)
			return;

		for(var i=0; i < radio_container.length; i++) {
			if(radio_container[i].checked) {
				return radio_container[i].value;
			}
		}

		return null;
	},

	get_checked_types: function(div) {
		if (!div)
			return [];

		var inputs = div.getElementsByTagName('input');
		var res = [];

		for (var i = 0 ; i < inputs.length ; i++) {
			if (inputs[i].getAttribute('type') == 'checkbox' && inputs[i].checked)
				res.push(inputs[i].value);
		}
		return res;
	},
	/**
	* w	w value
	* ca	ca jquery object
	*/
	set_ca_from_w: function(w, ca) {
		if (w > 100) {
			ca.val(w-100);
			$.cookie("default_ca", w-100);
		}
		return true;
	}
});

blocket("@init.list.searchbox").extend(function() {
	$(document).ready(function () {

		var cg = blocket.common.queryString("cg");
		if (cg.length) {
			$('input[name=cg]').val(cg);
		}

		var w = blocket.common.queryString("w");
		if (w.length) {
			$('input[name=w]').val(w);
		}

		var st = blocket.common.queryString("st");
		if (st.length) {
			$('input[name=st][value=' + st + ']').prop('checked', 'checked');
		}

		if (cg == "1020" && blocket.common.queryString("fk") != "1") {
			if ($('input:checked').val() == "k") {
				blocket.apps.searchbox.SearchCrit(false, "k", 1020);
			} else if ($('input:checked').val() == "s") {
				blocket.apps.searchbox.SearchCrit(false, "s", 1020);
				($(".searchbox_cars")).css("margin-top", "0px");
			}
		}

		if (cg == 1020) {
			$("div .search_size_small").css("display", "none");
			$("div .search_size_full").css("display", "block");
		} else {
			$("div .search_size_small").css("display", "block");
			$("div .search_size_full").css("display", "none");
		}

		if (cg == 1020) {
			$("div .search_size_small").css("display", "none");
			$("div .search_size_full").css("display", "block");
		} else {
			$("div .search_size_small").css("display", "block");
			$("div .search_size_full").css("display", "none");
		}
	
		if ($('#catgroup').val() == 9000) {
			blocket.apps.searchbox.set_action_url();
		}

		$(".car_chassis").click(function() {
			if (this.className.indexOf("_on") != -1) {
				$(this).removeClass("car_chassis_on");
				$("#cx_" + this.id).val("");
				$("#cx_" + this.id).prop("disabled", "disabled");
			} else {
				$(this).addClass("car_chassis_on");
				$("#cx_" + this.id).val("1");
				$("#cx_" + this.id).removeAttr("disabled");
			}

		});

		$(".car_chassis").each(function() {
			if ($("#cx_" + this.id).val() == "1")
				$(this).addClass("car_chassis_on");
			else
				$(this).removeClass("car_chassis_on");
		});

		$(".car_color").each(function() {
			if ($("#cx_" + this.id).val() == "1") {
				$("#" + this.id).removeClass(this.id + "_off").addClass(this.id + "_on");
			} else {
				$("#" + this.id).removeClass(this.id + "_on").addClass(this.id + "_off");
			}
		});
		blocket.apps.searchbox.bind_multiselect_option_click();
	});
});
/*!** End file: searchbox.js ***/
/*!** Begin file: trafikfonden_tracker.js ***/
/*

	Homebrewn Event Tracker (HET) for Google Analytics and Schibsted Trafikfonden.


		# TECHNICAL MUMBO JUMBO:	This script will add an onClick event listener to the BODY and to every BODY of every accessable iframe.
						When a click occur, the script will look and see if there are any tracking tags associated with the
						refferrer element, and all of its parent elements - bubbling to the top of the document.
						If there is, the script will modify the URL (if it's an anchor tag) and apply all of the necessary ugly
						details that you don't want to know about.

						Anchor tags that doesn't open in new tabs will be modified to a delay of 150 ms - enough time to send
						your Google Analytics requests - and then, change the document.location to the desired URL (and modify
						THAT URL, if it has any XITI tags associated with it).


		# DEPENDENCIES:		- inception.js - http://www.github.com/mcsquare/inception.js - (if you don't wanna use inception.js - just rewrite the code as a stand alone object.)
					- jQuery - http://www.jquery.com - (if you don't wanna use jQuery, write an own selector based framework.)



		# USABLE DATA ATTRIBUTES:

		- data-tracker			: (string) set to "enabled" if active.
		- data-tracker-link		: (string) url to target site (this isn't needed if the element is an anchor tag)
		- data-tracker-ga-category	: (string) tracking category.
		- data-tracker-ga-label		: (string) tracking label.
		- data-tracker-tf-tag		: (string) tf xtor tag
		- data-tracker-tf-category	: (string) tracking category.
		- data-tracker-tf-label		: (string) tracking label.
		- data-tracker-tf-sender	: (string) tracking sender.
		- data-tracker-tf-receiver	: (string) tracking receiver.
		- data-tracker-tf-xts		: (int) xiti xts id.
		- data-tracker-tf-id		: (int) xiti domain id.


		# PRO TIP #1:	If you use this for "Trafikfonden", please use it with an XTS-number and
				an ID - this forces the script to funnel the traffic through XITI (with	a 302
				to your target site) instead of applying ugly hash tags to the destination URL.


		# Below are some totally random examples:

		-	<a href="http://www.theoatmeal.com/"
				data-tracker="enabled"
				data-tracker-tf-tag="AD-500-[othersite.com]-[Label]-[Category]-[yoursite.com]-[]-[]"
			>Click me!</a>

		-	<a href="http://www.theoatmeal.com/"
				data-tracker="enabled"
				data-tracker-tf-id="189"
				data-tracker-tf-xts="142930493"
				data-tracker-tf-tag="AD-500-[othersite.com]-[]-[]-[yoursite.com]-[]-[]"
				data-tracker-tf-label="Label"
				data-tracker-tf-category="Category"
			>Click me!</a>

		-	<a href="http://www.theoatmeal.com/"
				data-tracker="enabled"
				data-tracker-tf-receiver="othersite.com"
				data-tracker-tf-label="Label"
				data-tracker-tf-category="Category"
			>Click me!</a>

		-	<div
				data-tracker="enabled"
				data-tracker-ga-category="Category"
				data-tracker-ga-label="Label"
			>Click me!</a>


		# PRO TIP #2:	Use a separate script to apply all these data values instead of putting them
				directly on the desired object. It will make it more neat, and you will have
				only ONE place from where you edit your tags.


	- Filip Moberg
*/
/*
	Blocket modifications

	- Renamed all klart references to blocket.
	- Changed sender and domain to blocket.
	- data-tracker-tf-id now wants logc89 instead of just 89. As we discovered that sometime the id is logi89 etc.
	- Removed all GA code. As we do not use GA.
	- Remove data-tracker-tf-enabled, we use a bconf named xiti_tf_tracker.enabled instead to globally turn on and off this script.
	- The event listner is added to all "a" tags instead of the body. The reason for this is to fix the problem  where an "a" element contains child elements. e.g. <a><img /></a> 

	// Andreas Ahlund & Emil Bryggare

*/


blocket("@tracker").extend({

	settings: {
		sender: "blocket",
		domain: "blocket.se"
	},

	validate: {

		state: function(o) {

			if (!o.state.recurse && o.elem.tagName.toLowerCase() === "a") {
				return true;
			}

			return false;
		},

		link: function(o) {

			if (o.link) {
				return o.link;
			}

			if ($(o.elem).attr("data-tracker-link")) {
				return $(o.elem).attr("data-tracker-link");
			}

			return "";
		},


		tf: {
			tag: function(o) {

				var xtor, tag, x, data = {};

				if ($(o.elem).attr("data-tracker-tf-tag")) {

					xtor = $(o.elem).attr("data-tracker-tf-tag").split("[");

					for (x in xtor) {

						xtor[x] = xtor[x].replace("]-", "");

						switch (x) {
							case "1":
								tag = "receiver";
								break;
							case "2":
								tag = "label";
								break;
							case "3":
								tag = "category";
								break;
							case "4":
								tag = "sender";
								break;
							default:
								tag = "";
								break;
						}

						if (tag) {
							if (xtor[x]) {
								data[tag] = xtor[x];
							}
						}
					}

					return data;
				}

				return "";
			},

			category: function(o) {

				if ($(o.elem).attr("data-tracker-tf-category")) {
					return $(o.elem).attr("data-tracker-tf-category");
				}

				validator = this.tag(o)["category"];
				if (validator) {
					return validator;
				}

				return "";
			},

			label: function(o) {

				if ($(o.elem).attr("data-tracker-tf-label")) {
					return $(o.elem).attr("data-tracker-tf-label");
				}

				validator = this.tag(o)["label"];
				if (validator) {
					return validator;
				}

				return "";
			},

			receiver: function(o) {

				if ($(o.elem).attr("data-tracker-tf-receiver")) {
					return $(o.elem).attr("data-tracker-tf-receiver");
				}

				validator = this.tag(o)["receiver"];
				if (validator) {
					return validator;
				}

				return "";
			},

			sender: function(o) {

				if ($(o.elem).attr("data-tracker-tf-sender")) {
					return $(o.elem).attr("data-tracker-tf-sender");
				}

				validator = this.tag(o)["sender"];
				if (validator) {
					return validator;
				}

				return blocket.tracker.settings.sender;
			},

			id: function(o) {

				if ($(o.elem).attr("data-tracker-tf-id")) {
					return $(o.elem).attr("data-tracker-tf-id");
				}

				return "";
			},

			xts: function(o) {

				if ($(o.elem).attr("data-tracker-tf-xts")) {
					return $(o.elem).attr("data-tracker-tf-xts");
				}

				return "";
			},

			// New format and UID 2014-01-29
			format: function(o) {

				if ($(o.elem).attr("data-tracker-tf-format")) {
					return $(o.elem).attr("data-tracker-tf-format");
				}

				return "";
			},

			uid: function(o) {

				if ($(o.elem).attr("data-tracker-tf-uid")) {
					return $(o.elem).attr("data-tracker-tf-uid");
				}

				return "";
			}
		}
	},

	recurse: function(o) {

		var state;

		if (o.target != o.doc) {

			state = {target: o.target.parentNode, win: o.win, doc: o.doc, link: o.link};

			if (xiti_trafikfonden_tracker_enabled === "1") {

				if (o.target.href) {
					state.link = o.target.href;
				}

				return this.trackme({elem: o.target, link: o.target.href, state: state});
			}
		}
	},

	onReady: function() {

		var that = this;

		// Set click event on every iframe body, checking every target for a valid tag.
		$("iframe").each(function() {

			var doc, win;

			// Make sure we won't get any cross-site errors
			//if (this.src.replace(/http:\/\//,'').split("/")[0].indexOf(that.settings.domain) !== -1 || this.src.substr(0, 1) === "/") {
			if((this.src.replace(/http:\/\//,'').split("/")[0].indexOf(that.settings.domain) !== -1 || this.src.substr(0, 1) === "/") && this.getAttribute("id") != "sifo_panel_iframe"){
				$(this).load(function() {

					win = this.contentWindow;
					doc = win.document;

					if (doc !== undefined) {

						$(doc.body).click(function(e) {

							return that.recurse({target: e.target, win: win.top, doc: doc});
						});
					}
				});
			}
		});

		// Set click event on body, checking every target for a valid tag.
		$("a").click(function(e) {
			//If no tf tracker attribute is set; do nothing. Otherwise Ajax will not work.
			if (typeof $(this).attr('data-tracker-tf-id') !== 'undefined') {
				return that.recurse({target: this, win: window, doc: document});
			}
		});
	},

	// This function either can be called directly, or summoned by declaring a data attribute called "tracker=enabled" on target object
	trackme: function(o) {

		var	validator,
			that = this;

		o.tf = {};


		// Link
		o.link = this.validate.link(o);

		// TF Category
		o.tf.category = this.validate.tf.category(o);

		// TF Label
		o.tf.label = this.validate.tf.label(o);

		// TF Sender
		o.tf.sender = this.validate.tf.sender(o);

		// TF Receiver
		o.tf.receiver = this.validate.tf.receiver(o);

		// TF ID
		o.tf.id = this.validate.tf.id(o);

		// TF XTS
		o.tf.xts = this.validate.tf.xts(o);

		// TF Format
		o.tf.format = this.validate.tf.format(o);

		// TF UID
		o.tf.uid = this.validate.tf.uid(o);

		// Only send data to XITI if element is an anchor tag, and if we're in a valid state.
		if (this.validate.state(o)) {

			// Save original url before modifying it
			if (!$(o.elem).attr("data-tracker-tf-url")) {
				$(o.elem).attr("data-tracker-tf-url", o.link);
			}

			// XITI Campaign data
			o.xtor = "AD-500-[" + o.tf.receiver + "]-[" + o.tf.label + "]-[" + o.tf.format + "]-[" + o.tf.sender + "]-[" + o.tf.category + "]-[" + o.tf.uid  + "]";

			// Use XITI Redirect method if applicable
			if (this.validate.tf.xts(o) && this.validate.tf.id(o) && this.validate.tf.category(o) && this.validate.tf.receiver(o)) {

				o.link = "http://" + o.tf.id + ".xiti.com/go.url?xts=" + o.tf.xts + "&xtor=" + o.xtor + "&url=" + o.link;

			// Use XITI HASH method as a last resort (if applicable)
			} else if (this.validate.tf.tag(o) || (this.validate.tf.category(o) && this.validate.tf.receiver(o))) {

				o.link += "#xtor=" + o.xtor;
			}

			// Set HREF to new URL 
			$(o.elem).attr("href", o.link);

			// Restore HREF to original URL
			setTimeout(function() {
				$(o.elem).attr("href", $(o.elem).attr("data-tracker-tf-url"));
			}, 1000);
		}


		// Recurse and look for more things to track (in Google Analytics).
		setTimeout(function() {

			o.state.recurse = true;
			that.recurse(o.state);
		}, 1);


		// If referer element is an anchor tag, open it accordingly
		if (this.validate.state(o)) {

			if (!$(o.elem).attr("target")) {

				setTimeout(function() {

					document.location = o.link;

				}, 150);

				return false;
			}

			// If we reach this line, the link will be returned as usual.
		}
	}
});
/*!** End file: trafikfonden_tracker.js ***/
/*!** Begin file: lazy_iframe.js ***/
function lazy_iframe(){
	var self = this;
	this.conf_timeout = lazy_iframe_conf.timeout;
	this.conf_enabled = lazy_iframe_conf.enabled;
	this.conf_fade_in = lazy_iframe_conf.fade_in;
	this.timeout_func = null;
	this.all_elems = new Array();
	this.iframes = new Array();
	this.heightLoaded = new Array();
	this.loadedElements = 0;
	this.init = function(){
		$(".lazy_iframe").each(function(i,elem){
			elem = jQuery(elem);
			if(elem.attr("loadheight")){
				elem.data("top", elem.offset().top);
				elem.data("loadheight", elem.attr("loadheight"));
				elem.data("loaded", false);
				self.heightLoaded.push(elem);	
			} else {
				if(jQuery(elem).is("iframe")){
					if (jQuery(elem).attr('longdesc') != undefined) {
						self.load_iframe(elem);
					}
					if(self.conf_enabled){
						self.iframes.push(elem);
						jQuery(elem).load(function(){
							self.set_loaded(this);
						});
					}
				}
		
				self.all_elems.push(elem);
			}
		});
		if(self.conf_enabled){
			this.timeout_func = setTimeout(function() {
				self.show_all();
			}, self.conf_timeout);
		} else {
			self.show_all();
		}
		self.should_load();
		jQuery(window).bind("scroll", self.on_scroll);
	}

	this.load_iframe = function(elem) {
		elem = jQuery(elem)[0];
		var new_src = jQuery(elem).attr("longdesc");
		/* IMPORTANT - use this way of setting the src since otherwise the history of
		/* the browser is modified and the backbutton won't work in explorer */
		if (new_src != "") {
			if(typeof(elem.contentWindow) != "undefined"){
				elem.contentWindow.location.replace(new_src);
			} else if(typeof(elem.contentDocument) != "undefined"){
				elem.contentDocument.location.replace(new_src);
			} else {
				jQuery(elem).attr('src', new_src);
			}
		}
		jQuery(elem).attr("data-is-lazy-loaded", "true");
	}

	this.on_scroll = function(){
		self.should_load();
	}

	this.should_load = function() {
		var scrollPos = jQuery(document).scrollTop();
		var viewPortHeight = jQuery(window).height();
		jQuery.each(self.heightLoaded, function(i, elem){
			if(!elem.data("loaded") && scrollPos + viewPortHeight > elem.data("top") - elem.data("loadheight")){
				elem.data("loaded", true);
				if(elem.is("iframe")){
					self.load_iframe(elem);
				}
			}
				
			
			self.show_element(elem);

		});
	
	}

	this.set_loaded = function(iframe){

		self.loadedElements++;

		if(self.loadedElements >= self.iframes.length) {
			blocket.common.log('DONE');
			self.loadedElements=0;
			self.show_all();
		}
	}
	this.show_all = function(s){
		
		clearTimeout(self.timeout_func);
		jQuery.each(self.all_elems,function(i,elem){
			self.show_element(elem);	
		});
	}

	this.show_element = function(elem) {
		jQuery(elem).css("display","");
		jQuery(elem).unbind("load");
		if(jQuery.support.opacity && self.conf_enabled){
			if(self.conf_fade_in){
				jQuery(elem).animate({opacity:"1"},{duration:500, easing:'swing'});
			} else {
				jQuery(elem).css("opacity",1);
			}
		} else{
			jQuery(elem).removeClass("lazy_iframe");
		}
	}

	this.init();
}









/*!** End file: lazy_iframe.js ***/
/*!** Begin file: lightbox.js ***/

blocket('@apps.lightbox.settings').extend({
	"speed" : 200,
	"close_text" : "Stäng",
	"scrolling_enabled" : false,
	"opacity" : 0.6,
	"easing" : "easeOutExpo",
	"animate" : false,
	"inline" : true
});

blocket('@apps.lightbox').extend({"open" : function(data) {
	var settings = {};
	$.extend(settings, blocket.apps.lightbox.settings, data.settings);

	switch(data.type.toLowerCase()) {
		case "html":
			$.colorbox({
				html : data.data,
				width: settings.width,
				height: settings.height,
				scrolling : settings.scrolling_enabled,
				close : settings.close_text,
				opacity: settings.opacity,
				speed : settings.speed,
				easing: settings.easing,
				animate: settings.animate,
				onComplete : data.callback,
				onCleanup : settings.cleanup
			});
		break;

		case "iframe":
			var url = blocket.$.attr("href");
			if(settings.href !="" && settings.href !=null){
					url = settings.href;
			}
			settings.href =="";
			$.colorbox({
				href: url,
				iframe: true,
				width: settings.width,
				height: settings.height,
				scrolling : settings.scrolling_enabled,
				close : settings.close_text,
				opacity: settings.opacity,
				speed : settings.speed,
				easing: settings.easing,
				animate: settings.animate,
				name : settings.name,
				onComplete : data.callback,
				onCleanup : settings.cleanup
			});
		break;

		case "url":
			$.get(data.data, data.vars, function(response) {
				blocket.apps.lightbox.open({type : "html", data : response, callback : data.callback, settings : settings});
			});
		break;

		case "id":
			$.colorbox({
				inline : settings.inline,
				href : "#" + data.data,
				scrolling : settings.scrolling_enabled,
				close : settings.close_text,
				opacity: settings.opacity,
				speed : settings.speed,
				width: settings.width,
				height: settings.height,
				easing: settings.easing,
				animate: settings.animate,
				onComplete: data.callback,
				onCleanup: settings.cleanup
			});
		break;

		case "element":
			$.colorbox({
				inline : settings.inline,
				href : data.data,
				scrolling : settings.scrolling_enabled,
				close : settings.close_text,
				opacity: settings.opacity,
				speed : settings.speed,
				width: settings.width,
				height: settings.height,
				easing: settings.easing,
				animate: settings.animate,
				onComplete : data.callback,
				onClosed : settings.cleanup
			});
		break;
	}
}});
blocket('@apps.lightbox').extend({"resize" : function(selector) {
	$(selector).colorbox.resize();
}});
/*!** End file: lightbox.js ***/
/*!** Begin file: scrollto.js ***/
blocket('@apps.scrollto.settings').extend({
	"duration" : 500 
});

blocket('@apps.scrollto').extend({"open" : function(data) {
	var settings = blocket.apps.scrollto.settings;

	if(data)
		$.scrollTo(data, settings.duration);
}}); 
/*!** End file: scrollto.js ***/
/*!** Begin file: campaigns.js ***/
blocket("@campaigns").extend({
	suredo: {
		onReady: function() {
			jQuery("#suredo .suredo_option").bind('change', function(e) {
				jQuery("#suredo .suredo_price").html(e.target.value);
			}).trigger('change');

			jQuery(".suredo_overlay_big").click(function(event) {
				event.stopPropagation();
			});
			jQuery("#suredo_info_link").click(function(event) {
				var overlay = jQuery(this).next("span.suredo_overlay"); 
				jQuery(overlay).toggle();
				jQuery("body").unbind("click.suredo_overlay");
				
				if(jQuery(overlay).is(":visible")) {
					jQuery("body").bind("click.suredo_overlay", function() {
						jQuery("span.suredo_overlay").hide();
						jQuery("body").unbind("click.suredo_overlay");
					});
				}
				event.stopPropagation();
			});
		}
	}
});


/*!** End file: campaigns.js ***/
/*!** End blocket_common_all.js package ***/
