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
    <div class='login-page' data-test-login-page>
      <HdsModal @size='small' as |Modal|>
        <Modal.Header>
          Log in
        </Modal.Header>
        <Modal.Body>
          <HdsForm {{on 'submit' @controller.login}} as |Form|>
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
            <Form.Footer>
              <HdsButtonSet>
                <HdsButton
                  type='submit'
                  @color='primary'
                  @text='Log in'
                  {{on 'click' @controller.login}}
                  data-test-login-submit
                />
                <HdsButton
                  @color='secondary'
                  @route='register'
                  @text='Register'
                  data-test-login-register
                />
              </HdsButtonSet>
            </Form.Footer>
          </HdsForm>
        </Modal.Body>
      </HdsModal>
    </div>
  </template>,
);
