import RouteTemplate from 'ember-route-template'
import PaperDialog from "ember-paper/components/paper-dialog";
import PaperToolbar from "ember-paper/_app_/components/paper-toolbar.js";
import PaperToolbarTools from "ember-paper/_app_/components/paper-toolbar-tools.js";
import PaperForm from "ember-paper/_app_/components/paper-form.js";
import PaperDialogContent from "ember-paper/components/paper-dialog-content";
import PaperDialogActions from "ember-paper/components/paper-dialog-actions";
export default RouteTemplate(<template>{{!-- template-lint-disable no-action --}}
<PaperDialog>
  <PaperToolbar>
    <PaperToolbarTools>
      <h2 class="md-title">
        Forgot password
      </h2>
    </PaperToolbarTools>
  </PaperToolbar>
  <PaperForm @onSubmit={{action "submitForgot"}} as |form|>
    <PaperDialogContent>
      <div class="layout layout-row">
        <form.input @class="email" @type="email" @label="Email" @autofocus={{true}} @value={{@controller.email}} @onChange={{action (mut @controller.email)}} />
      </div>
      {{#if @controller.error}}
        <div class="error">
          FIXME
        </div>
      {{/if}}
    </PaperDialogContent>

    <PaperDialogActions @class="layout-row">
      <div class="layout layout-row">
        <form.submit-button @class="submit" @primary={{true}} @raised={{true}} @onClick={{action "submitForgot"}}>
          Send reset email
        </form.submit-button>
      </div>
    </PaperDialogActions>
  </PaperForm>
</PaperDialog></template>)