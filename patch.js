/* =========================================================
   MISIÓN 2 — CONFIGURACIÓN DEFINITIVA SEGÚN EL EXCEL
   Las salas A son FIJAS. Las salas B sortean UNA VEZ las ocho
   fichas B del Excel, sin reutilizar ninguna ficha.
   ========================================================= */

const M2_ROOM_LAYOUT={
 A15:{x:13.3,y:19.8},A16:{x:86.9,y:19.8},
 B1:{x:13.3,y:29.8},A13:{x:31.6,y:29.8},A14:{x:70.2,y:29.8},B2:{x:86.9,y:29.8},
 A9:{x:13.3,y:39.9},A10:{x:31.6,y:39.9},B8:{x:50.0,y:39.9},A11:{x:70.2,y:39.9},A12:{x:86.9,y:39.9},
 B5:{x:31.6,y:50.0},B7:{x:70.2,y:50.0},
 B3:{x:13.3,y:60.0},A8:{x:31.6,y:60.0},B6:{x:50.0,y:60.0},A7:{x:70.2,y:60.0},B4:{x:86.9,y:60.0},
 A3:{x:13.3,y:70.1},A6:{x:31.6,y:70.1},A5:{x:70.2,y:70.1},A4:{x:86.9,y:70.1},
 A1:{x:13.3,y:80.2},A2:{x:86.9,y:80.2}
};

Object.entries(M2_ROOM_LAYOUT).forEach(([room,pos])=>{
  ROOM_LAYOUT[room].x=pos.x;
  ROOM_LAYOUT[room].y=pos.y;
  const button=document.getElementById(`room-${room}`);
  if(button){
    button.style.left=`${pos.x}%`;
    button.style.top=`${pos.y}%`;
  }
});

/* Entradas reales de la misión. */
GRAPH.ENTRADA=["B6","A6","A5"];

/* =========================================================
   SALAS A — FIJAS, SIN SORTEO
   Imagen, final e icono copiados de la tabla del Excel.
   ========================================================= */

DEFINITIONS.A1={
  type:"codeFinal",label:"SALA DE BOTÍN",card:"A1E.png",finalCard:"A1F.png",icon:"ICOBT.png"
};
DEFINITIONS.A2={
  type:"codeFinal",label:"SALA DE BOTÍN",card:"A2E.png",finalCard:"A2F.png",icon:"ICOBT.png"
};
DEFINITIONS.A3={
  type:"simple",label:"TRAMPA DE VIDA",card:"TRV.png",icon:"ICOTR.png",reward:"PIERDE 1 DE VIDA"
};
DEFINITIONS.A4={
  type:"combat",label:"MARCIANO MORADO",card:"A4E.png",finalCard:"A4F.png",icon:"ICOMM.png",
  enemyColor:"purple",requiredLastHit:"gun",hp:{100:1,60:2,20:2}
};
DEFINITIONS.A5={
  type:"combat",label:"MARCIANO VERDE E",card:"A5E.png",finalCard:"A5F.png",icon:"ICOMV.png",
  enemyColor:"green",requiredLastHit:"fist",hp:{100:1,60:1,20:2}
};
DEFINITIONS.A6={
  type:"combat",label:"MARCIANO MORADO",card:"A6E.png",finalCard:"A6F.png",icon:"ICOMM.png",
  enemyColor:"purple",requiredLastHit:"gun",hp:{100:1,60:2,20:2},reward:"GANA 1 ENERGÍA"
};
DEFINITIONS.A7={
  type:"simple",label:"CAJA DE OBJETO",card:"CJO.png",icon:"ICOCO.png",reward:"TOMA UN OBJETO"
};
DEFINITIONS.A8={
  type:"combat",label:"MARCIANO MORADO",card:"A8E.png",finalCard:"A8F.png",icon:"ICOMM.png",
  enemyColor:"purple",requiredLastHit:"gun",hp:{100:1,60:2,20:2}
};
DEFINITIONS.A9={
  type:"combat",label:"MARCIANO ROJO",card:"A9E.png",finalCard:"A9F.png",icon:"ICOMR.png",
  enemyColor:"red",requiredLastHit:"fist",hp:{100:2,60:3,20:4}
};
DEFINITIONS.A10={
  type:"simple",label:"TRAMPA DE ENERGÍA",card:"TRE.png",icon:"ICOTR.png",reward:"PIERDE 1 DE ENERGÍA"
};
DEFINITIONS.A11={
  type:"simple",label:"VIDA",card:"SDV.png",icon:"ICOTL.png",reward:"MÁS 1 DE VIDA"
};
DEFINITIONS.A12={
  type:"combat",label:"MARCIANO VERDE",card:"A12E.png",finalCard:"A12F.png",icon:"ICOMV.png",
  enemyColor:"green",requiredLastHit:null,hp:{100:1,60:1,20:2},reward:"GANA UN OBJETO",optionalHandshake:true
};
DEFINITIONS.A13={
  type:"simple",label:"VIDA",card:"SDV.png",icon:"ICOTL.png",reward:"MÁS 1 DE VIDA"
};
DEFINITIONS.A14={
  type:"simple",label:"SALA VACÍA",card:"SLV.png",icon:null,isEmpty:true
};
DEFINITIONS.A15={
  type:"simple",label:"SALA VACÍA",card:"SLV.png",icon:null,isEmpty:true
};
DEFINITIONS.A16={
  type:"simple",label:"CAJA DE OBJETO",card:"CJO.png",icon:"ICOCO.png",reward:"TOMA UN OBJETO"
};

