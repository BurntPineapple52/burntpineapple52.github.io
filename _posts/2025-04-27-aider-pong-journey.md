---
layout: post
title: "Aider Pong Journey"
subtitle: "From vulgar snake to even more vulgar pong"
categories: [coding, ai, games]
tags: [aider, html5, javascript, pong] 
author: BurntPineapple
---

# Pong But Make It Toxic

After the success of Vulgar Snake, I decided to push Aider even further - creating the most offensive version of Pong imaginable. The results? Glorious.

## The Making of a Masterpiece

Key stats:
- Development time: 45 minutes
- Tokens burned: ~42k
- Insults generated: 128 (and counting)
- Particles exploded: ∞

The AI handled all the tedious parts:
- Particle effects for ball trails
- Dynamic insult messaging
- AI opponent with "personality"
- Score explosions

While I focused on the important stuff:
- Curating the most offensive insult library
- Fine-tuning the AI's trash talk timing
- Making sure the particle effects looked dope

## Behold the Beauty

<div class="responsive-game-container">
  <iframe src="/assets/games/aiderizedPong/pong.html" 
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

1. **AI gets dark** - I didn't need to write most of the insults, just seed a few examples
2. **Effects are cheap** - Particle systems that would take me hours were done in minutes
3. **Personality matters** - The AI opponent's "flaws" make it feel more human
4. **16:9 is life** - Proper aspect ratio makes all the difference

## What's Next?

I'm thinking:
- Multiplayer mode (with voice chat insults)
- Power-ups (like "mute opponent" or "disable chat")
- Dynamic difficulty that adapts to your salt level

The possibilities are endless when you have an AI co-pilot who never judges your terrible ideas.
