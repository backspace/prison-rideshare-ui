import { module } from 'qunit';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

const { RSVP: { resolve } } = Ember;

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();

      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments);
      }
    },

    afterEach() {
      let afterEach = options.afterEach && options.afterEach.apply(this, arguments);

      const toaster = this.application.__container__.lookup('service:paper-toaster');
      const activeToast = toaster.get('activeToast');
      const cancelToastPromise = activeToast ?
        resolve(Ember.run(() => toaster.cancelToast(activeToast))) :
        resolve(true);

      return cancelToastPromise.then(() => resolve(afterEach)).then(() => destroyApp(this.application));
    }
  });
}
