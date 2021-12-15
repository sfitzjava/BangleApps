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
  }
 
  function load(settings) {
    return Object.assign(settings, storage.readJSON(SETTINGS_FILE, 1) || {});
  }

  function save(settings) {
    storage.write(SETTINGS_FILE, settings)
  }

  const settings = load({
    color: 63488 /* red */,
    precision: 1000, /**1 sec */
  });

  const saveColor = (color) => () => {
    settings.color = color;
    save(settings);
    back();
  };

  function selectPercision(){
    return percision<10000?10000:percision<15000?15000:percision<30000?30000:percision<60000?60000:1000;
  }

  function showMenu(items, opt) {
    items[''] = opt || {};
    items['interval'] = {
      value:settings.precision,
      onchange: settings.precision<10000?10000:settings.percision<15000?15000:settings.percision<30000?30000:settings.percision<60000?60000:1000
    };
    items['< Back'] = save(settings); back();
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
});
