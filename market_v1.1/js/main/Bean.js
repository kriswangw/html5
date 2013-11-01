(function() {
	/**
	 * 区域对象
	 */
	Class.create().register('richeninfo.market.Region').construct = function() {
		var _x;
		var _y;
		var _width;
		var _height;
		this.initialize = function(options) {
			_x = options.x;
			_y = options.y;
			_width = options.width;
			_height = options.height;
		};
		this.getX = function() {
			return _x;
		};
		this.setX = function(x) {
			_x = x;
		};
		this.getY = function() {
			return _y;
		};
		this.setY = function(y) {
			_y = y;
		};
		this.getWidth = function() {
			return _width;
		};
		this.setWidth = function(width) {
			_width = width;
		};
		this.getHeight = function(height) {
			return _height;
		};
		this.setHeight = function(height) {
			_height = height;
		};
		this.toString = function() {
			return _x + "," + _y + "," + _width + "," + _height;
		};
	};

	/**
	 * 数字工具对象
	 */
	Class.create().register('richeninfo.market.NumberUtils');
	Class.get('richeninfo.market.NumberUtils').toMoney = function(val) {
		return val.toFixed(2);
	};

})();