/* =========================================================
   SALAS B — ALEATORIAS
   Se usan EXACTAMENTE las ocho filas B1–B8 del Excel, una vez cada una.
   Por eso puede haber dos cajas y dos trampas de vida: son dos fichas
   distintas del Excel, pero ninguna ficha individual se repite.
   Solo una ficha B es sala vacía. Con A14 y A15 hay 3 vacías en total.
   ========================================================= */

const M2_B_ROOMS=["B1","B2","B3","B4","B5","B6","B7","B8"];

const M2_B_EVENT_POOL=[
  {sourceId:"B1",type:"simple",label:"CAJA DE OBJETO",card:"CJO.png",icon:"ICOCO.png",reward:"TOMA UN OBJETO"},
  {sourceId:"B2",type:"simple",label:"TRAMPA DE VIDA",card:"TRV.png",icon:"ICOTR.png",reward:"PIERDE 1 DE VIDA"},
  {sourceId:"B3",type:"simple",label:"CAJA DE OBJETO",card:"CJO.png",icon:"ICOCO.png",reward:"TOMA UN OBJETO"},
  {sourceId:"B4",type:"combat",label:"MARCIANO ROJO",card:"B4E.png",finalCard:"B4F.png",icon:"ICOMR.png",
    enemyColor:"red",requiredLastHit:"fist",hp:{100:2,60:3,20:4}},
  {sourceId:"B5",type:"simple",label:"SALA VACÍA",card:"SLV.png",icon:null,isEmpty:true},
  {sourceId:"B6",type:"combat",label:"MARCIANO MORADO E1",card:"B6E.png",finalCard:"B6F.png",icon:"ICOMM.png",
    enemyColor:"purple",requiredLastHit:"gun",hp:{100:3,60:4,20:6}},
  {sourceId:"B7",type:"simple",label:"TRAMPA DE VIDA",card:"TRV.png",icon:"ICOTR.png"},
  {sourceId:"B8",type:"combat",label:"MARCIANO MORADO E2",card:"B8E.png",finalCard:"B8F.png",icon:"ICOMM.png",
    enemyColor:"purple",requiredLastHit:"gun",hp:{100:4,60:5,20:6}}
];

function cloneM2Definition(def){
  return {...def,hp:def.hp?{...def.hp}:undefined};
}

function prepareMission2BRooms(){
  const assignments=shuffle(M2_B_EVENT_POOL).map(cloneM2Definition);
  M2_B_ROOMS.forEach((room,index)=>{
    DEFINITIONS[room]=assignments[index];
  });
}
prepareMission2BRooms();

