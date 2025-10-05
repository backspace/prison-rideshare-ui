import RouteTemplate from 'ember-route-template';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
import {
  HdsAlert,
  HdsButton,
  HdsCardContainer,
  HdsForm,
  HdsFormTextInputField,
} from '@hashicorp/design-system-components/components';
export default RouteTemplate(
  <template>
    <div class='login-page' data-test-register-page>
      <HdsCardContainer
        @level='mid'
        class='login-card'
        data-test-register-card
      >
        <HdsForm {{on 'submit' @controller.register}} as |Form|>
          <Form.Header>
            <Form.HeaderTitle>Register</Form.HeaderTitle>
          </Form.Header>

          <Form.Section>
            {{#if @controller.error}}
              <HdsAlert
                @color='critical'
                @type='inline'
                data-test-register-error
                as |Alert|
              >
                <Alert.Title>
                  {{@controller.error}}
                </Alert.Title>
              </HdsAlert>
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

          <Form.Footer as |Footer|>
            <Footer.ButtonSet>
              <HdsButton
                type='submit'
                @color='primary'
                @text='Register'
                data-test-register-submit
              />
              <HdsButton
                @color='secondary'
                @route='login'
                @text='Log in'
                data-test-register-login
              />
            </Footer.ButtonSet>
          </Form.Footer>
        </HdsForm>
      </HdsCardContainer>
    </div>
  </template>,
);
