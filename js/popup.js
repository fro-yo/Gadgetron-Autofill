document.addEventListener('DOMContentLoaded', function () {

    document.getElementById("submitButton").addEventListener("click", function () {

        // getting the link
        const fileUrl = document.getElementById("jsonUrl").value;

        if (fileUrl === "") {
            var error = document.getElementById("error");
            error.innerHTML = "Please enter url"
        }

        // getting json from link
        let xhr = new XMLHttpRequest();
        xhr.open("GET", fileUrl, false);
        xhr.send();
        let jsonArray = JSON.parse(xhr.responseText);

        // downloading each zipfile
        for (let count = 0; count < jsonArray.length; count++) {
            zipfileUrl = jsonArray[count].zipfile;
            chrome.downloads.download({
                url: zipfileUrl,
                filename: "gadgetronOrders/gadgetronOrderData_"+count+".json",
                conflictAction: "overwrite",
            }, function () {
                console.log ("Done"+count)
            });
        }
        
    });
});
