import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import {
  HdsButton,
  HdsForm,
  HdsFormCheckboxField,
  HdsFormTextInputField,
  HdsModal,
} from '@hashicorp/design-system-components/components';

class ReimbursementForm extends Component {
  @action
  updateAmount(event) {
    const value = event?.target?.value ?? '';

    this.args.reimbursement?.set?.('amountDollars', value);
  }

  @action
  updateDonation(event) {
    const checked = event?.target?.checked ?? false;

    this.args.reimbursement?.set?.('donation', checked);
  }

  @action
  handleSubmit(event) {
    event?.preventDefault?.();
    this.args.save?.(event);
  }

  @action
  handleCancel(event) {
    event?.preventDefault?.();
    this.args.cancel?.(event);
  }

  @action
  handleClose(event) {
    event?.preventDefault?.();
    this.args.cancel?.(event);
  }

  <template>
    <HdsModal
      @color='neutral'
      @size='small'
      @onClose={{this.handleClose}}
      data-test-reimbursement-modal
      as |Modal|
    >
      <Modal.Header>
        {{if @reimbursement.isNew 'Create' 'Edit'}}
        a reimbursement
      </Modal.Header>

      <Modal.Body>
        <HdsForm {{on 'submit' this.handleSubmit}} as |Form|>
          <Form.Section>
            <HdsFormTextInputField
              @value={{@reimbursement.amountDollars}}
              @type='number'
              @isRequired={{true}}
              autofocus
              data-test-reimbursement-amount
              {{on 'input' this.updateAmount}}
              as |Field|
            >
              <Field.Label>Amount</Field.Label>
            </HdsFormTextInputField>

            <HdsFormCheckboxField
              checked={{if @reimbursement.donation true undefined}}
              data-test-reimbursement-donation
              {{on 'change' this.updateDonation}}
              as |Field|
            >
              <Field.Label>Donation?</Field.Label>
            </HdsFormCheckboxField>
          </Form.Section>

          <Form.Footer as |Footer|>
            <Footer.ButtonSet>
              <HdsButton
                type='button'
                @color='secondary'
                @text='Cancel'
                data-test-reimbursement-cancel
                {{on 'click' this.handleCancel}}
              />
              <HdsButton
                type='submit'
                @color='primary'
                @text='Save'
                data-test-reimbursement-save
              />
            </Footer.ButtonSet>
          </Form.Footer>
        </HdsForm>
      </Modal.Body>
    </HdsModal>
  </template>
}

export default ReimbursementForm;
