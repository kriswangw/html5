(function() {
	/**
	 * 画板对象
	 */
	Class.create().register('richeninfo.market.CanvasStage').construct = function() {
		var _stage;
		this.initialize = function(stockCode, height) {
			var div = $('<div></div>');
			div.attr('id', stockCode);
			div.attr('style', 'margin:0 10px 0 10px');
			// div.attr('style', 'margin:0 10px 0 10px;border:1px solid red');
			div.appendTo('body');
			_stage = new Kinetic.Stage({
				container: stockCode,
				width: div.offset().width,
				height: height
			});
			/*var layer = new Kinetic.Layer();
			var height = 50.4;
			for (var i = 50; i < 150; i = i + 10.1) {
				console.debug([50, i, 100, i]);
				layer.add(new Kinetic.Line({
					points: [50, i, 100, i],
					stroke: "red",
					strokeWidth: 1,
					lineJoin: 'round'
				}));
			}
			_stage.add(layer);*/
		};

		this.add = function(layer) {
			_stage.add(layer);
		};

	};
})();