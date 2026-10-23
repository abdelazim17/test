/* Trolley Market — effects layer. Safe: if anything fails, the site works as before. */
(function(){
'use strict';
var root=document.documentElement,PAGES={'page-home':'HOME','page-categories':'CATEGORIES','page-catalog':'OFFERS','page-about':'ABOUT'};
var SEL='.product-card,.section-header,.static-banner,.split-banners,.swipe-slider-container,.catalog-page,.category-filter-bar';
function yes(k){try{return TM.S[k]!=='لا'}catch(e){return true}}
function S_(k,d){try{return TM.S[k]||d}catch(e){return d}}
root.classList.add('fx');

/* 1) scroll reveal */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -6% 0px'});
function arm(scope){(scope||document).querySelectorAll(SEL).forEach(function(el){
  if(el.__fx)return;el.__fx=1;
  var i=Array.prototype.indexOf.call(el.parentNode.children,el);
  el.style.setProperty('--d',(i%6)*0.06+'s');el.classList.add('fx-reveal');io.observe(el)})}

/* 2) mp4/webm in Excel image cells -> muted looping video */
function vids(scope){(scope||document).querySelectorAll('img[src$=".mp4"],img[src$=".webm"]').forEach(function(im){
  var v=document.createElement('video');v.src=im.getAttribute('src');v.muted=true;v.loop=true;v.autoplay=true;v.playsInline=true;v.setAttribute('playsinline','');
  v.className=(im.className+' fx-vid').trim();v.style.cssText=im.style.cssText;im.replaceWith(v);v.play&&v.play().catch(function(){})})}

/* 3) hero — supermarket style */
var COL=['#DE5718','#2E7D4F','#C2410C','#E8A317','#2B463C','#9C3B12'];
var ICON=[['فواك','apple-whole'],['خضر','carrot'],['ألبان','cheese'],['لحوم','drumstick-bite'],['منظف','spray-can-sparkles'],['مكسر','cookie-bite'],['تسالي','cookie-bite'],['سناكس','cookie'],['بقال','basket-shopping'],['مشروب','bottle-water']];
function icon(n){for(var i=0;i<ICON.length;i++)if(n.indexOf(ICON[i][0])>-1)return ICON[i][1];return 'tag'}
function hero(){
  var home=document.getElementById('page-home');if(!home||home.querySelector('.fx-hero')||!yes('إظهار الهيرو'))return;
  if(!window.TM||!TM.cats.length)return;
  var h=document.createElement('section');h.className='fx-hero';
  var fr=parseFloat(S_('حد التوصيل المجاني',0))||0;
  h.innerHTML='<div class="fx-hero-in"><div class="fx-badge"><i class="fas fa-truck-fast"></i> <span></span></div><div class="fx-pill"><i class="fx-dot"></i><span></span></div><h1 class="fx-h1"></h1><p class="fx-sub"></p><div class="fx-trust"></div><div class="fx-cta"><a href="#categories">تسوّق الآن</a><a href="#catalog">عروض اليوم</a></div></div><div class="fx-hero-art"><img alt="" decoding="async"></div><div class="fx-tiles"></div>';
  h.querySelector('.fx-badge span').textContent=S_('نص شارة الهيرو',S_('اسم المتجر','ترولي ماركت'));
  var art=h.querySelector('.fx-hero-art'),asrc=S_('صورة الهيرو','images/hero.svg');var aim=art.querySelector('img');function noart(){art.remove();h.classList.add('fx-noart')}if(asrc){aim.onerror=noart;aim.src=asrc}else noart();
  var pl=S_('نص الكبسولة الخفيفة','متجر إلكتروني');h.querySelector('.fx-pill span').textContent=pl;if(!pl)h.querySelector('.fx-pill').style.display='none';
  if(S_('إظهار شارة الهيرو','لا')!=='نعم')h.querySelector('.fx-badge').style.display='none';
  var hh=h.querySelector('.fx-h1');hh.innerHTML='<span class="l1"></span><span class="l2"></span>';
  hh.querySelector('.l1').textContent=S_('سطر الهيرو 1','كل طلبات البيت');hh.querySelector('.l2').textContent=S_('سطر الهيرو 2','لحد البيت');
  h.querySelector('.fx-sub').textContent=S_('إظهار وصف الهيرو','لا')==='نعم'?S_('وصف الموقع',''):'';
  if(yes('إظهار أقسام الصفحة الرئيسية')){var cn=Math.min(12,TM.cats.length),tt=tiles(cn,false);tt.style.setProperty('--cols',Math.min(6,Math.ceil(cn/2)));h.querySelector('.fx-tiles').replaceWith(tt)}else h.querySelector('.fx-tiles').remove();
  var ca=h.querySelectorAll('.fx-cta a');ca[0].textContent=S_('زر الهيرو 1 (نص)','تسوّق الآن');ca[0].setAttribute('href',S_('زر الهيرو 1 (رابط)','#categories'));ca[1].textContent=S_('زر الهيرو 2 (نص)','عروض اليوم');ca[1].setAttribute('href',S_('زر الهيرو 2 (رابط)','#catalog'));
  var tr=h.querySelector('.fx-trust');tr.innerHTML='';[1,2,3,4,5,6].forEach(function(i){var v=S_('نقطة ثقة '+i,'').split('|');if(!v[1])return;var s=document.createElement('span'),ic=document.createElement('i');ic.className=(v[0]==='whatsapp'||v[0]==='facebook'?'fab':'fas')+' fa-'+v[0];s.appendChild(ic);s.appendChild(document.createTextNode(' '+v[1]));tr.appendChild(s)});
  if(fr&&S_('إظهار نقطة التوصيل المجاني في الهيرو','لا')==='نعم'){var g=document.createElement('span');g.innerHTML='<i class="fas fa-gift"></i> ';g.appendChild(document.createTextNode('توصيل مجاني فوق '+fr+' '+TM.cur()));tr.appendChild(g)}
  home.insertBefore(h,home.firstChild);
  if(yes('إظهار الشريط المتحرك')){var t=document.createElement('div');t.className='fx-ticker';
    var o=TM.offers.slice(0,12).map(function(p){try{return String(p['الاسم']||'').trim()+' '+TM.fmt(TM.priceInfo(p).price)+' '+TM.cur()}catch(e){return ''}}).filter(Boolean);
    var words=(o.length?'عروض اليوم:  '+o.join('  •  '):S_('نص الشريط المتحرك',''))+'   •   ';
    t.innerHTML='<span></span>';t.firstChild.textContent=words+words+words;home.insertBefore(t,h.nextSibling)}
  arm(home);
}

/* 3b) عروض اليوم = البرتقالي الثابت | وإعدادات الألوان من settings.xlsx */
function offers(){var h=document.getElementById('today-offers');if(!h||h.dataset.of)return;h.dataset.of=1;h.classList.add('fx-offers-head');var g=h.nextElementSibling;if(g)g.classList.add('fx-offers-grid')}
function themeSet(){if(!window.TM||!TM.S)return;var ok=function(c){return /^#[0-9a-f]{3,8}$/i.test(String(c||'').trim())};
  var o=S_('لون عروض اليوم',''),c=S_('لون زر السلة',''),t1=S_('لون زر الهيرو 1',''),t2=S_('لون زر الهيرو 2','');if(ok(t1))root.style.setProperty('--tp1',String(t1).trim());if(ok(t2))root.style.setProperty('--tp2',String(t2).trim());
  if(ok(o))root.style.setProperty('--offer',String(o).trim());if(ok(c))root.style.setProperty('--cartbtn',String(c).trim());
  var hs=S_('قوة الهالات','متوسطة');root.style.setProperty('--ha',hs==='خفيفة'?'16%':hs==='قوية'?'42%':'26%');document.body.classList.toggle('fx-nohalo',S_('هالات الألوان','نعم')==='لا');document.body.classList.toggle('fx-mono',S_('تلوين الأقسام بألوانها','نعم')==='لا');document.body.classList.toggle('fx-nav-flat',S_('شكل شريط التنقل السفلي','ملتصق')==='ملتصق')}

/* 3c) البنرات فوق/تحت الهيرو */
function placeBanners(){return;var hero=document.querySelector('.fx-hero');if(!hero||hero.dataset.bp)return;hero.dataset.bp=1;
  if(S_('مكان البنرات','فوق الهيرو')!=='فوق الهيرو')return;var home=hero.parentNode;
  ['sec-banner-top','slider-wrap','sec-banner-split'].forEach(function(id){var el=document.getElementById(id);if(el)home.insertBefore(el,hero)})}

/* 3d) طريقة الدفع في السلة */
function payInit(){var sel=document.getElementById('cust-pay'),box=document.getElementById('pay-box');if(!sel||sel.dataset.ok||!window.TM||!TM.S)return;sel.dataset.ok=1;
  if(S_('إظهار طريقة الدفع','نعم')==='لا'){box.style.display='none';sel.innerHTML='';return}
  var list=String(S_('طرق الدفع','الدفع عند الاستلام')).split(/[,،]/).map(function(x){return x.trim()}).filter(Boolean);
  sel.innerHTML='';list.forEach(function(x){var o=document.createElement('option');o.textContent=x;sel.appendChild(o)});
  var note=document.getElementById('pay-note'),txt=S_('ملاحظة الدفع الإلكتروني','');
  function sync(){var cod=/عند الاستلام|كاش عند|نقد/.test(sel.value);note.textContent=(!cod&&txt)?txt:'';note.style.display=note.textContent?'block':'none'}
  sel.addEventListener('change',sync);sync()}

/* 3e) الفوتر الثابت (في كل الصفحات) */
function footer(){if(document.getElementById('fx-footer')||!window.TM||!TM.S||!TM.cats.length)return;if(S_('إظهار الفوتر','نعم')==='لا')return;
  var nm=S_('اسم المتجر','ترولي ماركت'),ph=S_('رقم التليفون المعروض',''),wa=String(S_('رقم الواتساب','')).replace(/\D/g,''),hrs=S_('ساعات العمل',''),ad=S_('العنوان','');
  var soc=[['رابط فيسبوك','fab fa-facebook-f'],['رابط إنستجرام','fab fa-instagram'],['رابط تيك توك','fab fa-tiktok'],['رابط يوتيوب','fab fa-youtube'],['رابط تيليجرام','fab fa-telegram'],['رابط تويتر','fab fa-twitter'],['رابط الخريطة','fas fa-location-dot']].filter(function(x){return /^https?:\/\//i.test(String(S_(x[0],'')).trim())});
  var f=document.createElement('footer');f.id='fx-footer';f.className='fx-footer';
  f.innerHTML='<div class="ft-in"><div class="ft-brand"><h3></h3><p></p><div class="ft-soc"></div></div><div class="ft-col"><h4>روابط سريعة</h4><nav></nav></div><div class="ft-col ft-contact"><h4>تواصل</h4><div></div></div></div><div class="ft-copy"></div>';
  f.querySelector('.ft-brand h3').textContent=nm;f.querySelector('.ft-brand p').textContent=S_('وصف الفوتر','');
  var sc=f.querySelector('.ft-soc');soc.forEach(function(x){var a=document.createElement('a');a.href=S_(x[0],'');a.target='_blank';a.rel='noopener';a.setAttribute('aria-label',x[0]);a.innerHTML='<i class="'+x[1]+'"></i>';sc.appendChild(a)});
  var nav=f.querySelector('nav');[['#home','اسم صفحة الرئيسية','الرئيسية'],['#categories','اسم صفحة الأقسام','الأقسام'],['#catalog','عروض اليوم','عروض اليوم'],['#catalog','اسم صفحة المجلة','المجلة'],['#about','اسم صفحة حول','حول']].forEach(function(l,i){
    if(i===2){var a2=document.createElement('a');a2.href='#home';a2.textContent=S_('عنوان قسم العروض','عروض اليوم');a2.dataset.off=1;nav.appendChild(a2);return}
    var a=document.createElement('a');a.href=l[0];a.textContent=S_(l[1],l[2]);nav.appendChild(a)});
  var c=f.querySelector('.ft-contact div');
  function line(txt,href,ic,ltr){var el=document.createElement(href?'a':'span');if(href)el.href=href;el.innerHTML='<i class="'+ic+'"></i> ';var t=document.createElement('bdi');t.dir=ltr?'ltr':'auto';t.textContent=txt;el.appendChild(t);c.appendChild(el)}
  if(ph)line(ph,'tel:'+ph.replace(/[^\d+]/g,''),'fas fa-phone',1);if(wa)line('واتساب','https://wa.me/'+wa,'fab fa-whatsapp');if(hrs)line(hrs,'','fas fa-clock');if(ad)line(ad,'','fas fa-location-dot');
  f.querySelector('.ft-copy').textContent='© '+new Date().getFullYear()+' '+nm+' — '+S_('حقوق الفوتر','جميع الحقوق محفوظة');
  var old=document.getElementById('site-footer');(old&&old.parentNode?old.parentNode:document.body).insertBefore(f,old?old.nextSibling:null);
  f.querySelectorAll('.ft-col nav a').forEach(function(a){a.addEventListener('click',function(){setTimeout(function(){window.scrollTo(0,0)},60)})});
  var offA=f.querySelector('a[data-off]');if(offA)offA.addEventListener('click',function(){setTimeout(function(){var t=document.getElementById('today-offers');if(t)t.scrollIntoView({behavior:'smooth'})},120)})}

/* 3f) اقتراحات البحث = الأقسام (مع زر إخفاء) */
function searchChips(){var m=document.getElementById('search-modal');if(!m||m.querySelector('.fx-chips')||!window.TM||!TM.cats.length)return;if(S_('إظهار اقتراحات البحث','نعم')==='لا')return;
  var box=document.createElement('div');box.className='fx-chips';box.innerHTML='<div class="fx-chips-h"><span>اقتراحات</span><button type="button" class="fx-chips-x">إخفاء الأقسام ✕</button></div><div class="fx-chips-l"></div>';
  var l=box.querySelector('.fx-chips-l');TM.cats.forEach(function(c){var a=document.createElement('a');a.href='#categories/'+encodeURIComponent(c);a.textContent=c;a.style.setProperty('--fc',catColor(c));a.addEventListener('click',function(){var x=document.querySelector('.close-search');if(x)setTimeout(function(){x.click()},30)});l.appendChild(a)});
  var x=box.querySelector('.fx-chips-x');x.onclick=function(){var h=l.classList.toggle('off');x.textContent=h?'إظهار الأقسام':'إخفاء الأقسام ✕'};
  var hd=m.querySelector('.search-header');hd.parentNode.insertBefore(box,hd.nextSibling)}

/* 3g) ألوان الهوية من الإعدادات */
function palette(){if(!window.TM||!TM.S)return;var ok=function(c){return /^#[0-9a-f]{3,8}$/i.test(String(c||'').trim())};
  [['درجة الأخضر الداكن','--p-dark'],['درجة الأخضر','--p-green'],['درجة الأخضر الفاتح','--p-lgreen'],['درجة الأخضر الأفتح','--p-llgreen'],['درجة البرتقالي','--p-orange'],['درجة الأصفر','--p-yellow'],['درجة الأحمر','--p-red'],['درجة الكريمي الفاتح','--p-cream1'],['درجة الكريمي','--p-cream2']].forEach(function(p){var v=S_(p[0],'');if(ok(v))root.style.setProperty(p[1],String(v).trim())})}

/* 3h) صورة بديلة لو ملف الصورة مش موجود: رمز المنتج على دايرة بلون القسم */
var EMO={"موز":["🍌","#DE5718"],"تفاح أحمر":["🍎","#DE5718"],"برتقال":["🍊","#DE5718"],"فراولة":["🍓","#DE5718"],"عنب أخضر":["🍇","#DE5718"],"ليمون":["🍋","#DE5718"],"بطيخ":["🍉","#DE5718"],"طماطم":["🍅","#688F4E"],"خيار":["🥒","#688F4E"],"بطاطس":["🥔","#688F4E"],"بصل أحمر":["🧅","#688F4E"],"جزر":["🥕","#688F4E"],"أرز مصري":["🍚","#FFCC37"],"مكرونة":["🍝","#FFCC37"],"سكر":["🥄","#FFCC37"],"زيت عباد الشمس":["🌻","#FFCC37"],"دقيق أبيض":["🌾","#FFCC37"],"عدس أصفر":["🥣","#FFCC37"],"فول مدمس":["🥣","#FFCC37"],"تونة":["🐟","#FFCC37"],"شاي":["🍵","#FFCC37"],"قهوة":["☕","#FFCC37"],"صلصة طماطم":["🥫","#FFCC37"],"مربى فراولة":["🍯","#FFCC37"],"لبن كامل الدسم":["🥛","#3B86C9"],"لبن خالي الدسم":["🥛","#3B86C9"],"زبادي طبيعي":["🥣","#3B86C9"],"جبنة رومي":["🧀","#3B86C9"],"جبنة بيضاء":["🧀","#3B86C9"],"جبنة مثلثات":["🧀","#3B86C9"],"قشطة":["🍶","#3B86C9"],"زبدة":["🧈","#3B86C9"],"بيض بلدي":["🥚","#3B86C9"],"كريمة طبخ":["🍶","#3B86C9"],"لبنة":["🥣","#3B86C9"],"موزاريلا":["🧀","#3B86C9"],"عيش بلدي":["🥙","#B5793B"],"عيش فينو":["🥖","#B5793B"],"توست":["🍞","#B5793B"],"كرواسون":["🥐","#B5793B"],"باجيت":["🥖","#B5793B"],"بقسماط":["🥨","#B5793B"],"عيش شامي":["🥙","#B5793B"],"رولز صغير":["🥯","#B5793B"],"لب سوبر":["🌻","#2B463C"],"لب أسمر":["🌻","#2B463C"],"فول سوداني":["🥜","#2B463C"],"لوز":["🌰","#2B463C"],"كاجو":["🥜","#2B463C"],"فستق":["🥜","#2B463C"],"بندق":["🌰","#2B463C"],"عين جمل":["🌰","#2B463C"],"زبيب":["🍇","#2B463C"],"تمر":["🌴","#2B463C"],"حمص الشام":["🥣","#2B463C"],"مكس مكسرات":["🥜","#2B463C"],"شيبسي ملح":["🍟","#BE2B11"],"بطاطس بالجبنة":["🍟","#BE2B11"],"بوشار":["🍿","#BE2B11"],"لبان":["🍬","#BE2B11"],"نودلز":["🍜","#BE2B11"],"ذرة مشوية":["🌽","#BE2B11"],"بسكويت بالتمر":["🍪","#BE2B11"],"مياه معدنية":["💧","#7C5CBF"],"عصير برتقال":["🍊","#7C5CBF"],"عصير مانجو":["🥭","#7C5CBF"],"كولا":["🥤","#7C5CBF"],"ليمون غازي":["🍋","#7C5CBF"],"مشروب طاقة":["⚡","#7C5CBF"],"شاي مثلج":["🧋","#7C5CBF"],"لبن بالشوكولاتة":["🍫","#7C5CBF"],"مياه غازية كبيرة":["🥤","#7C5CBF"],"قهوة باردة":["☕","#7C5CBF"],"كركديه":["🌺","#7C5CBF"],"سوبيا":["🍶","#7C5CBF"],"كمون":["🌿","#7A4B2A"],"كزبرة ناشفة":["🌿","#7A4B2A"],"فلفل أسود":["🌶️","#7A4B2A"],"ملح طعام":["🧂","#7A4B2A"],"شطة":["🌶️","#7A4B2A"],"كركم":["🌿","#7A4B2A"],"قرفة":["🍂","#7A4B2A"],"بهارات مشكلة":["🥫","#7A4B2A"],"ورق لورا":["🍃","#7A4B2A"],"هيل":["🌱","#7A4B2A"],"زنجبيل بودر":["🌿","#7A4B2A"],"ثوم بودر":["🧄","#7A4B2A"],"شوكولاتة بالحليب":["🍫","#E0457B"],"ويفر":["🧇","#E0457B"],"أصابع شوكولاتة":["🍫","#E0457B"],"جيلي":["🍬","#E0457B"],"كاندي ملون":["🍭","#E0457B"],"كيكة فانيلا":["🍰","#E0457B"],"دونات":["🍩","#E0457B"],"كوكيز شوكولاتة":["🍪","#E0457B"],"مافن":["🧁","#E0457B"],"مانجو عويس":["🥭","#DE5718"],"جوافة":["🍐","#DE5718"],"رمان":["🍎","#DE5718"],"كمثرى":["🍐","#DE5718"],"كوسة":["🥒","#688F4E"],"باذنجان":["🍆","#688F4E"],"فلفل رومي":["🫑","#688F4E"],"خس":["🥬","#688F4E"],"مكرونة ريجينا 400 جم":["🍝","#FFCC37"],"أرز العلمين 1 كجم":["🍚","#FFCC37"],"زيت كريستال عباد الشمس":["🌻","#FFCC37"],"زيت عافية ذرة":["🌽","#FFCC37"],"شاي العروسة 40 جم":["🍵","#FFCC37"],"شاي ليبتون 40 جم":["🍵","#FFCC37"],"نسكافيه كلاسيك 50 جم":["☕","#FFCC37"],"فول معبأ":["🥣","#FFCC37"],"دقيق معبأ":["🌾","#FFCC37"],"لبن جهينة كامل الدسم":["🥛","#3B86C9"],"لبن جهينة خالي الدسم":["🥛","#3B86C9"],"زبادي جهينة":["🥣","#3B86C9"],"جبنة دومتي فيتا":["🧀","#3B86C9"],"جبنة كيري مثلثات":["🧀","#3B86C9"],"بيض أبيض":["🥚","#3B86C9"],"زبدة لورباك":["🧈","#3B86C9"],"توست بيمبو أبيض":["🍞","#B5793B"],"كرواسون بالجبنة":["🥐","#B5793B"],"بيتي فور":["🍪","#B5793B"],"بيجل بالسمسم":["🥯","#B5793B"],"جوز هند مبشور":["🥥","#2B463C"],"سمسم أبيض":["🌰","#2B463C"],"عباد شمس مقشر":["🌻","#2B463C"],"شيبسي بطاطس كبير":["🍟","#BE2B11"],"دوريتوس جبنة":["🧀","#BE2B11"],"شيتوس":["🍟","#BE2B11"],"بسكويت أولكر":["🍪","#BE2B11"],"بيبسي":["🥤","#7C5CBF"],"كوكاكولا":["🥤","#7C5CBF"],"سفن أب":["🥤","#7C5CBF"],"مياه نستله بيور لايف":["💧","#7C5CBF"],"عصير جهينة بيور مانجو":["🥭","#7C5CBF"],"ريد بول":["⚡","#7C5CBF"],"عصير فريش برتقال":["🍊","#7C5CBF"],"كاري":["🌿","#7A4B2A"],"خلطة شاورما":["🌶️","#7A4B2A"],"نعناع مجفف":["🍃","#7A4B2A"],"شوكولاتة جلاكسي":["🍫","#E0457B"],"كيت كات":["🍫","#E0457B"],"بسكويت أوريو":["🍪","#E0457B"],"مولتو":["🥐","#E0457B"],"نوتيلا":["🍫","#E0457B"],"حلاوة طحينية":["🍯","#E0457B"]};
var CATEMO={'الفاكهة':['🍎','#DE5718'],'الخضار':['🥬','#688F4E'],'البقالة':['🛒','#FFCC37'],'الألبان':['🥛','#3B86C9'],'المخبوزات':['🍞','#B5793B'],'اللب والمكسرات':['🥜','#2B463C'],'التسالي':['🍟','#BE2B11'],'المشروبات':['🥤','#7C5CBF'],'التوابل والبهارات':['🌶️','#7A4B2A'],'حلويات':['🍫','#E0457B']};
window.tmFallbackSrc=function(name,cat){var e=EMO[(name||'').trim()]||CATEMO[cat]||['🛒','#688F4E'];var c=e[1].replace('#','');function mix(a){var r=[0,2,4].map(function(i){var v=parseInt(c.substr(i,2),16);return Math.round(255-(255-v)*a)});return 'rgb('+r.join(',')+')'}
  var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="'+mix(.1)+'"/><circle cx="200" cy="200" r="150" fill="'+mix(.22)+'"/><circle cx="200" cy="200" r="118" fill="#fff"/><text x="200" y="248" font-size="136" text-anchor="middle" font-family="Segoe UI Emoji,Apple Color Emoji,Noto Color Emoji,sans-serif">'+e[0]+'</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)};
window.tmFallback=function(img){return window.tmFallbackSrc(img.alt,'')};

/* 4) progress bar */
var bar=document.createElement('div');bar.id='fx-bar';document.body.appendChild(bar);
function tick(){var m=document.documentElement.scrollHeight-innerHeight;bar.style.width=(m>0?scrollY/m*100:0)+'%'}
addEventListener('scroll',function(){requestAnimationFrame(tick)},{passive:true});

/* 4a) share catalog pages */
function shares_old(){document.querySelectorAll('.catalog-page:not([data-sh])').forEach(function(p){p.dataset.sh=1;
  var b=document.createElement('button');b.className='fx-share';b.innerHTML='<i class="fas fa-share-nodes"></i> مشاركة';
  b.onclick=function(e){e.stopPropagation();var im=p.querySelector('img'),u=new URL(im.getAttribute('src'),location.href).href,
   txt='شوف عروض '+S_('اسم المتجر','ترولي ماركت')+':\n'+u+'\n'+location.origin;
   if(navigator.share)navigator.share({title:S_('اسم المتجر','ترولي ماركت'),text:txt}).catch(function(){});else window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank')};
  p.appendChild(b)})}

function shares(){}
function shareCatalog(){var u=location.origin+location.pathname+'#catalog',n=S_('اسم المتجر','ترولي ماركت'),tx='شوف مجلة عروض '+n+':\n'+u;
  if(navigator.share)navigator.share({title:'مجلة عروض '+n,text:tx,url:u}).catch(function(){});else window.open('https://wa.me/?text='+encodeURIComponent(tx),'_blank')}
/* 4c) cart: drawer -> full page, floating button */
function cartExtras(){
  var sb=document.getElementById('cart-sidebar');if(!sb||document.getElementById('fx-full'))return;
  var cb=document.getElementById('checkout-btn');
  if(cb)cb.insertAdjacentHTML('beforebegin','<button id="fx-full" type="button" class="fx-fullbtn"><i class="fas fa-clipboard-check"></i> إتمام الطلب</button>');
  document.getElementById('fx-full').onclick=function(){sb.classList.add('fx-full')};
  var mq=window.matchMedia('(max-width:768px)'),ttl=sb.querySelector('.cart-header h3');
  function sync(){var full=sb.classList.contains('fx-full'),open=sb.classList.contains('open');if(ttl)ttl.textContent=sb.classList.contains('fx-full')?'فاتورة الطلب':'سلة المشتريات'}
  new MutationObserver(sync).observe(sb,{attributes:true,attributeFilter:['class']});
  new MutationObserver(function(){if(sb.classList.contains('fx-full')&&!sb.classList.contains('open'))sb.classList.remove('fx-full')}).observe(sb,{attributes:true,attributeFilter:['class']});

}

/* 4d) category colours / icons + page heads */
function catColor(n){var m=(window.TM&&TM.catMeta||{})[n]||{};if(/^#[0-9a-f]{3,8}$/i.test(m.color||''))return m.color;var i=TM.cats.indexOf(n);return COL[(i<0?0:i)%COL.length]}
function catIco(n){var m=(TM.catMeta||{})[n]||{};if(m.img){var im=document.createElement('img');im.src=m.img;im.alt='';im.className='fx-cico';return im}
  var i=document.createElement('i');i.className='fas fa-'+(m.icon||icon(n))+' fx-cico-i';return i}
function paint(){if(!window.TM||!TM.cats.length)return;
  document.body.classList.toggle('fx-hide-olddesc',S_('إظهار وصف صفحة حول القديم','لا')!=='نعم');
  document.querySelectorAll('.section-header[data-cat]:not([data-pt])').forEach(function(h){h.dataset.pt=1;var n=h.dataset.cat,col=catColor(n);
    var sec=h.closest('.products-section')||h.parentNode;sec.style.setProperty('--acc',col);h.style.setProperty('--hc',col);h.insertBefore(catIco(n),h.firstChild)});
  document.querySelectorAll('.cat-filter-btn:not([data-pt])').forEach(function(b){b.dataset.pt=1;var n=b.textContent.trim();if(TM.cats.indexOf(n)>-1)b.style.setProperty('--fc',catColor(n))})}
function lum(h){h=String(h||'').replace('#','');if(h.length===3)h=h.replace(/(.)/g,'$1$1');var r=parseInt(h.substr(0,2),16),g=parseInt(h.substr(2,2),16),b=parseInt(h.substr(4,2),16);if(isNaN(r+g+b))return 0;return(0.299*r+0.587*g+0.114*b)/255}
function ink(c){return lum(c)>0.62?'#2B463C':'#fff'}
function tiles(n,all){var tl=document.createElement('div');tl.className='fx-tiles';
  if(all){var a0=document.createElement('a');a0.className='fx-tile';a0.href='#categories';a0.dataset.cat='';a0.style.setProperty('--tc','#3B3F45');a0.innerHTML='<i class="fas fa-border-all fx-cico-i"></i><span>الكل</span>';tl.appendChild(a0)}
  TM.cats.slice(0,n).forEach(function(c){var a=document.createElement('a');a.className='fx-tile';a.href='#categories/'+encodeURIComponent(c);a.dataset.cat=c;a.style.setProperty('--tc',catColor(c));a.style.setProperty('--ti',ink(catColor(c)));
    a.appendChild(catIco(c));var s=document.createElement('span');s.textContent=c;a.appendChild(s);if((window.TM_DISABLED||[]).indexOf(c)>-1){a.classList.add('off');var o=document.createElement('em');o.textContent='غير متوفر حاليًا';a.appendChild(o)}tl.appendChild(a)});return tl}
var allFlag=false;
function syncTiles(){var h='';try{h='#'+decodeURIComponent((window.TM&&TM.route)||'')}catch(e){}var cat=h.indexOf('#categories/')===0?h.slice(12):'';
  document.querySelectorAll('.fx-pagehead .fx-tile').forEach(function(t){var d=t.dataset.cat||'';t.classList.toggle('on',cat?d===cat:d==='')});
  var pc=document.getElementById('page-categories');if(pc)pc.style.setProperty('--pc',cat?catColor(cat):'#2E7D4F');
  var sl=document.querySelector('.sort-bar label');if(sl&&!sl.dataset.fx){sl.dataset.fx=1;sl.innerHTML='<i class="fas fa-arrow-down-wide-short"></i> رتّب حسب'}}
addEventListener('popstate',function(){setTimeout(syncTiles,30)});
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.fx-tile');if(t){allFlag=(t.dataset.cat===''&&!!t.closest('.fx-pagehead'));setTimeout(syncTiles,60)}});
function heads(){if(!window.TM||!TM.cats.length)return;
  [['page-categories','اسم صفحة الأقسام','الأقسام','اختار القسم اللي عايزه وابدأ التسوق',1],['page-catalog','اسم صفحة المجلة','مجلة العروض','تصفّح العروض وشارك أي صفحة مع صحابك',0]].forEach(function(d){
    var p=document.getElementById(d[0]);if(!p||p.querySelector('.fx-pagehead'))return;
    var h=document.createElement('section');h.className='fx-pagehead';h.innerHTML='<div><h2></h2><p></p></div>';
    h.querySelector('h2').textContent=S_(d[1],d[2]);h.querySelector('p').textContent=d[3];if(d[0]==='page-catalog'){var sb=document.createElement('button');sb.className='fx-sharebtn';sb.innerHTML='<i class="fas fa-share-nodes"></i> مشاركة مجلة العروض';sb.onclick=shareCatalog;h.appendChild(sb)}if(d[4])h.appendChild(tiles(8,true));p.insertBefore(h,p.firstChild)})}

/* 4b) about page */
function about(){
  var p=document.getElementById('page-about');if(!p||p.querySelector('.ab-wrap')||!window.TM||!TM.products.length)return;
  var n=TM.products.length,c=TM.cats.length,fr=parseFloat(S_('حد التوصيل المجاني',0))||0,cur=S_('رمز العملة','ج');
  var feats=[1,2,3,4].map(function(i){return (S_('ميزة '+i,'')||'').split('|')}).filter(function(f){return f[0]});
  var abs=[['من نحن','قصتنا'],['هدفنا','هدفنا'],['رؤيتنا','رؤيتنا']].map(function(k){return [S_(k[1]+' (عنوان)',k[0]),S_(k[1]+' (نص)','')]}).filter(function(a){return a[1]});
  var w=document.createElement('div');w.className='ab-wrap';
  var h='<div class="ab-stats"><div><b>'+n+'+</b><span>منتج</span></div><div><b>'+c+'</b><span>قسم</span></div><div><b>'+(fr?fr+' '+cur:'24/7')+'</b><span>'+(fr?'توصيل مجاني فوق':'اطلب في أي وقت')+'</span></div></div>';
  h+=(abs.length?'<div class="ab-about">'+abs.map(function(){return '<div class="ab-card"><h3></h3><p></p></div>'}).join('')+'</div>':'')+'<div class="ab-grid">'+feats.map(function(){return '<div class="ab-card"><h3></h3><p></p></div>'}).join('')+'</div>';
  h+='<div class="ab-steps"><div><i>1</i>اختار منتجاتك</div><div><i>2</i>راجع السلة</div><div><i>3</i>ابعت الطلب واتساب</div></div>';
  w.innerHTML=h;
  w.querySelectorAll('.ab-about .ab-card').forEach(function(el,i){el.querySelector('h3').textContent=abs[i][0];el.querySelector('p').textContent=abs[i][1]});
  w.querySelectorAll('.ab-grid .ab-card').forEach(function(el,i){el.querySelector('h3').textContent=feats[i][0];el.querySelector('p').textContent=feats[i][1]||''});
  var ct=p.querySelector('.about-container'),gd=ct&&ct.querySelector('.about-grid');if(ct&&gd)ct.insertBefore(w,gd);else p.insertBefore(w,p.firstChild);arm(p);
}
/* 5) watch dynamic content */
function debounced(f){var t=0;return function(){if(t)return;t=setTimeout(function(){t=0;f()},90)}}
var mo=new MutationObserver(debounced(function(){arm();vids();hero();heads();about();shares();cartExtras();paint();offers();themeSet();palette();placeBanners();payInit();footer();searchChips();syncTiles()}));
function boot(){arm();vids();hero();tick();mo.observe(document.getElementById('app-content')||document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
var n=0,iv=setInterval(function(){hero();heads();about();shares();cartExtras();paint();offers();themeSet();palette();placeBanners();payInit();footer();searchChips();arm();vids();tick();if(++n>40)clearInterval(iv)},500);
})();
