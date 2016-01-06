// init kills
if (localStorage.kills) {
    localStorage.kills = Number(localStorage.kills);
} else {
    localStorage.kills = 0;
}
// init roomsNormal
if (localStorage.roomsNormal) {
    localStorage.roomsNormal = Number(localStorage.roomsNormal);
} else {
    localStorage.roomsNormal = 0;
}
// init roomsSurvival
if (localStorage.roomsSurvival) {
    localStorage.roomsSurvival = Number(localStorage.roomsSurvival);
} else {
    localStorage.roomsSurvival = 0;
}

// init trophies
if (localStorage.trophies) {
    localStorage.trophies = Number(localStorage.trophies);
} else {
    localStorage.trophies = 0;
}

// init some stats
if(!localStorage.collector) {localStorage.collector = 0;}
if(!localStorage.sandbag) {localStorage.sandbag = 0;}
if(!localStorage.resets) {localStorage.resets = 0;}

// dictionary of trophies
var trophies = {
  TK1: {name: 'Cutthroat', text: 'Kill 100 monsters', tied: 'kills', goal: 100},
  TK2: {name: 'Butcher', text: 'Kill 1,000 monsters', tied: 'kills', goal: 1000, req: 'TK1'},
  TK3: {name: 'Executioner', text: 'Kill 10,000 monsters', tied: 'kills', goal: 10000, req: 'TK2'},
  TK4: {name: 'Slaughterer', text: 'Kill 100,000 monsters', tied: 'kills', goal: 100000, req: 'TK3'},
  TK5: {name: 'Alchemical Annihilator', text: 'Kill 1,000,000 monsters', tied: 'kills', goal: 1000000, req: 'TK4'},
  DN1: {name: 'Gopher', text: 'Reach Room 5 in Normal Mode', tied: 'roomsNormal', goal: 5},
  DN2: {name: 'Initiate', text: 'Reach Room 10 in Normal Mode', tied: 'roomsNormal', goal: 10, req: 'DN1'},
  DN3: {name: 'Assistant', text: 'Reach Room 20 in Normal Mode', tied: 'roomsNormal', goal: 20, req: 'DN2'},
  DN4: {name: 'Apprentice', text: 'Reach Room 30 in Normal Mode', tied: 'roomsNormal', goal: 30, req: 'DN3'},
  DN5: {name: 'Journeyman', text: 'Reach Room 40 in Normal Mode', tied: 'roomsNormal', goal: 40, req: 'DN4'},
  DN6: {name: 'Veteran', text: 'Reach Room 50 in Normal Mode', tied: 'roomsNormal', goal: 50, req: 'DN5'},
  DN7: {name: 'Master', text: 'Reach Room 100 in Normal Mode', tied: 'roomsNormal', goal: 100, req: 'DN6'},
  DN8: {name: 'Elite', text: 'Reach Room 500 in Normal Mode', tied: 'roomsNormal', goal: 500, req: 'DN7'},
  DN9: {name: 'Philosopher', text: 'Reach Room 1000 in Normal Mode', tied: 'roomsNormal', goal: 1000, req: 'DN8'},
  DS1: {name: 'Lucky I', text: 'Reach Room 5 in Survival Mode', tied: 'roomsSurvival', goal: 5},
  DS2: {name: 'Lucky II', text: 'Reach Room 10 in Survival Mode', tied: 'roomsSurvival', goal: 10, req: 'DS1'},
  DS3: {name: 'Lucky III', text: 'Reach Room 20 in Survival Mode', tied: 'roomsSurvival', goal: 20, req: 'DS2'},
  DS4: {name: 'Lucky IV', text: 'Reach Room 30 in Survival Mode', tied: 'roomsSurvival', goal: 30, req: 'DS3'},
  DS5: {name: 'Lucky V', text: 'Reach Room 40 in Survival Mode', tied: 'roomsSurvival', goal: 40, req: 'DS4'},
  DS6: {name: 'Lucky VI', text: 'Reach Room 50 in Survival Mode', tied: 'roomsSurvival', goal: 50, req: 'DS5'},
  DS7: {name: 'Lucky VII', text: 'Reach Room 100 in Survival Mode', tied: 'roomsSurvival', goal: 100, req: 'DS6'},
  DS8: {name: 'Lucky VIII', text: 'Reach Room 500 in Survival Mode', tied: 'roomsSurvival', goal: 500, req: 'DS7'},
  DS9: {name: 'Survivorer', text: 'Reach Room 1000 in Survival Mode', tied: 'roomsSurvival', goal: 1000, req: 'DS8'},
  R1: {name: 'Baby\'s First Reset', text: 'Reset once', secret: true},
  RP4: {name: 'Big Spender', text: 'Buy something expensive'},
  RP2: {name: 'Shipment Sovereign', text: 'Buy all reagents without resetting'},
  RP1: {name: 'The Whole Cookbook', text: 'Buy all recipes without resetting'},
  RPC: {name: 'Erudite Combuster', text: 'Buy all <img src="C.png" /> recipes without resetting'},
  RPM: {name: 'Erudite Metallurgist', text: 'Buy all <img src="M.png" /> recipes without resetting'},
  RPR: {name: 'Erudite Reanimator', text: 'Buy all <img src="R.png" /> recipes without resetting'},
  RPA: {name: 'Erudite Astrologer', text: 'Buy all <img src="A.png" /> recipes without resetting'},
  RPN: {name: 'Erudite Naturalist ', text: 'Buy all <img src="N.png" /> recipes without resetting'},
  RPT: {name: 'Erudite Toxicologist ', text: 'Buy all <img src="T.png" /> recipes without resetting'},
  RP3: {name: 'Maskolgoy', text: 'Buy all cosmetics without resetting'},
  FDV: {name: 'Living Dangerously', text: 'Build your deck so every reagent vaporizes'},
  FDH: {name: 'High Roller', text: 'Build your deck so every reagent has 2 ingredients'},
  FDC: {name: 'Focused Combuster', text: 'Build your deck so every reagent has <img src="C.png" />'},
  FDM: {name: 'Focused Metallurgist', text: 'Build your deck so every reagent has <img src="M.png" />'},
  FDR: {name: 'Focused Reanimator', text: 'Build your deck so every reagent has <img src="R.png" />'},
  FDA: {name: 'Focused Astrologer', text: 'Build your deck so every reagent has <img src="A.png" />'},
  FDN: {name: 'Focused Naturalist', text: 'Build your deck so every reagent has <img src="N.png" />'},
  FDT: {name: 'Focused Toxicologist', text: 'Build your deck so every reagent has <img src="T.png" />'},
  FDJ: {name: 'Hard Gamblin\'', text: 'Build your deck so every reagent has <img src="J.png" />'},
  LOL: {name: 'Be the Bat', text: 'Cheat', secret: true},
  pacifist: {name: 'Pacifist', text: 'Settle your differences with a monster peacefully', secret: true},
  empty: {name: 'Empty Deck Syndrome', text: 'Reduce your deck size until you can\'t draw cards', secret: true},
  leet: {name: 'LEET', text: 'Have 1337 coins', secret: true},
  rainbow: {name: 'Rainbow', text: 'Build a deck with every ingredient in it', secret: true},
  }
  
