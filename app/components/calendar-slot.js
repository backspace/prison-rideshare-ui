import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import formatBriefTimespan from 'prison-rideshare-ui/utils/format-brief-timespan';
import moment from 'moment';

import { task } from 'ember-concurrency';

@classic
export default class CalendarSlot extends Component {
  @service
  moment;

  @service
  toasts;

  @service
  store;

  @reads('commitment')
  isCommittedTo;

  @computed('person.id', 'slot.commitments.@each.person')
  get commitment() {
    const personId = this.get('person.id');

    return this.get('slot.commitments').find(
      (slot) => slot.belongsTo('person').id() == personId
    );
  }

  @computed('slot.{start,end}')
  get timespan() {
    return formatBriefTimespan(
      this.moment,
      this.get('slot.start'),
      this.get('slot.end'),
      false
    );
  }

  @computed('slot.isNotFull', 'isCommittedTo')
  get hidden() {
    return !this.get('slot.isNotFull') && !this.isCommittedTo;
  }

  @computed('isCommittedTo', 'slot.{isNotFull,start}', 'toggle.isRunning')
  get disabled() {
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

  @computed('slot.{count,commitments.length}')
  get capacity() {
    const dividend = this.get('slot.commitments.length');

    const count = this.get('slot.count');
    const divisor = count === 0 ? '∞' : count;

    return `${dividend}/${divisor}`;
  }

  @(task(function* () {
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
  }).drop())
  toggle;
}
