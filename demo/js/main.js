requirejs(['matter.min', 'core/Bullet', 'core/Invader', 'core/Score', 'time/TimeManager','ui/View', 'ui/ScoreDisplay'],
    function(Matter, Bullet, Invader, Score, TimeManager, View, ScoreDisplay) {
        var Body = Matter.Body,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Composites = Matter.Composites,
            Engine = Matter.Engine,
            Events = Matter.Events,
            Query = Matter.Query,
            Render = Matter.Render,
            World = Matter.World;

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

        // Represents a handler to manage aliens
        var InvadersHandler = (function () {
            return {
                create: function (invaders) {
                    var handler = Composite.create({
                        bullets: BulletHandler.create(),
                        direction: -1,
                        invaders: invaders,
                    });

                    Composite.add(handler, handler.bullets);
                    Composite.add(handler, invaders);

                    return handler;
                },
                fall: function (handler) {
                    handler.invaders.bodies.forEach(function (invader) {
                        Body.setPosition(invader, { x: invader.position.x, y: invader.position.y + 10 });
                    });
                },
                move: function (handler, delta) {
                    handler.invaders.bodies.forEach(function (invader) {
                        Body.setVelocity(invader, {
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
                    Body.setVelocity(bullet, { x: 0, y: 5 });
                }
            };
        })();

        // Represents a handler to manage bullets that are out of the world
        var BulletHandler = (function () {
            return {
                add: function (handler, bullet) {
                    Composite.add(handler, bullet);
                    return handler;
                },
                create: function () {
                    return Composite.create({
                        label: 'bullet handler'
                    });
                },
                review: function (handler) {
                    // while(handler.bodies[0].position.y < 0) {
                    //     Composite.remove(handler, handler.bodies[0]);
                    // }
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
                        Composite.remove(handler, handler.bodies[index]);
                    }
                },
            };
        })();

        // Represents the ship in the system
        var Ship = (function () {
            return {
                create: function (x, y) {
                    return Bodies.rectangle(x, y, 80, 20, {
                        label: 'ship',
                        inertia: Infinity,
                    });
                },
            };
        })();

        // Represents a handler to manage ship actions
        var ShipHandler = (function () {

            var shipid = null;

            var _getShip = function (handler) {
                return Composite.get(handler, shipid, 'body');
            }

            var that = {
                create: function (ship) {
                    shipid = ship.id;

                    var handler = Composite.create({
                        label: 'ship handler',
                        bullets: BulletHandler.create(),
                    });

                    Composite.add(handler, ship);
                    Composite.add(handler, handler.bullets);

                    return handler;
                },
                getShip: function (handler) {
                    return Composite.get(handler, shipid, 'body');
                },
                move: function (handler, x) {
                    var ship = _getShip(handler);
                    Body.setVelocity(ship, { x: x, y: 0 });
                },
                shoot: function (handler, bulletslimit) {
                    if(handler.bullets.bodies.length < bulletslimit) {
                        var ship = _getShip(handler);
                        var bullet = Bullet.create(ship.position.x, ship.position.y);
                        BulletHandler.add(handler.bullets, bullet);
                        Body.setVelocity(bullet, { x: 0, y: -10 });
                    }
                }
            };

            return that;
        })();

        // Represents a handler for the user keyboard interactions
        var KeyboardListener = (function () {
            return {
                create: function (target) {
                    var that = {
                        node: document.body || target,
                        keys: [],
                    };

                    that.node.addEventListener('keydown', function(event) {
                        if(that.keys.indexOf(event.key) < 0) {
                            that.keys.push(event.key);
                            Events.trigger(that, 'AfterKeysModification', { keys: that.keys });
                        }
                        Events.trigger(that, 'AfterKeyDown', { keys: that.keys });
                    });

                    that.node.addEventListener('keyup', function(event) {
                        if(that.keys.indexOf(event.key) > -1) {
                            that.keys.splice(that.keys.indexOf(event.key), 1);
                            Events.trigger(that, 'AfterKeysModification', { keys: that.keys });
                        }
                        Events.trigger(that, 'AfterKeyUp', { keys: that.keys });
                    });

                    return that;
                },
            };
        })();

        // Represents the actions of a user
        var UserActions = (function () {
            return {
                create: function (listener) {
                    return {
                        listener: listener,
                    };
                },
                run: function(useractions) {
                    if(useractions.listener.keys.indexOf('ArrowDown') > -1) {
                            useractions.down();
                    }
                    var leftIndex = useractions.listener.keys.indexOf('ArrowLeft');
                    var rightIndex = useractions.listener.keys.indexOf('ArrowRight');
                    if(leftIndex > -1 || rightIndex > -1) {
                        if(leftIndex > rightIndex) {
                            useractions.left();
                        }
                        if(rightIndex > leftIndex) {
                            useractions.right();
                        }
                    }
                },
                registerDown: function (useractions, callback) {
                    useractions.down = callback;
                    return useractions;
                },
                registerLeft: function (useractions, callback) {
                    useractions.left = callback;
                    return useractions;
                },
                registerRight: function (useractions, callback) {
                    useractions.right = callback;
                    return useractions;
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