/* =========================================================
   A12 — COMBATE NORMAL + AYUDA OPCIONAL
   El icono de arriba a la izquierda NO es obligatorio.
   El jugador puede matar al marciano con puños/disparos o usar la ayuda.
   A12F se reserva para la opción de ayuda.
   ========================================================= */

const openEncounterM2Base=openEncounter;
openEncounter=function(room){
  openEncounterM2Base(room);
  if(room==="A12" && state.encounterMode==="combat"){
    handshakeButton.style.display="block";
    encounterCard.classList.add("handshake");
  }
};

handshakeButton.addEventListener("click",function(event){
  if(state.pendingRoom!=="A12" || state.encounterMode!=="combat")return;
  event.preventDefault();
  event.stopImmediatePropagation();

  const definition=definitionFor("A12");
  state.encounterMode="handshakeFinal";
  state.combat=null;
  combatLocked=false;
  encounterCard.classList.remove("combat","handshake");
  enemyHp.style.display="none";
  gunButton.style.display="none";
  fistButton.style.display="none";
  handshakeButton.style.display="none";
  encounterBackButton.style.display="none";
  setEncounterImage(definition.finalCard);
  encounterCard.style.cursor="pointer";
  itemSound();
},true);

/* =========================================================
   A1 / A2 — CÓDIGO 3435 Y SALIDA LIBRE
   ========================================================= */

submitDoorCode=function(){
  if(state.encounterMode!=="codeFinal")return;
  if(doorCode.value.trim()!=="3435"){
    showMessage("CÓDIGO INCORRECTO");
    doorCode.select();
    return;
  }

  const room=state.pendingRoom;
  const definition=definitionFor(room);
  state.encounterMode="missionFinal";
  codePanel.classList.remove("show");
  encounterBackButton.style.display="none";
  encounterImage.onerror=null;
  encounterImage.src=definition.finalCard;
  encounterCard.style.cursor="pointer";
  dockingImpactSound();
};

function exitCodeRoom(){
  if(state.encounterMode!=="codeFinal")return;
  encounter.classList.remove("show");
  state.pendingRoom=null;
  state.encounterMode=null;
  resetEncounterUI();
  turnOffScanner();
  refreshRoomMarkers();
  showMessage("PUERTA CERRADA");
}

encounterBackButton.addEventListener("click",function(event){
  if(state.encounterMode!=="codeFinal")return;
  event.preventDefault();
  event.stopImmediatePropagation();
  exitCodeRoom();
},true);

encounter.addEventListener("click",function(event){
  if(state.encounterMode!=="codeFinal")return;
  const target=event.target;
  if(target===doorCode || target===submitCode || target.closest("#doorCode") || target.closest("#submitCode"))return;
  event.preventDefault();
  event.stopImmediatePropagation();
  exitCodeRoom();
},true);

/* =========================================================
   MARCADORES REALES DEL MAPA
   ========================================================= */

marker=function(id,room,cls,text=""){
  removeMarker(id);
  const pos=ROOM_LAYOUT[room];
  if(!pos)return null;

  const image=document.createElement("img");
  image.id=id;
  image.draggable=false;
  image.style.left=`${pos.x}%`;
  image.style.top=`${pos.y}%`;

  if(cls.includes("player-marker")){
    image.src="ICOKEILAN.png";
    image.className="player-image";
  }else if(cls.includes("check-marker")){
    image.src="icocheck.png";
    image.className="check-image";
  }else if(cls.includes("scan-marker")){
    image.src="Esc1.png";
    const dir=(cls.match(/dir-(up|right|left|down)/)||[])[1]||"up";
    image.className=`scan-image dir-${dir}`;
  }else{
    image.src="Esc1.png";
    image.className=cls;
  }

  iconsLayer.appendChild(image);
  return image;
};

/* Borra cualquier marcador heredado de la configuración anterior. */
turnOffScanner();
refreshRoomMarkers();
