import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import momentFormat from 'ember-moment/helpers/moment-format';
import or from 'ember-truth-helpers/helpers/or';
import ReimbursementForm from 'prison-rideshare-ui/components/reimbursement-form';
import { get, fn } from '@ember/helper';
import { on } from '@ember/modifier';
import eq from 'ember-truth-helpers/helpers/eq';
import {
  HdsButton,
  HdsCopyButton,
  HdsForm,
  HdsFormRadioGroup,
  HdsFormTextInputField,
  HdsFormTextareaField,
  HdsFormToggleBase,
  HdsFormToggleField,
  HdsModal,
  HdsTable,
} from '@hashicorp/design-system-components/components';
import Alert from 'prison-rideshare-ui/components/alert';

export default RouteTemplate(
  <template>
    <ToolbarHeader @title='Drivers'>
      <HdsButton
        {{on 'click' @controller.newPerson}}
        @text='New driver'
        @class='new'
        @isIconOnly={{true}}
        @icon='plus'
        data-test-new-driver
      />
    </ToolbarHeader>

    {{#if @controller.errorMessage}}
      <Alert @message={{@controller.errorMessage}} />
    {{/if}}

    <div class='switch-container layout-row layout-align-start-center'>
      <HdsFormToggleField
        class='inactive-toggle'
        checked={{@controller.showInactive}}
        data-test-drivers-inactive-toggle
        {{on 'change' @controller.toggleShowInactive}}
        as |Field|
      >
        <Field.Label>Inactive</Field.Label>
      </HdsFormToggleField>
    </div>

    <HdsTable
      data-test-drivers-table
      @isSortable={{true}}
      @sortBy={{@controller.sortProp}}
      @sortOrder={{@controller.sortDir}}
    >
      <:head as |Head|>
        <Head.Tr>
          <Head.Th>Active</Head.Th>
          <Head.ThSort
            class='name'
            data-test-drivers-head-name
            @sortOrder={{if
              (eq @controller.sortProp 'name')
              @controller.sortDir
            }}
            @onClickSort={{fn @controller.sort 'name'}}
          >
            Name
          </Head.ThSort>
          <Head.Th class='email'>Email</Head.Th>
          <Head.Th class='mobile'>Mobile</Head.Th>
          <Head.Th class='landline'>Landline</Head.Th>
          <Head.Th class='address'>Address</Head.Th>
          <Head.ThSort
            class='last-ride'
            data-test-drivers-head-last-ride
            @sortOrder={{if
              (eq @controller.sortProp 'lastRide')
              @controller.sortDir
            }}
            @onClickSort={{fn @controller.sort 'lastRide'}}
          >
            Last ride
          </Head.ThSort>
          <Head.Th class='notes'>Notes</Head.Th>
          <Head.Th class='actions'>Actions</Head.Th>
        </Head.Tr>
      </:head>

      <:body as |Body|>
        {{#each @controller.sortedPeople as |person|}}
          {{#if (or person.active @controller.showInactive)}}
            {{#unless person.isNew}}
              <Body.Tr class='person' data-test-driver-row>
                <Body.Td data-test-driver-active>
                  <HdsFormToggleBase
                    class='driver-active-toggle'
                    checked={{person.active}}
                    aria-label='Toggle active'
                    data-test-driver-active-toggle
                    {{on
                      'change'
                      (fn @controller.updatePersonActiveness person)
                    }}
                  />
                </Body.Td>
                <Body.Td class='name' data-test-driver-name>
                  {{person.name}}
                </Body.Td>
                <Body.Td
                  class={{if
                    (eq person.medium 'email')
                    'email is-preferred'
                    'email'
                  }}
                  data-test-driver-email
                >
                  {{#if person.email}}
                    <a
                      href='mailto:{{person.email}}'
                      data-test-driver-email-link
                    >
                      {{person.email}}
                    </a>
                  {{/if}}
                </Body.Td>
                <Body.Td
                  class={{if
                    (eq person.medium 'mobile')
                    'mobile is-preferred'
                    'mobile'
                  }}
                  data-test-driver-mobile
                >
                  {{#if person.mobile}}
                    <a
                      href='tel:{{person.mobile}}'
                      data-test-driver-mobile-link
                    >
                      {{person.mobile}}
                    </a>
                  {{/if}}
                </Body.Td>
                <Body.Td
                  class={{if
                    (eq person.medium 'landline')
                    'landline is-preferred'
                    'landline'
                  }}
                  data-test-driver-landline
                >
                  {{#if person.landline}}
                    <a
                      href='tel:{{person.landline}}'
                      data-test-driver-landline-link
                    >
                      {{person.landline}}
                    </a>
                  {{/if}}
                </Body.Td>
                <Body.Td class='address' data-test-driver-address>
                  {{#if person.address}}
                    <HdsCopyButton
                      @textToCopy={{person.address}}
                      @isIconOnly={{true}}
                      @color='secondary'
                      @size='small'
                      @onSuccess={{@controller.copyAddressSuccess}}
                      @text='Copy {{person.address}}'
                      data-test-clipboard-text={{person.address}}
                      data-test-driver-copy-button
                    />
                  {{/if}}
                </Body.Td>
                <Body.Td class='last-ride' data-test-driver-last-ride>
                  {{#if person.lastRide}}
                    {{momentFormat person.lastRide.start 'MMMM D, YYYY'}}
                  {{/if}}
                </Body.Td>
                <Body.Td class='notes' data-test-driver-notes>
                  {{person.notes}}
                </Body.Td>
                <Body.Td class='actions'>
                  <HdsButton
                    @icon='edit'
                    @text='Edit person'
                    @isIconOnly={{true}}
                    @size='small'
                    @color='tertiary'
                    data-test-driver-edit
                    {{on 'click' (fn @controller.editPerson person)}}
                  />
                </Body.Td>
              </Body.Tr>
            {{/unless}}
          {{/if}}
        {{/each}}
      </:body>
    </HdsTable>

    {{#if @controller.editingReimbursement}}
      <ReimbursementForm
        @reimbursement={{@controller.editingReimbursement}}
        @cancel={{@controller.cancel}}
        @save={{@controller.submitReimbursement}}
      />
    {{/if}}

    {{#if @controller.editingPerson}}
      <HdsModal
        @color='neutral'
        @size='large'
        @onClose={{@controller.cancelPerson}}
        data-test-driver-modal
        as |Modal|
      >
        <Modal.Header>
          {{if @controller.editingPerson.isNew 'New' 'Edit'}}
          person
        </Modal.Header>

        <Modal.Body>
          <HdsForm
            data-test-driver-form
            {{on 'submit' @controller.savePerson}}
            as |Form|
          >
            <Form.Section>
              <HdsFormTextInputField
                @value={{@controller.editingPerson.name}}
                @isRequired={{true}}
                @isInvalid={{@controller.editingPerson.validationErrors.name.length}}
                autofocus
                data-test-driver-form-name-input
                {{on 'input' (fn @controller.updateEditingPerson 'name')}}
                as |Field|
              >
                <Field.Label>Name</Field.Label>
                {{#if @controller.editingPerson.validationErrors.name.length}}
                  <Field.Error data-test-driver-form-name-error>
                    {{get @controller.editingPerson.validationErrors.name 0}}
                  </Field.Error>
                {{/if}}
              </HdsFormTextInputField>

              <HdsFormTextInputField
                @type='email'
                @value={{@controller.editingPerson.email}}
                @isInvalid={{@controller.editingPerson.validationErrors.email.length}}
                data-test-driver-form-email-input
                {{on 'input' (fn @controller.updateEditingPerson 'email')}}
                as |Field|
              >
                <Field.Label>Email</Field.Label>
                {{#if @controller.editingPerson.validationErrors.email.length}}
                  <Field.Error data-test-driver-form-email-error>
                    {{get @controller.editingPerson.validationErrors.email 0}}
                  </Field.Error>
                {{/if}}
              </HdsFormTextInputField>

              <HdsFormTextInputField
                @value={{@controller.editingPerson.mobile}}
                data-test-driver-form-mobile-input
                {{on 'input' (fn @controller.updateEditingPerson 'mobile')}}
                as |Field|
              >
                <Field.Label>Mobile</Field.Label>
              </HdsFormTextInputField>

              <HdsFormTextInputField
                @value={{@controller.editingPerson.landline}}
                data-test-driver-form-landline-input
                {{on 'input' (fn @controller.updateEditingPerson 'landline')}}
                as |Field|
              >
                <Field.Label>Landline</Field.Label>
              </HdsFormTextInputField>

              <HdsFormRadioGroup
                name='preferred-medium'
                data-test-driver-form-medium
                as |Group|
              >
                <Group.Legend>Preferred contact</Group.Legend>

                <Group.RadioField
                  @value='email'
                  checked={{eq @controller.editingPerson.medium 'email'}}
                  data-test-driver-form-medium-email
                  {{on 'change' (fn @controller.updateEditingPerson 'medium')}}
                  as |Field|
                >
                  <Field.Label>Email</Field.Label>
                </Group.RadioField>

                <Group.RadioField
                  @value='mobile'
                  checked={{eq @controller.editingPerson.medium 'mobile'}}
                  data-test-driver-form-medium-mobile
                  {{on 'change' (fn @controller.updateEditingPerson 'medium')}}
                  as |Field|
                >
                  <Field.Label>Mobile</Field.Label>
                </Group.RadioField>

                <Group.RadioField
                  @value='landline'
                  checked={{eq @controller.editingPerson.medium 'landline'}}
                  data-test-driver-form-medium-landline
                  {{on 'change' (fn @controller.updateEditingPerson 'medium')}}
                  as |Field|
                >
                  <Field.Label>Landline</Field.Label>
                </Group.RadioField>
              </HdsFormRadioGroup>

              <HdsFormTextareaField
                @value={{@controller.editingPerson.address}}
                data-test-driver-form-address-input
                {{on 'input' (fn @controller.updateEditingPerson 'address')}}
                as |Field|
              >
                <Field.Label>Mailing address</Field.Label>
              </HdsFormTextareaField>

              <HdsFormTextareaField
                @value={{@controller.editingPerson.notes}}
                data-test-driver-form-notes-input
                {{on 'input' (fn @controller.updateEditingPerson 'notes')}}
                as |Field|
              >
                <Field.Label>Notes</Field.Label>
              </HdsFormTextareaField>
            </Form.Section>

            <Form.Footer as |Footer|>
              <Footer.ButtonSet>
                <HdsButton
                  @text='Save'
                  @color='primary'
                  type='submit'
                  data-test-driver-form-submit
                />
                <HdsButton
                  @text='Cancel'
                  @color='secondary'
                  type='button'
                  data-test-driver-form-cancel
                  {{on 'click' @controller.cancelPerson}}
                />
              </Footer.ButtonSet>
            </Form.Footer>
          </HdsForm>
        </Modal.Body>
      </HdsModal>
    {{/if}}
  </template>,
);
