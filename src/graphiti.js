define(["./frame", "./node", "./edge", "./utils"], function (Frame, Node, Edge, utils) {
    "use strict";

    return {
        Frame: Frame,
        frame: utils.shortcutNew(Frame),

        Node: Node,
        node: utils.shortcutNew(Node),

        Edge: Edge,
        edge: utils.shortcutNew(Edge),
    };
});
