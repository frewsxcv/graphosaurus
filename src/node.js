define(function () {
    "use strict";

    var Node = function (id, pos, opts) {
        this._id = id;
        this._pos = new THREE.Vector3().fromArray(pos);
        this._initOpts(opts);
    };

    Node.prototype._initOpts = function (options) {
        options = options || {};

        var color = options.hasOwnProperty("color") ? options.color : "white";
        this._color = new THREE.Color(color);

        return this;
    };

    Node.prototype.getId = function () {
        return this._id;
    };

    Node.prototype.setPos = function (pos) {
        this._pos.fromArray(pos);
        return this;
    };

    Node.prototype.getPos = function () {
        return this._pos.toArray();
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
