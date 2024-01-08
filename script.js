console.log("lets gooo");

let currentSong = new Audio();

function timer(seconds) {
  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Format the result as "mm:ss"
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;

  return formattedTime;
}

async function getSongs() {
  let response = await fetch("http://127.0.0.1:5500/songs/");
  let text = await response.text();

  console.log(text);

  // Create a new div element
  let div = document.createElement("div");

  // Set the innerHTML of the div with the response text
  div.innerHTML = text;

  // Get all td elements in the div
  let as = div.getElementsByTagName("a");
  let songs = [];
  // Log the td elements

  for (let ind = 0; ind < as.length; ind++) {
    const element = as[ind];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".playbar-songname").innerHTML = track
    .replaceAll(/%20/g, " ")
    .replaceAll(" (320 kbps).mp3", " ")
    .replaceAll("%2C", " ")
    .replaceAll("(Official Music Video)", " ")
    .replaceAll("(Official Video)", " ")
    .split(" - ")[1];

  document.querySelector(".duration").innerHTML = "00:00/00:00";
};

// Call the main function
async function main() {
  //list of all songs
  let songs = await getSongs();
  console.log(songs);

  playMusic(songs[0], true);
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUL.innerHTML += `<li>
    
                <img
                  src="https://wrapped-images.spotifycdn.com/image/yts-shared-2023/default/your-top-songs-2023_DEFAULT_en-shared.jpg"
                  alt=""
                />
                <div class="songinfo">
                  <div > ${
                    song
                      .replaceAll(/%20/g, " ")
                      .replaceAll(" (320 kbps).mp3", " ")
                      .replaceAll("%2C", " ")
                      .replaceAll("(Official Music Video)", " ")
                      .replaceAll("(Official Video)", " ")
                      .split(" - ")[1]
                  }</div>
                  <div> ${
                    song
                      .replaceAll(/%20/g, " ")
                      .replaceAll(" (320 kbps).mp3", " ")
                      .replaceAll("%2C", " ")
                      .replaceAll("(Official Music Video)", " ")
                      .replaceAll("(Official Video)", " ")
                      .split(" - ")[0]
                  }</div>
                  <div class="hidden-div">
                  ${song}
                </div>
                </div>
                <div class="invert playnow">
                  <img  id="play2" src="play2.svg" alt="" />
                </div>
              
    
    
   </li>`;
    console.log(song);
  }

  //Attach an event listener to every songs
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    console.log(e);
    e.addEventListener("click", (element) => {
      console.log("Fetching songs");
      console.log(e.querySelector(".songinfo").firstElementChild.innerHTML);
      playMusic(e.querySelector(".songinfo :nth-of-type(3)").innerHTML.trim());
    });
  });

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  //listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".duration").innerHTML = `${timer(
      currentSong.currentTime
    )}/${timer(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //to change the pointer to any part of the scrollbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
}
main();
