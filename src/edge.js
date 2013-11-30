define(function () {
    "use strict";

    var Edge = function (n1, n2) {
        this.n1Coords = n1.position;
        this.n2Coords = n2.position;
    };

    Edge.prototype.addTo = function (frame) {
        frame.addEdge(this);
        return this;
    };
    
    return Edge;
});
