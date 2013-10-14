/*function testObject(){
	this.title = "testTitle";
	this.sayHello = function(){alert(1)};
}*/

(function(){
	function MarketBase(){console.log("constructor MB");}
	MarketBase.prototype.sayHello = function(){
		console.log("hello");
	}

	MarketBase.prototype.Line = function(arguments){
		console.log("init Line arguments");
	}

	MarketBase.prototype.Line.prototype.draw = function(){
		console.log("draw Line");
	}

	window.$MT = new MarketBase();
})();