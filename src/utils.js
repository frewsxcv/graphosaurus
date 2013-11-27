define(function () {
    "use strict";

    var shortcutNew = function (Constructor) {
        return function () {
            var instance = Object.create(Constructor.prototype);
            Constructor.apply(instance, arguments);
            return instance;
        };
    };

    return {
        shortcutNew: shortcutNew,
    }
});
