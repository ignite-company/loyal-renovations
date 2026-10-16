(function(){
"use strict";
const $=s=>document.querySelector(s);
const year=$("#year");if(year)year.textContent=new Date().getFullYear();
const menu=$("#menu-toggle"),links=$("#nav-links");
function closeMenu(){if(links)links.classList.remove("open");if(menu){menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","Open navigation");}}
if(menu&&links){menu.addEventListener("click",()=>{const open=links.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Close navigation":"Open navigation");});links.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));}
const modal=$("#quote-modal"),closeBtn=$("#modal-close");let lastFocus=null;
function closeQuote(){if(!modal)return;modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("locked");if(lastFocus&&lastFocus.focus)lastFocus.focus();}
function openQuote(){if(!modal){location.href="/contact/";return;}lastFocus=document.activeElement;closeMenu();modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("locked");setTimeout(()=>{const inp=modal.querySelector("input");if(inp)inp.focus();},50);}
document.querySelectorAll("[data-open-quote]").forEach(b=>b.addEventListener("click",openQuote));
if(closeBtn)closeBtn.addEventListener("click",closeQuote);
if(modal)modal.addEventListener("click",e=>{if(e.target===modal)closeQuote();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(modal&&modal.classList.contains("open"))closeQuote();else closeMenu();}if(e.key==="Tab"&&modal&&modal.classList.contains("open")){const els=Array.from(modal.querySelectorAll("button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]"));const first=els[0],last=els[els.length-1];if(first&&e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(last&&!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
const qs=new URLSearchParams(location.search),service=qs.get("service");
const allowed=["Kitchen remodeling","Bathroom remodeling","Whole-home renovation","Interior upgrades","Something else"];
if(service&&allowed.includes(service))document.querySelectorAll("select[name=service]").forEach(select=>{select.value=service;});
document.querySelectorAll(".inquiry-form").forEach(form=>form.addEventListener("submit",async e=>{
 e.preventDefault();if(!form.reportValidity())return;
 const fd=new FormData(form);
 const payload=Object.fromEntries(["name","email","phone","location","service","details","website"].map(k=>[k,String(fd.get(k)||"").trim()]));
 const btn=form.querySelector('button[type="submit"]');const feedback=form.querySelector(".form-feedback");
 if(!feedback||!btn)return;
 btn.disabled=true;feedback.textContent="Submitting your request...";feedback.className="form-feedback visible";
 try{
  const abort=new AbortController();const time=setTimeout(()=>abort.abort(),14000);let response;
  try{response=await fetch("/api/lead",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),signal:abort.signal});}finally{clearTimeout(time);}
  let data={};try{data=await response.json();}catch(_){}
  if(!response.ok||!data.ok)throw Error(data.message||"Your request could not be sent at this time.");
  form.reset();feedback.textContent="Your request has been sent. Our team will be in touch.";feedback.className="form-feedback visible success";
 }catch(err){feedback.textContent="We couldn't send your request just now. Please email asher.igniteco@gmail.com directly.";feedback.className="form-feedback visible error";}
 finally{btn.disabled=false;}
}));
const sections=Array.from(document.querySelectorAll("main section[id]"));
if(location.pathname==="/"&&"IntersectionObserver" in window){const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const id=e.target.id;document.querySelectorAll(".nav-links a").forEach(a=>{if(a.getAttribute("href")==="#"+id)a.classList.add("active");});}}),{rootMargin:"-25% 0px -68% 0px"});sections.forEach(s=>obs.observe(s));}
})();