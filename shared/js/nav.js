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

/* Flint Digital — Portfolio Preview Scaling
   Preview iframes render a fixed 1440px-wide page; scale each to its
   wrapper's real width so nothing crops on mobile or under-fills on wide. */
(function(){
  var wraps = document.querySelectorAll('.case-iframe-wrap, .proof-iframe-wrap');
  if(!wraps.length) return;
  function fit(wrap){
    var frame = wrap.querySelector('iframe');
    if(frame && wrap.clientWidth) frame.style.transform = 'scale(' + (wrap.clientWidth / 1440) + ')';
  }
  wraps.forEach(fit);
  if('ResizeObserver' in window){
    var ro = new ResizeObserver(function(entries){
      entries.forEach(function(e){ fit(e.target); });
    });
    wraps.forEach(function(w){ ro.observe(w); });
  } else {
    window.addEventListener('resize', function(){ wraps.forEach(fit); });
  }
})();
