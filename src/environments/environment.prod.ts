export const environment = {
  production: true
};

export let APIURL = '';

switch (window.location.hostname) {
  case 'am-motiv8r.herokuapp.com':
    APIURL = 'https://am-motiv8r-server.herokuapp.com'
    break;
  default:
    APIURL = 'http://localhost:3000';
}