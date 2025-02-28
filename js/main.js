/*-----------------| ROOT CONSTANTS |--------------------------------------------------------------------*/
//  Highest Priority IDs
const ROOT = document.documentElement
const CONTEXT = document.getElementById('context') // Bar at the top that displays hover context

const WRAPPER = document.getElementById('wrapper') // Wrapper of everything but header info

//  Control Panel
const VOLUME_SLIDER = document.getElementById('volume_slider')

const CRT_TOGGLE = document.getElementById('crt_toggle')
const CRT_TOGGLE_ICON = document.getElementById('crt_toggle_icon')

//  Navbar
const NAVBAR_ICON = document.getElementById('navbar_icon')
const EXTERNAL_BUTTON_CONTAINER = document.getElementById('button_scroller')
const EXTERNAL_BUTTON_TEMPLATE = document.getElementById('button_template')

//  Pages
const PAGE_LIST = document.querySelectorAll('.page_content') // Collection of all page information

const GALLERY_ITEMS = document.querySelectorAll('.gallery_item'); // Select all gallery items

GALLERY_ITEMS.forEach(item => {
    item.addEventListener('click', function (event) {
        event.preventDefault();
        const imageUrl = this.style.backgroundImage.slice(5, -2); // Extract URL from style
        const context = this.getAttribute('context'); // Get context attribute
        document.getElementById('gallery_preview').href = imageUrl; // Update link
        document.getElementById('gallery_preview_img').src = imageUrl; // Update image
        document.getElementById('gallery_description').innerText = context; // Update description
    });
});

const BLOG_ITEMS = document.querySelectorAll('.log_list_item'); // Select all blog items

// Logs data
const LOGS = {
  blogs: [
    {
      id: "LEFT",
      date: "10/01",
      content: "1"
    },
    {
      id: "FEEL",
      date: "09/29",
      content: "Sample content for FEEL blog entry"
    },
    {
      id: "FOOL",
      date: "09/28",
      content: "Sample content for FOOL blog entry"
    },
    {
      id: "WORK",
      date: "09/27",
      content: "Sample content for WORK blog entry"
    },
    {
      id: "SEED",
      date: "09/26",
      content: "Sample content for SEED blog entry"
    }
  ]
};

function changePage(destination) {
    const page_selected = document.getElementById(destination) || document.getElementById('about')
    if (page_selected) { // If the page exists
        PAGE_LIST.forEach(page_item => { // Hide all pages
            page_item.classList.remove('shown')
        })
        page_selected.classList.remove('hidden')   // Show this page
        page_selected.classList.add('shown')       // Make it flicker
        CONTEXT.textContent = page_selected.getAttribute('context') // Update context
        targetRate = 1
        if (destination === 'gallery' && !galleryLoaded) { // Update gallery if need be
            loadGallery()
        }
        targetRate = page_selected.getAttribute('rate') || 1
        document.getElementById('page_title').textContent = destination // Update the page title
        currentPage = destination
    }
}

document.addEventListener('DOMContentLoaded', () => {
    changePage('about'); // Set initial page
    // Initialize blog content with first entry
    if (LOGS.blogs.length > 0) {
        document.getElementById('log_content').innerHTML = LOGS.blogs[0].content;
    }
});

BLOG_ITEMS.forEach(item => {
    item.addEventListener('click', function () {
        const blogId = this.getAttribute('data-log-id');
        const blogEntry = LOGS.blogs.find(blog => blog.id === blogId);
        if (blogEntry) {
            document.getElementById('log_content').innerHTML = blogEntry.content;
            console.log(`Updated log content with ID: ${blogId}`); // Debugging statement
        } else {
            console.error(`No blog entry found for ID: ${blogId}`); // Debugging statement
        }
    });
});

const COMMISSION = document.getElementById('commission')
const COMMISSION_TYPES = document.querySelectorAll('.commission_type')
const COMMISSION_DESCRIPTION = document.getElementById('commission_description')
const COMMISSION_PRICING = document.getElementById('commission_pricing')
const COMMISSION_EXTRA = document.getElementById('commission_extra')
const COMMISSION_PREFERENCES = document.getElementById('commission_preferences')

