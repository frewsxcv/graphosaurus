(function () {
    "use strict";

    var Frame = require("./frame"),
        Node = require("./node"),
        Edge = require("./edge"),
        Graph = require("./graph"),
        utils = require("./utils");

    window.G = window.Graphosaurus = {
        Frame: Frame,
        frame: utils.noNew(Frame),

        Node: Node,
        node: utils.noNew(Node),

        Edge: Edge,
        edge: utils.noNew(Edge),

        Graph: Graph,
        graph: utils.noNew(Graph),
    };
}());
