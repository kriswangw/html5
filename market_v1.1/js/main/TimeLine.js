(function() {
	/**
	 * 分时行情绘图对象
	 */
	Class.create().register('richeninfo.market.TimeLine').construct = function() {
		var _configMng;
		var _dataMng;
		var _canvasStage;
		var _eventMng;
		var _stockName;
		var _stockCode;
		var _innerFrameTop;
		var _innerFrameBottom;
		var _textCoord;
		var _volumeTextCoord;
		var _timeTextCoord;
		var _priceLine;
		this.initialize = function(stockName, stockCode) {
			_stockName = stockName;
			_stockCode = stockCode;
			_configMng = Class.get('richeninfo.market.ConfigMng').create();
			// _eventMng = Class.get('richeninfo.market.EventMng').create();
		};
		/**
		 * 开始绘图
		 */
		this.start = function() {
			var that = this;
			//初始化数据对象
			_dataMng = Class.get('richeninfo.market.DataMng').create();
			_dataMng.requestData(_configMng.getRequestUrl(), false, function() {
				//初始化画板
				_canvasStage = Class.get('richeninfo.market.CanvasStage').create(_stockCode,
					_configMng.getRegionHeight());
				//初始化配置对象
				_configMng.initRegion(_stockCode);
				//初始化事件对象
				console.debug(_configMng.getMRegion().toString());
				//绘制表格框架
				_innerFrameTop = Class.get('richeninfo.market.InnerFrame').create(that.generateId(
					'innerTop'), {
					region: _configMng.getMRegion(),
					vUnit: _configMng.options.mVunit,
					hUnit: _configMng.options.hUnit.length - 1,
					color: _configMng.options.frameLineStyle,
					lineWidth: _configMng.options.frameLineWidth
				});
				_innerFrameTop.draw(_canvasStage);
				_innerFrameBottom = Class.get('richeninfo.market.InnerFrame').create(that.generateId(
					'innerBottom'), {
					region: _configMng.getBRegion(),
					vUnit: _configMng.options.bVunit,
					hUnit: _configMng.options.hUnit.length - 1,
					color: _configMng.options.frameLineStyle,
					lineWidth: _configMng.options.frameLineWidth
				});
				_innerFrameBottom.draw(_canvasStage);
				console.debug(_dataMng.toString(), _dataMng.getMaxDiff(), 80690000 / 1000000);

				_textCoord = Class.get('richeninfo.market.TextCoord').create(that.generateId(
					'textCoord'), {
					region: _configMng.getTextRegion(),
					rightTextWidth: _configMng.options.rightTextWidth,
					mRegion: _configMng.getMRegion(),
					vUnit: _configMng.options.mVunit,
					upTextColor: _configMng.options.upTextColor,
					downTextColor: _configMng.options.downTextColor,
					defaultTextColor: _configMng.options.defaultTextColor,
					fontFamily: _configMng.options.fontFamily,
					maxDiff: _dataMng.getMaxDiff(),
					preClose: _dataMng.getPreClose()
				});
				_textCoord.draw(_canvasStage);

				_topText = Class.get('richeninfo.market.TopText').create(that.generateId(
					'topText'), {
					stockName : _stockName,
					region: _configMng.getTopTextRegion(),
					color: _configMng.options.defaultTextColor,
					lastData : _dataMng.getPriceData().pop(),
					fontFamily: _configMng.options.fontFamily
				});
				_topText.draw(_canvasStage);

				_volumeTextCoord = Class.get('richeninfo.market.VolumeTextCoord').create(that.generateId(
					'volumeTextCoord'), {
					region: _configMng.getVolumeTextRegion(),
					rightTextWidth: _configMng.options.rightTextWidth,
					mRegion: _configMng.getMRegion(),
					vUnit: _configMng.options.bVunit,
					upTextColor: _configMng.options.upTextColor,
					downTextColor: _configMng.options.downTextColor,
					defaultTextColor: _configMng.options.timeTextColor,
					fontFamily: _configMng.options.fontFamily,
					maxVolume: _dataMng.getMaxVolume()
				});
				_volumeTextCoord.draw(_canvasStage);

				_timeTextCoord = Class.get('richeninfo.market.TimeTextCoord').create(that.generateId(
					'timeTextCoord'), {
					region: _configMng.getTimeTextRegion(),
					hUnit: _configMng.options.hUnit,
					defaultTextColor: _configMng.options.defaultTextColor,
					fontFamily: _configMng.options.fontFamily
				});
				_timeTextCoord.draw(_canvasStage);

				_priceLine = Class.get('richeninfo.market.PriceLine').create(that.generateId(
					'priceLine'), {
					region: _configMng.getMRegion(),
					lineWidth: _configMng.options.priceLineWidth,
					color : _configMng.options.priceLineColor,
					yUnit: _configMng.getPYUnit(_dataMng.getMaxDiff()),
					xUnit: _configMng.getXUnit(),
					preClose: _dataMng.getPreClose(),
					data: _dataMng.getPriceData()
				});

				_priceLine.draw(_canvasStage);

				_avgLine = Class.get('richeninfo.market.AvgLine').create(that.generateId(
					'avgLine'), {
					region: _configMng.getMRegion(),
					lineWidth: _configMng.options.priceLineWidth,
					color : _configMng.options.avgLineColor,
					yUnit: _configMng.getPYUnit(_dataMng.getMaxDiff()),
					xUnit: _configMng.getXUnit(),
					preClose: _dataMng.getPreClose(),
					data: _dataMng.getPriceData()
				});
				_avgLine.draw(_canvasStage);

				_volumeLine = Class.get('richeninfo.market.VolumeLine').create(that.generateId(
					'volumeLine'), {
					region: _configMng.getBRegion(),
					lineWidth: _configMng.options.volumeLineWidth,
					color : _configMng.options.downTextColor,
					yUnit: _configMng.getVYUnit(_dataMng.getMaxVolume()),
					xUnit: _configMng.getXUnit(),
					preClose: _dataMng.getPreClose(),
					data: _dataMng.getPriceData()
				});
				_volumeLine.draw(_canvasStage);
			});
		};

		this.generateId = function(id) {
			return _stockCode + '-' + id;
		};
	};
})();