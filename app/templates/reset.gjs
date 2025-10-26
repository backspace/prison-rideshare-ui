import RouteTemplate from 'ember-route-template';
import { on } from '@ember/modifier';
import {
  HdsButton,
  HdsFormTextInputField,
  HdsModal,
} from '@hashicorp/design-system-components/components';
import { pageTitle } from 'ember-page-title';
import Alert from 'prison-rideshare-ui/components/alert';

export default RouteTemplate(
  <template>
    {{pageTitle 'Reset password'}}
    <HdsModal @size='small' data-test-reset-modal as |Modal|>
      <Modal.Header>
        Reset password
      </Modal.Header>

      <Modal.Body>
        {{#if @controller.error}}
          <Alert @message={{@controller.error}} data-test-reset-error />
        {{/if}}

        <form data-test-reset-form {{on 'submit' @controller.submitReset}}>
          <HdsFormTextInputField
            @value={{@controller.password}}
            @type='password'
            autofocus
            data-test-reset-password
            {{on 'input' @controller.updatePassword}}
            as |Field|
          >
            <Field.Label>Password</Field.Label>
          </HdsFormTextInputField>

          <HdsFormTextInputField
            @value={{@controller.passwordConfirmation}}
            @type='password'
            data-test-reset-password-confirmation
            {{on 'input' @controller.updatePasswordConfirmation}}
            as |Field|
          >
            <Field.Label>Password confirmation</Field.Label>
          </HdsFormTextInputField>

          <HdsButton
            type='submit'
            @color='primary'
            @text='Update password'
            data-test-reset-submit
          />
        </form>
      </Modal.Body>
    </HdsModal>
  </template>,
);
