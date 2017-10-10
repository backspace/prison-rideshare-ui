import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  session: service(),

  actions: {
    register(event) {
      event.preventDefault();

      const user = this.get('model');
      
      return user.save().then(() => {
        return this.get('session').authenticate(
          'authenticator:application',
          user.get('email'),
          user.get('password')
        );
      });
    }
  }
});
