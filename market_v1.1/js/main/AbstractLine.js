(function() {
	/**
	 * 抽象线（可以是价格线，或各种均线）
	 */
	Class.create().register('richeninfo.market.AbstractLine').construct = function() {
		this.region = null;
		this.lineWidth = null;
		this.color = null;
		this.yUnit = null;
		this.xUnit = null;
		this.preClose = null;
		this.data = null;
		this.layer = null;
		this.id = null;
		this.initialize = function(id, options) {
			this.id = id;
			this.region = options.region;
			this.lineWidth = options.lineWidth;
			this.color = options.color;
			this.yUnit = options.yUnit;
			this.xUnit = options.xUnit;
			this.preClose = options.preClose;
			this.data = options.data;
		};

		
		/**
		 * @param {CanvasStage} canvasStage 面板对象
		 * 绘制图层
		 */
		this.draw = function(canvasStage) {
			this.layer = new Kinetic.Layer({
				id: this.id
			});
			var points = new Array();
			for (var i = 0; i < this.data.length; i++) {
				points.push(this.getXCoord(i), this.getYCoord(this.calDiff(this.data[i])));
			}
			if (points.length < 3) {
				var line = new Kinetic.Line({
					points: points,
					stroke: this.color,
					strokeWidth: this.lineWidth,
					lineJoin: 'round'
				});
				this.layer.add(line);
			} else {
				var line = new Kinetic.Line({
					points: points.slice(0, points.length - 2),
					stroke: this.color,
					strokeWidth: this.lineWidth,
					lineJoin: 'round'
				});
				var lastLine = new Kinetic.Line({
					points: points.slice(points.length - 4),
					stroke: this.color,
					strokeWidth: this.lineWidth,
					lineJoin: 'round'
				});
				this.layer.add(line);
				this.layer.add(lastLine);
			}
			this.layer.move(this.region.getX(), this.region.getY() + this.region.getHeight() / 2);
			canvasStage.add(this.layer);
			points = null;
		};

		/**
		 * 抽象方法：决定如何计算当前点的Y坐标所对应的真实值位移
		 */
		this.calDiff = Class.abstractMethod;

		/**
		 * 计算横坐标
		 * @param  {int} index 点的索引值
		 * @return {int}       矫正过的横坐标
		 */
		this.getXCoord = function(index) {
			return Math.ceil(index * this.xUnit);
		};

		/**
		 * 计算纵坐标
		 * @param  {int} index 点的索引值
		 * @return {int}       矫正过的纵坐标
		 */
		this.getYCoord = function(diff) {
			return diff > 0 ? 0 - Math.ceil(diff * this.yUnit) : 0 - Math.floor(diff * this.yUnit);
		};

		/**
		 * 刷新图层
		 */
		this.refresh = function() {
			this.layer.draw();
		};
	};
})();