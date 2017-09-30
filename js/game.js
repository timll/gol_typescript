/// <reference path="interface.ts" />
var Game = /** @class */ (function () {
    /** Initialize board size
     * @param {number} rows Width of the board
     * @param {number} cols Height of the board
     */
    function Game(rows, cols) {
        this.generation = 0;
        this.aliveCount = 0;
        this.alive = [];
        this.board = []; // 2D Boolean Array, initialized in construtor
        this.tba = []; // To be alive
        this.tbd = []; // To be dead
        this.rows = rows;
        this.cols = cols;
        for (var i = 0; i < rows; i++) {
            this.board[i] = [];
            for (var j = 0; j < cols; j++) {
                this.board[i][j] = false;
            }
        }
    }
    /** Sets the start pattern
     * @param {IPos[]} pattern Positions of set fields
     * @param {boolean} state Alive or Dead
     */
    Game.prototype.setPattern = function (pattern, state) {
        if (state === void 0) { state = true; }
        for (var _i = 0, pattern_1 = pattern; _i < pattern_1.length; _i++) {
            var p = pattern_1[_i];
            this.board[p.row][p.col] = state;
        }
    };
    /** Generates the next generation
     * @param {number} rows Width of the board
     * @param {number} cols Height of the board
     */
    Game.prototype.Next = function () {
        this.alive = []; // Reset alives
        this.tbd = []; // Reset to be alive/dead beforehand
        this.tba = [];
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                var n = this.Neighbors(i, j); // get Neighbors of coordinate
                if (this.board[i][j]) {
                    if (n < 2 || n > 3) {
                        this.tbd.push({ row: i, col: j }); // To be dead
                    }
                    else {
                        this.alive.push({ row: i, col: j }); // Onto alives
                    }
                }
                else {
                    if (n === 3) {
                        this.tba.push({ row: i, col: j }); // To be alive
                        this.alive.push({ row: i, col: j }); // Onto alives
                    }
                }
            }
        }
        for (var _i = 0, _a = this.tbd; _i < _a.length; _i++) {
            var p = _a[_i];
            this.board[p.row][p.col] = false;
        }
        for (var _b = 0, _c = this.tba; _b < _c.length; _b++) {
            var p = _c[_b];
            this.board[p.row][p.col] = true;
        }
        this.generation++;
        this.aliveCount = this.alive.length;
    };
    /** Updates alive without generating a new generation
     */
    Game.prototype.Update = function () {
        this.alive = [];
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                if (this.board[i][j]) {
                    this.alive.push({ row: i, col: j });
                }
            }
        }
    };
    /** Returns the count of alive neighbors
     * @param {number} num Coordinate to increase
     * @return {number}
     */
    Game.prototype.Neighbors = function (r, c) {
        var n = 0;
        if (this.board[this.dec(r, this.rows)][this.dec(c, this.cols)]) {
            n++;
        }
        if (this.board[this.dec(r, this.rows)][c]) {
            n++;
        }
        if (this.board[this.dec(r, this.rows)][this.inc(c, this.cols)]) {
            n++;
        }
        if (this.board[r][this.dec(c, this.cols)]) {
            n++;
        }
        if (this.board[r][this.inc(c, this.cols)]) {
            n++;
        }
        if (this.board[this.inc(r, this.rows)][this.dec(c, this.cols)]) {
            n++;
        }
        if (this.board[this.inc(r, this.rows)][c]) {
            n++;
        }
        if (this.board[this.inc(r, this.rows)][this.inc(c, this.cols)]) {
            n++;
        }
        return n;
    };
    /** Handles the edge cases where position is at the end of the board
     * @param {number} num Coordinate to increase
     * @param {number} max Maximum
     * @return {number}
     */
    Game.prototype.inc = function (num, max) {
        if (num === max - 1) {
            return 0; // Return beginning
        }
        return ++num; // Return increased number
    };
    /** Handles the edge cases where position is at the beginning of the board
     * @param {number} num Coordinate to decrease
     * @param {number} max Maximum
     * @return {number}
     */
    Game.prototype.dec = function (num, max) {
        if (num === 0) {
            return max - 1; // Return end
        }
        return --num; // Return decreased number
    };
    return Game;
}());
