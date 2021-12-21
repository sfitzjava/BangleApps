// // place your const, vars, functions or classes here

// // special function to handle display switch on
// Bangle.on('lcdPower', (on) => {
//   if (on) {
//     // call your app function here
//     // If you clear the screen, do Bangle.drawWidgets();
//   }
// });

// g.clear();
// // call your app function here


const locale = require("locale");
const storage = require('Storage');

const is12Hour = (storage.readJSON("setting.json", 1) || {})["12hour"];
const settingVals = storage.readJSON("sysmpsfsd.json", 1);
const color = ( settingVals||{})["color"] || 63488 /* red */;
const percision = ( settingVals||{})["percision"] || 1000;
 
/* Clock *********************************************/
const scale = g.getWidth() / 176;
const widget = 24;

const viewport = {
  width: g.getWidth(),
  height: g.getHeight(),
};

const center = {
  x: viewport.width / 2,
  y: Math.round(((viewport.height - widget) / 2) + widget),
};

function d02(value) {
  return ('0' + value).substr(-2);
}

function draw() {
  g.reset();
  g.clearRect(0, widget, viewport.width, viewport.height);
  const now = new Date();

  const hour = d02(now.getHours() - (is12Hour && now.getHours() > 12 ? 12 : 0));
  const minutes = d02(now.getMinutes());
  const sec = ':'+d02(now.getSeconds());

  const day = d02(now.getDate());
  const month = d02(now.getMonth() + 1);
  const year = now.getFullYear();

  const month2 = locale.month(now, 3);
  const day2 = locale.dow(now, 3);

  g.setColor(color);
  g.setFontAlign(1, 0).setFont("Vector", 90 * scale);
  g.drawString(hour, center.x + 32 * scale, center.y - 31 * scale);
  g.drawString(minutes, center.x + 32 * scale, center.y + 46 * scale);

  g.fillRect(center.x + 30 * scale, center.y - 72 * scale, center.x + 32 * scale, center.y + 74 * scale);

  g.setFontAlign(-1, 0).setFont("Vector", 16 * scale);
  g.drawString(year, center.x + 40 * scale, center.y - 62 * scale);
  g.drawString(month, center.x + 40 * scale, center.y - 44 * scale);
  g.drawString(day, center.x + 40 * scale, center.y - 26 * scale);
  g.drawString(sec, center.x + 40 * scale, center.y + 10 * scale);
  g.drawString(month2, center.x + 40 * scale, center.y + 48 * scale);
  g.drawString(day2, center.x + 40 * scale, center.y + 66 * scale);
}



/* Minute Ticker *************************************/

let ticker;

function stopTick() {
  if (ticker) {
    clearTimeout(ticker);
    ticker = undefined;
  }
}

function startTick(run) {
  stopTick();
  run();
  ticker = setTimeout(() => startTick(run), percision - (Date.now() % percision));
  // ticker = setTimeout(() => startTick(run), 3000);
}

/* Init **********************************************/
function drawSettings() {
  g.clearRect(0, 24, g.getWidth(), g.getHeight());
  g.setFontAlign(1, 0).setFont("Vector", 16 * scale);
  g.drawString("page", center.x + 32 * scale, center.y - 31 * scale);
  g.drawString("settings", center.x + 32 * scale, center.y + 46 * scale);
}

function drawApps(){
  g.clearRect(0, 24, g.getWidth(), g.getHeight());
  g.setFontAlign(1, 0).setFont("Vector", 16 * scale);
  g.drawString("page", center.x + 32 * scale, center.y - 31 * scale);
  g.drawString("launcher", center.x + 32 * scale, center.y + 46 * scale);
}

g.clear();
startTick(draw);
let page=0;

Bangle.on('swipe', (dir)=>{
    stopTick();
    page += dir;
    if( page < -1 || page > 1)
      page = dir;
    switch(page)
    {
      case -1: // page settings
        drawSettings();
        break;

      case 1:  // page app-launcher
        drawApps();
        break;

      case 0: // clock face
      default:
        startTick(draw);
        break;
    }

});

let dragActive = false;
let startx = 0;
let starty = 0;

Bangle.on('drag', (evt)=>{
  stopTick();
  
  if(evt.b==1 && !dragActive)
  {
    dragActive = true;
    startx = evt.x;
    starty = evt.y;
  }
  else if(evt.b==0 && dragActive)
  {
    dragActive = false;
     startx -=  evt.x;
     starty -=  evt.y;
    if(starty > 0 && starty > 10)
      page += 1;
    else if(starty < 0 && starty < -10)
      page -= 1;
    
    startx=0;
    starty=0;
     switch(page)
    {
      case -1: // page settings
        drawSettings();
        break;

      case 1:  // page app-launcher
        drawApps();
        break;

      case 0: // clock face
      default:
        startTick(draw);
        break;
    }
  } 

});

Bangle.on('lcdPower', (on) => {
  if (on) {
    startTick(draw);
  } else {
    stopTick();
  }
});

Bangle.loadWidgets();
Bangle.drawWidgets();

Bangle.setUI("clock");
