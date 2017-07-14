//obtain page elements
c = document.getElementById('canvas');
cc = c.getContext('2d')


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
  //obtain the image dd hoata
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  var colorObj = getAverageColor(imageData.data, 0, 0, 150, 150);
  console.log(colorObj);
  // TODO: ensure that the colors are being obtained at the correct corner, and that the transform does not affect it
  // TODO: move the region to the center bottom
});

// //DEFINE OUR OWN COLOR, THIS WILL LATER BE OBTAINED FROM THE camera
// tracking.ColorTracker.registerColor('skinTone', function(r, g, b) {
//   if (r < 220 && r > 155   && g < 160 && g > 95  && b < 135 && b > 70) {
//     return true;
//   }
//   return false;
// });


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
  if(ball_y_position>c.height && y_velocity > 0) {
    y_velocity=-y_velocity;
  }
  if(ball_x_position > c.width  && x_velocity > 0){
    x_velocity = -x_velocity;
  }

  if(ball_y_position > paddle_y_position - 13 && (ball_y_position - paddle_y_position) < 50 && ball_x_position > paddle_x_position && ball_x_position < paddle_x_position + paddle_width && y_velocity > 0){
    y_velocity=-y_velocity;
  }

  renderImage();
  drawBricks();

  //create a sphere
  cc.beginPath();
  cc.arc(ball_x_position, ball_y_position, ball_dimension, 0, Math.PI*2, false)
  cc.fillStyle='green';
  cc.fill();
  cc.closePath();
  cc.fillStyle='red'; // can comment out when not debugging
  cc.fillRect(paddle_x_position, paddle_y_position, paddle_width, paddle_height);
}

// RENDERS THE IMAGE
var renderImage = ()  => {
  context.drawImage(video, 0, 0, 640, 480);
  context.restore();
}

function drawBricks() {
  for(let c=0; c<brickColumnCount; c++) {
    for(let r=0; r<brickRowCount; r++) {
      var brickX = (c*(brickWidth+brickPaddingX))+brickOffsetLeft;
      var brickY = (r*(brickHeight+brickPaddingY))+brickOffsetTop;
      bricks[c][r].x = brickX;
      bricks[c][r].y = brickY;
      cc.beginPath();
      cc.rect(brickX, brickY, brickWidth, brickHeight);
      cc.fillStyle = "#0095DD";
      cc.fill();
      cc.closePath();
    }
  }
}
