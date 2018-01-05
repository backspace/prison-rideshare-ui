import { run } from '@ember/runloop';

export default function destroyApp(application) {
  run(application, 'destroy');
  server.shutdown();
  localStorage.removeItem('person-token');
}
