define(["./frame", "./node", "./edge", "./graph", "./utils"], function (Frame, Node, Edge, Graph, utils) {
    "use strict";

    return {
        Frame: Frame,
        frame: utils.shortcutNew(Frame),

        Node: Node,
        node: utils.shortcutNew(Node),

        Edge: Edge,
        edge: utils.shortcutNew(Edge),

        Graph: Graph,
        graph: utils.shortcutNew(Graph),
    };
});
