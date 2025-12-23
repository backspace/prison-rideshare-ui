import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import formatBriefTimespan from 'prison-rideshare-ui/utils/format-brief-timespan';
import moment from 'moment-timezone';
import { task } from 'ember-concurrency';
import gt from 'ember-truth-helpers/helpers/gt';
import perform from 'ember-concurrency/helpers/perform';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { HdsFormCheckboxField } from '@hashicorp/design-system-components/components';

export default class CalendarSlot extends Component {
  <template>
    <div class='slot {{if this.hidden "hidden"}}' data-test-calendar-slot>
      {{#if this.count}}
        <span class='hours' data-test-slot-hours>
          {{this.timespan}}
        </span>
        <button
          class='count
            {{if (gt this.slot.commitments.length 0) "committed-to"}}'
          {{on 'click' (fn this.setViewingSlot this.slot)}}
          type='button'
          data-test-slot-count
        >
          {{this.capacity}}
        </button>
      {{else}}
        <HdsFormCheckboxField
          checked={{this.isCommittedTo}}
          disabled={{this.disabled}}
          aria-busy={{this.toggle.isRunning}}
          data-test-slot-checkbox
          {{on 'input' (perform this.toggle)}}
          as |Field|
        >
          <Field.Label>
            <span class='hours' data-test-slot-hours>
              {{this.timespan}}
            </span>
          </Field.Label>
        </HdsFormCheckboxField>
      {{/if}}
    </div>
  </template>
  @service
  moment;

  @service
  toasts;

  @service
  store;

  get slot() {
    return this.args.slot;
  }

  get person() {
    return this.args.person;
  }

  get count() {
    return this.args.count;
  }

  get setViewingSlot() {
    return this.args.setViewingSlot;
  }

  get isCommittedTo() {
    return Boolean(this.commitment);
  }

  get commitment() {
    const personId = this.person?.id;

    return this.slot?.commitments?.find(
      (commitment) => commitment.belongsTo('person').id() == personId,
    );
  }

  get timespan() {
    return formatBriefTimespan(
      this.moment,
      this.slot?.start,
      this.slot?.end,
      false,
    );
  }

  get hidden() {
    return !this.slot?.isNotFull && !this.isCommittedTo;
  }

  get disabled() {
    const isNotFull = this.slot?.isNotFull;
    const start = this.slot?.start;
    const toggleIsRunning = this.toggle.isRunning;

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

  get capacity() {
    const dividend = this.slot?.commitments?.length ?? 0;

    const count = this.slot?.count;
    const divisor = count === 0 ? '∞' : count;

    return `${dividend}/${divisor}`;
  }

  toggle = task({ drop: true }, async (event) => {
    event.preventDefault();

    // This is a hack to restore the correct checked status if saving fails.
    const checkbox = event.target;

    if (this.isCommittedTo) {
      try {
        await this.commitment.destroyRecord();

        this.args.setError(undefined);
        this.toasts.show(
          `Cancelled your agreement to drive on ${moment(
            this.slot?.start,
          ).format('MMMM D')}`,
        );
      } catch (error) {
        if (checkbox) {
          checkbox.checked = true;
        }

        const errorDetail = error?.errors?.[0]?.detail;
        this.args.setError(errorDetail || 'Couldn’t save your change');
      }
    } else if (this.slot?.isNotFull) {
      const newRecord = this.store.createRecord('commitment', {
        slot: this.slot,
        person: this.person,
      });

      try {
        await newRecord.save();

        this.args.setError(undefined);
        this.toasts.show(
          `Thanks for agreeing to drive on ${moment(this.slot?.start).format(
            'MMMM D',
          )}!`,
        );
      } catch (error) {
        const errorDetail = error?.errors?.[0]?.detail;
        this.args.setError(errorDetail || 'Couldn’t save your change');
        newRecord.destroyRecord();

        if (checkbox) {
          checkbox.checked = false;
        }
      }
    }
  });
}
