/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/require-tagless-components */
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Component from '@ember/component';
import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';
import {
  HdsModal,
  HdsButton,
  HdsFormCheckboxField,
  HdsFormTextInputField,
  HdsFormSelectField,
  HdsIcon,
} from '@hashicorp/design-system-components/components';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import eq from 'ember-truth-helpers/helpers/eq';

const reasons = Object.keys(reasonToIcon).sort();
const shortcuts = ['driver not found', 'visitor'];

const shortcutReasonToIcon = shortcuts.reduce(
  (shortcutReasonToIcon, shortcut) => {
    shortcutReasonToIcon[shortcut] = reasonToIcon[shortcut];
    return shortcutReasonToIcon;
  },
  {},
);

@classic
export default class CancellationForm extends Component {
  reasons = reasons;
  shortcutReasonToIcon = shortcutReasonToIcon;

  <template>
    <HdsModal
      data-test-cancellation-form
      {{on 'cancel' this.handleDialogCancel}}
      as |M|
    >
      <M.Header>
        {{#if this.ride.children}}
          <div data-test-cancellation-notice>
            <HdsIcon @name='alert-triangle' @size='16' />
            Cancelling a ride with rides combined into it will cause the
            combined rides to also disappear. Uncombine them if this is
            undesirable.
          </div>
        {{/if}}
        <h2>Cancel a ride</h2>
      </M.Header>

      <M.Body>
        <form {{on 'submit' this.handleSubmit}}>
          <div data-test-cancellation-shortcuts>
            {{#each-in this.shortcutReasonToIcon as |reason icon|}}
              <HdsButton
                @text={{reason}}
                @icon={{icon}}
                @color='secondary'
                @size='small'
                data-test-cancellation-shortcut
                {{on 'click' (fn this.cancelViaShortcut reason)}}
              />
            {{/each-in}}
          </div>

          <hr />

          <HdsFormCheckboxField
            data-test-cancellation-cancelled
            checked={{if this.ride.cancelled true undefined}}
            {{on 'change' (fn this.toggleCheckbox 'cancelled')}}
            as |Field|
          >
            <Field.Label>Cancelled?</Field.Label>
          </HdsFormCheckboxField>

          <HdsFormSelectField
            name='reason'
            {{on 'change' this.updateCancellationReason}}
            data-test-cancellation-reason-select
            as |Field|
          >
            <Field.Label>Reason</Field.Label>
            <Field.Options>
              {{#each this.reasons as |optionText|}}
                <option
                  value={{optionText}}
                  selected={{eq optionText this.ride.cancellationReason}}
                >{{optionText}}</option>
              {{/each}}
            </Field.Options>
          </HdsFormSelectField>

          <HdsFormTextInputField
            data-test-cancellation-other
            @value={{this.ride.cancellationReason}}
            @isInvalid={{false}}
            {{on 'input' this.updateCancellationReason}}
            as |Field|
          >
            <Field.Label>Other reason</Field.Label>
          </HdsFormTextInputField>
        </form>
      </M.Body>

      <M.Footer>
        <HdsButton
          @text='Cancel'
          @color='secondary'
          data-test-cancellation-form-cancel
          {{on 'click' this.handleCancel}}
        />
        <HdsButton
          @text='Save'
          @color='primary'
          data-test-cancellation-form-save
          {{on 'click' this.handleSubmit}}
        />
      </M.Footer>
    </HdsModal>
  </template>

  @action
  handleDialogCancel(event) {
    event?.preventDefault?.();
    this.handleCancel();
  }

  @action
  handleSubmit(event) {
    event?.preventDefault?.();
    this.save?.();
  }

  @action
  handleCancel(event) {
    event?.preventDefault?.();
    this.cancel?.();
  }

  @action
  toggleCheckbox(property, event) {
    const checked = event?.target?.checked ?? false;
    this.set(`ride.${property}`, checked);
    if (!checked) {
      this.set('ride.cancellationReason', null);
    }
  }

  @action
  cancelViaShortcut(reason) {
    this.set('ride.cancelled', true);
    this.set('ride.cancellationReason', reason);
    this.save?.();
  }

  @action
  updateCancellationReason(event) {
    this.set('ride.cancellationReason', event?.target?.value);
  }
}
