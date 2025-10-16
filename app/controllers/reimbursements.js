/* eslint-disable ember/no-classic-classes */
import classic from 'ember-classic-decorator';
import { filterBy, sort, alias } from '@ember/object/computed';
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
            (c) => c.get('donations'),
          );
        } else {
          collection = monthToPersonIdToReimbursements[month][personId].find(
            (c) => !c.get('donations'),
          );
        }

        collection.get('reimbursements').push(reimbursement);

        return monthToPersonIdToReimbursements;
      },
      {},
    );

    const monthReimbursementCollections = Object.keys(
      monthToPersonIdToReimbursements,
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
        [],
      );

      monthReimbursementCollections.push(
        MonthReimbursementCollections.create({
          monthNumberString,
          monthName: monthNumberStringToMonthName[monthNumberString],
          reimbursementCollections: flattenedCollections,
        }),
      );

      return monthReimbursementCollections;
    }, []);

    return monthReimbursementCollections.sortBy('monthNumberString');
  }

  @computed('monthReimbursementCollections')
  get monthTableRows() {
    const collections = this.monthReimbursementCollections ?? [];

    return collections.reduce((rows, monthCollection) => {
      const monthRow = {
        type: 'month',
        id: `month-${monthCollection.monthNumberString}`,
        monthName: monthCollection.monthName,
        clipboardText: monthCollection.clipboardText,
        copyIconTitle: monthCollection.copyIconTitle,
      };

      rows.push(monthRow);

      monthCollection.reimbursementCollections.forEach(
        (reimbursementCollection, index) => {
          if (
            !reimbursementCollection ||
            reimbursementCollection.reimbursements.length === 0
          ) {
            return;
          }

          rows.push({
            type: 'person',
            id: `month-${monthCollection.monthNumberString}-collection-${index}-${
              reimbursementCollection.get('person.id') ?? 'unknown'
            }`,
            name: reimbursementCollection.showName
              ? (reimbursementCollection.get('person.name') ?? '')
              : '',
            foodExpenses: reimbursementCollection.donations
              ? ''
              : reimbursementCollection.foodExpensesDollars,
            carExpenses: reimbursementCollection.carExpensesDollars,
            totalExpenses: reimbursementCollection.totalExpensesDollars,
            isDonation: Boolean(reimbursementCollection.donations),
            clipboardText: reimbursementCollection.clipboardText,
            copyIconTitle: reimbursementCollection.copyIconTitle,
            reimbursementCollection,
          });
        },
      );

      return rows;
    }, []);
  }

  get monthTableColumns() {
    return [
      { key: 'name', label: 'Person' },
      { key: 'food', label: 'Food' },
      { key: 'car', label: 'Car' },
      { key: 'total', label: 'Total' },
      { key: 'actions', label: '' },
    ];
  }

  @computed('processedReimbursements.@each.{insertedAt,donation}')
  get processedTableRows() {
    const reimbursements = this.processedReimbursements ?? [];

    return reimbursements.map((reimbursement) => {
      return {
        id: reimbursement.id,
        date: reimbursement.insertedAt,
        name: reimbursement.get('person.name') ?? '',
        ride: reimbursement.ride,
        foodExpensesDollars: reimbursement.foodExpensesDollars,
        carExpensesDollars: reimbursement.carExpensesDollars,
        donation: reimbursement.donation,
      };
    });
  }

  @action
  toggleShowProcessed(event) {
    const checked = event?.target?.checked ?? false;

    this.set('showProcessed', checked);
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
