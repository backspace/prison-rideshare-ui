import { run } from '@ember/runloop';

export default function destroyApp(application) {
  run(application, 'destroy');
  localStorage.removeItem('person-token');
}
