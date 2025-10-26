export function overrideRoute(server, method, path, handler, timing) {
  const verb = method.toLowerCase();
  const pretender = server.pretender;
  const interceptor = server.interceptor;

  if (!pretender || !interceptor) {
    throw new Error('overrideRoute requires access to the Mirage pretender and interceptor.');
  }

  const patternFullPath = interceptor._getFullPath(path);
  const samplePath = path.replace(/:[^/]+/g, 'placeholder');
  const sampleFullPath = interceptor._getFullPath(samplePath);

  let originalMatch;
  try {
    originalMatch = pretender._handlerFor(method.toUpperCase(), sampleFullPath, {
      params: {},
    });
  } catch (_error) {
    originalMatch = undefined;
  }

  server[verb](path, handler, timing);

  return (fallbackHandler, fallbackTiming) => {
    if (originalMatch && originalMatch.handler) {
      pretender[verb](
        patternFullPath,
        originalMatch.handler,
        originalMatch.handler.async,
      );
    } else if (fallbackHandler) {
      server[verb](path, fallbackHandler, fallbackTiming);
    }
  };
}
