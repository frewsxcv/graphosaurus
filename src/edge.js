define(function () {
    "use strict";

    var Edge = function (n1, n2) {
        var material = new THREE.LineBasicMaterial({color: 0x0000ff});
        var geometry = new THREE.Geometry();

        var n1Coords = n1.position;
        var n2Coords = n2.position;

        geometry.vertices.push(n1Coords);
        geometry.vertices.push(n2Coords);

        this.line = new THREE.Line(geometry, material);
    };

    Edge.prototype.addTo = function (frame) {
        frame.addEdge(this);
        return this;
    };
    
    return Edge;
});
