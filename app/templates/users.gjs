import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import PaperDataTable from 'paper-data-table/components/paper-data-table';
import momentFormat from 'ember-moment/helpers/moment-format';
import paperIcon from 'ember-paper/components/paper-icon';
import PaperCheckbox from 'ember-paper/components/paper-checkbox';
import eq from 'ember-truth-helpers/helpers/eq';
import { fn } from '@ember/helper';
export default RouteTemplate(
  <template>
    {{! template-lint-disable no-action }}
    <ToolbarHeader @title='Users' />

    <PaperDataTable as |table|>
      <table.head as |head|>
        <head.column>
          Email
        </head.column>
        <head.column>
          Last seen
        </head.column>
        <head.column>
          Present
        </head.column>
        <head.column>
          Admin?
        </head.column>
      </table.head>
      <table.body as |body|>
        {{#each @controller.model as |user|}}
          <body.row @class='user' as |row|>
            <row.cell @class='email'>
              {{user.email}}
            </row.cell>
            <row.cell @class='last-seen'>
              {{momentFormat user.lastSeenAt 'MMM D YYYY'}}
            </row.cell>
            <row.cell @class='present'>
              {{#if user.isPresent}}
                {{paperIcon 'done'}}
              {{/if}}
            </row.cell>
            <row.cell>
              <PaperCheckbox
                @value={{user.admin}}
                @disabled={{eq user @controller.session.currentUser}}
                @onChange={{fn @controller.updateUserAdmin user}}
              />
            </row.cell>
          </body.row>
        {{/each}}
      </table.body>
    </PaperDataTable>
  </template>,
);
