import config from 'prison-rideshare-ui/config/environment';

export default function() {
  this.passthrough('/write-coverage');

  this.logging = config.mirageLogging;

  this.namespace = '/api';

  this.get('/rides', ({rides}, {queryParams}) => {
    if (queryParams["filter[name]"]) {
      return rides.all()[0];
    } else {
      return rides.all();
    }
  });
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
}
