define(function () {
    "use strict";

    var noNew = function (Constructor) {
        return function () {
            var instance = Object.create(Constructor.prototype);
            Constructor.apply(instance, arguments);
            return instance;
        };
    };

    return {
        noNew: noNew,
    };
});
