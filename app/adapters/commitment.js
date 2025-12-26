/* eslint-disable ember/classic-decorator-no-classic-methods, ember/no-computed-properties-in-native-classes, ember/no-get */
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import ApplicationAdapter from './application';

export default class Commitment extends ApplicationAdapter {
  @service
  router;

  @equal('router.currentRouteName', 'admin-calendar')
  onAdminCalendar;

  get headers() {
    if (this.onAdminCalendar) {
      const token = this.get('session.data.authenticated.access_token');
      return {
        Authorization: `Bearer ${token}`,
      };
    } else {
      const personToken = localStorage.getItem('person-token');
      return {
        Authorization: `Person Bearer ${personToken}`,
      };
    }
  }
}
