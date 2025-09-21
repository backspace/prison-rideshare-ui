import RouteTemplate from 'ember-route-template'
import HeadLayout from "ember-cli-head/components/head-layout";
import EmberLoadRemover from "ember-load/components/ember-load-remover";
import PaperToaster from "ember-paper/components/paper-toaster";
import PaperSidenavContainer from "ember-paper/components/paper-sidenav-container";
import PaperSidenav from "ember-paper/components/paper-sidenav";
import PaperContent from "ember-paper/components/paper-content/component";
import PaperList from "ember-paper/components/paper-list";
import PaperItem from "ember-paper/components/paper-item";
import { LinkTo } from "@ember/routing";
import momentFormat from "ember-moment/helpers/moment-format";
import now from "ember-moment/helpers/now";
import PaperDivider from "ember-paper/components/paper-divider/component";
import { action } from "@ember/object";
import Component from '@glimmer/component';
class ApplicationComponent extends Component {
  @action toggleSidebar() {
    this.args.controller.sidebar.open = !this.args.controller.sidebar.open;
  }
<template>{{!-- template-lint-disable no-action --}}
<HeadLayout />
<EmberLoadRemover />

<PaperToaster />

<PaperSidenavContainer @class="site-nav-container">
  <PaperSidenav @lockedOpen="gt-sm" @open={{@controller.sidebar.open}} @onToggle={{this.toggleSidebar}}>
    <PaperContent>
      <PaperList>
        {{#if @controller.session.currentUser.admin}}
          <PaperItem>
            <LinkTo @route="drivers">
              <span>
                Drivers
              </span>
            </LinkTo>
          </PaperItem>
          <PaperItem>
            <LinkTo @route="reimbursements">
              <span>
                Reimbursements
              </span>
            </LinkTo>
          </PaperItem>
          <PaperItem>
            <LinkTo @route="debts">
              <span>
                Debts
              </span>
            </LinkTo>
          </PaperItem>
          <PaperItem>
            <LinkTo @route="rides">
              <span class="rides">
                <span>
                  Rides
                </span>
                {{#if @controller.ridesBadgeCount}}
                  <span class="count" title="How many rides require attention">
                    {{@controller.ridesBadgeCount}}
                  </span>
                {{/if}}
              </span>
            </LinkTo>
          </PaperItem>
          <PaperItem>
            <LinkTo @route="institutions">
              <span>
                Institutions
              </span>
            </LinkTo>
          </PaperItem>
          <PaperItem>
            <LinkTo @route="admin-calendar" @model={{momentFormat (now) "YYYY-MM"}}>
              <span>
                Calendar
              </span>
            </LinkTo>
          </PaperItem>
          <PaperItem>
            <LinkTo @route="statistics">
              <span>
                Statistics
              </span>
            </LinkTo>
          </PaperItem>
        {{/if}}
        <PaperItem>
          <LinkTo @route="reports.new">
            <span>
              Report
            </span>
          </LinkTo>
        </PaperItem>
        <PaperItem>
          <LinkTo @route="gas-prices">
            <span>
              Gas prices
            </span>
          </LinkTo>
        </PaperItem>
        {{#if @controller.session.isAuthenticated}}
          {{#if @controller.session.currentUser.admin}}
            <PaperItem>
              <LinkTo @route="log">
                <span class="log">
                  <span>
                    Log
                  </span>
                  {{#if @controller.sidebar.unreadCount}}
                    <span class="count" title="How many unread posts you have">
                      {{@controller.sidebar.unreadCount}}
                    </span>
                  {{/if}}
                </span>
              </LinkTo>
            </PaperItem>
            <PaperItem>
              <LinkTo @route="users">
                <span class="users">
                  <span>
                    Users
                  </span>
                  {{#if @controller.sidebar.userCount}}
                    <span class="count" title="How many users are connected">
                      {{@controller.sidebar.userCount}}
                    </span>
                  {{/if}}
                </span>
              </LinkTo>
            </PaperItem>
            <PaperDivider />
          {{/if}}
          <PaperItem @onClick={{this.logout}} @class="session">
            Log out {{@controller.session.currentUser.email}}
          </PaperItem>
        {{else}}
          <PaperItem>
            <LinkTo @route="login">
              <span>
                Admin log in
              </span>
            </LinkTo>
          </PaperItem>
        {{/if}}
      </PaperList>
    </PaperContent>
  </PaperSidenav>

  <main class="flex layout-column">
    {{outlet}}
  </main>
</PaperSidenavContainer></template>}

export default RouteTemplate(ApplicationComponent);
