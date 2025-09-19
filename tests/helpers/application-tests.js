import { setupApplicationTest as qunitSetup } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

function setupApplicationTest(hooks) {
  qunitSetup(hooks);
  setupMirage(hooks);

  hooks.afterEach(function () {
    let toasts = this.owner.lookup('service:paperToaster');
    toasts.get('queue').forEach((toast) => toasts.cancelToast(toast));
  });
}

export { setupApplicationTest };
