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
    {{pageTitle 'Forgot password'}}
    <HdsModal @size='small' data-test-forgot-modal as |Modal|>
      <Modal.Header>
        <h2>Forgot password</h2>
      </Modal.Header>

      <Modal.Body>
        <form
          data-test-forgot-form
          {{on 'submit' @controller.submitForgot}}
        >
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

          {{#if @controller.error}}
            <HdsAlert
              @color='critical'
              @type='inline'
              data-test-forgot-error
              as |Alert|
            >
              <Alert.Title>{{@controller.error}}</Alert.Title>
            </HdsAlert>
          {{/if}}

          <HdsButton
            type='submit'
            @color='primary'
            @text='Send reset email'
            data-test-forgot-submit
          />
        </form>
      </Modal.Body>
    </HdsModal>
  </template>,
);
