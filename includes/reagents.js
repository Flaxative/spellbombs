// dictionaries for reagent cards
var basic_reagents = ['C', 'M', 'R', 'A', 'N', 'T', 'J'];
//var basic_reagents = ['N', 'M', 'C' /*, '1'*/]; // for testing
var ingredients = ['C', 'M', 'R', 'A', 'N', 'T'];

var other_reagents = ['JJ', 'CJ', 'MJ', 'RJ', 'AJ', 'NJ', 'TJ', 'CC', 'CM', 'CR', 'CA', 'CN', 'CT', 'MM', 'MR', 'MA', 'MN', 'MT', 'RR', 'RA', 'RN', 'RT', 'AA', 'AN', 'AT', 'NN', 'NT', 'TT' /*, 'CC', 'CM', 'CR', 'CA', 'CN', 'CT', 'MM', 'MR', 'MA', 'MN', 'MT', 'RR', 'RA', 'RN', 'RT', 'AA', 'AN', 'AT', 'NN', 'NT', 'TT', *//*'CCr', 'CMr', 'CRr', 'CAr', 'CNr', 'CTr', 'MMr', 'MRr', 'MAr', 'MNr', 'MTr', 'RRr', 'RAr', 'RNr', 'RTr', 'AAr', 'ANr', 'ATr', 'NNr', 'NTr', 'TTr'*/];

// establish which reagents can be bought
var buyable_reagents = ['CJr', 'MJr', 'RJr', 'AJr', 'NJr', 'TJr', 'JJr', 'CCr', 'CMr', 'CRr', 'CAr', 'CNr', 'CTr', 'MMr', 'MRr', 'MAr', 'MNr', 'MTr', 'RRr', 'RAr', 'RNr', 'RTr', 'AAr', 'ANr', 'ATr', 'NNr', 'NTr', 'TTr'];
// on initiation of the game, push all saved reagent purchases into the 'other_reagents' array
var buyableLength = buyable_reagents.length;
for (var i = 0; i < buyableLength; i++) {
  if(localStorage["bought"+buyable_reagents[i]]=='true') {
    other_reagents.push(buyable_reagents[i]); 
    cl('Purchased Reagent: '+buyable_reagents[i]); 
    }
  }

function resetReagents() {
  for (var i = 0; i < buyableLength; i++) {
    localStorage["bought"+buyable_reagents[i]] = false;
    }
  }

// SMART LOOT SYSTEM :D
function findUsefulReagent() {
  var active_reagents = [];
  active_reagents = active_reagents.concat(basic_reagents, other_reagents);
  //cl(active_reagents); // debug
  
  var advanced_spellbombs = [];
  for (var key in spellbombs) {
  if(localStorage["known"+key]=='true'&&key.length>1) {
    advanced_spellbombs.push(key);
    }
  }
  //cl(advanced_spellbombs); // debug
  
  var random_recipe = advanced_spellbombs[randomInt(0, (advanced_spellbombs.length-1))];
  //cl(random_recipe);
  
  var candidates = []
  for (i = 0; i < active_reagents.length; i++) {
    if(active_reagents[i].indexOf(random_recipe)>-1&&active_reagents[i].length>1) {
      candidates.push(active_reagents[i]);
      //cl(i);
      //cl(candidates);
      }
    //cl(i);
  }
  
  if(candidates.length>0) {
    var finalist = candidates[randomInt(0, (candidates.length-1))];
    //cl("finalist: "+finalist);
    return(finalist);
    }
  else {
    //cl('no valid reagents...');
    return false;
    }
  }

// generator functions
function basic() {return basic_reagents[Math.floor(Math.random() * basic_reagents.length)];}
function basicIng() {return ingredients[Math.floor(Math.random() * ingredients.length)];}
function other() {return other_reagents[Math.floor(Math.random() * other_reagents.length)];}

