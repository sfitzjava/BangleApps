(function (back) {
  const storage = require('Storage');
  const SETTINGS_FILE = "sysmpsfsd.json";

  const colors = {
    65535: 'White',
    63488: 'Red',
    65504: 'Yellow',
    2047: 'Cyan',
    2016: 'Green',
    31: 'Blue',
    0: 'Black',
  };
  
  function load(settings) {
    return Object.assign(settings, storage.readJSON(SETTINGS_FILE, 1) || {});
  }

  function save(settings) {
    storage.write(SETTINGS_FILE, settings);
  }
  
  const settings = load({
    color: 63488 /* red */,
    percision: 1000, /**1 sec */
  });

  const saveColor = (color) => () => {
    settings.color = color;
    save(settings);
    back();
  };

 const intervals = {
   "":{
     "titie":"Intervals",
     },
     "1  Sec": ()=>{settings.percision = 1000;  E.showMenu(mainmenu);},
     "5  Sec":()=>{settings.percision = 5000; E.showMenu(mainmenu);},
     "10 Sec": ()=>{settings.percision = 10000; E.showMenu(mainmenu);},
     "15 Sec":()=>{settings.percision = 15000; E.showMenu(mainmenu);},
     "30 Sec": ()=>{settings.percision = 30000; E.showMenu(mainmenu);},
     "Minute": ()=>{settings.percision = 60000; E.showMenu(mainmenu);},
     '< Back': ()=>{ E.showMenu(mainmenu);}
  };
  
  const colorMenu = {
    "":{
      "title":"Colors",
      selected: Object.keys(colors).indexOf(settings.color),
    },
    'White': ()=>{settings.color=65535; E.showMenu(mainmenu);},
    'Red': ()=>{settings.color=63488; E.showMenu(mainmenu);},
    'Yellow': ()=>{settings.color=65504; E.showMenu(mainmenu);},
    'Cyan': ()=>{settings.color=2047; E.showMenu(mainmenu);},
    'Green': ()=>{settings.color=2016; E.showMenu(mainmenu);},
    'Blue': ()=>{settings.color=31; E.showMenu(mainmenu);},
    'Black': ()=>{settings.color=0; E.showMenu(mainmenu);},
    '< Back': ()=>{E.showMenu(mainmenu);}
  };
   
  const mainmenu = {
    "":{
      "title":"SysMP Menu",
    },
    "< Back": ()=>{save(settings); back();},
    "Sec Interval":()=>{ E.showMenu(intervals);},
    "Color Theme": ()=>{E.showMenu(colorMenu);},
  };

 E.showMenu(mainmenu);
 /*
  function showMenu(items, opt) {
    items[''] = opt || {};
    items['interval'] = { E.showMenu(intervals)},
      value : settings.precision,
      format: v=>{ formatPercision(settings.precision+stepVal)},
      onchange : v => { settings.precision=parsePercision(settings.precision+stepVal); }
    };
    items['< Back'] = ()=>{save(settings); back();};
    E.showMenu(items);
  }

  showMenu(
    Object.keys(colors).reduce((menu, color) => {
      menu[colors[color]] = saveColor(color);
      return menu;
    }, {}),
    {
      title: 'Color',
      selected: Object.keys(colors).indexOf(settings.color)
    }
  );
  */
});
