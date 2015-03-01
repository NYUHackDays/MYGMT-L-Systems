// Polyfill for browsers missing support for requestAnimationFrame
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
})();

// Canvas boilerplate
(function() {
	var canvas = document.getElementById('primaryCanvas');
	var ctx = canvas.getContext('2d');

	function timestamp() {
		return window.performance && window.performance.now ? window.performance.now() : (new Date()).getTime();
	}

	App.start(ctx);

	var time = { last: 0, current: 0, delta: 0 };
	var generation = 0;

	function update() {
		time.current = timestamp() / 1000;
		time.delta = time.current - time.last;
		
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, 800, 600);
		ctx.beginPath();
		App.update(ctx, time);
		ctx.stroke();

		time.last = time.current;
		requestAnimationFrame(update);
	}
	update();

	document.onkeyup = function(event) {
		if(event.keyCode == 13 || event.keyCode == 10) {
			var c = App.generate(generation++);
			document.getElementById('generation').innerHTML = generation + ': <br>' + c;
		}
	};
})();