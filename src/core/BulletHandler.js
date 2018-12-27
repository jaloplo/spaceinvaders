define(['matter.min'], function(Matter) {
    return {
        add: function (handler, bullet) {
            Matter.Composite.add(handler, bullet);
            return handler;
        },
        create: function () {
            return Matter.Composite.create({
                label: 'bullet handler'
            });
        },
        review: function (handler) {
            var indexToRemove = [];
            for (var i = 0; i < handler.bodies.length; i++) {
                if (handler.bodies[i].position.y < 0) {
                    indexToRemove.push(i);
                } else if (handler.bodies[i].disabled) {
                    indexToRemove.push(i);
                }
            }
            while (indexToRemove.length > 0) {
                var index = indexToRemove.pop();
                Matter.Composite.remove(handler, handler.bodies[index]);
            }
        },
    };
});