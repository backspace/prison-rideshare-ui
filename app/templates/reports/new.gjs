import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import PaperContent from 'ember-paper/components/paper-content/component';
import PaperCard from 'ember-paper/components/paper-card';
import PaperForm from 'ember-paper/components/paper-form';
import PaperRadioGroup from 'ember-paper/components/paper-radio-group';
import sortBy from 'ember-composable-helpers/helpers/sort-by';
import momentFormat from 'ember-moment/helpers/moment-format';
import ReimbursementUnit from 'prison-rideshare-ui/components/reimbursement-unit';
import PaperCheckbox from 'ember-paper/components/paper-checkbox';
import PaperButton from 'ember-paper/components/paper-button';
import { action } from '@ember/object';
import Component from '@glimmer/component';

class NewReportComponent extends Component {
  @action updateDistance(distance) {
    this.args.controller.editingRide.distance = distance;
  }

  @action updatedonation(value) {
    this.args.controller.editingRide.donation = value;
  }
  @action updatefoodExpensesDollars(value) {
    this.args.controller.editingRide.foodExpensesDollars = value;
  }
  @action updatecarExpensesDollars(value) {
    this.args.controller.editingRide.carExpensesDollars = value;
  }
  @action updatereportNotes(value) {
    this.args.controller.editingRide.reportNotes = value;
  }
  <template>
    {{! template-lint-disable no-action }}
    <ToolbarHeader @title='Record ride details' @titleOverride='Ride report' />

    <PaperContent @class='layout-column'>
      {{#if @controller.session.isAuthenticated}}
        <PaperCard @class='no-session' as |card|>
          <card.content>
            The ability to submit reports while logged in is indefinitely
            unavailable for annoying technical reasons. Please use another
            browser or a private/incognito window to submit your reports in the
            interim. ☹️
          </card.content>
        </PaperCard>
      {{else}}
        {{#if @controller.model}}
          <div class='form-container'>
            <PaperForm @onSubmit={{this.submitReport}} as |form|>
              <div class='layout layout-sm-column'>
                <PaperRadioGroup
                  @groupValue={{readonly @controller.editingRide}}
                  @onChange={{@controller.setRide}}
                  as |group|
                >
                  {{#each (sortBy 'start' @controller.model) as |ride|}}
                    <group.radio @value={{ride}}>
                      {{#if ride.initials}}
                        {{ride.initials}}:
                      {{/if}}
                      {{momentFormat ride.start 'ddd, MMM D [at] h:mma'}}
                      to
                      {{ride.institution.name}}
                      {{#if ride.rate}}
                        ({{ride.rate}}<ReimbursementUnit />)
                      {{/if}}
                    </group.radio>
                  {{/each}}
                </PaperRadioGroup>
              </div>

              {{#if @controller.editingRide}}
                <div class='layout-column'>
                  <form.input
                    @class='distance'
                    @type='number'
                    @label='Distance in kilometres'
                    @value={{@controller.editingRide.distance}}
                    @errors={{@controller.editingRide.validationErrors.distance}}
                    @isTouched={{readonly
                      @controller.editingRide.validationErrors.distance.length
                    }}
                    @onChange={{this.updateDistance}}
                  />
                </div>
                {{#if @controller.editingRide.donatable}}
                  <div class='layout layout-sm-column'>
                    <PaperCheckbox
                      @value={{@controller.editingRide.donation}}
                      @onChange={{this.updatedonation}}
                    >
                      Donate your gas reimbursement
                    </PaperCheckbox>
                  </div>
                {{/if}}
                <div class='layout-column'>
                  <form.input
                    @class='food-expenses'
                    @type='number'
                    @label='Food expenses if wanting reimbursement'
                    @value={{@controller.editingRide.foodExpensesDollars}}
                    @onChange={{this.updatefoodExpensesDollars}}
                  />
                </div>
                {{#if @controller.editingRide.overridable}}
                  <div class='layout-column'>
                    <form.input
                      @class='car-expenses'
                      @type='number'
                      @label='Car expenses'
                      @value={{@controller.editingRide.carExpensesDollars}}
                      @onChange={{this.updatecarExpensesDollars}}
                    />
                  </div>
                {{/if}}
                <div class='layout-column'>
                  <form.input
                    @class='report-notes'
                    @textarea={{true}}
                    @label='Notes'
                    @value={{@controller.editingRide.reportNotes}}
                    @onChange={{this.updatereportNotes}}
                    as |textHelper|
                  >
                    {{#unless textHelper.hasValue}}
                      <div class='hint'>
                        Anything unusual, like paying the driver for gas instead
                        of car owner.
                      </div>
                    {{/unless}}
                  </form.input>
                </div>

                <div class='layout-row'>
                  <PaperButton
                    @class='submit'
                    @raised={{true}}
                    @primary={{true}}
                    @onClick={{@controller.submitReport}}
                  >
                    Save
                  </PaperButton>
                  {{! FIXME simplify if/when form yields radio-group?}}
                </div>
              {{/if}}
            </PaperForm>
          </div>
        {{else}}
          <PaperCard @class='no-rides' as |card|>
            <card.content>
              There are no rides to report on! Thanks for your diligence,
              drivers. Email us if you expected to see a report here.
            </card.content>
          </PaperCard>
        {{/if}}
      {{/if}}
    </PaperContent>
  </template>
}

export default RouteTemplate(NewReportComponent);
