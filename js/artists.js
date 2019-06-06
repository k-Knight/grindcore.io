window.onload = function () {
    savedData = window.localStorage.getItem("top-artists");
    if (savedData == null || savedData == "undefined") {
        displayLoading("Please wait. Loading...", "#loading-container");
        $.getJSON(base_url + "?method=tag.gettopartists&tag=grindcore&api_key=" + api_key + "&limit=20&format=json", ( data ) => {
            try {
                $.each( data.topartists.artist, ( key, val ) => {
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

                        $("#loading-container").empty();
                        $("#artists-container").append(element);
                        window.localStorage.setItem("top-artists", $("#artists-container").html());
                    });
                });
            } catch (err) {
                console.log(err);
            }
        });
    }
    else {
        $("#artists-container").append(savedData);
    }


}