window.G = (function () {
    "use strict";

    var shortcutNew = function (Constructor) {
        return function () {
            var instance = Object.create(Constructor.prototype);
            Constructor.apply(instance, arguments);
            return instance;
        };
    }

    // Frame ------------------------------------------------------------------

    var Frame = function (elem) {
        if (typeof elem === 'string') {
            elem = document.getElementById(elem);
        }

        var height = elem.scrollHeight;
        var width = elem.scrollWidth;

        var viewAngle = 45;
        var aspect = width / (1.0 * height);
        var near = 0.1;
        var far = 10000;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
        this.camera.position.z = 10;
        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);

        elem.appendChild(this.renderer.domElement);
    };

    var frame = shortcutNew(Frame);

    Frame.prototype.addNode = function (node) {
        this.scene.add(node.mesh);
    };

    Frame.prototype.addEdge = function (edge) {
        this.scene.add(edge.line);
    };

    Frame.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };

    // Node -------------------------------------------------------------------

    var Node = function (x, y, z) {
        var geometry = new THREE.SphereGeometry(0.5, 8, 8);
        var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position = new THREE.Vector3(x, y, z);
    };

    var node = shortcutNew(Node);

    Node.prototype.addTo = function (frame) {
        frame.addNode(this);
        return this;
    };

    // Edge -------------------------------------------------------------------

    var Edge = function (n1, n2) {
        var material = new THREE.LineBasicMaterial({color: 0x0000ff});
        var geometry = new THREE.Geometry();

        var n1Coords = n1.mesh.position;
        var n2Coords = n2.mesh.position;

        geometry.vertices.push(n1Coords);
        geometry.vertices.push(n2Coords);

        this.line = new THREE.Line(geometry, material);
    };

    var edge = shortcutNew(Edge);

    Edge.prototype.addTo = function (frame) {
        frame.addEdge(this);
        return this;
    };

    return {
        "Frame": Frame,
        "frame": frame,
        "Node": Node,
        "node": node,
        "Edge": Edge,
        "edge": edge,
    };
}());
