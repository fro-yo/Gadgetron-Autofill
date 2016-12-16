// array of json to be processed
var jsonArray;

// message div
var message;

document.addEventListener('DOMContentLoaded', function () {

    message = document.getElementById("message");
    document.getElementById("submitButton").addEventListener("click", function () {

        // getting the link
        const fileUrl = document.getElementById("jsonUrl").value;
        if (fileUrl === "") {
            var error = document.getElementById("error");
            error.innerHTML = "Please enter url"
        }

        downloadZipfiles (fileUrl);
        message.innerHTML = "Downloaded "+jsonArray.length+" zipfiles";
        document.getElementById("fill").style.visibility = "true";

    });


    // fill form when clicked by sending a message to the content script
    document.getElementById("fill").addEventListener ("click", function (){

        if (jsonArray.length === 0) {
            message.innerHTML = "No robot data found"
        }

        console.log ("clicked ");

        // sending message with json array
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {data: jsonArray[0]}, function(response) {
                if (response != undefined)
                    console.log(response.farewell);
            });
        });
    });
});

var downloadZipfiles = function (fileUrl) {

    // getting json from link
    let xhr = new XMLHttpRequest();
    xhr.open("GET", fileUrl, false);
    xhr.send();
    jsonArray = JSON.parse(xhr.responseText);

    // downloading each zipfile
    /*
    for (let count = 0; count < jsonArray.length; count++) {
        zipfileUrl = jsonArray[count].zipfile;
        zipfile = getZipFile (zipfileUrl);
        chrome.downloads.download({
            url: zipfileUrl,
            filename: "gadgetronZipFiles/"+zipfile,
            conflictAction: "overwrite",
        }, function () {
            console.log ("Done"+count)
        });
    }
    */

}


/**
* returns the name of the file from the url
*/
function getZipFile (zipfileUrl) {
    let index = zipfileUrl.length - 1;
    while (zipfileUrl.charAt(index) !== '/') {
        index--;
    }
    return zipfileUrl.substring(index+1, zipfileUrl.length);
}
