define(function() {
    return {
        create: function(game) {
            return {
                high: 0,
                current: 0,
                level: game.level,
            };
        },
        invader: function(score) {
            score.current += 10;
            return score;
        },
        new: function(score) {
            score.current += 100;
            return score;
        },
        level: function(score, level) {
            score.level = level;
        },
        reset: function(score) {
            if(score.current > score.high) {
                score.high = score.current;
            }
            score.current = 0;
            score.level = 1;
            return score;
        }
    };
});