import RouteTemplate from 'ember-route-template';
import { on } from '@ember/modifier';
import {
  HdsButton,
  HdsButtonSet,
  HdsForm,
  HdsFormTextInputField,
  HdsModal,
} from '@hashicorp/design-system-components/components';
import { pageTitle } from 'ember-page-title';
import Alert from 'prison-rideshare-ui/components/alert';

export default RouteTemplate(
  <template>
    {{pageTitle 'Forgot password'}}
    <HdsModal
      class='not-dismissible'
      @size='small'
      @isDismissDisabled={{true}}
      as |Modal|
    >
      <Modal.Header>
        Forgot password
      </Modal.Header>

      <Modal.Body>
        <HdsForm
          id='forgot-form'
          {{on 'submit' @controller.submitForgot}}
          as |Form|
        >
          <Form.Section>
            {{#if @controller.error}}
              <Alert @message={{@controller.error}} data-test-forgot-error />
            {{/if}}

            <HdsFormTextInputField
              @value={{@controller.email}}
              @type='email'
              autofocus
              data-test-forgot-email
              {{on 'input' @controller.updateEmail}}
              as |Field|
            >
              <Field.Label>Email</Field.Label>
            </HdsFormTextInputField>
          </Form.Section>
        </HdsForm>
      </Modal.Body>

      <Modal.Footer>
        <HdsButtonSet>
          <HdsButton
            type='submit'
            form='forgot-form'
            @size='small'
            @color='primary'
            @text='Send reset email'
            data-test-forgot-submit
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
