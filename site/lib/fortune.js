var fortuneCookies = ["滴水穿石","坚持就是力量","一种习惯，一种力量","10000小时定律"];
exports.getFortune = function(){
	var idx = Math.floor(Math.random() * fortuneCookies.length);
	return fortuneCookies[idx];
}