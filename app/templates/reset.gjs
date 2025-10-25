import RouteTemplate from 'ember-route-template';
import { on } from '@ember/modifier';
import {
  HdsAlert,
  HdsButton,
  HdsFormTextInputField,
  HdsModal,
} from '@hashicorp/design-system-components/components';
import { pageTitle } from 'ember-page-title';

export default RouteTemplate(
  <template>
    {{pageTitle 'Reset password'}}
    <HdsModal @size='small' data-test-reset-modal as |Modal|>
      <Modal.Header>
        <h2>Reset password</h2>
      </Modal.Header>

      <Modal.Body>
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

          {{#if @controller.error}}
            <HdsAlert
              @color='critical'
              @type='inline'
              data-test-reset-error
              as |Alert|
            >
              <Alert.Title>{{@controller.error}}</Alert.Title>
            </HdsAlert>
          {{/if}}

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
