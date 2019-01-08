easyads_empty=1;if (!EAad.Library)
{
EAad.Library = function()
{
	this.m_server = 'ads.easy-ads.com/showadv2.php';
};

EAad.Instance = function(productId)
{
	var EAi=this;
	this.m_productId = productId;
	this.lib = {};
	this.lib.A=function(v,n,c,f,u,y){u=0;(y=function(){u++<v&&c(u/v)!==0?setTimeout(y,n):(f?f():0)})()};
	this.lib.F=function(d,h,e,f,i){d=d=='in';EAi.lib.A(f?f:15,i?i:50,function(a){a=(d?0:1)+(d?1:-1)*a;h.style.opacity=a;h.style.filter='alpha(opacity='+100*a+')'},e)};
};

EAad.Instance.prototype =
{

	m_productId:null,
	m_data:"",
	m_ads:[],
	m_flashData:null,
	m_htmlTarget:null,
	m_onload:1,
	m_preview:0,
	m_displayCalled:0,
	m_targets:"",
	m_liveRotation:0,
	m_current:0,
	m_timer:null,
	m_htmlEl:null,
	m_callback:{},
	m_retries:0,
	m_sid:0,
	m_bid:0,
	m_params:null,

	setData: function(data) {

		if (data.liveRotation)
		{
			this.m_liveRotation = data.liveRotation;
		}
		this.m_ads=data.items;
		this.m_data=data;
	},
	setTargets: function(targets) {
		this.m_targets=targets;
	},
	setParams: function(params) {
		try {
		this.m_params = JSON.parse(params);
		} catch (e) {}
	},
	setFlashData: function(data) {
		this.m_flashData=data;
	},
	setPreview: function(val) {
		this.m_preview=val;
	},
	setSid: function(val) {
		this.m_sid=val;
	},
	setBookingId: function(val) {
		this.m_bid=val;
	},
	setCallback: function(data,val) {
		if (!val || val==undefined)
		{
			val="noad";
		}
		this.m_callback[val]=unescape(data);
	},
	displayAd: function() {

		this.m_displayCalled=1;
		if (this.m_preview && !this.m_data.viewlive)
		{
			return;
		}
		if (this.m_flashData)
		{
			this.m_data=this.m_flashData;
		}
		if (!this.m_data.bookedcount && this.m_callback['noad']!=undefined && this.m_ads.length)
		{
			eval(this.m_callback['noad']);
		}

		this.m_htmlEl=document.getElementById(this.m_htmlTarget);
		if (this.m_htmlEl && this.m_ads && this.m_ads[this.m_current])
		{
			var out="";
			if (this.m_data.template!=undefined && this.m_data.template!="" && this.m_ads[this.m_current].hideselfad!=1)
			{
				out = this.m_data.template;
				var adsnum=1;
				if (this.m_data.dma || this.m_data.mab)
				{
					adsnum = this.m_ads.length;
				}
				for (var i=0;i<adsnum;i++)
				{
					var r=i+1;
					var s=i;
					if (this.m_current>0)
					{
						s=this.m_current;
					}
					if (this.m_ads[s].flashData && this.checkFlash())
					{
						this.m_ads[s].data=this.m_ads[s].flashData;
					}
					var re = new RegExp('{ad'+r+'}', "g");
					out = out.replace(re, this.m_ads[s].data);

					out = out.replace('{ads}', this.m_ads[s].data+'{ads}');
				}
				out = out.replace('{ads}', '');
				var regIf = /{if ([^}]*)}([\s\S]*){endif}/gim;

				while (match=regIf.exec(out))
				{
					match[1] = "this.m_data."+match[1];
					if (eval(match[1])) { out = out.replace(match[0],match[2]); }
					else
					{
						out = out.replace(match[0],'');
					}
				}
			}
			else
			{
				if (this.m_ads[this.m_current].flashData && this.checkFlash())
				{
					this.m_ads[this.m_current].data=this.m_ads[this.m_current].flashData;
				}
				out = this.m_ads[this.m_current].data;

				if (this.m_ads[this.m_current].type==4 && this.m_productId==39)
				{}
				else if (this.m_data.sac && this.m_ads[this.m_current].hideselfad==0)
				{
					out += this.m_data.sac;
				}
			}
			
			for (var key in this.m_params)
			{				
				out = out.split(key).join(this.m_params[key])
			}
			
			if (this.m_liveRotation && this.m_ads.length>1)
			{
				this.startRotation();
			}
			if (out.indexOf('<script')!==-1)
			{
				var iframe = this.createIframe('eaframe', this.m_data.pwidth, this.m_data.pheight);
				this.writeIframe(iframe,out);
			}
			else
			{
				this.m_htmlEl.innerHTML=out;
			}
			if (this.m_data.bookedcount && this.m_callback['onload']!=undefined)
			{
				eval(this.m_callback['onload']);
			}
		}
		else if (!this.m_htmlEl)
		{
			var obj = this;
			this.m_retries++;
			if (this.m_retries<20)
			{
				setTimeout(function(){obj.displayAd()},500);
			}
		}
	},
	createIframe: function (iframeName, width, height) {
		var iframe;
		if (document.createElement && (iframe = document.createElement('iframe')))
		{
			iframe.frameBorder = "no";
			iframe.name = iframe.id = iframeName;
			iframe.width = width;
			iframe.height = height;
			iframe.scrolling = "no";
			var isIE = (navigator.appName=="Microsoft Internet Explorer" || navigator.appVersion.indexOf("MSIE") != -1);
			if (isIE && this.m_ads[this.m_current].type!=4) iframe.src = 'javascript:(function(){document.open();document.domain="' + document.domain + '";document.close();})()';
			else iframe.src = "about:blank";
			this.m_htmlEl.innerHTML = "";
			this.m_htmlEl.appendChild(iframe);
		}
		return iframe;
	},

	writeIframe: function(iframe, content)
	{
		if (iframe)
		{
			var iframeDoc;

			try
			{
				iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
			}
			catch ( e )
			{
				try {
					iframe.src = iframe.src;
					iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
				}
				catch ( e )
				{
					if (window.frames[iframe.name])
					{
						iframeDoc = window.frames[iframe.name].document;
					}
				}
			}

			if (iframe.contentWindow)
			{
				iframe.contentWindow.contents = content;
				iframe.src = 'javascript:window["contents"]';
			}
			else if (iframeDoc)
			{
				iframeDoc.open();
				iframeDoc.write(content);
				iframeDoc.close();
			}
		}
	},

	setHtmlTarget: function(htmltarget) {
		this.m_htmlTarget=htmltarget.replace('#','');
	},
	startRotation: function()
	{
		clearTimeout(this.m_timer);
		var _this=this;
		this.m_timer=setTimeout(function(){
		_this.fadeOut();
		}, this.m_liveRotation*1000 );
		this.fadeIn();
	},
	fadeOut: function()
	{
		var _this=this;
		this.lib.F("out",this.m_htmlEl,function(){_this.showNext();},10,30);
	},
	fadeIn: function()
	{
		var _this=this;
		this.lib.F("in",this.m_htmlEl,function(){_this.fadeDone();},10,30);
	},
	showNext: function()
	{
		this.m_current++;
		if (this.m_current>this.m_ads.length-1)
		{
			this.m_current=0;
		}
		this.displayAd();

	},
	fadeDone: function()
	{
		if (navigator.appName=="Microsoft Internet Explorer")
		{this.m_htmlEl.style.removeAttribute('filter');}
	},
	checkFlash: function() {
		try {
			if (new ActiveXObject('ShockwaveFlash.ShockwaveFlash'))
			{
				return 1;
			}
		}catch(e)
		{
			try
			{
				if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
					return 1;
				}
			}catch(e){}
		}
		return 0;
	}
};

