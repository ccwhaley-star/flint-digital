/* Flint Digital — main.js
   Mobile menu toggle (keyboard-accessible, focus-trapped) + reduced-motion guard.
   Vanilla JS, no dependencies. */
(function(){
  "use strict";
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".nav-links");
  if(!toggle || !menu) return;

  var lastFocused = null;

  function focusables(){
    return menu.querySelectorAll("a, button");
  }

  function openMenu(){
    lastFocused = document.activeElement;
    menu.classList.add("open");
    toggle.setAttribute("aria-expanded","true");
    document.body.style.overflow = "hidden";
    var f = focusables();
    if(f.length) f[0].focus();
    document.addEventListener("keydown", onKey);
  }

  function closeMenu(){
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded","false");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    if(lastFocused) lastFocused.focus();
  }

  function onKey(e){
    if(e.key === "Escape"){ closeMenu(); return; }
    if(e.key === "Tab"){
      var f = focusables();
      if(!f.length) return;
      var first = f[0], last = f[f.length-1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  }

  toggle.addEventListener("click", function(){
    if(menu.classList.contains("open")) closeMenu();
    else openMenu();
  });

  // Close when a menu link is clicked (mobile)
  menu.addEventListener("click", function(e){
    if(e.target.tagName === "A" && menu.classList.contains("open")) closeMenu();
  });
})();
