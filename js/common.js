let can = document.getElementById('can');

let con = can.getContext('2d');

const BLOCK_SIZE = 30;

const TETRO_SIZE = 4;

const FIELD_COL = 10;
const FIELD_ROW = 20;
const SCREEN_W = BLOCK_SIZE*FIELD_COL;
const SCREEN_H = BLOCK_SIZE*FIELD_ROW;
can.width = SCREEN_W;
can.height = SCREEN_H;
can.style.border = "4px solid #555";

const START_X = FIELD_COL/2 - TETRO_SIZE/2;
const START_Y = 0;

let tetro_x = START_X;        
let tetro_y = START_Y;        

const TETRO_COLORS = [
  "#000",
  "#6cf",
  "#fb2",
  "#66f",
  "#c5c",
  "#fd2",
  "#f44",
  "#6b6",
];

const TETRO_TYPES = [
  [],
  [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0],
  ],
  [
    [0,1,0,0],
    [0,1,0,0],
    [0,1,1,0],
    [0,0,0,0],
  ],
  [
    [0,0,1,0],
    [0,0,1,0],
    [0,1,1,0],
    [0,0,0,0],
  ],
  [
    [0,1,0,0],
    [0,1,1,0],
    [0,1,0,0],
    [0,0,0,0],
  ],
  [
    [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0],
  ],
  [
    [0,0,0,0],
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0],
  ],
  [
    [0,0,0,0],
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0],
  ],
]

let over = false;              

let field = [];

const GAME_SPEED = 1000;

function init(){
  for(let y=0;y<FIELD_ROW;y++){
    field[y] = [];
    for(let x=0;x<FIELD_COL;x++){
      field[y][x] = 0;
    }
  }
}
init();

let tetro;         
let tetro_t;
tetro_t = Math.floor(Math.random()*(TETRO_TYPES.length - 1)) + 1;
tetro = TETRO_TYPES[tetro_t];

function drawBlock(x,y,c){           
  let px = x*BLOCK_SIZE;   
  let py = y*BLOCK_SIZE;

  con.fillStyle=TETRO_COLORS[c];                
  con.fillRect(px,py,BLOCK_SIZE,BLOCK_SIZE);

  con.strokeStyle = "black";
  con.strokeRect(px,py,BLOCK_SIZE,BLOCK_SIZE);
}

function drawAll(){

  con.clearRect(0,0,SCREEN_W,SCREEN_H);

  for(let y=0;y<FIELD_ROW;y++){
    for(let x=0;x<FIELD_COL;x++){
      if(field[y][x]){
        drawBlock(x,y,field[y][x]);            
      }
    }
  }

  for(let y=0;y<TETRO_SIZE;y++){
    for(let x=0;x<TETRO_SIZE;x++){
      if(tetro[y][x]){
        drawBlock(tetro_x+x,tetro_y+y,tetro_t);        
      }
    }
  }

  if(over == true){
    let s = "GAME OVER";
    con.font = "40px 'MSゴシック'";
    let w = con.measureText(s).width;
    let x = SCREEN_W/2 - w/2;
    let y = SCREEN_H/2 - 20;
    con.lineWidth = 4;
    con.strokeText(s,x,y);
    con.fillStyle = "white";
    con.fillText(s,x,y);
  }

}
drawAll();

function checkLine(){
  for(let y = 0;y < FIELD_ROW;y ++){
    let flag = true;
    for(let x = 0;x < FIELD_COL;x ++){
      if(!field[y][x]) {
        flag = false;
        break;
      }
    }
    if(flag == true){
      for(let ny = y; ny > 0;ny --){
        for(let nx = 0;nx < FIELD_COL;nx ++){
          field[ny][nx] = field[ny - 1][nx];
        }
      }
    }
  }
}

function checkMove(mx,my,ntetro){
  if(ntetro == undefined) ntetro = tetro;
  for(let y=0;y<TETRO_SIZE;y++){
    for(let x=0;x<TETRO_SIZE;x++){
      let nx = tetro_x + mx + x;
      let ny = tetro_y + my + y;

      if(ntetro[y][x]){
          if(ny < 0 || nx < 0 || ny >= FIELD_ROW || nx >= FIELD_COL || field[ny][nx]){               
            return false;
          } 
      }
    }
  }
  return true;
}

function rotate(){
  let ntetro = [];
  for(let y=0;y<TETRO_SIZE;y++){
    ntetro[y] = [];
    for(let x=0;x<TETRO_SIZE;x++){
      ntetro[y][x] = tetro[TETRO_SIZE-x-1][y];
    }
  }
  return ntetro;
}

function fixTetro(){
  for(let y=0;y<TETRO_SIZE;y++){
    for(let x=0;x<TETRO_SIZE;x++){
      if(tetro[y][x]){
        field[tetro_y + y][tetro_x + x] = tetro_t;         
      }
    }
  }
}

function dropTetro(){

  if(over == true) return;        

  if(checkMove(0,1)) tetro_y ++;
  else{
    fixTetro();

    checkLine();              

    tetro_x = START_X;         
    tetro_y = START_Y;         

    tetro_t = Math.floor(Math.random()*(TETRO_TYPES.length - 1)) + 1;
    tetro = TETRO_TYPES[tetro_t];

    if(!checkMove(0,0)) over = true;        
  }
  drawAll();
}
setInterval(dropTetro,GAME_SPEED);

document.addEventListener('keydown',function(e){

  if(over == true) return;              

  switch(e.keyCode){
    case 37:
      if(checkMove(-1,0)) tetro_x --;
      break;
    case 39:
      if(checkMove(1,0)) tetro_x ++;
      break;
    case 40:
      if(checkMove(0,1)) tetro_y ++;
      break;
    case 32:
      let ntetro = rotate();
      if(checkMove(0,0,ntetro)) tetro = ntetro;
      break;   
  }
  drawAll();
});