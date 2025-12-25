/* eslint-disable ember/no-classic-classes */
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Controller from '@ember/controller';

@classic
export default class DebtsController extends Controller {
  @action
  reimburse(debt) {
    return debt.destroyRecord();
  }

  get tableColumns() {
    return [
      { key: 'person', label: 'Person', isExpandable: true },
      { key: 'food', label: 'Food' },
      { key: 'car', label: 'Car' },
      { key: 'total', label: 'Total' },
      { key: 'actions', label: '' },
    ];
  }

  get tableRows() {
    const debts = this.model ?? [];

    return debts.map((debt) => {
      const person = debt.get('person');

      const rideRows = (debt.descendingRides ?? []).map((ride) => {
        const reimbursements = ride.hasMany('reimbursements').value() || [];
        const matchingReimbursements = Array.from(reimbursements).filter(
          (reimbursement) =>
            reimbursement.get('person.id') === debt.get('person.id'),
        );

        const sumAmounts = (items, property) => {
          return items
            .map((item) => Number(item.get(property) ?? 0))
            .reduce((total, value) => total + value, 0);
        };

        const foodReimbursedValue = sumAmounts(
          matchingReimbursements,
          'foodExpensesDollars',
        );
        const carReimbursedValue = sumAmounts(
          matchingReimbursements,
          'carExpensesDollars',
        );

        const food =
          ride.get('driver.id') === debt.get('person.id')
            ? ride.foodExpensesDollars
            : '';
        const car =
          ride.get('carOwner.id') === debt.get('person.id')
            ? ride.carExpensesDollars
            : '';

        return {
          type: 'ride',
          debt,
          ride,
          person,
          food,
          car,
          donation:
            ride.donation && ride.get('carOwner.id') === debt.get('person.id'),
          carReimbursed: carReimbursedValue > 0 ? carReimbursedValue : null,
          foodReimbursed: foodReimbursedValue > 0 ? foodReimbursedValue : null,
        };
      });

      return {
        type: 'person',
        debt,
        person,
        food: debt.foodExpensesDollars,
        car: debt.carExpensesDollars,
        total: debt.totalExpensesDollars,
        isOpen: true,
        children: rideRows,
      };
    });
  }
}
