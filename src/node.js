define(function () {
    "use strict";

    var Node = function (x, y, z) {
        this.position = new THREE.Vector3(x, y, z);
    };

    Node.prototype.addTo = function (graph) {
        graph.addNode(this);
        return this;
    };
    
    return Node;
});
