import { computed, set } from '@ember/object';
import Service, { inject as service } from '@ember/service';

import fetch from 'fetch';
import { task } from 'ember-concurrency';
import formatBriefTimespan from 'prison-rideshare-ui/utils/format-brief-timespan';

export default Service.extend({
  session: service(),
  store: service(),

  init() {
    this._super(...arguments);

    this.get('fetchOverlaps').perform();
  },

  fetchOverlaps: task(function*() {
    let rideAdapter = this.get('store').adapterFor('ride');
    let overlapsUrl = `${rideAdapter.buildURL('ride')}/overlaps`;
    let token = this.get('session.data.authenticated.access_token');

    let query = fetch(overlapsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let response = yield query;
    let json = yield response.json();

    this.set('overlaps', json);
  }),

  count: computed('overlaps.data.length', function() {
    return this.get('overlaps.data.length') || 0;
  }),

  rideIdsToCommitments: computed('overlaps.data.@each.id', function() {
    let response = this.get('overlaps');

    if (!response || !response.data) {
      return {};
    }

    return response.data.reduce((ridesToCommitments, rideJson) => {
      let commitmentIds = rideJson.relationships.commitments.data.mapBy('id');
      let commitments = response.included
        .filterBy('type', 'commitments')
        .filter(included => commitmentIds.includes(included.id));

      let relationshipIdToAttributes = response.included.reduce(
        (relationshipIdToAttributes, included) => {
          if (included.type === 'people') {
            relationshipIdToAttributes.people[included.id] =
              included.attributes;
          } else if (included.type === 'slots') {
            relationshipIdToAttributes.slots[included.id] = included.attributes;
          }

          return relationshipIdToAttributes;
        },
        { people: {}, slots: {} }
      );

      // TODO remove side effects
      commitments.forEach(commitment => {
        /* eslint-disable ember/no-side-effects */
        set(
          commitment,
          'person',
          relationshipIdToAttributes.people[
            commitment.relationships.person.data.id
          ]
        );
        set(
          commitment,
          'slot',
          relationshipIdToAttributes.slots[
            commitment.relationships.slot.data.id
          ]
        );
        set(
          commitment,
          'timespan',
          formatBriefTimespan(
            new Date(Date.parse(commitment.slot.start)),
            new Date(Date.parse(commitment.slot.end))
          )
        );
      });

      ridesToCommitments[rideJson.id] = commitments;

      return ridesToCommitments;
    }, {});
  }),

  commitmentsForRide(ride) {
    return this.get('rideIdsToCommitments')[ride.get('id')] || [];
  },

  fetch() {
    this.get('fetchOverlaps').perform();
  },
});
