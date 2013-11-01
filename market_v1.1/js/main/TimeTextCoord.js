(function() {
	/**
	 * 时间文字坐标
	 */
	Class.create().register('richeninfo.market.TimeTextCoord').construct = function() {
		var _region;
		var _hUnit;
		var _defaultTextColor;
		var _layer;
		var _id;
		this.initialize = function(id, options) {
			_id = id;
			_region = options.region;
			_hUnit = options.hUnit;
			_defaultTextColor = options.defaultTextColor;
			_fontFamily = options.fontFamily;
		};
		/**
		 * @param {CanvasStage} canvasStage 面板对象
		 * 绘制图层
		 */
		this.draw = function(canvasStage) {
			_layer = new Kinetic.Layer({
				id: _id
			});
			var text = new Kinetic.Text({
				fontFamily: _fontFamily,
				fontStyle: 'bold',
				fontSize: 25,
				align: "left",
				fill: _defaultTextColor,
				offset: [0, -10]
			});
			console.debug(_region.toString(), _hUnit);
			for (var i = 0; i < _hUnit.length; i++) {
				x = Math.ceil(_region.getWidth() * i / (_hUnit.length - 1));
				_layer.add(text.clone({
					x: x,
					y: 0,
					text: _hUnit[i]
				}));
			}
			this.alignText();
			_layer.move(_region.getX(), _region.getY());
			canvasStage.add(_layer);
			text = null;
			volume = null;
		};

		/**
		 * 设置垂直的对其方式
		 */
		this.alignText = function() {
			var texts = _layer.getChildren();
			for (var i = 0; i < texts.length; i++) {
				if (!(i < 1 || i > texts.length - 2)) {
					texts[i].setX(texts[i].getX() - texts[i].getWidth() / 2);
				} else if (i > texts.length - 2) {
					texts[i].setX(texts[i].getX() - texts[i].getWidth());
				}
			}
		};

		/**
		 * 刷新图层
		 */
		this.refresh = function() {
			_layer.draw();
		};
	};
})();