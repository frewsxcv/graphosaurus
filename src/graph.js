define(["./frame"], function (Frame) {
    "use strict";

    var Graph = function () {
        this.nodes = [];
        this.edges = [];
    };

    Graph.prototype.addNode = function (node) {
        this.nodes.push(node.position);
    };

    Graph.prototype.addEdge = function (edge) {
        this.edges.push(edge.nodes[0].position);
        this.edges.push(edge.nodes[1].position);
    };

    Graph.prototype.renderIn = function (elem) {
        return new Frame(elem, this);
    };

    return Graph;
});
