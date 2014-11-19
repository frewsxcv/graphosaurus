# Graphosaurus

[![Build Status](https://travis-ci.org/frewsxcv/graphosaurus.svg)](https://travis-ci.org/frewsxcv/graphosaurus)

A three-dimensional static graph viewer.

## Twenty second tutorial

```html
<html>
  <head>
    <style>
    #graph {
      width: 500px;
      height: 500px;
      border: 1px solid grey;
    }
    </style>
  </head>
  <body>
    <div id="graph"></div>

    <script src="graphosaurus.min.js"></script>
    <script>
      // JavaScript will go here
    </script>
  </body>
</html>
```

If you open this up in your web browser, you'll see something that looks like this:

![](https://i.imgur.com/LnAvptu.png)

Look at that amazing square! Now lets create a graph, a couple nodes, and an edge between the nodes:

```js
var graph = G.graph()

// Create a red node with cartesian coordinates x=0, y=0, z=0
var redNode = G.node([0, 0, 0], {color: "red"});
graph.addNode(redNode);

// You can also use the addTo method to add to the graph
var greenNode = G.node([1, 1, 1], {color: "green"}).addTo(graph);

var edge = G.edge([redNode, greenNode], {color: "blue"});
graph.addEdge(edge);  // or edge.addTo(graph)

// Render the graph in the HTML element with id='graph'
graph.renderIn("graph");
```

After substituting this JavaScript into the `<script>` block, you should see this:

![](https://i.imgur.com/0ylXUd6.gif)

While this is an very basic example, I hope I've demonstrated how simple it is to create graphs with Graphosaurus.

## Build

1. Run `git clone https://github.com/frewsxcv/graphosaurus.git` to clone this repository
1. Install [node](http://nodejs.org/), [npm](https://www.npmjs.org/), and [grunt-cli](https://www.npmjs.org/package/grunt-cli)
1. Run `npm install` to install all the build requirements
1. Run `grunt` to build Graphosaurus. The resulting compiled JavaScript will be in `dist/` and the docs will be in `doc/`

## Mascot

![gryposaurus](https://upload.wikimedia.org/wikipedia/commons/7/70/Gryposaurus-notabilis_jconway.png)

[John Conway](https://en.wikipedia.org/wiki/User:John.Conway)'s illustration of our glorious leader, the ~~[gryposaurus](https://en.wikipedia.org/wiki/gryposaurus)~~ graphosaurus.

## Copyright

* [`three.js`](https://github.com/mrdoob/three.js/)
 * Used because writing WebGL is time consuming
 * [MIT](https://github.com/mrdoob/three.js/blob/master/LICENSE)

* [`TrackballControls.js`](https://github.com/mrdoob/three.js/blob/master/examples/js/controls/TrackballControls.js)
 * Used for graph controls
 * [MIT](https://github.com/mrdoob/three.js/blob/master/LICENSE)

* `Graphosaurus`
 * Everything else in this repository
 * [MPL v2](https://github.com/frewsxcv/graphosaurus/blob/master/LICENSE.md)