// Statistics
const COHERENCE = document.getElementById('coherence')
const COUNTER = document.getElementById('counter')

// Vanity
const CRT_SCAN_FX = document.getElementById('crt_scan_fx')

/*-----------------| VARIABLES |-------------------------------------------------------------------------*/
// Toggles
let crtOn = true; // Set CRT state to always on

let galleryLoaded = false
let logLoaded = false

// Parallax
let easingEnabled = true // Flag for performance conservation
let easeFactor = 3 // Factor by which to increase or decrease the lerping speed
let lastEaseTime = Date.now() // Must init to Date.now()
let mouseRealPosition = [0, 0] // Real global X, Y of mouse
let mouseRealOffset = [0, 0] // -1 to 1 target offset determined by lerper()
let parallaxEasedOffset = [0, 0, 1] // Final eased offset coefficients
let windowMax = [window.innerWidth, window.innerHeight] // Updated to be accurate

// Easing
let easedRate = 1
let targetRate = 1
let commission_info = {}

// Etc
let currentPage = 'about'

/*-----------------| GENERAL FUNCTIONS |------------------------------------------------------------------*/
// Update CSS variable value
function CSS(VarName, VarProperty) {
    document.documentElement.style.setProperty('--' + VarName, VarProperty)
}

// Linear interpolation
function lerp(p1, p2, t) {
    return p1 + (p2 - p1) * t
}

// Smooth movements
function lerper(now_ms) {
    if(easingEnabled) { // calculate easing only if we need to
        mouseRealOffset[0] = (mouseRealPosition[0] / windowMax[0])
        mouseRealOffset[1] = (mouseRealPosition[1] / windowMax[1])
        if(isNaN(mouseRealOffset[0]) || mouseRealOffset[0] == undefined) {
            mouseRealOffset[0] = 0
            mouseRealOffset[1] = 0
        }
        let LocalEaseFactor = Math.min(1, (now_ms - lastEaseTime) / 1000)
        lastEaseTime = now_ms
        parallaxEasedOffset[0] = Number(lerp(parallaxEasedOffset[0], mouseRealOffset[0], LocalEaseFactor * easeFactor).toFixed(8))
        parallaxEasedOffset[1] = Number(lerp(parallaxEasedOffset[1], mouseRealOffset[1], LocalEaseFactor * easeFactor).toFixed(8))
        CSS('M_XP', parallaxEasedOffset[0] * 100 + '%')
        CSS('M_YP', parallaxEasedOffset[1] * 100 + '%')
    }
}

// Event-based updaters and initializer
function handleMouseMove(event) {
    mouseRealPosition = [event.pageX, event.pageY]
}
function onResize(event) {
    windowMax = [window.innerWidth, window.innerHeight]
}

// Main loop function
function mainLoop() {
    requestAnimationFrame(mainLoop)
    let NOW = Date.now()
    lerper(NOW)
}

// Event attachment and initializer
document.addEventListener('mousemove', handleMouseMove)
window.addEventListener('resize', onResize)

window.addEventListener('load', function() {
    mainLoop()
})

/*-----------------| PAGE HANDLING |--------------------------------------------------------------------*/
// Navigate to appropriate page if hash contains valid string
if (window.location.hash) {
    const hashValue = window.location.hash.substring(1)
    const target_page = document.getElementById(hashValue)
    if (target_page) {
        changePage(hashValue)
    }
} else {
    changePage('about')
}

