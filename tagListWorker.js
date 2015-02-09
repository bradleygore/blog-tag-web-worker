/**
 * Created by bgore on 2/7/15.
 */
var xhr, allTags = [], callbacks = [];

self.onmessage = function(e){
    var msg = e.data;
    console.debug('taglistWorker.onmessage: ', msg);
    switch(msg.action) {
        case 'tagsParsed':
            processParsedTags(msg.content);
            break;
        case 'getUniqueTags':
            loadTags(msg.url, getUniqueTags);
            break;
        case 'getMatchingTags':
            loadTags(msg.url, function() {
                getMatchingTags(msg.match);
            });
    }
};

function loadTags(url, callback){

    if(callback && typeof  callback === 'function') {
        callbacks.push(callback);
    }

    if(xhr) {
        return;
    }

    if(typeof XMLHttpRequest !== 'undefined') {
        xhr = new XMLHttpRequest();
    } else {
        var versions = ["MSXML2.XmlHttp.5.0",
            "MSXML2.XmlHttp.4.0",
            "MSXML2.XmlHttp.3.0",
            "MSXML2.XmlHttp.2.0",
            "Microsoft.XmlHttp"];

        for (var i = 0, len = versions.length; i < len; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            } catch (e) {

            }
        }
    }

    xhr.onreadystatechange = handleReadyStateChange;

    function handleReadyStateChange() {
        if(xhr.readyState < 4) {
            return;
        }

        if(xhr.status !== 200) {
            return;
        }

        if(xhr.readyState === 4) {
            console.debug('loadTags xhr: ', xhr);
            self.postMessage({action: 'parseXML', content: xhr.responseText});
        }
    }

    xhr.open('GET', url, true);
    xhr.send();
}

function processParsedTags(tags) {

    //get uniques in the list
    tags.forEach(function (tag) {
        tag = tag.toLowerCase();
        if(allTags.indexOf(tag) === -1) {
            allTags.push(tag);
        }
    });

    //sort them
    allTags.sort();

    //fire all callbacks and then clear the xhr and truncate the callbacks
    callbacks.forEach(function fireCallbacks(cb) { cb(); });
    xhr = null;
    callbacks.length = 0;
}

function getUniqueTags() {
    self.postMessage({action: 'uniqueTags', content: allTags});
}

function getMatchingTags(match) {
    var filteredTags = allTags.filter(function findMatch(t) {
        return match.test(t.toLowerCase());
    });

    self.postMessage({action: 'matchingTags', content: filteredTags});
}