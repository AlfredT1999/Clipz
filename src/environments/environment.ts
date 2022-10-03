// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


/* environment files are where we can store 
  configuration settings for external apis */
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBR0UcRbd6d4ooUCo7ZxrdXmkJGeMmB69w",
    authDomain: "clips-8a4bd.firebaseapp.com",
    projectId: "clips-8a4bd",
    storageBucket: "clips-8a4bd.appspot.com",
    appId: "1:770654285490:web:cab9a03931a1911e1763ab"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
