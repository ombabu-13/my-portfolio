(function(){
  // ---------- theme ----------
  var html = document.documentElement;
  var themeBtn = document.getElementById('themeBtn');
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var current = prefersDark ? 'dark' : 'light';
  function applyTheme(t){
    html.setAttribute('data-theme', t);
    themeBtn.textContent = 'MODE: ' + t.toUpperCase();
  }
  applyTheme(current);
  themeBtn.addEventListener('click', function(){
    current = current === 'light' ? 'dark' : 'light';
    applyTheme(current);
  });

  // reduced motion
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){ document.documentElement.style.setProperty('--dur','0'); }

  // ---------- header shrink ----------
  var header = document.getElementById('siteHeader');
  window.addEventListener('scroll', function(){
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, {passive:true});

  // ---------- reveal on scroll ----------
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduced){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:0.14});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }
  // safety net: force-reveal everything after 2.5s no matter what
  setTimeout(function(){ revealEls.forEach(function(el){ el.classList.add('in'); }); }, 2500);

  // ---------- hero cycler ----------
  var phrases = [
    'Currently learning how systems actually work',
    'Currently building small, real things',
    'Currently breaking things on purpose to understand them',
    'Currently figuring out what comes after Semester II'
  ];
  var ci = 0;
  var cycler = document.getElementById('cycler');
  setInterval(function(){
    ci = (ci+1) % phrases.length;
    cycler.style.opacity = 0;
    setTimeout(function(){ cycler.textContent = phrases[ci]; cycler.style.opacity = 1; }, 250);
  }, 3200);
  cycler.style.transition = 'opacity .25s ease';

  // ---------- manifest (signature element) ----------
  var manifestData = [
    {idx:'001', desc:'B.Tech Computer Science & Engineering', sub:'SIT Pune · Aug 2025–Dec 2029 · Sem II', stamp:'Enrolled'},
    {idx:'002', desc:'anime-cli — terminal anime tool', sub:'Python · Rich · yt-dlp', stamp:'In transit'},
    {idx:'003', desc:'College Alumni Connect', sub:'SE Lab group project', stamp:'In transit'},
    {idx:'004', desc:'AI & systems', sub:'Post Gemini-workshop curiosity', stamp:'Exploring'}
  ];
  var mb = document.getElementById('manifestBody');
  manifestData.forEach(function(row, i){
    var d = document.createElement('div');
    d.className = 'manifest-row';
    d.style.animationDelay = (i*0.12)+'s';
    d.innerHTML = '<span class="idx">'+row.idx+'</span><span class="desc">'+row.desc+'<small>'+row.sub+'</small></span><span class="stamp">'+row.stamp+'</span>';
    mb.appendChild(d);
  });

  // ---------- currently panel (single config object) ----------
  var CURRENTLY = [
    {k:'Learning', v:'DBMS & Software Engineering', sub:'Semester II coursework'},
    {k:'Building', v:'College Alumni Connect', sub:'SE Lab group project'},
    {k:'Exploring', v:'AI, after the Gemini workshop', sub:'Curiosity-driven, early days'}
  ];
  var curGrid = document.getElementById('curGrid');
  CURRENTLY.forEach(function(c){
    var el = document.createElement('div');
    el.className = 'cur-card';
    el.innerHTML = '<div class="k">'+c.k+'</div><div class="v">'+c.v+'</div><div class="sub">'+c.sub+'</div>';
    curGrid.appendChild(el);
  });

  // ---------- toast ----------
  var toast = document.getElementById('toast');
  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function(){ toast.classList.remove('show'); }, 2200);
  }

  // ---------- resume button (no file attached yet) ----------
  document.getElementById('resumeBtn').addEventListener('click', function(e){
    e.preventDefault();
    showToast('Add your résumé PDF and link it here.');
  });

  // ---------- easter eggs ----------
  console.log('%cOMBABU.LOG', 'font-family:monospace;font-size:16px;font-weight:bold;color:#A63C36;');
  console.log('%cLooking at the source? Good instinct. Press ` (backtick) for a hidden terminal, or try the Konami code.', 'font-family:monospace;font-size:12px;color:#2F4B7C;');

  var term = document.getElementById('term');
  var termBody = document.getElementById('termBody');
  var termInput = document.getElementById('termInput');
  function openTerm(){ term.classList.add('open'); termInput.focus(); }
  function closeTerm(){ term.classList.remove('open'); }
  document.getElementById('termClose').addEventListener('click', closeTerm);

  function termLine(text){
    var l = document.createElement('div');
    l.className = 'term-line';
    l.textContent = text;
    termBody.appendChild(l);
    termBody.scrollTop = termBody.scrollHeight;
  }
  var COMMANDS = {
    help: 'Commands: whoami, status, projects, hire-me, clear, exit',
    whoami: 'Ombabu Rauniyar — B.Tech CSE, SIT Pune. Originally from Nepal.',
    status: 'BUILDING. Semester II. Still figuring out what is next -- on purpose.',
    projects: 'anime-cli · scholar-scraper · college-alumni-connect · krishna-enterprises-site · tic-tac-toe',
    'hire-me': 'Appreciated. Scroll to Contact — I read everything myself.',
  };
  termInput.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      var val = termInput.value.trim();
      termLine('> ' + val);
      if(val === 'clear'){ termBody.innerHTML=''; }
      else if(val === 'exit'){ closeTerm(); }
      else if(COMMANDS[val]){ termLine(COMMANDS[val]); }
      else if(val){ termLine('command not found: ' + val + ' (try "help")'); }
      termInput.value = '';
    }
  });

  document.addEventListener('keydown', function(e){
    var tag = (e.target && e.target.tagName) || '';
    if(tag === 'INPUT' || tag === 'TEXTAREA') return;
    if(e.key === '\`'){ e.preventDefault(); term.classList.contains('open') ? closeTerm() : openTerm(); }
  });

  // g then h -> github, g then l -> linkedin
  var lastKey = '', lastTime = 0;
  document.addEventListener('keydown', function(e){
    var tag = (e.target && e.target.tagName) || '';
    if(tag === 'INPUT' || tag === 'TEXTAREA') return;
    var now = Date.now();
    if(lastKey === 'g' && now - lastTime < 900){
      if(e.key === 'h'){ window.open('https://github.com/ombabu-13', '_blank'); }
      if(e.key === 'l'){ window.open('https://www.linkedin.com/in/ombabu-rauniyar-a90297379/', '_blank'); }
      lastKey = '';
    } else {
      lastKey = e.key;
      lastTime = now;
    }
  });

  // konami code -> system mode flash
  var KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var kPos = 0;
  document.addEventListener('keydown', function(e){
    if(e.key === KONAMI[kPos]){
      kPos++;
      if(kPos === KONAMI.length){
        kPos = 0;
        document.body.style.transition = 'filter .3s ease';
        document.body.style.filter = 'invert(1) hue-rotate(180deg)';
        showToast('SYSTEM MODE — welcome to the manifest, unfiltered.');
        setTimeout(function(){ document.body.style.filter = 'none'; }, 1600);
      }
    } else {
      kPos = (e.key === KONAMI[0]) ? 1 : 0;
    }
  });
  // ---------- custom cursor + magnetic / spotlight buttons ----------
  var isFinePointer = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(isFinePointer && !reduced){
    html.classList.add('has-fine-pointer');
    var ring = document.createElement('div'); ring.id = 'cursorRing';
    var dot = document.createElement('div'); dot.id = 'cursorDot';
    document.body.appendChild(ring); document.body.appendChild(dot);

    var mx = window.innerWidth/2, my = window.innerHeight/2;
    var rx = mx, ry = my;
    document.addEventListener('mousemove', function(e){
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx+'px'; dot.style.top = my+'px';
    });
    function ringLoop(){
      rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(ringLoop);
    }
    ringLoop();

    function syncCursorTheme(){
      var dark = html.getAttribute('data-theme') === 'dark';
      ring.classList.toggle('on-dark', dark);
      dot.classList.toggle('on-dark', dark);
    }
    syncCursorTheme();
    themeBtn.addEventListener('click', syncCursorTheme);

    var hoverables = document.querySelectorAll('a, button, .btn, input');
    hoverables.forEach(function(el){
      el.addEventListener('mouseenter', function(){ ring.classList.add('hovering'); });
      el.addEventListener('mouseleave', function(){ ring.classList.remove('hovering'); });
    });

    // spotlight-follow for buttons and contact links
    var spotlightEls = document.querySelectorAll('.btn, .clink');
    spotlightEls.forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
        el.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
      });
    });

    // gentle magnetic pull on primary buttons
    var magnets = document.querySelectorAll('.btn.primary');
    magnets.forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var cx = e.clientX - (r.left + r.width/2);
        var cy = e.clientY - (r.top + r.height/2);
        el.style.transform = 'translate(' + (cx*0.18) + 'px,' + (cy*0.28) + 'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = 'translate(0,0)'; });
    });
  }

})();