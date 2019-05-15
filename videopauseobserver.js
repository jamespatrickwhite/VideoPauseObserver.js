/* 
 * VideoPauseObserver - Not a great name, but that's mostly what this does
 * Copyright 2019 James White
 * <github link here>
 * 0.1.0 - 2019/05/12
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/
 */

/* Pauses video if user switches to another tab, minimizes screen, or if user scrolls video out of viewport
 * Honors user pause actions, and end of video conditions
 */
class VideoPauseObserver {
  constructor(video) {
    this._video = video;
    this._programmaticpause = null;

    video.addEventListener('playing',(evt) => { this.playingListener(evt); },false);
    video.addEventListener('pause',(evt) => { this.pauseListener(evt); },false);
    video.addEventListener('ended',(evt) => { this.endedListener(evt); },false);
    
    // Watch for page visibility
    document.addEventListener('visibilitychange',(evt) => { this.pageVisChangeListener(evt); },false);
    
    // Watch for video element visibility
    this._intersect = new IntersectionObserver((entries) => { this.intersectionListener(entries); });
    this._intersect.observe(this._video);
  }
  
  pauseVideo() {
    if (this._video.paused)
      return;  // already paused, possibly by user
    this._programmaticpause = true;
    this._video.pause();
  }
  
  unpauseVideo() {
    if (!this._video.paused)
      return;
    if (this._video.ended) // do nothing
      return;
    if (!this.isVideoPartiallyVisible()) // do nothing
      return;
    if (this._programmaticpause === true)
      this._video.play();
  }
  
  pauseListener(evt) {
    if (this._video.currentTime === this._video.duration)
      return;  // ignore pauses at end of video
    if (this._video.currentTime === 0)
      return;  // ignore autoplay stop settings
    if (this._programmaticpause !== true)
      this._programmaticpause = false;
  }
  
  playingListener(evt) {
    this._programmaticpause = null;
  }
  
  endedListener(evt) {
    this._programmaticpause = null;  // most players fire pause right before ended
  }
  
  pageVisChangeListener(evt) {
    if (document.hidden)
      this.pauseVideo();
    else
      this.unpauseVideo();
  }
  
  intersectionListener(entries) {
    for(const entry of entries) {
      if (entry.isIntersecting)  // is partially in view
        this.unpauseVideo();
      else
        this.pauseVideo();
    }
  }
  
  isVideoPartiallyVisible() {
    const rect = this._video.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;
    return elemTop < window.innerHeight && elemBottom >= 0;
  }
}

vp = new VideoPauseObserver(document.querySelector('video'));
