console.log("hihi");
const $ = document.querySelector.bind(document);

const dashboardSongTitle = $(".dashboard .song-title");
const dashboardSongArtist = $(".dashboard .song-artist");
const dashboardImg = $(".dashboard .song-img");
const dashboardAudio = $(".dashboard audio");

const playBtn = $(".btn-toggle-play");
const ctrlBtns = $(".control-btns");
const progressBar = $(".progress");

const nextBtn = $(".fa-step-forward");
const previousBtn = $(".fa-step-backward");
const repeatBtn = $(".fa-redo");
const shuffleBtn = $(".fa-shuffle");

// chinh
function iosPolyfill(e) {
  var val =
      (e.pageX - progressBar.getBoundingClientRect().left) /
      (progressBar.getBoundingClientRect().right -
        progressBar.getBoundingClientRect().left),
    max = progressBar.getAttribute("max"),
    segment = 1 / (max - 1),
    segmentArr = [];

  max++;

  for (var i = 0; i < max; i++) {
    segmentArr.push(segment * i);
  }

  var segCopy = segmentArr.slice(),
    ind = segmentArr.sort((a, b) => Math.abs(val - a) - Math.abs(val - b))[0];

  progressBar.value = segCopy.indexOf(ind) + 1;

  dashboardAudio.currentTime =
    (progressBar.value / 100) * dashboardAudio.duration;
}

if (!!navigator.platform.match(/iPhone|iPod|iPad/)) {
  progressBar.addEventListener("touchend", iosPolyfill, { passive: true });
}

