define(function () {
    "use strict";

    var Edge = function (node1, node2) {
        this.nodes = [node1, node2];
    };

    Edge.prototype.addTo = function (graph) {
        graph.addEdge(this);
        return this;
    };

    return Edge;
});
