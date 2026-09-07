/* Flint Digital — Navigation Module */
(function(){
  var hamburger = document.querySelector('.hamburger');
  var menu = document.querySelector('.nav-menu');
  if(!hamburger || !menu) return;

  function openMenu(){
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded','true');
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded','false');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }
  function toggleMenu(){
    if(menu.classList.contains('open')) closeMenu();
    else openMenu();
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close on Escape
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });

  // Close when clicking a menu link
  menu.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', closeMenu);
  });

  // Close on tap/click outside the open menu
  document.addEventListener('click', function(e){
    if(!menu.classList.contains('open')) return;
    if(menu.contains(e.target) || hamburger.contains(e.target)) return;
    closeMenu();
  });
})();

/* Flint Digital — Resources Dropdown (desktop nav)
   Hover-open comes from CSS; this adds click/keyboard toggle with
   aria-expanded, plus outside-click and Escape to close. */
(function(){
  var drop = document.querySelector('.nav-drop');
  if(!drop) return;
  var btn = drop.querySelector('.nav-drop-btn');
  function setOpen(open){
    drop.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    setOpen(!drop.classList.contains('open'));
  });
  document.addEventListener('click', function(e){
    if(drop.classList.contains('open') && !drop.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && drop.classList.contains('open')){ setOpen(false); btn.focus(); }
  });
})();

/* Flint Digital — Portfolio Preview Scaling
   Preview iframes render a fixed 1440px-wide page; scale each to its
   wrapper's real width so nothing crops on mobile or under-fills on wide. */
(function(){
  var wraps = document.querySelectorAll('.case-iframe-wrap, .proof-iframe-wrap');
  if(!wraps.length) return;
  // Batch all layout READS first, then all WRITES, inside one animation frame,
  // so the browser never has to force a synchronous reflow mid-loop.
  var pending = null;
  function fitAll(){
    pending = null;
    var widths = [];
    wraps.forEach(function(wrap){ widths.push(wrap.clientWidth); });   // reads
    wraps.forEach(function(wrap, i){                                     // writes
      var frame = wrap.querySelector('iframe');
      if(frame && widths[i]) frame.style.transform = 'scale(' + (widths[i] / 1440) + ')';
    });
  }
  function scheduleFit(){
    if(pending) return;
    pending = window.requestAnimationFrame(fitAll);
  }
  scheduleFit();
  if('ResizeObserver' in window){
    var ro = new ResizeObserver(scheduleFit);
    wraps.forEach(function(w){ ro.observe(w); });
  } else {
    window.addEventListener('resize', scheduleFit);
  }
})();

/* Flint Digital — Click-to-call tracking
   Reports tel: link clicks to GA4 when gtag is present; harmless otherwise. */
(function(){
  document.querySelectorAll('a[href^="tel:"]').forEach(function(link){
    link.addEventListener('click', function(){
      if(typeof window.gtag === 'function'){
        window.gtag('event', 'click_to_call', { link_url: link.getAttribute('href'), link_location: link.className || 'body' });
      }
    });
  });
})();
