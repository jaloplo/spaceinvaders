define(function() {
    var that = {
        create: function(highScoreTarget, currentScoreTarget, levelTarget, score) {
            return {
                currentScoreNode: currentScoreTarget,
                highScoreNode: highScoreTarget,
                levelNode: levelTarget,
                score: score,
            };
        },
        render: function(display) {
            display.currentScoreNode.innerHTML = display.score.current;
            display.highScoreNode.innerHTML = display.score.high;
            display.levelNode.innerHTML = display.score.level;
        },
    };

    return that;
});