export default function(server) {
  const driver = server.create('person', {name: 'Driver'});
  const carOwner = server.create('person', {name: 'Car Owner'});

  for (let i = 0; i < 5; i++) {
    server.create('ride', { institution: server.create('institution'), driver, carOwner });
  }
}
