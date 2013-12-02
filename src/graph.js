define(["./frame"], function (Frame) {
    "use strict";

    var Graph = function () {
        this.nodes = [];
        this.edges = [];
    };

    Graph.prototype.addNode = function (node) {
        this.nodes.push(node);
    };

    Graph.prototype.addEdge = function (edge) {
        this.edges.push(edge);
    };

    Graph.prototype.renderIn = function (elem) {
        return new Frame(elem, this);
    };

    return Graph;
});
