import { tracked } from '@glimmer/tracking';

export default class CalendarState {
  @tracked month;
  @tracked slots;
  @tracked person;

  constructor({ month = null, slots = null, person = null } = {}) {
    this.month = month;
    this.slots = slots;
    this.person = person;
  }
}
