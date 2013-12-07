define(["./frame"], function (Frame) {
    "use strict";

    var Graph = function () {
        this._nodes = {};
        this.edges = [];
    };

    Graph.prototype.addNode = function (node) {
        var id = node.getId();

        if (this._nodes.hasOwnProperty(id)) {
            return;
        }

        this._nodes[id] = node;
    };

    Graph.prototype.getNode = function (id) {
        return this._nodes[id];
    };

    Graph.prototype.getNodes = function () {
        var nodes = [];
        for (var id in this._nodes) {
            if (this._nodes.hasOwnProperty(id)) {
                nodes.push(this._nodes[id]);
            }
        }
        return nodes;
    };

    Graph.prototype.addEdge = function (edge) {
        this.edges.push(edge);
    };

    Graph.prototype.renderIn = function (elem) {
        return new Frame(elem, this);
    };

    return Graph;
});
