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

    const lastMonthName = moment(today).subtract(1, 'months').format('MMMM');

    return `${dateString}\t` +
      `${lastMonthName} mileage${this.get('foodExpensesSum') > 0 ? ' + meal' : ''}\t` +
      `${name}\t` +
      `-$${total}\t` +
      `${this.get('donations') ? `$${total}` : ''}\t` +
      '\t' +
      `${this.get('donations') ? '(donated)' : ''}`;
  }),

  copyIconTitle: Ember.computed('clipboardText', function() {
    return `This will copy the following to the clipboard: ${this.get('clipboardText')}`;
  })
});
