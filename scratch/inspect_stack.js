const { StackServerApp } = require('@stackframe/stack');
const stackServerApp = new StackServerApp({
  projectId: '7a34e062-8e7c-4874-9b62-1a4863c3d2e3',
  publishableClientKey: 'pk_abc',
  secretServerKey: 'sk_abc',
});
function getAllMethods(obj) {
  let props = new Set();
  let curr = obj;
  do {
    Object.getOwnPropertyNames(curr).map(item => props.add(item));
  } while ((curr = Object.getPrototypeOf(curr)));
  return [...props].sort();
}
const methods = getAllMethods(stackServerApp);
console.log(methods.join('\n'));
