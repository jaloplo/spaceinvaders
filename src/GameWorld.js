define(['matter.min', 'core/Core'], function(Matter, Core) {
    return {
        create: function(world) {
            return {
                level: 0,
                world: world,
            };
        },
        createInvaders: function(game) {
            game.invaders = Core.InvadersHandler.create(Core.Invader.create(game.level));
            Matter.World.add(game.world, game.invaders);
            return game;
        },
        createShip: function(game) {
            game.ship = Core.ShipHandler.create(Core.Ship.create(160, 360));
            Matter.World.add(game.world, game.ship);
            Matter.Events.trigger(game, 'AfterShipCreation', { ship: game.ship });
        },
        increaseLevel: function(game) {
            game.level += 1;
            return game;
        },
        moveInvaders: function(game) {
            Core.InvadersHandler.move(game.invaders, (game.level * 0.3) + 1);
        },
        reset: function(game) {
            game.level = 0;
            Matter.World.clear(game.world, false, true);
            return game;
        }
    };
});