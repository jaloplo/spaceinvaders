define(['matter.min'], function(Matter) {
    return {
        create: function (target) {
            var that = {
                node: document.body || target,
                keys: [],
            };

            that.node.addEventListener('keydown', function(event) {
                if(that.keys.indexOf(event.key) < 0) {
                    that.keys.push(event.key);
                    Matter.Events.trigger(that, 'AfterKeysModification', { keys: that.keys });
                }
                Matter.Events.trigger(that, 'AfterKeyDown', { keys: that.keys });
            });

            that.node.addEventListener('keyup', function(event) {
                if(that.keys.indexOf(event.key) > -1) {
                    that.keys.splice(that.keys.indexOf(event.key), 1);
                    Matter.Events.trigger(that, 'AfterKeysModification', { keys: that.keys });
                }
                Matter.Events.trigger(that, 'AfterKeyUp', { keys: that.keys });
            });

            return that;
        },
    };
});