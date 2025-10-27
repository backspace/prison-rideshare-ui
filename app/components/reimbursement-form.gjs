import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import {
  HdsButton,
  HdsButtonSet,
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
        <HdsForm
          id='reimbursement-form'
          {{on 'submit' this.handleSubmit}}
          as |Form|
        >
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
        </HdsForm>
      </Modal.Body>

      <Modal.Footer as |Footer|>
        <HdsButtonSet>
          <HdsButton
            type='submit'
            form='reimbursement-form'
            @color='primary'
            @text='Save'
            data-test-reimbursement-save
          />
          <HdsButton
            type='button'
            @color='secondary'
            @text='Cancel'
            data-test-reimbursement-cancel
            {{on 'click' Footer.close}}
          />
        </HdsButtonSet>
      </Modal.Footer>

    </HdsModal>
  </template>
}

export default ReimbursementForm;
