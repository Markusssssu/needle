export const tryHandle = (promise) =>
  promise.then((data) => [null, data]).catch((err) => [err, null]);
