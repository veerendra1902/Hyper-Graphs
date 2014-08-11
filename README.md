Hyper-Graphs
=======

Javascript library for visualization of Hyper Graphs with node draggable property.

The Hyper-V provides a particular style of visualization for hypergraphs.
A hypergraph differs from a normal graph in that each edge of a hypergraph may connect more than
two nodes together (in a normal graph, an edge may only connect two nodes), which can present some difficulties for drawing the edges of a hypergraph.

Bezier curves are used for creation of hyperEdges. Nodes and edgeNodes are draggable so user can place nodes where ever desired.

## Input Format

The nodes are divided into two sets - normal nodes and edge-nodes - and all of the edges must
connect a normal node to an edge-node.
Input is taken as a object of three fields i.e. Nodes,edgeNodes and edges.
Nodes will be list of normal nodes, edgeNodes will be list of edgenodes and edges will be list of edges.
Currently input is taken in json file format. but we can input data according to requirement of project.

## Note

Currently it works in mozzila as other browsers do not support importing of json file directly.User can input data in various ways according to need and can run on any browser.
	
