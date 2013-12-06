define(["./frame", "./node", "./edge", "./graph", "./utils"], function (Frame, Node, Edge, Graph, utils) {
    "use strict";

    return {
        Frame: Frame,
        frame: utils.noNew(Frame),

        Node: Node,
        node: utils.noNew(Node),

        Edge: Edge,
        edge: utils.noNew(Edge),

        Graph: Graph,
        graph: utils.noNew(Graph),
    };
});
