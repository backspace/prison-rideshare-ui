/* eslint-disable ember/no-classic-classes, ember/no-get */
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';

@classic
export default class DriversController extends Controller {
  @service
  store;

  @service
  toasts;

  showInactive = false;

  @action
  newPerson() {
    this.set(
      'editingPerson',
      BufferedProxy.create({
        content: this.store.createRecord('person'),
      }),
    );
  }

  @action
  editPerson(person) {
    const proxy = BufferedProxy.create({ content: person });

    this.set('editingPerson', proxy);
  }

  @action
  savePerson(event) {
    event?.preventDefault();

    const proxy = this.editingPerson;
    proxy.applyBufferedChanges();
    return proxy
      .get('content')
      .save()
      .then(() => this.set('editingPerson', undefined))
      .catch(() => {
        // FIXME this is handled for ride-saving failures, how to generalise?
      });
  }

  @action
  cancelPerson() {
    const model = this.get('editingPerson.content');

    if (model.get('isNew')) {
      model.destroyRecord();
    }

    this.set('editingPerson', undefined);
  }

  @action
  toggleShowInactive(event) {
    const checked = event?.target?.checked ?? false;
    this.set('showInactive', checked);
  }

  @action
  updatePersonActiveness(person, event) {
    const checked = event?.target?.checked ?? false;

    person.set('active', checked);
    person.save().catch(() => {
      this.toasts.show(
        `There was an error saving the active status of ${person.name}`,
      );
    });
  }

  @action
  updateEditingPerson(field, event) {
    const value = event?.target?.value ?? '';

    const editingPerson = this.editingPerson;
    if (editingPerson) {
      editingPerson.set(field, value);
    }
  }

  @action
  copyAddressSuccess() {
    this.toasts.show('Copied address');
  }
}