// make reagent cards  
function reAgent(code) {
  var vapeChance = .28;
  if(code.indexOf('v')>-1) {cl('this one always vapes'); vapeChance = 11; code = code.replace('v', ''); cl(code);}
  if(code.indexOf('w')>-1) {cl('this one never vapes'); vapeChance = 0; code = code.replace('w', '');}
  //cl(code, code.length);
  if(code.length==1) { //cl("1 ingredient");
    var vape; var rand2 = Math.random(); //cl(rand2);
    if(rand2<vapeChance) {vape = ' vape';} else {vape = '';}
    return '<div class="reagent'+vape+'" data-reagent="'+code+'"><div class="icon '+code+'" data-ingredient="'+code+'"><img src="'+code+'.png" /></div></div>';
    }
  else if (code.length==2) { //cl("2 ingredients");
    return '<div class="reagent vape" data-reagent="'+code+'"><div class="icon '+code.substring(0,1)+'" data-ingredient="'+code.substring(0,1)+'"><img src="'+code.substring(0,1)+'.png" /></div><div class="icon '+code.substring(1,2)+'" data-ingredient="'+code.substring(1,2)+'"><img src="'+code.substring(1,2)+'.png" /></div></div>';
    }
  else if (code.length==3) {
    return '<div class="reagent '+code+'" data-reagent="'+code+'"><div class="icon '+code.substring(0,1)+'" data-ingredient="'+code.substring(0,1)+'"><img src="'+code.substring(0,1)+'.png" /></div><div class="icon '+code.substring(1,2)+'" data-ingredient="'+code.substring(1,2)+'"><img src="'+code.substring(1,2)+'.png" /></div></div>';
    }
  else {
    cl("we'll handle ability reagents later");
    }
  }
  
// curses!
function curse() {
  return '<div class="reagent curse"><div class="icon curse" data-ingredient="curse"><img src="curse.png" /></div></div>';
  }

// wild cards!
function jokers() {
  if($('#bench .icon.J').length) {
    //cl("fix the jokers");
    $('#bench .icon.J').each(function() {
      $(this).remove();
      benchAdd(basicIng());
      });
    }
  }

// function for checking for deckbuilding achievemnts
function deckTrophies() {
  if($('#deck .reagent.vape').length==$('#deck .reagent').length) {awardTrophy('FDV');}    // deck is all vaporize
  if($('#deck .reagent:has(.C)').length==$('#deck .reagent').length) {awardTrophy('FDC');} // deck is all C
  if($('#deck .reagent:has(.M)').length==$('#deck .reagent').length) {awardTrophy('FDM');} // deck is all M
  if($('#deck .reagent:has(.R)').length==$('#deck .reagent').length) {awardTrophy('FDR');} // deck is all R
  if($('#deck .reagent:has(.A)').length==$('#deck .reagent').length) {awardTrophy('FDA');} // deck is all A
  if($('#deck .reagent:has(.N)').length==$('#deck .reagent').length) {awardTrophy('FDN');} // deck is all N
  if($('#deck .reagent:has(.T)').length==$('#deck .reagent').length) {awardTrophy('FDT');} // deck is all T
  if($('#deck .reagent:has(.J)').length==$('#deck .reagent').length) {awardTrophy('FDJ');} // deck is all jokers
  var twofers = 0;
  $('#deck .reagent').each(function() {if($(this).children().length==2) {twofers++;}});
  if(twofers==$('#deck .reagent').length) {awardTrophy('FDH');} // deck is all 2-value reagents
  if($('#deck .reagent:has(.C)').length>0&&$('#deck .reagent:has(.M)').length>0&&$('#deck .reagent:has(.R)').length>0&&$('#deck .reagent:has(.A)').length>0&&$('#deck .reagent:has(.N)').length>0&&$('#deck .reagent:has(.T)').length>0) {awardTrophy('rainbow');}
  }

// build your initial deck  
function initiateDeck(discipline) {
  var i = 0;
  $('#deck').append(reAgent(discipline));
  $('#deck').append(reAgent(discipline));
  $('#deck').append(reAgent(discipline));
  $('#deck').append(reAgent(discipline));
  $('#deck').append(reAgent(discipline));
  $('#deck').append(reAgent(discipline));
  var floaters = 6;
  if(discipline!='C') {floaters--; $('#deck').append(reAgent('C'));}
  if(discipline!='T') {floaters--; $('#deck').append(reAgent('T'));}
  while(i<floaters) {
    $('#deck').append(reAgent(basic()));
    //$('#deck').append(curse());
    i++;
    }
  
  }
  
// functions to save and load deck lists (story mode)
function saveDeck() {
  localStorage.storyDeck = ''; 
  $('#deck .reagent').each(function() {
    var code = $(this).data('reagent');
    if(localStorage.storyDeck.length>0) {localStorage.storyDeck += ',';}
    localStorage.storyDeck += code;
    if($(this).hasClass('vape')) {localStorage.storyDeck += 'v';} else {localStorage.storyDeck += 'w';}
    });
  cl(localStorage.storyDeck);
  }
function loadDeck() {
  $('#deck').html('');
  var reagents = localStorage.storyDeck.split(',');
  cl(reagents);
  $.each(reagents, function(index, value) {
    $('#deck').append(reAgent(value));
    });
  }