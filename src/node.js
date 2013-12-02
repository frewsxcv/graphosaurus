define(function () {
    "use strict";

    var Node = function (x, y, z) {
        this.position = [x, y, z];
    };

    Node.prototype.addTo = function (graph) {
        graph.addNode(this);
        return this;
    };
    
    return Node;
});
