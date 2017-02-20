;
document.title = "我要变title了";

(function() {
	var currentMenu;

	// 改变菜单
	function changeMenu(viewName, $this, param) {
		// _chivox.group($this);	// 选中该（$this）菜单

		changeView(viewName, param);
	}

	// 加载菜单相应的view
	function changeView(viewName, param) {
		_chivox.loadHTML("/tmpl/" + viewName + ".html", function(content) {
			$("#sub-container")[0].innerHTML = "";
			$("#sub-container").append($(content));
			_chivox.loadJS(viewName, "/js/" + viewName + ".js", function() {
				if (solution.js[viewName] && typeof solution.js[viewName] === "function") {
					currentMenu = viewName;
					solution.js[viewName](param);
				}
			})
		});
	}

	// 预设“点击上方菜单”的执行函数
	_chivox.event.set("menuClick", function($this, event, param) {
		var viewName = param[0];
		if (currentMenu == viewName) return;

		changeMenu(viewName, $this, param);
		event.preventDefault();
	});
})();