export const sleep = (delaySeconds: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ok: true });
    }, delaySeconds * 1000)
  });
}