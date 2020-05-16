let canvas = document.getElementById("canvas");
let ctx= canvas.getContext("2d");
let render;
let obstacle; 
let player;
let pixel;
let maxScore=0;
let count=0;
let n;
let pauseScreen = document.getElementById('pausescreen');

let resumeImage;
resumeImage = document.createElement("img");
resumeImage.setAttribute("id","resume");
resumeImage.src = "play.svg";

let reloadImage;
reloadImage = document.createElement("img");
reloadImage.setAttribute("id","reload");
reloadImage.src = "reload.svg";

let gameEnd = document.getElementById("gameover");
gameEnd.appendChild(reloadImage);

let color = ["#ffffff","#00A4CCFF","#000000","#CB1E04"];

let newObstacley ;
let click = 0;
let best = JSON.parse(localStorage.getItem('bestscore'));
let jumpSound = new Audio();
let burstSound = new Audio();
jumpSound.src = "jump.wav";
burstSound.src = "burst.flac";


let pauseImage = document.createElement("img");
pauseImage.src = "pause.svg";
let pauseButton = document.getElementById("pause");
pauseButton.appendChild(pauseImage);
pauseButton.addEventListener('click',pauseGame);

canvas.addEventListener('click',jumpAudio);

var score = document.createElement("div");
score.setAttribute("id","score");
document.getElementsByTagName("body")[0].appendChild(score);
score.innerHTML = "Score : 0";

var highScore = document.createElement("div");
highScore.setAttribute("id","highscore");
document.getElementsByTagName("body")[0].appendChild(highScore);

    if(best == null)
       { localStorage.setItem('bestscore','0');
        highScore.innerHTML = "Best Score : 0";
        } 
    else
    {    localStorage.setItem('bestscore',JSON.stringify(best));
        highScore.innerHTML = "Best Score : " + best;
    }

canvas.addEventListener('click', play );
canvas.addEventListener('click', function (){
    player.dy = 5;
});

window.onopen = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setup ();
}

window.onresize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setup();
}

window.onload = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setup ();
}

function dispScore(max){
    score.innerHTML ="Score : " + max;
    console.log(max);
    dispBestScore(max);
}

function dispBestScore(max){
    best = JSON.parse(localStorage.getItem('bestscore'));
    if(max>best)
    {
    localStorage.setItem('bestscore',JSON.stringify(max));
    highScore.innerHTML ="Best Score : " + max;
    }
}

function jumpAudio(){
        jumpSound.play();
}

function burstAudio() {
        burstSound.play();
}

function gameEndScreen(max){
    gameEnd.innerText = "Score : " + max; 
    gameEnd.appendChild(reloadImage);
    gameEnd.style.display = "block";
    reloadImage.addEventListener('click',reload);
}

function reload(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    gameEnd.style.display = "none";
    pauseScreen.style.display = "none";
    reloadImage.removeEventListener('click',reload);
    resumeImage.removeEventListener('click',resume);
    setup();
}

function resume(){
    setTimeout(play,1000);
    pauseButton.addEventListener('click',pauseGame);
    canvas.addEventListener('click',jumpAudio);
    resumeImage.removeEventListener('click',resume);
    reloadImage.removeEventListener('click',reload);
    pauseScreen.style.display = "none";

}
function pauseGame(){

        pauseButton.removeEventListener('click',pauseGame);
        canvas.removeEventListener('click',jumpAudio);

        clearInterval(render);

        pauseScreen.appendChild(resumeImage);
        pauseScreen.appendChild(reloadImage);
        pauseScreen.style.display = "block";

        resumeImage.addEventListener('click',resume);

        reloadImage.addEventListener('click',reload);

     }


function  setup (){
    clearInterval(render);
    obstacle = new Array();
    player = new PlayerCircle(canvas.width/2,canvas.height/2+ canvas.height*0.3,canvas.height*0.02,'#ffffff');
    obstacle.push(new Obstacle(canvas.width/2,canvas.height/3,canvas.height*0.15,Math.floor(((Math.random()+1)*2)+0.5)));
    maxScore = 0;
    count = 0;
    dispScore(maxScore);
    player.draw();

    canvas.addEventListener('click', play );
    canvas.addEventListener('click', function (){
        player.dy = 5;
        click++;
    });
    canvas.addEventListener('click',jumpAudio);
    pauseButton.addEventListener('click',pauseGame);

for(let i=0;i<obstacle.length;i++)
    obstacle[i].draw();

}

