"use strict";

function animate(){
  out("t2", "true");
  var canvas = document.getElementById("canvas1");
  var impl_state = state();
  animate_({animation: {lastFrame: 0,
                        ellapsed: 0,
                        ellapsedMillis: 0,
                        framesPerSecond: 30},
            canvas: canvas,
            context: canvas.getContext("2d"),
            user: impl_state});
}

function animationFrameCallback(state){
  return function(ellapsed){
           var newState = clone(state);
           newState.animation.ellapsed = ellapsed;
           animate_(newState);
         }
}

function animate_(state){
  var anim = state.animation;
  var millisPerFrame = 1000 / anim.framesPerSecond;
  var ellapsedMillis = Math.floor(anim.ellapsed);
  anim.frame = Math.floor(ellapsedMillis / millisPerFrame);
  anim.ellapsedFrames = anim.frame - anim.lastFrame;

  if(anim.ellapsedFrames == 0){
    out("t6", "skipping at " + anim.frame + " because 0 frames have ellapsed.");
    requestAnimationFrame(animationFrameCallback(state));
    return 0;
  }
  anim.lastFrame = anim.frame;

  if(anim.frame > 500){
    return 0;
  }

  out("t3", "frame: " + anim.frame);
  if(anim.ellapsedFrames != 1){
    out("t4", "at frame " + anim.frame + " ellapsed frames was " + anim.ellapsedFrames);
    out("t5", "lastFrame: " + anim.lastFrame);
  }

  clear();
  state.animation = anim;
  requestAnimationFrame(animationFrameCallback(render(state)));
}

function clear(){
  var c = document.getElementById("canvas1");
  var ctx = c.getContext("2d");
  var h = c.height;
  var w = c.width;
  clear_(ctx, w, h);
  ctx.clearRect(0, 0, h, w);
  ctx.strokeStyle = "#F00";
}

function clear_(ctx, h, w){
  ctx.clearRect(0, 0, h, w);
}
