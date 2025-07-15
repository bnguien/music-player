const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const app = {
    currentIndex: 0,
    isPlaying: false,
    songs: [
        {
            name: "BIRDS OF A FEATHER",
            singer: "Billie Eilish",
            path: "./assets/music/birds-of-a-feather.mp3",
            image: "./assets/img/cd-cover.jpg"
        },
        {
            name: "Open Arms",
            singer: "SZA",
            path: "./assets/music/open-arms.mp3",
            image: "./assets/img/1.jpg"
        },
        {
            name: "Toxic Till The End",
            singer: "Rosé",
            path: "./assets/music/toxic-till-the-end.mp3",
            image: "./assets/img/2.jpg"
        },
        {
            name: "Whiplash",
            singer: "aespa",
            path: "./assets/music/whiplash.mp3",
            image: "./assets/img/3.jpg"
        },
        {
            name: "Don't Go",
            singer: "EXO",
            path: "./assets/music/dont-go.mp3",
            image: "./assets/img/4.jpg"
        },
        {
            name: "8 letters",
            singer: "Why Don't We",
            path: "./assets/music/8-letters.mp3",
            image: "./assets/img/5.jpg"
        },
        {
            name: "No. 1 Party Anthem",
            singer: "Arctic Monkeys",
            path: "./assets/music/no1-party-anthem.mp3",
            image: "./assets/img/6.jpg"
        },
        {
            name: "supernatural",
            singer: "Ariana Grande",
            path: "./assets/music/supernatural.mp3",
            image: "./assets/img/7.jpg"
        }
    ],
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    render: function () {
        var html = this.songs.map(song => {
            return `
            <div class="song">
                    <div class="thumb" style="background-image: url('${song.image}');"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = html.join('');

    },
    handleEvents: function () {
        const cdWidth = cd.offsetWidth;
        const _this = this;
        //Xử lý phóng to/thu CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //Xử lý khi click play
        playBtn.onclick = function () {
           if( _this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        //Xử lý khi bài hát được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
        }
        //Xử lý khi bài hát bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
        }
        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
           if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
                  document.querySelector('.progress-bar').style.width = `${progressPercent}%`;
                  if(progressPercent === 100) {
                    _this.isPlaying = false;
                    player.classList.remove('playing');
                  }
            }
        }
        //Xử lý khi tua bài hát
        progress.onchange = function (e) {
            const seekTime = audio.duration * e.target.value / 100;
            audio.currentTime = seekTime;
        }
        //Xử lý cd quay
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    start: function () {
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();
        //Lắng nghe và xử lý các sự kiện (DOM events)
        this.handleEvents();
        //Tải thông tin bài hát hiện tại vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        //Render playlist
        this.render();
    }
}
app.start();