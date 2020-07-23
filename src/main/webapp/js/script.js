var elem = document.getElementById('draw-animation');

var two = new Two({ fullscreen: true }).appendTo(elem);
var numberOfTubes = 2
var tubesArray = [];
var tubesMargin = 100;
var lineWidth = 0;
var colorsList = [
	'rgb(128,0,0)', 'rgb(170,110,40)', 'rgb(128,128,0)', 'rgb(0,128,128)', 'rgb(0,0,128)', 'rgb(0,0,0)',
	'rgb(230,25,75)', 'rgb(245,130,48)', 'rgb(225,225,25)', 'rgb(210,245,60)', 'rgb(60,180,75)',
	'rgb(70,240,240)', 'rgb(0,130,200)', 'rgb(145,30,180)', 'rgb(240,50,230)', 'rgb(128,128,128)',
	'rgb(250,190,212)', 'rgb(255,215,180)', 'rgb(255,250,200)', 'rgb(170,255,195)', 'rgb(220,190,255)',
	'rgb(255,255,255)', 'rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)', 'rgb(0,0,128)'
];
var sideMargin = 150;
var selectedColor = -1;

const modes = {
	EDIT: 0,
	PLAY: 1,
	SOLVE: 2
}
var mode = modes.EDIT;
var selectedTube = -1;
tubesBalls = [];
var ballDiameter = 40;
var indexOfMove = 0;
var id = -1;
var sol;

// creating the add_button group
var add_button_circle = two.makeCircle(0, 0, 30)
add_button_circle.fill = '#FF8000'
add_button_circle.stroke = "transperant"
var add_button_text = two.makeText("+U", 0, 5, 10)
add_button_text.size = 35
add_button_text.fill = "#FFFFFF"
var add_button = two.makeGroup(add_button_circle, add_button_text);
add_button.translation.set((two.width / 2) - 40, 50)

// creating the delete_button group
var delete_button_circle = two.makeCircle(0, 0, 30)
delete_button_circle.fill = '#007FFF'
delete_button_circle.stroke = "transperant"
var delete_button_text = two.makeText("-U", 0, 5, 10)
delete_button_text.size = 35
delete_button_text.fill = "#FFFFFF"
var delete_button = two.makeGroup(delete_button_circle, delete_button_text);
delete_button.translation.set((two.width / 2) + 40, 50)


// making tubes
tube_height = ballDiameter * 4;
tube_width = ballDiameter + 5;
var tube_handle1 = two.makeLine(0, 0, 0, tube_height);
var tube_handle2 = two.makeLine(tube_width, 0, tube_width, tube_height);
var tube_curve = two.makeCurve(0, tube_height, tube_width / 2, tube_height + 10, tube_width, tube_height, true);
tube_curve.noFill();
tubesArray.push(two.makeGroup(tube_handle1, tube_handle2, tube_curve));
tubesArray[0].translation.set(0, 0);
tubesArray[0].stroke = "#000000";
// cloning tube
tubesArray.push(tubesArray[0].clone());
two.add(tubesArray[1])
tubesArray[1].translation.set(tubesMargin, 0);
updateTubesPositions();
tubesBalls.push([]);
tubesBalls.push([]);



// color paletter drawer
colorBoxes = two.makeGroup();
var colorBoxMargin = 100;

for (var i = 0; i < colorsList.length; i++) {
	var colorBox = two.makeRectangle(25, colorBoxMargin + 10 + i * 20, sideMargin, 20);
	colorBoxes.add(colorBox);
	colorBox.fill = colorsList[i];
}
selectedColor = 0;
openDrawer(0);

// MODES drawer
mode1rect = two.makeRoundedRectangle(two.width - sideMargin + 200, 2 * tubesMargin, sideMargin * 2, 50, 5);
mode1rect.fill = "#00D800";
mode1Text = two.makeText("Edit", two.width - sideMargin + 100, 2 * tubesMargin + 2, 10);
mode1Text.size = 30;
mode1Text.family = "consolas";
mode1Text.fill = "#FFFFFF";
var mode1 = two.makeGroup(mode1rect, mode1Text);

