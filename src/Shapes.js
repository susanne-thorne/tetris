const SHAPES = [
  [
  { i: -4, j: 5 },
  { i: -3,  j: 5},
  { i: -2, j: 5},
  {i: -1, j: 5},
], 
[
  { i: -2, j: 4 },
    { i: -2, j: 5 },
    { i: -1, j: 4 },
    { i: -1, j: 5 },
],
[
    { i: -2, j: 4 },
    { i: -2, j: 5 },
    { i: -2, j: 6 },
    { i: -1, j: 5 },
  ],
   [
    { i: -3, j: 5 },
    { i: -2, j: 5 },
    { i: -1, j: 5 },
    { i: -1, j: 6 },
  ],
   [
    { i: -3, j: 5 },
    { i: -2, j: 5 },
    { i: -1, j: 5 },
    { i: -1, j: 4 },
  ],
    [
    { i: -2, j: 4 },
    { i: -2, j: 5 },
    { i: -1, j: 5 },
    { i: -1, j: 6 },
  ],
   [
    { i: -2, j: 5 },
    { i: -2, j: 6 },
    { i: -1, j: 4 },
    { i: -1, j: 5 },
  ]
]

export default function generateRandemShape(){
    const i = Math.floor(Math.random() * SHAPES.length);
    return SHAPES[i].map(({i,j}) => ({i,j}));
}