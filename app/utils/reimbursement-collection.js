import classic from 'ember-classic-decorator';
import { filterBy, mapBy } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';

import sum from 'ember-cpm/macros/sum';
import dollars from 'prison-rideshare-ui/utils/dollars';

import moment from 'moment';

@classic
export default class ReimbursementCollection extends EmberObject {
  @mapBy('reimbursements', 'foodExpenses')
  foodExpenses;

  @sum('foodExpenses')
  foodExpensesSum;

  @dollars('foodExpensesSum')
  foodExpensesDollars;

  @mapBy('reimbursements', 'carExpenses')
  carExpenses;

  @sum('carExpenses')
  carExpensesSum;

  @dollars('carExpensesSum')
  carExpensesDollars;

  @sum('foodExpensesSum', 'carExpensesSum')
  totalExpenses;

  @dollars('totalExpenses')
  totalExpensesDollars;

  @computed(
    'clipboardDescriptionColumn',
    'donations',
    'person.name',
    'totalExpensesDollars'
  )
  get clipboardText() {
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

  @computed('clipboardText')
  get copyIconTitle() {
    return `This will copy the following to the clipboard: ${this.clipboardText}`;
  }

  @computed(
    'carExpensesSum',
    'clipboardDescriptionColumnMeal',
    'foodExpensesSum',
    'monthName'
  )
  get clipboardDescriptionColumn() {
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

  @computed('reimbursementsWithFoodExpenses.length')
  get clipboardDescriptionColumnMeal() {
    const meals = this.get('reimbursementsWithFoodExpenses.length');

    return `meal${meals > 1 ? ` × ${meals}` : ''}`;
  }

  @filterBy('reimbursements', 'foodExpenses')
  reimbursementsWithFoodExpenses;

  @computed('reimbursements.firstObject.ride.start')
  get monthName() {
    const date = this.get('reimbursements.firstObject.ride.start');
    return moment(date).format('MMMM');
  }
}
