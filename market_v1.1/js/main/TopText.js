(function() {
	/**
	 * 头部
	 */
	Class.create().register('richeninfo.market.TopText').construct = function() {
		var _region;
		var _stockName;
		var _color;
		var _fontFamily;
		var _lastData;
		var _layer;
		var _id;
		var _NumberUtils = Class.get('richeninfo.market.NumberUtils');
		this.initialize = function(id, options) {
			_id = id;
			_region = options.region;
			_lastData = options.lastData;
			_color = options.color;
			_fontFamily = options.fontFamily;
			_stockName = options.stockName;
		};
		/**
		 * @param {CanvasStage} canvasStage 面板对象
		 * 绘制图层
		 */
		this.draw = function(canvasStage) {
			_layer = new Kinetic.Layer({
				id: _id
			});
			//股票名称
			var text = new Kinetic.Text({
				fontFamily: _fontFamily,
				fontStyle: 'bold',
				fontSize: 30,
				fill: _color,
				text: _stockName,
				offset: [0, -10]
			});
			_layer.add(text);
			var date = new Date();
			text = text.clone({
				text: date.getMonth().toString().concat('-').concat(date.getDate()).concat(
					' ').concat(_lastData.time.slice(0, 2)).concat(':').concat(_lastData.time.slice(2)),
				align: 'right'
			});
			text.setX(_region.getWidth() - text.getWidth());
			_layer.add(text);
			text = text.clone({
				text: date.getMonth().toString().concat('-').concat(date.getDate()).concat(
					' ').concat(_lastData.time.slice(0, 2)).concat(':').concat(_lastData.time.slice(2)),
				align: 'right'
			});
			text.setX(_region.getWidth() - text.getWidth());
			_layer.add(text);
			var circle = new Kinetic.Circle({
				x: 0,
				y: 0,
				radius: 3,
				fill: '#0158A7'
			});
			_layer.move(_region.getX(), _region.getY());
			canvasStage.add(_layer);
			text = null;
		};

		/**
		 * 刷新图层
		 */
		this.refresh = function() {
			_layer.draw();
		};
	};
})();