define(['matter.min'], function(Matter) {
    var that = {
        create: function(x, y) {
            return Matter.Bodies.rectangle(x, y, 20, 20, {
                label: 'invader'
            });
        },
        createRow: function(x, y, rows, amount) {
            return Matter.Composites.stack(x, y, amount, rows, 20, 20, function (x, y) {
                return that.create(x, y);
            });
        }
    };

    return that;
});