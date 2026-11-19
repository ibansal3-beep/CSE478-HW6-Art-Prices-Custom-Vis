/* Original custom SVG glyph visualization, D3 v7. */
(async function(){
 const svg=d3.select('#viz'), tip=d3.select('#tooltip');
 const rows=await d3.csv('artDataset.csv',d=>({...d,year:+d.year,priceUSD:+d.priceUSD}));
 const data=rows.filter(d=>Number.isFinite(d.year)&&Number.isFinite(d.priceUSD)&&d.priceUSD>0&&['Modern','Post-War','Contemporary'].includes(d.period));
 const periods=['Modern','Post-War','Contemporary'];
 const colors={'Realism':'#e8bc78','Abstract':'#ed8d77','Expressionism':'#a7c4b2','Pop Art':'#ddbbdc','Conceptual':'#a5c4dc','Surrealism':'#e0d787','Impressionism':'#d4a887','Other':'#b4c0ad'};
 const color=d=>colors[d.movement?.trim()]||colors.Other;
 const x=d3.scaleLinear().domain([1860,2025]).range([120,1260]);
 const radius=d3.scaleSqrt().domain([0,d3.max(data,d=>d.priceUSD)]).range([4,19]);
 const bands={Modern:[85,250],'Post-War':[255,450],Contemporary:[455,655]};
 const hash=str=>{let h=2166136261;for(let i=0;i<str.length;i++)h=Math.imul(h^str.charCodeAt(i),16777619);return h>>>0};
 // Bespoke radial petal paths: custom SVG geometry (not a D3 chart block).
 function petals(group,r,fill){for(let k=0;k<5;k++){let a=2*Math.PI*k/5-Math.PI/2,angle=a*180/Math.PI+90;group.append('path').attr('d',`M 0,0 Q ${(-r*.46).toFixed(2)},${(-r*.58).toFixed(2)} 0,${(-r*1.7).toFixed(2)} Q ${(r*.46).toFixed(2)},${(-r*.58).toFixed(2)} 0,0 Z`).attr('transform',`rotate(${angle})`).attr('fill',fill).attr('fill-opacity',.85).attr('stroke','#203a33').attr('stroke-width',.55)}group.append('circle').attr('r',Math.max(1.6,r*.24)).attr('fill','#f5e8d0')}
 function draw(selected='All'){
 svg.selectAll('*').remove();
 periods.forEach(p=>{let [top,bottom]=bands[p];svg.append('rect').attr('x',14).attr('y',top).attr('width',1292).attr('height',bottom-top-5).attr('rx',4).attr('fill','#2b423a');svg.append('text').attr('x',30).attr('y',top+24).attr('font-size',20).attr('font-family','Georgia').attr('fill','#e1e8dc').text(p)});
 [1900,1925,1950,1975,2000,2025].forEach(year=>{svg.append('line').attr('x1',x(year)).attr('x2',x(year)).attr('y1',85).attr('y2',650).attr('stroke','#a3b7a8').attr('stroke-opacity',.16);svg.append('text').attr('x',x(year)).attr('y',692).attr('text-anchor','middle').attr('fill','#c1d0c5').attr('font-size',13).text(year)});
 let filtered=data.filter(d=>selected==='All'||d.period===selected);
 const marks=svg.selectAll('.artwork-glyph').data(filtered,d=>d.id).enter().append('g').attr('class','artwork-glyph').attr('tabindex',0).attr('role','button').attr('aria-label',d=>`${d.title} by ${d.artist}, $${d3.format(',')(d.priceUSD)}`)
 .attr('transform',d=>{let [lo,hi]=bands[d.period],seed=hash(d.id+'-'+d.title);return `translate(${x(d.year)+((seed%13)-6)*1.3},${lo+40+(seed%1000)/1000*(hi-lo-75)})`});
 marks.each(function(d){petals(d3.select(this),radius(d),color(d))});
 function show(event,d){tip.html(`<strong>${escapeHTML(d.title)}</strong>${escapeHTML(d.artist)}<br>${d.year} · ${escapeHTML(d.period)}<br>${escapeHTML(d.movement)}<br><b>$${d3.format(',')(d.priceUSD)} USD</b>`).attr('hidden',null);move(event)}
 function move(event){let xx=event.clientX??innerWidth/2,yy=event.clientY??innerHeight/2;tip.style('left',Math.min(xx+18,innerWidth-315)+'px').style('top',Math.min(yy+18,innerHeight-150)+'px')}
 marks.on('mouseenter',show).on('mousemove',move).on('mouseleave',()=>tip.attr('hidden',true)).on('focus',function(event,d){show(event,d)}).on('blur',()=>tip.attr('hidden',true)).on('click',show).on('keydown',function(event,d){if(event.key==='Enter'||event.key===' '){event.preventDefault();show(event,d)}});
 d3.select('.toolbar .section-id').text(`EXPLORE THE COLLECTION · ${filtered.length} artworks on view`);
 }
 function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
 d3.selectAll('button[data-period]').on('click',function(){d3.selectAll('button[data-period]').classed('active',false);d3.select(this).classed('active',true);draw(this.dataset.period)});
 draw();
 [ ['#sample-small',2000],['#sample-mid',20000],['#sample-big',100000] ].forEach(([selector,price])=>petals(d3.select(selector),radius({priceUSD:price}),colors.Abstract));
})().catch(e=>{console.error(e);d3.select('.toolbar .section-id').text('Data loading error — open this exhibit using a local web server')});
