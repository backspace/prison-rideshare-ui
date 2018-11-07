import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

export default Controller.extend({
  sidebar: service(),
  session: service(),
  store: service(),
  userSocket: service(),

  userCount: computed('userSocket.present.length', function () {
    const count = this.get('userSocket.present.length');

    if (count > 1) {
      return count;
    } else {
      return undefined;
    }
  }),

  postsRequest: computed(function () {
    return ObjectPromiseProxy.create({
      promise: this.get('store').findAll('post').then(posts => {
        return {
          posts
        };
      })
    });
  }),

  unreadCount: computed('postsRequest.posts.@each.unread', function () {
    let posts = this.get('postsRequest.posts')

    if (posts) {
      return posts.filterBy('unread').length;
    } else {
      return 0;
    }
  }),

  actions: {
    logout() {
      this.get('session').invalidate();
      this.store.unloadAll();
    }
  }
});
