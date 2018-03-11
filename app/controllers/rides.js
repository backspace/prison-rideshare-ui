import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Controller.extend({
  queryParams: {
    showCompleted: 'completed',
    showCancelled: 'cancelled',

    sortProp: 'sort',
    sortDir: 'dir',

    search: {
      replace: true
    }
  },

  peopleService: service('people'),
  people: alias('peopleService.all'),

  tour: service(),

  editingRide: undefined,
  editingCancellation: undefined,

  showCompleted: false,
  showCancelled: false,

  sortProp: 'start',
  sortDir: 'asc',

  showCreation: false,

  filteredRides: computed('showCompleted', 'showCancelled', 'model.@each.{complete,enabled,isCombined}', 'search', 'sortDir', function() {
    const showCompleted = this.get('showCompleted'), showCancelled = this.get('showCancelled');
    const search = this.get('search');

    let rides = this.get('model').rejectBy('isCombined');

    if (!showCompleted) {
      rides = rides.filterBy('complete', false);
    }

    if (!showCancelled) {
      rides = rides.filterBy('enabled');
    }

    if (search) {
      rides = rides.filter(ride => ride.matches(search));
    }

    rides.setEach('isDivider', false);

    const sorted = rides.sortBy('start');
    const sortDir = this.get('sortDir');
    const now = new Date();

    if (sortDir === 'asc') {
      const firstAfterNow = sorted.find(ride => ride.get('start') > now);

      if (firstAfterNow) {
        firstAfterNow.set('isDivider', true);
      }
    } else {
      const reversed = sorted.reverse();
      const firstBeforeNow = reversed.find(ride => ride.get('start') < now);

      if (firstBeforeNow) {
        firstBeforeNow.set('isDivider', true);
      }
    }

    return rides;
  }),

  actions: {
    newRide() {
      this.set('editingRide', BufferedProxy.create({
        content: this.store.createRecord('ride')
      }));
    },

    editRide(model) {
      this.set('editingRide', BufferedProxy.create({
        content: model
      }));
    },

    submit(proxy) {
      proxy.applyBufferedChanges();
      return proxy.get('content').save().then(() => this.set('editingRide', undefined)).catch(() => {
        // FIXME what is to be done?
      });
    },

    cancel() {
      const model = this.get('editingRide.content');

      if (model.get('isNew')) {
        model.destroyRecord();
      }

      this.get('editingRide').discardBufferedChanges();
      this.set('editingRide', undefined);
    },

    editCancellation(ride) {
      this.set('editingCancellation', BufferedProxy.create({
        content: ride
      }));

      if (ride.get('enabled')) {
        this.set('editingCancellation.cancelled', true);
      }
    },

    submitCancellation(proxy) {
      proxy.applyBufferedChanges();
      return proxy.get('content').save().then(() => this.set('editingCancellation'), undefined);
    },

    cancelCancellation() {
      this.get('editingCancellation').discardBufferedChanges();
      this.set('editingCancellation', undefined);
    },

    combineRide(ride) {
      if (this.get('rideToCombine')) {
        const rideToCombine = this.get('rideToCombine');

        if (rideToCombine.id == ride.id) {
          this.set('rideToCombine', undefined);
        } else {
          rideToCombine.set('combinedWith', ride);

          rideToCombine.save().then(() => this.set('rideToCombine', undefined));
        }
      } else {
        this.set('rideToCombine', ride);
      }
    },

    uncombineRide(ride) {
      ride.set('combinedWith', null);
      ride.save();
    },

    clearSearch() {
      this.set('search', undefined);
    },

    startTour() {
      this.get('tour').set('defaults', {
        modal: true
      });

      this.get('tour').set('modal', true);

      const builtInButtons = [
        {
          classes: 'shepherd-button-secondary',
          text: 'Exit',
          type: 'cancel'
        },
        {
          classes: 'shepherd-button-primary',
          text: 'Back',
          type: 'back'
        },
        {
          classes: 'shepherd-button-primary',
          text: 'Next',
          type: 'next'
        }
      ];
      const classes = 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text';

      this.get('tour').set('steps', [{
        id: 'introduction',
        options: {
          title: 'Ride list',
          text: ['This is the main screen. By default, it lists rides that are unfilled but not cancelled and ones where the driver has yet to submit the report.'],
          builtInButtons,
          classes,
        }
      }, {
        id: 'sorting',
        options: {
          title: 'Sorting',
          text: ['Rides are sorted by increasing start time by default; you can reverse with this icon.'],
          attachTo: '.md-sort-icon bottom',
          builtInButtons,
          classes,
          copyStyles: true
        }
      }]);

      this.get('tour').start();
    }
  }
});
