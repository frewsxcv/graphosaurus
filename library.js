(function () {
    "use strict";

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
    window.Frame = Frame;

    Frame.prototype.addNode = function (x, y, z) {
        var geometry = new THREE.SphereGeometry(1);
        var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
        var cube = new THREE.Mesh(geometry, material);
        cube.position = {x: x, y: y, z: z};
        this.scene.add(cube);
    };

    Frame.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
}());
