/* eslint-disable ember/no-classic-classes, ember/no-get*/
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { mapBy, gt } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

import dollars from 'prison-rideshare-ui/utils/dollars';
import formatTimespan from 'prison-rideshare-ui/utils/format-timespan';

import sum from 'ember-cpm/macros/sum';
import difference from 'ember-cpm/macros/difference';

import anonymiseAddress from 'prison-rideshare-ui/utils/anonymise-address';

export default Model.extend({
  moment: service(),

  enabled: attr('boolean', { defaultValue: true }),
  complete: attr('boolean', { defaultValue: false }),

  cancellationReason: attr(),

  combinedWith: belongsTo('ride', { inverse: 'children' }),
  children: hasMany('ride', { inverse: 'combinedWith' }),

  isCombined: computed('combinedWith.id', function () {
    return this.belongsTo('combinedWith').id();
  }),

  medium: attr(),
  requestConfirmed: attr(),

  name: attr(),

  institution: belongsTo(),
  rate: attr('number'),

  address: attr(),
  contact: attr(),
  passengers: attr({ defaultValue: 1 }),
  firstTime: attr('boolean'),

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
    },
  ),

  start: attr('date'),
  end: attr('date'),
  insertedAt: attr('date'),

  rideTimes: computed('start', 'end', function () {
    const start = this.start;
    const end = this.end;

    return formatTimespan(this.moment, start, end);
  }),

  driver: belongsTo('person'),
  carOwner: belongsTo('person'),
  initials: attr('string'),

  requestNotes: attr(),

  distance: attr(),

  reportNotes: attr(),

  overridable: attr('boolean'),

  reimbursements: hasMany(),

  foodExpenses: attr({ defaultValue: 0 }),
  foodExpensesDollars: dollars('foodExpenses'),

  carExpenses: attr({ defaultValue: 0 }),
  carExpensesDollars: dollars('carExpenses'),

  totalExpenses: sum('foodExpenses', 'carExpenses'),
  totalExpensesDollars: dollars('totalExpenses'),

  donation: attr('boolean'),
  donatable: attr('boolean'),

  reimbursementFoodExpenses: mapBy('reimbursements', 'foodExpenses'),
  reimbursementFoodExpensesSum: sum('reimbursementFoodExpenses'),
  outstandingFoodExpenses: difference(
    'foodExpenses',
    'reimbursementFoodExpensesSum',
  ),

  reimbursementCarExpenses: mapBy('reimbursements', 'carExpenses'),
  reimbursementCarExpensesSum: sum('reimbursementCarExpenses'),
  outstandingCarExpenses: difference(
    'carExpenses',
    'reimbursementCarExpensesSum',
  ),

  reimbursementExpensesSum: computed(
    'reimbursementFoodExpensesSum.[]',
    'reimbursementCarExpensesSum.[]',
    function () {
      return (
        this.reimbursementFoodExpensesSum + this.reimbursementCarExpensesSum
      );
    },
  ),

  outstandingTotalExpenses: sum(
    'outstandingFoodExpenses',
    'outstandingCarExpenses',
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
    },
  ),

  allAnonymisedAddresses: computed(
    'address',
    'children.@each.address',
    function () {
      return [this.address]
        .concat(this.children.mapBy('address'))
        .map((address) => anonymiseAddress(address))
        .join(', ');
    },
  ),

  allPassengers: computed(
    'passengers',
    'children.@each.passengers',
    function () {
      return this.children
        .mapBy('passengers')
        .reduce((sum, count) => count + sum, this.passengers);
    },
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
    },
  ),

  matches(casedQuery) {
    const query = casedQuery.toLowerCase();
    const matchString = this.matchString;

    return (query.match(/\S+/g) || []).every((queryTerm) =>
      matchString.includes(queryTerm),
    );
  },
});
