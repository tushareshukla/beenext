let lastScrollY = window.scrollY;

// console.log('lastScrollY', lastScrollY);

window.addEventListener('scroll', () => {
  const header = document.querySelector('.mainHeader');

  if (window.scrollY > lastScrollY) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }

  lastScrollY = window.scrollY;
});

function qs(selector, all = false) {
  return all
    ? document.querySelectorAll(selector)
    : document.querySelector(selector);
}

// ===============
function smoothScroll(targetId, duration) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top;
  const startPosition = window.pageYOffset;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, targetPosition, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

document.querySelector('.skipButton').addEventListener('click', function () {
  smoothScroll('ourPurposemainId');
});

function smoothScroll(targetId) {
  const targetElement = document.getElementById(targetId);
  const headerHeight = document.querySelector('.mainHeader').offsetHeight; // Get the header height
  const remOffset =
    parseFloat(getComputedStyle(document.documentElement).fontSize) * 4;

  const targetPosition =
    targetElement.getBoundingClientRect().top +
    window.pageYOffset -
    headerHeight -
    remOffset;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const skipButton = document.querySelector('.skipButton');
  const section = document.querySelector('.ourjourneySectionMain');
  const offsetTop =
    4 * parseFloat(getComputedStyle(document.documentElement).fontSize);
  const offsetBottom =
    4 * parseFloat(getComputedStyle(document.documentElement).fontSize);

  function checkScroll() {
    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top + window.pageYOffset;
    const sectionBottom = sectionTop + sectionRect.height;

    const scrollTop = window.pageYOffset;
    const scrollBottom = scrollTop + window.innerHeight;

    if (
      scrollTop + offsetTop > sectionTop &&
      scrollBottom < sectionBottom - offsetBottom
    ) {
      skipButton.style.display = 'flex';
    } else {
      skipButton.style.display = 'none';
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check
});

// ================= TIme Line ==================

const sections = qs('.section', true);
const timeline = qs('.timeline');
const line = qs('.line');
line.style.bottom = `calc(100% - 20px)`;
let prevScrollY = window.scrollY;
let up, down;
let full = false;
let set = 0;
const targetY = window.innerHeight * 0.8;

// function scrollHandler(e) {
//   const { scrollY } = window;
//   up = scrollY < prevScrollY;
//   down = !up;
//   const timelineRect = timeline.getBoundingClientRect();
//   const lineRect = line.getBoundingClientRect(); //CONST LINEHEIGHT = lineRect.bottom - lineRect.top

//   const dist = targetY - timelineRect.top;
//   // console.log(dist);

//   if (down && !full) {
//     set = Math.max(set, dist);
//     line.style.bottom = `calc(100% - ${set}px)`;
//   }

//   if (dist > timeline.offsetHeight + 50 && !full) {
//     full = true;
//     line.style.bottom = `-50px`;
//   }

//   sections.forEach((item) => {
//     //console.log(items);
//     const rect = item.getBoundingClientRect();

//     if (rect.top + item.offsetHeight / 5 < targetY) {
//       item.classList.add('show-me');
//     }
//   });

//   prevScrollY = window.scrollY;
// }

function scrollHandler(e) {
  const { scrollY } = window;
  const up = scrollY < prevScrollY;
  const down = !up;
  const timelineRect = timeline.getBoundingClientRect();
  const dist = targetY - timelineRect.top;

  if (scrollY === 0) {
    set = 0;
    line.style.bottom = `calc(100% - 20px)`;
    full = false;
  } else if (full && up) {
    const initialDist = targetY - timelineRect.top;
    set = Math.max(0, initialDist);
    full = false;
    line.style.bottom = `calc(100% - ${set}px)`;
  } else if (down && !full) {
    set = Math.max(set, dist);
    line.style.bottom = `calc(100% - ${set}px)`;
  } else if (up) {
    set = Math.min(set, dist);
    line.style.bottom = `calc(100% - ${set}px)`;
  }

  if (dist > timeline.offsetHeight + 50 && !full) {
    full = true;
    line.style.bottom = `-50px`;
  } else if (dist <= 0 && full) {
    full = false;
    line.style.bottom = `calc(100% - 20px)`;
  }

  sections.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const content = item.querySelector('.content');
    // console.log('content', content);
    const beadYear = item.querySelector('.beadYear');

    if (rect.top + item.offsetHeight / 1 < targetY) {
      item.classList.add('show-me');
      content.classList.add('active-content');
      beadYear.classList.add('active-year');

      sections.forEach((otherItem, otherIndex) => {
        if (otherIndex !== index) {
          otherItem
            .querySelector('.content')
            .classList.remove('active-content');
          otherItem.querySelector('.beadYear').classList.remove('active-year');
        }
      });
    } else if (rect.top > targetY) {
      item.classList.remove('show-me');
    }
  });

  prevScrollY = window.scrollY;
}

scrollHandler();
line.style.display = 'block';
window.addEventListener('scroll', scrollHandler);

// =====================================
