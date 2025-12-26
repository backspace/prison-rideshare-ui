/* eslint-disable ember/no-get */
import { tracked } from '@glimmer/tracking';
import Service, { inject as service } from '@ember/service';
import { runTask } from 'ember-lifeline';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

class ObjectPromiseProxy extends ObjectProxy.extend(PromiseProxyMixin) {}

export default class SidebarService extends Service {
  @service overlaps;
  @service session;
  @service store;

  @service
  userSocket;

  @tracked navIsMinimized = true;
  @tracked open = false;

  navComponent = null;
  postsRequestProxy = null;
  ridesRequestProxy = null;

  get userCount() {
    const count = this.get('userSocket.present.length');

    if (count > 1) {
      return count;
    } else {
      return 0;
    }
  }

  get postsRequest() {
    if (!this.postsRequestProxy) {
      this.postsRequestProxy = ObjectPromiseProxy.create({
        promise: this.store.findAll('post').then((posts) => {
          return {
            posts,
          };
        }),
      });
    }

    return this.postsRequestProxy;
  }

  get ridesRequest() {
    if (!this.ridesRequestProxy) {
      this.ridesRequestProxy = ObjectPromiseProxy.create({
        promise: this.store.findAll('ride').then((rides) => {
          return {
            rides,
          };
        }),
      });
    }

    return this.ridesRequestProxy;
  }

  get unreadCount() {
    let posts = this.get('postsRequest.posts');

    if (posts) {
      return posts.filter((p) => p.unread).length;
    } else {
      return 0;
    }
  }

  get requiresConfirmationCount() {
    let rides = this.get('ridesRequest.rides');

    if (rides) {
      return rides.filter((r) => r.requiresConfirmation).length;
    } else {
      return 0;
    }
  }

  get notificationCount() {
    if (this.session.get('currentUser.admin')) {
      return (
        this.userCount +
        this.unreadCount +
        this.get('overlaps.count') +
        this.requiresConfirmationCount
      );
    }

    return 0;
  }

  registerNavComponent(component) {
    this.navComponent = component;

    // Defer tracked updates to avoid mutating after consumption during render
    if (component) {
      const nextState = Boolean(component.args?.isMinimized);

      if (this.navIsMinimized !== nextState) {
        runTask(this, () => (this.navIsMinimized = nextState));
      }

      runTask(this, this.expandNavIfNeeded);
    } else if (!this.navIsMinimized) {
      runTask(this, () => (this.navIsMinimized = true));
    }
  }

  setNavMinimizedState(isMinimized) {
    this.navIsMinimized = isMinimized;
  }

  expandNavIfNeeded() {
    if (!this.open) {
      return;
    }

    if (!this.navComponent || !this.navIsMinimized) {
      return;
    }

    this.navComponent.toggleMinimizedStatus();
  }

  collapseNavIfNeeded() {
    if (!this.navComponent || this.navIsMinimized) {
      return false;
    }

    this.navComponent.toggleMinimizedStatus();

    return true;
  }
}
