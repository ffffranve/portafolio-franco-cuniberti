type Point = { x: number; y: number };
type LinePoint = Point & { nx: number; ny: number };

// Smooth curves through the simulated points, rather than visibly segmented lines.
function curve(points: Point[]) {
  let d = `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[Math.max(0, i - 1)], b = points[i];
    const c = points[i + 1], e = points[Math.min(points.length - 1, i + 2)];
    d += `C${(b.x + (c.x-a.x)/6).toFixed(2)} ${(b.y + (c.y-a.y)/6).toFixed(2)} ${(c.x-(e.x-b.x)/6).toFixed(2)} ${(c.y-(e.y-b.y)/6).toFixed(2)} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`;
  }
  return d;
}

export function enableElasticLines() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const lines = [...document.querySelectorAll<SVGSVGElement>('[data-elastic-line]')].map(svg => {
    const paths = [...svg.querySelectorAll('path')];
    const length = paths[0].getTotalLength();
    const points: LinePoint[] = Array.from({ length: 37 }, (_, i) => {
      const p = paths[0].getPointAtLength(length * i / 36);
      const a = paths[0].getPointAtLength(Math.max(0,length*i/36-1));
      const b = paths[0].getPointAtLength(Math.min(length,length*i/36+1));
      const tangent = Math.hypot(b.x-a.x,b.y-a.y) || 1;
      return { x:p.x, y:p.y, nx:-(b.y-a.y)/tangent, ny:(b.x-a.x)/tangent };
    });
    return { svg, paths, points, length, rect:svg.getBoundingClientRect(), width:svg.viewBox.baseVal.width,
      amount:0, velocity:0, center:0.5, side:1, timeOffset:0,
      rendered:points.map(p=>({x:p.x,y:p.y})), dragX:0, dragY:0,
      dragVx:0, dragVy:0, dragCenter:0.5 };
  });
  if (!lines.length) return;
  let pointer: Point | null = null;
  let frame = 0, last = 0;
  type Line = (typeof lines)[number];
  let grab: { line:Line; pointerId:number; origin:Point; started:number } | null = null;
  const root = document.documentElement;
  const originalCursor = root.style.cursor;
  // Explicit red cursor artwork stays visible independently of the OS grab cursor.
  const handCursor = (path:string) => {
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32"><path d="${path}" fill="#e3261f" stroke="#fefefb" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 10 12, pointer`;
  };
  const openHand = handCursor('M9 18V8Q9 6 11 6Q13 6 13 8V15V5Q13 3 15 3Q17 3 17 5V15V7Q17 5 19 5Q21 5 21 7V16V10Q21 8 23 8Q25 8 25 10V20Q25 25 21 29H12Q9 28 7 25L3 19Q2 17 4 16Q5 15 7 17L9 19Z');
  const closedHand = handCursor('M8 16V11Q8 8 10 8Q12 8 12 11V15V9Q12 6 14 6Q16 6 16 9V14V10Q16 7 18 7Q20 7 20 10V15V12Q20 9 22 9Q25 9 25 12V20Q25 25 21 28H12Q9 27 7 24L4 19Q2 16 4 14Q6 12 8 16Z');
  const interactive = (target:EventTarget | null) => target instanceof Element &&
    !!target.closest('a,button,input,textarea,select,video,iframe,[contenteditable]');

  function closestLine(point:Point) {
    let hit: {line:Line; point:Point; t:number; distance:number} | null = null;
    for (const line of lines) {
      const scale = line.rect.width/line.width;
      for (let i=0;i<line.rendered.length-1;i++) {
        const a=line.rendered[i], b=line.rendered[i+1];
        const ax=line.rect.left+a.x*scale, ay=line.rect.top+a.y*scale;
        const dx=(b.x-a.x)*scale, dy=(b.y-a.y)*scale;
        const t=Math.max(0,Math.min(1,((point.x-ax)*dx+(point.y-ay)*dy)/(dx*dx+dy*dy || 1)));
        const nearest={x:ax+dx*t,y:ay+dy*t};
        const distance=Math.hypot(point.x-nearest.x,point.y-nearest.y);
        if (!hit || distance<hit.distance) hit={line,point:nearest,t:(i+t)/(line.rendered.length-1),distance};
      }
    }
    return hit;
  }
  function releaseGrab() {
    const previous=grab;
    grab=null;
    pointer=null;
    root.style.cursor=originalCursor;
    if (!previous) return;
    previous.line.timeOffset+=performance.now()-previous.started;
    if (root.hasPointerCapture(previous.pointerId)) root.releasePointerCapture(previous.pointerId);
  }

  function draw(time: number, dt: number) {
    lines.forEach((line, lineIndex) => {
      const scale = line.rect.width / line.width;
      const mouse = pointer && { x: (pointer.x-line.rect.left)/scale, y: (pointer.y-line.rect.top)/scale };
      const held = grab?.line===line ? grab : null;
      let target = 0;
      if (mouse && !reduced.matches && !grab) {
        let nearest = 0, distance = Infinity;
        line.points.forEach((p,i)=>{
          const d = Math.hypot(p.x-mouse.x,p.y-mouse.y)*scale;
          if (d < distance) { distance=d; nearest=i; }
        });
        if (distance < 110) {
          const p = line.points[nearest];
          const signed = ((mouse.x-p.x)*p.nx+(mouse.y-p.y)*p.ny)*scale;
          // A small dead zone avoids flipping sides when the pointer touches the line.
          if (Math.abs(signed)>6) line.side = -Math.sign(signed);
          line.center += (nearest/(line.points.length-1)-line.center)*(1-Math.exp(-0.12*dt));
          target = line.side * 30 * Math.pow(1-distance/110,1.5) / scale;
        }
      }
      // One bounded deflection field per curve keeps neighboring points connected.
      if (!held) {
        line.velocity = (line.velocity+(target-line.amount)*0.045*dt)*Math.pow(0.72,dt);
        line.amount += line.velocity*dt;
      }
      let dragTargetX=0, dragTargetY=0;
      if (held && pointer) {
        // Keep the grip visible at the viewport edge instead of losing it offscreen.
        const x=Math.max(8,Math.min(innerWidth-8,pointer.x));
        const y=Math.max(8,Math.min(innerHeight-8,pointer.y));
        const dx=x-held.origin.x, dy=y-held.origin.y;
        const envelope=Math.max(0.3,Math.sin(Math.PI*line.dragCenter));
        // Full control first, then continuous rubber-like resistance; no abrupt stop.
        const comfort=Math.min(180,line.length*scale*0.36*envelope);
        const distance=Math.hypot(dx,dy);
        const excess=Math.max(0,distance-comfort);
        const travel=distance<=comfort?distance:comfort+excess/(1+excess/(comfort*0.24));
        const resistance=travel/(distance||1);
        dragTargetX=dx*resistance/scale/envelope;
        dragTargetY=dy*resistance/scale/envelope;
      }
      if (held) {
        const follow=1-Math.exp(-0.65*dt);
        const stepX=(dragTargetX-line.dragX)*follow, stepY=(dragTargetY-line.dragY)*follow;
        line.dragVx+=(stepX/dt-line.dragVx)*0.45;
        line.dragVy+=(stepY/dt-line.dragVy)*0.45;
        line.dragX+=stepX;
        line.dragY+=stepY;
      } else {
        // A damped spring preserves release momentum and settles after a small rebound.
        const speed=Math.hypot(line.dragVx,line.dragVy)*scale;
        const velocityLimit=Math.min(1,12/(speed||1));
        line.dragVx*=velocityLimit;
        line.dragVy*=velocityLimit;
        line.dragVx=(line.dragVx-line.dragX*0.055*dt)*Math.pow(0.72,dt);
        line.dragVy=(line.dragVy-line.dragY*0.055*dt)*Math.pow(0.72,dt);
        line.dragX+=line.dragVx*dt;
        line.dragY+=line.dragVy*dt;
      }
      const gripWidth=0.42+Math.min(0.45,Math.hypot(line.dragX,line.dragY)*scale/300);
      const animationTime=(held?held.started:time)-line.timeOffset;
      line.paths.forEach((path, strand) => {
        const points = line.points.map((p, i) => {
          const t = i / (line.points.length-1);
          const envelope = Math.sin(Math.PI*t);
          const phase = lineIndex*2.4;
          const idle = reduced.matches ? 0 :
            (Math.sin(animationTime*0.0015-t*5+phase)*4.5+Math.sin(animationTime*0.00095+t*8+phase)*1.6)/scale;
          const spread = (t-line.center)*line.length*scale/108;
          const push = line.amount*Math.exp(-0.5*spread*spread);
          const strandOffset = (strand-1)*1.35+Math.sin(t*12+strand*2.1)*0.65;
          const offset = (idle+push+strandOffset)*envelope;
          const grip=Math.exp(-0.5*Math.pow((t-line.dragCenter)/gripWidth,2))*envelope;
          return { x:p.x+p.nx*offset+line.dragX*grip, y:p.y+p.ny*offset+line.dragY*grip };
        });
        if (strand===1) line.rendered=points;
        path.setAttribute('d', curve(points));
      });
    });
  }
  function tick(time: number) {
    frame = 0;
    const dt = last ? Math.min((time-last)/16.667, 2) : 1;
    last = time;
    draw(time, dt);
    if (!reduced.matches && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function restart() {
    cancelAnimationFrame(frame);
    last = 0;
    if (reduced.matches || document.hidden) releaseGrab();
    if (reduced.matches) {
      pointer = null;
      lines.forEach(l=>{l.amount=l.velocity=l.dragX=l.dragY=l.dragVx=l.dragVy=0});
      draw(0, 1);
    } else if (!document.hidden) frame = requestAnimationFrame(tick);
  }
  window.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || reduced.matches) return;
    pointer = { x:e.clientX, y:e.clientY };
    if (!grab) {
      const near=interactive(e.target)?null:closestLine(pointer);
      root.style.cursor=near && near.distance<28 && near.t>=0.08 && near.t<=0.92?openHand:originalCursor;
    }
  }, { passive:true });
  window.addEventListener('pointerdown', e=>{
    if (e.button!==0 || e.pointerType!=='mouse' || reduced.matches || interactive(e.target) || grab) return;
    const near=closestLine({x:e.clientX,y:e.clientY});
    if (!near || near.distance>32 || near.t<0.08 || near.t>0.92) return;
    e.preventDefault();
    pointer={x:e.clientX,y:e.clientY};
    grab={line:near.line,pointerId:e.pointerId,origin:near.point,started:performance.now()};
    near.line.dragCenter=near.t;
    near.line.velocity=0;
    root.setPointerCapture(e.pointerId);
    root.style.cursor=closedHand;
  });
  window.addEventListener('pointerup', e=>{if (grab?.pointerId===e.pointerId) releaseGrab()});
  window.addEventListener('pointercancel', e=>{if (grab?.pointerId===e.pointerId) releaseGrab()});
  root.addEventListener('lostpointercapture', e=>{if (grab?.pointerId===e.pointerId) releaseGrab()});
  root.addEventListener('pointerleave', ()=>{if (!grab) {pointer=null;root.style.cursor=originalCursor}});
  window.addEventListener('blur', releaseGrab);
  window.addEventListener('keydown', e=>{if(e.key==='Escape') releaseGrab()});
  window.addEventListener('resize', ()=>{releaseGrab();lines.forEach(l=>{
    l.rect=l.svg.getBoundingClientRect();
    l.amount=l.velocity=l.dragX=l.dragY=l.dragVx=l.dragVy=0;
  })}, { passive:true });
  document.addEventListener('visibilitychange', restart);
  reduced.addEventListener('change', restart);
  restart();
}
