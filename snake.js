javascript: // Forest Snake Game - Updated Version
(function(){
  if(document.getElementById("snakeForest")){document.getElementById("snakeForest").remove(); return;}

  // Overlay
  const overlay=document.createElement("div");
  overlay.id="snakeForest";
  overlay.style.cssText="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.9);display:flex;justify-content:center;align-items:center;z-index:999999";
  overlay.tabIndex = 1;
  overlay.focus();
  document.body.appendChild(overlay);

  // Wrapper
  const wrapper=document.createElement("div");
  wrapper.style.display="flex";
  wrapper.style.gap="20px";
  overlay.appendChild(wrapper);

  // Canvas
  const canvas=document.createElement("canvas");
  canvas.width=600;
  canvas.height=400;
  canvas.style.background="#001a00";
  canvas.style.borderRadius="12px";
  wrapper.appendChild(canvas);
  const ctx=canvas.getContext("2d");

  // Panel
  const panel=document.createElement("div");
  panel.style.color="white";
  panel.style.fontFamily="Arial";
  panel.style.width="220px";
  wrapper.appendChild(panel);

  // Buttons
  const restartBtn=document.createElement("button");
  restartBtn.innerText="Restart";
  restartBtn.style.cssText="display:block;margin-top:10px;width:100%;padding:6px;border-radius:6px;border:none;cursor:pointer;background:#00ff99";
  panel.appendChild(restartBtn);

  const closeBtn=document.createElement("button");
  closeBtn.innerText="Close";
  closeBtn.style.cssText="display:block;margin-top:6px;width:100%;padding:6px;border-radius:6px;border:none;cursor:pointer;background:#ff4444";
  panel.appendChild(closeBtn);

  // Game variables
  let box=20, snake, direction, score, points, lives, rocks, food, scrollX, speed, game;
  let high=localStorage.getItem("snakeHigh")||0;
  let permSpeed=parseInt(localStorage.getItem("permSpeed")||0);
  let permLife=parseInt(localStorage.getItem("permLife")||0);

  function randPos(){ return { x:Math.floor(Math.random()*30)*box, y:Math.floor(Math.random()*20)*box }; }

  function init(){
    snake=[{x:5*box, y:10*box}]; // start in left-middle
    direction="RIGHT";
    score=0;
    points=0;
    lives=1+permLife;
    speed=120-(permSpeed*10);
    food=randPos();
    rocks=[];
    scrollX=0;
    clearInterval(game);
    game=setInterval(draw,speed);
    updatePanel();
  }

  function updatePanel(){
    panel.innerHTML="Score:"+score+"<br>High:"+high+"<br>Points:"+points+"<br>Lives:"+lives+
      "<br>[1] Speed Upgrade (50) Lv:"+permSpeed+
      "<br>[2] Extra Life (75) Lv:"+permLife;
    panel.appendChild(restartBtn);
    panel.appendChild(closeBtn);
  }

  restartBtn.onclick=init;
  closeBtn.onclick=function(){ clearInterval(game); overlay.remove(); }

  // Key events
  window.addEventListener("keydown", e=>{
    if(e.key==="ArrowLeft" && direction!=="RIGHT") direction="LEFT";
    if(e.key==="ArrowUp" && direction!=="DOWN") direction="UP";
    if(e.key==="ArrowRight" && direction!=="LEFT") direction="RIGHT";
    if(e.key==="ArrowDown" && direction!=="UP") direction="DOWN";

    if(e.key==="1" && points>=50){ points-=50; permSpeed++; localStorage.setItem("permSpeed",permSpeed); speed=120-permSpeed*10; clearInterval(game); game=setInterval(draw,speed); }
    if(e.key==="2" && points>=75){ points-=75; permLife++; localStorage.setItem("permLife",permLife); lives++; }

    if(e.key==="Escape"){ overlay.remove(); clearInterval(game); }

    updatePanel();
  });

  function spawnRocks(){ if(Math.random()<0.05) rocks.push({ x:canvas.width+Math.random()*200, y:Math.floor(Math.random()*20)*box }); }

  function drawBG(){
    ctx.fillStyle="#013220";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#014d2e";
    for(let i=0;i<50;i++) ctx.fillRect((i*40-scrollX)%canvas.width, Math.random()*canvas.height, 20, 20);
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    scrollX+=2;

    drawBG();
    spawnRocks();
    rocks.forEach(r=>{ r.x-=2; ctx.fillStyle="gray"; ctx.fillRect(r.x,r.y,box,box); });
    rocks=rocks.filter(r=>r.x+box>0);

    ctx.fillStyle="red";
    ctx.fillRect(food.x,food.y,box,box);

    // Draw snake (always visible, ignore scroll)
    snake.forEach((s,i)=>{
      ctx.fillStyle=i===0?"#ffff00":"#00ff00"; // head yellow, body bright green
      ctx.fillRect(s.x,s.y,box,box);
    });

    let head=snake[0];
    let nh={x:head.x,y:head.y};
    if(direction==="LEFT") nh.x-=box;
    if(direction==="RIGHT") nh.x+=box;
    if(direction==="UP") nh.y-=box;
    if(direction==="DOWN") nh.y+=box;

    if(nh.y<0) nh.y=canvas.height-box;
    if(nh.y>=canvas.height) nh.y=0;

    let hitRock=rocks.some(r=>r.x<nh.x+box && r.x+box>nh.x && r.y<nh.y+box && r.y+box>nh.y);
    if(hitRock){
      if(lives>0){ lives--; snake=[{x:5*box, y:10*box}]; direction="RIGHT"; rocks=[]; }
      else{ alert("Game Over | Score:"+score); init(); return; }
    }

    if(nh.x<food.x+box && nh.x+box>food.x && nh.y<food.y+box && nh.y+box>food.y){
      score++; points++;
      food={x:canvas.width+Math.random()*200, y:Math.floor(Math.random()*20)*box};
    } else snake.pop();

    snake.unshift(nh);

    if(score>high){ high=score; localStorage.setItem("snakeHigh",high); }
    updatePanel();
  }

  init();
})();
