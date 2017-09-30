/// <reference path="game.ts" />
/// <reference path="canvas.ts" />
/// <reference path="preset.ts" />
var game = new Game(10, 10);
var canvas = new Canvas();
var play = false;
var delay = 200;
/* responsive canvas */
window.onresize = function () {
    canvas.resize(game.rows, game.cols);
    canvas.Draw(game.alive, false);
};
/* ESC to cancel preset use */
document.onkeydown = function (e) {
    if (e.keyCode == 27) {
        canvas.preset = [];
    }
};
/* Gives Canvas the current mouse pos */
document.getElementById("mycanvas").onmousemove = function (e) {
    _redo(e);
};
document.getElementById("mycanvas").onmouseout = function (e) {
    _redo(e);
};
/* On Click toggle the state of the cell */
document.getElementById("mycanvas").onclick = function (e) {
    canvas.Draw(game.alive);
    canvas.toggleCell(e);
};
/* Starts Cycle */
document.getElementById("play_button").onclick = function () {
    play = !play;
    canvas.Running(play);
    if (play) {
        this.innerHTML = "Pause";
        Play();
    }
    else {
        this.innerHTML = "Play";
    }
};
document.getElementById("step_button").onclick = function () {
    if (!play) {
        Step();
    }
};
/*
### File ###
*/
/* Reset Board */
document.getElementById("new_button").onclick = function () {
    hideDD(); //Hide Dropdown because wrong default behavior
    newBoard();
};
/* Reset + add pseudorandom pattern */
document.getElementById("newr_button").onclick = function () {
    hideDD();
    newBoard();
    var temp = [];
    for (var i = 0; i < game.rows; i++) {
        for (var j = 0; j < game.cols; j++) {
            if (Math.random() * 100 > 50) {
                temp.push({ row: i, col: j });
            }
        }
    }
    game.setPattern(temp);
    game.Update();
};
/* Reset + add given Pattern */
document.getElementById("load_button").onclick = function () {
    hideDD();
    if (!newBoard()) {
        return;
    }
    var load = prompt("Paste in and click ok!");
    try {
        var arr = JSON.parse(load);
        game.setPattern(arr);
        game.Update(); //Updates game.alive without simulating new generation
        canvas.Draw(game.alive);
    }
    catch (_a) {
        alert("Seems like the data isn't complete.");
    }
};
/* Outputs the current Pattern */
document.getElementById("save_button").onclick = function () {
    hideDD();
    game.setPattern(canvas.Pattern()); //Add pending pattern to board
    game.Update();
    canvas.Draw(game.alive);
    prompt("Copy this text and share it/save it", JSON.stringify(game.alive));
};
/* Saves the canvas as image */
document.getElementById("img_button").onclick = function () {
    hideDD();
    var mycanvas = document.getElementById("mycanvas");
    var dataURL = mycanvas.toDataURL("image/png");
    var a = this;
    a.href = dataURL;
};
/*
### Settings ###
*/
document.getElementById("delay_input").onchange = function () {
    var e = this;
    delay = Number(e.value);
};
document.getElementById("cell_input").onchange = function () {
    var el = this;
    canvas.CellColor(el.value);
};
document.getElementById("bg_input").onchange = function () {
    var el = this;
    document.getElementById("mycanvas").style.backgroundColor = el.value;
};
/*
### Preset ###
*/
document.getElementById("preset").onclick = function (e) {
    hideDD();
    var el = e.target;
    if (el.className != "pre") {
        return; //Do nothing
    }
    for (var i = 0; i < presetJSON.length; i++) {
        if (presetJSON[i].name == el.innerText) {
            canvas.preset = presetJSON[i].alive; //give canvas the preset
            break;
        }
    }
};
/* main */
(function () {
    canvas.resize(game.rows, game.cols); //Trigger resize on start
    /* Create dynamic preview images + elements for presets */
    var preset = document.getElementById("preset");
    for (var i = 0; i < presetJSON.length; i++) {
        var id = presetJSON[i].name.replace(" ", "_"); //Id to address it later, underscores because IDs cant have whitespaces
        preset.insertAdjacentHTML("beforeend", "<li><a href='#' id=" + id + " class='pre'>" + presetJSON[i].name + "</a><canvas height='40px' width='40px'></canvas></li>");
        var c = document.getElementById(id).nextElementSibling; //Addressing canvas for preset
        var ctx = c.getContext("2d");
        var mul = Math.floor(Math.min(40 / presetJSON[i].rows, 40 / presetJSON[i].cols)); //40*40 canvas, looking up how many times preset fits into
        var off = [Math.floor((40 - mul * presetJSON[i].rows) / 2), Math.floor((40 - mul * presetJSON[i].cols) / 2)]; //Calculates the white space to center
        for (var j = 0; j < presetJSON[i].alive.length; j++) {
            ctx.fillRect(off[1] + presetJSON[i].alive[j].col * mul, off[0] + presetJSON[i].alive[j].row * mul, mul, mul);
        }
    }
    /* Adds events to each preset */
    var dd = document.getElementsByClassName("dd");
    for (var i = 0; i < dd.length; i++) {
        var el = dd[i];
        el.parentElement.addEventListener("mouseover", dropdownHover, false);
        el.parentElement.addEventListener("mouseout", dropdownLeave, false);
    }
})();
/* Dropdown Behavior
   Needed, because non default behavior */
function dropdownHover() {
    this.childNodes[2].style.display = "block";
}
function dropdownLeave() {
    this.childNodes[2].style.display = "none";
}
function hideDD() {
    var e = document.getElementsByClassName("dd");
    for (var i = 0; i < e.length; i++) {
        if (window.getComputedStyle(e[i], null).display == "block") {
            var ele = e[i];
            ele.style.display = "none"; //Hide
        }
    }
}
/* Some helper functions */
function newBoard() {
    if (play || game.alive.length > 0 || canvas.Pattern(false).length > 0) {
        if (!confirm("Discard pattern?")) {
            return false;
        }
    }
    var r = document.getElementById("row_input"); //Casting, so .value is available
    var c = document.getElementById("col_input");
    canvas.Pattern(); //Reset the current drawn pattern
    game = new Game(Number(r.value), Number(c.value)); //New Board
    canvas.resize(game.rows, game.cols); //Trigger resize because scaling
    play = false; //Reset Play Button, which implied the wrong state when New clicked while it is still playing
    canvas.Running(play);
    document.getElementById("play_button").innerText = "Play";
    return true;
}
function Step() {
    game.setPattern(canvas.Pattern()); //Add drawn pattern onto the board
    game.Next(); //Simulate one step
    canvas.Draw(game.alive); //Draw Board
}
function Play() {
    if (play) {
        Step();
        setTimeout(Play, delay); //Do again after delay
    }
}
function _redo(e) {
    canvas.Draw(game.alive); //Draws board
    canvas.setCursorPos(e); //Cursor position on hover
}
;