mode2rect = two.makeRoundedRectangle(two.width - sideMargin + 200, 2 * tubesMargin + 50, sideMargin * 2, 50, 5);
mode2rect.fill = "#808080";
mode2Text = two.makeText("Play", two.width - sideMargin + 100, 2 * tubesMargin + 52, 10);
mode2Text.size = 30;
mode2Text.family = "consolas";
mode2Text.fill = "#FFFFFF";
var mode2 = two.makeGroup(mode2rect, mode2Text);


mode3rect = two.makeRoundedRectangle(two.width - sideMargin + 200, 2 * tubesMargin + 100, sideMargin * 2, 50, 5);
mode3rect.fill = "#808080";
mode3Text = two.makeText("SOLVE", two.width - sideMargin + 100, 2 * tubesMargin + 102, 10);
mode3Text.size = 30;
mode3Text.family = "consolas";
mode3Text.fill = "#FFFFFF";
var mode3 = two.makeGroup(mode3rect, mode3Text);

two.update();

/****************************************************** Listeners ************************************************************** */
function updateBallsPositions() {
	for (var i = 0; i < tubesBalls.length; i++) {
		var arr = tubesBalls[i].slice();
		tubesBalls[i] = [];
		for (var j = 0; j < arr.length; j++) {
			arr[j].remove();
			rec = tubesArray[i].getBoundingClientRect();
			ballDiameter = rec.width / 2 - 2;
			ball = two.makeCircle(rec.left + rec.width / 2, rec.top - rec.width / 2, ballDiameter);
			ball.fill = arr[j].fill;
			tubesBalls[i].push(ball);
			ball.translation.set(
				ball.translation.x,
				ball.translation.y + tube_height + 5 - ((tubesBalls[i].length - 1) * 2 * ballDiameter
				));
		}
	}
}

function updateTubesPositions() {
	if (tubesArray.length <= 4) {
		var grp = two.makeGroup(tubesArray[0], tubesArray[1])
		for (var i = 2; i < tubesArray.length; i++) {
			grp.add(tubesArray[i]);
		}
		var pos = two.width / 2 - (tubesArray.length * (tube_width + tubesMargin) - 2 * tubesMargin) / 2;
		grp.translation.set(pos, two.height / 4);
	}
	else {
		var mid = parseInt(Math.ceil(tubesArray.length / 2));
		var grp = two.makeGroup(tubesArray[0], tubesArray[1])
		for (var i = 2; i < mid; i++) {
			grp.add(tubesArray[i]);
			tubesArray[i].translation.set((i) * 100, 0);
		}
		lineWidth = grp.getBoundingClientRect().width
		var pos = two.width / 2 - lineWidth / 2;
		grp.translation.set(pos, two.height / 4);


		grp = two.makeGroup()
		for (var i = mid; i < tubesArray.length; i++) {
			grp.add(tubesArray[i]);
			tubesArray[i].translation.set((i - mid) * 100, 0);
		}

		lineWidth = grp.getBoundingClientRect().width
		var pos = two.width / 2 - grp.getBoundingClientRect().width / 2;
		grp.translation.set(pos, two.height * 2 / 3);
	}
}

add_button._renderer.elem.addEventListener("click", function() {
	if (mode != modes.EDIT) {
		return;
	}
	if (lineWidth + 100 >= two.width - 2 * sideMargin) {
		return;
	}
	// when add button is clicked
	tubesArray.push(tubesArray[0].clone());
	two.add(tubesArray[tubesArray.length - 1]);
	tubesArray[tubesArray.length - 1].translation.set(tubesMargin + tubesArray[tubesArray.length - 2].translation.x, tubesArray[tubesArray.length - 2].translation.y)
	tubesArray[tubesArray.length - 1].stroke = "#000000"
	numberOfTubes++;
	updateTubesPositions();
	tubesBalls.push([]);
	updateBallsPositions();
	two.update();

}, false);

delete_button._renderer.elem.addEventListener("click", function() {
	if (mode != modes.EDIT) {
		return;
	}
	// when add button is clicked
	if (numberOfTubes < 3) {
		return;
	}
	tubesArray[tubesArray.length - 1].remove();
	tubesArray.pop();
	numberOfTubes--;
	updateTubesPositions();
	for (var i = 0; i < tubesBalls[tubesBalls.length - 1].length; i++) {
		tubesBalls[tubesBalls.length - 1][i].remove();
	}
	tubesBalls.pop();
	updateBallsPositions();
	two.update();
}, false);



