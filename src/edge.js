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
        graph.addEdge(this);
        return this;
    };

    return Edge;
});
