define(['matter.min'], function(Matter) {
    return {
        leftborder: function (bodies) {
            var collision = Matter.Query.ray(
                bodies,
                { x: 0, y: 0 },
                { x: 0, y: 400 });

            return collision && collision.length > 0;
        },
        rightborder: function (bodies) {
            var collision = Matter.Query.ray(
                bodies,
                { x: 400, y: 0 },
                { x: 400, y: 400 });

            return collision && collision.length > 0;
        },
        hit: function (bullet, bodies) {
            var collisions = Matter.Query.region(bodies, bullet.bounds);
            return collisions && collisions.length > 0;
        },
        hurt: function (bullet, bodies) {
            return Matter.Query.region(bodies, bullet.bounds);
        },
    };
});