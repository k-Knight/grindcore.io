var api_key = "b67824da4cc7b16eb40d000f7c26a2c7";
var base_url = "https://ws.audioscrobbler.com/2.0/";
var notificationsEnabled = false

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