// all the magic  
function assemble() {
  if(Game.pStunned) {return;}
  var reagents = '';
  $('#bench .icon').each(function() {
    reagents += $(this).data('ingredient');
    $(this).remove();
    });
  reagents = reagents.split('').sort().join('');
  //cl(reagents);
  if(window["spellbombsKnown"][reagents]) {
    window["spellbombsKnown"][reagents]();
    assemblyTrophies(reagents);
    }
  else {cl("You don't know that recipe.");}
  checkRecipe();
  }
  
function assemblyTrophies(reagents) {
  for(var i = 0; i < disciplines.length; i++) {
    var ing = disciplines[i].substr(0,1);
    if(reagents.indexOf(ing)>-1) {
      // bomber trophies
      localStorage[disciplines[i]+"Bomber"] = parseInt(localStorage[disciplines[i]+"Bomber"])+1;
      cl(ing+" was in your recipe!");
      hiScore(disciplines[i]+"Bomber");
      // dabbler trophy
      if(localStorage[disciplines[i]+"Bomber"]==1) {cl('from 0 to 1'); localStorage.dabbler = parseInt(localStorage.dabbler) + 1; hiScore('dabbler');}
      if(localStorage.CombustionBomber>0&&localStorage.MetallurgyBomber>0&&localStorage.ReanimationBomber>0&&localStorage.AstrologyBomber>0&&localStorage.NaturalismBomber>0&&localStorage.ToxicologyBomber>0) {
        localStorage.dabbler = 6; awardTrophy('dabbler');
        }
      // combo trophies
      localStorage[disciplines[i]+'Combo'] = parseInt(localStorage[disciplines[i]+'Combo'])+1;
      if(localStorage[disciplines[i]+'Combo']>=10) {awardTrophy('combo'+disciplines[i].substr(0,1));}
      //hiScore(disciplines[i]+'Combo');
      
      }
    else {
      localStorage[disciplines[i]+'Combo'] = 0;
      }
    }
  }
  
function recipe(reagents) {
  var ingredients = reagents.split(''); var icons = '';
  for(var i = 0; i < ingredients.length; i++) {
    icons = icons + '<div class="icon '+ingredients[i]+'"><img src="'+ingredients[i]+'.png" /></div>';
    }
  var stuff = '<div class="recipe '+reagents+'" data-recipe="'+reagents+'">'+icons+'<span class="name">'+spellbomb_names[reagents]+'</span></div>';
  return stuff;
  }

function resetRecipes() {
  for (var key in spellbombs) {
    localStorage["known"+key] = false;
    }
  }
  
// initialize recipes known
localStorage.knownC = true;
localStorage.knownM = true;
localStorage.knownR = true;
localStorage.knownA = true;
localStorage.knownN = true;
localStorage.knownT = true;

function learnRandom(discipline) {
  discipline = typeof discipline !== 'undefined' ? discipline : false;
  var recipeKnown = basicIng()+basicIng();
  recipeKnown = recipeKnown.split('').sort().join('');
  if(!discipline||recipeKnown.indexOf(discipline)>-1) {
    if(localStorage["known"+recipeKnown]!='true') {
      gainRecipe(recipeKnown);
      cl("You begin knowing the "+recipeKnown+" recipe.");
      }
    else {
      cl(localStorage["known"+recipeKnown]);
      cl('was gonna learn '+recipeKnown+', but no duplicates!'); learnRandom(discipline);
      }
    }
    else {learnRandom(discipline);} // you needed to learn a recipe for a specific discipline, and didn't; try again
  }
  
// describe potential recipe on-screen
function checkRecipe() {
  $('#recipe').html('');
  //cl("triggering");
  var reagents = '';
  $('#bench .icon').each(function() {
    reagents += $(this).data('ingredient');
    }).clone().appendTo('#recipe');
  reagents = reagents.split('').sort().join('');
  if(window["spellbomb_descriptions"][reagents]&&window["spellbombsKnown"][reagents]) {$('#recipe').append('<span>'+formatRecipe(window["spellbomb_descriptions"][reagents])+'</span>');}
  else if($('#recipe').html()) {$('#recipe').append('<span>'+"No known recipe."+'</span>');}
  else {$('#recipe').html('');}
  }
  
