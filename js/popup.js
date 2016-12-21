/*jshint esversion: 6 */

// array of json to be processed
var jsonArray;
var robotNames = [];

// message and progress div
var messageElement;
var progressElement;

// current robot to be ordered
var currentElement;
var currentRobot = 0;

document.addEventListener('DOMContentLoaded', function () {

    messageElement = document.getElementById("message");
    currentElement = document.getElementById("currentRobot");
    progressElement = document.getElementById("progress");

    currentRobot = localStorage.getItem ("currentRobot") || 0;

    let names = localStorage.getItem ("robotNames");

    if (names !== null)
        robotNames = names.split(",");
    else
        robotNames = [];

    jsonArray = JSON.parse(localStorage.getItem ("jsonArray")) || [];

    messageElement.innerHTML = localStorage.getItem ("message") || "";
    currentElement.innerHTML = localStorage.getItem ("currentRobotMessage") || "";
    progressElement.innerHTML = localStorage.getItem ("progress");

    console.log ("Loaded.\njsonArray has "+jsonArray.length+ " elements");

    document.getElementById("submitButton").addEventListener("click", function () {

        // getting the link
        const fileUrl = document.getElementById("jsonUrl").value;
        if (fileUrl === "") {
            var error = document.getElementById("error");
            error.innerHTML = "Please enter url";
        }

        progressElement.innerHTML = "";

        robotNames = [];
        localStorage.setItem ("robotNames", robotNames.toString());

        downloadZipfiles (fileUrl);
        document.getElementById("fill").style.visibility = "true";

        for (let i = 0 ; i < robotNames.length; i++) {
            let nameDiv = document.createElement("DIV");
            nameDiv.id = "robot"+i;
            nameDiv.innerHTML = robotNames[i];
            nameDiv.className = "pending";
            document.getElementById("progress").appendChild(nameDiv);
        }

        currentRobot = 0;

        messageElement.innerHTML = (jsonArray.length - currentRobot) +" robots remaining";
        currentElement.innerHTML = "Upload "+ robotNames[currentRobot] + " then click 'Fill Form!' on the form page";

        updateLocalStorage();
    });


    // fill form when clicked by sending a message to the content script
    document.getElementById("fill").addEventListener ("click", function (){

        if (jsonArray.length === 0) {
            messageElement.innerHTML = "No robot data found";
        }

        // sending message with json array
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {data: jsonArray[currentRobot]}, function(response) {

                document.getElementById ("robot"+currentRobot).className = "done";
                currentRobot++;

                if (currentRobot >= jsonArray.length) {
                    localStorage.clear();
                    messageElement.innerHTML = "Done! Enter another link for next batch of robots";
                    messageElement.className += " done";
                    currentElement.innerHTML = "";
                    return;
                }

                messageElement.innerHTML = (jsonArray.length - currentRobot) +" robots remaining";
                currentElement.innerHTML = "Upload "+ robotNames[currentRobot] + " then click 'Fill Form!' on the form page";
                updateLocalStorage();

            });
        });
    });


    document.getElementById("prev").addEventListener ("click", function (){

        if (currentRobot > 0) {
            currentRobot--;
            localStorage.setItem ("currentRobot", currentRobot);
            document.getElementById ("robot"+currentRobot).className = "pending";
        }
    });
});

function updateLocalStorage () {
    localStorage.setItem ("message", messageElement.innerHTML);
    localStorage.setItem ("currentRobotMessage", currentElement.innerHTML);
    localStorage.setItem ("progress", progressElement.innerHTML);
    localStorage.setItem ("currentRobot", currentRobot);
    localStorage.setItem ("jsonArray", JSON.stringify(jsonArray));
    localStorage.setItem ("robotNames", robotNames.toString());
}

var downloadZipfiles = function (fileUrl) {

    // getting json from link
    let xhr = new XMLHttpRequest();
    xhr.open("GET", fileUrl, false);
    xhr.send();
    jsonArray = JSON.parse(xhr.responseText);

    // downloading each zipfile
    for (let count = 0; count < jsonArray.length; count++) {
        zipfileUrl = jsonArray[count].zipfile;
        zipfile = getZipFile (zipfileUrl);
        robotNames.push(zipfile);
        chrome.downloads.download({
            url: zipfileUrl,
            filename: "gadgetronZipFiles/"+zipfile,
            conflictAction: "overwrite"
        }, function () {
            console.log ("Done"+count)
        });
    }

};


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
