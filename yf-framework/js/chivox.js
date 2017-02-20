;(function() {
	var $$$ = {},
		_chivox = $$$,
		document = window.document;
	window._chivox = _chivox;
	var _cache = {};	// 缓存html页面

	// 事件管理器
	var _event = (function() {
		// 形成闭包，数据安全
		var _eventCollect = {};	// 事件集合，key为时间名，value为相应的执行函数
		return {
			fire: function(eventName, $this, event, param) {
				if (_eventCollect[eventName]) {	// 如果该事件对应的有函数，则执行它
					_eventCollect[eventName]($this, event, param);
				} else {
					console.log("方法：" + eventName + "不存在");
				};
			},
			set: function(eventName, fn) {
				_eventCollect[eventName] = fn;
			}
		};
	})();

	$.extend(_chivox, {
		event: _event,
		// 加载js代码
		loadJS: function(viewName, jsurl, callback) {
			var SID = viewName;
			// 得到head元素
			var nodeHead = document.getElementsByTagName('head')[0];
			var nodeScript = null;
			if (document.getElementById(SID + "_js") == null) {	// 还未添加该js文件到head中
				nodeScript = document.createElement('script');
				nodeScript.setAttribute('type', 'text/javascript');
				nodeScript.setAttribute('src', jsurl);
				nodeScript.setAttribute('id', SID + "_js");
				if (callback != null) {
					nodeScript.onload = nodeScript.onreadystatechange = function() {
						if (!nodeScript.ready) {
							nodeScript.ready = true;
							callback();
						}
					};
				};
				nodeHead.appendChild(nodeScript);
			} else {	// 该js文件已经添加到head中
				if (callback != null) {
					callback();
				};
			}
		},
		// 加载html代码
		loadHTML: function(url, callback) {
			var id = url.replace(/\/|\./g, "");	// 把url中的所有/和.删除，作为_cache的key
			if (_cache[id]) {
				callback(_cache[id]);
			} else {
				$.ajax({
					url: url,
					async: true,
					dataType: 'html'
				}).done(function(context) {
					_cache[id] = context;
					callback(context);
				});
			};
		},
		/**
		 * 为$DOM添加特定样式，比如“选中”样式
		 * @param $DOM jquery实例
		 * @param className 要为$DOM添加的class名
		 */
		group: function($DOM, className) {
			var cn = className ? className : 'active';
			if ($DOM.hasClass(cn)) {
				return false; // 没有添加成功（不需要再次添加）
			} else {
				var group = $DOM.data("chivox-group");
				$("[data-chivox-group=" + group + "]").removeClass(cn);
				$DOM.addClass(cn);
				return true;
			};
		}
	});

	// 为“菜单”监听click事件
	$(document).on("click", "[data-chivox-event*=click]", function(event) {
		// data-chivox-event的值，形如：click:menuClick&kyds
		var reg = /click:(\w+)[\w&]*/;
		var chivoxEvent = $(this).data("chivox-event");
		var e = chivoxEvent.match(reg);
		var eventName = e[1];	// 解析出事件名称，比如menuClick
		var regParam = /&(.+)$/;
		var p = e[0].match(regParam);
		var param = p ? p[1].split("&") : [];	// 如果e[0]中能匹配到，则将参数转化为参数数组，否则为空数组
		// 执行预设的事件函数
		_chivox.event.fire(eventName, $(this), event, param);

		// event.stopPropagation();
	});

	$(document).on("click","[data-chivox-group]",function (event){
		_chivox.group($(this));
	});

})();