function PlayerCircle (x,y,r,c) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;

    this.dy = 5;
    this.g = 0.25;

    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.arc (this.x,this.y,this.r,0,Math.PI*2);
        ctx.fill();
    }

    this.jump = function() {
        this.y -= this.dy;
        this.dy -= this.g;
        this.draw();

        if(this.y<=canvas.height/2)
        {
            if(this.y <= canvas.height/3)
            for(let i=0;i<obstacle.length;i++)
            { 
               obstacle[i].y += 1.5;
                obstacle[i].draw();
            }
            else
            for(let i=0;i<obstacle.length;i++)
            { 
               obstacle[i].y += 0.7;
                obstacle[i].draw();
            }
           
        }
        for(let i=0;i<obstacle.length;i++)
        {
            if(this.y <= obstacle[i].y && this.y >= obstacle[i].y - obstacle[i].r)
            {
                if(maxScore<(i+1))
                {
                    count=i+1;
                    maxScore=count;
                    dispScore(maxScore);
                    newObstacley = 3*canvas.height/5;
                    obstacle.push(new Obstacle(canvas.width/2,obstacle[i].y - newObstacley,canvas.height*0.15,Math.floor(((Math.random()+1)*2)+0.5)));                   
                }
            }
        
        }

    }

}
function Obstacle(x,y,r,n) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.startAngle = Math.PI/2;
    this.endAngle;
     
    this.n = n;
    
    if( Math.random() - 0.5 >= 0)
        this.clockAnti = 1;
    else
        this.clockAnti = -1;

    this.draw = function () {
     
        for(var i=0;i<this.n;i++)
        {
            this.endAngle = this.startAngle + 2*Math.PI/n;
            ctx.beginPath();
            ctx.strokeStyle = color[i] ;
            ctx.arc(this.x,this.y,this.r,this.startAngle,this.endAngle,false);
            ctx.lineWidth=canvas.height/40;
            this.startAngle = this.endAngle;
            ctx.stroke();
        }
    }

    this.rotate = function () {
        this.startAngle += this.clockAnti*Math.PI/180;
        this.draw();
    }
    
    this.burst = function () {

        if((player.y - this.y <= (player.r + this.r + canvas.height/80)) && (player.y - this.y >= (this.r - player.r - canvas.height/80)))
        {
            pixel = ctx.getImageData(this.x,this.y + this.r,1,1).data;
            if(!(pixel[0]==255&&pixel[1]==255&&pixel[2]==255))
              {  ctx.clearRect(0,0,canvas.width,canvas.height);
                clearInterval(render);
                    burstAudio();
                canvas.removeEventListener('click',jumpAudio);
                for(var j=0;j<obstacle.length;j++)
                {
                    obstacle[j].draw();
                }
                gameEndScreen(maxScore);
              }

        }

        else if((this.y - player.y <= (player.r + this.r + canvas.height/80)) && (this.y - player.y >= (this.r - player.r - canvas.height/80)))
        {
            pixel = ctx.getImageData(this.x,this.y - this.r,1,1).data;
            if(!(pixel[0]==255&&pixel[1]==255&&pixel[2]==255))
              {  ctx.clearRect(0,0,canvas.width,canvas.height);
                clearInterval(render);                
                burstAudio();
                canvas.removeEventListener('click',jumpAudio);
                for(var j=0;j<obstacle.length;j++)
                {
                    obstacle[j].draw();
                }
                
                gameEndScreen(maxScore);
              }
        }
        else if (player.y>canvas.height)
        {
            ctx.clearRect(0,0,canvas.width,canvas.height);
                clearInterval(render);                
                burstAudio();
                canvas.removeEventListener('click',jumpAudio);
                for(var j=0;j<obstacle.length;j++)
                {
                    obstacle[j].draw();
                }
                
                gameEndScreen(maxScore);
        }
    }

}

function play () {
    canvas.removeEventListener('click',play);
    canvas.removeEventListener('click',function(){
        player.dy = 5;
    })
    pauseButton.addEventListener('click',pauseGame);

         render = setInterval(function(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            if (click==0)
                player.draw();
            else
                player.jump();
        for(let i=0;i<obstacle.length;i++)
        {    obstacle[i].rotate();
                obstacle[i].burst();
        }
    },16);

} 