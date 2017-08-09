//基本常用函数的定义和分类

//定义简易log,用于测试bug
var log = console.log.bind(console)

// 合并dqs和dqsa，按需返回
var dqs = function(selector) {
    var len = document.querySelectorAll(selector).length
    if (len > 1) {
        return document.querySelectorAll(selector)
    }
    return document.querySelector(selector)
}

//定义切换样式函数
var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

// 对一些number 补零
var addZero = function (arg) {
    if (arg >= 0 && arg < 10) {
        arg = '0' + arg
    }
    return arg
}

// 把秒153.54转换成时间格式02:33
var transTime = function(time) {
    var minute = addZero(parseInt(time / 60))
    var second = addZero(parseInt(time % 60))
    var t = `${minute}:${second}`
         return t
}

// 在该元素的最后添加子元素
var appendHtml = function(element, html) {
    element.insertAdjacentHTML('beforeend', html)
}

// 定义find 函数查找 element 的所有子元素
var findElement = function(element, selector) {
    var len = element.querySelectorAll(selector).length
    if (len > 1) {
        return element.querySelectorAll(selector)
    }
    return element.querySelector(selector)
}

// 单个事件绑定
var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}
// 多个事件绑定
var bindEventAll = function(selector, eventName, callback) {
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.addEventListener(eventName, callback)
    }
}


//如下定义实际应用函数

var songArtist = dqs('.song-artist')
var musicCover = dqs('.music-cover')
var informationAuthor = dqs('.information-author')
var informationName = dqs('.information-name')
var music = dqs('#id-music-playing')
var songName = dqs('.song-name')
var platePast = dqs('.plate-past')
var plateNow = dqs('.plate-now')
var plateNext = dqs('.plate-next')
var currentTime = dqs('#id-current-time')
var playedBar = dqs('#id-played-bar')
var musicBar = dqs('#id-music-bar')
var nextIcon = dqs('#id-icon-play-forward')

// 定义音乐查找函数,并切换封面
var findMusic = function (){
    for (var i = 0; i < songName.length; i++){
        var currentMusicIndex = 0
        var a = informationName.innerText
        var b = songName[i].innerText
        if (b == a){
            var currentMusicIndex = i % songName.length
            var pastMusicIndex = (currentMusicIndex - 1 + songName.length) % songName.length
            var nextMusicIndex = (currentMusicIndex + 1) % songName.length
            var pastMusicName = songName[pastMusicIndex].innerText
            var nextMusicName = songName[nextMusicIndex].innerText
            var nowMusicName = songName[currentMusicIndex].innerText
            var nowAuthorName = songArtist[currentMusicIndex].innerText
            var song = "music\\" + nowMusicName + '.mp3'
            var cover = "cover\\" + nowMusicName + '.jpg'
            var pastCover = "cover\\" + pastMusicName + '.jpg'
            var NextCover = "cover\\" + nextMusicName + '.jpg'
            informationName.innerText = nowMusicName
            informationAuthor.innerText = nowAuthorName
            platePast.src = pastCover
            plateNow.src = cover
            plateNext.src = NextCover
            musicCover.src = cover
            music.src = song
            break
        }
    }
}

//定义下一首函数
var playNext = function() {
    for (var i = 0; i < songName.length; i++){
        var a = informationName.innerText
        var b = songName[i].innerText
        if (a == b){
            // 在此处设置播放结束后下一曲的序号
            var orderLoop = (i + 1) % songName.length
            var f = songName[orderLoop].innerText
            var song = "music\\" + f + '.mp3'
            var cover = "cover\\" + f + '.jpg'
            informationName.innerText = f
            musicCover.src = cover
            music.src = song
            findMusic()
            musicPlay()
        }
    }
}

// 定义音乐播放函数
var playIcon = dqs('#id-icon-play')
var musicPlay = function(){
    music.play()
    playIcon.classList.add('hidden')
    pauseIcon.classList.remove('hidden')
    musicCover.classList.add('rotated')
}
// 定义音乐暂停函数
var pauseIcon = dqs('#id-icon-pause')
var musicPause = function() {
    music.pause()
    playIcon.classList.remove('hidden')
    pauseIcon.classList.add('hidden')
    musicCover.classList.remove('rotated')
}

//定义音乐搜索显示样式
var playLists = dqs('.play-list-song')
var listSearch = dqs('.list-search')
var searchTitle = function(v) {
    for (var i = 0; i < playLists.length; i++) {
        playLists[i].classList.add('hidden')
    }
    for (var i = 0; i < songName.length; i++) {
        var a = songName[i]
         var t = a.getAttribute('data-name')
        if (t.includes(v)){
            var parentClass = a.parentElement
            parentClass.classList.toggle('hidden')
        }
    }
}

