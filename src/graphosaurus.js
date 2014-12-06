(function () {
    "use strict";

    var Frame = require("./frame"),
        Node = require("./node"),
        Edge = require("./edge"),
        Graph = require("./graph"),
        nonew = require("nonew");

    window.G = window.Graphosaurus = {
        Frame: Frame,
        frame: nonew(Frame),

        Node: Node,
        node: nonew(Node),

        Edge: Edge,
        edge: nonew(Edge),

        Graph: Graph,
        graph: nonew(Graph),
    };
}());
