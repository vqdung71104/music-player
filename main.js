const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'MY_PLAYER';
const heading = $('header h2');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const rdBtn = $('.btn-random');
const faceBtn = $('.btn-face');
const player = $('.player');
const progres = $('#progress');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');
const volBtn = $('.btn-volume');
const volBar = $('.volume-bar');
const iconMute = $('.icon-mute');
const iconUnmute = $('.icon-unmute');
const bgColor = $('.dashboard');
const lists = {    
    currIndex: 0,
    currVol: 1,
    lockVol: 1,
    isPlaying: false,
    isRandom: false,
    isRepeat:false,
    isFace: false, 
    configs: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    //Data-Songs    
    songs: [
        {
            name: '500 Miles',
            singer: 'Justin Timberlake',
            path: 'https://audio.jukehost.co.uk/60r5S2rNFQpCSnKirIGNlzveSs6klXAv',
            image: 'https://i1.sndcdn.com/artworks-000112928659-83o8mj-t500x500.jpg'
        },
        {
            name: 'Tiễn Em Lần Cuối',
            singer: 'Trung Hành',
            path: 'https://audio.jukehost.co.uk/aLNQRm4NYccoi6rXztg3ED2IiBBq7W5d',
            image: 'https://avatar-ex-swe.nixcdn.com/singer/avatar/2014/03/31/3/9/8/6/1396249140056_600.jpg'
        },
        {
            name: 'LK Người Tình Ngàn Dặm',
            singer: 'Ngọc Lan Trang',
            path: 'https://audio.jukehost.co.uk/LIAT2DoIiPbvxadiX6CdtPeuh8mWk7Ol',
            image: 'https://images2.thanhnien.vn/zoom/700_438/528068263637045248/2023/7/9/ngoc-lan-trang-1688897249072488991546-216-0-1069-1364-crop-1688897495755158013134.jpeg'
        },
        {            
            name: 'Self Control',
            singer: 'Laura Branigan',
            path: 'https://audio.jukehost.co.uk/QdT6rBnVGgliy48Hw6u8UrjgyNkHzUgo',
            image: 'https://www.djprince.no/covers/laura.jpg'
        },
        {
            name: 'Cheri Cheri Lady',
            singer: 'Modern Talking',
            path: 'https://audio.jukehost.co.uk/G3UvJpmWYX90v2YJaZvAnk7AvFxv7576',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/c/a/b/5/cab58a4408a7c356d5db85b1fa31487f.jpg'
        },        
        {
            name: 'Brother Louie',
            singer: 'Modern Talking',
            path: 'https://audio.jukehost.co.uk/nl1jkex593GkE0fhRh1BkJqaexRBmmER',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/c/a/b/5/cab58a4408a7c356d5db85b1fa31487f.jpg'
        },    
        {
            name: 'You are My Heart, You are My Soul',
            singer: 'Modern Talking',
            path: 'https://audio.jukehost.co.uk/Ov9BVMZmWRW8Vs54pZZqf48baFBvhdmt',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/c/a/b/5/cab58a4408a7c356d5db85b1fa31487f.jpg'
        },
        {
            name: 'Chung ta cua tuong lai',
            singer: 'Son Tung MTP',
            path: 'C:\Users\Admin\Downloads\son-tung-m-tp-chung-ta-cua-tuong-lai-official-music-video-(mp3convert.org).mp3',
            image: 'https://2sao.vietnamnetjsc.vn/images/2024/03/08/08/39/son-tung-8.jpg',
        }
    ],
    setconfigs: function(key, value) {
        //Configs
        this.configs[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.configs));
    },
    render: function() {
        //Playlist-Render
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url(${song.image});"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        playList.innerHTML = htmls.join('');
    }, 
    defineProperties: function() {
        //Define-CurrSong
        Object.defineProperty(this, 'currSong', {
            get: function() {
                return this.songs[this.currIndex];
            }
        })
    },
    handleEvents: function() {  
        const _this = this;  
        //CD-Efect
        const cdAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}//Efect-Style
        ], {
            duration: 10000,//Time-Rotete
            iterations: Infinity,//Loop
        });
        cdAnimate.pause();
        //CD-Zoom
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {                    
            const scrolls = window.scrollY || document.documentElement.scrollTop;                    
            const newCdWidth = cdWidth - scrolls;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //Play-Pause
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        //Play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdAnimate.play();
        }
        //Pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdAnimate.pause();
        }
        //Time-Playing
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progresPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progres.value = progresPercent;
            }
        }
        //Change-Time
        progres.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        //Next
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.rdSong();
            } else {
                _this.nextSong();
            }
            audio.play();            
            _this.scrollAcriveSong();
        }
        //Prev
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.rdSong();
            } else {
                _this.prevSong();
            }
            audio.play();            
            _this.scrollAcriveSong();
        }
        //Random
        rdBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setconfigs('isRandom', _this.isRandom);
            rdBtn.classList.toggle('active', _this.isRandom);            
        }
        //Repeat
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setconfigs('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        //Ended-Audio
        audio.onended = function() { 
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }        
        //Playlist-Clicked
        playList.onclick = function(e) {
            const activeSong = e.target.closest('.song:not(.active)');
            const optionSong = e.target.closest('.option');
            if(activeSong || optionSong) {
                if(activeSong) {
                    _this.currIndex = Number(activeSong.dataset.index);
                    $('.song.active').classList.remove('active');
                    $$('.song')[_this.currIndex].classList.add('active');
                    _this.loadCurrSong();
                    audio.play();                    
                }
            }
        }
        //Volume-Bar       
        volBar.oninput = e => {
            this.setconfigs("currVol", e.target.value);
            audio.volume = volBar.value;            
        }
        //Check-Volume
        if(_this.currVol > 0) {
            volBar.value = _this.currVol;
            audio.volume = _this.currVol;
            iconUnmute.style.visibility = 'visible';
            iconMute.style.visibility = 'hidden';
        } else {
            volBar.value = 0
            audio.volume = 0
            iconUnmute.style.visibility = 'hidden';
            iconMute.style.visibility = 'visible';
        }
        //Change-Volume
        audio.onvolumechange = () => {            
            volBar.value = audio.volume
            if(audio.volume === 0) {
                iconMute.style.visibility = 'visible';
                iconUnmute.style.visibility = 'hidden';
            } else {
                iconMute.style.visibility = 'hidden';
                iconUnmute.style.visibility = 'visible';
            }
        }
        //Unmute-Volume
        iconUnmute.onclick = (e) => {
            this.setconfigs("lockVol", audio.volume);
            audio.volume = 0;
            this.setconfigs("currVol", audio.volume);
        }
        //Mute-Volume
        iconMute.onclick = (e) => {
            audio.volume = this.configs.lockVol;
            this.setconfigs("currVol", audio.volume);
        }
        //Background-Thame        
        faceBtn.onclick = function() {
            const songs = $$('.song');
            this.isFace = !this.isFace;            
            if(this.isFace) {
                bgColor.classList.add('bg'); 
                heading.style.color = 'white';                
                songs.forEach(function(song) {
                    songs.forEach(function(item) {
                        item.classList.add('bg');                        
                    });
                    song.querySelector('h3').style.color = 'rgba(255, 255, 255, 0.7)';
                });
            } else {
                bgColor.classList.remove('bg');
                heading.style.color = '';
                songs.forEach(function(song) {
                    songs.forEach(function(item) {
                        item.classList.remove('bg');
                    });
                    song.querySelector('h3').style.color = '';
                });
            }
            faceBtn.classList.toggle('active', this.isFace);
        }
    },
    loadCurrSong: function() {
        heading.textContent = this.currSong.name;
        cdThumb.style.backgroundImage = `url('${this.currSong.image}')`;
        audio.src = this.currSong.path;
    },    
    nextSong: function() {
        this.currIndex++;
        if(this.currIndex >= this.songs.length) {
            this.currIndex = 0;
        }
        //Active-Song
        $('.song.active').classList.remove('active');
        $$('.song')[this.currIndex].classList.add('active');
        this.loadCurrSong();
    },
    prevSong: function() {
        this.currIndex--;
        if(this.currIndex < 0) {
            this.currIndex = this.songs.length - 1;
        }
        //Active-Song
        $('.song.active').classList.remove('active');
        $$('.song')[this.currIndex].classList.add('active');
        this.loadCurrSong();
    },
    rdSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currIndex);
        this.currIndex = newIndex;
        //Active-Song
        $('.song.active').classList.remove('active');
        $$('.song')[this.currIndex].classList.add('active');
        this.loadCurrSong();
    },
    scrollAcriveSong: function() {
        //Scroll-Frist/Last-Playlist
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 300)
    },
    loadConfig: function() {
        //load-configs
        this.isRandom = this.configs.isRandom;
        this.isRepeat = this.configs.isRepeat;             
    },
    start: function() {
        this.loadConfig();//Load Config to Obj
        this.defineProperties();//Define Attr for Obj
        this.handleEvents();//Listen or Handle DOM Events
        this.loadCurrSong();//Upload Info First Song to UI
        this.render();//Render Playlist
        rdBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);         
    }
}
lists.start();
