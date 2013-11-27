window.G = (function () {
    "use strict";

    var shortcutNew = function (Constructor) {
        return function () {
            var instance = Object.create(Constructor.prototype);
            Constructor.apply(instance, arguments);
            return instance;
        };
    };

    // Frame ------------------------------------------------------------------

    var Frame = function (elem) {
        if (typeof elem === 'string') {
            elem = document.getElementById(elem);
        }

        var width = elem.scrollWidth;
        var height = elem.scrollHeight;

        this.scene = new THREE.Scene();

        this._initCamera(width/height);
        this.scene.add();

        this._initRenderer(width, height);
        elem.appendChild(this.renderer.domElement);

        this._initControls();

        this._initNodes();
        this.scene.add(this.particleSystem);
    };

    var frame = shortcutNew(Frame);

    Frame.prototype._initCamera = function (aspect) {
        var viewAngle = 45;
        var near = 0.1;
        var far = 10000;

        var camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
        camera.position.z = 10;

        this.camera = camera;
    };

    Frame.prototype._initRenderer = function (width, height) {
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);

        this.renderer = renderer;
    };

    Frame.prototype._initControls = function () {
        var self = this;
        var controls = new THREE.TrackballControls(this.camera);

        controls.addEventListener('change', function () {
            self.renderer.render(self.scene, self.camera);
        });

        this.controls = controls;
    };

    Frame.prototype._initNodes = function () {
        var material = new THREE.ParticleSystemMaterial({
            size: 4,
            sizeAttenuation: false,
        });
        this.particles = new THREE.Geometry();
        this.particleSystem = new THREE.ParticleSystem(this.particles, material);
    };

    Frame.prototype.addNode = function (node) {
        this.particles.vertices.push(node.position);
    };

    Frame.prototype.addEdge = function (edge) {
        this.scene.add(edge.line);
    };

    Frame.prototype.render = function () {
        var self = this;

        (function animate() {
            window.requestAnimationFrame(animate);
            self.controls.update();
        }());
    };

    // Node -------------------------------------------------------------------

    var Node = function (x, y, z) {
        this.position = new THREE.Vector3(x, y, z);
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

        var n1Coords = n1.position;
        var n2Coords = n2.position;

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
