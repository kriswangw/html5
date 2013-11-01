(function() {
	/**
	 * 数据管理对象
	 */
	Class.create().register('richeninfo.market.DataMng').construct = function() {
		var _maxPrice = 0;
		var _maxPriceDiff = 0;
		var _maxVolume = 0;
		var _preClose = 0;
		var _data;

		this.initialize = function() {};
		/**
		 * 请求行情数据
		 * @param  {string} requestUrl 请求地址
		 * @param  {string} update      是否为增量数据
		 * @param {function} callback 回调函数
		 */
		this.requestData = function(requestUrl, isUpdate, callback) {
			// console.debug(requestUrl, time, $.type(async), $.type(async) == 'undefined');
			// var update = $.type(async) == 'undefined';
			if ($.type(callback) == 'undefined') {
				throw new Error('缺少参数');
			}
			$.ajax({
				type: 'GET',
				dataType: 'json',
				url: requestUrl,
				headers: {
					'Cache-Control': 'no-cache'
				},
				timeout: 300,
				success: function(data) {
					// console.debug(data);
					_data = data;
					_processData(isUpdate);
					callback();
				},
				error: function(xhr, type) {
					console.debug('requestData error');
				}
			});
		};

		/**
		 * 解析数据
		 * @param  {string} time 时间
		 */
		var _processData = function(isUpdate) {
			if ($.type(_data) == 'undefined') {
				throw new Error('no data');
			}
			if (!isUpdate) {
				//全量数据
				_preClose = _data.quote.preClose;
				if ($.type(_preClose) == 'undefined') {
					throw new Error('no preClose');
				}
				$.each(_data.data, function(index, item) {
					var diff = Math.abs(item.price - _preClose);
					if (diff > _maxPriceDiff) {
						_maxPrice = item.price;
						_maxPriceDiff = diff;
					}
					if (item.volume > _maxVolume) {
						_maxVolume = item.volume;
					}
				});
			} else {
				//增量数据
			}
		};

		this.getMaxDiff = function() {
			return _maxPriceDiff;
		};

		this.getMaxVolume = function() {
			return _maxVolume;
		};

		this.getPreClose = function() {
			return _preClose;
		};

		this.getPriceData = function() {
			return _data.data;
		};

		this.toString = function() {
			return 'maxPrice:' + _maxPrice + ',' + 'maxPriceDiff:' + _maxPriceDiff + ':' +
				_maxPriceDiff + ',maxVolume:' + _maxVolume + ',preClose:' + _preClose;
		};

	};
})();