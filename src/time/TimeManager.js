define(function () {
    return {
        create: function (engine) {
            return {
                engine: engine,
                time: engine.timing.timestamp,
            };
        },
        elapsed: function (timemanager, seconds) {
            var current = timemanager.engine.timing.timestamp;
            return (current - timemanager.time) / 1000 > seconds;
        },
        set: function (timemanager) {
            timemanager.time = timemanager.engine.timing.timestamp;
            return timemanager;
        }
    };
});