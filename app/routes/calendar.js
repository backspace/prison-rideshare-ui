import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { isEmpty } from '@ember/utils';
import { isTesting } from '@ember/debug';
import fetch from 'fetch';
import config from '../config/environment';
import { pollTask, runTask } from 'ember-lifeline';

export const POLL_TOKEN = 'calendar_poll';

export default class CalendarRoute extends Route {
  @service store;

  model(
    { month },
    {
      to: {
        queryParams: { token },
      },
    },
  ) {
    const personTokenEndpoint = `${isTesting() ? '' : config.DS.host}/${
      config.DS.namespace
    }/people/token`;

    if (isEmpty(token)) {
      throw new Error('We were unable to log you in without a token.');
    }

    return fetch(personTokenEndpoint, {
      method: 'POST',
      body: `grant_type=magic&token=${encodeURIComponent(token)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((errorJson) => {
          throw errorJson;
        });
      })
      .then(async ({ access_token }) => {
        localStorage.setItem('person-token', access_token);
        const person = await this.store.queryRecord('person', {
          me: true,
          token: access_token,
        });

        await this.store.findAll('slot');

        return {
          slots: this.store.peekAll('slot'),
          person,
          month,
        };
      })
      .catch((error) => {
        const detail =
          error?.errors?.[0]?.detail ?? error?.errors?.firstObject?.detail;

        if (detail) {
          throw new Error(detail);
        } else {
          throw new Error('We were unable to log you in with that token.');
        }
      });
  }

  afterModel() {
    pollTask(this, 'poll', POLL_TOKEN);
  }

  async poll(next) {
    await this.store.findAll('slot', { reload: true });
    runTask(this, next, isTesting() ? 10 : 10000);
  }
}
