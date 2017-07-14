
// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Not adding `{ audio: true }` since we only want video now
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.src = window.URL.createObjectURL(stream);
    video.play();
  });
}

// This functions runs when we press the capture button
document.getElementById("snap").addEventListener("click", function() {

});


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
      paddle_x_position = rect.x*ratio - paddle_width/4 //Multiply by the scaling factor used for the screen size
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

  if(ball_y_position > paddle_y_position - 13 && (ball_y_position - paddle_y_position) < 50 && ball_x_position > paddle_x_position && ball_x_position < paddle_x_position + paddle_width && y_velocity > 0){
    y_velocity=-y_velocity;
  }

  renderImage();
  collisionDetection();
  drawBricks();

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
  context.drawImage(video, 0, 0, 640, 480);
  context.restore();
}

function collisionDetection() {
  for(c=0; c<brickColumnCount; c++) {
    for(r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(ball_x_position > b.x && ball_x_position < b.x+brickWidth && ball_y_position > b.y && ball_y_position < b.y+brickHeight) {
          y_velocity = -y_velocity;
          b.status = 0;
        }
      }
    }
  }
}

function drawBricks() {
  for(let c=0; c<brickColumnCount; c++) {
    for(let r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
        var brickX = (c*(brickWidth+brickPaddingX))+brickOffsetLeft;
        var brickY = (r*(brickHeight+brickPaddingY))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        context.beginPath();
        context.rect(brickX, brickY, brickWidth, brickHeight);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
      }
    }
  }
}
