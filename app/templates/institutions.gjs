import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import PaperButton from 'ember-paper/components/paper-button';
import paperIcon from 'ember-paper/components/paper-icon';
import PaperDataTable from 'paper-data-table/components/paper-data-table';
import sortBy from 'ember-composable-helpers/helpers/sort-by';
import PaperDialog from 'ember-paper/components/paper-dialog';
import PaperDialogContent from 'ember-paper/components/paper-dialog-content';
import PaperForm from 'ember-paper/components/paper-form';
import PaperCheckbox from 'ember-paper/components/paper-checkbox';
import PaperDialogActions from 'ember-paper/components/paper-dialog-actions';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { fn } from '@ember/helper';

class InstitutionsComponent extends Component {
  @action updateName(value) {
    this.args.controller.editingInstitution.set('name', value);
  }

  @action updateFar(value) {
    this.args.controller.editingInstitution.set('far', value);
  }

  <template>
    <ToolbarHeader @title='Institutions'>
      <PaperButton
        @mini={{true}}
        @aria-label='New institution'
        @title='New institution'
        @class='new'
        @onClick={{@controller.newInstitution}}
      >
        {{paperIcon 'add'}}
      </PaperButton>
    </ToolbarHeader>

    <PaperDataTable @sortProp='name' @sortDir='asc' as |table|>
      <table.head as |head|>
        <head.column @sortProp='name' @class='name'>
          Name
        </head.column>
        <head.column>
          Far
        </head.column>
        {{head.column}}
      </table.head>
      <table.body as |body|>
        {{#each (sortBy table.sortDesc @controller.model) as |institution|}}
          {{#unless institution.isNew}}
            <body.row @class='institution' as |row|>
              <row.cell @class='name'>
                {{institution.name}}
              </row.cell>
              <row.cell @class='far'>
                {{#if institution.far}}
                  {{paperIcon 'done'}}
                {{/if}}
              </row.cell>
              <row.cell>
                <PaperButton
                  @iconButton={{true}}
                  @aria-label='Edit institution'
                  @title='Edit institution'
                  @class='edit'
                  @onClick={{fn @controller.editInstitution institution}}
                >
                  {{paperIcon 'mode edit'}}
                </PaperButton>
              </row.cell>
            </body.row>
          {{/unless}}
        {{/each}}
      </table.body>
    </PaperDataTable>

    {{#if @controller.editingInstitution}}
      <PaperDialog
        @clickOutsideToClose={{true}}
        @onClose={{this.cancelInstitution}}
      >
        <PaperDialogContent>
          <h2 class='md-title'>
            {{if @controller.editingInstitution.isNew 'New' 'Edit'}}
            institution
          </h2>
          <PaperForm @onSubmit={{@controller.saveInstitution}} as |form|>
            <div class='layout layout-sm-column'>
              <form.input
                @class='name'
                @label='Name'
                @autofocus={{true}}
                @value={{@controller.editingInstitution.name}}
                @onChange={{this.updateName}}
                @errors={{@controller.editingInstitution.validationErrors.name}}
                @isTouched={{readonly
                  @controller.editingInstitution.validationErrors.name.length
                }}
              />
            </div>
            <div class='layout layout-sm-column'>
              <PaperCheckbox
                @value={{@controller.editingInstitution.far}}
                @onChange={{this.updateFar}}
              >
                Far?
              </PaperCheckbox>
            </div>
          </PaperForm>
        </PaperDialogContent>

        <PaperDialogActions @class='layout-row'>
          <PaperButton
            @class='cancel'
            @onClick={{@controller.cancelInstitution}}
          >
            Cancel
          </PaperButton>
          <PaperButton
            @class='submit'
            @primary={{true}}
            @onClick={{@controller.saveInstitution}}
          >
            Save
          </PaperButton>
        </PaperDialogActions>
      </PaperDialog>
    {{/if}}
  </template>
}

export default RouteTemplate(InstitutionsComponent);
