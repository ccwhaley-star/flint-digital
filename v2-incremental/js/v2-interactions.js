/* Flint Digital V2 — FAQ Accordion */
(function(){
  document.querySelectorAll('.faq-question').forEach(function(q){
    q.addEventListener('click', function(){
      var item = this.parentElement;
      var wasOpen = item.classList.contains('faq-open');
      // Close all others in same container
      item.parentElement.querySelectorAll('.faq-open').forEach(function(open){
        open.classList.remove('faq-open');
        open.querySelector('.faq-question').setAttribute('aria-expanded','false');
      });
      // Toggle current
      if(!wasOpen){
        item.classList.add('faq-open');
        this.setAttribute('aria-expanded','true');
      }
    });
  });
})();
