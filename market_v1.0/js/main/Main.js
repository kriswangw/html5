$NS.createNS("main");
$NS.main.Main = function(canvasId, options, data) {
	this.canvasId = canvasId;
	this.options = options;
	this.data = data;
	this.canvasUtil = $NS.utils.CanvasUtil;
	this.numberUtil = $NS.utils.NumberUtil;
	this.initialize();
};

$NS.main.Main.prototype = {
	initialize: function() {
		this.stage = new Kinetic.Stage({
			container: this.canvasId,
			width: 414,
			height: 310
		});

		var maxDiff = 0,
			temp = 0;
		var maxPrice = 0;
		var data = this.data;
		data.mins.forEach(function(item, index, array) {
			temp = Math.abs(item.price - data.quote.preClose);
			if (temp > maxDiff) {
				maxDiff = temp;
			}
		});
		this.maxDiff = maxDiff;

		var maxVol = 0;
		data.mins.forEach(function(item, index, arr) {
			temp = item.volume;
			if (temp > maxVol) {
				maxVol = temp;
			}
		});
		this.maxVol = maxVol;
		this.quote = this.data.quote;
		this.mins = this.data.mins;
	},

	draw: function() {
		this.drawOuter();
		this.drawTopText();
		// this.drawMouseLine();
		this.drawInner();
		// this.drawVolume();
		// this.addListener();
	},

	drawOuter: function() {
		var layer = new Kinetic.Layer();
		var rect = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: this.stage.getWidth(),
			height: this.stage.getHeight(),
			stroke: this.options.global.borderColor,
			strokeWidth: 1
		});
		layer.add(rect);
		this.stage.add(layer);
	},

	drawTopText: function() {
		var numberUtil = this.numberUtil;
		var topText = this.options.topText;
		var layer = new Kinetic.Layer();

		var diff = this.quote.price - this.quote.preClose;
		var diffText = diff > 0 ? "↑+" : "↓";
		var diffRateText = diff > 0 ? "+" + numberUtil.toMoney(diff * 100 / this.quote.preClose) : numberUtil.toMoney(diff * 100 / this.quote.preClose);
		var text = new Kinetic.Text({
			x: 0,
			y: 0,
			text: "最新" + numberUtil.toMoney(this.quote.price),
			fontSize: this.options.global.fontSize,
			fontFamily: this.options.global.font,
			fill: this.options.global.baseTextColor
		});
		layer.add(text);

		text = new Kinetic.Text({
			x: text.getWidth(),
			y: 0,
			text: diffText + numberUtil.toMoney(diff) + "(" + diffRateText + ")",
			fontSize: this.options.global.fontSize,
			fontFamily: this.options.global.font,
			fill: diff > 0 ? this.options.global.upTextColor : this.options.global.downTextColor
		});
		layer.add(text);

		text = new Kinetic.Text({
			x: 0,
			y: 0,
			width: topText.region[2],
			align: "right",
			text: this.quote.time.toString().slice(8, 10) + ":" + this.quote.time.toString().slice(10, 12),
			fontSize: this.options.global.fontSize,
			fontFamily: this.options.global.font,
			fill: this.options.global.baseTextColor
		});
		// text.moveTo();
		layer.add(text);
		layer.move(topText.region[0], topText.region[1]);

		this.stage.add(layer);
	},

	drawInner: function() {
		var region = this.options.inner.region;
		var global = this.options.global;
		var hUnit = this.options.hUnit;
		var vUnit = this.options.vUnit;
		var region = this.options.inner.region;
		var data = this.data.mins;
		var quote = this.data.quote;
		var length = this.options.inner.length;

		var layer = new Kinetic.Layer();
		var rect = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: region[2],
			height: region[3],
			stroke: this.options.global.borderColor,
			strokeWidth: 1
		});
		layer.add(rect);

		var line;
		//水平线
		for (var i = 0; i < vUnit - 1; i++) {
			line = new Kinetic.Line({
				points: [0, (region[3] / vUnit) * (i + 1), region[2], (region[3] / vUnit) * (i + 1)],
				stroke: i == vUnit / 2 - 1 ? global.upTextColor : this.options.unitLine,
				strokeWidth: 1,
				dashArray: [2, 2]
			});
			layer.add(line);
		}
		//垂直线
		for (var i = 0; i < hUnit.length - 2; i++) {
			line = new Kinetic.Line({
				points: [region[2] * (i + 1) / (hUnit.length - 1), 0, region[2] * (i + 1) / (hUnit.length - 1), region[3]],
				stroke: this.options.unitLine,
				strokeWidth: 1,
				dashArray: [2, 2]
			});
			layer.add(line);
		}
		layer.move(region[0], region[1]);
		this.stage.add(layer);

		var pLayer = new Kinetic.Layer();
		var points = new Array();
		for (i = 1; i < data.length; i++) {
			points.push(this.getX(i, region, length));
			points.push(this.getY(data[i].price - quote.preClose, this.maxDiff, region));
		}
		line = new Kinetic.Line({
			points: points,
			stroke: this.options.inner.color,
			strokeWidth: 1,
			lineJoin: 'round'
		});
		pLayer.add(line);
		pLayer.move(region[0], region[1] + region[3] / 2);
		this.stage.add(pLayer);
	},

	getY: function(diff, maxDiff, region) {
		return 0 - (region[3] / 2 * diff / maxDiff);
	},

	getX: function(index, region, length) {
		return region[2] * index / length;
	},


};