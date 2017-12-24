import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'prison-rideshare-ui/config/environment';

export default Component.extend({
  paperToaster: service(),
  store: service(),

  isCommittedTo: computed('slot.commitments.length', function() {
    if (this.get('slot.commitments.length')) {
      return true;
    } else {
      return false;
    }
  }),

  click() {
    if (this.get('isCommittedTo')) {
      this.get('slot.commitments.firstObject').destroyRecord().catch(() => {
        this.get('paperToaster').show('Couldn’t save your change', {
          duration: config.toastDuration,
          position: 'top right'
        });
      });
    } else {
      this.get('store').createRecord('commitment', { slot: this.get('slot') }).save();
    }
  }
});
