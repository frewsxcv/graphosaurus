module.exports = (function () {
    "use strict";

    var THREE = require("three");

    /**
     * Constructs a new Node
     * @constructor
     * @alias Node
     *
     * @param {Array} pos - Array of three Numbers representing the position of the Node in 3D space (x, y, z)
     * @param {Object} props - Object containing optional properties of the Node
     * @param {Number|String|null} props.id - Optional unique identifier; Numbers will be converted into Strings; defaults to null
     * @param {Number|String} props.color - Hexadecimal or CSS-style string representation of a color; defaults to 'white'
     */
    var Node = function (pos, props) {
        this._pos = new THREE.Vector3().fromArray(pos);
        this._initProps(props);
    };

    /**
     * Initialize Node properties
     * @private
     *
     * @param {Object} properties - Options passed in from the constructor
     * @returns {Node} The Node the method was called on
     */
    Node.prototype._initProps = function (properties) {
        properties = properties || {};

        var color = properties.color !== undefined ? properties.color : "white";
        this._color = new THREE.Color(color);

        var id = properties.id !== undefined ? properties.id : null;
        this._id = id;

        return this;
    };

    /**
     * Get the ID of the Node
     *
     * @returns {String|Number|null} ID of the Node
     */
    Node.prototype.id = function () {
        return this._id;
    };

    /**
     * Set the position of the Node
     *
     * @param {Array} pos - Array of three Numbers representing the position of the Node in 3D space (x, y, z)
     * @returns {Node} The Node the method was called on
     *
     * @example
     * var x = 14, y = 20, z = -5;
     * myNode.setPos([x, y, z]);
     */
    Node.prototype.setPos = function (pos) {
        this._pos.fromArray(pos);
        return this;
    };

    /**
     * Get the position of the Node
     *
     * @returns {Array} Array of three Numbers representing the position of the Node in 3D space (x, y, z)
     *
     * @example
     * var x = 14, y = 20, z = -5;
     * myNode.pos() === [14, 20, -5];
     */
    Node.prototype.pos = function () {
        return this._pos.toArray();
    };

    /**
     * Set the color of the Node
     *
     * @param {Number|String} color - Hexadecimal or CSS-style string representation of a color
     * @returns The Node the method was called
     */
    Node.prototype.setColor = function (color) {
        if (color) {
            this._color.set(color);
        }
        return this;
    };

    /**
     * Get the color of the Node
     *
     * @returns {String} String hexadecimal representation of the Edge's color
     */
    Node.prototype.color = function () {
        return this._color.getHexString();
    };

    /**
     * Add the Node to a Graph
     *
     * @param {Graph} graph - Graph the Node will be added to
     * @returns {Node} The Node the method was called on
     */
    Node.prototype.addTo = function (graph) {
        graph.addNode(this);
        return this;
    };

    return Node;
}());
