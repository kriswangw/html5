(function() {
	/**
	 * 价格线
	 */
	Class.create(Class.get('richeninfo.market.AbstractLine')).register(
		'richeninfo.market.VolumeLine').construct = function($self) {
		this.initialize = function(id, options) {
			$self.super0.initialize.call(this, id, options);
		};

		/**
		 * @param {CanvasStage} canvasStage 面板对象
		 * 绘制图层
		 */
		this.draw = function(canvasStage) {
			this.layer = new Kinetic.Layer({
				id: $self.super0.id
			});
			var points = new Array();
			for (var i = 0; i < this.data.length; i++) {
				points.push(this.getXCoord(i), this.getYCoord(this.calDiff(this.data[i])));
				this.layer.add(new Kinetic.Line({
					points: [this.getXCoord(i), 0, this.getXCoord(i), this.getYCoord(this.calDiff(
						this.data[i]))],
					stroke: this.color,
					strokeWidth: this.lineWidth
				}));
			}
			this.layer.move(this.region.getX(), this.region.getY() + this.region.getHeight());
			canvasStage.add(this.layer);
		};

		/**
		 * 计算纵坐标
		 * @param  {int} index 点的索引值
		 * @return {int}       矫正过的纵坐标
		 */
		this.getYCoord = function(diff) {
			return 0 - Math.ceil(diff * this.yUnit);
		};
		/**
		 * 实现抽象方法：决定如何计算当前点的Y坐标所对应的真实值位移
		 */
		this.calDiff = function(data) {
			return data.volume;
		};
	};
})();