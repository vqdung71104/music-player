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
            name: 'Hãy trao cho anh',
            singer: 'Ngô Lan Hương, DJ Đại Mèo Remix feat Dũng Pogba',
            path: 'https://audio.jukehost.co.uk/w9zZ2tjKYafzPKW7Y9cZSZY8irVjzHtd',
            image: 'https://media.viez.vn/prod/2022/8/18/Thiet_ke_chua_co_ten_2022_08_18_T155545_036_328fb483f8.png'
        },
        {
            name: 'Dưới tòa sen vàng',
            singer: 'Sergio Ramos',
            path: 'https://audio.jukehost.co.uk/1W7MpbwTfePil97GDq5wPgtLgszaQOhK',
            image: 'data:image/jpeg;base64,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'
        },
        {
            name: 'Sài Gòn đau lòng quá',
            singer: 'Hứa Kim Tuyền ft Hoàng Duyên',
            path: 'https://audio.jukehost.co.uk/nV04looGzl8YznDjWkhxKVHXkDZVsQow',
            image: 'data:image/jpeg;base64,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'
        },
        {
            name: 'Thu cuối',
            singer: 'Yanbi, MrT, Hằng Bingbong',
            path: 'https://audio.jukehost.co.uk/9tvP2Js8f3fx2T8Y5Xied1MXoIWcI2Mt',
            image: 'https://i.ytimg.com/vi/QETfX44-PB8/maxresdefault.jpg'
        },    
        {            
            name: 'Ngày chưa giông bão',
            singer: 'Bùi Lan Hương',
            path: 'https://audio.jukehost.co.uk/YL3fNYuA1IMFbfVcQFBRZ3Jo7A12Wlpx',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq-TWQWeVXXBKBPYT_C3sM4UqIfY4ZI4pbxxS0D3cpYg&s'
        },
        {
            name: 'Lệ cay 1',
            singer: 'Du Thiên',
            path: 'https://audio.jukehost.co.uk/eEbDuJn8ORp9TdsQNfFLu5gdSg6y5PxN',
            image: 'https://i.ytimg.com/vi/cM1-sfNG_ww/sddefault.jpg'
        },        
        {
            name: 'Lệ cay 2',
            singer: 'Du Thiên',
            path: 'https://audio.jukehost.co.uk/QhiVuTjSlx2o82qCqrPDX3YpGpt2rWwF',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIKrAClRD7qFvFBWRCq3sQPw2n0sfefoPZNK7f3cwERQ&s'
        },    
        {
            name: 'Xóa hết',
            singer: 'Du Thiên',
            path: 'https://audio.jukehost.co.uk/uFIYZl6puNnnDc3S7g7jFl7ju2kFbej9',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmAr7viWxxmeK5QD6ST4Le6LfuZMfEnnOve6GlhM3jWw&s'
        },
        {
            name: 'Anh nhớ em Remix',
            singer: 'Tuấn Hưng',
            path: 'https://audio.jukehost.co.uk/wMyjQfd6xcQVBd9IeK4YGXR7l95STn50',
            image: 'https://i.ytimg.com/vi/A2xO45mI1cU/maxresdefault.jpg'
        },
        {
            name: 'Em của ngày hôm qua',
            singer: 'Sơn Tùng MTP',
            path: 'https://audio.jukehost.co.uk/Zm93wWdIsSijnCyyOX21agGkLFYrIVDu',
            image: 'https://thanhnien.mediacdn.vn/uploaded/trucdl/2021_02_23/sontungdaonhac3_PKLC.png?width=500'
        },
        {
            name: 'Chúng ta của hiện tại',
            singer: 'Sơn Tùng MTP',
            path: 'https://audio.jukehost.co.uk/ovAcXpxTXYbliYEZd3oVwtgxiXeuNqfm',
            image: 'https://cdn.eva.vn/upload/4-2020/images/2020-12-21/xon-xao-chung-ta-cua-hien-tai-cua-son-tung-m-tp-la-chuyen-that-ve-ho-tran-noi-tieng-sg-2-1608519939-876-width660height792.jpg'
        },
        {
            name: 'Chúng ta của tương lai',
            singer: 'Son Tung MTP',
            path: 'https://audio.jukehost.co.uk/0raZU98ZoZrTSZDtxrbVE2l2ouzfaOBX',
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
