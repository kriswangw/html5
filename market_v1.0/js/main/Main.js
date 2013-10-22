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
			width: 514,
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
		this.drawBottomText();
		this.drawLeftText();
		this.drawRightText();
		// this.drawMouseLine();
		this.drawInner();
		this.drawVolume();
		this.drawVolumeLeftText();
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

	drawBottomText: function() {
		var layer = new Kinetic.Layer();
		var region = this.options.inner.bottomText.region;
		var hUnit = this.options.hUnit;
		var text;
		for (i = 0; i < hUnit.length; i++) {
			if (i == 0) {
				text = new Kinetic.Text({
					x: 0,
					y: 5,
					text: hUnit[i],
					fontSize: this.options.global.fontSize,
					fontFamily: this.options.global.font,
					fill: "#4C4C4C"
				});
			} else if (i == hUnit.length - 1) {
				text = new Kinetic.Text({
					y: 5,
					text: hUnit[i],
					fontSize: this.options.global.fontSize,
					fontFamily: this.options.global.font,
					width: this.options.inner.region[2],
					align: "right",
					fill: "#4C4C4C"
				});
			} else {
				text = new Kinetic.Text({
					x: 0,
					y: 5,
					text: hUnit[i],
					fontSize: this.options.global.fontSize,
					fontFamily: this.options.global.font,
					fill: "#4C4C4C"
				});
				text.setX(i * this.options.inner.region[2] / (hUnit.length - 1) - text.getWidth() / 2);
			}
			layer.add(text);
		}
		layer.move(region[0], region[1]);
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
		layer.add(text);
		layer.move(topText.region[0], topText.region[1]);

		this.stage.add(layer);
	},

	drawLeftText: function() {
		var region = this.options.inner.region;
		var color = this.options.inner.color;
		var data = this.data.mins;
		var quote = this.data.quote;
		var length = this.options.inner.length;
		var vUnit = this.options.vUnit;
		var numberUtil = $NS.utils.NumberUtil;
		var global = this.options.global;
		var unit = Math.max(this.maxDiff * 2 / vUnit, 0.01);
		var leftRegion = this.options.inner.leftText.region;
		var text;
		var layer = new Kinetic.Layer();
		var priceArr = new Array();
		var price;
		for (i = 0; i < vUnit + 1; i++) {
			if (i < vUnit / 2) {
				price = quote.preClose + (vUnit / 2 - i) * unit;
				text = new Kinetic.Text({
					text: numberUtil.toMoney(price),
					x: 0,
					y: i * region[3] / vUnit,
					offset: [0, 7],
					fontFamily: 'Tahoma',
					fontSize: 10,
					padding: 2,
					width: leftRegion[2],
					height: 17,
					align: "right",
					fill: global.upTextColor
				});
				priceArr.push(price);
				layer.add(text);
			} else if (i > vUnit / 2) {
				price = quote.preClose + (vUnit / 2 - i) * unit;
				text = new Kinetic.Text({
					text: numberUtil.toMoney(price),
					x: 0,
					y: i * region[3] / vUnit,
					offset: [0, 7],
					fontFamily: 'Tahoma',
					fontSize: 10,
					padding: 2,
					width: leftRegion[2],
					height: 17,
					align: "right",
					fill: global.downTextColor
				});
				priceArr.push(price);
				layer.add(text);
			} else {
				price = quote.preClose;
				text = new Kinetic.Text({
					text: numberUtil.toMoney(quote.preClose),
					x: 0,
					y: i * region[3] / vUnit,
					offset: [0, 7],
					fontFamily: 'Tahoma',
					fontSize: 10,
					padding: 2,
					width: leftRegion[2],
					height: 17,
					align: "right",
					fill: global.baseTextColor
				});
				priceArr.push(price);
				layer.add(text);
			}
		}
		this.priceArr = priceArr;
		layer.move(leftRegion[0], leftRegion[1]);
		this.stage.add(layer);
	},

	drawRightText: function() {
		var region = this.options.inner.region;
		var color = this.options.inner.color;
		var data = this.data.mins;
		var quote = this.data.quote;
		var length = this.options.inner.length;
		var vUnit = this.options.vUnit;
		var numberUtil = $NS.utils.NumberUtil;
		var global = this.options.global;
		var unit = Math.max(this.maxDiff * 2 / vUnit, 0.01);
		var rightRegion = this.options.inner.rightText.region;
		var text;
		var layer = new Kinetic.Layer();
		var price;
		for (i = 0; i < vUnit + 1; i++) {
			if (i < vUnit / 2) {
				price = (vUnit / 2 - i) * unit * 100 / quote.preClose;
				text = new Kinetic.Text({
					text: numberUtil.toMoney(Math.abs(price)) + "%",
					x: 0,
					y: i * region[3] / vUnit,
					offset: [0, 7],
					fontFamily: 'Tahoma',
					fontSize: 10,
					padding: 2,
					width: rightRegion[2],
					height: 17,
					// align: "right",
					fill: global.upTextColor
				});
				layer.add(text);
			} else if (i > vUnit / 2) {
				price = (vUnit / 2 - i) * unit * 100 / quote.preClose;
				text = new Kinetic.Text({
					text: numberUtil.toMoney(Math.abs(price)) + "%",
					x: 0,
					y: i * region[3] / vUnit,
					offset: [0, 7],
					fontFamily: 'Tahoma',
					fontSize: 10,
					padding: 2,
					width: rightRegion[2],
					height: 17,
					// align: "right",
					fill: global.downTextColor
				});
				layer.add(text);
			} else {
				price = quote.preClose;
				text = new Kinetic.Text({
					text: "0.00%",
					x: 0,
					y: i * region[3] / vUnit,
					offset: [0, 7],
					fontFamily: 'Tahoma',
					fontSize: 10,
					padding: 2,
					width: rightRegion[2],
					height: 17,
					// align: "right",
					fill: global.baseTextColor
				});
				layer.add(text);
			}
		}
		layer.move(rightRegion[0], rightRegion[1]);
		this.stage.add(layer);
	},

	drawInner: function() {
		var that = this;
		var numberUtil = this.numberUtil;
		var region = this.options.inner.region;
		var leftRegion = this.options.inner.leftText.region;
		var rightRegion = this.options.inner.rightText.region;
		var bottomRegion = this.options.inner.bottomText.region;
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
				// stroke: i == vUnit / 2 - 1 ? global.upTextColor : this.options.unitLine,
				stroke: this.options.unitLine,
				strokeWidth: 1,
				dashArray: [2, 2]
			});
			layer.add(line);
		}
		//垂直线
		var x;
		for (var i = 0; i < hUnit.length - 2; i++) {
			x = Math.round(region[2] * (i + 1) / (hUnit.length - 1));
			line = new Kinetic.Line({
				points: [x, 0, x, region[3]],
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
		// this.points = options;
		line = new Kinetic.Line({
			points: points,
			// stroke: this.options.inner.color,
			// stroke: "#007CC8",
			stroke: "#0158A7",
			strokeWidth: 1,
			lineJoin: 'round'
		});
		pLayer.add(line);
		pLayer.move(region[0], region[1] + region[3] / 2);
		this.stage.add(pLayer);


		var floatLayer = new Kinetic.Layer({
			// visible : false
		});
		var hLine = new Kinetic.Line({
			// stroke: this.options.unitLine,
			// stroke: "#9A9594",
			stroke: "#69BCDF",
			strokeWidth: 1,
			visible: false
			// dashArray: [3, 3]
		});
		floatLayer.add(hLine);
		var vLine = new Kinetic.Line({
			// stroke: this.options.unitLine,
			// stroke: "#9A9594",
			stroke: "#69BCDF",
			strokeWidth: 1,
			visible: false
			// dashArray: [3, 3]
		});
		floatLayer.add(vLine);
		var circle = new Kinetic.Circle({
			radius: 3,
			visible: false,
			fill: '#0158A7',
			visible: false
		});
		floatLayer.add(circle);

		var leftLable = new Kinetic.Label({
			visible: false
		});

		leftLable.add(new Kinetic.Tag({
			fill: "#CAE8F4",
			stroke: "#95C0D2",
			strokeWidth: 1
		}));
		var leftText = new Kinetic.Text({
			text: '10.20',
			fontFamily: 'Tahoma',
			fontSize: 10,
			padding: 2,
			width: leftRegion[2],
			height: 17,
			align: "right",
			fill: 'black'
		});
		leftLable.add(leftText);
		floatLayer.add(leftLable);

		var rightLable = new Kinetic.Label({
			visible: false
		});

		rightLable.add(new Kinetic.Tag({
			fill: "#CAE8F4",
			stroke: "#95C0D2",
			strokeWidth: 1
		}));
		var rightText = new Kinetic.Text({
			text: '10.20',
			fontFamily: 'Tahoma',
			fontSize: 10,
			padding: 2,
			width: leftRegion[2],
			height: 17,
			align: "left",
			fill: 'black'
		});
		rightLable.add(rightText);
		floatLayer.add(rightLable);

		//bottom lable
		var bottomLable = new Kinetic.Label({
			visible: false
		});

		bottomLable.add(new Kinetic.Tag({
			fill: "#CAE8F4",
			stroke: "#95C0D2",
			strokeWidth: 1
		}));
		var bottomText = new Kinetic.Text({
			text: '10.20',
			fontFamily: 'Tahoma',
			fontSize: 10,
			padding: 2,
			width: 50,
			height: 17,
			fill: 'black'
		});
		bottomLable.add(bottomText);
		floatLayer.add(bottomLable);
		this.stage.add(floatLayer);

		//add mouse event
		this.stage.on("mousemove", function() {
			var mousePos = that.stage.getMousePosition();
			if (mousePos.x >= region[0] && mousePos.y >= region[1] && mousePos.x <= region[0] + region[2] && mousePos.y <= region[1] + region[3]) {
				var x = (mousePos.x - region[0]) * 240 / region[2]
				var n = Math.floor(x);
				var y = region[1] + region[3] / 2 + points[n * 2 + 1];
				hLine.setPoints([region[0], mousePos.y + 0.5, region[0] + region[2], mousePos.y + 0.5]);
				hLine.show();
				vLine.setPoints([mousePos.x + 0.5, region[1], mousePos.x + 0.5, that.options.volume.region[1] + that.options.volume.region[3]]);
				vLine.show();
				circle.setX(mousePos.x + 0.5);
				circle.setY(Math.ceil(y) + 0.5);
				circle.show();

				leftLable.setX(leftRegion[0]);
				leftLable.setY(mousePos.y - leftText.getHeight() / 2);
				leftText.setText(numberUtil.toMoney(data[n].price));
				var rel = mousePos.y < region[3] / 2 + region[1] ? region[3] / 2 + region[1] - mousePos.y - 0.5 : mousePos.y - region[3] / 2 - region[1] + 0.5;
				var diffValue = mousePos.y < region[3] / 2 + region[1] ? (that.priceArr[0] - quote.preClose) * 2 / region[3] * rel : 0 - (that.priceArr[0] - quote.preClose) * 2 / region[3] * rel;
				var p = quote.preClose + diffValue;
				leftText.setText(numberUtil.toMoney(p));
				leftLable.show();
				rightLable.setX(rightRegion[0]);
				rightLable.setY(mousePos.y - rightText.getHeight() / 2);
				rightText.setText(numberUtil.toMoney(diffValue * 100 / quote.preClose) + "%");
				rightLable.show();
				bottomLable.setX(mousePos.x - bottomText.getWidth() / 2);
				bottomLable.setY(bottomRegion[1] + 4);
				bottomText.setText(that.options.timeX[n]);
				bottomLable.show();

				floatLayer.draw();
			} else {
				hLine.hide();
				vLine.hide();
				circle.hide();
				leftLable.hide();
				rightLable.hide();
				bottomLable.hide();
				floatLayer.draw();
			}
		});
	},

	drawVolume: function() {
		var layer = new Kinetic.Layer();
		var region = this.options.volume.region;
		var hUnit = this.options.volume.hUnit;
		var vUnit = this.options.volume.vUnit;
		var global = this.options.global;
		var length = this.options.inner.length;
		var data = this.data.mins;
		var quote = this.data.quote;
		var rect = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: region[2],
			height: region[3],
			stroke: global.borderColor,
			strokeWidth: 1
		});
		layer.add(rect);

		var line;
		//水平线
		for (var i = 0; i < vUnit - 1; i++) {
			// canvasUtil.drawHDashLine(ctx, 5, (region[3] / vUnit) * (i + 1), region[2], (region[3] / vUnit) * (i + 1), 2, 2, this.options.unitLine);
			line = new Kinetic.Line({
				points: [0, (region[3] / vUnit) * (i + 1), region[2], (region[3] / vUnit) * (i + 1)],
				stroke: this.options.unitLine,
				strokeWidth: 1,
				dashArray: [2, 2]
			});
			layer.add(line);
		}
		//垂直线
		for (var i = 0; i < hUnit - 2; i++) {
			// canvasUtil.drawVDashLine(ctx, region[2] * (i + 1) / (hUnit - 1), 5, region[2] * (i + 1) / (hUnit - 1), region[3], 2, 2, this.options.unitLine);
			line = new Kinetic.Line({
				points: [region[2] * (i + 1) / (hUnit - 1), 0, region[2] * (i + 1) / (hUnit - 1), region[3]],
				stroke: this.options.unitLine,
				strokeWidth: 1,
				dashArray: [2, 2]
			});
			layer.add(line);
		}
		layer.move(region[0], region[1]);

		var vLayer = new Kinetic.Layer();
		var y = 0;
		var x;
		for (var i = 0; i < length; i++) {
			y = data[i].volume * region[3] / this.maxVol;
			x = Math.round(region[2] * i / length);
			line = new Kinetic.Line({
				points: [x, 0, x, 0 - y],
				stroke: data[i].price > quote.preClose ? global.upTextColor : global.downTextColor,
				strokeWidth: 1
			});
			vLayer.add(line);
		}
		vLayer.move(region[0], region[1] + region[3]);
		this.stage.add(layer);
		this.stage.add(vLayer);
	},

	drawVolumeLeftText: function() {
		var region = this.options.volume.leftText.region;
		var hUnit = this.options.volume.hUnit;
		var vUnit = this.options.volume.vUnit;
		var global = this.options.global;
		var data = this.data.mins;
		var numberUtil = this.numberUtil;
		var text;
		var layer = new Kinetic.Layer();
		for (i = 0; i < vUnit + 1; i++) {
			if (i == vUnit) {
				// ctx.textAlign = "right";
				// ctx.fillText("(万)", ctx.measureText("0000.00").width, region[3] * i / vUnit);
				text = new Kinetic.Text({
					x : 0,
					y : region[3] - 10,
					text: '(万)',
					fontFamily: 'Tahoma',
					fontSize: 10,
					padding: 2,
					width: 50,
					height: 17,
					align : "right",
					fill: '#577DA0'
				});
				layer.add(text.clone({
					x : this.options.volume.region[2] + region[2] + 3,
					align : "left"
				}));
			} else {
				// ctx.fillText(numberUtil.toMoney(this.maxVol * (vUnit - i) / vUnit / 10000), 0, region[3] * i / vUnit);
				text = new Kinetic.Text({
					x : 0,
					y : region[3] * i / vUnit,
					text: numberUtil.toMoney(this.maxVol * (vUnit - i) / vUnit / 10000),
					fontFamily: 'Tahoma',
					fontSize: 10,
					padding: 2,
					width: 50,
					height: 17,
					fill: '#577DA0'
				});
				layer.add(text.clone({
					x : this.options.volume.region[2] + region[2] + 3
				}));
			}
			layer.add(text);
		}
		layer.move(region[0], region[1]);
		this.stage.add(layer);
	},

	getY: function(diff, maxDiff, region) {
		return 0 - (region[3] / 2 * diff / maxDiff);
	},

	getX: function(index, region, length) {
		return region[2] * index / length;
	},


};