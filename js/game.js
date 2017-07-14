

// Access the users camera
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Not adding `{ audio: true }` since we only want video now
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    canvas_video.src = window.URL.createObjectURL(stream);
    canvas_video.play();
  });
}

//Initialize our color tracker, and pass it array of colors to track
var color_tracker = new tracking.ColorTracker(['magenta']);
color_tracker.setMinDimension(5);
color_tracker.setMinGroupSize(10);
color_tracker.on('track', function(event) {
  if (event.data.length === 0) {
    // No colors were detected in this frame.
  } else {
    var maxRect;
    var maxRectArea = 0;
    event.data.forEach(function(rect) {
      paddle_x_position = rect.x*ratio - paddle_width/4 //subtract paddle_width/4 to center the paddle
      paddle_y_position = rect.y*ratio //Multiply by the scaling factor used for the screen size

      //determine where the top of the detected object is
      if (rect.width * rect.height > maxRectArea){
        maxRectArea = rect.width * rect.height;
        maxRect = rect;
      }
    });
  }
});

//When the window initially loads
window.onload = function() {
  tracking.track('#tracking_video', color_tracker, {camera: true});
  setInterval(updateVariables, update_rate); //Render the game
  // TODO: run this set interval function only after the user has pressed start game
}

var updateVariables = () => {
  if(!video_width || !video_height){
    game_canvas = document.getElementById('game_canvas');
    game_canvas_context = game_canvas.getContext('2d');
    canvas_video = document.getElementById('canvas_video');


    console.log('run');
    var video_element = document.getElementById('canvas_video'); // TODO: remove if it doeasn't bvreak code

    video_width = video_element.videoWidth;
    video_height = video_element.videoHeight;

    video_element.setAttribute('width', video_width * video_ratio);
    video_element.setAttribute('height', video_height * video_ratio);

    game_canvas.setAttribute('width', video_width * canvas_ratio);
    game_canvas.setAttribute('height', video_height * canvas_ratio);

    var tracking_video_element = document.getElementById('tracking_video');
    tracking_video_element.setAttribute('width', video_width * video_ratio / ratio);
    tracking_video_element.setAttribute('height', video_height * video_ratio / ratio);
  }



  ball_x_position+=x_velocity;
  ball_y_position+=y_velocity
  if(ball_y_position<0 && y_velocity < 0) {
    y_velocity=-y_velocity;
  }
  if(ball_x_position < 0  && x_velocity < 0){
    x_velocity = -x_velocity;
  }

  // TODO: Remove this condition. When the vall hits the bottom, loose a life
  if(ball_y_position>game_canvas.height && y_velocity > 0) {
    y_velocity=-y_velocity;
  }
  if(ball_x_position > game_canvas.width  && x_velocity > 0){
    x_velocity = -x_velocity;
  }

  if(ball_y_position > paddle_y_position - 13 && (ball_y_position - paddle_y_position) < 50 && ball_x_position > paddle_x_position && ball_x_position < paddle_x_position + paddle_width && y_velocity > 0){
    y_velocity=-y_velocity;
  }

  renderImage();
  drawBricks();

  // TODO: Replace this with jathersons sphere
  game_canvas_context.beginPath();
  game_canvas_context.arc(ball_x_position, ball_y_position, ball_dimension, 0, Math.PI*2, false)
  game_canvas_context.fillStyle='green';
  game_canvas_context.fill();
  game_canvas_context.closePath();

  //DEBUGGING: displays the paddle
  // cc.fillStyle='red';
  // cc.fillRect(paddle_x_position, paddle_y_position, paddle_width, paddle_height);
}

// Renders a picture of the video the the canvas
var renderImage = ()  => {
  // TODO: change this to Donovans new method
  console.log(game_canvas)
  console.log(game_canvas_context)

  game_canvas_context.drawImage(canvas_video, 0, 0, video_width * canvas_ratio, video_height * canvas_ratio);
  game_canvas_context.restore();
}

// TODO: Replace this with jathersons brick rendering code
function drawBricks() {
  for(let i=0; i<brickColumnCount; i++) {
    for(let j=0; j<brickRowCount; j++) {
      var brickX = (i*(brickWidth+brickPaddingX))+brickOffsetLeft;
      var brickY = (j*(brickHeight+brickPaddingY))+brickOffsetTop;
      bricks[i][j].x = brickX;
      bricks[i][j].y = brickY;
      game_canvas_context.beginPath();
      game_canvas_context.rect(brickX, brickY, brickWidth, brickHeight);
      game_canvas_context.fillStyle = "#0095DD";
      game_canvas_context.fill();
      game_canvas_context.closePath();
    }
  }
}
