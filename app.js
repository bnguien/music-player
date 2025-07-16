/*  1. Render songs
    2. Scroll top 
    3. Play / pause / seek
    4. CD rotate
    5. Next / prev
    6. Random
    7. Next / repeat when ended
    8. Active song
    9. Scroll active song into view
    10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'BN_PLAYER';
const player = $('.player');
const heading = $('header h2');
const singer = $('header p');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const progress = $('#progress');
const progressBar = $('.progress-bar');
const playlist = $('.playlist');
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    playedSongs: [],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
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
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    render: function () {
        var html = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
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
        //Xử lý cd quay/ dừng 
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        //Xử lý phóng to/thu CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        //Xử lý khi bài hát được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        //Xử lý khi bài hát bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
                progressBar.style.width = `${progressPercent}%`;
                if (progressPercent === 100) {
                    _this.isPlaying = false;
                    player.classList.remove('playing');
                }
            }
        }

        //Xử lý khi tua bài hát
        progress.oninput = function (e) {
            const seekTime = audio.duration * e.target.value / 100;
            audio.currentTime = seekTime;
        }
        //Xử lý khi click next song
        nextBtn.onclick = function () { 
            if( _this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //Xử lý khi click prev song
        prevBtn.onclick = function (){
            if( _this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }   
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //Xử lý khi random song
        randomBtn.onclick = function(){
           _this.isRandom = !_this.isRandom;
           _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
            _this.scrollToActiveSong();
        }
        //Xử lý khi bài hát kết thúc
        audio.onended = function(){
           if(_this.isRepeat) {
                audio.play();
            }
            else{
                nextBtn.click();
            }
        }
        //Xử lý khi repeat được click
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        playlist.onclick = function (e) {
           const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                //Xử lý khi click vào bài hát
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                    _this.scrollToActiveSong();
                }
                //Xử lý khi click vào option
                if (e.target.closest('.option')) {
                    console.log('Option clicked');
                }
            }
        }
    },
    scrollToActiveSong: function () {
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 200)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        singer.textContent = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong : function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex=this.songs.length - 1;;
        }
        this.loadCurrentSong();
    },
    randomSong: function () {
        let newIndex;
        if(this.playedSongs.length >= this.songs.length-1) {
            this.playedSongs = [];
        }
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex || 
            this.playedSongs.includes(newIndex));
        this.playedSongs.push(newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    nextSongWhenEnded: function(){
        if (this.isRandom) {
            this.randomSong();
        } else {
            this.nextSong();
        }
    },
    start: function () {
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig();
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();
        //Lắng nghe và xử lý các sự kiện (DOM events)
        this.handleEvents();
        //Tải thông tin bài hát hiện tại vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        //Render playlist
        this.render();
        //Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}
app.start();