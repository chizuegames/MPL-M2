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
  if(button){button.style.left=`${pos.x}%`;button.style.top=`${pos.y}%`;}
});

/* La misión puede iniciar por B6, A6 o A5. A4 ya no es una entrada inicial. */
GRAPH.ENTRADA=["B6","A6","A5"];

/* Sustituye K, check y flecha provisional por las imágenes subidas. */
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

/* Si ya había algún marcador al cargar la corrección, vuelve a dibujarlo. */
turnOffScanner();
refreshRoomMarkers();
