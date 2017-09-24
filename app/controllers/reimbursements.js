import Ember from 'ember';
import ReimbursementCollection from 'prison-rideshare-ui/utils/reimbursement-collection';
// import BufferedProxy from 'ember-buffered-proxy/proxy';

import moment from 'moment';

export default Ember.Controller.extend({
  queryParams: {
    showProcessed: 'processed'
  },

  reimbursements: Ember.computed.alias('model'),
  unsortedFilteredReimbursements: Ember.computed('reimbursements.@each.processed', function() {
    return this.get('reimbursements').rejectBy('processed');
  }),
  filteredReimbursementsSorting: ['ride.start'],
  filteredReimbursements: Ember.computed.sort('unsortedFilteredReimbursements', 'filteredReimbursementsSorting'),

  showProcessed: false,

  unsortedProcessedReimbursements: Ember.computed.filterBy('reimbursements', 'processed'),
  processedReimbursementsSorting: ['insertedAt:desc'],
  processedReimbursements: Ember.computed.sort('unsortedProcessedReimbursements', 'processedReimbursementsSorting'),

  monthToReimbursementCollections: Ember.computed('filteredReimbursements.@each.person', function() {
    const reimbursements = this.get('filteredReimbursements');

    const monthToPersonIdToReimbursements = reimbursements.reduce((monthToPersonIdToReimbursements, reimbursement) => {
      // FIXME this assumes a ride is always preloaded and present
      const month = moment(reimbursement.belongsTo('ride').value().get('start')).format('MMMM');

      if (!monthToPersonIdToReimbursements[month]) {
        monthToPersonIdToReimbursements[month] = {};
      }

      const person = reimbursement.get('person');
      const personId = person.get('id');

      if (!monthToPersonIdToReimbursements[month][personId]) {
        monthToPersonIdToReimbursements[month][personId] = [
          ReimbursementCollection.create({donations: false, person, reimbursements: []}),
          ReimbursementCollection.create({donations: true, person, reimbursements: []})
        ];
      }

      let collection;

      if (reimbursement.get('donation')) {
        collection = monthToPersonIdToReimbursements[month][personId].find(c => c.get('donations'));
      } else {
        collection = monthToPersonIdToReimbursements[month][personId].find(c => !c.get('donations'));
      }

      collection.get('reimbursements').push(reimbursement);

      return monthToPersonIdToReimbursements;
    }, {});

    const monthToReimbursementCollections = Object.keys(monthToPersonIdToReimbursements).reduce((monthToReimbursementCollections, month) => {
      const personIdToReimbursements = monthToPersonIdToReimbursements[month];
      const collections = Object.keys(personIdToReimbursements).map(id => personIdToReimbursements[id]).sortBy('firstObject.person.name');

      collections.forEach(([nonDonations, donations]) => {
        if (nonDonations.reimbursements.get('length') === 0) {
          donations.set('showName', true);
        } else {
          nonDonations.set('showName', true);
        }
      });

      monthToReimbursementCollections[month] = collections;
      return monthToReimbursementCollections;
    }, {});

    return monthToReimbursementCollections;
  }),

  monthCount: Ember.computed('monthToReimbursementCollections', function() {
    return Object.keys(this.get('monthToReimbursementCollections')).length;
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
