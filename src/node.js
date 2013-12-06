define(function () {
    "use strict";

    var Node = function (x, y, z, options) {
        this.position = [x, y, z];
        this._initOptions();
        this.setOptions(options);
    };

    Node.prototype._initOptions = function () {
        this._color = new THREE.Color("white");
    };

    Node.prototype.setOptions = function (options) {
        if (!options) {
            return;
        }

        if (options.hasOwnProperty("color")) {
            this.setColor(options.color);
        }
        return this;
    };

    Node.prototype.setColor = function (color) {
        if (color) {
            this._color.set(color);
        }
        return this;
    };

    Node.prototype.getColor = function () {
        return this._color;
    };

    Node.prototype.addTo = function (graph) {
        graph.addNode(this);
        return this;
    };

    return Node;
});
