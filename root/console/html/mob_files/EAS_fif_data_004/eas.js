document.writeln("<style type=\"text\/css\">");
document.writeln("#campaign-wrapper{ width:200px; text-align:left; display:none; overflow:hidden}");
document.writeln("#campaign-wrapper .mama-header { height:25px; background:#e6e6e6}");
document.writeln("#campaign-wrapper .mama-header h3{ color:#000; display:block; font:bold 12px\/25px verdana, sans-serif; margin-left:6px; white-space:nowrap; width:192; overflow:hidden}");
document.writeln("#campaign-wrapper .xtrahi{ height: 35px; display:block; overflow:hidden;}");
document.writeln("\/* IF WE WANT A POPUP BOX *\/");
document.writeln("#campaign-wrapper p.bottom_text a{ color:#999; text-decoration:none}");
document.writeln("#campaign-wrapper p.bottom_text a:hover{ text-decoration:underline}");
document.writeln("#campaign-wrapper .toggle{ display:block; margin:0}");
document.writeln("#campaign-wrapper #more_info{");
document.writeln("	background:transparent url(http://cdn6.emediate.eu/media/16/9819/33836/bg_gradient_small.png) repeat;");
document.writeln("	border:1px solid #ccc;");
document.writeln("	border-bottom:0;");
document.writeln("	display:none;");
document.writeln("	position:absolute;");
document.writeln("	top:0;");
document.writeln("	margin:0 0 0 -1px;");
document.writeln("	overflow:auto;");
document.writeln("	width:198px;");
document.writeln("	width: 200px\\9; \/*IE 8 and less*\/");
document.writeln("	height:268px;");
document.writeln("	font:11px\/12px verdana, sans-serif;");
document.writeln("}");
document.writeln("#campaign-wrapper #more_info p{	margin:3px; line-height:1.3em}");
document.writeln("#campaign-wrapper p.bottom_text{");
document.writeln("	float:right;");
document.writeln("	text-align:right;");
document.writeln("	font:9px verdana, sans-serif;");
document.writeln("	margin:0 10px 0 0;");
document.writeln("	padding:0;");
document.writeln("}");
document.writeln("\/* THIS IS THE STYLESHEET THAT SHOULD BE INCLUDED IN EVERY SOKORD CAMPAIGN BANNER A - VERSION *\/");
document.writeln("#campaign-wrapper .child-campaign *{vertical-align: baseline;font-weight: inherit;font-family: inherit;font-style: inherit;font-size: 100%;border: 0 none; outline:0; padding:0; margin:0;}");
document.writeln("#campaign-wrapper .child-campaign,ul, ol, dl, li, dt, dd, h1, h2, h3, h4, h5, h6, pre, form, body, html, p, blockquote, fieldset, input {padding: 0;margin: 0;}a img, :link img, :visited img { border: none;} a {	outline:none; -moz-outline-style:none;}");
document.writeln("\/* ALL BROWSERS, BUT HEIGHT IE ONLY *\/");
document.writeln("#campaign-wrapper .child-campaign{ background:#fff; height:110px; margin: 0; border:1px solid #cacaca; border-top:0; text-align:left; overflow:hidden;}");
document.writeln("\/* ALL THE REST *\/");
document.writeln("html>body .child-campaign{ min-height:110px }");
document.writeln("#campaign-wrapper .child-campaign .clicktag:hover,");
document.writeln("#campaign-wrapper .child-campaign .thumb:hover,");
document.writeln("#campaign-wrapper .child-campaign .header:hover,");
document.writeln("#campaign-wrapper .child-campaign .content:hover,");
document.writeln("#campaign-wrapper .child-campaign .logo:hover{cursor: pointer;}");
document.writeln("#campaign-wrapper .child-campaign .header { height:30px; position:relative; margin:0 0 0 10px}");
document.writeln("#campaign-wrapper .child-campaign .header h4{ display:block; font:bold 12px\/30px helvetica,arial,sans-serif; margin-left:6px; white-space:nowrap; width:192; overflow:hidden}");
document.writeln("#campaign-wrapper .child-campaign .header h4 a{ color:#4a75a2; text-decoration:none;}");
document.writeln("#campaign-wrapper .child-campaign .header h4 a:hover{ color:#4a75a2; text-decoration:underline;}");
document.writeln("#campaign-wrapper .child-campaign a.clicktag{ position:relative; display:block; z-index:99;}");
document.writeln("#campaign-wrapper .child-campaign .thumb { width: 80px; height:80px; margin: 0; float: left; display: inline-block; overflow: hidden;}");
document.writeln("#campaign-wrapper .child-campaign .thumb img {text-align: left; margin: 0; display: block}");
document.writeln("#campaign-wrapper .child-campaign .content { width: 112px; height:80px!important; margin:-2px 0 0 4px; font:normal 11px\/14px verdana, sans-serif; position:relative; display: inline-block;}");
document.writeln("#campaign-wrapper .child-campaign .logo { background:#fff; width:115px; height:25px; position:absolute; display:block; right:0; bottom:0; margin-bottom: -2px; overflow:hidden;}");
document.writeln("#campaign-wrapper .child-campaign .logo img{  display:block; float:right; bottom:0;}");
document.writeln("<\/style>");
document.writeln("<scr"+"ipt type=\"text\/javascript\" src=\"\/\/www.blocket.se\/js\/jquery-1.9.1.min.js\"><\/scr"+"ipt>");
document.writeln("<scr"+"ipt type=\"text\/javascript\">");
document.writeln("\/\/ OUR URL VARS");
document.writeln("function getUrlVars() {");
document.writeln("	var vars = [], hash;");
document.writeln("	\/\/ OBS PARENT LOCATION");
document.writeln("	var hashes = window.parent.location.search.slice(window.parent.location.search.indexOf(\'?\') + 1).split(\'&\');");
document.writeln("	for(var i = 0; i < hashes.length; i++) {");
document.writeln("		hash = hashes[i].split(\'=\');");
document.writeln("		vars.push(hash[0]);");
document.writeln("		vars[hash[0]] = hash[1];");
document.writeln("	}");
document.writeln("	return vars;");
document.writeln("}");
document.writeln("var myparams = getUrlVars();");
document.writeln("var mycaparam = myparams[\'ca\'];");
document.writeln("\/\/STRIP NORRLAND TO 1");
document.writeln("if (mycaparam.indexOf(\'1_\') != -1){");
document.writeln("	mycaparam = mycaparam.slice(0,2).split(\'_\')[0];");
document.writeln("}");
document.writeln("\/\/ LET SKAANE REGIONS BE 23_XX");
document.writeln("if (mycaparam.indexOf(\'23\') !== -1){");
document.writeln("	mycaparam = myparams[\'ca\'];");
document.writeln("}");
document.writeln("\/\/ UGLY SKAANE LINK HACK ON MAP TEST");
document.writeln("if (mycaparam == \'23\'){");
document.writeln("	mycaparam = \'23_15\';");
document.writeln("}");
document.writeln("var myqparam = myparams[\'q\'];");
document.writeln("if (typeof myqparam !== \'undefined\' && myqparam !== \'\' && myqparam !== \'+\'){");
document.writeln("	document.write (\'<scr\'+\'ipt type=\"text\/javascript\" src=\"\/\/ads.aftonbladet.se\/eas?EAScus=484,484,484,484&exclCamp=1&EASformat=jsvars&ord=d85c8bde-b11a-11e3-9435-00259075cf31&sw=\'+ myqparam +\'&cat1=\'+ mycaparam +\'\"><\\\/scr\'+\'ipt>\');");
document.writeln("}");
document.writeln("<\/scr"+"ipt>");
document.writeln("<scr"+"ipt type=\"text\/javascript\" src=\"http://cdn6.emediate.eu/media/16/9819/33836/inc_camp.js?1\"><\/scr"+"ipt>");
document.writeln("<scr"+"ipt type=\"text\/javascript\" src=\"http://cdn6.emediate.eu/media/16/9819/33836/inc_huvudinc.js\"><\/scr"+"ipt>");