function openDrawer(x) {
	if (colorBoxes._children[x].translation.x < 50) {
		colorBoxes._children[x].translation.set
			(colorBoxes._children[x].translation.x + 3, colorBoxes._children[x].translation.y);
		two.update();
		window.requestAnimationFrame(function() {
			openDrawer(selectedColor);
		});
	}
}


function closeDrawer(x) {

	if (colorBoxes._children[x].translation.x > 25) {
		colorBoxes._children[x].translation.set
			(colorBoxes._children[x].translation.x - 3, colorBoxes._children[x].translation.y);
		two.update();
		window.requestAnimationFrame(function() {
			closeDrawer(x);
		});
	}
}


colorBoxes._renderer.elem.addEventListener("click", function(event) {
	if (mode != modes.EDIT) {
		return;
	}
	var copy = selectedColor;
	if (selectedColor != -1) {
		window.requestAnimationFrame(function() {
			closeDrawer(copy);
		});
	}
	selectedColor = Math.ceil((event.layerY - 100) / 20) - 1;
	window.requestAnimationFrame(function() {
		openDrawer(selectedColor);
	});
}, false);


elem.addEventListener('click', function(e) {
	var rect = elem.getBoundingClientRect();  // get element's abs. position
	var x = e.clientX - rect.left;              // get mouse x and adjust for el.
	var y = e.clientY - rect.top;


	for (var i = 0; i < tubesArray.length; i++) {
		var rect = tubesArray[i].getBoundingClientRect();
		if (x < rect.right && x > rect.left && y < rect.bottom && y > rect.top) {
			clickTubes(i);
		}
	}
}, false);


function moveBallVerticalDown(ball, initiateposition, position) {
	if (ball.translation.y - initiateposition < tube_height + 5 - (position * 2 * ballDiameter)) {
		ball.translation.set(ball.translation.x, ball.translation.y + 7)
		two.update();
		requestAnimationFrame(function() {
			moveBallVerticalDown(ball, initiateposition, position);
		});
	}
}

function getBallInto(tubeIndex, color) {
	if (tubesBalls[tubeIndex].length >= 4) {
		return;
	}
	rec = tubesArray[tubeIndex].getBoundingClientRect();
	ballDiameter = rec.width / 2 - 2;
	ball = two.makeCircle(rec.left + rec.width / 2, rec.top - rec.width / 2, ballDiameter);
	ball.fill = color;
	tubesBalls[tubeIndex].push(ball);
	requestAnimationFrame(function() {
		moveBallVerticalDown(ball, ball.translation.y, tubesBalls[tubeIndex].length - 1);
	});
	two.update();
}


function moveBallToPoint(ball, x, y, j) {
	if (Math.abs(ball.translation.x - x) > 7 || Math.abs(ball.translation.y - y) > 7) {
		if (Math.abs(ball.translation.x - x) > 7)
			ball.translation.x = ball.translation.x - (Math.sign(ball.translation.x - x) * 7)
		if (Math.abs(ball.translation.y - y) > 7)
			ball.translation.y = ball.translation.y - (Math.sign(ball.translation.y - y) * 7)
		two.update();
		requestAnimationFrame(function() {
			moveBallToPoint(ball, x, y, j);
		});
	}
	else {
		ball.translation.x = x;
		ball.translation.y = y;
		moveBallVerticalDown(ball, ball.translation.y, tubesBalls[j].length - 1);
	}
}

function moveBallVerticalUp(ball, initiateposition, position, j) {
	if (-1 * (ball.translation.y - initiateposition) < ((4 - position) * 2 * ballDiameter)) {
		ball.translation.set(ball.translation.x, ball.translation.y - 7)
		two.update();
		requestAnimationFrame(function() {
			moveBallVerticalUp(ball, initiateposition, position, j);
		});
	} else {
		moveBallToPoint(ball, tubesArray[j].getBoundingClientRect().left + ballDiameter + 2
			, tubesArray[j].getBoundingClientRect().top - ballDiameter, j);
	}
}

