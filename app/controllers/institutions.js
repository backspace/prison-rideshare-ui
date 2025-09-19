import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';

@classic
export default class InstitutionsController extends Controller {
  @service
  store;

  @action
  newInstitution() {
    this.set(
      'editingInstitution',
      BufferedProxy.create({
        content: this.store.createRecord('institution'),
      })
    );
  }

  @action
  editInstitution(institution) {
    const proxy = BufferedProxy.create({ content: institution });

    this.set('editingInstitution', proxy);
  }

  @action
  saveInstitution() {
    const proxy = this.editingInstitution;
    proxy.applyBufferedChanges();
    return proxy
      .get('content')
      .save()
      .then(() => this.set('editingInstitution', undefined))
      .catch(() => {});
  }

  @action
  cancelInstitution() {
    const model = this.get('editingInstitution.content');

    if (model.get('isNew')) {
      model.destroyRecord();
    }

    this.set('editingInstitution', undefined);
  }
}
