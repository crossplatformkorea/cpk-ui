/**
 * React DOM shim for React 19 + react-native-web compatibility.
 *
 * React 19 removed findDOMNode, but react-native-web@0.21.x still uses it.
 * This shim re-exports everything from react-dom and adds a findDOMNode polyfill.
 */

const ReactDOM = require('react-dom');

if (typeof ReactDOM.findDOMNode !== 'function') {
  ReactDOM.findDOMNode = function findDOMNode(componentOrElement) {
    if (componentOrElement == null) return null;
    if (componentOrElement.nodeType === 1) return componentOrElement;
    // Try fiber internals
    const fiber =
      componentOrElement._reactInternals ||
      componentOrElement._reactInternalInstance;
    if (fiber) {
      let node = fiber;
      while (node) {
        if (node.stateNode && node.stateNode.nodeType === 1) {
          return node.stateNode;
        }
        node = node.child;
      }
    }
    return null;
  };
}

module.exports = ReactDOM;
