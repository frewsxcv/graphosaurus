define(function () {
    "use strict";

    var Edge = function (nodes) {
        this.setNodes(nodes);
    };

    Edge.prototype.setNodes = function (nodes) {
        this._nodes = nodes;
        return this;
    };

    Edge.prototype.getNodes = function () {
        return this._nodes;
    };

    Edge.prototype.addTo = function (graph) {
        this._resolveIds(graph);
        graph.addEdge(this);
        return this;
    };

    /**
     * Replace string IDs representing nodes with node references
     * @private
     * @method
     *
     * @param {G.Graph} graph - Graph to retrieve node references from node IDs
     * @returns {undefined}
     */
    Edge.prototype._resolveIds = function (graph) {
        var type = typeof this._nodes[0];
        if (type === "string" || type === "number") {
            this._nodes[0] = graph.getNode(this._nodes[0]);
        }

        type = typeof this._nodes[1];
        if (type === "string" || type === "number") {
            this._nodes[1] = graph.getNode(this._nodes[1]);
        }
    };

    return Edge;
});
