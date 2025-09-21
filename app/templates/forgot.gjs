import RouteTemplate from 'ember-route-template';
import PaperDialog from 'ember-paper/components/paper-dialog';
import PaperToolbar from 'ember-paper/components/paper-toolbar';
import PaperToolbarTools from 'ember-paper/components/paper-toolbar-tools';
import PaperForm from 'ember-paper/components/paper-form';
import PaperDialogContent from 'ember-paper/components/paper-dialog-content';
import PaperDialogActions from 'ember-paper/components/paper-dialog-actions';
import { pageTitle } from 'ember-page-title';

export default RouteTemplate(
  <template>
    {{pageTitle 'Forgot password'}}
    <PaperDialog>
      <PaperToolbar>
        <PaperToolbarTools>
          <h2 class='md-title'>
            Forgot password
          </h2>
        </PaperToolbarTools>
      </PaperToolbar>
      <PaperForm @onSubmit={{this.submitForgot}} as |form|>
        <PaperDialogContent>
          <div class='layout layout-row'>
            <form.input
              @class='email'
              @type='email'
              @label='Email'
              @autofocus={{true}}
              @value={{@controller.email}}
              @onChange={{@controller.editEmail}}
            />
          </div>
          {{#if @controller.error}}
            <div class='error'>
              FIXME
            </div>
          {{/if}}
        </PaperDialogContent>

        <PaperDialogActions @class='layout-row'>
          <div class='layout layout-row'>
            <form.submit-button
              @class='submit'
              @primary={{true}}
              @raised={{true}}
              @onClick={{@controller.submitForgot}}
            >
              Send reset email
            </form.submit-button>
          </div>
        </PaperDialogActions>
      </PaperForm>
    </PaperDialog>
  </template>,
);
