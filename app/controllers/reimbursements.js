import EmberObject, { computed } from '@ember/object';
import { alias, sort, filterBy, mapBy } from '@ember/object/computed';
import Controller from '@ember/controller';
import ReimbursementCollection from 'prison-rideshare-ui/utils/reimbursement-collection';
// import BufferedProxy from 'ember-buffered-proxy/proxy';

import moment from 'moment';

export default Controller.extend({
  queryParams: {
    showProcessed: 'processed'
  },

  reimbursements: alias('model'),
  unsortedFilteredReimbursements: computed('reimbursements.@each.processed', function() {
    return this.get('reimbursements').rejectBy('processed');
  }),
  filteredReimbursementsSorting: Object.freeze(['ride.start']),
  filteredReimbursements: sort('unsortedFilteredReimbursements', 'filteredReimbursementsSorting'),

  showProcessed: false,

  unsortedProcessedReimbursements: filterBy('reimbursements', 'processed'),
  processedReimbursementsSorting: Object.freeze(['insertedAt:desc']),
  processedReimbursements: sort('unsortedProcessedReimbursements', 'processedReimbursementsSorting'),

  monthReimbursementCollections: computed('filteredReimbursements.@each.person', function() {
    const reimbursements = this.get('filteredReimbursements');
    const monthNumberStringToMonthName = {};

    const monthToPersonIdToReimbursements = reimbursements.reduce((monthToPersonIdToReimbursements, reimbursement) => {
      // FIXME this assumes a ride is always preloaded and present
      const start = reimbursement.belongsTo('ride').value().get('start');
      const month = moment(start).format('YYYY-MM');

      if (!monthToPersonIdToReimbursements[month]) {
        monthToPersonIdToReimbursements[month] = {};
      }

      if (!monthNumberStringToMonthName[month]) {
        monthNumberStringToMonthName[month] = moment(start).format('MMMM YYYY');
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

    const monthReimbursementCollections = Object.keys(monthToPersonIdToReimbursements).reduce((monthReimbursementCollections, monthNumberString) => {
      const personIdToReimbursements = monthToPersonIdToReimbursements[monthNumberString];
      const collections = Object.keys(personIdToReimbursements).map(id => personIdToReimbursements[id]).sortBy('firstObject.person.name');

      collections.forEach(([nonDonations, donations]) => {
        if (nonDonations.reimbursements.get('length') === 0) {
          donations.set('showName', true);
        } else {
          nonDonations.set('showName', true);
        }
      });

      const flattenedCollections = collections.reduce((flattenedCollections, collectionPair) => {
        return flattenedCollections.concat(collectionPair);
      }, []);

      monthReimbursementCollections.push(MonthReimbursementCollections.create({
        monthNumberString,
        monthName: monthNumberStringToMonthName[monthNumberString],
        reimbursementCollections: flattenedCollections
      }));

      return monthReimbursementCollections;
    }, []);

    return monthReimbursementCollections.sortBy('monthNumberString');
  }),

  actions: {
    processReimbursements(personAndReimbursements, donation) {
      personAndReimbursements.get('reimbursements').forEach(reimbursement => {
        reimbursement.set('processed', true);

        if (donation === true) {
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

const MonthReimbursementCollections = EmberObject.extend({
  reimbursementCollectionsWithReimbursements: filterBy('reimbursementCollections', 'reimbursements.length'),
  reimbursementCollectionsClipboardText: mapBy('reimbursementCollectionsWithReimbursements', 'clipboardText'),

  clipboardText: computed('reimbursementCollectionsClipboardText', function() {
    return this.get('reimbursementCollectionsClipboardText').join('\n');
  }),

  copyIconTitle: computed('clipboardText', function() {
    return `This will copy the following to the clipboard:\n${this.get('clipboardText')}`;
  })
});
