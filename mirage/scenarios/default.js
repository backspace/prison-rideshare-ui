export default function(server) {
  for (let i = 0; i < 5; i++) {
    server.create('ride', { institution: server.create('institution') });
  }
}
