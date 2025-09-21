import RouteTemplate from 'ember-route-template'
import PaperDialog from "ember-paper/components/paper-dialog";
import PaperToolbar from "ember-paper/components/paper-toolbar";
import PaperToolbarTools from "ember-paper/components/paper-toolbar-tools";
import PaperForm from "ember-paper/components/paper-form";
import PaperDialogContent from "ember-paper/components/paper-dialog-content";
import PaperDialogActions from "ember-paper/components/paper-dialog-actions";
import { action } from "@ember/object";
export default RouteTemplate(<template>{{!-- template-lint-disable no-action --}}
<PaperDialog>
  <PaperToolbar>
    <PaperToolbarTools>
      <h2 class="md-title">
        Reset password
      </h2>
    </PaperToolbarTools>
  </PaperToolbar>
  <PaperForm @onSubmit={{this.submitReset}} as |form|>
    <PaperDialogContent>
      <div class="layout layout-row">
        <form.input @class="password" @type="password" @label="Password" @autofocus={{true}} @value={{@controller.password}} @onChange={{mut @controller.password}} />
      </div>
      <div class="layout layout-row">
        <form.input @class="password-confirmation" @type="password" @label="Password confirmation" @value={{@controller.passwordConfirmation}} @onChange={{mut @controller.passwordConfirmation}} />
      </div>
      {{#if @controller.error}}
        <div class="error">
          FIXME
        </div>
      {{/if}}
    </PaperDialogContent>

    <PaperDialogActions @class="layout-row">
      <div class="layout layout-row">
        <form.submit-button @class="submit" @primary={{true}} @raised={{true}} @onClick={{this.submitReset}}>
          Update password
        </form.submit-button>
      </div>
    </PaperDialogActions>
  </PaperForm>
</PaperDialog></template>)
