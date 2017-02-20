;(function(window, $) {
	// 加载框架的html代码
	$.get('./tmpl/main.html', function(data) {
		$('#container').html(data);

		$.getScript('./js/chivox.js', function() {
			console.log('callback', 'chivox.js加载成功');
		});

		$.getScript('./js/server.js', function() {
			console.log('callback', 'server.js加载成功');
		});

		$.getScript('./js/mainEvent.js', function() {
			console.log('callback', 'mainEvent.js加载成功');
		});

		$.getScript('./js/main.js', function() {
			console.log('callback', 'main.js加载成功');
		});
	});
})(window, $);