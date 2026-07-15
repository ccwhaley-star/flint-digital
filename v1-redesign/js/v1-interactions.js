/* V1 Redesign — Interactions */

// Nav scroll state
(function(){
  var nav = document.querySelector('nav');
  if(!nav) return;
  window.addEventListener('scroll', function(){
    if(window.scrollY > 60) nav.classList.add('nav-scrolled');
    else nav.classList.remove('nav-scrolled');
  });
})();

// Number counters
(function(){
  var counters = document.querySelectorAll('[data-count]');
  if(!counters.length) return;
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'));
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1500;
        var startTime = null;
        function animate(timestamp){
          if(!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = prefix + Math.floor(eased * target) + suffix;
          if(progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        obs.unobserve(el);
      }
    });
  }, {threshold: 0.5});
  counters.forEach(function(c){ obs.observe(c); });
})();

// FAQ Accordion
(function(){
  document.querySelectorAll('.faq-question').forEach(function(q){
    q.addEventListener('click', function(){
      var item = this.parentElement;
      var wasOpen = item.classList.contains('faq-open');
      // Close all in same category
      var category = item.closest('.faq-category') || item.parentElement;
      category.querySelectorAll('.faq-open').forEach(function(open){
        open.classList.remove('faq-open');
        open.querySelector('.faq-question').setAttribute('aria-expanded','false');
      });
      if(!wasOpen){
        item.classList.add('faq-open');
        this.setAttribute('aria-expanded','true');
      }
    });
  });
})();

// Service tabs (desktop)
(function(){
  var tabs = document.querySelectorAll('.svc-tab');
  var panels = document.querySelectorAll('.svc-panel');
  if(!tabs.length) return;
  tabs.forEach(function(tab, i){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.classList.remove('svc-tab-active'); });
      panels.forEach(function(p){ p.classList.remove('svc-panel-active'); });
      tab.classList.add('svc-tab-active');
      if(panels[i]) panels[i].classList.add('svc-panel-active');
    });
  });
})();

// Form validation
(function(){
  var form = document.querySelector('.audit-form');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var valid = true;
    form.querySelectorAll('[required]').forEach(function(input){
      if(!input.value.trim()){
        input.style.borderColor = '#c45a4a';
        valid = false;
      } else {
        input.style.borderColor = '';
      }
    });
    if(valid){
      var btn = form.querySelector('button');
      btn.textContent = 'Sent! We\'ll be in touch.';
      btn.disabled = true;
      btn.style.opacity = '0.7';
    }
  });
})();
