var api_key = "b67824da4cc7b16eb40d000f7c26a2c7";
var base_url = "https://ws.audioscrobbler.com/2.0/";
var pushEnabled = false

function displayLoading(msg, container) {
    $(container).empty();
    $("<div>").addClass("loading-div").append([
        $("<img>").attr({alt: "loadig animation", src: "img/loading.gif"}),
        $("<div>").text(msg)
    ]).appendTo($(container));
}

function displayFaded(msg, container) {
    $(container).empty();
    $(container).append(
        $("<div>").addClass("failed-div faded").text(msg)
    );
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register ('service-worker.js');



}

if ('showNotification' in ServiceWorkerRegistration.prototype) {
    if (Notification.permission === 'denied') {
        if ('PushManager' in window) {
            navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
                serviceWorkerRegistration.pushManager.getSubscription().then((subscription) => {
                    subscribeToPush();
                }).catch(function(err) {
                    console.warn('Error during getSubscription()', err);
                });
            });
            console.log("Push notifications are available");
        }
        else {
            console.log("Push notifications are NOT available");
        }
    }
    else {
        console.log("Push notifications are NOT available");
    }
}
else {
    console.log("Push notifications are NOT available");
}

function subscribeToPush() {
  navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
    serviceWorkerRegistration.pushManager.subscribe().then((subscription) => {
        console.log("Push notifications are ENABLED");
        pushEnabled = true;
    }).catch((e) => {
        if (Notification.permission === 'denied') {
          console.warn('Permission for Notifications was denied');
        } else {
          console.error('Unable to subscribe to push.', e);
        }
    });
  });
}