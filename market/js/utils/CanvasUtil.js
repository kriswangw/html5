$NS.createNS("utils");
$NS.utils.CanvasUtil = (function() {

    return {
    	drawHDashLine : function(ctx, x1, y1, x2, y2, dashWidth, spaceWidth, color, lineWidth){
    		if(y1 != y2)return;
    		ctx.save();
    		ctx.strokeStyle = color || "#000";
    		ctx.lineWidth = lineWidth || 1;
    		/*
    		var length = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    		var n = Math.ceil(length / (dashWidth + spaceWidth));
    		ctx.beginPath();
    		ctx.moveTo(x1, y1);
    		var x = x1 - x2;
    		var y = y1 - y2;
    		for(i = 0;i < n;i++){
    			ctx.lineTo(x > 0 ? x1 - Math.abs(x) * i / n - Math.abs(x) / n * spaceWidth / (dashWidth + spaceWidth) : x1 + Math.abs(x) * i / n + Math.abs(x) / n * spaceWidth / (dashWidth + spaceWidth), 
    				y > 0 ? y1 - Math.abs(y) * i / n : y1 + Math.abs(y) * i / n);
				// ((x1 + (x2 - x1) / n) * dashWidth + spaceWidth * x1) / (spaceWidth + dashWidth);
    		}*/
    		var length = Math.abs(x2 - x1);
    		var n = Math.ceil(length / (dashWidth + spaceWidth));
    		ctx.beginPath();
    		/*for(i = 0;i < n;i++){
    			ctx.moveTo(x1 + length * i / n, y1);
    			ctx.lineTo(x1 + length * i / n - spaceWidth, y1);
    		}*/
    		//TODO 神奇的问题，外层的i变量被改写
    		for(j = 0;j < n;j++){
    			ctx.moveTo(x1 + length * j / n, y1);
    			ctx.lineTo(x1 + length * j / n - spaceWidth, y1);
    		}
    		
    		ctx.stroke();
			ctx.restore();
    		
    	},

    	drawVDashLine : function(ctx, x1, y1, x2, y2, dashWidth, spaceWidth, color, lineWidth){
    		if(x1 != x2)return;
    		ctx.save();
    		ctx.strokeStyle = color || "#000";
    		ctx.lineWidth = lineWidth || 1;
    		var length = Math.abs(y2 - y1);
    		var n = Math.ceil(length / (dashWidth + spaceWidth));
    		ctx.beginPath();
    		for(j = 0;j < n;j++){
    			ctx.moveTo(x1, y1 + length * j / n);
    			ctx.lineTo(x1, y1 + length * j / n - spaceWidth);
    		}
    		
    		ctx.stroke();
			ctx.restore();
    		
    	}
    }

})()