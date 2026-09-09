/* =========================================================
   FINAL DE MISIÓN 2
   1) Muestra FF.png + narración.
   2) Un toque en cualquier parte de la pantalla pasa al final.
   3) MISIÓN CUMPLIDA se muestra en turquesa.
   ========================================================= */

(function(){
  const style=document.createElement("style");
  style.textContent=`
    #m2FinalStory{
      position:fixed;
      inset:0;
      z-index:320;
      display:none;
      align-items:center;
      justify-content:center;
      background:#02050a;
      cursor:pointer;
      touch-action:manipulation;
    }
    #m2FinalStory.show{display:flex;}
    #m2FinalStoryInner{
      position:relative;
      width:min(100vw,760px);
      height:100vh;
      max-height:100vh;
      overflow:hidden;
      background:#02050a;
    }
    #m2FinalStoryImage{
      display:block;
      width:100%;
      height:100%;
      object-fit:contain;
      user-select:none;
      -webkit-user-drag:none;
    }
    #m2FinalStoryCaption{
      position:absolute;
      left:5%;
      right:5%;
      bottom:5%;
      margin:0;
      padding:14px 16px;
      border-radius:16px;
      background:rgba(2,8,14,.82);
      border:2px solid rgba(62,231,232,.8);
      box-shadow:0 0 22px rgba(62,231,232,.22);
      color:#fff;
      font-size:clamp(17px,4vw,25px);
      line-height:1.28;
      font-weight:700;
      text-align:center;
      text-shadow:0 2px 4px #000;
      pointer-events:none;
    }
    #endOverlay.mission #endPanel{
      border-color:#35e6e8 !important;
      box-shadow:0 0 38px rgba(53,230,232,.38) !important;
    }
    #endOverlay.mission #endTitle{
      color:#35e6e8 !important;
      text-shadow:0 0 14px rgba(53,230,232,.72) !important;
    }
  `;
  document.head.appendChild(style);

  const overlay=document.createElement("div");
  overlay.id="m2FinalStory";
  overlay.setAttribute("role","button");
  overlay.setAttribute("aria-label","Toca para continuar");
  overlay.innerHTML=`
    <div id="m2FinalStoryInner">
      <img id="m2FinalStoryImage" src="FF.png" alt="Keilan extrayendo la información" draggable="false">
      <p id="m2FinalStoryCaption">Keilan extrajo la información de la computadora del laboratorio mientras los Muraianos seguían tras él.</p>
    </div>
  `;
  document.body.appendChild(overlay);

  let finalStoryVisible=false;

  function showMissionComplete(){
    finalStoryVisible=false;
    overlay.classList.remove("show");
    endOverlay.className="show mission";
    endTitle.textContent="MISIÓN CUMPLIDA";
    endSubtitle.textContent="Has descubierto lo que ocultaban los marcianos.";
  }

  function finishStory(event){
    if(!finalStoryVisible)return;
    if(event){
      event.preventDefault();
      event.stopPropagation();
    }
    showMissionComplete();
  }

  overlay.addEventListener("click",finishStory,true);
  overlay.addEventListener("touchend",finishStory,{capture:true,passive:false});

  missionComplete=function(){
    if(state.ended)return;
    state.ended=true;
    state.gameLocked=true;
    turnOffScanner();
    encounter.classList.remove("show");
    missionSound();
    endOverlay.className="";
    finalStoryVisible=true;
    overlay.classList.add("show");
  };
})();
