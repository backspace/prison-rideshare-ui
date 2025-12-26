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
    {{! template-lint-disable no-autofocus-attribute }}
    {{pageTitle 'Reset password'}}
    <HdsModal
      class='not-dismissible'
      @size='small'
      @isDismissDisabled={{true}}
      data-test-reset-modal
      as |Modal|
    >
      <Modal.Header>
        Reset password
      </Modal.Header>

      <Modal.Body>
        <HdsForm
          id='reset-form'
          data-test-reset-form
          {{on 'submit' @controller.submitReset}}
          as |Form|
        >
          {{#if @controller.error}}
            <Alert @message={{@controller.error}} data-test-reset-error />
          {{/if}}

          <Form.Section>
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
          </Form.Section>
        </HdsForm>
      </Modal.Body>

      <Modal.Footer>
        <HdsButtonSet>
          <HdsButton
            type='submit'
            form='reset-form'
            @size='small'
            @color='primary'
            @text='Update password'
            data-test-reset-submit
          />
        </HdsButtonSet>
      </Modal.Footer>
    </HdsModal>
  </template>,
);