// Update hash history if user has navigated
function pushHash(hashString) {
    if ('#' + hashString != window.location.hash) {
        if (history.pushState) {
            history.pushState(null, null, '#' + hashString)
        } else {
            location.hash = '#' + hashString
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Display correct page according to request and load gallery if needed
    function changePage(destination) {
        const page_selected = document.getElementById(destination) || document.getElementById('about')
        if (page_selected) { // If the page exists
            PAGE_LIST.forEach(page_item => { // Hide all pages
                page_item.classList.remove('shown')
            })
            page_selected.classList.remove('hidden')   // Show this page
            page_selected.classList.add('shown')       // Make it flicker
            CONTEXT.textContent = page_selected.getAttribute('context') // Update context
            targetRate = 1
            if (destination === 'gallery' && !galleryLoaded) { // Update gallery if need be
                loadGallery()
            }
            targetRate = page_selected.getAttribute('rate') || 1
            document.getElementById('page_title').textContent = destination // Update the page title
            currentPage = destination
        }
    }
});

// Change the topbar
function updateContext(info) {
    if (info) {
        CONTEXT.textContent = info
    }
}

// Update page when user uses browser navigation
addEventListener('hashchange', () => {
    changePage(window.location.hash.substring(1))
})

function updateCRT() {
    if (crtOn) {
        document.body.classList.add('crt')
        CRT_SCAN_FX.classList.remove('hidden')
    } else {
        document.body.classList.remove('crt')
        CRT_SCAN_FX.classList.add('hidden')
    }
}

/*-----------------| COMMISSION |------------------------------------------------------------------------*/
// Construct commission types
fetchJSON('./json/commission.json')
.then(data => {commission_info = data})
COMMISSION_TYPES.forEach(type => {
    bindButton(type, 'drop', 'silence')
    type.addEventListener('mousedown', () => {
        const info = commission_info[type.textContent.toLocaleLowerCase()]
        COMMISSION_TYPES.forEach(toGrey => {toGrey.classList.remove('unfiltered')})
        type.classList.add('unfiltered')
        COMMISSION_DESCRIPTION.innerHTML = info[1]
        COMMISSION_PRICING.innerHTML = Object.entries(info[0])
            .map(([key, value]) => `${key}: <span class="selectable" style="color: #0f0 !important; text-shadow: #0d0 0 0 1vh;"><br>$${value}</span>`)
            .join('<br>')
    })
})

/*-----------------| BUTTONS |---------------------------------------------------------------------------*/
// Bind all button functionality and sounds.
function addGlowEffect(button) {
    button.classList.add('glow');
    setTimeout(() => {
        button.classList.remove('glow');
    }, 300); // Duration of the glow effect
}

// Bind button to update context if it has any, and play some sounds
function bindButton(button) {
    button.addEventListener('mouseenter', () => {updateContext(button.getAttribute('context'))})
    button.addEventListener('mouseleave', () => updateContext(document.getElementsByClassName('shown')[0].getAttribute('context')))
}

// Give most buttons generic sounds and events
document.querySelectorAll('.navbar_button, .link, .external_button, .commission_type, #links .link').forEach(button => bindButton(button))

// navbar buttons
document.querySelectorAll('.navbar_button').forEach(button => { // Make all navbar buttons play sound & change to respective page
    const content = button.textContent.toLowerCase()
    button.addEventListener('mousedown', () => {
        addGlowEffect(button); // Add glow effect on click
        pushHash(content)
        changePage(content)
    })
})

// Site buttons
fetchJSON('./json/buttons.json')
.then(data => {
    CSS('ButtonCount', data.length)
    data.forEach(button => {
        let instance = EXTERNAL_BUTTON_TEMPLATE.cloneNode(true)
        instance.removeAttribute('id')
        instance.setAttribute('href', button[0])
        instance.innerHTML = `<img class="external_button" src="./img/button/${button[1]}"></img>`
        instance.classList.remove('hidden')
        bindButton(instance, 'drop', 'tap')
        EXTERNAL_BUTTON_CONTAINER.appendChild(instance)
    })
})

bindButton(CRT_TOGGLE);

// Set CRT to always be on
document.body.classList.add('crt');
CRT_TOGGLE_ICON.setAttribute('src', 'img/button/crt_on.svg');

updateCRT(); // Ensure CRT is updated
