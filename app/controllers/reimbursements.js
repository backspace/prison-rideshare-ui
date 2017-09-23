import Ember from 'ember';
import ReimbursementCollection from 'prison-rideshare-ui/utils/reimbursement-collection';
// import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Ember.Controller.extend({
  queryParams: {
    showProcessed: 'processed'
  },

  reimbursements: Ember.computed.alias('model'),
  filteredReimbursements: Ember.computed('reimbursements.@each.processed', function() {
    return this.get('reimbursements').rejectBy('processed');
  }),

  showProcessed: false,

  unsortedProcessedReimbursements: Ember.computed.filterBy('reimbursements', 'processed'),
  processedReimbursementsSorting: ['insertedAt:desc'],
  processedReimbursements: Ember.computed.sort('unsortedProcessedReimbursements', 'processedReimbursementsSorting'),

  peopleAndReimbursements: Ember.computed('filteredReimbursements.@each.person', function() {
    const reimbursements = this.get('filteredReimbursements');

    const personIdToReimbursements = reimbursements.reduce((personIdToReimbursements, reimbursement) => {
      const person = reimbursement.get('person');
      const personId = person.get('id');

      if (!personIdToReimbursements[personId]) {
        personIdToReimbursements[personId] = [
          ReimbursementCollection.create({donations: false, person, reimbursements: []}),
          ReimbursementCollection.create({donations: true, person, reimbursements: []})
        ];
      }

      let collection;

      if (reimbursement.get('donation')) {
        collection = personIdToReimbursements[personId].find(c => c.get('donations'));
      } else {
        collection = personIdToReimbursements[personId].find(c => !c.get('donations'));
      }

      collection.get('reimbursements').push(reimbursement);

      return personIdToReimbursements;
    }, {});

    const collections = Object.keys(personIdToReimbursements).map(id => personIdToReimbursements[id]).sortBy('firstObject.person.name');

    collections.forEach(([nonDonations, donations]) => {
      if (nonDonations.reimbursements.get('length') === 0) {
        donations.set('showName', true);
      } else {
        nonDonations.set('showName', true);
      }
    });

    return collections;
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

    // Reimbursement editing will surely return!

    // editReimbursement(reimbursement) {
    //   const proxy = BufferedProxy.create({content: reimbursement});
    //
    //   this.set('editingReimbursement', proxy);
    // },
    //
    // submit() {
    //   const proxy = this.get('editingReimbursement');
    //   proxy.applyBufferedChanges();
    //   return proxy.get('content').save().then(() => this.set('editingReimbursement', undefined));
    // },
    //
    // cancel() {
    //   this.set('editingReimbursement', undefined);
    // }
  }
});
