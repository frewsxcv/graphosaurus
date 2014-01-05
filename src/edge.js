define(function () {
    "use strict";

    /**
     * Constructs a new Edge
     * @constructor
     * @alias Edge
     *
     * @param {Array} nodes - Array of two [Nodes]{@link module:Node}
     * @param {Object} opts - Object containing optional properties of the Edge
     * @param {Number|String} opts.color - Hexadecimal or CSS-style string representation of a color; defaults to 'white'
     */
    var Edge = function (nodes, opts) {
        this.setNodes(nodes);
        this._initOpts(opts);
    };

    /**
     * Initialize Edge options
     * @private
     *
     * @param {Object} options - Options passed in from the constructor
     * @returns {Edge} The Edge the method was called on
     */
    Edge.prototype._initOpts = function (options) {
        options = options || {};

        var color = options.hasOwnProperty("color") ? options.color : "white";
        this._color = new THREE.Color(color);

        return this;
    };

    /**
     * Set the nodes of the Edge
     *
     * @param {Array} nodes - Array of two [Nodes]{@link module:Node}
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
        if (color) {
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
});
