
// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Not adding `{ audio: true }` since we only want video now
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.src = window.URL.createObjectURL(stream);
    video.play();
  });
}

var colors = new tracking.ColorTracker(['magenta']);
colors.setMinDimension(5);
colors.setMinGroupSize(10)
colors.on('track', function(event) {
  if (event.data.length === 0) {
    // No colors were detected in this frame.
  } else {
    var maxRect;
    var maxRectArea = 0;
    event.data.forEach(function(rect) {
      paddle_x_position = rect.x*ratio //Multiply by the scaling factor used for the screen size
      paddle_y_position = rect.y*ratio

      console.log(rect.x, rect.y, rect.height, rect.width, rect.color);
      //determine where the top of the detected object is
      if (rect.width * rect.height > maxRectArea){
        maxRectArea = rect.width * rect.height;
        maxRect = rect;
      }
    });
  }
});

//WHEN THE WINDOW LOADS
window.onload = function() {
  tracking.track('#my_velocityvideo', colors, {camera: true});
  setInterval(update, updateRate); // RUN THE RENDER FUNCTION EVERY 50ms
}

//THE UPDATE SCREEN FUNCTION
var update = () => {
  ball_x_position+=x_velocity;
  ball_y_position+=y_velocity
  if(ball_y_position<0 && y_velocity < 0) {
    y_velocity=-y_velocity;
  }
  if(ball_x_position < 0  && x_velocity < 0){
    x_velocity = -x_velocity;
  }
  //bottom of the screen
  if(ball_y_position>canvas.height && y_velocity > 0) {
    y_velocity=-y_velocity;
  }
  if(ball_x_position > canvas.width  && x_velocity > 0){
    x_velocity = -x_velocity;
  }

  if(ball_y_position > paddle_y_position - -30 && (ball_y_position - paddle_y_position) < 50 && ball_x_position > paddle_x_position && ball_x_position < paddle_x_position + paddle_width && y_velocity > 0){
    y_velocity=-y_velocity;
  }

  renderImage();
  colDetection();
  // drawBricks();

  //create a sphere
  context.beginPath();
  context.arc(ball_x_position, ball_y_position, ball_dimension, 0, Math.PI*2, false)
  context.fillStyle='green';
  context.fill();
  context.closePath();

  //DEBUGGING:
  context.fillStyle='red';
  context.fillRect(paddle_x_position, paddle_y_position, paddle_width, paddle_height);
}

// RENDERS THE IMAGE
var renderImage = ()  => {
  context.drawImage(video, 0, 0, 960, 720);
  context.restore();
}

function colDetection() {
  for(let i = 0 ; i < brickArray.length; i++ ){
    var brick = brickArray[i]
    if(brick.status === 1){
    if(brick.row === 3 ) {
      var brickX = -brick.position.x*1.65+450;
    }else if (brick.row === 2 ){
      var brickX = -brick.position.x*1.6+440;
    }else{
      var brickX = -brick.position.x*1.6+450;
    }
      let brickY = -brick.position.y*1.5+360
      if(ball_x_position > brickX && ball_x_position < brickX + brickWidth && ball_y_position > brickY && ball_y_position < brickY+brickHeight) {
          y_velocity = -y_velocity;
          brickArray[i].status = 0;
          removeEntity(brick)
          updateScore(++score);
    }
}}
}

function removeEntity(object) {
    var selectedObject = scene.getObjectByName(object.name);
    scene.remove( selectedObject );
}

function updateScore (newScore){
  $("#score").text("Score: " + newScore)
}
