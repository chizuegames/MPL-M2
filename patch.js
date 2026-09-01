/* Calibración de posiciones e iconos reales de Misión 2. */
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
   CORRECCIONES DE CONTENIDO
   ========================================================= */

/* A12 siempre debe mostrar SU propia escena, nunca A6E. */
DEFINITIONS.A12={
  type:"handshake",
  label:"SEÑAL BIOLÓGICA",
  card:"A12E.png",
  finalCard:"A12F.png",
  icon:"ICOMV.png"
};

/*
  Las antiguas TLL pasan a ser SLV.
  Al revelarlas con el escáner no queda ningún icono de evento.
  Al entrar sí se muestra la imagen SLV.png.
*/
function convertTLLToSLV(definition){
  if(!definition)return;
  if(definition.card==="TLL.png" || definition.sourceId==="TL"){
    definition.type="simple";
    definition.label="SALA VACÍA";
    definition.card="SLV.png";
    definition.icon=null;
    definition.sourceId="SLV";
  }
}

if(typeof B_EVENT_POOL!=="undefined"){
  B_EVENT_POOL.forEach(convertTLLToSLV);
}
Object.values(DEFINITIONS).forEach(convertTLLToSLV);

/* Finales de A1 y A2: usar sus resoluciones propias. */
DEFINITIONS.A1.finalCard="A1F.png";
DEFINITIONS.A2.finalCard="A2F.png";

/*
  Si A1F/A2F todavía no han terminado de publicarse en GitHub Pages,
  evita dejar una imagen rota y usa SLV de respaldo temporalmente.
*/
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

  encounterImage.onerror=()=>{
    encounterImage.onerror=null;
    encounterImage.src="SLV.png";
  };
  encounterImage.src=definition.finalCard;
  encounterCard.style.cursor="pointer";
  dockingImpactSound();
};

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

/* Limpia cualquier marcador previo y vuelve a dibujar el mapa. */
turnOffScanner();
refreshRoomMarkers();
