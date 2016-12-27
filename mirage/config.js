export default function() {
  this.namespace = '/api';

  this.get('/rides');
  this.post('/rides');

  this.get('/institutions');
  this.get('/people');
}
