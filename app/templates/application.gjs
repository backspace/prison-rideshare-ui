import RouteTemplate from 'ember-route-template';
import HeadLayout from 'ember-cli-head/components/head-layout';
import EmberLoadRemover from 'ember-load/components/ember-load-remover';
import { action } from '@ember/object';
import { concat, fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import {
  HdsAppFrame,
  HdsAppSideNav,
  HdsAppSideNavList,
  HdsBadgeCount,
  HdsButton,
  HdsSeparator,
  HdsToast,
} from '@hashicorp/design-system-components/components';
import { pageTitle } from 'ember-page-title';
import momentFormat from 'ember-moment/helpers/moment-format';
import now from 'ember-moment/helpers/now';
import BasicDropdownWormhole from 'ember-basic-dropdown/components/basic-dropdown-wormhole';

class ApplicationComponent extends Component {
  @service paperToaster;

  constructor(owner, args) {
    super(owner, args);

    if (typeof window !== 'undefined') {
      const isDesktop = window.matchMedia('(min-width: 1088px)').matches;
      this.args.controller.sidebar.open = isDesktop;
    }
  }

  get sideNavKey() {
    return this.args.controller.sidebar.open ? 'open' : 'closed';
  }

  get isSidebarMinimized() {
    return !this.args.controller.sidebar.open;
  }

  @action
  synchronizeSidebar(isMinimized) {
    this.args.controller.sidebar.open = !isMinimized;
  }

  get activeToast() {
    return this.paperToaster.activeToast;
  }

  <template>
    {{pageTitle 'Prison Rideshare' separator=' · '}}
    <HeadLayout />
    <EmberLoadRemover />

    {{! FIXME replace }}
    {{! Adapted from https://github.com/adopted-ember-addons/ember-paper/blob/002fa43fd64a609b55d90daeecc0e151085b40e3/addon/components/paper-toaster.hbs }}
    {{#if this.activeToast.show}}
      <HdsToast
        @onDismiss={{fn this.paperToaster.cancelToast this.activeToast}}
        data-test-toast
        as |toast|
      >
        <toast.Title
          data-test-toast-text
        >{{this.activeToast.text}}</toast.Title>
      </HdsToast>
    {{/if}}

    <HdsAppFrame @hasHeader={{false}} @hasFooter={{false}} as |Frame|>
      <Frame.Sidebar>
        {{#unless this.isSidebarMinimized}}
          <HdsAppSideNav
            data-test-app-sidenav
            @isCollapsible={{true}}
            @isResponsive={{true}}
            @isMinimized={{this.isSidebarMinimized}}
            @onToggleMinimizedStatus={{this.synchronizeSidebar}}
          >
            <HdsAppSideNavList as |List|>
              {{#if @controller.session.currentUser.admin}}
                <List.Link @route='drivers' @text='Drivers' />
                <List.Link @route='reimbursements' @text='Reimbursements' />
                <List.Link @route='debts' @text='Debts' />
                <List.Link @route='rides' @text='Rides'>
                  {{#if @controller.ridesBadgeCount}}
                    <HdsBadgeCount
                      @text={{@controller.ridesBadgeCount}}
                      @type='outlined'
                      @size='small'
                      data-test-nav-rides-count
                    />
                  {{/if}}
                </List.Link>
                <List.Link @route='institutions' @text='Institutions' />
                <List.Link
                  @route='admin-calendar'
                  @model={{momentFormat (now) 'YYYY-MM'}}
                  @text='Calendar'
                />
                <List.Link @route='statistics' @text='Statistics' />
              {{/if}}

              <List.Link @route='reports.new' @text='Report' />
              <List.Link @route='gas-prices' @text='Gas prices' />

              {{#if @controller.session.isAuthenticated}}
                {{#if @controller.session.currentUser.admin}}
                  <List.Link @route='log' @text='Log'>
                    {{#if @controller.sidebar.unreadCount}}
                      <HdsBadgeCount
                        @text={{@controller.sidebar.unreadCount}}
                        @type='outlined'
                        @size='small'
                        data-test-nav-log-count
                      />
                    {{/if}}
                  </List.Link>
                  <List.Link @route='users' @text='Users'>
                    {{#if @controller.sidebar.userCount}}
                      <HdsBadgeCount
                        @text={{@controller.sidebar.userCount}}
                        @type='outlined'
                        @size='small'
                        data-test-nav-users-count
                      />
                    {{/if}}
                  </List.Link>
                  <List.Item>
                    <HdsSeparator @spacing='0' />
                  </List.Item>
                {{/if}}
                <List.Item data-test-session>
                  <HdsButton
                    @color='secondary'
                    @text={{concat
                      'Log out '
                      @controller.session.currentUser.email
                    }}
                    @size='small'
                    {{on 'click' @controller.logout}}
                    type='button'
                    data-test-session-button
                  />
                </List.Item>
              {{else}}
                <List.Link @route='login' @text='Admin log in' />
              {{/if}}
            </HdsAppSideNavList>
          </HdsAppSideNav>
        {{/unless}}
      </Frame.Sidebar>

      <Frame.Main class='flex layout-column'>
        {{outlet}}
      </Frame.Main>
    </HdsAppFrame>

    <BasicDropdownWormhole />
  </template>
}

export default RouteTemplate(ApplicationComponent);
