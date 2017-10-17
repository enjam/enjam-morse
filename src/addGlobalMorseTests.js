import * as firebase from 'firebase';

// only for test - will only be allowed by admin
var addedTestsToWindow = false;
if (!addedTestsToWindow){

  window.firebase = firebase;

  window.addSomeMorseCodes = (num) => {
    const fellows = [
      'tJutbpW71cbSlihMpGNJu2CSVYC2',
      'nQaAmuhNSohqWGXfVATdERJ0kcw1',
      'nzXtlyHOwSg6MRNHTBgIvk2dSr83',
      'VVd5DCRU8nTGchXTCFquYn23Vmo1'
    ];
    const texts = ['Egern', 'Ræv', 'Pindsvin', 'Æblegrød'];
    for (let i = 0; i < num && i < fellows.length; i++){
      const fellow = fellows[i];
      window.setTimeout(() => {
        firebase.database().ref('morseQueue').child(fellow).set({
          text: texts[i % texts.length],
          timestamp: firebase.database.ServerValue.TIMESTAMP,
        });
      }, i * 500);
    }
  };

  addedTestsToWindow = true;
}
