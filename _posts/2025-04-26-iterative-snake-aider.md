---
layout: post
title: Iterative Snake with Aider
subtitle: How AI pair programming makes development joyful
tags: [coding, ai, games]
author: BurntPineapple
---

# Coding with Aider is a Game Changer

Today I built the most ridiculous version of Snake ever in just 30 minutes using [Aider](https://aider.chat/) and Deepseek-v3-0324. The entire process only burned 300k tokens and was completely free thanks to [OpenRouter](https://openrouter.ai/)!

## The Joy of AI Pair Programming

Working with Aider was an absolute blast. Instead of getting bogged down in implementation details, I could focus on the fun creative parts:

- Coming up with wacky snake personalities
- Designing over-the-top death animations 
- Adding hilarious speech bubbles
- Creating dramatic wall-avoidance behaviors

The AI handled all the tedious JavaScript/CSS/Canvas work while I focused on the vision. It was like having a super-powered coding partner who never gets tired of my crazy ideas.

## Try the Madness Yourself

Here's the unhinged result of our collaboration:

<div class="responsive-game-container">
  <iframe src="/assets/iterativesnakes/Deepseekv3-0324-Chutes-fp8/Deepseekv3-0324run4.html" 
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

## Why This Matters

This experience showed me how AI tools can:
- Remove friction from creative coding
- Make experimentation nearly free (0 tokens cost!)
- Keep the focus on ideas rather than syntax
- Enable rapid iteration cycles

I'm excited to see how these tools evolve. If today's free tier is this powerful, imagine what we'll be building in a year!

### Pro Tip
For the best Aider experience:
1. Be specific about what you want
2. Break changes into small steps
3. Don't be afraid to iterate
4. Have fun with it!
