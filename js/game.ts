/// <reference path="interface.ts" />

class Game {
    public generation: number = 0;
    public aliveCount: number = 0;
    public alive: IPos[] = [];
    public rows: number;
    public cols: number; // Columns

    private board: any[] = []; // 2D Boolean Array, initialized in construtor
    private tba: IPos[] = []; // To be alive
    private tbd: IPos[] = []; // To be dead

    /** Initialize board size
     * @param {number} rows Width of the board
     * @param {number} cols Height of the board
     */
    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;

        for (let i: number = 0; i < rows; i++) {
            this.board[i] = [];
            for (let j: number = 0; j < cols; j++) {
                this.board[i][j] = false;
            }
        }
    }

    /** Sets the start pattern
     * @param {IPos[]} pattern Positions of set fields
     * @param {boolean} state Alive or Dead 
     */
    public setPattern(pattern: IPos[], state: boolean = true): void {
        for (const p of pattern) {
            this.board[p.row][p.col] = state;
        }
    }

    /** Generates the next generation
     * @param {number} rows Width of the board
     * @param {number} cols Height of the board
     */
    public Next(): void {
        this.alive = []; // Reset alives
        this.tbd = []; // Reset to be alive/dead beforehand
        this.tba = [];
        for (let i = 0; i < this.rows; i++) { // For every row
            for (let j = 0; j < this.cols; j++) { // For every column in a row
                const n = this.Neighbors(i, j); // get Neighbors of coordinate

                if (this.board[i][j]) { // If alive
                    if (n < 2 || n > 3) { // Under- or overpopulated
                        this.tbd.push({ row: i, col: j }); // To be dead
                    } else {
                        this.alive.push({ row: i, col: j }); // Onto alives
                    }
                } else {
                    if (n === 3) {
                        this.tba.push({ row: i, col: j }); // To be alive
                        this.alive.push({ row: i, col: j }); // Onto alives
                    }
                }
            }
        }
        for (const p of this.tbd) { // Kill
            this.board[p.row][p.col] = false;
        }
        for (const p of this.tba) { // Birth
            this.board[p.row][p.col] = true;
        }

        this.generation++;
        this.aliveCount = this.alive.length;
    }


    /** Updates alive without generating a new generation
     */
    public Update() {
        this.alive = [];
        for (let i = 0; i < this.rows; i++) { // For every row
            for (let j = 0; j < this.cols; j++) { // For every column in a row
                if(this.board[i][j]) {
                    this.alive.push({ row: i, col: j });
                }
            }
        }
    }

    /** Returns the count of alive neighbors
     * @param {number} num Coordinate to increase
     * @return {number}
     */
    private Neighbors(r: number, c: number): number {
        let n = 0;

        if (this.board[this.dec(r, this.rows)][this.dec(c, this.cols)]) { // up left
            n++;
        }
        if (this.board[this.dec(r, this.rows)][c]) { // up
            n++;
        }
        if (this.board[this.dec(r, this.rows)][this.inc(c, this.cols)]) { // up right
            n++;
        }
        if (this.board[r][this.dec(c, this.cols)]) { // left
            n++;
        }
        if (this.board[r][this.inc(c, this.cols)]) { // right
            n++;
        }
        if (this.board[this.inc(r, this.rows)][this.dec(c, this.cols)]) { // down left
            n++;
        }
        if (this.board[this.inc(r, this.rows)][c]) { // down
            n++;
        }
        if (this.board[this.inc(r, this.rows)][this.inc(c, this.cols)]) { // down right
            n++;
        }

        return n;
    }

    /** Handles the edge cases where position is at the end of the board
     * @param {number} num Coordinate to increase
     * @param {number} max Maximum
     * @return {number}
     */
    private inc(num: number, max: number): number {
        if (num === max - 1) { // If at the end
            return 0; // Return beginning
        }
        return ++num; // Return increased number
    }

    /** Handles the edge cases where position is at the beginning of the board
     * @param {number} num Coordinate to decrease
     * @param {number} max Maximum
     * @return {number}
     */
    private dec(num: number, max: number): number {
        if (num === 0) { // If at beginning
            return max - 1; // Return end
        }
        return --num; // Return decreased number
    }
}