function canMove(i, j) {
	var x = $.ajax({
		url: '/CheckGame',
		method: 'POST',
		data: { game: "canMove:" + i + "," + j },
		async: false,
		error: function(jqXHR, exception) {
			console.log('Error occured!!');
		}
	});
	console.log("x is " + x.responseText);
	// TODO edit after debug
	//return true;
	return x.responseText == '0';

}
function moveBall(i, j) {
	var ball = tubesBalls[i].pop();
	tubesBalls[j].push(ball);
	moveBallVerticalUp(ball, ball.translation.y, tubesBalls[i].length, j);
}

function clickTubes(index) {
	if (mode == modes.EDIT) {
		if (selectedColor == -1) {
			return;
		}
		if (selectedTube != -1) {
			tubesArray[selectedTube].stroke = "#000000";
		}
		selectedTube = index;
		tubesArray[index].stroke = "#FF0000";
		two.update();
		getBallInto(index, colorsList[selectedColor]);
	}
	else if (mode == modes.PLAY) {
		if (selectedTube == -1) {
			selectedTube = index;
			tubesArray[index].stroke = "#FF0000";
		}
		else {
			tubesArray[selectedTube].stroke = "#000000";
			if (canMove(selectedTube, index)) {
				moveBall(selectedTube, index);
			}
			selectedTube = -1;
		}
		two.update();
	}
}


function checkCurrentGame() {
	var game = tubesArray.length + "\n";
	for (var i = 0; i < tubesBalls.length; i++) {
		for (var j = 0; j < tubesBalls[i].length; j++) {
			var colorindex = colorsList.findIndex(element => element == tubesBalls[i][j].fill);
			game = game.concat(String.fromCharCode(65 + colorindex));
		}
		game += "\n";
	}

	var x = $.ajax({
		url: '/CheckGame',
		method: 'POST',
		data: { game: game },
		async: false,
		error: function(jqXHR, exception) {
			console.log('Error occured!!');
		}
	});
	console.log("x is " + x.responseText);
	return x.responseText == '0';
}


mode1._renderer.elem.addEventListener('click', function() {
	// convert ot edit mode
	mode1rect.fill = "#00D800";
	mode2rect.fill = "#808080";
	mode3rect.fill = "#808080";
	openDrawer(0);
	selectedColor = 0;
	mode = modes.EDIT;
	two.update();
}, false);
mode2._renderer.elem.addEventListener('click', function() {
	// convert ot Play mode
	if (!checkCurrentGame()) { // check game
		return;
	}
	mode2rect.fill = "#00D800";
	mode1rect.fill = "#808080";
	mode3rect.fill = "#808080";
	if (selectedTube != -1) {
		tubesArray[selectedTube].stroke = "#000000";
		selectedTube = -1;
	}
	if (selectedColor != -1) {
		closeDrawer(selectedColor);
		selectedColor = -1;
	}
	mode = modes.PLAY;
	two.update();
}, false);



function askingToSolve() {
	var x = $.ajax({
		url: '/CheckGame',
		method: 'POST',
		data: { game: "" },
		async: false,
		error: function(jqXHR, exception) {
			console.log('Error occured!!');
		}
	});
	if(x.responseText ==""){
		// already solved
		return;
	}
	sol = x.responseText;
	sol = sol.substr(1, sol.length - 2);
	sol = sol.split(", ");
	id = setInterval(function(){
		var move = sol[indexOfMove].split("=");
		moveBall(parseInt(move[0]), parseInt(move[1]));
		indexOfMove++;
		if(indexOfMove >= sol.length){
			clearInterval(id);
		}
	},5000);
	
	return;

}

mode3._renderer.elem.addEventListener('click', function() {
	// convert to solve mode
	if (!checkCurrentGame()) { // check game
		return;
	}
	mode3rect.fill = "#00D800";
	mode2rect.fill = "#808080";
	mode1rect.fill = "#808080";
	if (selectedTube != -1) {
		tubesArray[selectedTube].stroke = "#000000";
		selectedTube = -1;
	}
	if (selectedColor != -1) {
		closeDrawer(selectedColor);
		selectedColor = -1;
	}
	mode = modes.SOLVE;
	two.update();
	askingToSolve();

}, false);