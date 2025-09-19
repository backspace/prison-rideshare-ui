import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';

import moment from 'moment';
import { task } from 'ember-concurrency';

@classic
export default class CalendarController extends Controller {
  @service
  toasts;

  @alias('model.month')
  month;

  @alias('model.slots')
  slots;

  @alias('model.person')
  person;

  @computed('month')
  get monthMoment() {
    return moment(this.month);
  }

  @computed('person.{id,calendarSecret}')
  get httpSubscriptionUrl() {
    const person = this.person;

    const base = person.store
      .adapterFor('person')
      .buildURL('person', person.id);

    return `${base}/calendar?secret=${encodeURIComponent(person.get('calendarSecret'))}`;
  }

  @computed('httpSubscriptionUrl')
  get webcalSubscriptionUrl() {
    return this.httpSubscriptionUrl
      .replace('https', 'webcal')
      .replace('http', 'webcal');
  }

  @(task(function* () {
    try {
      yield this.person.save();

      this.toasts.show('Saved your details');
      this.set('showPerson', false);
    } catch (e) {
      this.toasts.show('Couldn’t save your details');
    }
  }).drop())
  savePerson;

  @action
  cancel() {
    this.set('showPerson', false);
    this.person.rollbackAttributes();
  }
}
