import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

export default Service.extend({
  overlaps: service(),
  store: service(),
  userSocket: service(),

  open: false,

  userCount: computed('userSocket.present.length', function() {
    const count = this.get('userSocket.present.length');

    if (count > 1) {
      return count;
    } else {
      return 0;
    }
  }),

  postsRequest: computed(function() {
    return ObjectPromiseProxy.create({
      promise: this.store.findAll('post').then(posts => {
        return {
          posts,
        };
      }),
    });
  }),

  unreadCount: computed('postsRequest.posts.@each.unread', function() {
    let posts = this.get('postsRequest.posts');

    if (posts) {
      return posts.filterBy('unread').length;
    } else {
      return 0;
    }
  }),

  notificationCount: computed(
    'userCount',
    'unreadCount',
    'overlaps.count',
    function() {
      // TODO this is untested
      return this.userCount + this.unreadCount + this.get('overlaps.count');
    }
  ),
});
