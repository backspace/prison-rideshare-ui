/* eslint-disable ember/no-classic-classes, ember/no-get */
import { mapBy, filterBy } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';

import sum from 'ember-cpm/macros/sum';
import dollars from 'prison-rideshare-ui/utils/dollars';

import moment from 'moment';

export default EmberObject.extend({
  foodExpenses: mapBy('reimbursements', 'foodExpenses'),
  foodExpensesSum: sum('foodExpenses'),
  foodExpensesDollars: dollars('foodExpensesSum'),

  carExpenses: mapBy('reimbursements', 'carExpenses'),
  carExpensesSum: sum('carExpenses'),
  carExpensesDollars: dollars('carExpensesSum'),

  totalExpenses: sum('foodExpensesSum', 'carExpensesSum'),
  totalExpensesDollars: dollars('totalExpenses'),

  clipboardText: computed(
    'clipboardDescriptionColumn',
    'donations',
    'person.name',
    'totalExpensesDollars',
    function () {
      const name = this.get('person.name');
      const total = this.totalExpensesDollars;

      const today = new Date();
      const dateString = `${
        today.getMonth() + 1
      }/${today.getDate()}/${today.getFullYear()}`;

      return (
        `${dateString}\t` +
        this.clipboardDescriptionColumn +
        '\t' +
        `${name}\t` +
        `-$${total}\t` +
        `${this.donations ? `$${total}` : ''}\t` +
        '\t' +
        `${this.donations ? '(donated)' : ''}`
      );
    }
  ),

  copyIconTitle: computed('clipboardText', function () {
    return `This will copy the following to the clipboard: ${this.clipboardText}`;
  }),

  clipboardDescriptionColumn: computed(
    'carExpensesSum',
    'clipboardDescriptionColumnMeal',
    'foodExpensesSum',
    'monthName',
    function () {
      const food = this.foodExpensesSum;
      const car = this.carExpensesSum;

      let description;

      if (car && food) {
        description = `mileage + ${this.clipboardDescriptionColumnMeal}`;
      } else if (car) {
        description = 'mileage';
      } else {
        description = this.clipboardDescriptionColumnMeal;
      }

      return `${this.monthName} ${description}`;
    }
  ),

  clipboardDescriptionColumnMeal: computed(
    'reimbursementsWithFoodExpenses.length',
    function () {
      const meals = this.get('reimbursementsWithFoodExpenses.length');

      return `meal${meals > 1 ? ` × ${meals}` : ''}`;
    }
  ),

  reimbursementsWithFoodExpenses: filterBy('reimbursements', 'foodExpenses'),

  monthName: computed('reimbursements.firstObject.ride.start', function () {
    const date = this.get('reimbursements.firstObject.ride.start');
    return moment(date).format('MMMM');
  }),
});
