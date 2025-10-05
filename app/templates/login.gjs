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
    <div class='login-page' data-test-login-page>
      <HdsCardContainer
        @level='mid'
        class='login-card'
        data-test-login-card
      >
        <HdsForm {{on 'submit' @controller.login}} as |Form|>
          <Form.Header>
            <Form.HeaderTitle>Log in</Form.HeaderTitle>
          </Form.Header>

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
              <HdsAlert
                @color='critical'
                @type='inline'
                class='login-error'
                data-test-login-error
                as |Alert|
              >
                <Alert.Title>
                  There was an error logging you in.
                </Alert.Title>
              </HdsAlert>
            {{/if}}
          </Form.Section>

          <Form.Footer as |Footer|>
            <Footer.ButtonSet class='login-actions'>
              <HdsButton
                type='submit'
                @color='primary'
                @text='Log in'
                data-test-login-submit
              />
              <HdsButton
                @color='secondary'
                @route='register'
                @text='Register'
                data-test-login-register
              />
            </Footer.ButtonSet>
          </Form.Footer>
        </HdsForm>
      </HdsCardContainer>
    </div>
  </template>,
);
