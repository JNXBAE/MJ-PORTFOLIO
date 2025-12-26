/**
 * Main JS (customized for Mohamed Jubair K)
 * Template: MyResume (modified)
 */

(function() {
  "use strict";

  // Owner / defaults
  const OWNER_NAME = "Mohamed Jubair K";
  const DEFAULT_TYPED_STRINGS = [
    `${OWNER_NAME}`,
    "AI Engineer",
    "Data Scientist",
    "Frontend Developer"
  ];

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');
  function headerToggle() {
    const header = document.querySelector('#header');
    if (!header || !headerToggleBtn) return;
    header.classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  if (headerToggleBtn) headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns (if present)
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      const next = this.parentNode.nextElementSibling;
      if (next) next.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader (fade then remove)
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.transition = "opacity 300ms ease";
      preloader.style.opacity = 0;
      setTimeout(() => {
        if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 350);
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (!scrollTop) return;
    window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll (AOS) init
   */
  function aosInit() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * typed.js init (with fallback defaults)
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped && typeof Typed !== 'undefined') {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    if (typed_strings && typed_strings.trim().length) {
      typed_strings = typed_strings.split(',').map(s => s.trim());
    } else {
      typed_strings = DEFAULT_TYPED_STRINGS;
    }
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate PureCounter (if available)
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Animate skills: supports both original .progress-bar (aria-valuenow)
   * and the new .skill-fill (data-val) approach we added.
   */
  function animateSkillsForElement(item) {
    // old progress bars (BootstrapMade template)
    const progressBars = item.querySelectorAll('.progress .progress-bar');
    if (progressBars && progressBars.length) {
      progressBars.forEach(el => {
        const val = el.getAttribute('aria-valuenow') || el.getAttribute('data-val') || 0;
        el.style.width = val + '%';
      });
    }

    // new skill-fill approach (.skill-fill with data-val)
    const skillFills = item.querySelectorAll('.skill-fill');
    if (skillFills && skillFills.length) {
      skillFills.forEach(fill => {
        const val = parseInt(fill.getAttribute('data-val') || fill.getAttribute('aria-valuenow') || 0, 10);
        fill.style.width = val + '%';
        // update badge text if present
        const row = fill.closest('.skill-row');
        if (row) {
          const badge = row.querySelector('.skill-badge');
          if (badge) badge.textContent = val + '%';
        }
      });
    }
  }

  // Use Waypoints if available, otherwise animate immediately on load
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  if (skillsAnimation && skillsAnimation.length) {
    skillsAnimation.forEach((item) => {
      if (typeof Waypoint !== 'undefined') {
        new Waypoint({
          element: item,
          offset: '80%',
          handler: function(direction) {
            animateSkillsForElement(item);
          }
        });
      } else {
        // fallback
        window.addEventListener('load', () => animateSkillsForElement(item));
      }
    });
  }

  /**
   * Initiate glightbox (if available)
   */
  if (typeof GLightbox !== 'undefined') {
    const glightbox = GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Init isotope layout and filters (if available)
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    if (typeof imagesLoaded === 'undefined' || typeof Isotope === 'undefined') return;

    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        const active = isotopeItem.querySelector('.isotope-filters .filter-active');
        if (active) active.classList.remove('filter-active');
        this.classList.add('filter-active');
        if (initIsotope) {
          initIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
        }
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      const configEl = swiperElement.querySelector(".swiper-config");
      if (!configEl) return;
      let config;
      try {
        config = JSON.parse(configEl.innerHTML.trim());
      } catch (err) {
        console.warn("Invalid swiper config", err);
        return;
      }

      if (swiperElement.classList.contains("swiper-tab")) {
        // custom pagination behavior if needed later
        new Swiper(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop || "0px";
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop, 10),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    if (!navmenulinks || !navmenulinks.length) return;
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  // --- END main IIFE ---
})();
