import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { fn, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import {
  HdsAdvancedTable,
  HdsButton,
  HdsForm,
  HdsFormCheckboxField,
  HdsFormTextInputField,
  HdsIcon,
  HdsModal,
} from '@hashicorp/design-system-components/components';

class InstitutionsComponent extends Component {
  @action
  updateName(event) {
    const value = event?.target?.value ?? '';

    this.args.controller.editingInstitution.set('name', value);
  }

  @action
  updateFar(event) {
    const checked = event?.target?.checked ?? false;

    this.args.controller.editingInstitution.set('far', checked);
  }

  <template>
    <ToolbarHeader @title='Institutions'>
      <HdsButton
        @icon='plus'
        @text='New institution'
        @size='small'
        data-test-new-institution
        {{on 'click' @controller.newInstitution}}
      />
    </ToolbarHeader>

    <HdsAdvancedTable
      @columns={{@controller.tableColumns}}
      @model={{@controller.tableRows}}
      @options={{hash hasStickyHeader=true}}
      data-test-institutions-table
    >
      <:body as |Body|>
        <Body.Tr
          data-test-institution-row
          data-test-institution-id={{Body.data.institution.id}}
        >
          <Body.Th data-test-institution-name>
            {{Body.data.institution.name}}
          </Body.Th>
          <Body.Td>
            {{#if Body.data.institution.far}}
              <HdsIcon @name='check' @size='16' data-test-institution-far />
            {{/if}}
          </Body.Td>
          <Body.Td>
            <HdsButton
              @icon='edit'
              @text='Edit institution'
              @isIconOnly={{true}}
              @size='small'
              @color='tertiary'
              data-test-institution-edit
              {{on
                'click'
                (fn @controller.editInstitution Body.data.institution)
              }}
            />
          </Body.Td>
        </Body.Tr>
      </:body>
    </HdsAdvancedTable>

    {{#if @controller.editingInstitution}}
      <HdsModal
        @color='neutral'
        @size='small'
        @onClose={{@controller.cancelInstitution}}
        data-test-institution-modal
        as |Modal|
      >
        <Modal.Header>
          {{if @controller.editingInstitution.isNew 'New' 'Edit'}}
          institution
        </Modal.Header>

        <Modal.Body>
          <HdsForm
            data-test-institution-form
            {{on 'submit' @controller.saveInstitution}}
            as |Form|
          >
            <Form.Section>
              <HdsFormTextInputField
                @value={{@controller.editingInstitution.name}}
                @isInvalid={{@controller.editingInstitution.validationErrors.name.length}}
                @isRequired={{true}}
                autofocus
                data-test-institution-name-field
                {{on 'input' this.updateName}}
                as |Field|
              >
                <Field.Label>Name</Field.Label>
                {{#if
                  @controller.editingInstitution.validationErrors.name.length
                }}
                  <Field.Error data-test-institution-name-error>
                    {{@controller.editingInstitution.validationErrors.name.firstObject}}
                  </Field.Error>
                {{/if}}
              </HdsFormTextInputField>

              <HdsFormCheckboxField
                checked={{if @controller.editingInstitution.far true undefined}}
                data-test-institution-far-checkbox
                {{on 'change' this.updateFar}}
                as |Field|
              >
                <Field.Label>Far?</Field.Label>
              </HdsFormCheckboxField>
            </Form.Section>

            <Form.Footer as |Footer|>
              <Footer.ButtonSet>
                <HdsButton
                  type='submit'
                  @color='primary'
                  @text='Save'
                  data-test-institution-submit
                />
                <HdsButton
                  type='button'
                  @color='secondary'
                  @text='Cancel'
                  data-test-institution-cancel
                  {{on 'click' @controller.cancelInstitution}}
                />
              </Footer.ButtonSet>
            </Form.Footer>
          </HdsForm>
        </Modal.Body>
      </HdsModal>
    {{/if}}
  </template>
}

export default RouteTemplate(InstitutionsComponent);
