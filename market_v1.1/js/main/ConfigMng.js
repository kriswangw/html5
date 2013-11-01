(function() {
	/**
	 * 配置管理对象
	 */
	Class.create().register('richeninfo.market.ConfigMng').construct = function() {

		var _requestUrl = 'js/data/testData.json';
		var _mRegion;
		var _bRegion;
		var _textRegion;
		var _volumeTextRegion;
		var _timeTextRegion;

		this.options = {
			refreshFreq: 3,
			pointSize: 241,
			hUnit: ['09:30', '10:30', '11:30/13:00', '14:00', '15:00'],
			mVunit: 4,
			bVunit: 2,
			leftTextWidth: 84,
			rightTextWidth: 110,
			textHeight: 50,
			upTextColor: 'red',
			downTextColor: 'green',
			timeTextColor: '#89A3BC',
			defaultTextColor: '#4C4C4C',
			mHeight: 340,
			bHeight: 110,
			frameLineStyle: 'gray',
			frameLineWidth: 1,
			priceLineWidth: 3,
			priceLineColor: '#0158A7',
			avgLineColor: '#FFA200',
			volumeLineWidth: 1,
			fontFamily: 'Heiti SC'
		};

		this.initialize = function() {

		};

		/**
		 * 初始化中部绘图区域位置
		 * @param  {string} stockCode 股票代码
		 */
		this.initRegion = function(stockCode) {
			var canvasOffset = $('#' + stockCode).offset();
			console.debug('canvasOffset.width', canvasOffset);
			var that = this;
			_mRegion = Class.get('richeninfo.market.Region').create({
				x: that.options.leftTextWidth + 0.5,
				y: that.options.textHeight + 0.5,
				width: canvasOffset.width - this.options.leftTextWidth - this.options.rightTextWidth,
				height: this.options.mHeight
			});
			_bRegion = Class.get('richeninfo.market.Region').create({
				x: _mRegion.getX(),
				y: that.options.textHeight * 2 + this.options.mHeight + 0.5,
				width: _mRegion.getWidth(),
				height: this.options.bHeight
			});
			_topTextRegion = Class.get('richeninfo.market.Region').create({
				x: _mRegion.getX(),
				y: 0,
				width: _mRegion.getWidth(),
				height: this.options.textHeight
			});
			_textRegion = Class.get('richeninfo.market.Region').create({
				x: 0,
				y: that.options.textHeight,
				width: this.options.leftTextWidth,
				height: this.options.mHeight
			});
			_volumeTextRegion = Class.get('richeninfo.market.Region').create({
				x: 0,
				y: _bRegion.getY(),
				width: this.options.leftTextWidth,
				height: this.options.bHeight
			});
			_timeTextRegion = Class.get('richeninfo.market.Region').create({
				x: _mRegion.getX(),
				y: _mRegion.getY() + _mRegion.getHeight(),
				width: _mRegion.getWidth(),
				height: this.options.textHeight
			});
		};

		this.getRequestUrl = function() {
			return _requestUrl;
		};

		this.getMRegion = function() {
			return _mRegion;
		};

		this.getBRegion = function() {
			return _bRegion;
		};

		this.getTopTextRegion = function() {
			return _topTextRegion;
		};
		this.getTextRegion = function() {
			return _textRegion;
		};

		this.getVolumeTextRegion = function() {
			return _volumeTextRegion;
		};

		this.getTimeTextRegion = function() {
			return _timeTextRegion;
		};

		this.getXUnit = function() {
			return _mRegion.getWidth() / (this.options.pointSize - 1);
		};

		this.getPYUnit = function(diff) {
			if (diff == 0) {
				return 0;
			}
			return _mRegion.getHeight() / 2 / diff;
		};

		this.getVYUnit = function(diff) {
			if (diff == 0) {
				return 0;
			}
			return _bRegion.getHeight() / diff;
		};

		/**
		 * 根据参数生成请求地址
		 * @return {string} 请求地址
		 */
		this.generateRequestUrl = function(stockCode) {
			//TODO
		};

		this.getRegionHeight = function() {
			return this.options.mHeight + this.options.bHeight + this.options.textHeight * 2 + 1;
		};
	};
})();