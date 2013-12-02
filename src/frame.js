define(["../lib/trackball-controls/TrackballControls"], function (TrackballControls) {
    "use strict";

    var Frame = function (elem, graph) {
        var self = this;

        if (typeof elem === 'string') {
            elem = document.getElementById(elem);
        }

        var width = elem.scrollWidth;
        var height = elem.scrollHeight;

        this.scene = new THREE.Scene();

        this._initCamera(width/height);

        this._initRenderer(width, height);
        elem.appendChild(this.renderer.domElement);

        this._initControls();

        this._initNodes(graph.nodes);
        this.scene.add(this.particleSystem);

        this._initEdges(graph.edges);
        this.scene.add(this.line);

        window.addEventListener('resize', function () {
            self.camera.aspect = window.innerWidth / window.innerHeight;
            self.camera.updateProjectionMatrix();

            self.renderer.setSize(window.innerWidth, window.innerHeight);
            self.renderer.render(self.scene, self.camera);
        }, false);

        this.centerView();

        this._animate();
    };

    Frame.prototype._initCamera = function (aspect) {
        var viewAngle = 45;
        var near = 0.1;
        var far = 10000;

        var camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
        camera.position.z = 15;

        this.camera = camera;
    };

    Frame.prototype._initRenderer = function (width, height) {
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);

        this.renderer = renderer;
    };

    Frame.prototype._initControls = function () {
        var self = this;
        var controls = new TrackballControls(this.camera);

        controls.addEventListener('change', function () {
            self.renderer.render(self.scene, self.camera);
        });

        this.controls = controls;
    };

    Frame.prototype._initNodes = function (nodes) {
        var material = new THREE.ParticleSystemMaterial({
            size: 4,
            sizeAttenuation: false,
        });
        this.particles = new THREE.Geometry();
        for (var i = 0; i < nodes.length; i++) {
            var vertex = new THREE.Vector3().fromArray(nodes[i].position);
            this.particles.vertices.push(vertex);
        }
        this.particleSystem = new THREE.ParticleSystem(this.particles, material);
    };

    Frame.prototype._initEdges = function (edges) {
        this.edges = new THREE.Geometry();
        for (var i = 0; i < edges.length; i++) {
            var nodes = edges[i].nodes;
            var vertex = new THREE.Vector3().fromArray(nodes[0].position);
            this.edges.vertices.push(vertex);
            vertex = new THREE.Vector3().fromArray(nodes[1].position);
            this.edges.vertices.push(vertex);
        }
        var edgeMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
        this.line = new THREE.Line(this.edges, edgeMaterial, THREE.LinePieces);
    };

    Frame.prototype.centerView = function () {
        // Calculate bounding sphere
        this.particles.computeBoundingSphere();
        var sphere = this.particles.boundingSphere;
        var center = [-sphere.center.x, -sphere.center.y, -sphere.center.z];

        // Create/apply translation transformation matrix
        var translation = new THREE.Matrix4();
        translation.makeTranslation.apply(translation, center);
        this.particles.applyMatrix(translation);
        this.edges.applyMatrix(translation);

        // Determine scale to normalize coordinates
        var scale = 5 / sphere.radius;

        // Scale coordinates
        this.particleSystem.scale.set(scale, scale, scale);
        this.line.scale.set(scale, scale, scale);
    };

    Frame.prototype._animate = function () {
        var self = this;

        (function animate() {
            window.requestAnimationFrame(animate);
            self.controls.update();
        }());
    };

    return Frame;
});
