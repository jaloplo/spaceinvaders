define(['matter.min'], function (Matter) {
    return {
        create: function (x, y) {
            return Matter.Bodies.circle(x, y, 3, {
                disabled: false,
                label: 'bullet',
                isSensor: true
            });
        },
        deactivate: function (bullet) {
            bullet.disabled = true;
            return bullet;
        },
    };
});