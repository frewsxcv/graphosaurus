define(["../lib/trackball-controls/TrackballControls"], function (TrackballControls) {
    "use strict";

    var Frame = function (elem, graph) {
        var self = this;

        if (typeof elem === 'string') {
            elem = document.getElementById(elem);
        }

        var width = elem.scrollWidth;
        var height = elem.scrollHeight;
        var aspectRatio = width/height;
        self.projector = new THREE.Projector();

        //Used for transformations that are part of detecting which node was clickde
        self.localMatrix = new THREE.Matrix4();

        //Defines how close a click has to be to a node before the nodeClicked event is sent.
        window.CLICK_THRESHOLD = 0.001;

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

        // This eventListener detects when the graph is clicked and sends information
        // about which node was clicked to all relevant listeners
        window.addEventListener('click', function(event){
            var clickedParticle = self.getClickedParticle(event.clientX, event.clientY);
            if(clickedParticle){
                var event = new CustomEvent('nodeClicked', { 'detail': clickedParticle });
                document.dispatchEvent(event);
            }
        });
    };


    Frame.prototype.getClickedParticle = function(x, y){
        var clickDirectionVector = this.getClickDirectionVector(event.clientX, event.clientY);
        return this.intersectParticleSystem(clickDirectionVector.origin, clickDirectionVector.direction);
    };

    // Determines which node was clicked by finding a node vector that is similar
    // to the click vector
    Frame.prototype.intersectParticleSystem = function(origin, direction){
        this.localMatrix.getInverse(this.particleSystem.matrixWorld);
        origin.applyMatrix4(this.localMatrix);
        direction.transformDirection(this.localMatrix).normalize();

        var graphNodes = this.particleSystem.geometry.vertices;
        for(var i = 0; i < graphNodes.length; ++i){
            var node = graphNodes[i];
            var distance = this.distanceFromIntersection(origin, direction, node);
            if(distance < CLICK_THRESHOLD){
                return this.nodeStorage[i];
            }
        }
    };

    //This method transforms the click in 2D space into a vector in 3D space
    Frame.prototype.getClickDirectionVector = function(x, y) {
        var mouse = new THREE.Vector3((x / window.innerWidth ) * 2 - 1,
            - (y / window.innerHeight) * 2 + 1,
            0.5);
        var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        this.projector.unprojectVector(vector, this.camera);
        var origin = this.camera.position;
        var localOrigin = origin.clone();
        var direction = vector.sub(this.camera.position).normalize();
        var localDirection = direction.clone();
        return {
            origin: localOrigin,
            direction: localDirection
        };
    };

    Frame.prototype._initScene = function () {
        this.scene = new THREE.Scene();
    };

    //Finds the distance between two vectors
    Frame.prototype.distanceFromIntersection = function(origin, direction, position){
        var dot, intersect, distance;
        var v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
        v0.subVectors( position, origin );
        dot = v0.dot( direction );

        intersect = v1.addVectors( origin, v2.copy( direction ).multiplyScalar( dot ) );
        distance = position.distanceTo( intersect );

        return distance;
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
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        elem.appendChild(renderer.domElement);

        this.renderer = renderer;
    };

    Frame.prototype._initControls = function () {
        var self = this;
        var controls = new TrackballControls(this.camera);

        controls.addEventListener('change', function () {
            //console.log('rerendering');
            self.renderer.render(self.scene, self.camera);
        });

        this.controls = controls;
    };

    Frame.prototype._initNodes = function (nodes) {
        this.nodeStorage = nodes;
        var material = new THREE.ParticleSystemMaterial({
            size: 0.2,
            vertexColors: true,
        });
        this.particles = new THREE.Geometry();
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var vertex = node._pos.clone();
            var color = node._color.clone();

            this.particles.vertices.push(vertex);
            this.particles.colors.push(color);
        }
        this.particleSystem = new THREE.ParticleSystem(this.particles, material);
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
