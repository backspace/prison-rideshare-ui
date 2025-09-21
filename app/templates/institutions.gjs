{{! template-lint-disable no-action }}
<ToolbarHeader @title='Institutions'>
  <PaperButton
    @mini={{true}}
    @aria-label='New institution'
    @title='New institution'
    @class='new'
    @onClick={{action 'newInstitution'}}
  >
    {{paper-icon 'add'}}
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
    {{#each (sort-by table.sortDesc this.model) as |institution|}}
      {{#unless institution.isNew}}
        <body.row @class='institution' as |row|>
          <row.cell @class='name'>
            {{institution.name}}
          </row.cell>
          <row.cell @class='far'>
            {{#if institution.far}}
              {{paper-icon 'done'}}
            {{/if}}
          </row.cell>
          <row.cell>
            <PaperButton
              @iconButton={{true}}
              @aria-label='Edit institution'
              @title='Edit institution'
              @class='edit'
              @onClick={{action 'editInstitution' institution}}
            >
              {{paper-icon 'mode edit'}}
            </PaperButton>
          </row.cell>
        </body.row>
      {{/unless}}
    {{/each}}
  </table.body>
</PaperDataTable>

{{#if this.editingInstitution}}
  <PaperDialog
    @clickOutsideToClose={{true}}
    @onClose={{action 'cancelInstitution'}}
  >
    <PaperDialogContent>
      <h2 class='md-title'>
        {{if this.editingInstitution.isNew 'New' 'Edit'}} institution
      </h2>
      <PaperForm @onSubmit={{this.saveInstitution}} as |form|>
        <div class='layout layout-sm-column'>
          <form.input
            @class='name'
            @label='Name'
            @autofocus={{true}}
            @value={{this.editingInstitution.name}}
            @onChange={{action (mut this.editingInstitution.name)}}
            @errors={{this.editingInstitution.validationErrors.name}}
            @isTouched={{
              readonly this.editingInstitution.validationErrors.name.length
            }}
          />
        </div>
        <div class='layout layout-sm-column'>
          <PaperCheckbox
            @value={{this.editingInstitution.far}}
            @onChange={{action (mut this.editingInstitution.far)}}
          >
            Far?
          </PaperCheckbox>
        </div>
      </PaperForm>
    </PaperDialogContent>

    <PaperDialogActions @class='layout-row'>
      <PaperButton @class='cancel' @onClick={{action 'cancelInstitution'}}>
        Cancel
      </PaperButton>
      <PaperButton
        @class='submit'
        @primary={{true}}
        @onClick={{action 'saveInstitution'}}
      >
        Save
      </PaperButton>
    </PaperDialogActions>
  </PaperDialog>
{{/if}}