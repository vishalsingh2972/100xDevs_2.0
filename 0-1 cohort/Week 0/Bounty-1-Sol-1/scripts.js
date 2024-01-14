var player = videojs(
    "my-video",
    {
      controls: true,
      fluid: true,
      html5: {
        vhs: {
          overrideNative: true,
        },
      },
    },
    function () {
      var player = this;
      player.eme();
      player.src({
        src: "https://cdn.bitmovin.com/content/assets/art-of-motion_drm/mpds/11331.mpd",
        type: "application/dash+xml",
        keySystems: {
          "com.widevine.alpha": "https://cwip-shaka-proxy.appspot.com/no_auth",
        },
      });
  
      var segments = [
        {
          start: 0,
          end: 30,
          name: "Segment 1",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec sapien ut libero ultricies vulputate. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
        },
        {
          start: 30,
          end: 90,
          name: "Segment 2",
          description: "Description 2",
        },
        {
          start: 90,
          end: 120,
          name: "Segment 3",
          description: "Description 3",
        },
        {
          start: 120,
          end: 210,
          name: "Segment 4",
          description: "Description 4",
        },
      ];
  
      var accordion = document.getElementById("accordion");
  
      player.ready(function () {
        player.on("loadedmetadata", function () {
          document.addEventListener("keydown", function (event) {
            if (event.code === "Space") {
              if (player.paused()) {
                player.play();
              } else {
                player.pause();
              }
            }
          });
  
          document.addEventListener("keydown", function (event) {
            if (event.code === "ArrowRight") {
              var currentTime = player.currentTime();
              player.currentTime(currentTime + 10); 
            }
          });
  
          document.addEventListener("keydown", function (event) {
            if (event.code === "ArrowLeft") {
              var currentTime = player.currentTime();
              player.currentTime(currentTime - 10); 
            }
          });
          segments.forEach(function (segment, index) {
            var card = document.createElement("div");
            card.className = "card";
  
            var cardHeader = document.createElement("div");
            cardHeader.className = "card-header";
            cardHeader.id = "heading" + index;
  
            var button = document.createElement("button");
            button.className = "btn btn-link";
            button.setAttribute("data-toggle", "collapse");
            button.setAttribute("data-target", "#collapse" + index);
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-controls", "collapse" + index);
            button.textContent = segment.name;
  
            cardHeader.appendChild(button);
  
            var collapseDiv = document.createElement("div");
            collapseDiv.id = "collapse" + index;
            collapseDiv.className = "collapse";
            collapseDiv.setAttribute("aria-labelledby", "heading" + index);
            collapseDiv.setAttribute("data-parent", "#accordion");
  
            var cardBody = document.createElement("div");
            cardBody.className = "card-body";
            cardBody.textContent = `${segment.description}`;
            var goToButton = document.createElement("button");
            goToButton.className = "btn-light go-btn btn btn-sm";
            goToButton.textContent = "Go to Section";
            cardBody.appendChild(goToButton);
            collapseDiv.appendChild(cardBody);
  
            card.appendChild(cardHeader);
            card.appendChild(collapseDiv);
  
            accordion.appendChild(card);
  
            // Add click event listener to call player.scrollToSegment
            goToButton.addEventListener("click", function () {
              if (window.player && window.player.scrollToSegment) {
                window.player.scrollToSegment(index);
              }
            });
          });
  
          segments.forEach(function (segment) {
            var segmentStart = segment.start;
            var segmentEnd = segment.end;
  
            var segmentDiv = document.createElement("div");
            segmentDiv.className = "vjs-segment-marker";
            segmentDiv.style.left =
              (segmentStart / player.duration()) * 100 + "%";
            segmentDiv.style.width =
              ((segmentEnd - segmentStart) / player.duration()) * 100 + "%";
  
            var tooltip = document.createElement("div");
            tooltip.className = "vjs-segment-tooltip";
            tooltip.textContent = segment.name;
            segmentDiv.appendChild(tooltip);
  
            segmentDiv.addEventListener("mouseover", function () {
              tooltip.style.display = "block";
            });
  
            segmentDiv.addEventListener("mouseout", function () {
              tooltip.style.display = "none";
            });
  
            player.controlBar.progressControl.el().appendChild(segmentDiv);
          });
  
          player.scrollToSegment = function (segmentIndex) {
            var targetSegment = segments[segmentIndex];
            if (targetSegment) {
              var seekTime = targetSegment.start;
              player.currentTime(seekTime);
            }
          };
        });
      });
    }
  );
  