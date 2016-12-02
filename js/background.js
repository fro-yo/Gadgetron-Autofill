console.log ("here");
// Update the declarative rules on install or upgrade.
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                // when the page contains 4pcb
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { urlContains: "4pcb" },
                })
            ],
            // show the page action
            actions: [new chrome.declarativeContent.ShowPageAction() ]
        }]);
    });
});
