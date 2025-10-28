import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import sortBy from 'ember-composable-helpers/helpers/sort-by';
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
      {{#if @controller.model}}
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
                {{#each (sortBy 'start' @controller.model) as |ride|}}
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
                  (gt @controller.editingRide.validationErrors.distance 0)
                  (@controller.editingRide.validationErrors.distance)
                  as |hasDistanceErrors distanceErrors|
                }}
                  <HdsFormTextInputField
                    type='number'
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
                  </HdsFormCheckboxField>
                </Form.Section>
              {{/if}}

              <Form.Section>
                <HdsFormTextInputField
                  type='number'
                  @value={{@controller.editingRide.foodExpensesDollars}}
                  data-test-report-food-expenses
                  {{on 'input' @controller.updateFoodExpenses}}
                  as |Field|
                >
                  <Field.Label>Food expenses if wanting reimbursement</Field.Label>
                </HdsFormTextInputField>
              </Form.Section>

              {{#if @controller.editingRide.overridable}}
                <Form.Section>
                  <HdsFormTextInputField
                    type='number'
                    @value={{@controller.editingRide.carExpensesDollars}}
                    data-test-report-car-expenses
                    {{on 'input' @controller.updateCarExpenses}}
                    as |Field|
                  >
                    <Field.Label>Car expenses</Field.Label>
                  </HdsFormTextInputField>
                </Form.Section>
              {{/if}}

              <Form.Section>
                <HdsFormTextareaField
                  @value={{@controller.editingRide.reportNotes}}
                  data-test-report-notes
                  {{on 'input' @controller.updateReportNotes}}
                  as |Field|
                >
                  <Field.Label>Notes</Field.Label>
                  <Field.HelperText>
                    Anything unusual, like paying the driver for gas instead of
                    the car owner.
                  </Field.HelperText>
                </HdsFormTextareaField>
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
