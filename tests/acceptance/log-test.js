import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import { authenticateSession } from 'ember-simple-auth/test-support';

import page from 'prison-rideshare-ui/tests/pages/log';
import loginPage from 'prison-rideshare-ui/tests/pages/login';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | log', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    let poster = this.server.create('user', {
      email: 'jortle@tortle.ca',
      admin: true,
    });

    this.server.create('post', {
      content: stringToMobiledoc('hello'),
      poster: this.server.create('user'),
      unread: true,
      insertedAt: new Date(2018, 6, 6, 14),
    });

    this.server.create('post', {
      content: stringToMobiledoc('ya'),
      poster,
      unread: false,
      insertedAt: new Date(2018, 7, 7, 14, 18, 22),
    });
  });

  test('it lists posts, with the unread count in the sidebar, and posts can be marked read and unread', async function(assert) {
    this.server.post('/token', () => {
      return {
        access_token: 'abcdef',
      };
    });

    await loginPage.visit();
    await loginPage.fillEmail('jorts@jants.ca');
    await loginPage.submit();

    await page.visit();

    assert.equal(shared.title, 'Log · Prison Rideshare');

    assert.equal(shared.logCount.text, '1');

    assert.equal(page.posts.length, 2);

    await page.posts[0].as(post => {
      assert.equal(post.date, 'Tue Aug 7 2018 2:18p');
      assert.equal(post.poster, 'jortle@tortle.ca');
      assert.equal(post.content, 'ya');
      assert.ok(post.editButton.isVisible);
      assert.ok(post.markUnreadButton.isVisible);
      assert.ok(post.markReadButton.isHidden);
    });

    assert.ok(page.posts[1].editButton.isHidden);
    assert.ok(page.posts[1].deleteButton.isHidden);
    assert.ok(page.posts[1].markReadButton.isVisible);

    await page.posts[0].markUnreadButton.click();

    assert.equal(shared.logCount.text, '2');
    assert.ok(page.posts[0].markUnreadButton.isHidden);
    assert.ok(page.posts[0].markReadButton.isVisible);

    await page.posts[0].markReadButton.click();

    assert.equal(shared.logCount.text, '1');
    assert.ok(page.posts[0].markUnreadButton.isVisible);

    await page.markAllReadButton.click();

    assert.ok(shared.logCount.isHidden);
    assert.ok(page.markAllReadButton.isHidden);
  });

  test('a post can be created', async function(assert) {
    authenticateSession({ access_token: 'abcdef' });

    await page.visit();

    await page.newPost();
    await page.form.content.field.fillIn('hello');

    assert.equal(page.posts.length, 2);

    await page.form.submit();

    assert.equal(page.posts.length, 3);

    const [, , post] = this.server.db.posts;
    assert.equal(post.content, stringToMobiledoc('hello'));
  });

  test('post validation errors are displayed', async function(assert) {
    authenticateSession({ access_token: 'abcdef' });

    this.server.post(
      '/posts',
      {
        errors: [
          {
            source: {
              pointer: '/data/attributes/content',
            },
            detail: "Content can't be blank",
          },
        ],
      },
      422
    );

    await page.visit();
    await page.newPost();
    await page.form.submit();

    assert.equal(page.form.content.error.text, "Content can't be blank");
  });

  test('posts can be edited, cancelled edits are discarded', async function(assert) {
    authenticateSession({ access_token: 'abcdef' });

    await page.visit();

    await page.posts[0].editButton.click();
    await page.form.content.field.fillIn('new post content');
    await page.form.cancel();

    assert.ok(page.form.isHidden);
    assert.equal(page.posts[0].content, 'ya');

    let posts = this.server.db.posts;
    let post = posts[posts.length - 1];

    assert.equal(post.content, stringToMobiledoc('ya'));

    await page.posts[0].editButton.click();
    await page.form.content.field.fillIn('new content');

    await page.form.submit();

    assert.equal(page.posts[0].content, 'new content');

    posts = this.server.db.posts;
    post = posts[posts.length - 1];

    assert.equal(post.content, stringToMobiledoc('new content'));
  });

  test('posts can be deleted', async function(assert) {
    authenticateSession({ access_token: 'abcdef' });

    await page.visit();

    await page.posts[0].deleteButton.click();
    await page.posts[0].deleteConfirm.click();

    assert.equal(this.server.db.posts.length, 1);
    assert.equal(page.posts.length, 1);
  });

  function stringToMobiledoc(string) {
    return JSON.stringify({
      version: '0.3.1',
      atoms: [],
      cards: [],
      markups: [],
      sections: [[1, 'p', [[0, [], 0, string]]]],
    });
  }
});
