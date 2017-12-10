import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
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
      this.get('slot.commitments.firstObject').destroyRecord();
    } else {
      this.get('store').createRecord('commitment', { slot: this.get('slot') }).save();
    }
  }
});
