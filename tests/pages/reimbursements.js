import {
  collection,
  create,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/reimbursements'),

  reimbursements: collection({
    itemScope: 'tbody tr.reimbursement',

    item: {
      name: text('.name'),
      amount: text('.amount')
    }
  })
});
