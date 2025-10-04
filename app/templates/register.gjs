import RouteTemplate from 'ember-route-template';
import PaperDialog from 'prison-rideshare-ui/components/placeholder';
import PaperToolbar from 'prison-rideshare-ui/components/placeholder';
import PaperToolbarTools from 'prison-rideshare-ui/components/placeholder';
import PaperForm from 'prison-rideshare-ui/components/placeholder';
import PaperDialogContent from 'prison-rideshare-ui/components/placeholder';
import PaperCard from 'prison-rideshare-ui/components/placeholder';
import PaperDialogActions from 'prison-rideshare-ui/components/placeholder';
import PaperButton from 'prison-rideshare-ui/components/placeholder';
import { fn } from '@ember/helper';
export default RouteTemplate(
  <template>
    <PaperDialog>
      <PaperToolbar>
        <PaperToolbarTools>
          <h2 class='md-title'>
            Register
          </h2>
        </PaperToolbarTools>
      </PaperToolbar>
      <PaperForm @onSubmit={{this.register}} as |form|>
        <PaperDialogContent>
          {{#if @controller.error}}
            <PaperCard @class='error' as |card|>
              <card.content>
                {{@controller.error}}
              </card.content>
            </PaperCard>
          {{/if}}
          <div class='layout layout-row'>
            <form.input
              @class='email'
              @type='email'
              @label='Email'
              @autofocus={{true}}
              @value={{@controller.model.email}}
              @onChange={{fn (mut @controller.model.email)}}
            />
          </div>
          <div class='layout layout-row'>
            <form.input
              @class='password'
              @type='password'
              @label='Password'
              @value={{@controller.model.password}}
              @onChange={{fn (mut @controller.model.password)}}
            />
          </div>
          <div class='layout layout-row'>
            <form.input
              @class='password-confirmation'
              @type='password'
              @label='Password confirmation'
              @value={{@controller.model.passwordConfirmation}}
              @onChange={{fn (mut @controller.model.passwordConfirmation)}}
            />
          </div>
        </PaperDialogContent>

        <PaperDialogActions @class='layout-row'>
          <div class='layout layout-row'>
            <form.submit-button
              @class='submit'
              @primary={{true}}
              @raised={{true}}
              @onClick={{@controller.register}}
            >
              Register
            </form.submit-button>
            <PaperButton @href='/login' @class='flex-order--1'>
              Log in
            </PaperButton>
          </div>
        </PaperDialogActions>
      </PaperForm>
    </PaperDialog>
  </template>,
);
