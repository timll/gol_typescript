/// <reference path="game.ts" />
/// <reference path="canvas.ts" />
/// <reference path="preset.ts" />

let game = new Game(10, 10);
let canvas = new Canvas();
let play: boolean = false;
let delay: number = 200;

/* responsive canvas */
window.onresize = function() {
    canvas.resize(game.rows, game.cols);
    canvas.Draw(game.alive, false);
};

/* ESC to cancel preset use */
document.onkeydown = function(e) {
    if (e.keyCode == 27) { //ESC
        canvas.preset = [];
    }
};
/* Gives Canvas the current mouse pos */
document.getElementById("mycanvas").onmousemove = function(e) {
    _redo(e);
};

document.getElementById("mycanvas").onmouseout = function(e) {
    _redo(e);
};

/* On Click toggle the state of the cell */
document.getElementById("mycanvas").onclick = function(e) {
    canvas.Draw(game.alive);
    canvas.toggleCell(e);
};

/* Starts Cycle */
document.getElementById("play_button").onclick = function() {
    play = !play;
    
    canvas.Running(play);
    if (play) {
        this.innerHTML = "Pause";
        Play();
    } else {
        this.innerHTML = "Play";
    }
};
document.getElementById("step_button").onclick = function() {
    if(!play) {
        Step();
    }
};

/*
### File ###
*/
/* Reset Board */
document.getElementById("new_button").onclick = function() {
    hideDD(); //Hide Dropdown because wrong default behavior
    newBoard();
};

/* Reset + add pseudorandom pattern */
document.getElementById("newr_button").onclick = function() {
    hideDD();
    newBoard();
    let temp: IPos[] = [];
    for (let i = 0; i < game.rows; i++) {
        for (let j = 0; j < game.cols; j++) {
            if (Math.random() * 100 > 50) {
                temp.push( { row: i, col: j });
            }
        }
    }
    game.setPattern(temp);
    game.Update();
};

/* Reset + add given Pattern */
document.getElementById("load_button").onclick = function() {
    hideDD();
    if(!newBoard()) {
        return;
    }

    let load = prompt("Paste in and click ok!");
    try {
        let arr = JSON.parse(load);
        game.setPattern(arr);
        game.Update(); //Updates game.alive without simulating new generation
        canvas.Draw(game.alive);
    } catch {
        alert("Seems like the data isn't complete.")
    }
};

/* Outputs the current Pattern */
document.getElementById("save_button").onclick = function() {
    hideDD();
    game.setPattern(canvas.Pattern()); //Add pending pattern to board
    game.Update();
    canvas.Draw(game.alive);
    prompt("Copy this text and share it/save it", JSON.stringify(game.alive));
};

/* Saves the canvas as image */
document.getElementById("img_button").onclick = function() {
    hideDD();
    let mycanvas = document.getElementById("mycanvas") as HTMLCanvasElement;
    var dataURL = mycanvas.toDataURL("image/png");
    let a = this as HTMLAnchorElement;
    a.href = dataURL;
};

/* 
### Settings ###
*/
document.getElementById("delay_input").onchange = function() {
    let e = this as HTMLInputElement;
    delay = Number(e.value);
};

document.getElementById("cell_input").onchange = function() {
    var el = this as HTMLInputElement;
    canvas.CellColor(el.value);
};

document.getElementById("bg_input").onchange = function() {
    var el = this as HTMLInputElement;
    document.getElementById("mycanvas").style.backgroundColor = el.value;
};

/* 
### Preset ###
*/
document.getElementById("preset").onclick = function(e) {
    hideDD();
    let el = e.target as HTMLElement;

    if(el.className != "pre") { //If not a preset
        return; //Do nothing
    }

    for (let i = 0; i < presetJSON.length; i++) { //For every preset in preset.json
        if (presetJSON[i].name == el.innerText) { //if name = clicked element
            canvas.preset = presetJSON[i].alive; //give canvas the preset
            break;
        }
    }
};


/* main */
(() => {
    canvas.resize(game.rows, game.cols); //Trigger resize on start



    /* Create dynamic preview images + elements for presets */
    let preset = document.getElementById("preset");
    for (let i = 0; i < presetJSON.length; i++) { //For each preset
        let id = presetJSON[i].name.replace(" ", "_"); //Id to address it later, underscores because IDs cant have whitespaces
        preset.insertAdjacentHTML("beforeend", "<li><a href='#' id=" + id + " class='pre'>" + presetJSON[i].name + "</a><canvas height='40px' width='40px'></canvas></li>");
        let c = document.getElementById(id).nextElementSibling as HTMLCanvasElement; //Addressing canvas for preset
        let ctx = c.getContext("2d");
        let mul = Math.floor(Math.min(40 / presetJSON[i].rows, 40 / presetJSON[i].cols)); //40*40 canvas, looking up how many times preset fits into
        let off = [Math.floor((40-mul*presetJSON[i].rows)/2), Math.floor((40-mul*presetJSON[i].cols)/2)]; //Calculates the white space to center
        for (let j = 0; j < presetJSON[i].alive.length; j++) { //For each cell in preset
            ctx.fillRect(off[1] + presetJSON[i].alive[j].col * mul, off[0] + presetJSON[i].alive[j].row * mul, mul, mul);
        }
    }

    /* Adds events to each preset */
    let dd = document.getElementsByClassName("dd");
    for (let i = 0; i < dd.length; i++) {
        let el = dd[i] as HTMLElement;
        el.parentElement.addEventListener("mouseover", dropdownHover, false);
        el.parentElement.addEventListener("mouseout", dropdownLeave, false)
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

function hideDD(): void { //Hides all Dropdowns
    let e = document.getElementsByClassName("dd");
    for (let i = 0; i < e.length; i++) { //For every dropdown
        if (window.getComputedStyle(e[i], null).display == "block") { //If visible
            let ele = e[i] as HTMLUListElement;
            ele.style.display = "none"; //Hide
        }
    }
}

/* Some helper functions */
function newBoard(): boolean {
    if (play || game.alive.length > 0 || canvas.Pattern(false).length > 0) { //Checks if anything is drawn
        if (!confirm("Discard pattern?")) { //Asks user if he wants to continue
            return false;
        }
    }

    let r = document.getElementById("row_input") as HTMLInputElement; //Casting, so .value is available
    let c = document.getElementById("col_input") as HTMLInputElement;
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
    if (play) { //If should play
        Step();
        setTimeout(Play, delay); //Do again after delay
    }
}

function _redo(e) {
    canvas.Draw(game.alive); //Draws board
    canvas.setCursorPos(e); //Cursor position on hover
};