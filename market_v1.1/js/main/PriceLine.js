(function() {
	/**
	 * 价格线
	 */
	Class.create(Class.get('richeninfo.market.AbstractLine')).register(
		'richeninfo.market.PriceLine').construct = function($self) {
		this.initialize = function(id, options) {
			$self.super0.initialize.call(this, id, options);
		};
		/**
		 * 实现抽象方法：决定如何计算当前点的Y坐标所对应的真实值位移
		 */
		this.calDiff = function(data) {
			return data.price - this.preClose;
		};
	};
})();