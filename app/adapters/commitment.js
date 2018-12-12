import ApplicationAdapter from './application';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default ApplicationAdapter.extend({
  router: service(),

  onAdminCalendar: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName') === 'admin-calendar';
  }),

  headers: computed(function() {
    if (this.get('onAdminCalendar')) {
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
  }).volatile(),
});
