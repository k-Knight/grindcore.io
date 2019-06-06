var api_key = "b67824da4cc7b16eb40d000f7c26a2c7";
var base_url = "https://ws.audioscrobbler.com/2.0/";
var notificationsEnabled = false
var isOffline = false;

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

Notification.requestPermission(notificationCallback);

function notificationCallback(state) {
    if (state == "granted") {
        notificationsEnabled = true;
        console.log("Notifications were enabled");
    }
}

$(document).ready(() => {
    document.body.onoffline = () => { isOffline = true; showOfflineMessage(); };
    document.body.ononline = () => { isOffline = false; };
});

function showOfflineMessage() {
    try {
        new Notification(
            "Offline mode",
            {
                badge: "img/offline.png",
                icon: "img/offline.png",
                tag: "offline",
                body: "You are currently in the Offline mode. Searching is disabled."
            }
        );
    } catch (err) {
        console.log('Notification API error: ' + err);
    }
}