/* eslint-disable no-console */
// TODO: Clean up this whole file wih the HMR functionality
import http from 'http';

let app = require('./server').default;

const server = http.createServer(app);
let currentApp = app;

/**
 * Please note that whole process.env object is inlined during build
 * https://github.com/jaredpalmer/razzle/issues/356
 * Using this function as a workaround to the problem
 */
const getEnv = (name) => process.env[name];
const port = getEnv('PORT') || 8080;

server.listen(port, (error) => {
  if (error) {
    console.log('Server failed to start with error: ', error);
  }

  console.log(`Server has started at port ${port}!`);
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      // eslint-disable-next-line global-require
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}
