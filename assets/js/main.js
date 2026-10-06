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
    linkwork.forEach(item => {
        item.classList.remove('active-work')
        item.setAttribute('aria-pressed', 'false')
    })
    this.classList.add('active-work')
    this.setAttribute('aria-pressed', 'true')
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

        const sectionLink = document.querySelector(`.nav__menu a[href="#${sectionId}"]`)
        if (sectionLink) {
            sectionLink.classList.toggle('active-link', scrollY > sectionTop && scrollY <= sectionTop + sectionHeight)
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== LIGHT DARK THEME ===============*/
const themeButton = document.getElementById('theme-button')
const lightTheme = 'light-theme'
const paletteButton = document.getElementById('palette-button')
const themePanel = document.getElementById('theme-panel')
const paletteOptions = document.querySelectorAll('[data-palette]')

function applyPalette(palette) {
    document.body.dataset.theme = palette
    paletteOptions.forEach(option => {
        option.setAttribute('aria-pressed', String(option.dataset.palette === palette))
    })
}

function applyMode(isLight) {
    document.body.classList.toggle(lightTheme, isLight)
    themeButton.innerHTML = `<i class="bx ${isLight ? 'bx-moon' : 'bx-sun'}"></i>`
    const label = isLight ? 'Switch to dark mode' : 'Switch to light mode'
    themeButton.setAttribute('aria-label', label)
    themeButton.title = label
}

const savedPalette = localStorage.getItem('selected-palette')
applyPalette([...paletteOptions].some(option => option.dataset.palette === savedPalette) ? savedPalette : 'midnight')
applyMode(localStorage.getItem('selected-theme') === 'light')

themeButton.addEventListener('click', () => {
    const isLight = !document.body.classList.contains(lightTheme)
    applyMode(isLight)
    localStorage.setItem('selected-theme', isLight ? 'light' : 'dark')
})

function setPanelOpen(isOpen) {
    themePanel.hidden = !isOpen
    paletteButton.setAttribute('aria-expanded', String(isOpen))
    if (isOpen) {
        themePanel.querySelector('[aria-pressed="true"]').focus()
    } else {
        paletteButton.focus()
    }
}

paletteButton.addEventListener('click', () => setPanelOpen(themePanel.hidden))
document.getElementById('theme-close').addEventListener('click', () => setPanelOpen(false))
paletteOptions.forEach(option => {
    option.addEventListener('click', () => {
        applyPalette(option.dataset.palette)
        localStorage.setItem('selected-palette', option.dataset.palette)
    })
})
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !themePanel.hidden) setPanelOpen(false)
})
document.addEventListener('click', event => {
    if (!themePanel.hidden && !themePanel.contains(event.target) && !paletteButton.contains(event.target)) setPanelOpen(false)
})

document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.rel = 'noopener noreferrer'
})
document.querySelectorAll('.home__social-link, .footer__social-link').forEach(link => {
    const icon = link.querySelector('i').className
    const platform = /bxl-([a-z]+)/.exec(icon)[1]
    const label = platform[0].toUpperCase() + platform.slice(1)
    link.setAttribute('aria-label', label)
    link.title = label
})

document.getElementById('contact-form').addEventListener('submit', event => {
    event.preventDefault()
    const form = event.currentTarget
    const name = form.elements.namedItem('name').value
    const email = form.elements.namedItem('email').value
    const project = form.elements.namedItem('project').value
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`)
    const message = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${project}`)
    window.location.href = `mailto:rachanapriyadarshnisamal@gmail.com?subject=${subject}&body=${message}`
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
sr.reveal(`.home__social, .home__scroll`, { delay: 900, origin: 'bottom' })
