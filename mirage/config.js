export default function() {
  this.namespace = '/api';

  this.get('/rides');
  this.post('/rides');
  this.patch('/rides/:id');

  this.get('/institutions');
  this.get('/people');

  this.get('/reimbursements');
  this.post('reimbursements');
}
