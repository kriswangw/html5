$NS.createNS("utils");
$NS.utils.NumberUtil = (function() {

    return {
    	toMoney : function(val){
    		return val.toFixed(2);
    	}
    }
	/*var instance;

	function init(){
		return {
			toMoney: function(val) {
				return val.toFixed(2);
			}
		}
	}

	return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    }; */

})()