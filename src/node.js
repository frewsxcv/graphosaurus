define(function () {
    "use strict";

    var Node = function (position, options) {
        this._position = new THREE.Vector3().fromArray(position);
        this._initOptions();
        this.setOptions(options);
    };

    Node.prototype._initOptions = function () {
        this._color = new THREE.Color("white");
    };

    Node.prototype.setPosition = function (position) {
        this._position.fromArray(position);
        return this;
    };

    Node.prototype.getPosition = function () {
        return this._position.toArray();
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
