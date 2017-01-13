import {
  clickable,
  collection,
  create,
  hasClass,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/users'),

  users: collection({
    itemScope: 'tbody tr.user',

    item: {
      email: text('.email'),
      adminCheckbox: {
        scope: 'md-checkbox',
        checked: hasClass('md-checked'),
        click: clickable()
      }
    }
  })
});
