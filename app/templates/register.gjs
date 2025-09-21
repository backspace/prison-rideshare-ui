import RouteTemplate from 'ember-route-template';
import PaperDialog from 'ember-paper/components/paper-dialog';
import PaperToolbar from 'ember-paper/components/paper-toolbar';
import PaperToolbarTools from 'ember-paper/components/paper-toolbar-tools';
import PaperForm from 'ember-paper/components/paper-form';
import PaperDialogContent from 'ember-paper/components/paper-dialog-content';
import PaperCard from 'ember-paper/components/paper-card';
import PaperDialogActions from 'ember-paper/components/paper-dialog-actions';
import PaperButton from 'ember-paper/components/paper-button';
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
