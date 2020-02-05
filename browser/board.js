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
  this.boardArray = [];
  this.nodes = {};
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

// Board.prototype.getNode() is a simple function to extract node coordinates used at various places.
Board.prototype.getNode = function(id) {
  // will convert "x-y" to board[x][y]
  let coordinates = id.split("-");
  let r = parseInt(coordinates[0]);
  let c = parseInt(coordinates[1]);
  return this.boardArray[r][c];
};



