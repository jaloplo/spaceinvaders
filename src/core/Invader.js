define(['matter.min'], function(Matter) {
    return {
        create: function(rows) {
            rows = rows || 0;
            return Matter.Composites.stack(70, 40, 7, rows + 1, 20, 20, function (x, y) {
                return Matter.Bodies.rectangle(x, y, 20, 20, {
                    label: 'invader'
                });
            });
        }
    };
});