/* =========================================================
   AJUSTES DE MISIÓN 2
   Este archivo corrige posiciones y, sobre todo, mantiene una sola
   definición por sala para que ESCÁNER, ICONO y ENCUENTRO coincidan.
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

/* La misión puede iniciar por B6, A6 o A5. */
GRAPH.ENTRADA=["B6","A6","A5"];

/* =========================================================
   SALAS A FIJAS
   ========================================================= */

/* A6: marciano MORADO. */
Object.assign(DEFINITIONS.A6,{
  type:"combat",
  label:"MARCIANO MORADO",
  card:"A6E.png",
  finalCard:"A6F.png",
  icon:"ICOMM.png",
  enemyColor:"purple",
  requiredLastHit:"gun"
});

/* A5: marciano VERDE. */
Object.assign(DEFINITIONS.A5,{
  type:"combat",
  label:"MARCIANO VERDE",
  card:"A5E.png",
  finalCard:"A5F.png",
  icon:"ICOMV.png",
  enemyColor:"green",
  requiredLastHit:"fist"
});

/* A12 siempre usa su propia escena. */
DEFINITIONS.A12={
  type:"handshake",
  label:"SEÑAL BIOLÓGICA",
  card:"A12E.png",
  finalCard:"A12F.png",
  icon:"ICOMV.png"
};

/* A1 y A2: puertas finales. */
DEFINITIONS.A1.finalCard="A1F.png";
DEFINITIONS.A2.finalCard="A2F.png";

/* =========================================================
   SALAS B ALEATORIAS
   - 8 salas B.
   - EXACTAMENTE 3 salas vacías.
   - Las vacías no muestran icono al escanear y al entrar muestran SLV.png.
   - Los otros 5 eventos se eligen SIN REPETICIÓN.
   - Una vez asignado un evento a una B, esa misma definición se usa para
     el icono del escáner y para el encuentro; no se vuelve a sortear.
   ========================================================= */

const M2_B_ROOMS=["B1","B2","B3","B4","B5","B6","B7","B8"];

const M2_B_UNIQUE_EVENTS=[
  {
    sourceId:"BT",
    type:"simple",
    label:"RECUPERAR VIDA",
    card:"SDV.png",
    icon:"ICOBT.png"
  },
  {
    sourceId:"CO",
    type:"simple",
    label:"CAJA DE OBJETO",
    card:"CJO.png",
    icon:"ICOCO.png"
  },
  {
    sourceId:"TE",
    type:"simple",
    label:"TRAMPA DE ENERGÍA",
    card:"TRE.png",
    icon:"ICOTR.png"
  },
  {
    sourceId:"TV",
    type:"simple",
    label:"TRAMPA DE VIDA",
    card:"TRV.png",
    icon:"ICOTR.png"
  },
  {
    sourceId:"B6",
    type:"combat",
    label:"MARCIANO ROJO",
    card:"B6E.png",
    finalCard:"B6F.png",
    icon:"ICOMR.png",
    enemyColor:"red",
    requiredLastHit:"fist",
    hp:{100:3,60:4,20:4}
  },
  {
    sourceId:"B8",
    type:"combat",
    label:"MARCIANO VERDE",
    card:"B8E.png",
    finalCard:"B8F.png",
    icon:"ICOMV.png",
    enemyColor:"green",
    requiredLastHit:"fist",
    hp:{100:2,60:3,20:3}
  }
];

function cloneM2Event(event){
  return {
    ...event,
    hp:event.hp?{...event.hp}:undefined
  };
}

function makeEmptyM2Room(n){
  return {
    sourceId:`SLV${n}`,
    type:"simple",
    label:"SALA VACÍA",
    card:"SLV.png",
    icon:null,
    isEmpty:true
  };
}

function prepareMission2BRooms(){
  /* Escoge 5 encuentros distintos de los 6 disponibles. */
  const fiveEvents=shuffle(M2_B_UNIQUE_EVENTS).slice(0,5).map(cloneM2Event);
  const threeEmpty=[makeEmptyM2Room(1),makeEmptyM2Room(2),makeEmptyM2Room(3)];

  /* Mezcla las 8 asignaciones una sola vez. */
  const assignments=shuffle([...fiveEvents,...threeEmpty]);

  M2_B_ROOMS.forEach((room,index)=>{
    DEFINITIONS[room]=assignments[index];
  });
}

prepareMission2BRooms();

/* =========================================================
   PUERTAS A1/A2
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

/*
   Salir de A1/A2 sin perder la posición anterior.
   La habitación final NO se marca como completada ni se mueve a Keilan allí.
*/
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

/* El botón VOLVER sigue funcionando. */
encounterBackButton.addEventListener("click",function(event){
  if(state.encounterMode!=="codeFinal")return;
  event.preventDefault();
  event.stopImmediatePropagation();
  exitCodeRoom();
},true);

/*
   También se puede salir simplemente tocando la pantalla.
   Solo se respetan el campo donde se escribe 3435 y el botón ABRIR,
   para que introducir/probar el código no cierre la escena accidentalmente.
*/
encounter.addEventListener("click",function(event){
  if(state.encounterMode!=="codeFinal")return;

  const target=event.target;
  if(target===doorCode || target===submitCode || target.closest("#doorCode") || target.closest("#submitCode")){
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
  exitCodeRoom();
},true);

/* =========================================================
   ICONOS REALES
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

/* Limpia cualquier resto visual creado antes del parche. */
turnOffScanner();
refreshRoomMarkers();
