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
    {{pageTitle 'Forgot password'}}
    <HdsModal @size='small' data-test-forgot-modal as |Modal|>
      <Modal.Header>
        Forgot password
      </Modal.Header>

      <Modal.Body>
        <form data-test-forgot-form {{on 'submit' @controller.submitForgot}}>
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
