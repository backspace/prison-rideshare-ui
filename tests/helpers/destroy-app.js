import Ember from 'ember';

export default function destroyApp(application) {
  Ember.run(application, 'destroy');
  // FIXME this was inserted by the generator but…
  // server.shutdown();
}
