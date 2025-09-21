import RouteTemplate from 'ember-route-template'
import ToolbarHeader from "prison-rideshare-ui/components/toolbar-header";
import PaperContent from "ember-paper/components/paper-content/component";
import PaperCard from "ember-paper/_app_/components/paper-card";
import PaperDataTable from "paper-data-table/components/paper-data-table";
import take from "ember-composable-helpers/helpers/take";
import sortBy from "ember-composable-helpers/helpers/sort-by";
import momentFormat from "ember-moment/helpers/moment-format";
import ReimbursementUnit from "prison-rideshare-ui/components/reimbursement-unit";
export default RouteTemplate(<template><ToolbarHeader @title="Gas prices and reimbursement rates" />

<PaperContent>
  <PaperCard as |card|>
    <card.content>
      <p>
        Ride reimbursement rates are calculated from the day’s average gas price, fetched from winnipeggasprices.com.
      </p>
    </card.content>
  </PaperCard>

  <PaperDataTable @class="gas-prices" as |table|>
    <table.head as |head|>
      <head.column>
        Date
      </head.column>
      <head.column>
        Gas price
      </head.column>
      <head.column>
        Far institution rate
      </head.column>
      <head.column>
        Close institution rate
      </head.column>
    </table.head>
    <table.body as |body|>
      {{#each (take 10 (sortBy "insertedAt:desc" @controller.model)) as |gasPrice|}}
        <body.row as |row|>
          <row.cell @class="date">
            {{momentFormat gasPrice.insertedAt "ddd, MMM D"}}
          </row.cell>
          <row.cell @class="price">
            {{gasPrice.price}}<span class="unit"><sup>¢</sup>&frasl;<sub>L</sub></span>
          </row.cell>
          <row.cell @class="far">
            {{gasPrice.farRate}}<ReimbursementUnit />
          </row.cell>
          <row.cell @class="close">
            {{gasPrice.closeRate}}<ReimbursementUnit />
          </row.cell>
        </body.row>
      {{/each}}
    </table.body>
  </PaperDataTable>
</PaperContent></template>)
