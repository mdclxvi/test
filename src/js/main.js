let wrap = document.querySelector('.wrap');
let elems = document.querySelectorAll('.el');
let counter = getComputedStyle(wrap).getPropertyValue('--count');
let btnPrev = document.querySelector('.prev');
let btnNext = document.querySelector('.next');

let wrapWidth = wrap.offsetWidth;
let totalCards = elems.length;

wrap.style.setProperty("--totalCards", elems.length);
wrap.style.setProperty("--wrapWidth", wrapWidth);

function btnClickHandler(event) {
    let target = event.target;
    target === btnNext ? counter =--counter : counter =++counter;
    wrap.style.setProperty("--count", counter);
    Math.abs(counter) === totalCards - 1
        ? btnNext.setAttribute("disabled", "disabled") : btnNext.removeAttribute("disabled");
    setDisabledPrevBtn();
}

function setDisabledPrevBtn() {
    counter == 0 ? btnPrev.setAttribute("disabled", "disabled") : btnPrev.removeAttribute("disabled");
}

btnPrev.addEventListener('click', btnClickHandler);
btnNext.addEventListener('click', btnClickHandler);
document.addEventListener("DOMContentLoaded", setDisabledPrevBtn);

