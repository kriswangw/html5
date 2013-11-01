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
		this.dataLength = this.data.mins.length;
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

	getPoints: function() {
		return this.points;
	},

	getQuote: function() {
		return this.quote;
	},

	getPriceArr: function() {
		return this.priceArr;
	},

	getData: function() {
		return this.data;
	},

	getVolumeYArr: function() {
		return thsi.volumeYArr;
	},

	draw: function() {
		this.drawOuter();
		this.drawTopText();
		this.drawBottomText();
		this.drawLeftText();
		this.drawRightText();
		// this.drawMouseLine();
		this.drawVolume();
		this.drawVolumeLeftText();
		this.drawInner();
		this.addEvent();
		// this.addListener();
	},

	initData: function() {
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
		if (maxDiff > this.maxDiff) {
			this.needDrawLRText = true;
		}
		this.maxDiff = maxDiff;

		var maxVol = 0;
		data.mins.forEach(function(item, index, arr) {
			temp = item.volume;
			if (temp > maxVol) {
				maxVol = temp;
			}
		});
		if (maxVol > this.maxVol) {
			this.needDrawVolumeText = true;
		}
		this.maxVol = maxVol;
		this.quote = this.data.quote;
		this.mins = this.data.mins;
	},

	refresh: function(newData) {
		this.data = newData;
		this.initData();
		this.refreshLine();
		this.refreshVolume();
		this.dataLength = this.points.length / 2;
	},

	refreshLine: function() {
		var region = this.options.inner.region;
		var data = this.data.mins;
		var quote = this.data.quote;
		var length = this.options.inner.length;
		var id = this.data.stock.name + "-line";
		var layer = this.stage.find("#" + id)[0];
		var temp = new Array();
		if (this.data.mins.length > this.dataLength) {
			// console.debug(this.data.mins.length , this.dataLength);
			// console.debug("drawLine");
			if (this.needDrawLRText) {
				// layer.removeChildren();
				layer.destroyChildren();
				var points = new Array();
				for (var i = 0; i < data.length; i++) {
					points.push(this.getX(i, region, length));
					points.push(this.getY(data[i].price - quote.preClose, this.maxDiff, region));
				}
				this.points = points;
				var line = new Kinetic.Line({
					points: this.points,
					stroke: "#0158A7",
					strokeWidth: 1,
					lineJoin: 'round'
				});
				layer.add(line);
				layer.draw();
				this.refreshLeftText();
				this.refreshRightText();
			} else {
				// console.debug("addLine");
				for (var i = 0; i < data.length - this.dataLength; i++) {
					this.points.push(this.getX(this.dataLength + i, region, length));
					this.points.push(this.getY(data[this.dataLength + i].price - quote.preClose, this.maxDiff, region));
					temp.push(this.getX(this.dataLength + i, region, length));
					temp.push(this.getY(data[this.dataLength + i].price - quote.preClose, this.maxDiff, region));
				}
				temp.unshift(this.getX(this.dataLength - 1, region, length), this.getY(data[this.dataLength - 1].price - quote.preClose, this.maxDiff, region));
				var tempLine = new Kinetic.Line({
					points: temp,
					stroke: "#0158A7",
					strokeWidth: 1,
					lineJoin: 'round'
				});
				layer.add(tempLine);
				tempLine.draw();
				/*layer.destroyChildren();
				var points = new Array();
				for (var i = 0; i < data.length; i++) {
					points.push(this.getX(i, region, length));
					points.push(this.getY(data[i].price - quote.preClose, this.maxDiff, region));
				}
				this.points = points;
				var line = new Kinetic.Line({
					points: this.points,
					stroke: "#0158A7",
					strokeWidth: 1,
					lineJoin: 'round'
				});
				layer.add(line);
				layer.draw();
				this.refreshLeftText();
				this.refreshRightText();*/
			}
		}
		var region = null;
		var data = null;
		var quote = null;
		var length = null;
		var id = null;
		var layer = null;
		var temp = null;
	},

	refreshVolume: function() {
		var region = this.options.volume.region;
		var length = this.options.inner.length;
		var quote = this.data.quote;
		var global = this.options.global;
		var data = this.data.mins;

		var vLayer = this.stage.find("#" + this.data.stock.name + "-volume")[0];
		var y = 0;
		var x;
		if (this.data.mins.length > this.dataLength) {
			if (this.needDrawVolumeText) {
				this.refreshVolumeLeftText();
				// vLayer.removeChildren();
				vLayer.destroyChildren();
				var volumeYArr = new Array();
				var line;
				for (var i = 0; i < Math.min(length, data.length); i++) {
					y = data[i].volume * region[3] / this.maxVol;
					x = Math.round(region[2] * i / length);
					volumeYArr.push(y);
					line = new Kinetic.Line({
						points: [x, 0, x, 0 - y],
						stroke: data[i].price > (i - 1 >= 0 ? data[i - 1].price : quote.preClose) ? global.upTextColor : global.downTextColor,
						strokeWidth: 1
					});
					vLayer.add(line);
				}
				this.volumeYArr = volumeYArr;
				vLayer.draw();
				// console.debug("volumeYArr:", volumeYArr, this.maxVol);
			} else {
				// console.debug("draw");
				for (var i = 0; i < data.length - this.dataLength; i++) {
					y = data[this.dataLength + i].volume * region[3] / this.maxVol;
					x = Math.round(region[2] * (this.dataLength + i) / length);
					this.volumeYArr.push(y);
					var line = new Kinetic.Line({
						points: [x, 0, x, 0 - y],
						stroke: data[this.dataLength + i].price > (this.dataLength + i - 1 >= 0 ? data[this.dataLength + i - 1].price : quote.preClose) ? global.upTextColor : global.downTextColor,
						strokeWidth: 1
					});
					vLayer.add(line);
					line.draw();
				}
			}
		}
	},


	refreshLeftText: function() {
		var quote = this.data.quote;
		var vUnit = this.options.vUnit;
		var numberUtil = $NS.utils.NumberUtil;
		var unit = Math.max(this.maxDiff * 2 / vUnit, 0.01);
		var layer = this.stage.find("#" + this.data.stock.name + "-leftText")[0];
		var priceArr = new Array();
		var price;
		for (i = 0; i < vUnit + 1; i++) {
			price = quote.preClose + (vUnit / 2 - i) * unit;
			layer.find("Text")[i].setText(numberUtil.toMoney(price));
			priceArr.push(price);
		}
		this.priceArr = priceArr;
		layer.draw();
	},

	refreshRightText: function() {
		var quote = this.data.quote;
		var vUnit = this.options.vUnit;
		var numberUtil = $NS.utils.NumberUtil;
		var unit = Math.max(this.maxDiff * 2 / vUnit, 0.01);
		var layer = this.stage.find("#" + this.data.stock.name + "-rightText")[0];
		var price;
		for (i = 0; i < vUnit + 1; i++) {
			price = (vUnit / 2 - i) * unit * 100 / quote.preClose;
			layer.find("Text")[i].setText(numberUtil.toMoney(price) + "%");
		}
		layer.draw();
	},

	refreshVolumeLeftText: function() {
		var vUnit = this.options.volume.vUnit;
		var data = this.data.mins;
		var layer = this.stage.find("#" + this.data.stock.name + "-volumeText")[0];
		for (i = 0; i < vUnit + 1; i++) {
			if (i == vUnit) {

			} else {
				// ctx.fillText(numberUtil.toMoney(this.maxVol * (vUnit - i) / vUnit / 10000), 0, region[3] * i / vUnit);
				layer.find("Text")[i * 2 + 1].setText(Math.round(this.maxVol * (vUnit - i) / vUnit / 10000));
				layer.find("Text")[i * 2].setText(Math.round(this.maxVol * (vUnit - i) / vUnit / 10000));
			}
		}
		layer.draw();
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
		var layer = new Kinetic.Layer({
			id: this.data.stock.name + "topText"
		});

		var diff = this.quote.price - this.quote.preClose;
		var diffText = diff > 0 ? "↑+" : "↓";
		var diffRateText = diff > 0 ? "+" + numberUtil.toMoney(diff * 100 / this.quote.preClose) : numberUtil.toMoney(diff * 100 / this.quote.preClose);
		var text1 = new Kinetic.Text({
			x: 0,
			y: -2,
			text: this.data.stock.name,
			fontSize: this.options.global.fontSize,
			fontFamily: this.options.global.font,
			fill: this.options.global.baseTextColor
		});
		layer.add(text1);
		var text2 = new Kinetic.Text({
			x: 58,
			y: -2,
			text: "价格:",
			fontSize: this.options.global.fontSize,
			fontFamily: this.options.global.font,
			fill: "#4C4C4C"
		});
		layer.add(text2);
		layer.add(text1.clone({
			x: 88,
			y: -2,
			text: numberUtil.toMoney(this.quote.price)
		}));

		layer.add(text2.clone({
			x: 143,
			y: -2,
			text: "均价:"
		}));

		layer.add(text2.clone({
			x: 217,
			y: -2,
			text: "成交量(手):"
		}));
		layer.add(text1.clone({
			x: 282,
			y: -2,
			text: Math.round(this.quote.volume / 100)
		}));

		layer.add(text2.clone({
			x: 343,
			y: -2,
			text: "时间:"
		}));
		layer.add(text1.clone({
			x: 372,
			y: -2,
			// text: this.quote.time.toString().slice(8, 10) + ":" + this.quote.time.toString().slice(10, 12)
			text: "test"
		}));
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
		var layer = new Kinetic.Layer({
			id: this.data.stock.name + "-leftText"
		});
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
		var layer = new Kinetic.Layer({
			id: this.data.stock.name + "-rightText"
		});
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


		var pLayer = new Kinetic.Layer({
			id: this.data.stock.name + "-line"
		});
		var points = new Array();
		for (i = 0; i < data.length; i++) {
			points.push(this.getX(i, region, length));
			points.push(this.getY(data[i].price - quote.preClose, this.maxDiff, region));
		}
		this.points = points;
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
			id: this.data.stock.name + "-float"
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
			fill: '#0158A7',
			visible: false,
			id: this.data.stock.name + "-circle"
		});
		floatLayer.add(circle);
		var circleBottom = circle.clone({
			visible: false,
			fill: "#FFA200",
			id: this.data.stock.name + "-circleBottom"
		})
		floatLayer.add(circleBottom);

		var leftLable = new Kinetic.Label({
			visible: false,
			id: this.data.stock.name + "-leftLable"
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
			visible: false,
			id: this.data.stock.name + "-rightLable"
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
			visible: false,
			id: this.data.stock.name + "-bottomLable"
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
	},

	addEvent: function() {
		var numberUtil = this.numberUtil;
		var region = this.options.inner.region;
		var leftRegion = this.options.inner.leftText.region;
		var rightRegion = this.options.inner.rightText.region;
		var bottomRegion = this.options.inner.bottomText.region;
		// var region = this.options.inner.region;

		//add mouse event
		var that = this;
		this.stage.on("mousemove", function() {
			var points = that.getPoints();
			// console.debug();
			var quote = that.getQuote();
			var priceArr = that.getPriceArr();
			var data = that.getData();
			//volumeYArr

			var floatLayer = that.stage.find("#" + data.stock.name + "-float")[0];
			var vLine = floatLayer.find("Line")[1];
			var hLine = floatLayer.find("Line")[0];
			var leftLable = that.stage.find("#" + data.stock.name + "-leftLable")[0];
			var rightLable = that.stage.find("#" + data.stock.name + "-rightLable")[0];
			var bottomLable = that.stage.find("#" + data.stock.name + "-bottomLable")[0];
			var leftText = leftLable.getText();
			var rightText = rightLable.getText();
			var bottomText = bottomLable.getText();
			var circle = floatLayer.find("Circle")[0];
			var circleBottom = floatLayer.find("Circle")[1];

			var mousePos = that.stage.getMousePosition();
			if (mousePos.x >= region[0] && mousePos.y >= region[1] && mousePos.x <= region[0] + region[2] && mousePos.y <= that.options.volume.region[1] + that.options.volume.region[3]) {
				var x = (mousePos.x - region[0]) * 240 / region[2]
				var n = Math.floor(x);
				var y = region[1] + region[3] / 2 + points[n * 2 + 1];
				vLine.setPoints([mousePos.x + 0.5, region[1], mousePos.x + 0.5, that.options.volume.region[1] + that.options.volume.region[3]]);
				vLine.show();
				circle.setX(mousePos.x + 0.5);
				circle.setY(Math.ceil(y) + 0.5);
				circle.show();
				circleBottom.setX(mousePos.x + 0.5);
				circleBottom.setY(that.options.volume.region[1] + that.options.volume.region[3] - that.volumeYArr[n] + 1);
				circleBottom.show();

				if (mousePos.y > region[1] + region[3] && mousePos.y < that.options.volume.region[1]) {
					hLine.hide();
					leftLable.hide();
					rightLable.hide();
				} else {
					hLine.setPoints([region[0], mousePos.y + 0.5, region[0] + region[2], mousePos.y + 0.5]);
					hLine.show();

					leftLable.setX(leftRegion[0]);
					leftLable.setY(mousePos.y - leftText.getHeight() / 2);
					// leftText.setText(numberUtil.toMoney(data[n].price));
					var rel = mousePos.y < region[3] / 2 + region[1] ? region[3] / 2 + region[1] - mousePos.y - 0.5 : mousePos.y - region[3] / 2 - region[1] + 0.5;
					var diffValue = mousePos.y < region[3] / 2 + region[1] ? (that.priceArr[0] - quote.preClose) * 2 / region[3] * rel : 0 - (that.priceArr[0] - quote.preClose) * 2 / region[3] * rel;
					var p = quote.preClose + diffValue;
					// console.debug(that.maxVol);
					// console.debug(mousePos.y, that.options.volume.region[1], mousePos.y - that.options.volume.region[1]);
					if (mousePos.y > region[1] + region[3]) {
						p = Math.round((that.maxVol - (mousePos.y - 0.5 - that.options.volume.region[1]) * that.maxVol / that.options.volume.region[3]) / 10000);
						leftText.setText(p);
						rightText.setText(p);
					} else {
						p = quote.preClose + diffValue;
						leftText.setText(numberUtil.toMoney(p));
						rightText.setText(numberUtil.toMoney(diffValue * 100 / quote.preClose) + "%");
					}
					leftLable.show();
					rightLable.setX(rightRegion[0]);
					rightLable.setY(mousePos.y - rightText.getHeight() / 2);
					rightLable.show();
				}

				bottomLable.setX(mousePos.x - bottomText.getWidth() / 2);
				bottomLable.setY(bottomRegion[1] + 4);
				bottomText.setText(that.options.timeX[n]);
				bottomLable.show();
				floatLayer.draw();

				//top text change
				var topLayer = that.stage.find("#" + data.stock.name + "topText")[0];
				var texts = topLayer.find("Text");
				texts[2].setText(data.mins[n].price);
				texts[5].setText(Math.round(data.mins[n].volume / 100));
				texts[7].setText(that.options.timeX[n]);
				topLayer.draw();
			} else {
				hLine.hide();
				vLine.hide();
				circle.hide();
				circleBottom.hide();
				leftLable.hide();
				rightLable.hide();
				bottomLable.hide();
				floatLayer.draw();
			}
		});

		/*this.stage.on("mouseleave", function() {
			var mousePos = that.stage.getMousePosition();
			if (mousePos.x >= region[0] && mousePos.y >= region[1] && mousePos.x <= region[0] + region[2] && mousePos.y <= that.options.volume.region[1] + that.options.volume.region[3]) {
				// var topLayer = that.stage.find("#" + that.data.stock.name + "topText")[0];
				// topLayer.removeChildren();

				// topLayer.draw();
			} else {
				hLine.hide();
				vLine.hide();
				circle.hide();
				circleBottom.hide();
				leftLable.hide();
				rightLable.hide();
				bottomLable.hide();
				floatLayer.draw();
			}
		});*/
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

		var vLayer = new Kinetic.Layer({
			id: this.data.stock.name + "-volume"
		});
		var y = 0;
		var x;
		var volumeYArr = new Array();
		for (var i = 0; i < Math.min(length, data.length); i++) {
			y = data[i].volume * region[3] / this.maxVol;
			x = Math.round(region[2] * i / length);
			volumeYArr.push(y)
			line = new Kinetic.Line({
				points: [x, 0, x, 0 - y],
				stroke: data[i].price > (i - 1 >= 0 ? data[i - 1].price : quote.preClose) ? global.upTextColor : global.downTextColor,
				strokeWidth: 1
			});
			vLayer.add(line);
		}
		this.volumeYArr = volumeYArr;
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
		var layer = new Kinetic.Layer({
			id : this.data.stock.name + "-volumeText"
		});
		for (i = 0; i < vUnit + 1; i++) {
			if (i == vUnit) {
				// ctx.textAlign = "right";
				// ctx.fillText("(万)", ctx.measureText("0000.00").width, region[3] * i / vUnit);
				text = new Kinetic.Text({
					x: 0,
					y: region[3] - 10,
					text: '(万)',
					fontFamily: 'Tahoma',
					fontSize: 10,
					padding: 2,
					width: 50,
					height: 17,
					align: "right",
					fill: '#577DA0'
				});
				layer.add(text.clone({
					x: this.options.volume.region[2] + region[2] + 3,
					align: "left"
				}));
			} else {
				// ctx.fillText(numberUtil.toMoney(this.maxVol * (vUnit - i) / vUnit / 10000), 0, region[3] * i / vUnit);
				text = new Kinetic.Text({
					x: 0,
					y: region[3] * i / vUnit,
					text: Math.round(this.maxVol * (vUnit - i) / vUnit / 10000),
					fontFamily: 'Tahoma',
					fontSize: 10,
					padding: 2,
					width: 50,
					height: 17,
					align: "right",
					fill: '#577DA0'
				});
				layer.add(text.clone({
					x: this.options.volume.region[2] + region[2] + 3,
					align: "left"
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