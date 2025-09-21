/* eslint-disable ember/no-classic-classes */
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import config from 'prison-rideshare-ui/config/environment';

export default Service.extend({
  paperToaster: service(),

  show(message) {
    this.paperToaster.show(message, {
      duration: config.toastDuration,
      position: 'top right',
    });
  },
});
