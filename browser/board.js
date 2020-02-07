// Necessary Additions, Refer to files that will be used
const Node = require("./node");
const launchAnimations = require("./animations/launchAnimations");
const launchInstantAnimations = require("./animations/launchInstantAnimations");
const mazeGenerationAnimations = require("./animations/mazeGenerationAnimations");
const weightedSearchAlgorithm = require("./pathfindingAlgorithms/weightedSearchAlgorithm");
const unweightedSearchAlgorithm = require("./pathfindingAlgorithms/unweightedSearchAlgorithm");
const recursiveDivisionMaze = require("./mazeAlgorithms/recursiveDivisionMaze");
const otherMaze = require("./mazeAlgorithms/otherMaze");
const otherOtherMaze = require("./mazeAlgorithms/otherOtherMaze");
const astar = require("./pathfindingAlgorithms/astar");
const stairDemonstration = require("./mazeAlgorithms/stairDemonstration");
const weightsDemonstration = require("./mazeAlgorithms/weightsDemonstration");
const simpleDemonstration = require("./mazeAlgorithms/simpleDemonstration");
const bidirectional = require("./pathfindingAlgorithms/bidirectional");
const getDistance = require("./getDistance");

//Necessary Additions, ERach individual element's contri yet to be figured out.
function Board(height, width) {
  this.height = height;
  this.width = width;
  this.start = null;
  this.target = null;
  this.object = null;
    // only Equated to 1.currentId 2. ObjectNodeId which id string "x-y".
  this.boardArray = [];
  this.nodes = {};
    // Empty Object, relating string to nodes.
    //new Node(newNodeId, newNodeClass);
    //this.nodes[`${newNodeId}`] = newNode;
    // Relates "x-y" to Board[x][y], and maintain list of nodes on which we have to operate after a while.
  this.nodesToAnimate = [];
  this.objectNodesToAnimate = [];
  this.shortestPathNodesToAnimate = [];
  this.objectShortestPathNodesToAnimate = [];
  this.wallsToAnimate = [];
  this.mouseDown = false;
  this.pressedNodeStatus = "normal";
  this.previouslyPressedNodeStatus = null;
  this.previouslySwitchedNode = null;
  this.previouslySwitchedNodeWeight = 0;
  this.keyDown = false;
  this.algoDone = false;
  this.currentAlgorithm = null;
  this.currentHeuristic = null;
  this.numberOfObjects = 0;
    //  Only on ewhen we add a Bomb. Not using it for now.
  this.isObject = false;
  this.buttonsOn = false;
  this.speed = "fast";
}
// Understood
Board.prototype.initialise = function() {
  this.createGrid();
  this.addEventListeners();
  this.toggleTutorialButtons();
};
//Basic Table Creation with HTML + Setting start and target node.
Board.prototype.createGrid = function() {
  let tableHTML = "";
  for (let r = 0; r < this.height; r++) {
    let currentArrayRow = [];
    let currentHTMLRow = `<tr id="row ${r}">`;
    for (let c = 0; c < this.width; c++) {
      let newNodeId = `${r}-${c}`, newNodeClass, newNode;
      // x-y is out node. (h/2)-(w/4) is start, (h/2)-(3w/4) is target initially.
      if (r === Math.floor(this.height / 2) && c === Math.floor(this.width / 4)) {
        newNodeClass = "start";
        this.start = `${newNodeId}`;
      } else if (r === Math.floor(this.height / 2) && c === Math.floor(3 * this.width / 4)) {
        newNodeClass = "target";
        this.target = `${newNodeId}`;
      } else {
        newNodeClass = "unvisited";
      }
      newNode = new Node(newNodeId, newNodeClass);
      currentArrayRow.push(newNode);
      currentHTMLRow += `<td id="${newNodeId}" class="${newNodeClass}"></td>`;
      this.nodes[`${newNodeId}`] = newNode;
    }
    this.boardArray.push(currentArrayRow);
    tableHTML += `${currentHTMLRow}</tr>`;
  }
  let board = document.getElementById("board");
  board.innerHTML = tableHTML;
};

/////////////////////////////////////////////
// SIMPLE FUNCTIONALITIES AFTER THIS POINT //
/////////////////////////////////////////////

// Board.prototype.getNode() is a simple function to extract node coordinates used at various places.
Board.prototype.getNode = function(id) {
  // will convert "x-y" to board[x][y]
  let coordinates = id.split("-");
  let r = parseInt(coordinates[0]);
  let c = parseInt(coordinates[1]);
  return this.boardArray[r][c];
};

// Removing all the walls
Board.prototype.clearWalls = function() {
  this.clearPath("clickedButton");
  // Object.keys(object_name) returns all the attributes of object one by one in similar fashion to a loop.
  // .forEach(id => .... Now id will take values of all the attributes od "node" object
  // i.e. id, status, previousNode, etc. one by one.
  Object.keys(this.nodes).forEach(id => {
    let currentNode = this.nodes[id];
    let currentHTMLNode = document.getElementById(id);
    // Set all the walls and weighted nodes to unvisited.
    if (currentNode.status === "wall" || currentNode.weight === 15) {
      currentNode.status = "unvisited";
      currentNode.weight = 0;
      currentHTMLNode.className = "unvisited";
    }
  });
}

// To Clear Weights only
Board.prototype.clearWeights = function() {
  Object.keys(this.nodes).forEach(id => {
    let currentNode = this.nodes[id];
    let currentHTMLNode = document.getElementById(id);
    if (currentNode.weight === 15) {
      currentNode.status = "unvisited";
      currentNode.weight = 0;
      currentHTMLNode.className = "unvisited";
    }
  });
}

// Clearing Path. We have to reset some status.
Board.prototype.clearPath = function(clickedButton) {
  if (clickedButton) {
    let start = this.nodes[this.start];
    let target = this.nodes[this.target];
    let object = this.numberOfObjects ? this.nodes[this.object] : null;
      // object will be null as -> no_of_obj is 0 as -> we are not using bombs.
    start.status = "start";
    document.getElementById(start.id).className = "start";
    target.status = "target";
    document.getElementById(target.id).className = "target";
    if (object) {
      object.status = "object";
      document.getElementById(object.id).className = "object";
      // If any object remain, except for path, we should maintain them. In this case there will not be any.
      // (because no bomb implementation for now)
    }
  }


//////////////////////////
// Board initialisation //
//////////////////////////

let navbarHeight = $("#navbarDiv").height();
let textHeight = $("#mainText").height() + $("#algorithmDescriptor").height();
let height = Math.floor(($(document).height() - navbarHeight - textHeight) / 28);
let width = Math.floor($(document).width() / 25);
let newBoard = new Board(height, width)
newBoard.initialise();

// For weights
window.onkeydown = (e) => {
  newBoard.keyDown = e.keyCode;
}

window.onkeyup = (e) => {
  newBoard.keyDown = false;
}



