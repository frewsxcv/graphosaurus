define(function () {
    "use strict";

    var Node = function (position, options) {
        this._position = new THREE.Vector3().fromArray(position);
        this._initOptions(options);
    };

    Node.prototype._initOptions = function (options) {
        options = options || {};

        var color = options.hasOwnProperty("color") ? options.color : "white";
        this._color = new THREE.Color(color);

        return this;
    };

    Node.prototype.setPosition = function (position) {
        this._position.fromArray(position);
        return this;
    };

    Node.prototype.getPosition = function () {
        return this._position.toArray();
    };

    Node.prototype.setColor = function (color) {
        if (color) {
            this._color.set(color);
        }
        return this;
    };

    Node.prototype.getColor = function () {
        return this._color.getHexString();
    };

    Node.prototype.addTo = function (graph) {
        graph.addNode(this);
        return this;
    };

    return Node;
});
