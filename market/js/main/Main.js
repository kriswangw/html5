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
		this.drawVolume();
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
		this.drawLeftText();
		this.drawRightText();
		this.drawBottomText();
	},

	drawVolume: function() {
		this.drawVolumeCrrodLine();
		this.drawVolumeLine();
		this.drawVolumeLeftText();
	},

	drawCrrodLine: function() {
		var ctx = this.context;
		console.debug(ctx);
		ctx.save();
		var global = this.options.global;
		var hUnit = this.options.hUnit;
		var vUnit = this.options.vUnit;
		var region = this.options.inner.region;
		var canvasUtil = $NS.utils.CanvasUtil;

		ctx.translate(region[0], region[1]);
		ctx.strokeStyle = global.borderColor;
		ctx.strokeRect(0, 0, region[2], region[3]);
		//水平线
		for (i = 0; i < vUnit - 1; i++) {
			// ctx.beginPath();
			// ctx.moveTo(0, (region[3] / vUnit) * (i + 1));
			// console.debug("region[2]:", region[2]);
			// console.debug("(region[3] / vUnit) * (i + 1):", (region[3] / vUnit) * (i + 1));
			// ctx.lineTo(region[2], (region[3] / vUnit) * (i + 1));
			console.debug("drawHDashLine:", (region[3] / vUnit) * (i + 1));
			console.debug(i);
			canvasUtil.drawHDashLine(ctx, 5, (region[3] / vUnit) * (i + 1), region[2], (region[3] / vUnit) * (i + 1), 2, 2, i == vUnit / 2 - 1 ? "red" : this.options.unitLine);


			// ctx.stroke();
		}
		//垂直线
		for (i = 0; i < hUnit.length - 2; i++) {
			// ctx.beginPath();
			// ctx.moveTo(region[2] * (i + 1) / (hUnit.length - 1), 0);
			// ctx.lineTo(region[2] * (i + 1) / (hUnit.length - 1), region[3]);
			canvasUtil.drawVDashLine(ctx, region[2] * (i + 1) / (hUnit.length - 1), 5, region[2] * (i + 1) / (hUnit.length - 1), region[3], 2, 2, this.options.unitLine);
			// ctx.stroke();
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
		var ctx = this.context;
		ctx.save();
		var region = this.options.inner.region;
		var color = this.options.inner.color;
		var data = this.data.mins;
		var quote = this.data.quote;
		var length = this.options.inner.length;
		var maxDiff = 0, temp = 0;
		var vUnit = this.options.vUnit;
		var numberUtil = $NS.utils.NumberUtil;
		var global = this.options.global;
		data.forEach(function(item, index, array){ 
			temp = Math.abs(item.price - quote.preClose);
			if(temp > maxDiff){
				maxDiff = temp;
			}
		});
		var unit = Math.max(maxDiff * 2 / vUnit, 0.01);
		var leftRegion = this.options.inner.leftText.region;
		ctx.translate(leftRegion[0], leftRegion[1]);
		ctx.textBaseline = this.options.inner.leftText.textBaseline;
		ctx.font = this.options.inner.leftText.font;
		for(i = 0;i < vUnit + 1;i++){
			if(i < vUnit / 2){
				// array.push(numberUtil.toMoney(quote.preClose + (vUnit / 2 - i) * unit));
				ctx.fillStyle = global.upTextColor; 
				ctx.fillText(numberUtil.toMoney(quote.preClose + (vUnit / 2 - i) * unit), 0, i * region[3] / vUnit);
			}else if(i > vUnit / 2){
				// array.push(numberUtil.toMoney(quote.preClose - (i - vUnit / 2) * unit));
				ctx.fillStyle = global.downTextColor; 
				ctx.fillText(numberUtil.toMoney(quote.preClose - (i - vUnit / 2) * unit), 0, i * region[3] / vUnit);
			}else{
				// array.push(numberUtil.toMoney(quote.preClose));
				ctx.fillStyle = global.baseTextColor; 
				ctx.fillText(numberUtil.toMoney(quote.preClose), 0, i * region[3] / vUnit);
			}
		}
		ctx.restore();
	},

	drawRightText: function() {
		var ctx = this.context;
		ctx.save();
		var region = this.options.inner.region;
		var color = this.options.inner.color;
		var data = this.data.mins;
		var quote = this.data.quote;
		var length = this.options.inner.length;
		var maxDiff = 0, temp = 0;
		var vUnit = this.options.vUnit;
		var numberUtil = $NS.utils.NumberUtil;
		var global = this.options.global;
		data.forEach(function(item, index, array){
			temp = Math.abs(item.price - quote.preClose);
			if(temp > maxDiff){
				maxDiff = temp;
			}
		});
		var unit = Math.max(maxDiff * 2 / vUnit, 0.01);
		var rightRegion = this.options.inner.rightText.region;
		ctx.translate(rightRegion[0], rightRegion[1]);
		ctx.textBaseline = this.options.inner.rightText.textBaseline;
		ctx.font = this.options.inner.rightText.font;
		for(i = 0;i < vUnit + 1;i++){
			if(i < vUnit / 2){
				ctx.fillStyle = global.upTextColor; 
				ctx.fillText(numberUtil.toMoney((vUnit / 2 - i) * unit * 100 / quote.preClose) + "%", 0, i * region[3] / vUnit);
			}else if(i > vUnit / 2){
				ctx.fillStyle = global.downTextColor; 
				ctx.fillText(numberUtil.toMoney((0 - (i - vUnit / 2)) * unit * 100 / quote.preClose) + "%", 0, i * region[3] / vUnit);
			}else{
				ctx.fillStyle = global.baseTextColor; 
				ctx.fillText("0.00%", 0, i * region[3] / vUnit);
			}
		}
		ctx.restore();
	},

	drawBottomText: function() {
		var ctx = this.context;
		ctx.save();
		var region = this.options.inner.bottomText.region;
		var text = this.options.hUnit;
		ctx.font = this.options.inner.bottomText.font;
		ctx.textBaseline = this.options.inner.bottomText.textBaseline;
		ctx.translate(region[0], region[1] + 3);
		console.debug(text.length);
		for(i = 0;i < text.length;i++){
			if(i == 0){
				ctx.fillText(text[i], 0, 0);
			}else if(i == text.length - 1){
				console.debug(region[2] - ctx.measureText(text[i]).width);
				ctx.fillText(text[i], region[2] - ctx.measureText(text[i]).width, 0);
			}else{
				ctx.fillText(text[i], i * region[2] / (text.length - 1) - ctx.measureText(text[i]).width / 2, 0);
			}
		}
		ctx.restore();
	},

	drawVolumeLine: function() {
		var ctx = this.context;
		ctx.save();
		var region = this.options.volume.region;
		var global = this.options.global;
		var data = this.data.mins;
		var quote = this.data.quote;
		var temp = 0;
		var maxVol = 0;
		var length = this.options.inner.length;
		data.forEach(function(item, index, arr){
			temp = item.volume;
			if(temp > maxVol){
				maxVol = temp;
			}
		});
		ctx.translate(region[0], region[1] + region[3]);
		// ctx.scale(0.5, 1);
		var y = 0;
		for(i = 0;i < length;i++){
			// if(i % 2 == 0)continue;
			y = data[i].volume * region[3] / maxVol;
			ctx.fillStyle = data[i].price > quote.preClose ? global.upTextColor : global.downTextColor;
			ctx.fillRect(region[2] * i / length, 0 - y, 1, y);
		}
		ctx.restore();
	},

	drawVolumeCrrodLine: function() {
		var ctx = this.context;
		ctx.save();
		var region = this.options.volume.region;
		var hUnit = this.options.volume.hUnit;
		var vUnit = this.options.volume.vUnit;
		var global = this.options.global;
		var canvasUtil = $NS.utils.CanvasUtil;

		// ctx.setLineDash([2, 2, 2, 2]);
		ctx.translate(region[0], region[1]);
		ctx.strokeStyle = global.borderColor;
		ctx.strokeRect(0, 0, region[2], region[3]);
		//水平线
		for (i = 0; i < vUnit - 1; i++) {
			canvasUtil.drawHDashLine(ctx, 5, (region[3] / vUnit) * (i + 1), region[2], (region[3] / vUnit) * (i + 1), 2, 2, this.options.unitLine);
		}
		//垂直线
		for (i = 0; i < hUnit - 2; i++) {
			canvasUtil.drawVDashLine(ctx, region[2] * (i + 1) / (hUnit - 1), 5, region[2] * (i + 1) / (hUnit - 1), region[3], 2, 2, this.options.unitLine);
		}
		ctx.restore();
	},

	drawVolumeLeftText: function() {
		var ctx = this.context;
		ctx.save();
		var region = this.options.volume.leftText.region;
		var hUnit = this.options.volume.hUnit;
		var vUnit = this.options.volume.vUnit;
		var global = this.options.global;
		var data = this.data.mins;
		var numberUtil = $NS.utils.NumberUtil;

		// ctx.setLineDash([2, 2, 2, 2]);
		ctx.translate(region[0], region[1] + 5);
		ctx.font = this.options.volume.leftText.font;
		ctx.textBaseline = this.options.volume.leftText.textBaseline;
		var temp = 0;
		var maxVol = 0;
		data.forEach(function(item, index, arr){
			temp = item.volume;
			if(temp > maxVol){
				maxVol = temp;
			}
		});
		for(i = 0;i < vUnit + 1;i++){
			if(i == vUnit){
				// ctx.textBaseline = "bottom";
				ctx.textAlign = "right";
				ctx.fillText("(万)", ctx.measureText("0000.00").width, region[3] * i / vUnit);
			}else{
				ctx.fillText(numberUtil.toMoney(maxVol * (vUnit - i) / vUnit / 10000), 0, region[3] * i / vUnit);
			}
		}
		ctx.restore();
	}


};