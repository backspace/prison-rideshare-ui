import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import momentFormat from 'ember-moment/helpers/moment-format';
import eq from 'ember-truth-helpers/helpers/eq';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import {
  HdsBadgeCount,
  HdsIcon,
  HdsTable,
  HdsFormCheckboxBase,
} from '@hashicorp/design-system-components/components';
export default RouteTemplate(
  <template>
    <ToolbarHeader @title='Users' />

    <HdsTable data-test-users-table>
      <:head as |Head|>
        <Head.Tr>
          <Head.Th>Email</Head.Th>
          <Head.Th>Last seen</Head.Th>
          <Head.Th>Present</Head.Th>
          <Head.Th>Admin?</Head.Th>
        </Head.Tr>
      </:head>

      <:body as |Body|>
        {{#each @controller.model as |user|}}
          <Body.Tr class='user' data-test-user-row>
            <Body.Td class='email' data-test-user-email>
              {{user.email}}
            </Body.Td>
            <Body.Td class='last-seen' data-test-user-last-seen>
              {{momentFormat user.lastSeenAt 'MMM D YYYY'}}
            </Body.Td>
            <Body.Td class='present' data-test-user-present>
              {{#if user.isPresent}}
                <HdsIcon
                  @name='check'
                  @size='16'
                  data-test-user-present-icon
                  aria-label='Present'
                />
              {{/if}}
              {{#if user.presenceCount}}
                <HdsBadgeCount
                  @text={{user.presenceCount}}
                  @type='outlined'
                  @size='small'
                  class='count'
                  data-test-user-presence-count
                />
              {{/if}}
            </Body.Td>
            <Body.Td data-test-user-admin>
              <HdsFormCheckboxBase
                class='user-admin-toggle'
                checked={{user.admin}}
                disabled={{eq user @controller.session.currentUser}}
                aria-label='Toggle admin'
                data-test-user-admin-toggle
                {{on 'change' (fn @controller.updateUserAdmin user)}}
              />
            </Body.Td>
          </Body.Tr>
        {{/each}}
      </:body>
    </HdsTable>
  </template>,
);
