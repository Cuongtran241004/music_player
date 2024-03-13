/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play/ pause/ seek
 * 4. CD rotate
 * 5. Next/ prev
 * 6. Random
 * 7. Next/ Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  song: [
    {
      name: "Bồng bềnh bồng bềnh",
      singer: "Nam Em",
      path: "assets/audio/BongBenhBongBenhTheHeroes2022-NamEm-8738686.mp3",
      image: "assets/img/bong-benh-bong-benh.jpg",
    },
    {
      name: "Việt Nam quê hương tôi",
      singer: "Quang Linh",
      path: "assets/audio/VietNamQueHuongToi-QuangLinh_a6zq.mp3",
      image: "assets/img/viet-nam-que-huong-toi.jpg",
    },

    {
      name: "Muộn rồi mà sao còn",
      singer: "Sơn Tùng MTP",
      path: "assets/audio/MuonRoiMaSaoCon-SonTungMTP-7011803.mp3",
      image: "assets/img/muon-roi-ma-sao-con.jpg",
    },
    {
      name: "Trống cơm",
      singer: "Dân ca",
      path: "assets/audio/TrongCom-DucThanh_t32n.mp3",
      image:
        "https://nld.mediacdn.vn/291774122806476800/2021/12/31/cover-ema-vu-cat-tuong-16409352045591704242503.jpg",
    },
    {
      name: "Thịnh vượng Việt Nam sáng ngời",
      singer: "Bùi Trường Linh",
      path: "assets/audio/ThinhVuongVietNamSangNgoi-buitruonglinh-11251299.mp3",
      image: "assets/img/thinh-vuong-viet-nam-sang-ngoi.jpg",
    },
    {
      name: "Có ai thương em như anh",
      singer: "Tóc Tiên",
      path: "assets/audio/CoAiThuongEmNhuAnhRapVersion-onday-8265661.mp3",
      image: "assets/img/co-ai-thuong-em-nhu-anh.jpg",
    },
    {
      name: "Quảng Bình quê ta ơi",
      singer: "Minh Thế",
      path: "assets/audio/QuangBinhQueTaOi-MinhThe-3244652.mp3",
      image: "assets/img/quang-binh-que-ta-oi.jpg",
    },
    {
      name: "Sứ Thanh Hoa",
      singer: "Nhạc Trung",
      path: "assets/audio/SuThanhHoa-ChauKietLuanJayChou-108110.mp3",
      image: "assets/img/su-thanh-hoa.jpg",
    },
    {
      name: "Muốn gặp em",
      singer: "Nhạc Trung",
      path: "assets/audio/MuonGapEmCover-TieuUcTinh-6267189.mp3",
      image: "assets/img/muon-gap-em.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.song.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>

                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>

                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.song[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay/ dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000, // 10 seconds
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop / 1.43;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      setTimeout(() => {
        cdThumbAnimate.play();
      }, 1000);
    };

    // Khi song được pause
    audio.onpause = function () {
      _this.isPlaying = false;
      cdThumbAnimate.pause();
      player.classList.remove("playing");
    };

    // khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua song
    progress.onchange = function (e) {
      const seekTime = Math.floor(audio.duration * (e.target.value / 100));
      audio.currentTime = seekTime;
    };

    // Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi previous song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.previousSong();
      }
      audio.play();
    };

    // Khi random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Khi song ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // khi repeat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // lắng nghe click vào playlist, click vào đâu cũng trúng bài hát
    playlist.onclick = function (e) {
      const songElement = e.target.closest(".song:not(.active)");
      // closest: click vào đâu trong song thì cũng phải play bài hát
      if (songElement || e.target.closest(".option")) {
        // xử lý khi click vào song
        if (e.target.closest(".song:not(.active)")) {
        }
        // lấy index từ dataset --> dạng String
        _this.currentIndex = Number(songElement.dataset.index);
        _this.loadCurrentSong();
        _this.render();
        audio.play();

        // xử lý khi click vào option
        if (e.target.closest(".option")) {
        }
        this.currentIndex = e.target.data - index;
      }
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    if (this.currentIndex == this.song.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
    // thay đổi bài hát hiện tại để render
    this.loadCurrentSong();
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  // view document about scrollIntoView
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },
  previousSong: function () {
    if (this.currentIndex == 0) {
      this.currentIndex = this.song.length;
    } else {
      this.currentIndex--;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.song.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // load cấu hình, giống như cookies
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe/ xử lý các sự kiện
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // render lại những config có sẵn
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};
app.start();
