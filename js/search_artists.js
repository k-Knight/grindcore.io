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

window.onload = function() {
    var searchItem = getURLParameter("artistName");
    if (searchItem != null && searchItem != "") {
        var searching = true;
        displayLoading("Please wait. Searching...", "#artists-container");

        try {
            $.getJSON(base_url + "?method=artist.search&api_key=" + api_key + "&limit=250&format=json&artist=" + searchItem, ( data ) => {
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
                }
                var finished = 0;
                var found = 0;
                $.each( validArtists, function( key, val ) {
                    $.getJSON(base_url + "?method=artist.getTopTags&api_key=" + api_key + "&format=json&mbid=" + val.mbid, ( tagData ) => {
                        grindcoreTags = tagData.toptags.tag.filter((tag) => {
                            return tag.name.toUpperCase() == "grindcore".toUpperCase() ||
                                tag.name.toUpperCase() == "deathgrind".toUpperCase() ||
                                tag.name.toUpperCase() == "goregrind".toUpperCase() ||
                                tag.name.toUpperCase() == "noisegrind".toUpperCase();
                        });
                        if (grindcoreTags.length > 0) {
                            $.getJSON(base_url + "?method=artist.getinfo&api_key=" + api_key + "&format=json&mbid=" + val.mbid, ( artistData ) => {
                                var element = $("<div>").addClass("artist-element").append([
                                    $("<section>").append(
                                        $("<h3>").text(artistData.artist.name),
                                        $("<div>").addClass("artit-info").append([
                                                $("<div>").addClass("info-element-faded").text("Last.fm listeners: "),
                                                $("<div>").text(artistData.artist.stats.listeners)
                                            ]),
                                        $("<div>").append($("<p>").append(artistData.artist.bio.summary))
                                    )
                                ]);

                                if (searching == true) {
                                    searching = false;
                                    $("#artists-container").empty();
                                }
                                $("#artists-container").append(element);
                            });
                            found++;
                        }
                        finished++;
                        if (found == 0 && finished == validArtists.length) {
                            displayNothingFound();
                        }
                    });
                });
            });
        } catch (err) {
            console.log(err);
        }
    }
    else {
        displayFaded("Search grindcore artists by name.", "#artists-container");
    }
}