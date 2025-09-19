import classic from 'ember-classic-decorator';
import { set, computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';

import fetch from 'fetch';
import { task } from 'ember-concurrency';
import formatBriefTimespan from 'prison-rideshare-ui/utils/format-brief-timespan';

@classic
export default class OverlapsService extends Service {
  @service
  moment;

  @service
  session;

  @service
  store;

  init() {
    super.init(...arguments);

    this.fetchOverlaps.perform();
  }

  @task(function* () {
    let rideAdapter = this.store.adapterFor('ride');
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
  })
  fetchOverlaps;

  @computed('overlaps.data.length')
  get count() {
    return this.get('overlaps.data.length') || 0;
  }

  @computed('overlaps.data.@each.id')
  get rideIdsToCommitments() {
    let response = this.overlaps;

    if (!response || !response.data) {
      return {};
    }

    return response.data.reduce((ridesToCommitments, rideJson) => {
      let commitmentIds = rideJson.relationships.commitments.data.mapBy('id');
      let commitments = response.included
        .filterBy('type', 'commitments')
        .filter((included) => commitmentIds.includes(included.id));

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
      commitments.forEach((commitment) => {
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
            this.moment,
            new Date(Date.parse(commitment.slot.start)),
            new Date(Date.parse(commitment.slot.end))
          )
        );
      });

      ridesToCommitments[rideJson.id] = commitments;

      return ridesToCommitments;
    }, {});
  }

  commitmentsForRide(ride) {
    return this.rideIdsToCommitments[ride.get('id')] || [];
  }

  fetch() {
    this.fetchOverlaps.perform();
  }
}
