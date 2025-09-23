import { faker } from '@faker-js/faker';
faker.seed(1919);

import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';

const cancellationReasons = Object.keys(reasonToIcon).sort();

export default function (server) {
  const people = server.createList('person', 8);

  const institutionNames = [
    'Brandon',
    'Headingley',
    'Milner Ridge',
    'Rockwood',
    'Stony Mountain',
  ];

  const institutions = institutionNames.map((name) =>
    server.create('institution', { name })
  );

  for (let i = 0; i < 25; i++) {
    const start = faker.date.recent((i + 1) * 2);
    const end = new Date(start.getTime() + 1000 * 60 * 60);

    let reportAttributes = {};
    let randomlyCancelled = faker.datatype.boolean();
    let randomlyReportedOn = faker.datatype.boolean();

    if (randomlyCancelled) {
      reportAttributes = {
        enabled: false,
        cancellationReason: faker.helpers.arrayElement(cancellationReasons),
      };
    } else if (randomlyReportedOn) {
      const carExpenses = randomCurrency();

      reportAttributes = {
        carExpenses: carExpenses,
        distance: carExpenses / 25,
        foodExpenses: randomCurrency(),
      };
    }

    const ride = server.create(
      'ride',
      Object.assign(
        {
          institution: faker.helpers.arrayElement(institutions),
          driver: faker.helpers.arrayElement(people),
          carOwner: faker.helpers.arrayElement(people),

          start,
          end,
        },
        reportAttributes
      )
    );

    if (reportAttributes.carExpenses && faker.datatype.boolean()) {
      server.create('reimbursement', {
        person: ride.carOwner,
        amount: reportAttributes.carExpenses,
        donation: faker.datatype.boolean(),
      });
    }

    if (reportAttributes.foodExpenses && faker.datatype.boolean()) {
      server.create('reimbursement', {
        person: ride.driver,
        amount: reportAttributes.foodExpenses,
        donation: faker.datatype.boolean(),
      });
    }
  }
}

function randomCurrency() {
  const currency = faker.number.int({ min: 0, max: 4000 });

  return currency;
}
