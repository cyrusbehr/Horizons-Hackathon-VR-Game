var game_canvas = document.getElementById('game_canvas');
var game_canvas_context = game_canvas.getContext('2d');
var canvas_video = document.getElementById('canvas_video');

// paddle
var paddle_x_position = 0;
var paddle_height = 30;
var paddle_width = 200;
var paddle_y_position = 430

//ball
var ball_x_position = 60;
var ball_y_position = 50;
var ball_dimension = 15;
var x_velocity = 2;
var y_velocity = 2;

//brick parameters
var brickRowCount = 3;
var brickColumnCount = 6;
var brickWidth = 75;
var brickHeight = 20;
var brickPaddingX = 20;
var brickPaddingY = 10;
var brickOffsetTop = 20;
var brickOffsetLeft = 40;

//create brick array
var bricks = [];
for(var i=0; i<brickColumnCount; i++) {
    bricks[i] = [];
    for(var j=0; j<brickRowCount; j++) {
        bricks[i][j] = { x: 0, y: 0 };
    }
}

var update_rate = 5;

var ratio = 3.2; //ratio between tracking video and canvas size

var video_width;
var video_height;
