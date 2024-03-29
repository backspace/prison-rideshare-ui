import ApplicationAdapter from './application';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default ApplicationAdapter.extend({
  router: service(),

  onAdminCalendar: computed.equal('router.currentRouteName', 'admin-calendar'),

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
  },
});
