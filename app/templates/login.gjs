import RouteTemplate from 'ember-route-template';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
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
      data-test-login-modal
      as |Modal|
    >
      <Modal.Header>
        Log in
      </Modal.Header>
      <Modal.Body>
        <HdsForm
          id='login-form'
          data-test-login-page
          {{on 'submit' @controller.login}}
          as |Form|
        >
          <Form.Section>
            <HdsFormTextInputField
              @value={{@controller.model.email}}
              @type='email'
              autofocus
              data-test-login-email
              {{on 'input' @controller.updateEmail}}
              as |Field|
            >
              <Field.Label>Email</Field.Label>
            </HdsFormTextInputField>

            <HdsFormTextInputField
              @value={{@controller.model.password}}
              @type='password'
              data-test-login-password
              {{on 'input' @controller.updatePassword}}
              as |Field|
            >
              <Field.Label>Password</Field.Label>
              <Field.HelperText>
                <LinkTo @route='forgot'>
                  Forgot?
                </LinkTo>
              </Field.HelperText>
            </HdsFormTextInputField>

            {{#if @controller.error}}
              <Alert
                @message={{@controller.error}}
                class='login-error'
                data-test-login-error
              />
            {{/if}}
          </Form.Section>
        </HdsForm>
      </Modal.Body>

      <Modal.Footer>
        <HdsButtonSet>
          <HdsButton
            type='submit'
            form='login-form'
            @size='small'
            @color='primary'
            @text='Log in'
            data-test-login-submit
          />
          <HdsButton
            @size='small'
            @color='secondary'
            @route='register'
            @text='Register'
            data-test-login-register
          />
        </HdsButtonSet>
      </Modal.Footer>
    </HdsModal>
  </template>,
);
