export default function(server) {
  const driver = server.create('person', {name: 'Driver'});
  const carOwner = server.create('person', {name: 'Car Owner'});

  const institutions = [
    'Brandon',
    'Headingley',
    'Milner Ridge',
    'Rockwood',
    'Stony Mountain'
  ];

  for (let i = 0; i < 5; i++) {
    const institution = server.create('institution', {
      name: institutions[i]
    });

    server.create('ride', { institution, driver, carOwner });
  }
}
