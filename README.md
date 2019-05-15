# VideoPauseObserver.js
A light utility library to automagically pause/unpause your video content when it's tabbed away / minimized / or scrolled out of the viewport.

## Usage
Include the script in your page:
```
<script src="videopauseobserver.js"></script>
```
Then for each video, instantiate a new VideoPauseObserver object passing in a reference to the `video` element to observe.
ie:
```
let targetVideoElement = document.querySelector('#somevideo');
new VideoPauseObserver(targetVideoElement);
```
That's it.  Everything from there is automated.

## Compatibility
Should be compatible with:
* Edge 16+
* Firefox 55+  (Tested w/ v66)
* Chrome 58+   (Tested w/ v74)
* Safari 12.1+
* Safari/iOS 12.2+
* Opera 45+

---
License: MPL-2.0
