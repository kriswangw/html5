$NS.createNS("main");
$NS.main.Main = function(canvasId, options, data){
	this.canvasId = canvasId;
	this.options = options;
	this.data = data;
	this.initialize();
};

$NS.main.Main.prototype = {
	initialize : function(){
		this.canvas = document.getElementById(this.canvasId);
		if(this.canvas && this.canvas.getContext){
			var context = this.canvas.getContext("2d");
			if(context){
				this.context = context;
				console.debug("canvasId:", this.canvasId);
				console.debug("options:", this.options);
				console.debug("data:", this.data);
				console.debug("context:", this.context);
			}
		}
	},

	draw : function(){
		this.drawTopText();
	},

	drawTopText : function(){
		var quote = this.data.quote;
		this.context.fillStyle = this.options.global.baseTextColor;
		this.context.font = this.options.global.font;
		//TODO:process number
		this.context.fillText("最新" + quote.price, this.options.topText.region[0], this.options.topText.region[1]);
	}

};
