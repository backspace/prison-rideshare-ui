/* eslint-disable ember/no-side-effects */
import { set } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import fetch from 'fetch';
import { task } from 'ember-concurrency';
import formatBriefTimespan from 'prison-rideshare-ui/utils/format-brief-timespan';

export default class OverlapsService extends Service {
  @service moment;
  @service session;
  @service store;

  @tracked overlaps;

  constructor() {
    super(...arguments);
    this.fetchOverlaps.perform();
  }

  fetchOverlaps = task(async () => {
    let rideAdapter = this.store.adapterFor('ride');
    let overlapsUrl = `${rideAdapter.buildURL('ride')}/overlaps`;
    let token = this.session?.data?.authenticated?.access_token;

    let response = await fetch(overlapsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let json = await response.json();
    this.overlaps = json;
  });

  get count() {
    return this.overlaps?.data?.length || 0;
  }

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
        { people: {}, slots: {} },
      );

      // TODO remove side effects
      commitments.forEach((commitment) => {
        set(
          commitment,
          'person',
          relationshipIdToAttributes.people[
            commitment.relationships.person.data.id
          ],
        );
        set(
          commitment,
          'slot',
          relationshipIdToAttributes.slots[
            commitment.relationships.slot.data.id
          ],
        );
        set(
          commitment,
          'timespan',
          formatBriefTimespan(
            this.moment,
            new Date(Date.parse(commitment.slot.start)),
            new Date(Date.parse(commitment.slot.end)),
          ),
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
