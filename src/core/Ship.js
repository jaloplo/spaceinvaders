define(['matter.min'], function(Matter) {
    return {
        create: function (x, y) {
            return Matter.Bodies.rectangle(x, y, 80, 20, {
                label: 'ship',
                inertia: Infinity,
            });
        },
    };
});