// dictionary for spellbombs
var spellbombs = {
  C: function() {cl('BOOM!'); if(!protector()) {damage("baddie", 2, 'C');}},
  CC: function() {cl('BIGGER BOOM!'); if(!protector()) {damage("baddie", 5, 'C');}},
  CCC: function() {cl('BIGGER BOOM!'); if(!protector()) {damage("baddie", 10, 'C');}},
  N: function() {cl('HEAL');  heal(2);},
  NN: function() {cl('HEAL MORE');  heal(5);},
  NNN: function() {cl('HEAL MOST');  heal(10);},
  M: function() {cl('FORTIFY 1');  fortify("you", 1, 15000);},
  MM: function() {cl('FORTIFY 3');  fortify("you", 3, 15000);},
  MMM: function() {cl('FORTIFY 5');  fortify("you", 5, 15000);},
  R: function() {cl('DRAIN 1');  if(!protector()) {damage("baddie", 1, 'R', false, true);}},
  RR: function() {cl('ZAP 4 SEC');  if(!protector()) {zap(5000);}},
  RRR: function() {cl('DRAIN 4');  if(!protector()) {damage("baddie", 4, 'R', false, true);}},
  A: function() {cl('AVOID 1 SEC');  fortify('you', 99, 1000);},
  AA: function() {cl('DRAW FASTER');  drawFaster(500, 15000);},
  AAA: function() {cl('AVOID 4 SECS');  fortify('you', 99, 4000);},
  T: function() {cl('POISON 3/6');  if(!protector()) {poison(3, 6000);}},
  TT: function() {cl('POISON 9/6');  if(!protector()) {poison(9, 6000);}},
  TTT: function() {cl('POISON 15/6');  if(!protector()) {poison(15, 6000);}},
  CM: function() {
    cl("DOUBLE DAMAGE");
    Game.doubling = true; Game.doublingDuration +=15000;
    if(!$('.effect.Engine.Breath').length) {var rand = Math.floor(Math.random()*1000000000); statusEffect('Engine Breath', rand);}
    },
  CR: function() {cl('HURT EVERYONE'); damage("you", 3, 'CR', true); if(battling) {if(!protector()) {damage("baddie", 7, 'CR');}}},
  CN: function() {
    cl("DAMAGE +2");
    //var dBuff = parseInt($('#you .damage span').text()); dBuff += 2;
    //$('#you .damage span').text('+'+dBuff);
    weaken(-2, true, 'you');
    },
  CT: function() {cl('BYPASS BOOM!'); if(!protector()) {damage("baddie", 4, 'CT', true);}},
  MN: function() {
    cl("DAMAGE +1, ARMOR +1");
    //var dBuff = parseInt($('#you .damage span').text()); dBuff += 1;
    //$('#you .damage span').text('+'+dBuff);
    armorD("you", 1);
    weaken(-1, true, 'you');
    },
  MR: function() {
    damage("you", 8, 'MR', true);
    armorD("you", 4);
    },
  MT: function() {cl('ARMOR ENEMY, REDUCE ITS ATTACK'); if(!protector()) {wither(-2); weaken(4);}},
  MTT: function() {cl('STRIP ENEMY ARMOR'); if(!protector()) {wither(5);}},
  NR: function() {
    cl("ORGAN RUN");
    Game.runningOrgans = true; Game.organDuration +=15000;
    if(!$('.effect.Running.Organs').length) {var rand = Math.floor(Math.random()*1000000000); statusEffect('Running Organs', rand);}
    },
  NT: function() {
    cl("WITHER SELF TO HEAL");
    wither(2, true, "you");
    heal(99);
    },
  CCRR: function() {cl('vaporize enemy'); if(!protector()) {bEnd(true);}},
  AC: function() {
    cl('enemy hits itself'); 
    var enemyDamage = parseInt($('#baddie .damage span').text());
    poisonDmg(enemyDamage);
    },
  AR: function() {
    cl('discard to heal');
    if($('#hand .reagent').length) {
      discard(1);
      heal(8); }
    else { warn("You couldn't discard, so you didn't heal."); }
    },
  AM: function() { var stars = $('#hand .reagent').length; armorD("you", stars); cl('ARMOR BY HAND'); },
  AN: function() {benchAdd('N'); fortify('you', 99, 1000); heal(2);},
  AT: function() {var penalty = Math.floor(Math.random() * (5 - 1 + 1)) + 1; cl(penalty); weaken(penalty);},
  AAC: function() {var burst = randomInt(1,20); cl(burst+" DAMAGE"); if(!protector()) {damage("baddie", burst, 'AC');}},
  RT: function() {Game.thorns = 2; Game.thornsDuration +=20000; 
    if(!$('.effect.Thorns').length) {var rand = Math.floor(Math.random()*1000000000); statusEffect('Thorns', rand);}
    }
  }
  
