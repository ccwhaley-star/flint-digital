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
})();
