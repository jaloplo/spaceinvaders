define(['matter.min', 'core/Bullet', 'core/BulletHandler'], function(Matter, Bullet, BulletHandler) {
    var shipid = null;

    var _getShip = function (handler) {
        return Matter.Composite.get(handler, shipid, 'body');
    }

    var that = {
        create: function (ship) {
            shipid = ship.id;

            var handler = Matter.Composite.create({
                label: 'ship handler',
                bullets: BulletHandler.create(),
            });

            Matter.Composite.add(handler, ship);
            Matter.Composite.add(handler, handler.bullets);

            return handler;
        },
        getShip: function (handler) {
            return Matter.Composite.get(handler, shipid, 'body');
        },
        move: function (handler, x) {
            var ship = _getShip(handler);
            Matter.Body.setVelocity(ship, { x: x, y: 0 });
        },
        shoot: function (handler, bulletslimit) {
            if(handler.bullets.bodies.length < bulletslimit) {
                var ship = _getShip(handler);
                var bullet = Bullet.create(ship.position.x, ship.position.y);
                BulletHandler.add(handler.bullets, bullet);
                Matter.Body.setVelocity(bullet, { x: 0, y: -10 });
            }
        }
    };

    return that;
});