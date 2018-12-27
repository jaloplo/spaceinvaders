define(
    ['core/Bullet','core/BulletHandler', 'core/Invader', 'core/InvadersHandler', 'core/Score', 'core/Ship', 'core/ShipHandler'], 
    function(bullet, bulletHandler, invader, invadersHandler, score, ship, shipHandler) {
        return {
            Bullet: bullet,
            BulletHandler: bulletHandler, 
            Invader: invader,
            InvadersHandler: invadersHandler,
            Score: score,
            Ship: ship,
            ShipHandler: shipHandler
        };
});