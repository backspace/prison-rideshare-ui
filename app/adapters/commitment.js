import ApplicationAdapter from './application';
import { computed } from '@ember/object';

export default ApplicationAdapter.extend({
  headers: computed(function() {
    const personToken = localStorage.getItem('person-token');
    return {
      'Authorization': `Person Bearer ${personToken}`
    };
  }).volatile()
});
