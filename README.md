Gulp Browserify External Vendor Bundles
=======================================

# fork notes
* Replaced the use of ```gulp-browserify``` with vanilla ```browserify``` + ```vinyl-source-stream``` (since its the recommended way these days)
* Used ```bower-resolve``` to resolve bower package ids to its full path, which is needed for ```browserify.require()```
* Still lacks a clean way to get all package ids from ```bower.json```

# install

`git clone https://github.com/sogko/externalise-bower`  
`cd externalise-bower`

`npm install && bower install`  

# run
`gulp`

Hope this helps

