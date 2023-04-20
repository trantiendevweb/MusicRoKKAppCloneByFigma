const song = document.getElementById("song");
const btn_toggle = document.querySelector(".toggle-play");
const btn_next = document.querySelector(".next");
const btn_prev = document.querySelector(".prev");
const img = document.querySelector(".name img");
const btn_toggles = document.querySelector(".toggle-play");
const nameSong = document.querySelector(".musicName .nameMusic");
const artistName = document.querySelector(".musicName .author");
const timeLeft = document.querySelector(".music .timeleft");
const timeRight = document.querySelector(".music .timeright");
const rangeBar = document.querySelector(".music .range ");
const playRepeat = document.querySelector(".btns .repeat");
const listMusic = document.querySelector(".list-music") ; 
const playRandom = document.querySelector(".random" ) ; 
const switchcheck = document.querySelector(".wrap-switch input") ; 
const body = document.querySelector( "body")
const numberListeners = document.querySelector (".listeners p ")
let number = document.querySelector (".listeners p ").innerText ; 
function init( ) {
    let mode = localStorage.getItem("mode") ; 
    body.setAttribute("class" , mode)
     if ( mode == "dark") {
        switchcheck.click()
     }
}
init()
switchcheck.addEventListener("click", function(e) { 
  body.classList.toggle("dark") ; 
  let mode = body.getAttribute("class") ? "dark" : " " ; 
  localStorage.setItem("mode" , mode) ; 
})
function counterUp(el, to) {
	let speed = 300
	let from = 0
	let step = to / speed
	const counter = setInterval(function () {
		from += step
		if (from > to) {
			clearInterval(counter)
			el.innerText = to
		} else {
			el.innerText = Math.ceil(from)
		}
	}, 1)
}
counterUp(numberListeners,284199) ; 

let isPlaying = false;
let indexSong = 0;
let tracks = [];
let isRepeat = JSON.parse(localStorage.getItem("repeat"))

let isRandom ;


// Lấy danh sách bài hát từ API iTunes
fetch("https://itunes.apple.com/search?term=queen")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    data.results.forEach(function (track) {
      const trackObj = {
        artistName: track.artistName,
        trackName: track.trackName,
        collectionName: track.collectionName,
        artworkUrl: track.artworkUrl100,
        previewUrl: track.previewUrl,
      };
      tracks.push(trackObj);
    });
    // Cập nhật trang thái ban đầu cho bài hát đầu tiên
    updateSong();
    updateListMusic(tracks);
    let trackDom = document.querySelectorAll(".music") ; 
    activeMusic( )
    handleClick(trackDom);
    
    
  })
  .catch(function (error) {
    console.log(error);
  });







// cập nhật danh sách bài hát
  function updateListMusic (trackList) {
     trackList.forEach(function (track,index) {
       let div = document.createElement('div'); 
       div.classList.add('music') ; 
       div.innerHTML = ` 
       <div class="left">
       <span class="num">${index}</span>
       <img src="${track.artworkUrl}" alt="">
       <span class="name-music">${track.trackName}</span>

   </div>
   <div class="right">
       <span class="time"></span>
       <i class='bx bx-list-ul'></i>
       <i class='bx bx-dots-vertical-rounded' ></i>
   </div>
       `
       listMusic.appendChild(div) ; 
     }  ) 
  }
  
// cập nhật active music 
 function activeMusic( ) {
   let listmusic =  document.querySelectorAll(".list-music .music")
     listmusic.forEach(function (music) {
      let Nummusic = music.querySelector(".num").innerText ;
        if (   Nummusic == indexSong  ){
          music.classList.add("active-music") ;
        } else {
          music.classList.remove("active-music") ;
        }
     }) 
 }
  

// Cập nhật thông tin và URL của bài hát hiện tại
function updateSong() {
  const currentTrack = tracks[indexSong];
  song.setAttribute("src", currentTrack.previewUrl);
  img.setAttribute("src", currentTrack.artworkUrl);
  nameSong.innerText = currentTrack.trackName;
  artistName.innerHTML = currentTrack.artistName;

  if (isRepeat == null) {
    isRepeat = false;
    localStorage.setItem("repeat", false);
  } else {
    isRepeat = Boolean(isRepeat);
  }
  if (isRandom == null) {
    isRandom  = false;
    localStorage.setItem("random", false);
  } else {
	isRandom = Boolean(isRandom);
  } 
  activeMusic( )
  
}
const timer = setInterval(displayTimer, 1000);
// Phát bài hát tiếp theo
function nextSong() {
  indexSong++;
  if (indexSong >= tracks.length) {
    indexSong = 0;
  }
  isPlaying = false;
  btn_toggles.classList.remove("pause");
  btn_toggles.classList.add("start");
  updateSong();
  togglePlay();
}

