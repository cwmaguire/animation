"use strict";

let animation = {
  current: undefined,

  cancel:
    function (){
      animation.current = undefined;
    },

  animate:
    function (state, renderFun, limit, shouldClear = true){
      //for(let p in state){
        //console.log(`animate: state[${p}]: ${state[p]}`);
      //}
      let id = Symbol();
      animation.current = id;
      let canvas = document.getElementById("canvas1");
      animation.animate_({animation: {last_frame: 0,
                                      ellapsed: 0,
                                      frames_per_second: 30,
                                      first_ellapsed: undefined},
                          render: renderFun,
                          canvas: canvas,
                          context: canvas.getContext("2d"),
                          should_clear: shouldClear,
                          user: state,
                          id: id
                         },
                         limit);
    },

  animation_frame_callback:
    function (userState, state, limit){
      if(animation.current != state.id){
        return 0;
      }
      //for(let p in userState){
        //console.log(`animation_frame_callback: userState[${p}]: ${userState[p]}`);
      //}
      return function(ellapsed){
               let newState = clone(state);
               newState.animation.ellapsed = ellapsed;
               if(!state.animation.first_ellapsed){
                 newState.animation.first_ellapsed = ellapsed;
               }
               newState.user = userState;
               animation.animate_(newState, limit);
             }
    },

  animate_:
    function (state, limit){
      //for(let p in state.user){
        //console.log(`animate_: state.user[${p}]: ${state.user[p]}`);
      //}
      let anim = state.animation;
      let millisPerFrame = 1000 / anim.frames_per_second;
      let ellapsedMillis = Math.floor(anim.ellapsed - anim.first_ellapsed);
      anim.frame = Math.floor(ellapsedMillis / millisPerFrame);
      anim.ellapsedFrames = anim.frame - anim.last_frame;

      if(anim.ellapsedFrames == 0){
        out("t6", "skipping at " + anim.frame + " because 0 frames have ellapsed.");
        window.requestAnimationFrame(animation.animation_frame_callback(state.user, state, limit));
        return 0;
      }
      anim.last_frame = anim.frame;

      if(limit && anim.frame > limit){
        return 0;
      }

      out("t3", "frame: " + anim.frame);
      if(anim.ellapsedFrames != 1){
        out("t4", "at frame " + anim.frame + " ellapsed frames was " + anim.ellapsedFrames);
        out("t5", "lastFrame: " + anim.last_frame);
      }

      if(animation.should_clear){
        animation.clear();
      }
      state.animation = anim;
      if(animation.current == state.id){
        console.log(`animation.isCancelled: ${animation.isCancelled}`);
        let paramObj = {canvas: state.canvas,
                        context: state.context,
                        state: state.user};
        window.requestAnimationFrame(
          animation.animation_frame_callback(
            state.render(paramObj),
            state,
            limit));
      }else{
        console.log('Animation is cancelled');
        animation.cancelCallback();
        animation.cancelCallback = function(){};
      }
    },

  clear:
    function (){
      let c = document.getElementById("canvas1");
      let ctx = c.getContext("2d");
      let h = c.height * 2;
      let w = c.width * 2;
      ctx.clearRect(-(h/2), -(w/2), h, w);
      ctx.strokeStyle = "#F00";
    }
}