// trophies for assembling spellbombs
trophies.dabbler = {name: 'Dabbler', text: 'Assemble a spellbomb of every discipline', tied: 'dabbler', goal: 6}
var disciplines = ['Combustion', 'Metallurgy', 'Reanimation', 'Astrology', 'Naturalism', 'Toxicology'];
for (var i = 0; i < disciplines.length; i++) {
  var br = disciplines[i];
  if(!localStorage[br+"Bomber"]) {localStorage[br+"Bomber"]=0;}
  trophies['AS'+disciplines[i]+'1'] = {name: br+' Bomber I', text: 'Assemble 10 '+br+' spellbombs', tied: br+'Bomber', goal: 10}
  trophies['AS'+disciplines[i]+'2'] = {name: br+' Bomber II', text: 'Assemble 100 '+br+' spellbombs', tied: br+'Bomber', goal: 100, req: 'AS'+disciplines[i]+'1'}
  trophies['AS'+disciplines[i]+'3'] = {name: br+' Bomber III', text: 'Assemble 1000 '+br+' spellbombs', tied: br+'Bomber', goal: 1000, req: 'AS'+disciplines[i]+'2'}
  trophies['AS'+disciplines[i]+'4'] = {name: br+' Bomber IV', text: 'Assemble 10000 '+br+' spellbombs', tied: br+'Bomber', goal: 1000, req: 'AS'+disciplines[i]+'3'}
  trophies['AS'+disciplines[i]+'5'] = {name: br+' Bomber IV', text: 'Assemble 100000 '+br+' spellbombs', tied: br+'Bomber', goal: 10000, req: 'AS'+disciplines[i]+'3'}
  trophies['AS'+disciplines[i]+'6'] = {name: br+' Bomber IV', text: 'Assemble 1000000 '+br+' spellbombs', tied: br+'Bomber', goal: 100000, req: 'AS'+disciplines[i]+'3'}
  }

