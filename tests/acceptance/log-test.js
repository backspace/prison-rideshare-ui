import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/log';
import loginPage from 'prison-rideshare-ui/tests/pages/login';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | log', {
  beforeEach() {
    let poster = server.create('user', { email: 'jortle@tortle.ca', admin: true });

    server.create('post', {
      content: 'hello',
      poster: server.create('user'),
      insertedAt: new Date(2018, 6, 6, 14)
    });

    server.create('post', {
      content: 'ya',
      poster,
      insertedAt: new Date(2018, 7, 7, 14, 18, 22)
    });
  }
});

test('it lists posts', function (assert) {
  server.post('/token', () => {
    return {
      access_token: 'abcdef'
    };
  });

  loginPage.visit();
  loginPage.fillEmail('jorts@jants.ca');
  loginPage.submit();

  page.visit();

  andThen(function () {
    assert.equal(shared.title, 'Log · Prison Rideshare');

    assert.equal(page.posts.length, 2);

    page.posts[0].as(post => {
      assert.equal(post.date, 'Tue Aug 7 2018 2:18p');
      assert.equal(post.poster, 'jortle@tortle.ca');
      assert.equal(post.content, 'ya');
      assert.ok(post.editButton.isVisible);
    });

    assert.ok(page.posts[1].editButton.isHidden);
  });
});

test('a post can be created', function (assert) {
  authenticateSession(this.application, { access_token: 'abcdef' });

  page.visit();

  page.newPost();
  page.form.content.field.fillIn('hello');

  andThen(() => {
    assert.equal(page.posts.length, 2);
  });

  page.form.submit();

  andThen(() => {
    assert.equal(page.posts.length, 3);

    const [, , post] = server.db.posts;
    assert.equal(post.content, 'hello');
  });
});

test('post validation errors are displayed', function (assert) {
  authenticateSession(this.application, { access_token: 'abcdef' });

  server.post('/posts', {
    errors: [{
      'source': {
        'pointer': '/data/attributes/content'
      },
      'detail': 'Content can\'t be blank'
    }]
  }, 422);

  page.visit();
  page.newPost();
  page.form.submit();

  andThen(() => {
    assert.equal(page.form.content.error.text, 'Content can\'t be blank');
  });
});

test('posts can be edited, cancelled edits are discarded', function (assert) {
  authenticateSession(this.application, { access_token: 'abcdef' });

  page.visit();

  page.posts[0].editButton.click();
  page.form.content.field.fillIn('new post content');
  page.form.cancel();

  andThen(() => {
    assert.ok(page.form.isHidden);
    assert.equal(page.posts[0].content, 'ya');

    let posts = server.db.posts;
    const post = posts[posts.length - 1];

    assert.equal(post.content, 'ya');
  });

  page.posts[0].editButton.click();
  page.form.content.field.fillIn('new content');

  page.form.submit();

  andThen(() => {
    assert.equal(page.posts[0].content, 'new content');

    let posts = server.db.posts;
    const post = posts[posts.length - 1];

    assert.equal(post.content, 'new content');
  });
});
