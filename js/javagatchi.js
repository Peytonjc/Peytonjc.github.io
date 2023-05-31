
      
      

      //Breakout Game
      // https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
      // Build canvas
      const JG_canvas = document.getElementById("JVCanvas");
      const JG_ctx = JG_canvas.getContext("2d");
      
      //Function to get the mouse position
      function JG_getMousePos(canvas, event) {
          var bindingRect = canvas.getBoundingClientRect();
          return {
              x: event.clientX - bindingRect.left,
              y: event.clientY - bindingRect.top
          };
      }
      //Function to check if mouse is inside start button
      function JG_isInsideStart(pos, rect){
        return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
      }
      document.addEventListener("keydown", keyDownHandler, false);
      document.addEventListener("keyup", keyUpHandler, false);
      JG_canvas.addEventListener('click', function(evt) {
      var mousePos = JG_getMousePos(canvas, evt);
      if (JG_isInsideStart(mousePos,startRect)) {
        JGGameRunning = true;
        JGInterval = setInterval(draw, 10);
        }else{
            
        }   
      }, false);

      

      

      
      
    
      
      
      function JG_drawStartMenu() {
        
        JG_ctx.fillStyle = '#669999';
        JG_ctx.rect(startRect.x, startRect.y, startRect.width, startRect.height);
        JG_ctx.fill();
        JG_ctx.closePath();
        JG_ctx.font = "18px Arial";
        JG_ctx.fillStyle = "#ffffff";
        JG_ctx.fillText(`Start JG Game`, (JG_canvas.width /2)-(startWidth/2), (JG_canvas.height / 2));
        JG_ctx.closePath();
      }
      

      // Draw function
      function JG_draw() {
        // drawing code
        JG_ctx.clearRect(0, 0, JG_canvas.width, JG_canvas.height);
        
      }
      // Run drawing loop every 10   This will need to be called and stopped when the tab changes...
      //var interval = setInterval(draw, 10);