define(["../lib/trackball-controls/TrackballControls"], function (TrackballControls) {
    "use strict";

    var Frame = function (elem, graph) {
        var self = this;

        if (typeof elem === 'string') {
            elem = document.getElementById(elem);
        }

        this.graph = graph;

        var width = elem.scrollWidth;
        var height = elem.scrollHeight;
        var aspectRatio = width/height;

        this._initScene();
        this._initCamera(aspectRatio);
        this._initRenderer(width, height, elem);
        this._initControls();
        this._initNodes(graph.getNodes());
        this._initEdges(graph.getEdges());

        window.addEventListener('resize', function () {
            self.camera.aspect = window.innerWidth / window.innerHeight;
            self.camera.updateProjectionMatrix();

            self.renderer.setSize(window.innerWidth, window.innerHeight);
            self.renderer.render(self.scene, self.camera);
        }, false);

        this._normalize();
        this._animate();
    };

    Frame.prototype._initScene = function () {
        this.scene = new THREE.Scene();
    };

    Frame.prototype._initCamera = function (aspect) {
        var viewAngle = 45;
        var near = 0.1;
        var far = 10000;

        var camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
        camera.position.z = 15;

        this.camera = camera;
    };

    Frame.prototype._initRenderer = function (width, height, elem) {
        var renderer = new THREE.WebGLRenderer({
            antialias: this.graph._antialias,
            alpha: true,
        });
        renderer.setClearColor(this.graph._bgColor, this.graph._bgOpacity);
        renderer.setSize(width, height);
        elem.appendChild(renderer.domElement);

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
            size: 10.0,
            vertexColors: true,
            sizeAttenuation: this.graph._sizeAttenuation,
        });

        if (this.graph._nodeImage !== undefined) {
            var texture = THREE.ImageUtils.loadTexture(this.graph._nodeImage);
            texture.needsUpdate = true;  // TODO: this shouldn't be necessary since loadTexture already includes this?
            material.map = texture;
        }

        this.particles = new THREE.Geometry();
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var vertex = node._pos.clone();
            var color = node._color.clone();

            this.particles.vertices.push(vertex);
            this.particles.colors.push(color);
        }

        this.particleSystem = new THREE.ParticleSystem(this.particles, material);

        if (this.graph._nodeImageTransparent === true) {
            material.transparent = true;
            this.particleSystem.sortParticles = true;
        }

        this.scene.add(this.particleSystem);
    };

    Frame.prototype._initEdges = function (edges) {
        var material = new THREE.LineBasicMaterial({
            vertexColors: true,
        });
        this.edges = new THREE.Geometry();
        for (var i = 0; i < edges.length; i++) {
            var nodes = edges[i].getNodes();
            this.edges.vertices.push(nodes[0]._pos.clone());
            this.edges.colors.push(edges[i]._color.clone());
            this.edges.vertices.push(nodes[1]._pos.clone());
            this.edges.colors.push(edges[i]._color.clone());
        }
        this.line = new THREE.Line(this.edges, material, THREE.LinePieces);
        this.scene.add(this.line);
    };

    Frame.prototype._normalize = function () {
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