// dictionary for KNOWN spellbombs
var spellbombsKnown = {
  }
  
// recipe descriptions
var spellbomb_descriptions = {
  C: "Deal %2 damage.",
  CC: "Deal %5 damage.",
  CCC: "Deal %10 damage.",
  N: "Heal %2 .",
  NN: "Heal %5 .",
  NNN: "Heal %10 .",
  M: "Armor +1 for 15s.",
  MM: "Armor +3 for 15s.",
  MMM: "Armor +5 for 15s.",
  R: "Deal %1 damage; heal 1 per damage dealt.",
  RR: "Stun enemy for 5s.",
  RRR: "Deal %4 damage; heal 1 per damage dealt.",
  A: "Prevent all damage for 1s.",
  AA: "Draw cards faster for 15s.",
  AAA: "Prevent all damage for 4s.",
  T: "3 poison damage over 6s.",
  TT: "9 poison damage over 6s.",
  TTT: "15 poison damage over 6s.",
  CM: 'Double your damage for 15s.',
  CR: "Deal %7 damage; take 3 damage.",
  CN: "Damage +2.",
  CT: "Deal %4 damage; ignores armor.",
  MN: "Damage +1; armor +1.",
  MR: "Lose 8 life; armor +4.",
  MT: "Enemy damage -4, but armor +2.",
  MTT: "Enemy armor -5.",
  NR: '+<img src="N.png" /> or +<img src="R.png" /> when hit for 15s.',
  NT: 'Lose 2 armor; heal to full.',
  CCRR: "Vaporize enemy; win instantly.",
  AC: "Enemy hits itself.",
  AR: 'Discard a card to heal 8.',
  AM: 'Armor +1 per card in hand.',
  AN: 'Heal %2 ; avoid attack for 1s; +<img src="N.png" />',
  AT: 'Decrease enemy damage randomly.',
  AAC: 'Deal between 1% and 20% damage.',
  RT: 'Deal 2 damage when hit for 20s.',
  }
  
// recipe names
var spellbomb_names = {
  C: "Sublimation Stone",
  CC: "Scrapnado",
  CCC: "Shock &amp; Awe",
  N: "Roottap Touch",
  NN: "Snaptooth Tincture",
  NNN: "Benevolent Experiment",
  M: "Brickbag Bottle",
  MM: "Telkine Tonic",
  MMM: "Shielded Experiment",
  R: "Flesh Theft",
  RR: "Zap the Brainstem",
  RRR: "Flesh Heist",
  A: "Shield with Moonlight",
  AA: "Fortune in a Bottle",
  AAA: "Aether Nimbus",
  T: "Grub Toxin",
  TT: "Pupa Toxin",
  TTT: "Imago Toxin",
  CM: 'Engine Breath',
  CR: 'Divebomb',
  CN: "Call to Hunt",
  CT: 'Insult to Injury',
  MN: "Philosopher's Armor",
  MR: 'Svinskinn Skin',
  MT: 'Fatigue Helm',
  MTT: "Rust Quill",
  NR: 'Organ Run',
  NT: 'Bad Medicine',
  CCRR: "Stormfire",
  AC: "Soul Flare",
  AR: 'Reshape Parts',
  AM: 'Magesteel Armor',
  AN: 'Scaper Salve',
  AT: 'Qamarin Curse',
  AAC: 'Supernova',
  RT: 'Toxic Duct',
  }
  
for (var key in spellbombs) {
  //cl('hi'); 
  //cl(localStorage["known"+key]);
  if(localStorage["known"+key]=='true') {
    //cl("you know "+key);
    spellbombsKnown[key] = spellbombs[key];
    }
  }