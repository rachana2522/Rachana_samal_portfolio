/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader() {
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    if (this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*=============== SERVICES MODAL ===============*/
const modalViews = document.querySelectorAll('.services__modal'),
    modalBtns = document.querySelectorAll('.services__button'),
    modalClose = document.querySelectorAll('.services__modal-close')

let modal = function (modalClick) {
    modalViews[modalClick].classList.add('active-modal')
}

modalBtns.forEach((mb, i) => {
    mb.addEventListener('click', () => {
        modal(i);
    })
})

modalClose.forEach((mc) => {
    mc.addEventListener('click', () => {
        modalViews.forEach((mv) => {
            mv.classList.remove('active-modal')
        })
    })
})

/*=============== MIXITUP FILTER PORTFOLIO ===============*/
let mixerPortfolio = mixitup('.work__container', {
    selectors: {
        target: '.work__card'
    },
    animation: {
        duration: 300
    }
});

/* Link active work */
const linkwork = document.querySelectorAll('.work__item')

function activeWork() {
    linkwork.forEach(i => i.classList.remove('active-work'))
    this.classList.add('active-work')
}

linkwork.forEach(i => i.addEventListener('click', activeWork))

/*=============== SWIPER TESTIMONIAL ===============*/
let swiperTestimonial = new Swiper(".testimonial__container", {
    spaceBetween: 24,
    loop: true,
    grabCursor: true,

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        576: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 48,
        },
    },
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id')

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        } else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== LIGHT DARK THEME ===============*/
const themeButton = document.getElementById('theme-button')
const lightTheme = 'light-theme'

// Validate that the button exists
if (!themeButton) {
    console.error('Theme button not found!')
} else {
    console.log('Theme button found:', themeButton)
}

// Previously selected theme (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// Apply saved theme on page load
if (selectedTheme) {
    if (selectedTheme === 'light') {
        document.body.classList.add(lightTheme)
        themeButton.classList.remove('bx-moon')
        themeButton.classList.add('bx-sun')
    } else {
        document.body.classList.remove(lightTheme)
        themeButton.classList.add('bx-moon')
        themeButton.classList.remove('bx-sun')
    }
}

// Toggle theme on button click
themeButton.addEventListener('click', () => {
    // Toggle light theme class
    document.body.classList.toggle(lightTheme)
    
    // Toggle icon
    if (themeButton.classList.contains('bx-moon')) {
        themeButton.classList.remove('bx-moon')
        themeButton.classList.add('bx-sun')
    } else {
        themeButton.classList.remove('bx-sun')
        themeButton.classList.add('bx-moon')
    }
    
    // Save preference
    const isLight = document.body.classList.contains(lightTheme)
    localStorage.setItem('selected-theme', isLight ? 'light' : 'dark')
    localStorage.setItem('selected-icon', themeButton.classList.contains('bx-sun') ? 'bx-sun' : 'bx-moon')
    
    console.log('Theme toggled. Light theme:', isLight)
})

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    //reset: true
})

sr.reveal(`.home__data`)
sr.reveal(`.home__handle`, { delay: 700 })
sr.reveal(`.home__social, .home__scroll`, { delay: 900, origin: 'botton' })
