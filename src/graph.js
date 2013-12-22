define(["./frame"], function (Frame) {
    "use strict";

    var Graph = function () {
        var self = this;
        this._nodeIds = {};
        this._nodes = [];
        this._edges = [];

        //Nothing is done with the clicked node information for now
        document.addEventListener('nodeClicked', function(e){
            console.log(self.getNode(e.detail._id));
        });
    };

    Graph.prototype.addNode = function (node) {
        var id = node.getId();

        if (id) {
            this._nodeIds[id] = node;
        }

        this._nodes.push(node);

        return this;
    };

    Graph.prototype.getNode = function (id) {
        return this._nodeIds[id];
    };

    Graph.prototype.getNodes = function () {
        return this._nodes;
    };

    Graph.prototype.getEdges = function () {
        return this._edges;
    };

    Graph.prototype.addEdge = function (edge) {
        this._resolveEdgeIds(edge);
        this._edges.push(edge);

        return this;
    };

    /**
     * Replace string IDs representing Nodes in Edges with Node references
     * @private
     *
     * @param {Edge} edge - Edge that
     * @returns {undefined}
     */
    Graph.prototype._resolveEdgeIds = function (edge) {
        var nodes = edge.getNodes(), type;

        type = typeof nodes[0];
        if (type === "string" || type === "number") {
            nodes[0] = this.getNode(nodes[0]);
        }

        type = typeof nodes[1];
        if (type === "string" || type === "number") {
            nodes[1] = this.getNode(nodes[1]);
        }
    };

    Graph.prototype.renderIn = function (elem) {
        return new Frame(elem, this);
    };

    return Graph;
});
