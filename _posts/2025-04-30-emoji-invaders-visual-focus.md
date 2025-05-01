---
layout: post
title: "Emoji Invaders - Visual Focus"
subtitle: "When performance meets attempted aesthetics"
categories: [coding, ai, games]
tags: [aider, html5, javascript, emoji, performance] 
author: BurntPineapple
---

# Space Invaders But Make It Emoji

This time I wanted more focus on the visual stylings - going for that sweet spot where performance meets playful aesthetics. 

I'm not a super visually creative person in the traditional sense (can't draw to save my life), but there's something magical about performant visual juice - it lets you do more with less and reach people who couldn't normally play your game.

## Development Highlights

Key stats:
- Development time: 1 hour
- Number of calls: 61
- Tokens: 322.8k sent, 38.5k received.
- Way too many of those tokens were burned trying to generate interesting CSS noise patterns. 

The AI excelled at:
- Smooth emoji animations that just work
- Particle effects for those sweet explosions
- Responsive design tweaks
- Performance optimizations to keep it zippy

While I focused on:
- Visual cohesion despite my non-artist tendencies
- Game feel polishing (even if v3 still has some angy vibes)
- Accessibility through lightweight design
- Embracing constraints - emojis and opengameart.org baybeeee

## The Visual Feast

<div class="responsive-game-container">
  <iframe src="/assets/games/emoji-invaders/emoji-invaders.html" 
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
  padding-bottom: 100%; /* 1:1 aspect ratio for this game */
  height: 0;
  overflow: hidden;
  margin-bottom: 2rem;
}
</style>

## Lessons Learned

1. **Emojis are useful** - Instant visual appeal without asset loading headaches
2. **Performance = accessibility** - Fast loading means more people can enjoy your creation
3. **Constraints breed creativity** - Couldn't make noise effects work? Emojis to the rescue!
4. **Animation is cheap** - Those little motion details make it feel alive, and it only takes a few lines of code

## Future Directions

Ideas to explore:
- Mobile functionality 
- Multi-directional shooting
- Emoji power-ups
- Dynamic backgrounds
- Local multiplayer mode



Also I'm having V3 write this for me in aider and it's not good.  I need to explore better workflows, and maybe different models. 

