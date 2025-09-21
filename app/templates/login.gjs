import RouteTemplate from 'ember-route-template'
import PaperDialog from "ember-paper/components/paper-dialog";
import PaperToolbar from "ember-paper/_app_/components/paper-toolbar";
import PaperToolbarTools from "ember-paper/_app_/components/paper-toolbar-tools";
import PaperForm from "ember-paper/_app_/components/paper-form";
import PaperDialogContent from "ember-paper/components/paper-dialog-content";
import { LinkTo } from "@ember/routing";
import PaperDialogActions from "ember-paper/components/paper-dialog-actions";
import PaperButton from "ember-paper/components/paper-button";
export default RouteTemplate(<template>{{!-- template-lint-disable no-action --}}
<PaperDialog>
  <PaperToolbar>
    <PaperToolbarTools>
      <h2 class="md-title">
        Log in
      </h2>
    </PaperToolbarTools>
  </PaperToolbar>
  <PaperForm @onSubmit={{action "login"}} as |form|>
    <PaperDialogContent>
      <div class="layout layout-row">
        <form.input @class="email" @type="email" @label="Email" @autofocus={{true}} @value={{@controller.model.email}} @onChange={{action (mut @controller.model.email)}} />
      </div>
      <div class="layout layout-row">
        <form.input @class="password" @type="password" @label="Password" @value={{@controller.model.password}} @onChange={{action (mut @controller.model.password)}}>
          <div class="hint">
            <LinkTo @route="forgot">
              Forgot?
            </LinkTo>
          </div>
        </form.input>
      </div>
      {{#if @controller.error}}
        <div class="error">
          There was an error logging you in.
        </div>
      {{/if}}
    </PaperDialogContent>

    <PaperDialogActions @class="layout-row">
      <div class="layout layout-row">
        <form.submit-button @class="submit" @primary={{true}} @raised={{true}} @onClick={{action "login"}}>
          Log in
        </form.submit-button>
        <PaperButton @href="/register" @class="flex-order--1">
          Register
        </PaperButton>
      </div>
    </PaperDialogActions>
  </PaperForm>
</PaperDialog></template>)
