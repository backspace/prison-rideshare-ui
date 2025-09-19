/* eslint-disable ember/no-classic-classes, ember/no-get, ember/use-ember-data-rfc-395-imports, no-unused-vars */
import { mapBy, gt } from '@ember/object/computed';
import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import dollars from 'prison-rideshare-ui/utils/dollars';
import formatTimespan from 'prison-rideshare-ui/utils/format-timespan';

import sum from 'ember-cpm/macros/sum';
import difference from 'ember-cpm/macros/difference';

import anonymiseAddress from 'prison-rideshare-ui/utils/anonymise-address';

export default DS.Model.extend({
  moment: service(),

  enabled: DS.attr('boolean', { defaultValue: true }),
  complete: DS.attr('boolean', { defaultValue: false }),

  cancellationReason: DS.attr(),

  combinedWith: DS.belongsTo('ride', { inverse: 'children' }),
  children: DS.hasMany('ride', { inverse: 'combinedWith' }),

  isCombined: computed('combinedWith.id', function () {
    return this.belongsTo('combinedWith').id();
  }),

  medium: DS.attr(),
  requestConfirmed: DS.attr(),

  name: DS.attr(),

  institution: DS.belongsTo(),
  rate: DS.attr('number'),

  address: DS.attr(),
  contact: DS.attr(),
  passengers: DS.attr({ defaultValue: 1 }),
  firstTime: DS.attr('boolean'),

  validationErrors: computed(
    'constructor.attributes',
    'errors.[]',
    function () {
      const attributes = this.constructor.attributes;
      const attributeKeys = Array.from(attributes.keys());
      attributeKeys.push('institution');

      return Array.from(attributeKeys).reduce((response, key) => {
        const errors = this.get(`errors.${key}`) || [];
        response[key] = errors.mapBy('message');
        return response;
      }, {});
    }
  ),

  start: DS.attr('date'),
  end: DS.attr('date'),
  insertedAt: DS.attr('date'),

  rideTimes: computed('start', 'end', function () {
    const start = this.start;
    const end = this.end;

    return formatTimespan(this.moment, start, end);
  }),

  driver: DS.belongsTo('person'),
  carOwner: DS.belongsTo('person'),
  initials: DS.attr('string'),

  requestNotes: DS.attr(),

  distance: DS.attr(),

  reportNotes: DS.attr(),

  overridable: DS.attr('boolean'),

  reimbursements: DS.hasMany(),

  foodExpenses: DS.attr({ defaultValue: 0 }),
  foodExpensesDollars: dollars('foodExpenses'),

  carExpenses: DS.attr({ defaultValue: 0 }),
  carExpensesDollars: dollars('carExpenses'),

  totalExpenses: sum('foodExpenses', 'carExpenses'),
  totalExpensesDollars: dollars('totalExpenses'),

  donation: DS.attr('boolean'),
  donatable: DS.attr('boolean'),

  reimbursementFoodExpenses: mapBy('reimbursements', 'foodExpenses'),
  reimbursementFoodExpensesSum: sum('reimbursementFoodExpenses'),
  outstandingFoodExpenses: difference(
    'foodExpenses',
    'reimbursementFoodExpensesSum'
  ),

  reimbursementCarExpenses: mapBy('reimbursements', 'carExpenses'),
  reimbursementCarExpensesSum: sum('reimbursementCarExpenses'),
  outstandingCarExpenses: difference(
    'carExpenses',
    'reimbursementCarExpensesSum'
  ),

  reimbursementExpensesSum: computed(
    'reimbursementFoodExpensesSum.[]',
    'reimbursementCarExpensesSum.[]',
    function () {
      return (
        this.reimbursementFoodExpensesSum + this.reimbursementCarExpensesSum
      );
    }
  ),

  outstandingTotalExpenses: sum(
    'outstandingFoodExpenses',
    'outstandingCarExpenses'
  ),

  namePlusPassengers: computed('name', 'passengers', function () {
    const name = this.name;
    const passengers = this.passengers;

    if (passengers > 1) {
      return `${name} + ${passengers - 1}`;
    } else {
      return name;
    }
  }),

  distanceExists: gt('distance', 0),
  carExpensesExist: gt('carExpenses', 0),

  cancelled: computed('enabled', {
    get() {
      return !this.enabled;
    },

    set(key, value) {
      this.set('enabled', !value);
      return value;
    },
  }),

  requiresConfirmation: computed(
    '{start,enabled,requestConfirmed}',
    function () {
      const now = new Date();

      return this.start > now && this.enabled && !this.requestConfirmed;
    }
  ),

  allAnonymisedAddresses: computed(
    'address',
    'children.@each.address',
    function () {
      return [this.address]
        .concat(this.children.mapBy('address'))
        .map((address) => anonymiseAddress(address))
        .join(', ');
    }
  ),

  allPassengers: computed(
    'passengers',
    'children.@each.passengers',
    function () {
      return this.children
        .mapBy('passengers')
        .reduce((sum, count) => count + sum, this.passengers);
    }
  ),

  matchString: computed(
    'institution.name',
    'driver.name',
    'carOwner.name',
    'name',
    'address',
    function () {
      return `${
        this.get('institution.name') === undefined
          ? ''
          : this.get('institution.name')
      } ${
        this.get('driver.name') === undefined ? '' : this.get('driver.name')
      } ${
        this.get('carOwner.name') === undefined ? '' : this.get('carOwner.name')
      } ${this.name === undefined ? '' : this.name} ${
        this.address
      }`.toLowerCase();
    }
  ),

  matches(casedQuery) {
    const query = casedQuery.toLowerCase();
    const matchString = this.matchString;

    return (query.match(/\S+/g) || []).every((queryTerm) =>
      matchString.includes(queryTerm)
    );
  },
});
