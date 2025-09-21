/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/require-tagless-components */
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Component from '@ember/component';
import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';
import PaperDialog from "ember-paper/components/paper-dialog";
import PaperDialogContent from "ember-paper/components/paper-dialog-content";
import PaperCard from "ember-paper/components/paper-card";
import PaperForm from "ember-paper/components/paper-form";
import PaperButton from "ember-paper/components/paper-button";
import paperIcon from "ember-paper/components/paper-icon";
import PaperCheckbox from "ember-paper/components/paper-checkbox";
import PaperSelect from "ember-paper/components/paper-select/component";
import PaperDialogActions from "ember-paper/components/paper-dialog-actions";

const reasons = Object.keys(reasonToIcon).sort();
const shortcuts = ['driver not found', 'visitor'];

const shortcutReasonToIcon = shortcuts.reduce(
  (shortcutReasonToIcon, shortcut) => {
    shortcutReasonToIcon[shortcut] = reasonToIcon[shortcut];
    return shortcutReasonToIcon;
  },
  {}
);

@classic
export default class CancellationForm extends Component {<template>{{!-- template-lint-disable no-action --}}
<PaperDialog @onClose={{this.cancel}} @clickOutsideToClose={{true}}>
  <PaperDialogContent>
    {{#if this.ride.children}}
      <PaperCard as |card|>
        <card.content>
          Cancelling a ride with rides combined into it will cause the combined rides to also disappear. Uncombine them if this is undesirable.
        </card.content>
      </PaperCard>
    {{/if}}

    <h2 class="md-title">
      Cancel a ride
    </h2>

    <PaperForm @onSubmit={{this.save}} as |form|>
      <div class="layout layout-sm-column">
        {{#each-in this.shortcutReasonToIcon as |reason icon|}}
          <PaperButton @raised={{true}} @class="shortcut" @onClick={{action "cancelViaShortcut" reason}}>
            {{paperIcon icon}}
            {{reason}}
          </PaperButton>
        {{/each-in}}
      </div>

      <hr>

      <div class="layout layout-sm-column">
        <PaperCheckbox @value={{this.ride.cancelled}} @onChange={{action "cancelledChanged"}}>
          Cancelled?
        </PaperCheckbox>
      </div>

      <div class="layout layout-sm-column">
        <PaperSelect @class="reason" @placeholder="Reason" @selected={{this.ride.cancellationReason}} @options={{this.reasons}} @onChange={{action (mut this.ride.cancellationReason)}} as |reason|>
          {{reason}}
        </PaperSelect>
      </div>

      <form.input @class="other" @label="Other reason" @value={{this.ride.cancellationReason}} @onChange={{action (mut this.ride.cancellationReason)}} />
    </PaperForm>
  </PaperDialogContent>

  <PaperDialogActions @class="layout-row">
    <PaperButton @class="cancel" @onClick={{this.cancel}}>
      Cancel
    </PaperButton>
    <PaperButton @class="submit" @primary={{true}} @onClick={{this.save}}>
      Save
    </PaperButton>
  </PaperDialogActions>
</PaperDialog></template>
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
}
