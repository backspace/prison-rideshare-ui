/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/no-get, ember/require-tagless-components */
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import formatBriefTimespan from 'prison-rideshare-ui/utils/format-brief-timespan';
import moment from 'moment';

import { task } from 'ember-concurrency';

export default Component.extend({
  moment: service(),
  toasts: service(),
  store: service(),

  isCommittedTo: reads('commitment'),

  commitment: computed(
    'person.id',
    'slot.commitments.@each.person',
    function () {
      const personId = this.get('person.id');

      return this.get('slot.commitments').find(
        (slot) => slot.belongsTo('person').id() == personId
      );
    }
  ),

  timespan: computed('slot.{start,end}', function () {
    return formatBriefTimespan(
      this.moment,
      this.get('slot.start'),
      this.get('slot.end'),
      false
    );
  }),

  hidden: computed('slot.isNotFull', 'isCommittedTo', function () {
    return !this.get('slot.isNotFull') && !this.isCommittedTo;
  }),

  disabled: computed(
    'isCommittedTo',
    'slot.{isNotFull,start}',
    'toggle.isRunning',
    function () {
      const isNotFull = this.get('slot.isNotFull');
      const start = this.get('slot.start');
      const toggleIsRunning = this.get('toggle.isRunning');

      if (toggleIsRunning) {
        return true;
      } else if (start < new Date()) {
        return true;
      } else if (!isNotFull) {
        return !this.isCommittedTo;
      } else {
        return false;
      }
    }
  ),

  capacity: computed('slot.{count,commitments.length}', function () {
    const dividend = this.get('slot.commitments.length');

    const count = this.get('slot.count');
    const divisor = count === 0 ? '∞' : count;

    return `${dividend}/${divisor}`;
  }),

  toggle: task(function* () {
    if (this.isCommittedTo) {
      try {
        yield this.commitment.destroyRecord();

        this.toasts.show(
          `Cancelled your agreement to drive on ${moment(
            this.get('slot.start')
          ).format('MMMM D')}`
        );
      } catch (error) {
        const errorDetail = get(error, 'errors.firstObject.detail');
        this.toasts.show(errorDetail || 'Couldn’t save your change');
      }
    } else if (this.get('slot.isNotFull')) {
      const newRecord = this.store.createRecord('commitment', {
        slot: this.slot,
        person: this.person,
      });

      try {
        yield newRecord.save();

        this.toasts.show(
          `Thanks for agreeing to drive on ${moment(
            this.get('slot.start')
          ).format('MMMM D')}!`
        );
      } catch (error) {
        const errorDetail = get(error, 'errors.firstObject.detail');
        this.toasts.show(errorDetail || 'Couldn’t save your change');
        newRecord.destroyRecord();
      }
    }
  }).drop(),
});
