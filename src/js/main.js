const wrap = document.querySelector('.wrap');
const elems = document.querySelectorAll('.el');
const btnPrev = document.querySelector('.prev');
const btnNext = document.querySelector('.next');

let totalCards = elems.length;

let wrapStyles = getComputedStyle(wrap);

let wrapWidth = wrap.offsetWidth;
let increment = Math.abs(wrapStyles.getPropertyValue('--count'));
let visibleCards = Math.abs(wrapStyles.getPropertyValue('--visibleCards'));
let fixedWidth = wrapStyles.getPropertyValue('--fixedWidth');
let cardWidth = wrapStyles.getPropertyValue('--cardWidth');
let template = wrapStyles.getPropertyValue('--template');

function setProperties() { 
  if (visibleCards > 0) {
    wrap.style.setProperty('--template','var(--templateVisibleCards)');
    wrap.style.setProperty('--visibleCards', visibleCards);
    wrap.style.setProperty('--cardWidth', 'var(--visibleCardWidth)');
  } 
  else {
    wrap.style.setProperty('--template', 'var(--templateFixedWidthCards)');
    wrap.style.setProperty('--cardWidth', fixedWidth+'px');
  }

  wrap.style.setProperty("--wrapWidth", wrapWidth);
  wrap.style.setProperty("--totalCards", elems.length);
  setDisabledBtnPrev();
}

function btnClickHandler(event) {
  let target = event.target;
  target === btnNext ? --increment : ++increment;
  wrap.style.setProperty("--count", increment);
  setDisabledBtnNext(increment);
  setDisabledBtnPrev();
}

function setDisabledBtnNext(counter) {
  let maxSlide = totalCards - (visibleCards ? visibleCards : 2);
  Math.abs(counter) === maxSlide 
  ? btnNext.setAttribute("disabled", "disabled") : btnNext.removeAttribute("disabled");
}

function setDisabledBtnPrev() {
  increment == 0 ? btnPrev.setAttribute("disabled", "disabled") : btnPrev.removeAttribute("disabled");
}

let isDown = false;
let startX;
let scrollLeft;

wrap.addEventListener('mousedown', (e) => {
  isDown = true;
  wrap.classList.add('active');
  startX = e.pageX - wrap.offsetLeft;
  scrollLeft = wrap.scrollLeft;
});
wrap.addEventListener('mouseleave', () => {
  isDown = false;
  wrap.classList.remove('active');
});
wrap.addEventListener('mouseup', () => {
  isDown = false;
  wrap.classList.remove('active');
  if (startX > cardWidth) increment =--increment;
  if (startX < cardWidth) increment =++increment;
});
wrap.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - wrap.offsetLeft;
  const walk = (x - startX) * 1; //scroll-fast
  wrap.scrollLeft = scrollLeft - walk;

  console.log(walk);
});





// elems.forEach(el => el.addEventListener('mousedown', function(event) {
    
//   let shift = event.clientX - el.getBoundingClientRect().left;
  
//   document.addEventListener('mousemove', move);
//   document.addEventListener('mouseup', up);
  
//   function move(event) {
//     let left = event.clientX - el.getBoundingClientRect().left - shift;
    
//     if (left < el.offsetWidth) increment =--increment;
//     if (left > el.offsetWidth) increment=++increment;
    
//     el.style.transform = 'translateX(' + left + 'px)';
//   }
    
//   function up() {
//     document.removeEventListener('mousemove', move);
//     document.removeEventListener('mouseup', up);
//   }
// }))






btnPrev.addEventListener('click', btnClickHandler);
btnNext.addEventListener('click', btnClickHandler);
document.addEventListener("DOMContentLoaded", setProperties);

