---
layout: post
title: "Breakout Development with Aider"
date: 2025-04-27 12:00:00 -0700
categories: [coding, ai]
tags: [aider, html5, javascript, games]
---

Development continued on the Breakout game. The current implementation includes:

- CRT-style visual effects with scanlines and flicker
- Paddle controls for mouse, touch and keyboard
- Multiple levels with increasing difficulty
- High score persistence using localStorage
- Story elements that appear during gameplay

The game is embedded below:

<div class="responsive-game-container">
  <iframe src="/assets/games/existentialbreakoutftaider/breakout.html" 
          style="position:absolute; top:0; left:0; width:100%; height:100%; border:none; overflow:hidden;"
          tabindex="0">
  </iframe>
</div>

<script>
document.querySelector('.responsive-game-container iframe').addEventListener('keydown', function(e) {
    if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
});
</script>

<style>
.responsive-game-container {
  position: relative;
  width: 100%;
  padding-bottom: 75%;
  height: 0;
  overflow: hidden;
}
</style>

The game features five levels with increasing brick counts and ball speed. Story messages appear every three points scored.
