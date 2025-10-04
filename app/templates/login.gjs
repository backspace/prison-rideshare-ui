import RouteTemplate from 'ember-route-template';
import PaperDialog from 'prison-rideshare-ui/components/placeholder';
import PaperToolbar from 'prison-rideshare-ui/components/placeholder';
import PaperToolbarTools from 'prison-rideshare-ui/components/placeholder';
import PaperForm from 'prison-rideshare-ui/components/placeholder';
import PaperDialogContent from 'prison-rideshare-ui/components/placeholder';
import { LinkTo } from '@ember/routing';
import PaperDialogActions from 'prison-rideshare-ui/components/placeholder';
import PaperButton from 'prison-rideshare-ui/components/placeholder';

export default RouteTemplate(
  <template>
    <PaperDialog>
      <PaperToolbar>
        <PaperToolbarTools>
          <h2 class='md-title'>
            Log in
          </h2>
        </PaperToolbarTools>
      </PaperToolbar>
      <PaperForm @onSubmit={{this.login}} as |form|>
        <PaperDialogContent>
          <div class='layout layout-row'>
            <form.input
              @class='email'
              @type='email'
              @label='Email'
              @autofocus={{true}}
              @value={{@controller.model.email}}
              @onChange={{@controller.updateEmail}}
            />
          </div>
          <div class='layout layout-row'>
            <form.input
              @class='password'
              @type='password'
              @label='Password'
              @value={{@controller.model.password}}
              @onChange={{@controller.updatePassword}}
            >
              <div class='hint'>
                <LinkTo @route='forgot'>
                  Forgot?
                </LinkTo>
              </div>
            </form.input>
          </div>
          {{#if @controller.error}}
            <div class='error'>
              There was an error logging you in.
            </div>
          {{/if}}
        </PaperDialogContent>

        <PaperDialogActions @class='layout-row'>
          <div class='layout layout-row'>
            <form.submit-button
              @class='submit'
              @primary={{true}}
              @raised={{true}}
              @onClick={{@controller.login}}
            >
              Log in
            </form.submit-button>
            <PaperButton @href='/register' @class='flex-order--1'>
              Register
            </PaperButton>
          </div>
        </PaperDialogActions>
      </PaperForm>
    </PaperDialog>
  </template>,
);
