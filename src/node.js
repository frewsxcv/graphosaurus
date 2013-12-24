define(function () {
    "use strict";

    /**
     * Constructs a new Node
     * @constructor
     * @alias Node
     *
     * @param {Array} nodes - Position
     * @param {Object} opts - Options
     * TODO: document opts
     */
    var Node = function (pos, opts) {
        this._pos = new THREE.Vector3().fromArray(pos);
        this._initOpts(opts);
    };

    /**
     * Initialize Node options
     * @private
     *
     * @param {Object} options - Options passed in from the constructor
     * @returns {Node} The Node the method was called on
     */
    Node.prototype._initOpts = function (options) {
        options = options || {};

        var color = options.hasOwnProperty("color") ? options.color : "white";
        this._color = new THREE.Color(color);

        var id = options.hasOwnProperty("id") ? options.id : null;
        this._id = id;

        return this;
    };

    /**
     * Get the ID of the Node
     *
     * @returns {String|Number|null} ID of the Node
     */
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
