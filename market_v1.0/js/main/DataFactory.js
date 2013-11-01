$NS.createNS("main");
$NS.main.DataFactory = function(stockCode) {
	this.stockCode = stockCode;
	this.url = "http://hq2fls.eastmoney.com/EM_Quote2010PictureApplication/Flash.aspx?Type=CR&ID=" + stockCode;
};

$NS.main.DataFactory.prototype = {
	requestData: function(options) {
		var that = this;
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: "../test/stock?code=0005982&preClose=6.29&point=0",
			headers: {
				"Cache-Control": "no-cache"
			},
			timeout: 300,
			success: function(data) {
				// console.debug(data);
				var main = new $NS.main.Main("stock", options, data);
				that.main = main;
				that.main.draw();
				setInterval(function() {
					$.ajax({
						type: 'GET',
						dataType: 'json',
						url: "../test/stock?code=0005982&preClose=6.29",
						headers: {
							"Cache-Control": "no-cache"
						},
						timeout: 300,
						success: function(data) {
							// console.debug(data);
							main.refresh(data);
						},
						error: function(xhr, type) {
							// alert('Ajax error!')
						}
					})
				}, 1000);
			},
			error: function(xhr, type) {
				// alert('Ajax error!')
			}
		})

	}
}