module.exports = (function () {
    "use strict";

    var THREE = require("three");

    /**
     * Constructs a new Edge
     * @constructor
     * @alias Edge
     *
     * @param {Array} nodes - Array of two Nodes representing a graph edge. Since an Edge is undirected, the order of the Nodes in the Array does not matter.
     * @param {Object} props - Object containing optional properties of the Edge
     * @param {Number|String} props.color - Hexadecimal or CSS-style string representation of a color; defaults to 'white'
     */
    var Edge = function (nodes, props) {
        this.setNodes(nodes);
        this._initProps(props);
    };

    /**
     * Initialize Edge properties
     * @private
     *
     * @param {Object} properties - Properties passed in from the constructor
     * @returns {Edge} The Edge the method was called on
     */
    Edge.prototype._initProps = function (properties) {
        properties = properties || {};

        var color = properties.color || "white";
        this._color = new THREE.Color(color);

        return this;
    };

    /**
     * Set the nodes of the Edge
     *
     * @param {Array} nodes - Array of two Nodes
     * @returns {Edge} The Edge the method was called on
     */
    Edge.prototype.setNodes = function (nodes) {
        this._nodes = nodes;
        return this;
    };

    /**
     * Get the nodes of the Edge
     *
     * @returns {Array} Array of two Nodes that represent the ends of the Edge
     */
    Edge.prototype.getNodes = function () {
        // TODO: should this do this._nodes.clone(); ?
        return this._nodes;
    };

    /**
     * Set the color of the Edge
     *
     * @param {Number|String} color - Hexadecimal or CSS-style string representation of a color
     * @returns {Edge} The Edge the method was called on
     *
     * @example
     * myEdge.setColor(0x00ffbb);
     *
     * @example
     * myEdge.setColor("rgb(250,0,0)");
     *
     * @example
     * myEdge.setColor("green");
     */
    Edge.prototype.setColor = function (color) {
        // TODO: Should this validate string CSS colors?
        if (color !== undefined) {
            this._color.set(color);
        }
        return this;
    };

    /**
     * Gets the color of the Edge
     *
     * @returns {String} String hexadecimal representation of the Edge's color
     *
     * @example
     * myEdge.setColor("green");
     * myEdge.getColor();  // returns "008000"
     */
    Edge.prototype.getColor = function () {
        return this._color.getHexString();
    };

    /**
     * Add the Edge to a Graph. Upon adding, if the Edge contains Node string ID's, they will be looked up in the Graph and replaced with Node instances.
     *
     * @param {Graph} graph - Graph the Edge will be added to
     * @returns {Edge} The Edge the method was called on
     */
    Edge.prototype.addTo = function (graph) {
        graph.addEdge(this);
        return this;
    };

    return Edge;
}());
