(function() {
	/**
	 * 文字坐标
	 */
	Class.create().register('richeninfo.market.TextCoord').construct = function() {
		var _region;
		var _rightTextWidth;
		var _vUnit;
		var _upTextColor;
		var _downTextColor;
		var _defaultTextColor;
		var _preClose
		var _maxDiff;
		var _layer;
		var _id;
		var _NumberUtils = Class.get('richeninfo.market.NumberUtils');
		this.initialize = function(id, options) {
			_id = id;
			_region = options.region;
			_rightTextWidth = options.rightTextWidth;
			_mRegion = options.mRegion;
			_vUnit = options.vUnit;
			_upTextColor = options.upTextColor;
			_downTextColor = options.downTextColor;
			_defaultTextColor = options.defaultTextColor;
			_color = options.color;
			_preClose = options.preClose;
			_maxDiff = options.maxDiff;
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
			var unit = Math.max(_maxDiff * 2 / _vUnit, 0.01);
			var text = new Kinetic.Text({
				fontFamily: _fontFamily,
				fontStyle: 'bold',
				fontSize: 30,
				align: "right",
				width: _region.getWidth(),
				offset: [5, 0]
			});
			var price;
			for (i = 0; i < _vUnit + 1; i++) {
				if (i < _vUnit / 2) {
					price = _preClose + (_vUnit / 2 - i) * unit;
					_layer.add(text.clone({
						x: 0,
						y: i * _region.getHeight() / _vUnit,
						text: _NumberUtils.toMoney(price),
						fill: _upTextColor
					}));
					_layer.add(text.clone({
						x: _region.getWidth() + _mRegion.getWidth(),
						y: i * _region.getHeight() / _vUnit,
						width: _rightTextWidth,
						align: "left",
						offset: [-5, 0],
						text: _NumberUtils.toMoney((_vUnit / 2 - i) * unit * 100 / _preClose) + '%',
						fill: _upTextColor
					}));
				} else if (i > _vUnit / 2) {
					price = _preClose + (_vUnit / 2 - i) * unit;
					_layer.add(text.clone({
						x: 0,
						y: i * _region.getHeight() / _vUnit,
						text: _NumberUtils.toMoney(price),
						fill: _downTextColor
					}));
					_layer.add(text.clone({
						x: _region.getWidth() + _mRegion.getWidth(),
						y: i * _region.getHeight() / _vUnit,
						width: _rightTextWidth,
						align: "left",
						offset: [-5, 0],
						text: _NumberUtils.toMoney((_vUnit / 2 - i) * unit * 100 / _preClose) + '%',
						fill: _downTextColor
					}));
				} else {
					_layer.add(text.clone({
						x: 0,
						y: i * _region.getHeight() / _vUnit,
						text: _NumberUtils.toMoney(_preClose),
						fill: _defaultTextColor
					}));
					_layer.add(text.clone({
						x: _region.getWidth() + _mRegion.getWidth(),
						y: i * _region.getHeight() / _vUnit,
						width: _rightTextWidth,
						align: "left",
						offset: [-5, 0],
						text: _NumberUtils.toMoney((_vUnit / 2 - i) * unit * 100 / _preClose) + '%',
						fill: _defaultTextColor
					}));
				}
			}
			this.alignText();
			_layer.move(_region.getX(), _region.getY());
			canvasStage.add(_layer);
			text = null;
			price = null;
		};

		/**
		 * 设置垂直的对其方式
		 */
		this.alignText = function() {
			var texts = _layer.getChildren();
			console.debug(texts);
			for (var i = 0; i < texts.length; i++) {
				if (!(i < 2 || i > texts.length - 3)) {
					texts[i].setY(texts[i].getY() - texts[i].getHeight() / 2);
				} else if (i > texts.length - 3) {
					texts[i].setY(texts[i].getY() - texts[i].getHeight());
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