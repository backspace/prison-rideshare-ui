import Ember from 'ember';

import sum from 'ember-cpm/macros/sum';
import dollars from 'prison-rideshare-ui/utils/dollars';

import moment from 'moment';

export default Ember.Object.extend({
  foodExpenses: Ember.computed.mapBy('reimbursements', 'foodExpenses'),
  foodExpensesSum: Ember.computed.sum('foodExpenses'),
  foodExpensesDollars: dollars('foodExpensesSum'),

  carExpenses: Ember.computed.mapBy('reimbursements', 'carExpenses'),
  carExpensesSum: Ember.computed.sum('carExpenses'),
  carExpensesDollars: dollars('carExpensesSum'),

  totalExpenses: sum('foodExpensesSum', 'carExpensesSum'),
  totalExpensesDollars: dollars('totalExpenses'),

  clipboardText: Ember.computed('person.name', 'totalExpensesDollars', function() {
    const name = this.get('person.name');
    const total = this.get('totalExpensesDollars');

    const today = new Date();
    const dateString = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    return `${dateString}\t` +
      this.get('clipboardDescriptionColumn') + '\t' +
      `${name}\t` +
      `-$${total}\t` +
      `${this.get('donations') ? `$${total}` : ''}\t` +
      '\t' +
      `${this.get('donations') ? '(donated)' : ''}`;
  }),

  copyIconTitle: Ember.computed('clipboardText', function() {
    return `This will copy the following to the clipboard: ${this.get('clipboardText')}`;
  }),

  clipboardDescriptionColumn: Ember.computed('monthName', 'foodExpensesSum', 'carExpensesSum', function() {
    const food = this.get('foodExpensesSum');
    const car = this.get('carExpensesSum');

    let description;

    if (car && food) {
      description = `mileage + ${this.get('clipboardDescriptionColumnMeal')}`;
    } else if (car) {
      description = 'mileage';
    } else {
      description = this.get('clipboardDescriptionColumnMeal');
    }

    return `${this.get('monthName')} ${description}`;
  }),

  clipboardDescriptionColumnMeal: Ember.computed('reimbursementsWithFoodExpenses.length', function() {
    const meals = this.get('reimbursementsWithFoodExpenses.length');

    return `meal${meals > 1 ? ` × ${meals}` : ''}`;
  }),

  reimbursementsWithFoodExpenses: Ember.computed.filterBy('reimbursements', 'foodExpenses'),

  monthName: Ember.computed('reimbursements.firstObject.date', function() {
    const date = this.get('reimbursements.firstObject.date');
    return moment(date).format('MMMM');
  })
});
