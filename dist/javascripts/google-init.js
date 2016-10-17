const googleClientId = '797238251386-v83tn00ep3o16ue347h51nae5087n5dh.apps.googleusercontent.com';
const realtimeUtils = new utils.RealtimeUtils({ clientId: googleClientId });

(function() {
  realtimeUtils.authorize(function(response) {
    if (response.error) {
      var button = getElementById('google-auth');
      button.classList.add('visible');
      button.addEventListener('click', function() {
        realtimeUtils.authorize(function(response) {
          start();
        }, true);
      });
    } else {
      console.log('Authorization with Google was successful.');
      start();
    }
  });
})();

const start = function() {
  const id = realtimeUtils.getParam('id');
  if (id) {
    console.log('ID provided in URL so realtime document already exists.');
    realtimeUtils.load(id.replace('/', ''), onFileLoaded, onFileInitialize);
  } else {
    console.log('ID not provided in URL so creating a new realtime document.');
    realtimeUtils.createRealtimeFile('Realtime Notebook Test File', function(response) {
      window.history.pushState(null, null, '?id=' + response.id);
      realtimeUtils.load(response.id, onFileLoaded, onFileInitialize);
    });
  }
};

const onFileLoaded = function(doc) {
  const collaborativeString = doc.getModel().getRoot().get('text');
  gapi.drive.realtime.databinding.bindString(collaborativeString, codeMirrorGoogle.getTextArea());
};

const onFileInitialize = function(model) {
  const string = model.createString();
  string.setText('onFileInitialize called.');
  model.getRoot().set('text', string);
}