// Phát bài hát trước đó
function prevSong() {
  indexSong--;
  if (indexSong < 0) {
    indexSong = tracks.length - 1;
  }
  isPlaying = false;
  btn_toggles.classList.remove("pause");
  btn_toggles.classList.add("start");
  updateSong();
  togglePlay();
}

// Bắt đầu hoặc tạm dừng bài hát
function togglePlay() {
  if (isPlaying) {
    song.pause();
    isPlaying = false;
  } else {
    song.play();
    isPlaying = true;
  }
}

// Xử lý sự kiện khi nhấn các nút điều khiển
btn_next.addEventListener("click", nextSong);
btn_prev.addEventListener("click", prevSong);
btn_toggle.addEventListener("click", togglePlay);

btn_toggle.addEventListener("click", function (e) {
  let className = e.target.parentElement.className;
  if (className.includes("start")) {
    e.target.parentElement.classList.remove("start");
    e.target.parentElement.classList.add("pause");
  } else {
    e.target.parentElement.classList.remove("pause");
    e.target.parentElement.classList.add("start");
  }
});

// xử lý sự kiện time
function displayTimer() {
  rangeBar.max = song.duration;
  
  rangeBar.value = song.currentTime;
  if (!song.duration) {
    timeLeft.innerText = "00:00";
  } else {
    timeLeft.textContent = formatTime(song.duration);
  }

  timeRight.textContent = formatTime(song.currentTime);
}
function formatTime(number) {
  const minutes = Math.round(number / 60);
  const seconds = Math.round(number - minutes * 60);
  return `${minutes}:${seconds} `;
}
// xử lý thanh input range
rangeBar.addEventListener("change", handleChangeBar);

function handleChangeBar(event) {
  song.currentTime = event.target.value;
}

// xử lý khi bài nhạc phát xong chuyển bài

song.addEventListener("ended", handlEndingSong);

function handlEndingSong() {

  if ( isRepeat == true ) {
   song.currentTime = 0;
    song.play();
    return  ; 
  }
  if ( isRandom == true ) {
	indexSong = Math.floor(Math.random() * tracks.length)  ; 
	updateSong() ;
	song.play();
  }
 
 nextSong( ); 
}


// xử lý repeat music
playRepeat.addEventListener("click", handleRepeatSong);
function handleRepeatSong() {
  if (isRepeat == false) {
    isRepeat = true;
    playRepeat.classList.add("active");
  } else {
    isRepeat = false;
    playRepeat.classList.remove("active");
  }
  localStorage.setItem("repeat", isRepeat);
  
}

function initMusic() {
   
	isRepeat = JSON.parse(localStorage.getItem("repeat")) ; 
	console.log(isRepeat) ; 
  if (isRepeat == 'false' || isRepeat == null) { 
    playRepeat.classList.remove("active");

  } else if (isRepeat == true ) {
    playRepeat.classList.add("active");
  }

  isRandom = localStorage.getItem("random"); 
  if (isRandom  == false || isRandom  == null) { 
    playRandom.classList.remove("active");
  } else if (isRandom  == 'true' ) {
    playRandom.classList.add("active");
  }
}

initMusic() 

// xử lý click vào playlist 

function handleClick (tracks) {
  
    tracks.forEach(function (track){
     track.addEventListener("click" , function (e) {
      tracks.forEach(function (track ) {
        track.classList.remove("active-music"); 
      })
          let trackNumber = track.querySelector(".num").innerText ; 
         
          indexSong = trackNumber ; 
          if ( trackNumber == indexSong  ) {
            this.classList.add("active-music"); 
          }  
          indexSong  = trackNumber ; 
          isPlaying = false;
          btn_toggles.classList.remove("pause");
          btn_toggles.classList.add("start");
          updateSong();
          togglePlay();
      }  )
    } 
    
    )
} 

// xử lý random music 

playRandom.addEventListener("click", handleRandomMusic)

function handleRandomMusic() {
  if (isRandom == false) {
   isRandom = true;
    playRandom.classList.add("active");
  } else {
    isRandom  = false;
    playRandom.classList.remove("active");
  }
  localStorage.setItem("random", isRandom.toString());
}