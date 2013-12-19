define(function () {
    "use strict";

    var Edge = function (nodes, opts) {
        this.setNodes(nodes);
        this._initOpts(opts);
    };

    Edge.prototype._initOpts = function (options) {
        options = options || {};

        var color = options.hasOwnProperty("color") ? options.color : "white";
        this._color = new THREE.Color(color);

        return this;
    };

    Edge.prototype.setNodes = function (nodes) {
        this._nodes = nodes;
        return this;
    };

    Edge.prototype.getNodes = function () {
        return this._nodes;
    };

    Edge.prototype.setColor = function (color) {
        if (color) {
            this._color.set(color);
        }
        return this;
    };

    Edge.prototype.getColor = function () {
        return this._color.getHexString();
    };

    Edge.prototype.addTo = function (graph) {
        graph.addEdge(this);
        return this;
    };

    return Edge;
});
