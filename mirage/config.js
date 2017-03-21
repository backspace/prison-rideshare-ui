export default function() {
  this.namespace = '/api';

  this.get('/rides');
  this.post('/rides');
  this.patch('/rides/:id');

  this.get('/institutions');

  this.get('/people');
  this.patch('/people/:id');

  this.get('/debts');
  this.delete('/debts/:id');

  this.get('/reimbursements');
  this.post('reimbursements');
  this.patch('/reimbursements/:id');

  this.get('/users');
  this.patch('/users/:id');
}
