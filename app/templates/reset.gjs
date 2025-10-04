import RouteTemplate from 'ember-route-template';
import PaperDialog from 'prison-rideshare-ui/components/placeholder';
import PaperToolbar from 'prison-rideshare-ui/components/placeholder';
import PaperToolbarTools from 'prison-rideshare-ui/components/placeholder';
import PaperForm from 'prison-rideshare-ui/components/placeholder';
import PaperDialogContent from 'prison-rideshare-ui/components/placeholder';
import PaperDialogActions from 'prison-rideshare-ui/components/placeholder';
import { fn } from '@ember/helper';
import { pageTitle } from 'ember-page-title';
export default RouteTemplate(
  <template>
    {{pageTitle 'Reset password'}}
    <PaperDialog>
      <PaperToolbar>
        <PaperToolbarTools>
          <h2 class='md-title'>
            Reset password
          </h2>
        </PaperToolbarTools>
      </PaperToolbar>
      <PaperForm @onSubmit={{this.submitReset}} as |form|>
        <PaperDialogContent>
          <div class='layout layout-row'>
            <form.input
              @class='password'
              @type='password'
              @label='Password'
              @autofocus={{true}}
              @value={{@controller.password}}
              @onChange={{fn (mut @controller.password)}}
            />
          </div>
          <div class='layout layout-row'>
            <form.input
              @class='password-confirmation'
              @type='password'
              @label='Password confirmation'
              @value={{@controller.passwordConfirmation}}
              @onChange={{fn (mut @controller.passwordConfirmation)}}
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
              @onClick={{@controller.submitReset}}
            >
              Update password
            </form.submit-button>
          </div>
        </PaperDialogActions>
      </PaperForm>
    </PaperDialog>
  </template>,
);
