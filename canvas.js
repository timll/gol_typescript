/// <reference path="interface.ts" />
var Canvas = /** @class */ (function () {
    /** Initialize canvas
     */
    function Canvas() {
        this.preset = [];
        this.running = false;
        this.pattern = [];
        this.multiplier = 0;
        this.canvas = document.getElementById("mycanvas");
        this.ctx = this.canvas.getContext("2d");
        this.wrapper = document.getElementById("cwrapper");
        this.color = "black";
    }
    /** Returns pattern and if wanted resets its
     * @param {boolean} del Optional: Reset?
     */
    Canvas.prototype.Pattern = function (del) {
        if (del === void 0) { del = true; }
        var temp = this.pattern.slice(0);
        if (del) {
            this.pattern = [];
        }
        return temp;
    };
    /** Sets the current state of the site, disables pattern edit
     * @param {boolean} state state
     */
    Canvas.prototype.Running = function (state) {
        this.running = state;
        if (this.running) {
            this.canvas.style.cursor = "wait";
        }
        else {
            this.canvas.style.cursor = "pointer";
        }
    };
    /** Sets/Gets the cell color
     * @param {string} col Optional: Color
     * @return {any} col
     */
    Canvas.prototype.CellColor = function (col) {
        if (typeof col == "string" && col.length > 0) {
            this.color = col;
        }
        this.ctx.fillStyle = this.color;
        return this.ctx.fillStyle;
    };
    /** Resizes the canvas based on the board
     * @param {number} rows Width of the board
     * @param {number} cols Height of the board
     */
    Canvas.prototype.resize = function (rows, cols) {
        if (rows < window.innerHeight - 50 && cols < window.innerWidth) {
            this.multiplier = Math.floor(Math.min((window.innerHeight - 50) / rows, window.innerWidth / cols));
        }
        else {
            this.multiplier = 1; //1 Cell = 1 Pixel
        }
        this.canvas.height = rows * this.multiplier;
        this.canvas.width = cols * this.multiplier;
        this.CellColor();
        this.Draw(this.pattern);
    };
    /** Returns the dimensions of the canvas
     * @return {number[]}
     */
    Canvas.prototype.getSize = function () {
        return [this.canvas.width, this.canvas.height];
    };
    /** Gives the user feedback based on cursor hover
     * @param {number} e Event
     */
    Canvas.prototype.setCursorPos = function (e) {
        if (this.running) {
            return;
        }
        var cell = this.MouseToCell(e);
        this.Draw(this.pattern, false);
        if (cell == null) {
            return;
        }
        if (this.preset.length == 0) {
            this.ctx.fillRect(cell.col * this.multiplier, cell.row * this.multiplier, this.multiplier, this.multiplier);
        }
        else {
            console.log("h");
            for (var _i = 0, _a = this.preset; _i < _a.length; _i++) {
                var p = _a[_i];
                if ((p.row + cell.row) * this.multiplier < this.canvas.height &&
                    (p.col + cell.col) * this.multiplier < this.canvas.width) {
                    this.Draw([{ row: p.row + cell.row, col: p.col + cell.col }], false);
                }
            }
            this.Draw(this.pattern, false);
        }
    };
    /** Changes the cell state where the user clicked
     * @param {any} e Event
     */
    Canvas.prototype.toggleCell = function (e) {
        if (this.running) {
            return;
        }
        var cell = this.MouseToCell(e);
        if (cell == null) {
            this.Draw(this.pattern, false);
            return;
        }
        if (this.preset.length == 0) {
            var len = this.pattern.length;
            var res = -1;
            while (len--) {
                if (this.pattern[len].row === cell.row && this.pattern[len].col === cell.col) {
                    res = len;
                    break;
                }
            }
            if (res !== -1) {
                this.pattern.splice(len, 1);
            }
            else {
                this.pattern.push(cell);
            }
        }
        else {
            for (var _i = 0, _a = this.preset; _i < _a.length; _i++) {
                var p = _a[_i];
                var com = { row: p.row + cell.row, col: p.col + cell.col };
                var len = this.pattern.length;
                var res = -1;
                while (len--) {
                    if (this.pattern[len].row === com.row && this.pattern[len].col === com.col) {
                        res = len;
                        break;
                    }
                }
                if (res == -1) {
                    this.pattern.push(com);
                }
            }
            this.preset = [];
        }
        this.Draw(this.pattern, false);
    };
    /** Returns the Cell on mouse position
     * @param {any} e Event
     */
    Canvas.prototype.MouseToCell = function (e) {
        var x = e.pageX;
        var y = e.pageY;
        var rect = this.canvas.getBoundingClientRect();
        if (rect.left <= x && rect.right >= x && rect.top <= y && rect.bottom >= y) {
            var rel = [Math.floor((x - rect.left) / this.multiplier),
                Math.floor((y - rect.top) / this.multiplier)];
            return { row: rel[1], col: rel[0] };
        }
    };
    /** draws squares at given positions
     * @param {IPos[]} arr Positions
     */
    Canvas.prototype.Draw = function (arr, clear) {
        if (clear === void 0) { clear = true; }
        if (clear) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var e = arr_1[_i];
            this.ctx.fillRect(e.col * this.multiplier, e.row * this.multiplier, this.multiplier, this.multiplier);
        }
    };
    return Canvas;
}());
