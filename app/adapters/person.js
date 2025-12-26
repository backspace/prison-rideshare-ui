/* eslint-disable ember/classic-decorator-no-classic-methods, ember/no-computed-properties-in-native-classes, ember/no-get */
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import ApplicationAdapter from './application';

export default class Person extends ApplicationAdapter {
  @service
  router;

  @equal('router.currentRouteName', 'calendar')
  onCalendar;

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
