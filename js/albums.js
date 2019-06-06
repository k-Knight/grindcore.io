window.onload = function () {
    savedData = window.localStorage.getItem("top-albums");
    if (savedData == null || savedData == "undefined") {
        displayLoading("Please wait. Loading...", "#loading-container");
        $.getJSON(base_url + "?method=tag.gettopalbums&tag=grindcore&api_key=" + api_key + "&limit=21&format=json", ( data ) => {
            try {
                $.each( data.albums.album, ( key, val ) => {
                    var element = $("<section>").addClass("album-element").append([
                        $("<h3>")
                            .addClass("info-element-head")
                            .text(val.name),
                        $("<div>")
                            .addClass("album-info")
                            .append([
                                $("<img>")
                                    .attr({
                                        alt: "cover art",
                                        src: val.image[3]["#text"]
                                    })
                                    .addClass("info-element-img"),
                                $("<table>").append([
                                    $("<tr>").append([
                                            $("<td>").addClass("info-element-faded").text("Name"),
                                            $("<td>").append($("<div>").text(val.name))
                                        ]),
                                    $("<tr>").append([
                                            $("<td>").addClass("info-element-faded").text("By"),
                                            $("<td>").append($("<div>").text(val.artist.name))
                                        ])
                                ])
                            ])
                    ]);

                    $("#loading-container").empty();
                    $("#top-albums-container").append(element);
                    window.localStorage.setItem("top-albums", $("#top-albums-container").html());
                });
            } catch (err) {
                console.log(err);
            }
        });
    }
    else {
        $("#top-albums-container").append(savedData);
    }
}