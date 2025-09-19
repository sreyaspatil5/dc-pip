// (window as any).global = window;

/***************************************************************************************************

* APPLICATION POLYFILLS

*/
 
// ✅ Fix for Node globals in browser

(window as any).global = window;

(window as any).process = { env: { DEBUG: undefined } };

(window as any).Buffer = [];

 