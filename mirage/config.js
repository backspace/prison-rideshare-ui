import config from 'prison-rideshare-ui/config/environment';
import Mirage from 'ember-cli-mirage';
import { isEmpty } from '@ember/utils';

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

  this.get('/gas-prices');

  this.get('/people');
  this.get('/people/:id');
  this.post('/people');
  this.patch('/people/:id');

  this.patch('/people/me', function({ people }, request) {
    if (request.requestHeaders.Authorization.startsWith('Person Bearer')) {
      const [, , accessToken] = request.requestHeaders.Authorization.split(' ');
      const person = people.findBy({accessToken});

      if (person) {
        const attrs = this.normalizedRequestAttrs();

        if (isEmpty(attrs.name)) {
          return new Mirage.Response(422, {}, {
            errors: [{
              'source': {
                'pointer': '/data/attributes/name'
              },
              'detail': 'Name can\'t be blank'
            }]
          });
        } else {
          return person.update(this.normalizedRequestAttrs());
        }
      }
    }
    return new Mirage.Response(401, {}, {});
  });

  this.get('/debts');
  this.delete('/debts/:id');

  this.get('/reimbursements');
  this.post('reimbursements');
  this.patch('/reimbursements/:id');

  this.get('/users');
  this.patch('/users/:id');

  this.get('/posts');

  this.get('/users/current', ({ users }) => {
    return users.first();
  });

  this.get('/slots');

  this.post('/commitments', function({ commitments, people }, request) {
    const authorizationHeader = request.requestHeaders.Authorization;

    if (authorizationHeader.startsWith('Person Bearer')) {
      const [, , accessToken] = authorizationHeader.split(' ');
      const person = people.findBy({accessToken});
      const attrs = this.normalizedRequestAttrs();

      if (person && attrs.personId === person.id) {
        return commitments.create(attrs);
      }
    } else if (authorizationHeader.startsWith('Bearer')) {
      const attrs = this.normalizedRequestAttrs();
      return commitments.create(attrs);
    }

    return new Mirage.Response(401, {}, {});
  });

  this.delete('/commitments/:id');

  this.post('/people/token', function({ people }, { requestBody }) {
    const bodyParams = parseQueryString(requestBody);
    const person = people.findBy({magicToken: bodyParams.token});

    if (bodyParams.grant_type === 'magic' && person) {
      return {
        access_token: person.accessToken
      };
    } else {
      return new Mirage.Response(401, {}, {
        errors: [{
          status: 401,
          title: 'Unauthorized'
        }]
      });
    }
  });

  this.get('/people/me', function({ people }, { queryParams }) {
    const accessToken = queryParams.token;
    const person = people.findBy({accessToken});

    return person;
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
