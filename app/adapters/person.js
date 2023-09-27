import ApplicationAdapter from './application';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default ApplicationAdapter.extend({
  router: service(),

  onCalendar: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName') === 'calendar';
  }),

  get headers() {
    if (this.get('onCalendar')) {
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
  },

  urlForUpdateRecord(id, modelName, snapshot) {
    if (this.get('onCalendar')) {
      return this._super('me', modelName, snapshot);
    } else {
      return this._super(...arguments);
    }
  },
});
