# blog-tag-web-worker
Use a Web Worker and your Blog's RSS feed to get all tags used and then work with them!

This was specifically created so that I could pull all the tags used, and how many times eachw as used, to display lists of most used tags, specific tag types, etc... in by blog.  However, I wanted to put this in a worker so that it's fully async.  This way, I can have a default list of tag items I display, but the list(s) get dynamically updated as soon as the worker is finished downloading and parsing the tags out of the RSS feed XML.

To use the web worker, just do `var tagListWorker = new Worker('tagListWorker.js');` and then you can use the standard methods for communicating with the worker!
