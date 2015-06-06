module.exports = (function () {
    "use strict";

    var THREE = require("three"),
        TrackballControls = require("three.trackball"),
        BufferGeometrySorter = require("three-buffergeometry-sort");

    var Frame = function (elem, graph) {
        if (typeof elem === 'string') {
            elem = document.getElementById(elem);
        }

        if (graph._nodes.length < 2) {
            throw "A graph needs at least two nodes";
        }

        this.graph = graph;

        var width = elem.scrollWidth;
        var height = elem.scrollHeight;
        var aspectRatio = width/height;

        this._initScene();
        this._initRenderer(width, height, elem);
        this._initNodes(graph.getNodes());
        this._normalizeNodes();
        this._initEdges(graph.getEdges());

        this._initCamera(aspectRatio);
        this._initControls(elem);

        this.positionCamera();

        this._initMouseEvents(elem);

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
        this.points.computeBoundingSphere();
        var sphere = this.points.boundingSphere;

        var optimalDistance = (
            sphere.radius * 1.5 / Math.tan(this.graph._fov / 2));

        this.camera.position.x = sphere.center.x + optimalDistance;
        this.camera.position.y = sphere.center.y;
        this.camera.position.z = sphere.center.z;

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

        var positions = new THREE.BufferAttribute(
            new Float32Array(nodes.length * 3), 3);
        var colors = new THREE.BufferAttribute(
            new Float32Array(nodes.length * 3), 3);
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var pos = node._pos;
            var color = node._color;

            positions.setXYZ(i, pos.x, pos.y, pos.z);
            colors.setXYZ(i, color.r, color.g, color.b);
        }
        this.points = new THREE.BufferGeometry();
        this.points.addAttribute('position', positions);
        this.points.addAttribute('color', colors);

        this.pointCloud = new THREE.PointCloud(this.points, material);

        if (this.graph._nodeImageTransparent === true) {
            material.transparent = true;
            this.pointCloud.sortParticles = true;
        }

        this.scene.add(this.pointCloud);
    };

    Frame.prototype._normalizeNodes = function () {
        this.points.computeBoundingSphere();

        this.scale = 1 / this.points.boundingSphere.radius;
        var positions = this.points.attributes.position.array;

        for (var i = 0; i < positions.length; i++) {
            positions[i] *= this.scale;
        }
    };

    Frame.prototype._initEdges = function (edges) {
        var material = new THREE.LineBasicMaterial({
            vertexColors: THREE.VertexColors,
            linewidth: this.graph._edgeWidth,
            opacity: this.graph._edgeOpacity,
            transparent: this.graph._edgeOpacity < 1,
        });

        var positions = new THREE.BufferAttribute(
            new Float32Array(edges.length * 6), 3);
        var colors = new THREE.BufferAttribute(
            new Float32Array(edges.length * 6), 3);

        for (var i = 0; i < edges.length; i++) {
            var edge = edges[i];
            var nodes = edge.getNodes();

            positions.setXYZ(
                2 * i,
                this.scale * nodes[0]._pos.x,
                this.scale * nodes[0]._pos.y,
                this.scale * nodes[0]._pos.z);

            positions.setXYZ(
                2 * i + 1,
                this.scale * nodes[1]._pos.x,
                this.scale * nodes[1]._pos.y,
                this.scale * nodes[1]._pos.z);

            colors.setXYZ(
                2 * i,
                edge._color.r,
                edge._color.g,
                edge._color.b);

            colors.setXYZ(
                2 * i + 1,
                edge._color.r,
                edge._color.g,
                edge._color.b);
        }

        this.edges = new THREE.BufferGeometry();
        this.edges.addAttribute('position', positions);
        this.edges.addAttribute('color', colors);

        this.line = new THREE.Line(this.edges, material, THREE.LinePieces);
        this.scene.add(this.line);
    };

    Frame.prototype._initMouseEvents = function (elem) {
        var self = this;
        var createMouseHandler = function (callback) {
            var raycaster = new THREE.Raycaster();

            return function (evt) {
                evt.preventDefault();

                var mouseX = (evt.clientX / window.innerWidth) * 2 - 1;
                var mouseY = 1 - (evt.clientY / window.innerHeight) * 2;

                // Calculate mouse position
                var mousePosition = new THREE.Vector3(mouseX, mouseY, 0.1);
                var radiusPosition = mousePosition.clone();
                mousePosition.unproject(self.camera);

                // Calculate threshold
                var clickRadiusPx = 5;  // 5px
                var radiusX = ((evt.clientX + clickRadiusPx) / window.innerWidth) * 2 - 1;
                radiusPosition.setX(radiusX);
                radiusPosition.unproject(self.camera);

                var clickRadius = radiusPosition.distanceTo(mousePosition);
                var threshold = (
                    self.camera.far * clickRadius / self.camera.near);

                raycaster.params.PointCloud.threshold = threshold;

                // Determine intersects
                var mouseDirection = (
                    mousePosition.sub(self.camera.position).normalize());
                raycaster.set(self.camera.position, mouseDirection);
                var intersects = raycaster.intersectObject(self.pointCloud);
                if (intersects.length) {
                    var nodeIndex = intersects[0].index;
                    callback(self.graph._nodes[nodeIndex]);
                }
            };
        };

        if (this.graph._hover) {
            elem.addEventListener(
                'mousemove', createMouseHandler(this.graph._hover), false);
        }

        if (this.graph._click) {
            elem.addEventListener(
                'click', createMouseHandler(this.graph._click), false);
        }
    };

    Frame.prototype._updateCameraBounds = (function () {
        var prevCameraPos;
        return function () {
            // TODO: this shouldn't update every frame
            // TODO: is this still even necessary now that we scale?
            var cameraPos = this.camera.position;

            if (cameraPos === prevCameraPos) { return; }

            var boundingSphere = this.points.boundingSphere;
            var distance = boundingSphere.distanceToPoint(cameraPos);

            if (distance > 0) {
                this.camera.near = distance;
                this.camera.far = distance + boundingSphere.radius * 2;
                this.camera.updateProjectionMatrix();
            }

            prevCameraPos = cameraPos.clone();
        };
    }());

    Frame.prototype._animate = function () {
        var self = this,
            sorter = new BufferGeometrySorter(5);

        // Update near/far camera range
        (function animate() {
            self._updateCameraBounds();
            sorter.sort(self.points.attributes, self.controls.object.position);

            window.requestAnimationFrame(animate);
            self.controls.update();
        }());
    };

    return Frame;
}());
