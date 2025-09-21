/* eslint-disable ember/template-no-let-reference */
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import LinkedContact from 'prison-rideshare-ui/components/linked-contact';

module('Integration | Component | linked contact', function (hooks) {
  setupRenderingTest(hooks);

  test('it just renders the string when nothing is detected', async function (assert) {
    let value = 'hello';
    await render(<template><LinkedContact @contact={{value}} /></template>);
    assert.equal(find('span').innerHTML.trim(), 'hello');
  });

  test('it extracts a phone number', async function (assert) {
    let value = 'hello 212-986-8227 what';
    await render(<template><LinkedContact @contact={{value}} /></template>);
    assert.equal(
      find('span').innerHTML.trim(),
      `hello <a href="tel:212-986-8227">212-986-8227</a> what`,
    );
  });

  test('it extracts a phone number without dashes', async function (assert) {
    let value = 'hello 2129868227 what';
    await render(<template><LinkedContact @contact={{value}} /></template>);
    assert.equal(
      find('span').innerHTML.trim(),
      `hello <a href="tel:2129868227">2129868227</a> what`,
    );
  });

  test('it extracts a phone number with spaces', async function (assert) {
    let value = 'hello 212 986 8227 what';
    await render(<template><LinkedContact @contact={{value}} /></template>);
    assert.equal(
      find('span').innerHTML.trim(),
      `hello <a href="tel:212 986 8227">212 986 8227</a> what`,
    );
  });

  test('it extracts a phone number with brackets', async function (assert) {
    let value = 'hello (212) 986 8227 what';
    await render(<template><LinkedContact @contact={{value}} /></template>);
    assert.equal(
      find('span').innerHTML.trim(),
      `hello <a href="tel:(212) 986 8227">(212) 986 8227</a> what`,
    );
  });

  test('it ignores an undefined contactlet value', async function (assert) {
    await render(<template><LinkedContact /></template>);
    assert.equal(find('span').innerText.trim(), '');
  });
});
