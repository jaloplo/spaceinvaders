define(['matter.min', 'core/Bullet', 'core/BulletHandler'], function(Matter, Bullet, BulletHandler) {
    return {
        create: function (invaders) {
            var handler = Matter.Composite.create({
                bullets: BulletHandler.create(),
                direction: -1,
                invaders: invaders,
            });

            Matter.Composite.add(handler, handler.bullets);
            Matter.Composite.add(handler, invaders);

            return handler;
        },
        fall: function (handler) {
            handler.invaders.bodies.forEach(function (invader) {
                Matter.Body.setPosition(invader, { x: invader.position.x, y: invader.position.y + 10 });
            });
        },
        move: function (handler, delta) {
            handler.invaders.bodies.forEach(function (invader) {
                Matter.Body.setVelocity(invader, {
                    x: handler.direction * delta,
                    y: invader.velocity.y
                });
            });
        },
        shoot: function (handler) {
            var randomInvadersIndex = Math.floor(Math.random() * handler.invaders.bodies.length);
            var invader = handler.invaders.bodies[randomInvadersIndex];
            var bullet = Bullet.create(invader.position.x, invader.position.y);
            BulletHandler.add(handler.bullets, bullet);
            Matter.Body.setVelocity(bullet, { x: 0, y: 5 });
        }
    };
});