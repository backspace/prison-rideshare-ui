import {
  attribute,
  clickable,
  collection,
  create,
  fillable,
  hasClass,
  is,
  text,
  triggerable,
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
      scope: 'md-switch',
      enabled: hasClass('md-checked'),
      click: triggerable('keypress', '.md-thumb', { eventProperties: { keyCode: 13 } })
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

  days: collection('.ember-power-calendar-day', {
    slots: collection('.slot', {
      click: clickable('md-checkbox'),
      checkbox: { scope: 'md-checkbox' },
      hours: text('.hours'),

      count: {
        scope: '.count',
        isCommittedTo: hasClass('committed-to'),
      },

      isCommittedTo: hasClass('md-checked', 'md-checkbox'),
      disabledAttribute: attribute('disabled', 'md-checkbox'),
      isDisabled: getter(function() {
        return this.disabledAttribute === 'disabled';
      })
    })
  }),

  viewingSlot: text('.viewing-slot .hours'),

  people: collection('md-chips.commitments md-chip', {
    name: text('.name'),
    reveal: clickable('.name-container'),

    email: text('.email'),

    remove: clickable('.md-chip-remove')
  }),

  peopleSearch: {
    scope: 'md-chips.commitments input',

    options: collection('.ember-power-select-option', {
      resetScope: true,

      name: text('.name'),
      click: clickable('.name')
    })
  },

  error: text('.error'),

  email: {
    open: clickable('button.email', {resetScope: true}),

    scope: 'md-dialog',

    title: text('h2'),

    peopleSearch: {
      scope: 'md-chips',

      fillIn: fillable('input'),

      options: collection({
        resetScope: true,
        itemScope: '.ember-power-select-option',

        item: {
          label: text(),
          click: clickable()
        }
      }),

      chips: collection({
        itemScope: 'md-chip',

        item: {
          text: text('.md-chip-content'),
          remove: clickable('.md-chip-remove')
        }
      })
    },

    addActiveButton: {
      scope: 'button.add-active'
    },

    filter: {
      scope: '.filter',

      fillIn: fillable('input'),

      add: { scope: '.add' },
      remove: { scope: '.remove' }
    },

    subject: { scope: '.subject' },

    body: {
      scope: '.body',
      fillIn: fillable('textarea'),
      error: { scope: '.paper-input-error' },
    },

    fetchLinksButton: {
      scope: 'button.fetch-links',
      isDisabled: is('[disabled]'),
    },

    links: collection({
      itemScope: '.links li',

      item: {
        email: text('.email'),
        link: attribute('href', '.link'),
        mailto: attribute('href', '.mailto')
      }
    }),

    sendButton: {
      scope: 'button.send',
      isRaised: hasClass('md-raised')
    }
  }
});
