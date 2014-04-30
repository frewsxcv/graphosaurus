module.exports = (function () {
    "use strict";

    var THREE = require("three"),
        TrackballControls = require("../lib/trackball-controls/TrackballControls");

    var Frame = function (elem, graph) {
        if (typeof elem === 'string') {
            elem = document.getElementById(elem);
        }

        this.graph = graph;

        var width = elem.scrollWidth;
        var height = elem.scrollHeight;
        var aspectRatio = width/height;

        this._initScene();
        this._initRenderer(width, height, elem);
        this._initNodes(graph.getNodes());
        this._initEdges(graph.getEdges());

        this._initCamera(aspectRatio);
        this._initControls(elem);

        this.positionCamera();

        this._animate();
    };

    Frame.prototype._initScene = function () {
        this.scene = new THREE.Scene();
    };

    Frame.prototype._initCamera = function (aspect) {
        var self = this;

        var viewAngle = this.graph._fov;
        var camera = new THREE.PerspectiveCamera(viewAngle, aspect);

        this.camera = camera;

        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            // TODO this should be the element width/height, not the window
            self.renderer.setSize(window.innerWidth, window.innerHeight);
            self.forceRerender();
        }, false);
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

    Frame.prototype.forceRerender = function () {
        this.renderer.render(this.scene, this.camera);
    };

    Frame.prototype._initControls = function (elem) {
        var self = this;
        var controls = new TrackballControls(this.camera, elem);

        controls.addEventListener('change', function () {
            self.forceRerender();
        });

        this.controls = controls;
    };

    Frame.prototype.positionCamera = function () {
        // Calculate optimal camera position
        this.particles.computeBoundingSphere();
        var sphere = this.particles.boundingSphere;

        // TODO: allow the user to specify a custom FOV
        var fov = 45;

        var optimalDistance = sphere.radius / Math.tan(fov / 2);

        this.camera.position = sphere.center.clone();
        this.camera.position.x += optimalDistance;

        this.controls.target = sphere.center.clone();
    };

    Frame.prototype._initNodes = function (nodes) {
        var self = this;

        var material = new THREE.PointCloudMaterial({
            size: this.graph._nodeSize,
            vertexColors: true,
            sizeAttenuation: this.graph._sizeAttenuation,
            depthWrite: false,
        });

        if (this.graph._nodeImage !== undefined) {
            var texture = THREE.ImageUtils.loadTexture(
                this.graph._nodeImage, undefined, function () {
                    // Force a rerender after node image has finished loading
                    self.forceRerender();
                });
            material.map = texture;
        }

        this.particles = new THREE.Geometry();
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var vertex = node._pos;
            var color = node._color;

            this.particles.vertices.push(vertex);
            this.particles.colors.push(color);
        }

        this.particleSystem = new THREE.PointCloud(this.particles, material);

        if (this.graph._nodeImageTransparent === true) {
            material.transparent = true;
            this.particleSystem.sortParticles = true;
        }

        this.scene.add(this.particleSystem);
    };

    Frame.prototype._initEdges = function (edges) {
        var material = new THREE.LineBasicMaterial({
            vertexColors: true,
            linewidth: this.graph._edgeWidth,
            opacity: this.graph._edgeOpacity,
            transparent: this.graph._edgeOpacity < 1,
        });
        this.edges = new THREE.Geometry();
        for (var i = 0; i < edges.length; i++) {
            var nodes = edges[i].getNodes();
            this.edges.vertices.push(nodes[0]._pos);
            this.edges.colors.push(edges[i]._color);
            this.edges.vertices.push(nodes[1]._pos);
            this.edges.colors.push(edges[i]._color);
        }
        this.line = new THREE.Line(this.edges, material, THREE.LinePieces);
        this.scene.add(this.line);
    };

    Frame.prototype._animate = function () {
        var self = this,
            prevCameraPos;

        // Update near/far camera range
        (function animate() {

            // TODO: this shouldn't update every frame
            var cameraPos = self.camera.position;
            if (cameraPos !== prevCameraPos) {
                var boundingSphere = self.particles.boundingSphere;
                var distance = boundingSphere.distanceToPoint(cameraPos);

                if (distance > 0) {
                    self.camera.near = distance;
                    self.camera.far = distance + boundingSphere.radius * 2;
                    self.camera.updateProjectionMatrix();
                }

                prevCameraPos = cameraPos.clone();
            }

            window.requestAnimationFrame(animate);
            self.controls.update();
        }());
    };

    return Frame;
}());
