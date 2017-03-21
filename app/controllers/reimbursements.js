import Ember from 'ember';
import BufferedProxy from 'ember-buffered-proxy/proxy';

import sum from 'ember-cpm/macros/sum';
import dollars from 'prison-rideshare-ui/utils/dollars';

export default Ember.Controller.extend({
  reimbursements: Ember.computed.alias('model'),
  filteredReimbursements: Ember.computed('reimbursements.@each.processed', function() {
    return this.get('reimbursements').rejectBy('processed');
  }),

  personAndReimbursements: Ember.computed('filteredReimbursements.@each.person', function() {
    const reimbursements = this.get('filteredReimbursements');

    const personIdToReimbursements = reimbursements.reduce((personIdToReimbursements, reimbursement) => {
      const person = reimbursement.get('person');
      const personId = person.get('id');

      if (!personIdToReimbursements[personId]) {
        personIdToReimbursements[personId] = ReimbursementCollection.create({person, reimbursements: []});
      }

      personIdToReimbursements[personId].get('reimbursements').push(reimbursement);

      return personIdToReimbursements;
    }, {});

    return Object.keys(personIdToReimbursements).map(id => personIdToReimbursements[id]).sortBy('person.name');
  }),

  actions: {
    processReimbursements(personAndReimbursements, donation) {
      personAndReimbursements.get('reimbursements').forEach(reimbursement => {
        reimbursement.set('processed', true);

        if (donation) {
          reimbursement.set('donation', true);
        }

        reimbursement.save();
      });
    },

    editReimbursement(reimbursement) {
      const proxy = BufferedProxy.create({content: reimbursement});

      this.set('editingReimbursement', proxy);
    },

    submit() {
      const proxy = this.get('editingReimbursement');
      proxy.applyBufferedChanges();
      return proxy.get('content').save().then(() => this.set('editingReimbursement', undefined));
    },

    cancel() {
      this.set('editingReimbursement', undefined);
    }
  }
});

const ReimbursementCollection = Ember.Object.extend({
  foodExpenses: Ember.computed.mapBy('reimbursements', 'foodExpenses'),
  foodExpensesSum: Ember.computed.sum('foodExpenses'),
  foodExpensesDollars: dollars('foodExpensesSum'),

  carExpenses: Ember.computed.mapBy('reimbursements', 'carExpenses'),
  carExpensesSum: Ember.computed.sum('carExpenses'),
  carExpensesDollars: dollars('carExpensesSum'),

  totalExpenses: sum('foodExpensesSum', 'carExpensesSum'),
  totalExpensesDollars: dollars('totalExpenses')
});
