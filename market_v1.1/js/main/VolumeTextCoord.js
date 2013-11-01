(function() {
	/**
	 * 成交量文字坐标
	 */
	Class.create().register('richeninfo.market.VolumeTextCoord').construct = function() {
		var _region;
		var _rightTextWidth;
		var _vUnit;
		var _upTextColor;
		var _downTextColor;
		var _defaultTextColor;
		var _maxVolume;
		var _fontFamily;
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
			_maxVolume = options.maxVolume;
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
			var unit = _maxVolume / 1000000 / _vUnit;
			var text = new Kinetic.Text({
				fontFamily: _fontFamily,
				fontStyle: 'bold',
				fontSize: 30,
				align: "right",
				fill: _defaultTextColor,
				width: _region.getWidth(),
				offset: [5, 0]
			});
			var volume;
			for (i = 0; i < _vUnit + 1; i++) {
				if (i < _vUnit) {
					volume = (_vUnit - i) * unit;
					console.debug(volume);
					_layer.add(text.clone({
						x: 0,
						y: i * _region.getHeight() / _vUnit,
						text: _NumberUtils.toMoney(volume)
					}));
					_layer.add(text.clone({
						x: _region.getWidth() + _mRegion.getWidth(),
						y: i * _region.getHeight() / _vUnit,
						width: _rightTextWidth,
						align: "left",
						offset: [-5, 0],
						text: _NumberUtils.toMoney(volume)
					}));
				} else {
					_layer.add(text.clone({
						x: 0,
						y: i * _region.getHeight() / _vUnit,
						text: '万手',
					}));
					_layer.add(text.clone({
						x: _region.getWidth() + _mRegion.getWidth(),
						y: i * _region.getHeight() / _vUnit,
						width: _rightTextWidth,
						align: "left",
						offset: [-5, 0],
						text: '万手'
					}));
				}
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