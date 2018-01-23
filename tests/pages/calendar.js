import {
  attribute,
  clickable,
  collection,
  create,
  hasClass,
  text,
  visitable
} from 'ember-cli-page-object';
import { getter } from 'ember-cli-page-object/macros';

export default create({
  visit: visitable('/calendar/:month'),
  adminVisit: visitable('/admin-calendar/:month'),

  personSession: text('.person-session'),

  person: {
    scope: '.person-card',

    toggle: {
      scope: '.toggle'
    },

    name: {
      scope: '.name',
      field: {
        scope: 'input'
      },
      isError: hasClass('md-input-invalid'),
      error: {
        scope: '.paper-input-error'
      }
    },

    activeSwitch: {
      scope: '.paper-switch',
      enabled: hasClass('md-checked'),
      click: clickable('.md-thumb')
    },

    email: {
      scope: '.email',
      field: {
        scope: 'input',
        disabledAttribute: attribute('disabled'),
        isDisabled: getter(function() {
          return this.disabledAttribute === 'disabled';
        })
      },
      desiredMedium: {
        scope: 'md-radio-button',
        isChecked: hasClass('md-checked')
      },
      error: {
        scope: '.paper-input-error'
      }
    },

    mobile: {
      scope: '.mobile',
      field: {
        scope: 'input'
      },
      desiredMedium: {
        scope: 'md-radio-button',
        isChecked: hasClass('md-checked')
      },
      error: {
        scope: '.paper-input-error'
      }
    },

    selfNotes: {
      scope: '.self-notes',
      field: {
        scope: 'textarea'
      }
    },

    cancelButton: {
      scope: 'button.cancel'
    },

    submitButton: {
      scope: 'button.submit',
      isHighlighted: hasClass('md-primary')
    },
  },

  subscription: {
    scope: '.subscription',

    link: {
      scope: 'a:first',
      href: attribute('href')
    },
  },

  month: text('.ember-power-calendar-nav-title'),

  nextMonth: {
    scope: '.ember-power-calendar-nav-control.next-month'
  },

  previousMonth: {
    scope: '.ember-power-calendar-nav-control.previous-month'
  },

  days: collection({
    itemScope: '.ember-power-calendar-day',

    item: {
      slots: collection({
        itemScope: '.slot',

        item: {
          click: clickable('md-checkbox'),
          checkbox: { scope: 'md-checkbox' },
          hours: text('.hours'),

          count: {
            scope: '.count'
          },

          isCommittedTo: hasClass('md-checked', 'md-checkbox'),
          disabledAttribute: attribute('disabled', 'md-checkbox'),
          isFull: getter(function() {
            return this.disabledAttribute === 'disabled';
          })
        }
      })
    }
  }),

  viewingSlot: text('.viewing-slot .hours'),

  people: collection({
    itemScope: '.person-badge',

    item: {
      name: text('.name'),
      reveal: clickable('.name-container'),

      email: text('.email')
    }
  }),

  error: text('.error')
});
