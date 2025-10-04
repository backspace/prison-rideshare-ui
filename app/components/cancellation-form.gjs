/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/require-tagless-components */
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Component from '@ember/component';
import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';
import PaperDialog from 'prison-rideshare-ui/components/placeholder';
import PaperDialogContent from 'prison-rideshare-ui/components/placeholder';
import PaperCard from 'prison-rideshare-ui/components/placeholder';
import PaperForm from 'prison-rideshare-ui/components/placeholder';
import PaperButton from 'prison-rideshare-ui/components/placeholder';
import paperIcon from 'prison-rideshare-ui/components/placeholder';
import PaperCheckbox from 'prison-rideshare-ui/components/placeholder';
import PaperSelect from 'prison-rideshare-ui/components/placeholder';
import PaperDialogActions from 'prison-rideshare-ui/components/placeholder';
import { fn } from '@ember/helper';

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
  <template>
    <PaperDialog @onClose={{this.cancel}} @clickOutsideToClose={{true}}>
      <PaperDialogContent>
        {{#if this.ride.children}}
          <PaperCard as |card|>
            <card.content>
              Cancelling a ride with rides combined into it will cause the
              combined rides to also disappear. Uncombine them if this is
              undesirable.
            </card.content>
          </PaperCard>
        {{/if}}

        <h2 class='md-title'>
          Cancel a ride
        </h2>

        <PaperForm @onSubmit={{this.save}} as |form|>
          <div class='layout layout-sm-column'>
            {{#each-in this.shortcutReasonToIcon as |reason icon|}}
              <PaperButton
                @raised={{true}}
                @class='shortcut'
                @onClick={{fn this.cancelViaShortcut reason}}
              >
                {{paperIcon icon}}
                {{reason}}
              </PaperButton>
            {{/each-in}}
          </div>

          <hr />

          <div class='layout layout-sm-column'>
            <PaperCheckbox
              @value={{this.ride.cancelled}}
              @onChange={{this.cancelledChanged}}
            >
              Cancelled?
            </PaperCheckbox>
          </div>

          <div class='layout layout-sm-column'>
            <PaperSelect
              @class='reason'
              @placeholder='Reason'
              @selected={{this.ride.cancellationReason}}
              @options={{this.reasons}}
              @onChange={{this.updateCancellationReason}}
              as |reason|
            >
              {{reason}}
            </PaperSelect>
          </div>

          <form.input
            @class='other'
            @label='Other reason'
            @value={{this.ride.cancellationReason}}
            @onChange={{this.updateCancellationReason}}
          />
        </PaperForm>
      </PaperDialogContent>

      <PaperDialogActions @class='layout-row'>
        <PaperButton @class='cancel' @onClick={{this.cancel}}>
          Cancel
        </PaperButton>
        <PaperButton @class='submit' @primary={{true}} @onClick={{this.save}}>
          Save
        </PaperButton>
      </PaperDialogActions>
    </PaperDialog>
  </template>
  reasons = reasons;
  shortcutReasonToIcon = shortcutReasonToIcon;

  @action
  cancelledChanged(cancelled) {
    if (!cancelled) {
      this.set('ride.cancellationReason', null);
    }

    this.set('ride.cancelled', cancelled);
  }

  @action
  cancelViaShortcut(reason) {
    this.set('ride.cancelled', true);
    this.set('ride.cancellationReason', reason);
    this.save();
  }

  @action updateCancellationReason(reason) {
    this.set('ride.cancellationReason', reason);
  }
}
