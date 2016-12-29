# JavaScript Animation Helper

A tiny JavaScript animation helper.

Follows the pattern of an Erlang gen_server. All data necessary to draw each animation frame is stored in the animation "state".
The base state holds data such as the last frame, ellapsed milliseconds and frame rate. The user provides a function to create
some initial custom state. The animation helper will call the render function and pass the animation state, which includes the
custom state. The custom state is stored in the animation.user object;

See https://github.com/cwmaguire/js_doodle for an example of "animation"
in use.
