let wrap = document.querySelector('.wrap');
let elems = document.querySelectorAll('.el');
let btnPrev = document.querySelector('.prev');
let btnNext = document.querySelector('.next');

let totalCards = elems.length;

let wrapWidth = wrap.offsetWidth;
let counter = getComputedStyle(wrap).getPropertyValue('--count');
let visibleCards = getComputedStyle(wrap).getPropertyValue('--visibleCards');
let fixedWidth = getComputedStyle(wrap).getPropertyValue('--fixedWidth');
let template = getComputedStyle(wrap).getPropertyValue('--template');



function setProperties() { 
    if (Math.abs(visibleCards) > 0) {
        wrap.style.setProperty('--template','var(--templateVisibleCards)');
        wrap.style.setProperty('--visibleCards', visibleCards);
        wrap.style.setProperty('--cardWidth', 'var(--visibleCardWidth)');
    } else {
        wrap.style.setProperty('--template', 'var(--templateFixedWidthCards)');
        wrap.style.setProperty('--cardWidth', fixedWidth+'px');
    }

    wrap.style.setProperty("--wrapWidth", wrapWidth);
    wrap.style.setProperty("--totalCards", elems.length);

}

function btnClickHandler(event) {
    let target = event.target;
    target === btnNext ? counter =--counter : counter =++counter;
    wrap.style.setProperty("--count", counter);
    setDisabledBtnNext(counter);
    setDisabledBtnPrev();
}

function setDisabledBtnNext(counter) {
    Math.abs(counter) === totalCards - 1 
    ? btnNext.setAttribute("disabled", "disabled") : btnNext.removeAttribute("disabled");
}

function setDisabledBtnPrev() {
    counter == 0 ? btnPrev.setAttribute("disabled", "disabled") : btnPrev.removeAttribute("disabled");
}

btnPrev.addEventListener('click', btnClickHandler);
btnNext.addEventListener('click', btnClickHandler);
document.addEventListener("DOMContentLoaded", setProperties);

