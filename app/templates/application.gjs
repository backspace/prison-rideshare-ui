import RouteTemplate from 'ember-route-template';
import HeadLayout from 'ember-cli-head/components/head-layout';
import EmberLoadRemover from 'ember-load/components/ember-load-remover';
import { action } from '@ember/object';
import { concat, fn } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import {
  HdsBadgeCount,
  HdsButton,
  HdsSeparator,
  HdsToast,
} from '@hashicorp/design-system-components/components';
import AppFrame from 'prison-rideshare-ui/components/app-frame';
import AppSideNav from 'prison-rideshare-ui/components/app-side-nav';
import AppSideNavList from 'prison-rideshare-ui/components/app-side-nav/list';
import { pageTitle } from 'ember-page-title';
import momentFormat from 'ember-moment/helpers/moment-format';
import now from 'ember-moment/helpers/now';
import BasicDropdownWormhole from 'ember-basic-dropdown/components/basic-dropdown-wormhole';
import { modifier } from 'ember-modifier';

class ApplicationComponent extends Component {
  @service toasts;
  @service sidebar;

  constructor(owner, args) {
    super(owner, args);

    if (typeof window !== 'undefined') {
      const isDesktop = window.matchMedia('(min-width: 1088px)').matches;
      this.sidebar.open = isDesktop;
      this.sidebar.setNavMinimizedState(!isDesktop);
    }
  }

  @action storeHeaderElement(headerElement) {
    this.args.controller.headerElement = headerElement;
  }

  get isSidebarMinimized() {
    return this.sidebar.navIsMinimized;
  }

  get activeToast() {
    return this.toasts.activeToast;
  }

  @action registerSidebarComponent(component) {
    this.sidebar.registerNavComponent(component);
  }

  @action handleSidebarToggle(isMinimized) {
    this.sidebar.open = !isMinimized;
    this.sidebar.setNavMinimizedState(isMinimized);
  }

  <template>
    {{pageTitle 'Prison Rideshare' separator=' · '}}
    <HeadLayout />
    <EmberLoadRemover />

    {{#if this.activeToast}}
      <HdsToast
        class='toast'
        @onDismiss={{fn this.toasts.dismiss this.activeToast}}
        data-test-toast
        as |toast|
      >
        <toast.Title data-test-toast-text>
          {{this.activeToast.message}}
        </toast.Title>
      </HdsToast>
    {{/if}}

    <AppFrame
      class={{if this.isSidebarMinimized 'app-frame--sidebar-closed'}}
      as |Frame|
    >
      <Frame.Header {{storeHeaderElement this.storeHeaderElement}} />
      <Frame.Sidebar>
        <AppSideNav
          data-test-app-sidenav
          @isResponsive={{true}}
          @isMinimized={{this.isSidebarMinimized}}
          @onRegister={{this.registerSidebarComponent}}
          @onToggleMinimizedStatus={{this.handleSidebarToggle}}
        >
          <AppSideNavList as |List|>
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
          </AppSideNavList>
        </AppSideNav>
      </Frame.Sidebar>

      <Frame.Main class='flex layout-column'>
        {{outlet}}
      </Frame.Main>
    </AppFrame>

    <BasicDropdownWormhole />
  </template>
}

const storeHeaderElement = modifier((element, [storeHeaderElement]) => {
  storeHeaderElement(element);
});

export default RouteTemplate(ApplicationComponent);
