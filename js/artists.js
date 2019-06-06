window.onload = function () {
    savedData = window.localStorage.getItem("top-artists");
    if (savedData == null || savedData == "undefined") {
        displayLoading("Please wait. Loading...", "#loading-container");
        getArtists();
    }
    else {
        $("#artists-container").append(savedData);
    }
}

function getArtists() {
    $.getJSON({
        url: base_url + "?method=tag.gettopartists&tag=grindcore&api_key=" + api_key + "&limit=20&format=json",
        success: loadArtistsInfo,
        complete: (xhr, textStatus) => {
            if (xhr.status == 0 || textStatus == "error") {
                return;
            }
            if (xhr.status != 200)
                getArtists();
            else if (textStatus == "parsererror")
                getArtists();
        }
    });
}

function loadArtistsInfo(data) {
    try {
        $.each( data.topartists.artist, ( key, val ) => {
            getArtistInfo(val.mbid);
        });
    } catch (err) {
        console.log(err);
    }
}

function getArtistInfo(mbid) {
    $.getJSON({
        url: base_url + "?method=artist.getinfo&api_key=" + api_key + "&format=json&mbid=" + mbid,
        success: displayArtist,
        complete: (xhr, textStatus) => {
            if (xhr.status == 0 || textStatus == "error") {
                return;
            }
            if (xhr.status != 200)
                getArtistInfo(mbid);
            else if (textStatus == "parsererror")
                getArtistInfo(mbid);
        }
    });
}

function displayArtist(data) {
    try {
        var element = $("<div>").addClass("artist-element").append([
            $("<section>").append(
                $("<h3>").text(data.artist.name),
                $("<div>").addClass("artit-info").append([
                        $("<div>").addClass("info-element-faded").text("Last.fm listeners: "),
                        $("<div>").text(data.artist.stats.listeners)
                    ]),
                $("<div>").append($("<p>").append(data.artist.bio.summary))
            )
        ]);

        $("#loading-container").empty();
        $("#artists-container").append(element);
        window.localStorage.setItem("top-artists", $("#artists-container").html());
    } catch (err) {
        console.log(err);
    }
}