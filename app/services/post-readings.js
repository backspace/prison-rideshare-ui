import Service, { inject as service } from '@ember/service';
import fetch from 'fetch';

export default class PostReadingsService extends Service {
  @service store;

  async markAllRead() {
    return this._request('POST');
  }

  async markRead(post) {
    return this._request('POST', post);
  }

  async markUnread(post) {
    return this._request('DELETE', post);
  }

  async _request(method, post) {
    const adapter = this.store.adapterFor('post');
    const baseUrl = post?.id
      ? adapter.buildURL('post', post.id)
      : adapter.buildURL('post');

    const url = `${baseUrl}/readings`;
    const headers = { ...(adapter.headers || {}) };

    const response = await fetch(url, { method, headers });
    const payload = await this._parsePayload(response);

    if (!response.ok) {
      throw payload || response;
    }

    if (payload) {
      const modelClass = this.store.modelFor('post');
      const serializer = this.store.serializerFor('post');
      const documentHash = serializer.normalizeArrayResponse(
        this.store,
        modelClass,
        payload,
        post?.id,
        'readings',
      );
      return this.store.push(documentHash);
    }

    return payload;
  }

  async _parsePayload(response) {
    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      return null;
    }
  }
}
