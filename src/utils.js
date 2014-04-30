define(function () {
    "use strict";

    // Allows constructors to be called without using `new`
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
