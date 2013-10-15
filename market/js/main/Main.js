$NS.createNS("main");
$NS.main.Main = function(canvasId, options, data) {
	this.canvasId = canvasId;
	this.options = options;
	this.data = data;
	this.initialize();
};

$NS.main.Main.prototype = {
	initialize: function() {
		this.canvas = document.getElementById(this.canvasId);
		if (this.canvas && this.canvas.getContext) {
			var context = this.canvas.getContext("2d");
			if (context) {
				this.context = context;
				console.debug("canvasId:", this.canvasId);
				console.debug("options:", this.options);
				console.debug("data:", this.data);
				console.debug("context:", this.context);
			}
		}
	},

	draw: function() {
		this.drawOuter();
		this.drawTopText();
		this.drawInner();
	},

	drawTopText: function() {
		var ctx = this.context;
		ctx.save();

		var numberUtil = $NS.utils.NumberUtil;
		var quote = this.data.quote;
		var global = this.options.global;
		var topText = this.options.topText;
		ctx.fillStyle = global.baseTextColor;
		ctx.font = global.font;
		ctx.textBaseline = "top";
		//TODO:process number
		var diff = quote.price - quote.preClose;
		var diffText = diff > 0 ? "↑+" : "↓";
		var diffRateText = diff > 0 ? "+" + numberUtil.toMoney(diff * 100 / quote.preClose) : numberUtil.toMoney(diff * 100 / quote.preClose);
		var textWidth = ctx.measureText("最新" + quote.price).width;
		this.context.fillText("最新" + numberUtil.toMoney(quote.price), topText.region[0], topText.region[1]);
		this.context.fillStyle = diff > 0 ? global.upTextColor : global.downTextColor;
		this.context.fillText(diffText + numberUtil.toMoney(diff) + "(" + diffRateText + ")", topText.region[0] + textWidth, topText.region[1]);

		ctx.fillStyle = global.baseTextColor;
		var time = quote.time.toString().slice(8, 10) + ":" + quote.time.toString().slice(10, 12);
		var timeWidth = ctx.measureText(time).width;
		ctx.fillText(time, topText.region[0] + topText.region[2] - timeWidth, topText.region[1]);

		ctx.restore();
	},

	drawOuter: function() {
		var ctx = this.context;
		ctx.save();
		console.log("this.canvas.width:", this.canvas.width);
		console.log("this.canvas.height:", this.canvas.height);
		this.context.strokeStyle = this.options.global.borderColor;
		// this.context.strokeWidth = 
		this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.restore();
	},

	drawInner: function() {
		this.drawCrrodLine();
		this.drawPriceLine();
	},

	drawCrrodLine: function() {
		var ctx = this.context;
		console.debug(ctx);
		ctx.save();
		var global = this.options.global;
		var hUnit = this.options.hUnit;
		var vUnit = this.options.vUnit;
		var region = this.options.inner.region;

		ctx.translate(region[0], region[1]);
		ctx.strokeStyle = global.borderColor;
		ctx.strokeRect(0, 0, region[2], region[3]);
		//水平线
		for (i = 0; i < vUnit - 1; i++) {
			ctx.beginPath();
			ctx.moveTo(0, (region[3] / vUnit) * (i + 1));
			ctx.strokeStyle = i == vUnit / 2 - 1 ? "red" : this.options.unitLine;
			console.debug("region[2]:", region[2]);
			console.debug("(region[3] / vUnit) * (i + 1):", (region[3] / vUnit) * (i + 1));
			ctx.lineTo(region[2], (region[3] / vUnit) * (i + 1));
			ctx.stroke();
		}
		//垂直线
		for (i = 0; i < hUnit.length - 2; i++) {
			ctx.beginPath();
			ctx.moveTo(region[2] * (i + 1) / (hUnit.length - 1), 0);
			ctx.lineTo(region[2] * (i + 1) / (hUnit.length - 1), region[3]);
			ctx.stroke();
		}
		ctx.restore();
	},

	drawPriceLine: function() {
		var ctx = this.context;
		ctx.save();
		var region = this.options.inner.region;
		var color = this.options.inner.color;
		var data = this.data.mins;
		var quote = this.data.quote;
		var length = this.options.inner.length;
		//转移坐标位置
		ctx.translate(region[0], region[1] + region[3] / 2);
		var maxDiff = 0, temp = 0;
		data.forEach(function(item, index, array){
			temp = Math.abs(item.price - quote.preClose);
			if(temp > maxDiff){
				maxDiff = temp;
			}
		});
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(this.getX(0, region, length), this.getY(data[0].price - quote.preClose, maxDiff, region));
		for(i = 1;i < data.length;i++){
			// console.debug("this.getX(i, region, length):", this.getX(i, region, length));
			// console.debug("this.getY(data[i].price - quote.preClose, maxDiff, region):", this.getY(data[i].price - quote.preClose, maxDiff, region));
			ctx.lineTo(this.getX(i, region, length), this.getY(data[i].price - quote.preClose, maxDiff, region));
		}
		ctx.stroke();
		ctx.restore();
	},

	getY: function(diff, maxDiff, region) {
		return 0 - (region[3] / 2 * diff / maxDiff);
	},

	getX: function(index, region, length) {
		return region[2] * index / length;
	},

	drawLeftText: function() {
		
	}

};