/* eslint-disable ember/no-classic-classes */
import classic from 'ember-classic-decorator';
import Service, { inject as service } from '@ember/service';
import config from 'prison-rideshare-ui/config/environment';

@classic
export default class ToastsService extends Service {
  @service
  paperToaster;

  show(message) {
    this.paperToaster.show(message, {
      duration: config.toastDuration,
      position: 'top right',
    });
  }
}