// trophies for killing subtypes
trophies.collector = {name: 'Collector', text: 'Kill 1 of each monster type', tied: 'collector', goal: subtypes.length}
for (var i = 0; i < subtypes.length; i++) {
  var st = subtypes[i];
  if(!localStorage[st+"Slayer"]) {localStorage[st+"Slayer"]=0;}
  trophies['KS'+subtypes[i]+'1'] = {name: st+' Slayer I', text: 'Kill a '+st, tied: st+'Slayer', goal: 1}
  trophies['KS'+subtypes[i]+'2'] = {name: st+' Slayer II', text: 'Kill 5 '+st+'s', tied: st+'Slayer', goal: 5, req: 'KS'+subtypes[i]+'1'}
  trophies['KS'+subtypes[i]+'3'] = {name: st+' Slayer III', text: 'Kill 100 '+st+'s', tied: st+'Slayer', goal: 100, req: 'KS'+subtypes[i]+'2'}
  trophies['KS'+subtypes[i]+'4'] = {name: st+' Slayer IV', text: 'Kill 1,000 '+st+'s', tied: st+'Slayer', goal: 1000, req: 'KS'+subtypes[i]+'3'}
  }
  
// trophies for killing affixed monsters
for (var i = 0; i < affixes.length; i++) {
  if(affixes[i].length) {
    //cl(affixes[i]);
    trophies["KS"+affixes[i]] = {name: affixes[i]+' Slayer', text: 'Kill a '+affixes[i]+' monster', secret: true}
    }
  //trophies['AS'+disciplines[i]+'1'] = {name: br+' Bomber I', text: 'Assemble 10 '+br+' spellbombs', tied: br+'Bomber', goal: 10}
  //trophies['AS'+disciplines[i]+'2'] = {name: br+' Bomber II', text: 'Assemble 100 '+br+' spellbombs', tied: br+'Bomber', goal: 100, req: 'AS'+disciplines[i]+'1'}
  }
  
// trophies for dying to subtypes
trophies.sandbag = {name: 'The Ultimate Sandbag', text: 'Get killed by every monster type', tied: 'sandbag', goal: subtypes.length}
for (var i = 0; i < subtypes.length; i++) {
  var st = subtypes[i];
  if(!localStorage[st+"Prey"]) {localStorage[st+"Prey"]=0;}
  trophies['PS'+subtypes[i]+'1'] = {name: st+' Prey', text: 'Get killed by a '+st, tied: st+'Prey', goal: 1}
  }
  
// initialize stored obtained trophies, with some placeholders for now
if(!localStorage.trophiesObtained) {localStorage.trophiesObtained = ['lol', 'hi1'];}

// function to check if the player has a given trophy
function hasTrophy(trophy) {
  if(localStorage.trophiesObtained.indexOf(trophy)>-1) {return true;}
  else {return false;}
  }
  
// list trophies on the trophy screen
function listTrophies() {
  for (var key in trophies) {
    //cl(key);
    var progress = 0;
    var status = 'unobtained';
    var prereq = trophies[key]["req"]; //cl(prereq);
    var trophyText = "<span> "+trophies[key]["name"]+"</span><p>"+trophies[key]["text"]+'.</p>';
    if(trophies[key]["tied"]) {
      var stat = trophies[key]["tied"];
      var prog = Math.min(localStorage[stat], trophies[key]["goal"]);
      trophyText = '<div class="progress">'+prog+'/'+trophies[key]["goal"]+'</div>'+trophyText;
      progress = Math.floor(100*parseInt(prog)/parseInt(trophies[key]["goal"]));
      //cl(progress);
      }
    if(hasTrophy(key)) {status = 'obtained'; progress = 100;}
    //cl(prereq);
    if(!prereq||(prereq&&hasTrophy(prereq))) { // only show ones there's no prereq for, or that you have the prereq for
      $('#trophies').append('<div class="trophy '+key+' '+status+'">'+trophyText+'</div>');
      }
    //cl('.'+key+':after');
    $('body').append('<style>.'+key+':after {width: '+progress+'%;}</style>');
    $('.'+key+':after').hide();//.css('width', progress+'%');
    if(status=='obtained'&&hasTrophy(prereq)) {$('.'+prereq).hide();}
    if(status=='unobtained'&&trophies[key]["secret"]) {$('.'+key).addClass('ninja');}
    }
  }

// function to check if we've hit a new hi score, and if so, whether or not we get a trophy
function hiScore(stat) {
  for (var key in trophies) {
    if(trophies[key]["tied"]==stat&&localStorage[stat]>=trophies[key]["goal"]) {awardTrophy(key);}
    }
  }
  
// function to award a given trophy
function awardTrophy(trophy) {
  if(!hasTrophy(trophy)) {
    localStorage.trophies++;
    localStorage.trophiesObtained += ','+trophy;
    prize("<img src='trophy-black.png' /> <span>"+trophies[trophy]["name"]+"</span> <img src='trophy-black.png' />");
    $('.trophies').html(localStorage.trophies);
    $('.'+trophy ).removeClass('unobtained, ninja').addClass('obtained');
    }
  }
