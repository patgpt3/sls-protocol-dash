global.React = require('react'); // Global react object @see https://stackoverflow.com/questions/30233357/
// import '../../package'; // unecessary import to work with isolateModules

process.env = {
  ...process.env,
  api_base_uri: '',
};
