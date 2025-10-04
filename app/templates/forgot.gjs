import RouteTemplate from 'ember-route-template';
import PaperDialog from 'prison-rideshare-ui/components/placeholder';
import PaperToolbar from 'prison-rideshare-ui/components/placeholder';
import PaperToolbarTools from 'prison-rideshare-ui/components/placeholder';
import PaperForm from 'prison-rideshare-ui/components/placeholder';
import PaperDialogContent from 'prison-rideshare-ui/components/placeholder';
import PaperDialogActions from 'prison-rideshare-ui/components/placeholder';
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
