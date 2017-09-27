const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request');
const morjs = require('morjs');

morjs.modes.foo = {
  charSpacer: '',
  letterSpacer: ' ',
  longString: '-',
  shortString: '.',
  wordSpacer: '/'
};

morjs.defaults.mode = 'foo';

admin.initializeApp(functions.config().firebase);

exports.logUserCreation = functions.auth.user().onCreate(({data}) => {
  admin.database().ref('users').child(data.uid).set({
    name: data.displayName,
    photoURL: data.photoURL || false,
  });
});

const sendMorsePromise = text => new Promise((res, rej) => {
  request.post(
    'https://api.particle.io/v1/devices/240036000d51353432383931/morse?access_token=bad62e1dda14f42b568c7fd67a89129e4f4f1f12',
    {form: {arg: morjs.encode(text)}},
    () => res()
  );
});

const getActiveMorse = () => {
  return admin.database().ref('activeMorse').once('value');
};

const tryPushingNextMorse = () => {
  const rootRef = admin.database().ref();
  const activeMorseRef = rootRef.child('activeMorse');
  activeMorseRef.once('value')
  .then(snap => {
    if (!snap.exists()){
      return rootRef
      .child('morseQueue')
      .orderByChild('timestamp')
      .limitToFirst(1)
      .once('value')
      .then(snap => {
        if (!snap.val()) return;
        const key = Object.keys(snap.val())[0];
        const {text} = snap.val()[key];
        return activeMorseRef.transaction(pre => {
          if (pre !== null) return;
          return key;
        }).then(({committed}) => {
          if (committed)
            return sendMorsePromise(text);
        });
      });
    }
  });
};

exports.morseAdded = functions.database
  .ref('morseQueue/{uid}')
  .onCreate(() => tryPushingNextMorse());

exports.morseDone = functions.https.onRequest((req, res) => {
  res.status(200).send();
  const rootRef = admin.database().ref();
  getActiveMorse()
  .then(snap => {
    if (snap.exists()){
      return Promise.all([
        rootRef.child('morseQueue').child(snap.val()).remove(),
        rootRef.child('activeMorse').remove(),
      ]);
    }
  })
  .then(() => tryPushingNextMorse());
});

const tryResendActiveMorse = () => {
  return admin.database().ref('activeMorse').remove()
    .then(() => tryPushingNextMorse());
};

exports.sparkStatus = functions.https.onRequest((req, res) => {
  res.status(200).send();
  const {data} = req.body;
  const timestamp = (new Date(req.body.published_at)).valueOf();
  return admin.database().ref('status').transaction(pre => {
    if (pre == null || pre.timestamp == null || pre.timestamp < timestamp){
      return {data, timestamp};
    }
  }).then(({committed}) => {
    if (committed && data === 'online'){
      return tryResendActiveMorse();
    }
  });
});