//所有歌曲加上普通样式
var likeToggles = function() {
        var likesIcon = `
            <td class='likes'>
                <img src="icon\\like.png" class="icon-like hidden">
                <img src="icon\\unlike.png" class="icon-unlike">
            </td>
           `
            for (var i = 0; i < playLists.length; i++){
                playLists[i].insertAdjacentHTML('afterbegin', likesIcon)
            }
}
//点击喜欢歌曲切换样式
var addlikeToggle = function () {
    var targetParent = event.target.parentElement
    if (targetParent.classList.contains('likes')) {
        var likeIcon = findElement(targetParent, '.icon-like')
        var unlikeIcon = findElement(targetParent, '.icon-unlike')
        toggleClass(likeIcon, 'hidden')
        toggleClass(unlikeIcon, 'hidden')
    }
}

// 设置播放进度条
var controlBar = function () {
    var target = event.target
    var musicBarWidth = target.clientWidth
    var newCurrentTime = (event.offsetX / musicBarWidth) * music.duration
    music.currentTime = newCurrentTime
    var playedBarWidth = (music.currentTime / music.duration) * musicBarWidth
    playedBar.style.width = playedBarWidth + 'px'
    console.log(playedBar.style.width);
}

// 定义切歌函数，找出当前music.src的值
var changeMusic = function (direct){
    if (music.attributes["src"] == undefined){
        var currentSrcIndex = 0
    } else {
        for (var i = 0; i < songName.length; i++){
            var b = informationName.innerText
            var c = songName[i].innerText
            if (c == b){
                var currentSrcIndex = i % songName.length
                break
                }
            }
        }
    if (direct === 'next'){
        var currentSrcIndex = (currentSrcIndex + 1) % songName.length
    } else {
        var currentSrcIndex = (currentSrcIndex -1 + songName.length * 100) % songName.length
    }
    var f = songName[currentSrcIndex].innerText
    var song = "music\\" + f + '.mp3'
    var cover = "cover\\" + f + '.jpg'
    informationName.innerText = f
    musicCover.src = cover
    music.src = song
    findMusic()
    musicPlay()
}


//给所有功能绑定事件
var bindEvents = function () {
    music.volume = 1   //设定初始播放音量
    playIcon.addEventListener('click', musicPlay)    // 音乐播放、暂停
    pauseIcon.addEventListener('click', musicPause)  // 暂停
    // music 载入音乐需要时间, 载入完成后会触发 'canplay' 事件
    var totalTime = dqs('#id-total-time')
    music.addEventListener('canplay', function(){
        totalTime.innerHTML = transTime(music.duration)

    })
    music.addEventListener('timeupdate', function(){
        currentTime.innerHTML = transTime(music.currentTime)
    })
    //播放结束，自动下一曲
    music.addEventListener('ended', function () {
        playNext()
    })
    // 下一曲
    var nextpaly = dqs('#id-icon-play-forward')
    nextpaly.addEventListener('click', function (){
        changeMusic('next')
    })
    // 上一曲
    var Previous = dqs('#id-icon-play-back')
    Previous.addEventListener('click', function (){
        changeMusic('pre')
    })
    // 点击歌曲列表，同意可切歌
    var playList = dqs('.play-list')
    playList.addEventListener('click', function(event){
        var target = event.target
        if (target.classList.contains('song-name')){
            var song = "music\\" + target.innerText + '.mp3'
            var cover = "cover\\" + target.innerText + '.jpg'
            informationName.innerText = target.innerText
            musicCover.src = cover
            music.src = song
            findMusic()
            musicPlay()
        }
    })
    //音量控制
    var volumeup = dqs('#id-icon-volume-up')
    var volumedown = dqs('#id-icon-volume-down')
    volumeup.addEventListener('click',function(event){
        music.volume+=0.1
    })
    volumedown.addEventListener('click',function(event){
        music.volume-=0.1
    })
    // 歌曲搜索功能
    listSearch.addEventListener('keyup', function(event){
        var search = event.target
        var v = search.value
        searchTitle(v)
    })
    // 列表循环
    var listCircleIcon = dqs('#id-icon-listcircle')
    listCircleIcon.addEventListener('click', function(){
        singleCircleIcon.classList.remove('hidden')
        listCircleIcon.classList.add('hidden')
        music.loop = true
    })
    //单曲循环
    var singleCircleIcon = dqs('#id-icon-singlecircle')
    singleCircleIcon.addEventListener('click', function(){
        singleCircleIcon.classList.add('hidden')
        listCircleIcon.classList.remove('hidden')
        music.loop = false
    })
    // 点击进度条，播放可随动
    musicBar.addEventListener('click', function () {
        controlBar()
    })
    playedBar.addEventListener('click', function (){
        controlBar()
    })
    // 播放进度实时更新
     setInterval(function updatePlayedBar() {
        var musicBarWidth = musicBar.clientWidth
        var playedBarWidth = (music.currentTime / music.duration) * musicBarWidth
        playedBar.style.width = playedBarWidth + 'px'
        currentTime.innerHTML = transTime(music.currentTime)
        //如果是时间结束，并且是非单曲循环，自动下一曲
        if (music.currentTime === music.duration && !music.loop){
            nextIcon.click()
        }
    }, 1000)

    //添加喜欢歌曲，点击切换样式
    likeToggles()
    bindEventAll('.play-list', 'click', function () {
        addlikeToggle()
    })
}

bindEvents()
