var searching = false;
var finished = 0;
var found = 0;
var potential = 0;
var searchComplete = true;

function getURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

function searchArtist() {
    if (isOffline || !navigator.onLine) {
        showOfflineMessage();
        return;
    }
    if ($("#artist-name-term").val().length > 0) {
        getArtistsByName($("#artist-name-term").val());
    }
}

window.onload = function() {
    var searchItem = getURLParameter("artistName");
    if (searchItem != null && searchItem.length > 0) {
        getArtistsByName(searchItem);
    }
    else {
        displayFaded("Search grindcore artists by name.", "#artists-container");
    }
}

function getArtistsByName(name) {
    displayLoading("Please wait. Searching...", "#artists-container");
    searching = true;
    $("#artist-search-btn").attr('disabled','disabled');
    searchComplete = false;
    $.getJSON({
        url: base_url + "?method=artist.search&api_key=" + api_key + "&limit=250&format=json&artist=" + name,
        success: searchValidArtists,
        complete: (xhr, textStatus) => {
            if (xhr.status == 0 || textStatus == "error") {
                return;
            }
            if (xhr.status != 200)
                getArtistsByName(name);
            else if (textStatus == "parsererror")
                getArtistsByName(name);
        }
    });
}

function searchValidArtists(data) {
    try {
        var validArtists = data.results.artistmatches.artist.filter((artist) => { return artist.mbid != null && artist.mbid != ""; });
        for (var i = 0; i < validArtists.length; i++) {
            for (var j = i + 1; j < validArtists.length; j++) {
                if (validArtists[i].mbid == validArtists[j].mbid) {
                    validArtists.splice(j, 1);
                    j--;
                }
            }
        }
        if (validArtists.length == 0) {
            displayFaded("Sorry. No artists were found.", "#artists-container");
            notifyNothingFound();
        }
        $.each( validArtists, function( key, val ) {
            potential = validArtists.length;
            getArtistTags(val.mbid);
        });
    } catch (err) {
        console.log(err);
    }
}

function getArtistTags(mbid) {
    $.getJSON({
        url: base_url + "?method=artist.getTopTags&api_key=" + api_key + "&format=json&mbid=" + mbid,
        success: (data) => { confirmGrindcoreArtist(data, mbid); },
        complete: (xhr, textStatus) => {
            if (xhr.status == 0 || textStatus == "error") {
                return;
            }
            if (xhr.status != 200)
                getArtistTags(mbid);
            else if (textStatus == "parsererror")
                getArtistTags(mbid);
        }
    });
}

function confirmGrindcoreArtist(data, mbid) {
    try {
        grindcoreTags = data.toptags.tag.filter((tag) => {
            return tag.name.toUpperCase() == "grindcore".toUpperCase() ||
                tag.name.toUpperCase() == "deathgrind".toUpperCase() ||
                tag.name.toUpperCase() == "goregrind".toUpperCase() ||
                tag.name.toUpperCase() == "noisegrind".toUpperCase();
        });
        if (grindcoreTags.length > 0) {
            getArtistInfo(mbid);
        }
        else {
            finished++;
            if (found == 0 && finished >= potential) {
                displayFaded("Sorry. No artists were found.", "#artists-container");
                notifyNothingFound();
            }
            if (finished >= potential * 0.9 && found > 0 && ! searchComplete) {
                searchComplete = true;
                notifySearchComplete();
            }
        }
    } catch (err) {
        console.log(err);
    }
}

function getArtistInfo(mbid) {
    $.getJSON({
        url: base_url + "?method=artist.getinfo&api_key=" + api_key + "&format=json&mbid=" + mbid,
        success: displayArtistInfo,
        complete: () => {
            finished++;
            if (found == 0 && finished >= potential) {
                displayFaded("Sorry. No artists were found.", "#artists-container");
                notifyNothingFound();
            }
            if (finished >= potential * 0.9 && found > 0 && !searchComplete) {
                searchComplete = true;
                notifySearchComplete();
            }
        }
    });
}

function displayArtistInfo(data) {
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

        if (searching == true) {
            searching = false;
            $("#artists-container").empty();
            $("#artist-search-btn").removeAttr('disabled');
        }
        $("#artists-container").append(element);
        found++;
    } catch (err) {
        console.log(err);
    }
}

function notifySearchComplete() {
    showNotificationMessage("Search complete", "Your search is complete. Managed to find band(s).", "img/search_complete.png");
}

function notifyNothingFound() {
    showNotificationMessage("Nothing found", "No gridcore artists were found with that name.", "img/nothing_found.png");
}