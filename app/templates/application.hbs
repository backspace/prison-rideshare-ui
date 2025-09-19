{{! template-lint-disable no-action }}
<HeadLayout />
<EmberLoadRemover />

<PaperToaster />

<PaperSidenavContainer @class='site-nav-container'>
  <PaperSidenav
    @lockedOpen='gt-sm'
    @open={{this.sidebar.open}}
    @onToggle={{action (mut this.sidebar.open)}}
  >
    <PaperContent>
      <PaperList>
        {{#if this.session.currentUser.admin}}
          <PaperItem>
            <LinkTo @route='drivers'>
              <span>
                Drivers
              </span>
            </LinkTo>
          </PaperItem>
          <PaperItem>
            <LinkTo @route='reimbursements'>
              <span>
                Reimbursements
              </span>
            </LinkTo>
          </PaperItem>
          <PaperItem>
            <LinkTo @route='debts'>
              <span>
                Debts
              </span>
            </LinkTo>
          </PaperItem>
          <PaperItem>
            <LinkTo @route='rides'>
              <span class='rides'>
                <span>
                  Rides
                </span>
                {{#if this.ridesBadgeCount}}
                  <span class='count' title='How many rides require attention'>
                    {{this.ridesBadgeCount}}
                  </span>
                {{/if}}
              </span>
            </LinkTo>
          </PaperItem>
          <PaperItem>
            <LinkTo @route='institutions'>
              <span>
                Institutions
              </span>
            </LinkTo>
          </PaperItem>
          <PaperItem>
            <LinkTo
              @route='admin-calendar'
              @model={{moment-format (now) 'YYYY-MM'}}
            >
              <span>
                Calendar
              </span>
            </LinkTo>
          </PaperItem>
          <PaperItem>
            <LinkTo @route='statistics'>
              <span>
                Statistics
              </span>
            </LinkTo>
          </PaperItem>
        {{/if}}
        <PaperItem>
          <LinkTo @route='reports.new'>
            <span>
              Report
            </span>
          </LinkTo>
        </PaperItem>
        <PaperItem>
          <LinkTo @route='gas-prices'>
            <span>
              Gas prices
            </span>
          </LinkTo>
        </PaperItem>
        {{#if this.session.isAuthenticated}}
          {{#if this.session.currentUser.admin}}
            <PaperItem>
              <LinkTo @route='log'>
                <span class='log'>
                  <span>
                    Log
                  </span>
                  {{#if this.sidebar.unreadCount}}
                    <span class='count' title='How many unread posts you have'>
                      {{this.sidebar.unreadCount}}
                    </span>
                  {{/if}}
                </span>
              </LinkTo>
            </PaperItem>
            <PaperItem>
              <LinkTo @route='users'>
                <span class='users'>
                  <span>
                    Users
                  </span>
                  {{#if this.sidebar.userCount}}
                    <span class='count' title='How many users are connected'>
                      {{this.sidebar.userCount}}
                    </span>
                  {{/if}}
                </span>
              </LinkTo>
            </PaperItem>
            <PaperDivider />
          {{/if}}
          <PaperItem @onClick={{action 'logout'}} @class='session'>
            Log out {{this.session.currentUser.email}}
          </PaperItem>
        {{else}}
          <PaperItem>
            <LinkTo @route='login'>
              <span>
                Admin log in
              </span>
            </LinkTo>
          </PaperItem>
        {{/if}}
      </PaperList>
    </PaperContent>
  </PaperSidenav>

  <main class='flex layout-column'>
    {{outlet}}
  </main>
</PaperSidenavContainer>