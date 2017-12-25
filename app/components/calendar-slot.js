import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'prison-rideshare-ui/config/environment';

export default Component.extend({
  paperToaster: service(),
  store: service(),

  isCommittedTo: computed('slot.commitments.length', 'person', function() {
    const personId = this.get('person.id');

    return this.get('slot.commitments').map(slot => slot.belongsTo('person').id()).includes(personId);
  }),

  click() {
    if (this.get('isCommittedTo')) {
      this.get('slot.commitments.firstObject').destroyRecord().catch(() => {
        this.get('paperToaster').show('Couldn’t save your change', {
          duration: config.toastDuration,
          position: 'top right'
        });
      });
    } else if (this.get('slot.isNotFull')) {
      const newRecord = this.get('store').createRecord('commitment', {
        slot: this.get('slot'),
        person: this.get('person')
      });

      newRecord.save().catch(() => {
        this.get('paperToaster').show('Couldn’t save your change', {
          duration: config.toastDuration,
          position: 'top right'
        });
        newRecord.destroyRecord();
      });
    }
  }
});
