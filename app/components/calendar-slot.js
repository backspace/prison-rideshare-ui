import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import formatBriefTimespan from 'prison-rideshare-ui/utils/format-brief-timespan';

export default Component.extend({
  toasts: service(),
  store: service(),

  isCommittedTo: reads('commitment'),

  commitment: computed('slot.commitments.@each.person', 'person', function() {
    const personId = this.get('person.id');

    return this.get('slot.commitments').find(slot => slot.belongsTo('person').id() == personId);
  }),

  timespan: computed('slot.{start,end}', function() {
    return formatBriefTimespan(this.get('slot.start'), this.get('slot.end'), false);
  }),

  capacity: computed('slot.{count,commitments.length}', function() {
    const dividend = this.get('slot.commitments.length');

    const count = this.get('slot.count');
    const divisor = count === 0 ? '∞' : count;

    return `${dividend}/${divisor}`;
  }),

  actions: {
    toggle() {
      if (this.get('isCommittedTo')) {
        this.get('commitment').destroyRecord().catch(() => {
          this.get('toasts').show('Couldn’t save your change');
        });
      } else if (this.get('slot.isNotFull')) {
        const newRecord = this.get('store').createRecord('commitment', {
          slot: this.get('slot'),
          person: this.get('person')
        });

        newRecord.save().catch(() => {
          this.get('toasts').show('Couldn’t save your change');
          newRecord.destroyRecord();
        });
      }
    }
  }
});
