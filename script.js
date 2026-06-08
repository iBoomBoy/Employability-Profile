
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  particles = Array.from({length: Math.min(90, Math.floor(innerWidth/18))}, () => ({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    vx: (Math.random()-.5)*0.45,
    vy: (Math.random()-.5)*0.45,
    r: Math.random()*1.8+0.6
  }));
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='rgba(94,231,255,.65)';
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>canvas.width) p.vx*=-1;
    if(p.y<0||p.y>canvas.height) p.vy*=-1;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
  });
  ctx.strokeStyle='rgba(155,92,255,.14)';
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a=particles[i], b=particles[j];
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<125){
        ctx.globalAlpha=1-d/125;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
  }
  ctx.globalAlpha=1;
  requestAnimationFrame(draw);
}
resize(); draw();
addEventListener('resize', resize);

document.querySelectorAll('.filter').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.activity-card').forEach(card=>{
      card.style.display = (f === 'All' || card.dataset.type === f) ? '' : 'none';
    });
  });
});

const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.animate([
        {opacity:0, transform:'translateY(26px)'},
        {opacity:1, transform:'translateY(0)'}
      ], {duration:650, easing:'cubic-bezier(.2,.8,.2,1)', fill:'both'});
      observer.unobserve(e.target);
    }
  })
}, {threshold:.08});
document.querySelectorAll('.section, .activity-card, .metric').forEach(el=>observer.observe(el));



// Merged activities modal
const activityModal = document.getElementById('activityModal');
const activityModalMainImage = document.getElementById('activityModalMainImage');
const activityModalPlaceholder = document.getElementById('activityModalPlaceholder');
const activityModalThumbs = document.getElementById('activityModalThumbs');
const activityModalTitle = document.getElementById('activityModalTitle');
const activityModalDate = document.getElementById('activityModalDate');
const activityModalType = document.getElementById('activityModalType');
const activityModalSummary = document.getElementById('activityModalSummary');

function setActivityImage(src, thumb){
  if(src){
    activityModalMainImage.src = src;
    activityModalMainImage.style.display = 'block';
    activityModalPlaceholder.style.display = 'none';
  } else {
    activityModalMainImage.removeAttribute('src');
    activityModalMainImage.style.display = 'none';
    activityModalPlaceholder.style.display = 'grid';
  }

  document.querySelectorAll('.activity-thumb').forEach(t => t.classList.remove('active'));
  if(thumb) thumb.classList.add('active');
}

function openActivityModal(card){
  const images = (card.dataset.images || '').split('|').filter(Boolean);
  activityModalTitle.textContent = card.dataset.title || 'Activity';
  activityModalDate.textContent = card.dataset.date || '';
  activityModalType.textContent = card.dataset.activityType || card.dataset.type || '';
  activityModalSummary.textContent = card.dataset.summary || '';

  activityModalThumbs.innerHTML = '';

  if(images.length){
    setActivityImage(images[0], null);

    images.forEach((src, index) => {
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.alt = `${card.dataset.title || 'Activity'} evidence ${index + 1}`;
      thumb.className = 'activity-thumb' + (index === 0 ? ' active' : '');
      thumb.addEventListener('click', (event) => {
        event.stopPropagation();
        setActivityImage(src, thumb);
      });
      activityModalThumbs.appendChild(thumb);
    });
  } else {
    setActivityImage('', null);
  }

  activityModal.classList.add('open');
  activityModal.setAttribute('aria-hidden', 'false');
}

document.querySelectorAll('.clickable-activity').forEach(card => {
  card.addEventListener('click', () => openActivityModal(card));
  card.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      openActivityModal(card);
    }
  });
});

document.querySelectorAll('[data-close-activity-modal]').forEach(el => {
  el.addEventListener('click', () => {
    activityModal.classList.remove('open');
    activityModal.setAttribute('aria-hidden', 'true');
  });
});

document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && activityModal){
    activityModal.classList.remove('open');
    activityModal.setAttribute('aria-hidden', 'true');
  }
});
