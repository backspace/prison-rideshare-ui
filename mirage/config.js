import config from 'prison-rideshare-ui/config/environment';
import Mirage from 'ember-cli-mirage';

export default function() {
  this.passthrough('/write-coverage');

  this.logging = config.mirageLogging;

  this.namespace = '/api';

  this.get('/rides', function({rides}, {queryParams}) {
    if (queryParams["filter[name]"]) {
      // FIXME this is a mess, no better way???
      const nameFilter = queryParams["filter[name]"];
      const matchingRides = rides.all().models.filter(ride => (ride.name || '').toLowerCase().includes(nameFilter));
      return {
        data: matchingRides.map(ride => this.serialize(ride)['data'])
      }
    } else {
      return rides.all();
    }
  });
  this.get('/rides/:id');
  this.post('/rides');
  this.patch('/rides/:id');

  this.get('/institutions');
  this.post('/institutions');
  this.patch('/institutions/:id');

  this.get('/people');
  this.post('/people');
  this.patch('/people/:id');

  this.get('/debts');
  this.delete('/debts/:id');

  this.get('/reimbursements');
  this.post('reimbursements');
  this.patch('/reimbursements/:id');

  this.get('/users');
  this.patch('/users/:id');

  this.get('/users/current', ({ users }) => {
    return users.first();
  });

  this.get('/slots');

  this.post('/commitments', function({ commitments }, request) {
    if (request.requestHeaders.Authorization === 'Person Bearer XXX') {
      const attrs = this.normalizedRequestAttrs();
      return commitments.create(attrs);
    } else {
      return new Mirage.Response(401, {}, {});
    }
  });

  this.delete('/commitments/:id');

  this.post('/people/token', function(db, { requestBody }) {
    const bodyParams = parseQueryString(requestBody);

    if (bodyParams.grant_type === 'magic' && bodyParams.token === 'MAGIC??TOKEN') {
      return {
        access_token: 'XXX'
      };
    } else {
      return new Mirage.Response(401, {}, {});
    }
  });
}

// Taken from https://gist.github.com/Manc/9409355

function parseQueryString(query) {
  var obj = {},
    qPos = query.indexOf("?"),
    tokens = query.substr(qPos + 1).split('&'),
    i = tokens.length - 1;
  if (qPos !== -1 || query.indexOf("=") !== -1) {
    for (; i >= 0; i--) {
      var s = tokens[i].split('=');
      obj[unescape(s[0])] = s.hasOwnProperty(1) ? unescape(s[1]) : null;
    }
  }
  return obj;
}
