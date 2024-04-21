let items = document.querySelectorAll('.slider .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');

let active = 0;

function loadShow() {
    let stt = 0;
    items[active].style.transform = 'none'; // Add quotation marks around 'none'
    items[active].style.zIndex = 1;
    items[active].style.filter = 'none';
    items[active].style.opacity = 1;
    for (let i = active + 1; i < items.length; i++) {
        stt++;
        items[i].style.transform = `translateX(${120 * stt}px) scale(${1 - 0.2 * stt}) perspective(70px) rotateY(-1deg)`;
        items[i].style.zIndex = -stt;
        items[i].style.filter = 'blur(1px)';
        items[i].style.opacity = stt > 1 ? 0 : 0.6;
    }
    stt = 0;
    for (let i = active - 1; i >= 0; i--) {
        stt++;
        items[i].style.transform = `translateX(${-120 * stt}px) scale(${1 - 0.2 * stt}) perspective(70px) rotateY(1deg)`;
        items[i].style.zIndex = -stt;
        items[i].style.filter = 'blur(1px)';
        items[i].style.opacity = stt > 1 ? 0 : 0.6;
    }
}

loadShow();

next.onclick = function() {
    active = active + 1 < items.length ? active + 1 : active;
    loadShow();
}

prev.onclick = function() {
    active = active - 1 >= 0 ? active - 1 : active;
    loadShow();
}

document.getElementById('X').addEventListener('click',function(){
    window.location.replace('/content')
})

document.querySelectorAll('#quizbtn').forEach(quizbtn => {
    quizbtn.addEventListener('click', function() {
        const lessonName = encodeURIComponent(window.location.pathname.split('/').pop());
        window.location.href = `/quiz?lesson=${lessonName}`;
    });
});
