const recipes = [
 {id:"tofu-bowl",name:"Ginger tofu and vegetable bowl",category:"Vegetarian",time:20,protein:18,sodium:280,calories:360,carbs:42,fat:12,vegetarian:true,steps:[["Prepare ingredients","Rinse the vegetables. Drain the tofu and cut it into bite-sized cubes."],["Cook the tofu","Warm a little oil in a pan. Add tofu and cook until lightly golden on several sides."],["Add vegetables","Add the vegetables and ginger. Stir-fry until tender but still colourful."],["Finish and serve","Season lightly, check the flavour and serve with a portion of brown rice."]] },
 {id:"fish-rice",name:"Steamed fish with brown rice",category:"Seafood",time:25,protein:30,sodium:320,calories:420,carbs:48,fat:9,vegetarian:false,steps:[["Prepare the fish","Pat the fish dry and place it on a heat-safe plate with ginger."],["Steam safely","Steam until the fish is opaque and cooked through. Check the thickest part with a food thermometer where available."],["Prepare the rice","Serve with cooked brown rice and vegetables."],["Serve","Add herbs and a squeeze of lime. Avoid adding too much salty sauce."]] },
 {id:"chicken-soup",name:"Chicken and vegetable soup",category:"Poultry",time:30,protein:27,sodium:390,calories:330,carbs:26,fat:10,vegetarian:false,steps:[["Prepare","Cut chicken and vegetables into evenly sized pieces. Wash hands and utensils after handling raw chicken."],["Simmer","Bring water or unsalted stock to a simmer. Add chicken and cook thoroughly."],["Add vegetables","Add vegetables and simmer until tender."],["Check and serve","Ensure chicken is fully cooked, then serve warm."]] },
 {id:"bean-salad",name:"Chickpea and cucumber salad",category:"Vegetarian",time:10,protein:13,sodium:190,calories:290,carbs:38,fat:9,vegetarian:true,steps:[["Prepare","Drain and rinse the chickpeas. Dice cucumber and tomato."],["Mix","Combine chickpeas, cucumber, tomato and chopped herbs."],["Dress","Add lemon juice and a little olive oil."],["Serve","Toss gently and serve."]] }
];
const ingredients = [
 {name:"Firm tofu",kcal:144,protein:17,carbs:3,fat:9,sodium:14},
 {name:"Brown rice, cooked",kcal:123,protein:2.7,carbs:25.6,fat:1,sodium:4},
 {name:"Chicken breast, cooked",kcal:165,protein:31,carbs:0,fat:3.6,sodium:74},
 {name:"White fish, cooked",kcal:120,protein:25,carbs:0,fat:2,sodium:80},
 {name:"Chickpeas, cooked",kcal:164,protein:8.9,carbs:27.4,fat:2.6,sodium:7},
 {name:"Cucumber",kcal:15,protein:.7,carbs:3.6,fat:.1,sodium:2},
 {name:"Broccoli",kcal:35,protein:2.4,carbs:7.2,fat:.4,sodium:41},
 {name:"Tomato",kcal:18,protein:.9,carbs:3.9,fat:.2,sodium:5}
];
const $ = id => document.getElementById(id);
let selected = JSON.parse(localStorage.getItem("nutrigo-ingredients")||"[]");
let currentRecipe = recipes[0], stepIndex = 0, cameraStream = null;
function route(){
 const id=(location.hash||"#home").slice(1);
 document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));
 document.querySelectorAll("[data-nav]").forEach(a=>a.classList.toggle("active",a.dataset.nav===id));
 if(!document.getElementById(id)) location.hash="#home";
}
window.addEventListener("hashchange",route); route();
function recipeCard(r){return `<article class="recipe-card"><span class="tag">${r.category}</span><span class="tag">${r.time} min</span><h3>${r.name}</h3><p>${r.calories} kcal demo estimate · ${r.protein}g protein · ${r.sodium}mg sodium per serving (illustrative).</p><div class="recipe-meta">${r.steps.length} guided cooking steps</div><button class="button button-primary full open-recipe" data-id="${r.id}" style="margin-top:13px">View cooking guide</button></article>`}
function renderRecipes(){
 const q=$("recipeSearch").value.toLowerCase();
 $("recipeList").innerHTML=recipes.filter(r=>(r.name+" "+r.category).toLowerCase().includes(q)).map(recipeCard).join("");
 document.querySelectorAll(".open-recipe").forEach(b=>b.addEventListener("click",()=>{setRecipe(b.dataset.id);location.hash="#cook"}));
}
$("recipeSearch").addEventListener("input",renderRecipes); renderRecipes();
function fillRecipeSelects(){
 ["cookRecipe"].forEach(id=>$(id).innerHTML=recipes.map(r=>`<option value="${r.id}">${r.name}</option>`).join(""));
}
fillRecipeSelects();
function setRecipe(id){currentRecipe=recipes.find(r=>r.id===id)||recipes[0];stepIndex=0;$("cookRecipe").value=currentRecipe.id;renderStep()}
function renderStep(){
 const s=currentRecipe.steps[stepIndex];$("stepCount").textContent=`STEP ${stepIndex+1} OF ${currentRecipe.steps.length}`;$("stepTitle").textContent=s[0];$("stepText").textContent=s[1];$("cameraHint").textContent=`Now: ${s[0].toLowerCase()}. ${s[1]}`;
}
$("cookRecipe").addEventListener("change",e=>setRecipe(e.target.value));
$("prevStep").addEventListener("click",()=>{stepIndex=Math.max(0,stepIndex-1);renderStep()});
$("nextStep").addEventListener("click",()=>{stepIndex=(stepIndex+1)%currentRecipe.steps.length;renderStep()});
setRecipe(recipes[0].id);
$("startCamera").addEventListener("click",async()=>{
 if(!navigator.mediaDevices?.getUserMedia){$("cameraHint").textContent="Camera access is unavailable in this browser or page context. Use HTTPS and a supported browser.";return}
 try{cameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});$("camera").srcObject=cameraStream;$("cameraHint").textContent="Camera is active on your device. Video stays in this browser; it is not uploaded by this prototype."}
 catch(e){$("cameraHint").textContent="Camera permission was not granted or no camera is available. You can still follow the written steps."}
});
$("stopCamera").addEventListener("click",()=>{if(cameraStream)cameraStream.getTracks().forEach(t=>t.stop());cameraStream=null;$("camera").srcObject=null;$("cameraHint").textContent="Camera stopped."});
window.addEventListener("pagehide",()=>{if(cameraStream)cameraStream.getTracks().forEach(t=>t.stop())});
$("ingredientSelect").innerHTML=ingredients.map((x,i)=>`<option value="${i}">${x.name}</option>`).join("");
function renderSelected(){
 $("selectedIngredients").innerHTML=selected.map((x,i)=>`<div class="selected-item"><span>${x.name} · ${x.grams}g</span><button class="remove" data-index="${i}" aria-label="Remove ${x.name}">Remove</button></div>`).join("")||'<p class="microcopy">No ingredients added yet.</p>';
 document.querySelectorAll(".remove").forEach(b=>b.addEventListener("click",()=>{selected.splice(+b.dataset.index,1);saveSelected()}));
 const t=selected.reduce((a,x)=>{const f=x.grams/100;for(const k of ["kcal","protein","carbs","fat","sodium"])a[k]+=x[k]*f;return a},{kcal:0,protein:0,carbs:0,fat:0,sodium:0});
 $("totalCalories").textContent=Math.round(t.kcal);$("totalProtein").textContent=t.protein.toFixed(1);$("totalCarbs").textContent=t.carbs.toFixed(1);$("totalFat").textContent=t.fat.toFixed(1);$("totalSodium").textContent=Math.round(t.sodium);
}
function saveSelected(){localStorage.setItem("nutrigo-ingredients",JSON.stringify(selected));renderSelected()}
$("addIngredient").addEventListener("click",()=>{const item=ingredients[+$("ingredientSelect").value];const grams=Math.max(1,Math.min(2000,+$("quantity").value||100));selected.push({...item,grams});saveSelected()});
renderSelected();
function recommend(){
 const goal=$("goal").value,diet=$("diet").value;
 const scored=recipes.filter(r=>diet!=="vegetarian"||r.vegetarian).map(r=>{
  let score=0,reason=[];
  if(goal==="protein"){score+=r.protein;reason.push("higher protein among this demo recipe set")}
  else if(goal==="lower-sodium"){score-=r.sodium/10;reason.push("lower sodium among this demo recipe set")}
  else if(goal==="vegetarian"){score+=r.vegetarian?20:-100;reason.push("vegetarian option")}
  else if(goal==="quick"){score-=r.time;reason.push("shorter preparation time")}
  else{score+=r.protein*.5-r.sodium/30;reason.push("a balance of the demo protein and sodium values")}
  return {...r,score,reason:reason.join("; ")};
 }).sort((a,b)=>b.score-a.score);
 $("recommendations").innerHTML=scored.map(r=>`<div class="recommendation"><b>${r.name}</b><p>${r.reason}. ${r.time} minutes · illustrative values: ${r.calories} kcal, ${r.protein}g protein, ${r.sodium}mg sodium per serving.</p><button class="button button-light open-recipe" data-id="${r.id}">Open cooking guide</button></div>`).join("")||"<p>No matching demo recipes. Try changing the filters.</p>";
 document.querySelectorAll("#recommendations .open-recipe").forEach(b=>b.addEventListener("click",()=>{setRecipe(b.dataset.id);location.hash="#cook"}));
}
$("getRecommendations").addEventListener("click",recommend);recommend();
let installPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("installBtn").classList.remove("hidden")});
$("installBtn").addEventListener("click",async()=>{if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("installBtn").classList.add("hidden")}else alert("On iPhone/iPad, open this site in Safari, tap Share, then Add to Home Screen.")});
if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(()=>{});
