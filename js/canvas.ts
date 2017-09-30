/// <reference path="interface.ts" />

class Canvas {
    public preset: IPos[] = [];

    private running: boolean = false;
    private pattern: IPos[] = [];
    private wrapper: HTMLDivElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private multiplier: number = 0;
    private color: string;

    /** Initialize canvas
     */
    constructor() {
        this.canvas = document.getElementById("mycanvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.wrapper = document.getElementById("cwrapper") as HTMLDivElement;    
        this.color = "black";    
    }

    /** Returns pattern and if wanted resets its
     * @param {boolean} del Optional: Reset?
     */
    public Pattern(del: boolean = true): IPos[] {
        let temp = this.pattern.slice(0);
        if (del) {
            this.pattern = [];
        }
        return temp;
    }

    /** Sets the current state of the site, disables pattern edit
     * @param {boolean} state state
     */
    public Running(state: boolean): void {
        this.running = state;
        if (this.running) {
            this.canvas.style.cursor = "wait"; 
        } else {
            this.canvas.style.cursor = "pointer"; 
        }
    }

    /** Sets/Gets the cell color
     * @param {string} col Optional: Color
     * @return {any} col
     */
    public CellColor(col?: string): any {
        if (typeof col == "string" && col.length > 0) {
            this.color = col;
        }
        this.ctx.fillStyle = this.color;
        return this.ctx.fillStyle;
    }

    /** Resizes the canvas based on the board
     * @param {number} rows Width of the board
     * @param {number} cols Height of the board
     */
    public resize(rows: number, cols: number): any {
        if (rows < window.innerHeight-50 && cols < window.innerWidth) { // If less rows/cols than screen
            this.multiplier = Math.floor(Math.min((window.innerHeight-50) / rows, window.innerWidth / cols));
        } else {
            this.multiplier = 1; //1 Cell = 1 Pixel
        }
        this.canvas.height = rows * this.multiplier;
        this.canvas.width = cols * this.multiplier;
        
        this.CellColor();
        this.Draw(this.pattern);
    }

    /** Returns the dimensions of the canvas
     * @return {number[]}
     */
    public getSize(): number[] {
        return [this.canvas.width, this.canvas.height];
    }

    /** Gives the user feedback based on cursor hover
     * @param {number} e Event
     */
    public setCursorPos(e): void {
        if (this.running) {
            return;
        }

        const cell: IPos = this.MouseToCell(e);

        this.Draw(this.pattern, false);
        if (cell == null) {
            return;
        }
        if (this.preset.length == 0) {
            this.ctx.fillRect(cell.col * this.multiplier, cell.row * this.multiplier, this.multiplier, this.multiplier);
        } else {
            console.log("h");
            for (let p of this.preset) {
                if ((p.row + cell.row) * this.multiplier < this.canvas.height &&
                    (p.col + cell.col) * this.multiplier < this.canvas.width) {
                    this.Draw([{ row: p.row + cell.row, col: p.col + cell.col }], false)
                }
            }
            this.Draw(this.pattern, false);
        }
    }

    /** Changes the cell state where the user clicked
     * @param {any} e Event
     */
    public toggleCell(e): void {
        if (this.running) {
            return;
        }

        const cell: IPos = this.MouseToCell(e);

        if  (cell == null) {
            this.Draw(this.pattern, false);
            return;
        }

        if (this.preset.length == 0) {
            let len = this.pattern.length;
            let res: number = -1;
            while (len--) {
                if (this.pattern[len].row === cell.row && this.pattern[len].col === cell.col) {
                    res = len;
                    break;
                }
            }
            if (res !== -1) {
                this.pattern.splice(len, 1);
            } else {
                this.pattern.push(cell);
            }
        } else {
            for (let p of this.preset) {
                let com = { row: p.row + cell.row, col: p.col + cell.col };
                let len = this.pattern.length;
                let res: number = -1;
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
    }

    /** Returns the Cell on mouse position
     * @param {any} e Event
     */
    private MouseToCell(e): IPos {
        const x = e.pageX;
        const y = e.pageY;

        const rect: ClientRect = this.canvas.getBoundingClientRect();
        if (rect.left <= x && rect.right >= x && rect.top <= y && rect.bottom >= y) {
            const rel: number[] = [ Math.floor((x - rect.left) / this.multiplier),
                                    Math.floor((y - rect.top) / this.multiplier)    ];
            return { row: rel[1], col: rel[0] };
        }
    }

    /** draws squares at given positions
     * @param {IPos[]} arr Positions
     */
    public Draw(arr: IPos[], clear: boolean = true): void {
        if (clear) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        for (const e of arr) {
            this.ctx.fillRect(e.col * this.multiplier, e.row * this.multiplier, this.multiplier, this.multiplier);
        }
    }

}
