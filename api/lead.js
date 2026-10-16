// Secure server-side inquiry delivery via Resend.
// Configure RESEND_API_KEY, LEAD_FROM_EMAIL (verified sender), LEAD_TO_EMAILS (comma-separated recipients).
// This endpoint fails closed until the sending service is configured.
module.exports = async (req,res) => {
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({ok:false,message:"Method not allowed"});}
 const host=String(req.headers.host||"").split(":")[0];
 if(req.headers.origin){try{if(new URL(req.headers.origin).hostname!==host)return res.status(403).json({ok:false,message:"Invalid request origin"});}catch(_){return res.status(403).json({ok:false,message:"Invalid request origin"});}}
 const len=Number(req.headers["content-length"]||0);
 if(len>12000)return res.status(413).json({ok:false,message:"Request too large"});
 let data;try{data=typeof req.body==="string"?JSON.parse(req.body||"{}"):(req.body||{});}catch(_){return res.status(400).json({ok:false,message:"Invalid request body"});}
 const get=(key,cap)=>typeof data[key]==="string"?data[key].trim().slice(0,cap):"";
 const name=get("name",100).replace(/[\r\n]/g," "),email=get("email",180),phone=get("phone",60),location=get("location",130),service=get("service",80),details=get("details",3000),website=get("website",200);
 if(website)return res.status(200).json({ok:true});
 const allowed=new Set(["Kitchen remodeling","Bathroom remodeling","Whole-home renovation","Interior upgrades","Something else"]);
 if(!name||!email||!phone||!location||!allowed.has(service)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){return res.status(422).json({ok:false,message:"Please complete all required fields"});}
 const apiKey=process.env.RESEND_API_KEY,from=process.env.LEAD_FROM_EMAIL;
 const recipients=String(process.env.LEAD_TO_EMAILS||"").split(",").map(x=>x.trim()).filter(Boolean);
 if(!apiKey||!from||recipients.length<1){return res.status(503).json({ok:false,message:"Inquiry email delivery is not yet configured"});}
 const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
 const fields=[["Name",name],["Email",email],["Phone",phone],["Project location",location],["Project type",service],["Project details",details||"Not provided"]];
 const markup='<div style="font-family:Arial,sans-serif;color:#152234;max-width:640px;margin:auto"><h1 style="font-size:24px">New Loyal Renovations inquiry</h1>'+fields.map(([k,v])=>'<p><strong>'+esc(k)+':</strong><br>'+esc(v).replace(/\n/g,"<br>")+'</p>').join("")+'</div>';
 try{
 const result=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+apiKey,"Content-Type":"application/json"},body:JSON.stringify({from,to:recipients,reply_to:email,subject:"Loyal Renovations inquiry: "+name,html:markup})});
 if(!result.ok){console.error("Email delivery provider rejected request, status",result.status);return res.status(502).json({ok:false,message:"Unable to deliver inquiry"});}
 return res.status(200).json({ok:true});
 }catch(error){console.error("Email delivery unavailable");return res.status(502).json({ok:false,message:"Unable to deliver inquiry"});}
};