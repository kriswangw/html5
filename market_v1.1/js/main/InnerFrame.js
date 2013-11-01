(function() {
	/**
	 * 中部框架
	 */
	Class.create().register('richeninfo.market.InnerFrame').construct = function() {
		var _region;
		var _vUnit;
		var _hUnit;
		var _color;
		var _lineWidth;
		var _layer;
		var _id;
		this.initialize = function(id, options) {
			_id = id;
			_region = options.region;
			_vUnit = options.vUnit;
			_hUnit = options.hUnit;
			_color = options.color;
			_lineWidth = options.lineWidth;
		};
		/**
		 * @param {CanvasStage} canvasStage 面板对象
		 * 绘制图层
		 */
		this.draw = function(canvasStage) {
			_layer = new Kinetic.Layer({
				id: _id
			});
			var rect = new Kinetic.Rect({
				x: 0,
				y: 0,
				width: _region.getWidth(),
				height: _region.getHeight(),
				stroke: _color,
				strokeWidth: _lineWidth || 1
			});
			_layer.add(rect);

			var line;
			//水平线
			for (var i = 0; i < _vUnit - 1; i++) {
				var y = Math.ceil((_region.getHeight() / _vUnit) * (i + 1));
				line = new Kinetic.Line({
					points: [0, y, _region.getWidth(), y],
					stroke: _color,
					strokeWidth: _lineWidth || 1
				});
				_layer.add(line);
			}
			//垂直线
			var x;
			for (var i = 0; i < _hUnit - 1; i++) {
				x = Math.ceil(_region.getWidth() * (i + 1) / _hUnit);
				line = new Kinetic.Line({
					points: [x, 0, x, _region.getHeight()],
					stroke: _color,
					strokeWidth: _lineWidth || 1
				});
				_layer.add(line);
			}
			_layer.move(_region.getX(), _region.getY());
			canvasStage.add(_layer);
		};

		/**
		 * 刷新图层
		 */
		this.refresh = function() {
			_layer.draw();
		};
	};
})();