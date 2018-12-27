requirejs(['matter.min', 'core/Core', 'actions/Actions', 'time/TimeManager','ui/View', 'ui/ScoreDisplay'],
    function(Matter, Core, Actions, TimeManager, View, ScoreDisplay) {
        var Engine = Matter.Engine,
            Events = Matter.Events,
            Query = Matter.Query,
            Render = Matter.Render,
            World = Matter.World;

        var Bullet = Core.Bullet,
            BulletHandler = Core.BulletHandler,
            Invader = Core.Invader,
            InvadersHandler = Core.InvadersHandler,
            Score = Core.Score,
            Ship = Core.Ship
            ShipHandler = Core.ShipHandler;

        var KeyboardListener = Actions.KeyboardListener,
            UserActions = Actions.UserActions;

        // engine and world creation
        var engine = Engine.create({
            world: World.create({
                bouds: {
                    min: { x: 0, y: 0 },
                    max: { x: 400, y: 400 }
                },
                gravity: { x: 0, y: 0 }
            }),
        });

        // render creation
        var render = Render.create({
            element: document.getElementsByClassName('game')[0],
            engine: engine,
            options: {
                background: 'black',
                width: 400,
                height: 400,
                wireframes: false
            }
        });


        // Represents collisions between objects in the system
        var Collider = (function () {
            return {
                leftborder: function (bodies) {
                    var collision = Query.ray(
                        bodies,
                        { x: 0, y: 0 },
                        { x: 0, y: 400 });

                    return collision && collision.length > 0;
                },
                rightborder: function (bodies) {
                    var collision = Query.ray(
                        bodies,
                        { x: 400, y: 0 },
                        { x: 400, y: 400 });

                    return collision && collision.length > 0;
                },
                hit: function (bullet, bodies) {
                    var collisions = Query.region(bodies, bullet.bounds);
                    return collisions && collisions.length > 0;
                },
                hurt: function (bullet, bodies) {
                    return Query.region(bodies, bullet.bounds);
                },
            };
        })();

        var GameWorld = (function() {
            return {
                create: function(world) {
                    return {
                        level: 0,
                        world: world,
                    };
                },
                createInvaders: function(game) {
                    game.invaders = InvadersHandler.create(Invader.create(game.level));
                    World.add(game.world, game.invaders);
                    return game;
                },
                createShip: function(game) {
                    game.ship = ShipHandler.create(Ship.create(160, 360));
                    World.add(game.world, game.ship);
                    Events.trigger(game, 'AfterShipCreation', { ship: game.ship });
                },
                increaseLevel: function(game) {
                    game.level += 1;
                    return game;
                },
                moveInvaders: function(game) {
                    InvadersHandler.move(game.invaders, (game.level * 0.3) + 1);
                },
                reset: function(game) {
                    game.level = 0;
                    World.clear(game.world, false, true);
                    return game;
                }
            };
        })();


        Engine.run(engine);
        Render.run(render);

        var game = GameWorld.create(engine.world);

        var view = View.create('score');
        var score = Score.create(game);
        var scoreRender = ScoreDisplay.create(view, score);

        Events.on(game, 'AfterShipCreation', function(ship) {
            Events.on(game.ship, 'OnHit', function () {
                Score.reset(score);
                GameWorld.reset(game);
                GameWorld.createInvaders(game);
                GameWorld.createShip(game);
            });
        });

        GameWorld.createInvaders(game);
        GameWorld.createShip(game);

        var keyboard = KeyboardListener.create();
        var userActions = UserActions.create(keyboard);
        UserActions.registerDown(userActions, function () {
            ShipHandler.shoot(game.ship, game.level + 1);
        });
        UserActions.registerLeft(userActions, function () {
            ShipHandler.move(game.ship, -1);
        });
        UserActions.registerRight(userActions, function () {
            ShipHandler.move(game.ship, 1);
        });

        var invadersShootTimeManager = TimeManager.create(engine);
        var invadersFallTimeManager = TimeManager.create(engine);

        Events.on(engine, 'beforeUpdate', function () {
            UserActions.run(userActions);
            // invaders continuos movement
            GameWorld.moveInvaders(game);

            // invaders direction changing because of borders collision
            if (Collider.leftborder(game.invaders.invaders.bodies)) {
                game.invaders.direction = 1;
            }
            if (Collider.rightborder(game.invaders.invaders.bodies)) {
                game.invaders.direction = -1;
            }

            // invaders death because of ship bullet
            game.ship.bullets.bodies.forEach(function (bullet) {
                if (Collider.hit(bullet, game.invaders.invaders.bodies)) {
                    var bodies = Collider.hurt(bullet, game.invaders.invaders.bodies);
                    Bullet.deactivate(bullet);
                    World.remove(game.invaders.invaders, bodies);
                    Score.invader(score);
                }
            });

            // a new set of invaders if ship kill them
            if (game.invaders.invaders.bodies.length <= 0) {
                GameWorld.increaseLevel(game);
                GameWorld.createInvaders(game);
                Score.level(score, game.level);
                Score.new(score);
            }

            // invaders shooting time
            if (TimeManager.elapsed(invadersShootTimeManager, 2)) {
                InvadersHandler.shoot(game.invaders);
                TimeManager.set(invadersShootTimeManager, engine);
            }

            // invaders fall one step down
            if (TimeManager.elapsed(invadersFallTimeManager, 5)) {
                InvadersHandler.fall(game.invaders);
                TimeManager.set(invadersFallTimeManager, engine);
            }

            // remove bullets that are out of the world or has been disabled
            BulletHandler.review(game.ship.bullets);
            BulletHandler.review(game.invaders.bullets);

            // ship death because of invaders bullet
            game.invaders.bullets.bodies.forEach(function (bullet) {
                var vessel = ShipHandler.getShip(game.ship);
                if (Collider.hit(bullet, [vessel])) {
                    var bodies = Collider.hurt(bullet, [vessel]);
                    Bullet.deactivate(bullet);

                    Events.trigger(game.ship, 'OnHit', {});
                }
            });

            // ship death because of invaders collision
            var vessel = ShipHandler.getShip(game.ship);
            if (Collider.hit(vessel, game.invaders.invaders.bodies)) {
                Events.trigger(game.ship, 'OnHit', {});
            }

            ScoreDisplay.render(scoreRender);
        });
});