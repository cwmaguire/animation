"use strict";

let animation = {
  isCancelled: false,

  cancel:
    function (){
      animation.isCancelled = true;
    },

  animate:
    function (state, renderFun){
      animation.isCancelled = false;
      let canvas = document.getElementById("canvas1");
      animation.animate_({animation: {lastFrame: 0,
                                      ellapsed: 0,
                                      ellapsedMillis: 0,
                                      framesPerSecond: 30,
                                      first_ellapsed: undefined},
                          render: renderFun,
                          canvas: canvas,
                          context: canvas.getContext("2d"),
                          user: state
                        });
    },

  animation_frame_callback:
    function (userState, state){
      return function(ellapsed){
               let newState = clone(state);
               newState.animation.ellapsed = ellapsed;
               if(!state.animation.first_ellapsed){
                 newState.animation.first_ellapsed = ellapsed;
               }
               newState.user = userState;
               animation.animate_(newState);
             }
    },

  animate_:
    function (state){
      let anim = state.animation;
      let millisPerFrame = 1000 / anim.framesPerSecond;
      let ellapsedMillis = Math.floor(anim.ellapsed - anim.first_ellapsed);
      anim.frame = Math.floor(ellapsedMillis / millisPerFrame);
      anim.ellapsedFrames = anim.frame - anim.lastFrame;

      if(anim.ellapsedFrames == 0){
        out("t6", "skipping at " + anim.frame + " because 0 frames have ellapsed.");
        window.requestAnimationFrame(animation.animation_frame_callback(state.user, state));
        return 0;
      }
      anim.lastFrame = anim.frame;

      if(anim.frame > 50){
        console.log("Animation stopped: anim.frame: " + anim.frame);
        for(let field in anim){
          console.log(`${field}: ${anim[field]}`);
        }
        return 0;
      }

      out("t3", "frame: " + anim.frame);
      if(anim.ellapsedFrames != 1){
        out("t4", "at frame " + anim.frame + " ellapsed frames was " + anim.ellapsedFrames);
        out("t5", "lastFrame: " + anim.lastFrame);
      }

      animation.clear();
      state.animation = anim;
      if(!animation.isCancelled){
        window.requestAnimationFrame(animation.animation_frame_callback(state.render(state.user), state));
      }
    },

  clear:
    function (){
      let c = document.getElementById("canvas1");
      let ctx = c.getContext("2d");
      let h = c.height;
      let w = c.width;
      animation.clear_(ctx, w, h);
      ctx.clearRect(0, 0, h, w);
      ctx.strokeStyle = "#F00";
    },

  clear_:
    function clear_(ctx, h, w){
      ctx.clearRect(0, 0, h, w);
    }
}
