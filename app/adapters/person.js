import ApplicationAdapter from './application';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default ApplicationAdapter.extend({
  router: service(),

  onCalendar: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName') === 'calendar';
  }),

  headers: computed(function() {
    if (this.get('onCalendar')) {
      const personToken = localStorage.getItem('person-token');
      return {
        Authorization: `Person Bearer ${personToken}`,
      };
    } else {
      return {};
    }
  }).volatile(),

  urlForUpdateRecord(id, modelName, snapshot) {
    if (this.get('onCalendar')) {
      return this._super('me', modelName, snapshot);
    } else {
      return this._super(...arguments);
    }
  },
});
