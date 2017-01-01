import { faker } from 'ember-cli-mirage';

export default function(server) {
  const people = server.createList('person', 8);

  const institutionNames = [
    'Brandon',
    'Headingley',
    'Milner Ridge',
    'Rockwood',
    'Stony Mountain'
  ];

  const institutions = institutionNames.map(name => server.create('institution', {name}));

  for (let i = 0; i < 10; i++) {
    const start = faker.date.recent(i*2);
    const end = new Date(start.getTime() + 1000*60*60);

    let reportAttributes = {};

    if (faker.random.boolean()) {
      reportAttributes = {
        enabled: false
      };
    } else if (faker.random.boolean()) {
      const carExpenses = randomCurrency();

      reportAttributes = {
        carExpenses: carExpenses,
        distance: carExpenses/0.25,
        foodExpenses: randomCurrency()
      };
    }

    const ride = server.create('ride', Object.assign({
      institution: faker.random.arrayElement(institutions),
      driver: faker.random.arrayElement(people),
      carOwner: faker.random.arrayElement(people),

      start,
      end
    }, reportAttributes));

    if (reportAttributes.carExpenses && faker.random.boolean()) {
      server.create('reimbursement', {
        person: ride.carOwner,
        amount: reportAttributes.carExpenses,
        donation: faker.random.boolean()
      });
    }

    if (reportAttributes.foodExpenses && faker.random.boolean()) {
      server.create('reimbursement', {
        person: ride.driver,
        amount: reportAttributes.foodExpenses,
        donation: faker.random.boolean()
      });
    }
  }
}

function randomCurrency() {
  const currency = faker.random.number({min: 0, max: 4000});

  return Math.round(currency)/100;
}
