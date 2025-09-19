import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import ApplicationAdapter from './application';

@classic
export default class Person extends ApplicationAdapter {
  @service
  router;

  onCalendar = computed.equal('router.currentRouteName', 'calendar');

  get headers() {
    if (this.onCalendar) {
      const personToken = localStorage.getItem('person-token');
      return {
        Authorization: `Person Bearer ${personToken}`,
      };
    } else {
      // FIXME this is duplicated from application adapter
      let { access_token } = this.get('session.data.authenticated');

      if (access_token) {
        return {
          Authorization: `Bearer ${access_token}`,
        };
      }
    }

    return {};
  }

  urlForUpdateRecord(id, modelName, snapshot) {
    if (this.onCalendar) {
      return super.urlForUpdateRecord('me', modelName, snapshot);
    } else {
      return super.urlForUpdateRecord(...arguments);
    }
  }
}
