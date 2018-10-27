import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/log';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | log', {
  beforeEach() {
    let poster = server.create('user', { email: 'jortle@tortle.ca', admin: true });

    server.create('post', {
      content: 'hello',
      poster,
      insertedAt: new Date(2018, 6, 6, 14)
    });

    server.create('post', {
      content: 'ya',
      poster,
      insertedAt: new Date(2018, 7, 7, 14, 18, 22)
    });

    authenticateSession(this.application, { access_token: 'abcdef' });
  }
});

test('it lists posts', function (assert) {
  page.visit();

  andThen(function () {
    assert.equal(shared.title, 'Log · Prison Rideshare');

    assert.equal(page.posts.length, 2);

    page.posts[0].as(post => {
      assert.equal(post.date, 'Tue Aug 7 2018 2:18p');
      assert.equal(post.poster, 'jortle@tortle.ca');
      assert.equal(post.content, 'ya');
    });
  });
});

test('a post can be created', function (assert) {
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
