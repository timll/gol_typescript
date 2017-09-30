/* Ghetto-Fix, so it doesn't depend on http */
var presetJSON = JSON.parse(`[
    {
        "name": "Misc/Nice Pattern",
        "rows": 7,
        "cols": 3,
        "alive": [
            { "row": 0, "col": 0 },
            { "row": 0, "col": 1 },
            { "row": 0, "col": 2 },
            { "row": 1, "col": 0 },
            { "row": 1, "col": 2 },
            { "row": 2, "col": 0 },
            { "row": 2, "col": 2 },
            { "row": 4, "col": 0 },
            { "row": 4, "col": 2 },
            { "row": 5, "col": 0 },
            { "row": 5, "col": 2 },
            { "row": 6, "col": 0 },
            { "row": 6, "col": 1 },
            { "row": 6, "col": 2 }
        ]
    },
    {
        "name": "Pentadecathlon",
        "rows": 3,
        "cols": 10,
        "alive": [
            { "row": 0, "col": 2 },
            { "row": 0, "col": 7 },
            { "row": 1, "col": 0 },
            { "row": 1, "col": 1 },
            { "row": 1, "col": 3 },
            { "row": 1, "col": 4 },
            { "row": 1, "col": 5 },
            { "row": 1, "col": 6 },
            { "row": 1, "col": 8 },
            { "row": 1, "col": 9 },
            { "row": 2, "col": 2 },
            { "row": 2, "col": 7 }
        ]
    },
    {
        "name": "Glider",
        "rows": 3,
        "cols": 3,
        "alive": [
            { "row": 0, "col": 1 },
            { "row": 1, "col": 2 },
            { "row": 2, "col": 0 },
            { "row": 2, "col": 1 },
            { "row": 2, "col": 2 }
        ]
    },
    {
        "name": "LWSS",
        "rows": 4,
        "cols": 5,
        "alive": [
            { "row": 0, "col": 1 },
            { "row": 0, "col": 2 },
            { "row": 0, "col": 3 },
            { "row": 0, "col": 4 },
            { "row": 1, "col": 0 },
            { "row": 1, "col": 4 },
            { "row": 2, "col": 4 },
            { "row": 3, "col": 0 },
            { "row": 3, "col": 3 }
        ]
    }
]`);