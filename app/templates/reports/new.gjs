import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import momentFormat from 'ember-moment/helpers/moment-format';
import ReimbursementUnit from 'prison-rideshare-ui/components/reimbursement-unit';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import {
  HdsButton,
  HdsCardContainer,
  HdsForm,
  HdsFormCheckboxField,
  HdsFormRadioGroup,
  HdsFormTextareaField,
  HdsFormTextInputField,
} from '@hashicorp/design-system-components/components';
import eq from 'ember-truth-helpers/helpers/eq';
import gt from 'ember-truth-helpers/helpers/gt';
import Alert from 'prison-rideshare-ui/components/alert';

export default RouteTemplate(
  <template>
    <ToolbarHeader @title='Record ride details' @titleOverride='Ride report' />

    {{#if @controller.session.isAuthenticated}}
      <HdsCardContainer class='no-session' data-test-report-no-session>
        The ability to submit reports while logged in is indefinitely
        unavailable for annoying technical reasons. Please use another browser
        or a private/incognito window to submit your reports in the interim. ☹️
      </HdsCardContainer>
    {{else}}
      {{#if (gt @controller.reportableRides.length 0)}}
        <div class='report-form'>
          {{#if @controller.errorMessage}}
            <Alert @message={{@controller.errorMessage}} />
          {{/if}}

          <HdsForm
            data-test-report-form
            {{on 'submit' @controller.submitReport}}
            as |Form|
          >
            <Form.Section>
              <HdsFormRadioGroup
                name='ride-selection'
                data-test-report-rides
                as |Group|
              >
                {{#each @controller.reportableRides as |ride|}}
                  <Group.RadioField
                    @value={{ride.id}}
                    checked={{eq @controller.editingRide ride}}
                    {{on 'change' (fn @controller.setRide ride)}}
                    as |F|
                  >
                    <F.Label data-test-report-ride-option>
                      {{#if ride.initials}}
                        {{ride.initials}}:
                      {{/if}}
                      {{momentFormat ride.start 'ddd, MMM D [at] h:mma'}}
                      to
                      {{ride.institution.name}}
                      {{#if ride.rate}}
                        ({{ride.rate}}<ReimbursementUnit />)
                      {{/if}}
                    </F.Label>
                  </Group.RadioField>
                {{/each}}
              </HdsFormRadioGroup>
            </Form.Section>

            {{#if @controller.editingRide}}
              <Form.Section>
                {{#let
                  (gt
                    @controller.editingRide.validationErrors.distance.length 0
                  )
                  @controller.editingRide.validationErrors.distance
                  as |hasDistanceErrors distanceErrors|
                }}
                  <HdsFormTextInputField
                    type='number'
                    step='any'
                    @value={{@controller.editingRide.distance}}
                    @isInvalid={{hasDistanceErrors}}
                    @isRequired={{true}}
                    data-test-report-distance
                    {{on 'input' @controller.updateDistance}}
                    as |Field|
                  >
                    <Field.Label>Distance in kilometres</Field.Label>
                    {{#if hasDistanceErrors}}
                      <Field.Error data-test-report-distance-error>
                        {{#each distanceErrors as |distanceError|}}
                          {{distanceError}}
                        {{/each}}
                      </Field.Error>
                    {{/if}}
                  </HdsFormTextInputField>
                {{/let}}
              </Form.Section>

              {{#if @controller.editingRide.donatable}}
                <Form.Section>
                  {{#let
                    (gt
                      @controller.editingRide.validationErrors.donation.length 0
                    )
                    @controller.editingRide.validationErrors.donation
                    as |hasErrors errors|
                  }}
                    <HdsFormCheckboxField
                      checked={{if
                        @controller.editingRide.donation
                        true
                        undefined
                      }}
                      data-test-report-donation
                      {{on 'change' @controller.updateDonation}}
                      as |Field|
                    >
                      <Field.Label>Donate your gas reimbursement</Field.Label>
                      {{#if hasErrors}}
                        <Field.Error data-test-report-donation-error>
                          {{#each errors as |error|}}
                            {{error}}
                          {{/each}}
                        </Field.Error>
                      {{/if}}
                    </HdsFormCheckboxField>
                  {{/let}}
                </Form.Section>
              {{/if}}

              <Form.Section>
                {{#let
                  (gt
                    @controller.editingRide.validationErrors.foodExpenses.length
                    0
                  )
                  @controller.editingRide.validationErrors.foodExpenses
                  as |hasErrors errors|
                }}
                  <HdsFormTextInputField
                    type='number'
                    @value={{@controller.editingRide.foodExpensesDollars}}
                    @isInvalid={{hasErrors}}
                    data-test-report-food-expenses
                    {{on 'input' @controller.updateFoodExpenses}}
                    as |Field|
                  >
                    <Field.Label>Food expenses if wanting reimbursement</Field.Label>
                    {{#if hasErrors}}
                      <Field.Error data-test-report-food-expenses-error>
                        {{#each errors as |error|}}
                          {{error}}
                        {{/each}}
                      </Field.Error>
                    {{/if}}
                  </HdsFormTextInputField>
                {{/let}}
              </Form.Section>

              {{#if @controller.editingRide.overridable}}
                <Form.Section>
                  {{#let
                    (gt
                      @controller.editingRide.validationErrors.carExpenses.length
                      0
                    )
                    @controller.editingRide.validationErrors.carExpenses
                    as |hasErrors errors|
                  }}
                    <HdsFormTextInputField
                      type='number'
                      @value={{@controller.editingRide.carExpensesDollars}}
                      @isInvalid={{hasErrors}}
                      data-test-report-car-expenses
                      {{on 'input' @controller.updateCarExpenses}}
                      as |Field|
                    >
                      <Field.Label>Car expenses</Field.Label>
                      {{#if hasErrors}}
                        <Field.Error data-test-report-car-expenses-error>
                          {{#each errors as |error|}}
                            {{error}}
                          {{/each}}
                        </Field.Error>
                      {{/if}}
                    </HdsFormTextInputField>
                  {{/let}}
                </Form.Section>
              {{/if}}

              <Form.Section>
                {{#let
                  (gt
                    @controller.editingRide.validationErrors.reportNotes.length
                    0
                  )
                  @controller.editingRide.validationErrors.reportNotes
                  as |hasErrors errors|
                }}
                  <HdsFormTextareaField
                    @value={{@controller.editingRide.reportNotes}}
                    @isInvalid={{hasErrors}}
                    data-test-report-notes
                    {{on 'input' @controller.updateReportNotes}}
                    as |Field|
                  >
                    <Field.Label>Notes</Field.Label>
                    <Field.HelperText>
                      Anything unusual, like paying the driver for gas instead
                      of the car owner.
                    </Field.HelperText>
                    {{#if hasErrors}}
                      <Field.Error data-test-report-notes-error>
                        {{#each errors as |error|}}
                          {{error}}
                        {{/each}}
                      </Field.Error>
                    {{/if}}
                  </HdsFormTextareaField>
                {{/let}}
              </Form.Section>

              <Form.Footer as |Footer|>
                <Footer.ButtonSet>
                  <HdsButton
                    type='submit'
                    @color='primary'
                    @text='Save'
                    data-test-report-submit
                  />
                </Footer.ButtonSet>
              </Form.Footer>
            {{/if}}
          </HdsForm>
        </div>
      {{else}}
        <HdsCardContainer class='no-rides' data-test-report-no-rides>
          There are no rides to report on! Thanks for your diligence, drivers.
          Email us if you expected to see a report here.
        </HdsCardContainer>
      {{/if}}
    {{/if}}
  </template>,
);
