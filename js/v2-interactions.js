/* Flint Digital V2 — FAQ Accordion */
(function(){
  document.querySelectorAll('.faq-question').forEach(function(q){
    q.addEventListener('click', function(){
      var item = this.parentElement;
      var wasOpen = item.classList.contains('faq-open');
      // Close all others in same container
      item.parentElement.querySelectorAll('.faq-open').forEach(function(open){
        open.classList.remove('faq-open');
        open.querySelector('.faq-answer').style.maxHeight = '';
        open.querySelector('.faq-question').setAttribute('aria-expanded','false');
      });
      // Toggle current
      if(!wasOpen){
        item.classList.add('faq-open');
        var answer = item.querySelector('.faq-answer');
        // +20px covers the open-state padding, which is still animating when measured
        answer.style.maxHeight = (answer.scrollHeight + 20) + 'px';
        this.setAttribute('aria-expanded','true');
      }
    });
  });
})();
