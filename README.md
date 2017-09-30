# gol_typescript
Entry for the it talents competition.
## installation
Just drag and drop to your webserver or just use [this link](https://timll.github.io/gol_typescript/) if you want to try it out.
## usage
Software should be self explanatory, especially when the audience could be anyone like in the web.
## performance
On a 256^2 board using the random pattern generator built-in, firefox did around 10 steps/second, while chrome was 10 times faster. Don't know why.
## presets
In the preset.ts you will find a JSON in a variable (done, because I wanted to stay full client-side). Every element contains a name, the size (rows, cols) and an array called alive.  
If you are hosting this script and want to add some presets, you can go and edit it. The "alive" array doesn't need to be hand-written. You can draw it and click "Share pattern" to export it.
You need to compile it tho.
