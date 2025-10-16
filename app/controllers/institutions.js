/* eslint-disable ember/no-classic-classes, ember/no-get */
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';

@classic
export default class InstitutionsController extends Controller {
  @service
  store;

  get tableColumns() {
    return [
      { key: 'name', label: 'Name' },
      { key: 'far', label: 'Far' },
      { key: 'actions', label: '' },
    ];
  }

  get tableRows() {
    const institutions = this.model;

    return institutions
      .filter((institution) => !institution.isNew)
      .sort((a, b) => {
        const aName = (a?.name ?? '').toLowerCase();
        const bName = (b?.name ?? '').toLowerCase();

        if (aName < bName) {
          return -1;
        }

        if (aName > bName) {
          return 1;
        }

        return 0;
      })
      .map((institution) => {
        return {
          institution,
        };
      });
  }

  @action
  newInstitution() {
    this.set(
      'editingInstitution',
      BufferedProxy.create({
        content: this.store.createRecord('institution'),
      }),
    );
  }

  @action
  editInstitution(institution) {
    const proxy = BufferedProxy.create({ content: institution });

    this.set('editingInstitution', proxy);
  }

  @action
  saveInstitution(event) {
    event?.preventDefault?.();

    const proxy = this.editingInstitution;
    proxy.applyBufferedChanges();
    return proxy
      .get('content')
      .save()
      .then(() => this.set('editingInstitution', undefined))
      .catch(() => {});
  }

  @action
  cancelInstitution(event) {
    event?.preventDefault?.();

    const model = this.get('editingInstitution.content');

    if (model.get('isNew')) {
      model.destroyRecord();
    }

    this.set('editingInstitution', undefined);
  }
}
