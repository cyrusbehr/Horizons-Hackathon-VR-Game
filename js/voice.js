// USING ANNYANG TO START THE GAME
if (annyang) {
  // Let's define our first command. First the text we expect, and then the function it should call
  var heard = false;
  var commands = {
    'start game': function() {
      gameHasStarted = true;
      heard = true;
      document.getElementsByClassName("start_game_menu")[0].style.display = "none"
      document.getElementsByClassName("game_screen")[0].style.display = "block"
      document.getElementsByClassName("score-container")[0].style.display = "block"
    }
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start();

  // Stop listening after start command
  if(heard === true) {
      annyang.abort()
  }
}
