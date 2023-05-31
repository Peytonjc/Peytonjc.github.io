
      let breakoutInterval = null
      let breakoutGameOver = false
      let breakoutGameRunning = false
      $(function() {
        
        // Tabs
        $(".tabgroup > div").hide();
        $(".tabgroup > div:first-of-type").show();
        $(".tabs a").click(function(e) {
          e.preventDefault();
          var $this = $(this),
            tabgroup = "#" + $this.parents(".tabs").data("tabgroup"),
            others = $this
              .closest("li")
              .siblings()
              .children("a"),
            target = $this.attr("href");
          others.removeClass("active");
          $this.addClass("active");
          $(tabgroup)
            .children("div")
            .hide();
          $(target).show();
          if (target == "#tab1" && !breakoutGameOver && breakoutGameRunning){
            if (breakoutInterval !== null) return;
            breakoutInterval = setInterval(draw, 10);
          }
          else{
            clearInterval(breakoutInterval);
            breakoutInterval = null
          }

          // Scroll to tab content (for mobile)
          if ($(window).width() < 992) {
            $("html, body").animate(
              {
                scrollTop: $("#first-tab-group").offset().top
              },
              200
            );
          }
        });
        drawStartMenu();
      });

      //Breakout Game
      // https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
      // Build canvas
      const canvas = document.getElementById("myCanvas");
      const ctx = canvas.getContext("2d");
      // Initialize start button object
      startWidth = 100;
      startHeight = 40;
      startX = ((canvas.width - startWidth)/2);
      startY = ((canvas.height - startHeight) / 2);
      let startRect = {x: startX, y: startY, width: startWidth, height: startHeight};
      // Initialize X, Y, and ball radius
      let x = canvas.width / 2;
      let y = canvas.height - 30;
      let ballRadius = 10;
      // Initialize X and Y changes
      let dx = 2;
      let dy = -2;
      // Initialize Paddle values
      const paddleHeight = 10;
      const paddleWidth = 75;
      let paddleX = (canvas.width - paddleWidth) / 2;
      // Initialize variables for paddle control
      let rightPressed = false;
      let leftPressed = false;
      // Initialize variable for score
      let score = 0;
      // Initialize constansts for brick size
      const brickRowCount = 3;
      const brickColumnCount = 5;
      const brickWidth = 75;
      const brickHeight = 20;
      const brickPadding = 10;
      const brickOffsetTop = 30;
      const brickOffsetLeft = 30;
      // Array to hold all of the brick objects and their locations
      var bricks = [];
      for (var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
      }
      // Function to draw all the bricks
      function drawBricks() {
        for(var c=0; c<brickColumnCount; c++) {
          for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
              var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
              var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
              bricks[c][r].x = brickX;
              bricks[c][r].y = brickY;
              ctx.beginPath();
              ctx.rect(brickX, brickY, brickWidth, brickHeight);
              ctx.fillStyle = "#0095DD";
              ctx.fill();
              ctx.closePath();
            }
          }
        }
      }
      //Function to get the mouse position
      function getMousePos(canvas, event) {
          var bindingRect = canvas.getBoundingClientRect();
          return {
              x: event.clientX - bindingRect.left,
              y: event.clientY - bindingRect.top
          };
      }
      //Function to check if mouse is inside start button
      function isInsideStart(pos, rect){
        return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
      }
      document.addEventListener("keydown", keyDownHandler, false);
      document.addEventListener("keyup", keyUpHandler, false);
      canvas.addEventListener('click', function(evt) {
      var mousePos = getMousePos(canvas, evt);
      if (isInsideStart(mousePos,startRect)) {
        breakoutGameRunning = true;
        breakoutInterval = setInterval(draw, 10);
        }else{
            
        }   
      }, false);
      function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
          rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
          leftPressed = true;
        }
      }

      function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
          rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
          leftPressed = false;
        }
      }

      function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }

      function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }

      function checkCollision() {
        if (x + dx <= ballRadius|| x + dx >= canvas.width - ballRadius){
          dx = -dx;
        }
        if (y + dy < ballRadius) {
          dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
          if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            if (x < paddleX + (paddleWidth / 2)){
              dx = -Math.abs(dx);
            }
            else
            {
              dx = Math.abs(dx);
            }
          } else {
            alert("GAME OVER");
            clearInterval(breakoutInterval); // Needed for Chrome to end game
            breakoutGameOver = true;
          }
        }

      }
      function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
          for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status == 1){
              if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                // A collision has occured between the ball and the bricks
                dy = -dy;
                b.status = 0;
                score++;
                if (score === brickRowCount * brickColumnCount) {
                  alert("You won Breakout!");
                  clearInterval(breakoutInterval); // Needed for Chrome to end game
                  breakoutGameOver = true;
                  breakoutGameRunning = false;
                }
              }
            }
          }
        }
      }
      function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText(`Score: ${score}`, 8, 20);
      }
      function drawStartMenu() {
        
        ctx.fillStyle = '#669999';
        ctx.rect(startRect.x, startRect.y, startRect.width, startRect.height);
        ctx.fill();
        ctx.closePath();
        ctx.font = "18px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`Start Game`, (canvas.width /2)-(startWidth/2), (canvas.height / 2));
        ctx.closePath();
      }
      

      // Draw function
      function draw() {
        // drawing code
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        collisionDetection();
        checkCollision();
        if(rightPressed) {
          paddleX += 7;
          if (paddleX + paddleWidth > canvas.width){
              paddleX = canvas.width - paddleWidth;
          }
        }
        else if(leftPressed) {
          paddleX -= 7;
          if (paddleX < 0){
              paddleX = 0;
          }
        }
        x += dx;
        y += dy;
      }
      // Run drawing loop every 10   This will need to be called and stopped when the tab changes...
      //var interval = setInterval(draw, 10);