var main = document.getElementById("main");
var width = main.offsetWidth;
var lightblack = "#4b383e";
var darkblack = "#2b151c";
var offwhite = "#f9f9e8";
var lightoffwhite = "#fafafa";
var yellow = "#f5d53f";
var green = "#698162";
var lightpurple = "#d7cee4";
var lightblue = "#c7d8dc";
var tan = "#dbd4cb";

function setup() {
 var canvas = createCanvas(width,400);
 canvas.parent("main");
 noLoop();
}

function draw() {
	drawCircle();
	drawBox();
}

function drawCircle() {
	fill(yellow);
	stroke(darkblack);
	strokeWeight(4);
	circle(width/4, height/4, 50);
}

function drawBox() {
	fill(offwhite);
	stroke(darkblack);
	strokeWeight(10);
	rectMode(CENTER);
	rect(width/2, height/2, 100, 100);
}
