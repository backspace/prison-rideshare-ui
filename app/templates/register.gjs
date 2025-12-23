import RouteTemplate from 'ember-route-template';
import { on } from '@ember/modifier';
import {
  HdsButton,
  HdsButtonSet,
  HdsForm,
  HdsFormTextInputField,
  HdsModal,
} from '@hashicorp/design-system-components/components';
import Alert from 'prison-rideshare-ui/components/alert';

export default RouteTemplate(
  <template>
    <HdsModal
      class='not-dismissible'
      @size='small'
      @isDismissDisabled={{true}}
      data-test-register-modal
      as |Modal|
    >
      <Modal.Header>
        Register
      </Modal.Header>

      <Modal.Body>
        <HdsForm
          id='register-form'
          data-test-register-page
          {{on 'submit' @controller.register}}
          as |Form|
        >
          <Form.Section>
            {{#if @controller.error}}
              <Alert @message={{@controller.error}} data-test-register-error />
            {{/if}}

            <HdsFormTextInputField
              @value={{@controller.model.email}}
              @type='email'
              autofocus
              data-test-register-email
              {{on 'input' @controller.updateEmail}}
              as |Field|
            >
              <Field.Label>Email</Field.Label>
            </HdsFormTextInputField>

            <HdsFormTextInputField
              @value={{@controller.model.password}}
              @type='password'
              data-test-register-password
              {{on 'input' @controller.updatePassword}}
              as |Field|
            >
              <Field.Label>Password</Field.Label>
            </HdsFormTextInputField>

            <HdsFormTextInputField
              @value={{@controller.model.passwordConfirmation}}
              @type='password'
              data-test-register-password-confirmation
              {{on 'input' @controller.updatePasswordConfirmation}}
              as |Field|
            >
              <Field.Label>Password confirmation</Field.Label>
            </HdsFormTextInputField>
          </Form.Section>
        </HdsForm>
      </Modal.Body>
      <Modal.Footer>
        <HdsButtonSet>
          <HdsButton
            type='submit'
            form='register-form'
            @size='small'
            @color='primary'
            @text='Register'
            data-test-register-submit
          />
          <HdsButton
            @size='small'
            @color='secondary'
            @route='login'
            @text='Log in'
            data-test-register-login
          />
        </HdsButtonSet>
      </Modal.Footer>
    </HdsModal>
  </template>,
);
