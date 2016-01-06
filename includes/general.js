// generic functions
function pickRandomProperty(obj) {
  var result; var count = 0;
  for (var prop in obj)
      if (Math.random() < 1/++count)
         result = prop;
  return result; }
function cl(stuff) {console.log(stuff);}
function shuffle(pile) {
  var parent = pile; var babies = parent.children();
  while (babies.length) { parent.append(babies.splice(Math.floor(Math.random() * babies.length), 1)[0]); }
  } 
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function isInt(n) { return n % 1 === 0; }
Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size ++;
    }
  return size;
};

// change the screen view
function screen(view) {
  cl("Changing to "+view+"!");
  $('#battle, #menu, #shop, #settings, #deckbuilder, #guilds, #trophies').hide();
  $('#'+view).show();
  if(view=='shop') {shopTab('recipes');}
  if(view=='menu') {$('#logo, #extra').show(); $('#menu .mode').addClass('ninja');}
  if(view=='trophies') {
    // set shop height so page doesn't scroll
    cl('hello');
    var busy = $('header:visible').outerHeight(); //cl(busy);
    var winHeight = window.innerHeight; //cl(winHeight);
    var newH = winHeight - busy; //cl(newH);
    $('.achievements').height(newH);
    }
  }
  
// function to display a message
function tell(message, styles) {
  styles = typeof styles !== 'undefined' ? styles : '';
  var duration = (message.length*24)+1000;
  var id = Math.floor((Math.random()*10000000000));
  //if($('.tell').length) {$('.tell').stop().fadeOut(200, function() {$(this).remove();});}
  $('<div class="tell id'+id+' '+styles+'">'+message+"</div>").appendTo('#messages').slideDown(100);
  $('.id'+id).delay(duration).slideUp(100, function() {$(this).remove();});
  }
function warn(message) {tell(message, 'warning');}
function prize(message) {tell(message, 'prize');}
  
function hi() {tell('hi');}


// init gold
if (localStorage.gold) {
    localStorage.gold = Number(localStorage.gold);
} else {
    localStorage.gold = 0;
}

// gold functions
function goldUp(gp) {
  //cl('triggering goldchange'); // debug
  //cl(localStorage.gold); //cl(gp); // debug
  localStorage.gold = parseInt(localStorage.gold) + parseInt(gp);
  if(gp<-999) {awardTrophy('RP4');}
  if(localStorage.gold==1337) {awardTrophy('leet');}
  //if(parseInt(localStorage.gold)>9999) {localStorage.gold = 9999;}
  displayGold();
  }
  
function displayGold() {
  if(parseInt(localStorage.gold)>999999999) {
    gp2 = Math.floor(parseInt(localStorage.gold)/1000000000)+'B';
    } 
  else if(parseInt(localStorage.gold)>999999) {
    gp2 = Math.floor(parseInt(localStorage.gold)/1000000)+'M';
    } 
  else if(parseInt(localStorage.gold)>9999) {
    gp2 = Math.floor(parseInt(localStorage.gold)/1000)+'K';
    } 
  else {gp2 = localStorage.gold;}
  $('.gold').html(gp2);
  }
  
function calcGold(level) {
  var base = Math.random() * (10 - 6) + 6;
  var multiplier = Math.pow(1.4, level);
  var money = (base*multiplier)+floors;
  if(localStorage.mode=="survival") {money *= 2;}
  return Math.floor(money);
  }

// init mode
if(!localStorage.mode) {
  localStorage.mode = 'normal';
  }

// function for the reset
function reset(hard) {
  hard = typeof hard !== 'undefined' ? hard : false;
  resetReagents();
  resetRecipes();
  resetFaces();
  localStorage.removeItem('guild');
  localStorage.gold = 0;
  localStorage.mode = 'normal';
  localStorage.new = true;
  localStorage.resets = parseInt(localStorage.resets)+1;
  
  if(hard) {resetTrophies();} // if hard reset, reset trophies
  
  location.reload(); // reload to make it work!
  }

// function to reset trophies, debug only
function resetTrophies() {
  localStorage.trophies = 0;
  localStorage.removeItem('trophiesObtained');
  localStorage.kills = 0;
  localStorage.roomsSurvival = 0;
  localStorage.roomsNormal = 0;  
  localStorage.sandbag = 0;  
  localStorage.collector = 0; 
  localStorage.dabbler = 0;  
  localStorage.resets = 0;  
  for (var i = 0; i < disciplines.length; i++) {
    var br = disciplines[i];
    localStorage[br+"Bomber"]=0;
    }
  for (var i = 0; i < subtypes.length; i++) {
    var st = subtypes[i];
    localStorage[st+"Slayer"]=0;
    localStorage[st+"Prey"]=0;
    }
  //location.reload();
  }


function versionCheck(num) {
  $('body').hide();
  $('.version').html(num);
  if(localStorage.version!=num) {
    $('html').html('Getting new version...');
    localStorage.version = num;
    hardReset();
    }
  else {$('body').show();}
  }