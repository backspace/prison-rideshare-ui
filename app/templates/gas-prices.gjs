import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import momentFormat from 'ember-moment/helpers/moment-format';
import {
  HdsCardContainer,
  HdsTable,
  HdsTextBody,
} from '@hashicorp/design-system-components/components';
import ReimbursementUnit from 'prison-rideshare-ui/components/reimbursement-unit';

export default RouteTemplate(
  <template>
    <ToolbarHeader
      @title='Gas prices and reimbursement rates'
      @titleOverride='Gas prices'
    />

    <div data-test-gas-prices-page>
      <HdsCardContainer data-test-gas-prices-summary>
        <HdsTextBody>
          Ride reimbursement rates are calculated from the day’s average gas
          price, fetched from winnipeggasprices.com.
        </HdsTextBody>
      </HdsCardContainer>

      <HdsTable class='gas-prices' data-test-gas-prices-table>
        <:head as |Head|>
          <Head.Tr>
            <Head.Th>Date</Head.Th>
            <Head.Th>Gas price</Head.Th>
            <Head.Th>Far institution rate</Head.Th>
            <Head.Th>Close institution rate</Head.Th>
          </Head.Tr>
        </:head>

        <:body as |Body|>
          {{#each @controller.recentPrices as |gasPrice|}}
            <Body.Tr data-test-gas-prices-row>
              <Body.Td class='date' data-test-gas-prices-date>
                {{momentFormat gasPrice.insertedAt 'ddd, MMM D'}}
              </Body.Td>
              <Body.Td class='price' data-test-gas-prices-price>
                {{gasPrice.price}}<span class='unit'><sup>¢</sup>&frasl;<sub
                  >L</sub></span>
              </Body.Td>
              <Body.Td class='far' data-test-gas-prices-far-rate>
                {{gasPrice.farRate}}<ReimbursementUnit />
              </Body.Td>
              <Body.Td class='close' data-test-gas-prices-close-rate>
                {{gasPrice.closeRate}}<ReimbursementUnit />
              </Body.Td>
            </Body.Tr>
          {{/each}}
        </:body>
      </HdsTable>
    </div>
  </template>,
);
