/* Flint Digital — Scroll Reveal Animations */
(function(){
  const obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.08, rootMargin: '0px 0px -32px 0px'});

  document.querySelectorAll('.reveal').forEach(function(el){
    obs.observe(el);
  });
})();
