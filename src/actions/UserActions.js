define([], function() {
    return {
        create: function (listener) {
            return {
                listener: listener,
            };
        },
        run: function(useractions) {
            if(useractions.listener.keys.indexOf('ArrowDown') > -1) {
                    useractions.down();
            }
            var leftIndex = useractions.listener.keys.indexOf('ArrowLeft');
            var rightIndex = useractions.listener.keys.indexOf('ArrowRight');
            if(leftIndex > -1 || rightIndex > -1) {
                if(leftIndex > rightIndex) {
                    useractions.left();
                }
                if(rightIndex > leftIndex) {
                    useractions.right();
                }
            }
        },
        registerDown: function (useractions, callback) {
            useractions.down = callback;
            return useractions;
        },
        registerLeft: function (useractions, callback) {
            useractions.left = callback;
            return useractions;
        },
        registerRight: function (useractions, callback) {
            useractions.right = callback;
            return useractions;
        },
    };
});