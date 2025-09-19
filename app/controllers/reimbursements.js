import classic from 'ember-classic-decorator';
import { mapBy, filterBy, sort, alias } from '@ember/object/computed';
import EmberObject, { action, computed } from '@ember/object';
import Controller from '@ember/controller';
import ReimbursementCollection from 'prison-rideshare-ui/utils/reimbursement-collection';
// import BufferedProxy from 'ember-buffered-proxy/proxy';

import moment from 'moment';

@classic
export default class ReimbursementsController extends Controller {
  queryParams = {
    showProcessed: 'processed',
  };

  @alias('model')
  reimbursements;

  @computed('reimbursements.@each.processed')
  get unsortedFilteredReimbursements() {
    return this.reimbursements.rejectBy('processed');
  }

  filteredReimbursementsSorting = Object.freeze(['ride.start']);

  @sort('unsortedFilteredReimbursements', 'filteredReimbursementsSorting')
  filteredReimbursements;

  showProcessed = false;

  @filterBy('reimbursements', 'processed')
  unsortedProcessedReimbursements;

  processedReimbursementsSorting = Object.freeze(['insertedAt:desc']);

  @sort('unsortedProcessedReimbursements', 'processedReimbursementsSorting')
  processedReimbursements;

  @computed('filteredReimbursements.@each.person')
  get monthReimbursementCollections() {
    const reimbursements = this.filteredReimbursements;
    const monthNumberStringToMonthName = {};

    const monthToPersonIdToReimbursements = reimbursements.reduce(
      (monthToPersonIdToReimbursements, reimbursement) => {
        // FIXME this assumes a ride is always preloaded and present
        const start = reimbursement.belongsTo('ride').value().get('start');
        const month = moment(start).format('YYYY-MM');

        if (!monthToPersonIdToReimbursements[month]) {
          monthToPersonIdToReimbursements[month] = {};
        }

        if (!monthNumberStringToMonthName[month]) {
          monthNumberStringToMonthName[month] =
            moment(start).format('MMMM YYYY');
        }

        const person = reimbursement.get('person');
        const personId = person.get('id');

        if (!monthToPersonIdToReimbursements[month][personId]) {
          monthToPersonIdToReimbursements[month][personId] = [
            ReimbursementCollection.create({
              donations: false,
              person,
              reimbursements: [],
            }),
            ReimbursementCollection.create({
              donations: true,
              person,
              reimbursements: [],
            }),
          ];
        }

        let collection;

        if (reimbursement.get('donation')) {
          collection = monthToPersonIdToReimbursements[month][personId].find(
            (c) => c.get('donations')
          );
        } else {
          collection = monthToPersonIdToReimbursements[month][personId].find(
            (c) => !c.get('donations')
          );
        }

        collection.get('reimbursements').push(reimbursement);

        return monthToPersonIdToReimbursements;
      },
      {}
    );

    const monthReimbursementCollections = Object.keys(
      monthToPersonIdToReimbursements
    ).reduce((monthReimbursementCollections, monthNumberString) => {
      const personIdToReimbursements =
        monthToPersonIdToReimbursements[monthNumberString];
      const collections = Object.keys(personIdToReimbursements)
        .map((id) => personIdToReimbursements[id])
        .sortBy('firstObject.person.name');

      collections.forEach(([nonDonations, donations]) => {
        if (nonDonations.reimbursements.get('length') === 0) {
          donations.set('showName', true);
        } else {
          nonDonations.set('showName', true);
        }
      });

      const flattenedCollections = collections.reduce(
        (flattenedCollections, collectionPair) => {
          return flattenedCollections.concat(collectionPair);
        },
        []
      );

      monthReimbursementCollections.push(
        MonthReimbursementCollections.create({
          monthNumberString,
          monthName: monthNumberStringToMonthName[monthNumberString],
          reimbursementCollections: flattenedCollections,
        })
      );

      return monthReimbursementCollections;
    }, []);

    return monthReimbursementCollections.sortBy('monthNumberString');
  }

  @action
  processReimbursements(personAndReimbursements, donation) {
    personAndReimbursements.get('reimbursements').forEach((reimbursement) => {
      reimbursement.set('processed', true);

      if (donation === true) {
        reimbursement.set('donation', true);
      }

      reimbursement.save();
    });
  }
}

@classic
class MonthReimbursementCollections extends EmberObject {
  @computed('reimbursementCollections', 'reimbursementCollectionsClipboardText')
  get clipboardText() {
    return this.reimbursementCollections
      .reduce(function (collections, collection) {
        if (collection.reimbursements.length) {
          collections.push(collection.clipboardText);
        }
        return collections;
      }, [])
      .join('\n');
  }

  @computed('clipboardText')
  get copyIconTitle() {
    return `This will copy the following to the clipboard:\n${this.clipboardText}`;
  }
}