const app = {
  songs: [
    {
      title: "Digital love",
      artist: "Daft Punk",
      path: "./file/beat/song0.mp3",
      img: "./file/img/song0.jfif"
    },
    {
      title: "Something about us",
      artist: "Daft Punk",
      path: "./file/beat/song1.mp3",
      img: "./file/img/song1.jpg"
    },
    {
      title: "Thức giấc",
      artist: "Da Lab",
      path: "./file/beat/song2.mp3",
      img: "./file/img/song2.jfif"
    },
    {
      title: "Daddy",
      artist: "Coldplay",
      path: "./file/beat/song3.mp3",
      img: "./file/img/song3.jfif"
    },
    {
      title: "Higher power",
      artist: "Coldplay",
      path: "./file/beat/song4.mp3",
      img: "./file/img/song4.jpg"
    },
    {
      title: "Bao nhiêu",
      artist: "Chillies",
      path: "./file/beat/song5.mp3",
      img: "./file/img/song5.jpg"
    },
    {
      title: "Save your tears",
      artist: "The Weeknd",
      path: "./file/beat/song6.mp3",
      img: "./file/img/song6.jfif"
    },
    {
      title: "Cứ chill thôi",
      artist: "Chillies",
      path: "./file/beat/song7.mp3",
      img: "./file/img/song7.jfif"
    },
    {
      title: "Dù cho mai về sau (Lofi ver.)",
      artist: "buitruonglinh x Freak D",
      path: "./file/beat/song8.mp3",
      img: "./file/img/song8.jfif"
    },
    {
      title: "Starry starry night (Loving Vincent OST)",
      artist: "Lianne La Havas",
      path: "./file/beat/song9.mp3",
      img: "./file/img/song9.jpg"
    }
  ],

  manualDefineProps: function () {
    Object.defineProperty(this, "currentIndex", {
      writable: true,
      value: Math.floor(Math.random() * app.songs.length)
    });

    Object.defineProperty(this, "isShuffled", {
      writable: true,
      value: false
    });

    Object.defineProperty(this, "isRepeated", {
      writable: true,
      value: false
    });

    Object.defineProperty(this, "getCurrentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },

  loadCurrentSong: function () {
    dashboardSongTitle.innerText = this.getCurrentSong.title;
    dashboardSongArtist.innerText = this.getCurrentSong.artist;
    dashboardImg.style.backgroundImage = `url(${this.getCurrentSong.img})`; // CU PHAP DUA VO HAM CX PHAI DUNG
    dashboardAudio.src = this.getCurrentSong.path;
    document.querySelector(
      "title"
    ).innerText = `${this.getCurrentSong.title} - ${this.getCurrentSong.artist}`;
    // console.log(
    //   dashboardSongTitle,
    //   dashboardSongArtist,
    //   dashboardImg,
    //   dashboardAudio
    // );
  },

  scollSrceenEvent: function (oldWidth) {
    const scrollOrdinate = document.documentElement.scrollTop || window.scrollY; //GTRI TANG DAN KHI SCROLL TU TREN XUN DUOI;
    const newWidth =
      oldWidth - scrollOrdinate > 10 ? oldWidth - scrollOrdinate : 0;
    // console.log(newWidth);
    $(".cd").style.width = newWidth + "px"; //DUNG $(".cd").offsetWidth LAI KO DC MO NGHE
    $(".cd").style.opacity = newWidth / oldWidth; // :) newWidth-> opa 1, oldwidth-> opa ?
  },

  playBtnClicked: function () {
    ctrlBtns.classList.toggle("playing");
    // console.log(this); cho nay this la plyBtn r
    if (!ctrlBtns.classList.contains("playing")) {
      // app.isPlaying = false;
      // this.currentIndex = 1;
      dashboardAudio.pause();
      // console.log("false:", app.isPlaying);

      /* KHI CHUA CHOI THI NUT PLAY PHAI HIEN DE CLICK VAO R LENH CHOI CHU, choi thi hien nut pause va choi nhac, con ko choi thi hien nut play va dung choi nhac */
    } else {
      // app.isPlaying = true;
      dashboardAudio.play();
      // console.log("true:", app.isPlaying);
    }
  },

  audioTimeUpdate: function () {
    if (dashboardAudio.duration) {
      const progressPercent =
        (dashboardAudio.currentTime / dashboardAudio.duration) * 100;
      progressBar.value = progressPercent;
      progressBar.style.background =
        "linear-gradient(to right, #44bec7 0%, #44bec7 " +
        progressBar.value +
        "%, #d3d3d3 " +
        progressBar.value +
        "%, #d3d3d3 100%)";
    }
  },

  progressChange: function () {
    // duration-> 100, currenttime->%
    dashboardAudio.currentTime =
      (progressBar.value / 100) * dashboardAudio.duration;
  },

  nextBtnClicked: function () {
    if (app.isShuffled) {
      do {
        var newIndex = Math.floor(Math.random() * app.songs.length); //tu 0 den length-1 dc th
        // console.log(newIndex);
      } while (
        newIndex === app.currentIndex + 1 ||
        newIndex === app.currentIndex
      );
      app.currentIndex = newIndex;
    }
    // console.log(this);->> nextBtn
    else ++app.currentIndex;
    if (app.currentIndex === app.songs.length) app.currentIndex = 0;
    //dua ttin vao dashboardSongTitle, dashboardSongArtist, dashboardImg, dashboardAudio theo index htai
    app.loadCurrentSong();
    app.onChangeSong();
    // THU TU 2 HAM TREN NHU RK MS DUNG NE
    // console.log(app.currentIndex, app.renderPlaylist);
    app.renderPlaylist();
    app.playingSongInCenter();
  },

  previousBtnClicked: function () {
    if (app.isShuffled) {
      do {
        var newIndex = Math.floor(Math.random() * app.songs.length); //tu 0 den length-1 dc th
        // console.log(newIndex);
      } while (
        newIndex === app.currentIndex - 1 ||
        newIndex === app.currentIndex
      );
      app.currentIndex = newIndex;
    }
    // console.log(this);->> nextBtn
    else --app.currentIndex;
    if (app.currentIndex === -1) app.currentIndex = app.songs.length - 1;
    app.loadCurrentSong();
    app.onChangeSong();
    app.renderPlaylist();
    app.playingSongInCenter();
  },

  onChangeSong: function () {
    ctrlBtns.classList.add("playing");
    dashboardAudio.play();
    dashboardAudio.currentTime = 0;
  },

  // chinh
  play: function () {
    dashboardAudio.play();
  },

  handleSongEnd: function () {
    if (app.isRepeated) {

      dashboardAudio.play();
    }

    else {
      app.nextBtnClicked();
    }


  },

  handleShuffleClicked: function () {
    app.isShuffled = !app.isShuffled;
    this.classList.toggle("btn-active");

  },

  handleRepeatClicked: function () {
    app.isRepeated = !app.isRepeated;
    // shuffleBtn.classList.remove("btn-active");
    this.classList.toggle("btn-active");
  },

  playingSongInCenter: function () {
    setTimeout(() => {
      $(".song-playing").scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 300);
  },

  handleEvents: function () {
    // const _this = this;
    const oldWidth = $(".cd").offsetWidth;
    document.onscroll = function () {
      // console.log(this); DONG NAY LAM WEB CRACKED, IN RA CO DOCUMENTHTML LUN NE
      app.scollSrceenEvent(oldWidth); //DUNG THIS.... LA SAI MA PHAI GOI NHU NAY
    };
    playBtn.onclick = this.playBtnClicked;
    dashboardAudio.ontimeupdate = this.audioTimeUpdate;
    dashboardAudio.onended = this.handleSongEnd;
    progressBar.onchange = this.progressChange;
    progressBar.oninput = this.progressChange;
    nextBtn.onclick = this.nextBtnClicked;
    previousBtn.onclick = this.previousBtnClicked;
    repeatBtn.onclick = this.handleRepeatClicked;
    shuffleBtn.onclick = this.handleShuffleClicked;
  },

  // cach nay khac vs a Son nay
  renderPlaylist: function () {
    // console.log(app.currentIndex);
    let playList = $(".play-list");
    playList.innerHTML = "";
    // console.log(playList);
    this.songs.forEach((song, index) => {
      const songCard = document.createElement("div");
      songCard.classList.add("song-card");
      if (index === app.currentIndex) songCard.classList.add("song-playing");

      songCard.innerHTML = `
        <img
          src=${song.img}
          class="next-song-img"
        />
        <div class="song-body">
          <h3 class="song-title">${song.title}</h3>
          <p class="song-artist">${song.artist}</p>
        </div>
        <i class="song-options fas fa-ellipsis-h"></i>
      `;
      songCard.onclick = function () {
        // song card thi dc nhung song body lai gap vde
        app.currentIndex = index;
        app.loadCurrentSong();
        app.onChangeSong();
        app.renderPlaylist();
      };
      playList.appendChild(songCard);
    });
  },

  start: function () {
    this.manualDefineProps(); //TAO 1 VUNG DE TU DNGHIA CAC THUOC TINH LE TE KHAC DE DE QLIIIII HON, chu cban thi may cai dong code van kha tuong tu v neu ko dua ve cung 1 vung qli th
    this.loadCurrentSong();


    this.renderPlaylist();
    this.playingSongInCenter();

    this.handleEvents();
  }
};

app.start();
