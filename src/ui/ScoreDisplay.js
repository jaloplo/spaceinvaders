define(function() {
    var that = {
        create: function(view, score) {
            return {
                view: view,
                score: score,
            };
        },
        render: function(display) {
            display.view.current.value.innerHTML = display.score.current;
            display.view.high.value.innerHTML = display.score.high;
            display.view.level.value.innerHTML = display.score.level;
        },
    };

    return that;
});