EAad.Library.prototype =
{
	m_instances:[],
	m_currentInstance:-1,
	m_onload:1,
	m_callback:"",
	m_currentProduct:0,
	m_noPreview:0,

	setProduct: function(productId) {

		if (productId==91) // TEMP HACK
		{
			productId = 97;
		}
		this.m_instances[productId] = this.m_instances[productId] || [];
		this.m_currentInstance++;
		this.m_instances[productId][this.m_currentInstance] = new EAad.Instance(productId);
		this.m_currentProduct = productId;
	},
	setData: function(data,instance,productId) {
		this.m_instances[productId][instance].setData(data);

		if (this.m_instances[productId][instance].m_onload==1 || this.m_instances[productId][instance].m_displayCalled==1)
		{
			this.m_instances[productId][instance].displayAd();
		}
	},
	setHtmlTarget: function(htmltarget) {
		this.m_instances[this.m_currentProduct][this.m_currentInstance].setHtmlTarget(htmltarget);
	},
	setTargets: function(targets) {
		this.m_instances[this.m_currentProduct][this.m_currentInstance].setTargets(targets);
	},
	setOnload: function(value) {
		this.m_onload=value;
	},
	setCurrentInstance: function(val) {
		this.m_currentInstance = val;
	},
	setCurrentProduct: function(val) {
		this.m_currentProduct = val;
	},
	setSid: function(val){
		this.m_instances[this.m_currentProduct][this.m_currentInstance].setSid(val);
	},
	setBookingId: function(val){
		this.m_instances[this.m_currentProduct][this.m_currentInstance].setBookingId(val);
	},
	setNoPreview: function(val) {
		this.m_noPreview = val;
	},
	setPreview: function(val) {
		this.m_instances[this.m_currentProduct][this.m_currentInstance].setPreview(val);
	},
	setCallback: function(data,val) {
		this.m_instances[this.m_currentProduct][this.m_currentInstance].setCallback(data,val);
	},
	setParams: function(val) {
		this.m_instances[this.m_currentProduct][this.m_currentInstance].setParams(val);
	},
	loadJson: function(url) {
		this.addScript('LBscript_id_'+this.m_currentInstance,url+'&'+new Date().getTime());
	},
	addScript: function(id,url)
	{
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', url);
		script.setAttribute('id', id);
		var sid = document.getElementById(id);
		if(sid){
			document.getElementsByTagName('head')[0].removeChild(sid);
		}
		document.getElementsByTagName('head')[0].appendChild(script);
	},
	displayAd: function() {
		var bookingid = this.checkQuery("EAadid");
		if (!bookingid && this.m_instances[this.m_currentProduct][this.m_currentInstance].m_bid)
		{
			bookingid = this.m_instances[this.m_currentProduct][this.m_currentInstance].m_bid;
		}
		if (bookingid>0 && !this.m_noPreview)
		{
			this.setPreview(1);
			this.loadJson('http://'+this.m_server+'?pid='+this.m_instances[this.m_currentProduct][this.m_currentInstance].m_productId+'&bookingid='+bookingid+'&instance='+this.m_currentInstance+'&callback='+this.m_callback+'&jsononly');
		}
		else if (this.m_currentInstance>0 && (!this.m_noPreview || this.m_instances[productId][instance].m_displayCalled))
		{
			this.loadJson('http://'+this.m_server+'?pid='+this.m_instances[this.m_currentProduct][this.m_currentInstance].m_productId+'&tc='+this.m_instances[this.m_currentProduct][this.m_currentInstance].m_targets+'&sid='+this.m_instances[this.m_currentProduct][this.m_currentInstance].m_sid+'&instance='+this.m_currentInstance+'&callback='+this.m_callback+'&jsononly');
		}
		else
		{
			this.m_instances[this.m_currentProduct][this.m_currentInstance].displayAd();
		}
	},
	checkQuery: function(name) {
		try
		{
		  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		  var regexS = "[\\?&]" + name + "=([^&#]*)";
		  var regex = new RegExp(regexS);
		  var results = regex.exec(window.top.location.search);
		  if(results == null)
			return "";
		  else
			return decodeURIComponent(results[1].replace(/\+/g, " "));
		}catch(e){
			return "";
		}
	}
};

EAad.Library = new EAad.Library();

function EA_execqueue()
{
	var qitem = null;
	while (qitem = EAad.cqueue.shift())
	{
		var qparams = [];
		for (var i=1; i<qitem.length;i++)
		{
			qparams.push(qitem[i]);
		}
		if (typeof EAad.Library[qitem[0]] != "undefined")
		{
			EAad.Library[qitem[0]].apply(EAad.Library, qparams);
		}
	}
};
setTimeout(EA_execqueue, 25);

EAad.cqueue.push = function() {
	Array.prototype.push.apply(this, arguments);
	setTimeout(EA_execqueue, 1);
	return this.length;
};

EAad.cqueue.push(['setData',{"items":[{"data":""}],"bookedcount":0},0,98]);};