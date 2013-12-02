define(function () {
    "use strict";

    var Edge = function (node1, node2) {
        this.n1Coords = node1.position;
        this.n2Coords = node2.position;
    };

    Edge.prototype.addTo = function (graph) {
        graph.addEdge(this);
        return this;
    };

    return Edge;
});
