var images;

var url =[];
var source = [];
window.onload = function(){
    var json;
    var o;
    var config = {
        apiKey: "AIzaSyBHcK28fVngVO5KE3ndN99Mj8JToj1MgjU",
        authDomain: "htn2017-3e50f.firebaseapp.com",
        databaseURL: "https://htn2017-3e50f.firebaseio.com",
        projectId: "htn2017-3e50f",
        storageBucket: "htn2017-3e50f.appspot.com",
        messagingSenderId: "764653200370"
    };
    firebase.initializeApp(config);
    firebase.database().ref('/sessions/sessions').once('value', function(snap){
        json = snap.val();
        console.log(JSON.stringify(snap.val()));
        //console.log(snap.val().result.heatmap);
        console.log(snap.val());
        //url = snap.val().result.heatmap;
        //console.log(url);
        //changeImage(url);
        finish();
    })
    function finish(){
        for (var key in json) {
            if (json.hasOwnProperty(key)) {
                console.log(key + ": " + json[key]);
                url.push(json[key].heatmap);
                source.push(json[key].siteurl);
            }
        }
        document.getElementById('links').appendChild(makeUL(url));
    }
}



function makeUL(array) {
    // Create the list element:
    $('.button-group').click( function(event, target){
        console.log(target);
        event.preventDefault();
        console.log("hello");
        console.log(url);
        console.log(link);
        document.getElementById("imageView").src=link;
    });
    var list = document.createElement('ul');

    for(var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');
        var item2 = document.createElement('a');
        var item3 = document.createElement('div');
        item2.className = "select";
        item3.className = "circle";
        var link = array[i];
        console.log(link);
        item2.setAttribute("id", i)
        item2.setAttribute("class", "button-group");

        // Set its contents:
        item2.appendChild(document.createTextNode(source[i]));
        item2.appendChild(item3);
        item.appendChild(item2);
        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    console.log(list);
    return list;
}

$(document).on('click', '.button-group', function(event){
    event.preventDefault();

    document.getElementById("imageView").src=url[$(event.target).attr('id')];
});
