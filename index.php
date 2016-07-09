<html>
<head>
  <title>Lab Mayhem: Spellbomb Mania</title>
  
  <link rel="stylesheet" href="includes/reset.css" type="text/css" />
  <link href='https://fonts.googleapis.com/css?family=Reenie+Beanie|Droid+Sans' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" href="style.css" type="text/css" />
  <link rel="shortcut icon" sizes="196×196" href="favicon.png" />
  
  <script type="text/javascript" src="includes/jquery.js"></script>
  <script type="text/javascript" src="includes/jquery.rotate.js"></script>
  <script type="text/javascript" src="includes/jquery.random.js"></script>
  <script type="text/javascript" src="includes/hammer.min.js"></script>
  <script type="text/javascript" src="includes/jquery.hammer.js"></script>
  <script type="text/javascript" src="includes/circle-progress.js"></script>
  <script type="text/javascript" src="includes/jquery.pause.min.js"></script>
  <script type="text/javascript" src="includes/general.js"></script>
  <script type="text/javascript" src="includes/recipes.js"></script>
  <script type="text/javascript" src="includes/reagents.js"></script>
  <script type="text/javascript" src="includes/monsters.js"></script>
  <script type="text/javascript" src="includes/battleFunctions.js"></script>
  <script type="text/javascript" src="includes/shop.js"></script>
  <script type="text/javascript" src="includes/trophies.js"></script>
  <script type="text/javascript" src="includes/dialogue.js"></script>
  
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <style></style>
</head>
<body>

<script>  
var floors = 0;
var next_monster_level = 0;//'test';
var next_monster = pickRandomProperty(monsters[next_monster_level]);




var Game = new Object; // object to control battle stuff
// Game timing
Game.fps = 40; Game.ms = 0; Game.frameDuration = (1000 / Game.fps);
// Draw stuff
Game.drawSpeed = 3000; Game.lastDraw = 0;
// Enemy attack stuff
Game.eAttackSpeed = 0; Game.lastAttack = 0; 
Game.stunned = false; 
// vinekin abilities
Game.jagged = false; Game.corrosive = false; Game.sunbliss = false; 
Game.organ = false; Game.catalyst = false; Game.azoth = false; 
// Don't let this happen to you
Game.pStunned = false;
// update function
Game.update = function() {
  Game.ms += 25;
  //if(Game.pStunned) {Game.lastDraw +=25;} // disable drawing when stunned; pretty punishing
  if(Game.ms>=(Game.lastDraw+Game.drawSpeed)) {
    Game.lastDraw = Game.ms; draw();
    // cl("Draw a card"); // debug
    }
  if(!Game.stunned) {
  var atkProg = (Game.ms - Game.lastAttack);
  var atkProgPasento = (atkProg/Game.eAttackSpeed);
  circle.circleProgress({'value': atkProgPasento});
    }
  else {
    Game.lastAttack += 25;
    }
  if(Game.ms>=(Game.lastAttack+Game.eAttackSpeed)) {
    Game.lastAttack = Game.ms; cl("monster hit you!");
    //cl(Game.eAttackSpeed);
    var dmgAmount = parseInt($('#baddie .damage span').text());
    Game.lifesteal = false; Game.bypass = false;
    if(enemy.bypass) {Game.bypass = true;}
    if(enemy.lifesteal) {Game.lifesteal = true;}
    damage('you', dmgAmount, '', Game.bypass, Game.lifesteal); 
    if(enemy.onAtk) {enemy.onAtk();}
    }
  if(Game.doubling) {
    Game.doublingDuration -=25; 
    if(Game.doublingDuration<=0) {Game.doubling=false; $('.effect.Engine.Breath').remove();}
    }
  if(Game.runningOrgans) {
    Game.organDuration -=25; 
    if(Game.organDuration<=0) {Game.runningOrgans=false; $('.effect.Running.Organs').remove();}
    }
  if(Game.thorns) {
    Game.thornsDuration -=25; 
    if(Game.thornsDuration<=0) {Game.thorns=0; $('.effect.Thorns').remove();}
    }
  if(isInt(Game.ms/enemy.regenSpeed)&&enemy.regenerates) {poisonDmg(-enemy.regenerates);}
  //cl(Game.ms); //debug
  }
// initiate function
Game.start = function() {
  Game.drawSpeed = 3000;
  Game.stunned = false; unStunPlayer(); checkRecipe();
  Game.pacifist = true;
  // engine breath reset
  Game.doubling = false; Game.doublingDuration = 0;
  // organ run reset
  Game.runningOrgans = false; Game.organDuration = 0;
  // thorns
  Game.thorns = 0; Game.thornsDuration = 0;
  battling = true;
  battleTimers = [];
  Game.lastDraw = 0; Game.ms = 0;
  Game.lastAttack = 0;
  //cl(Game.eAttackSpeed);
  Game.interval = setInterval(Game.update, Game.frameDuration);
  }

// functions to start and end battle;
var battling = false;
function bStart() {
  //cl("Fighting level "+next_monster_level+" monsters.");
  $('.dark').removeClass('dark'); $('.effect').remove();
  //cl('HI');
  shuffle($('#deck'));
  //var baddie = pickRandomProperty(monsters[level]);
  //cl(enemy); //debug
  initiateMonster(next_monster, next_monster_level);
  $("#you .armor").text($("#you .armor").data('default'));
  $("#you .damage span").text($("#you .damage").data('default'));
  if(localStorage.mode!="survival") {
    $("#you .hp").text($("#you .hp").data('max')); 
    $('#you .hpbar .inner').stop().css('width', '100%');
    }
  if(Game.jagged) {weaken(-2); Game.jagged = false;} // check if previous monster was jagged vinekin for damage buff
  if(Game.corrosive) {shareDesecrator(); Game.corrosive = false;}
  if(Game.sunbliss) {shareStunImmunity(); Game.sunbliss = false;}
  if(Game.organ) {shareRegen(); Game.organ = false;}
  if(Game.catalyst) {speedUp(); Game.catalyst = false;}
  if(Game.azoth) {wither(-1); Game.azoth = false;}
  if(enemy.onSpawn) {enemy.onSpawn();}
  for (var i = 0; i < disciplines.length; i++) {
    var br = disciplines[i];
    localStorage[br+"Combo"]=0;
    }
  screen('battle');
  draw();
  $('#deckbuilder header span').first().html('This is your deck:');
  Game.start();
  }
 
function combos() {
  cl("C "+localStorage.CombustionCombo);
  cl("M "+localStorage.MetallurgyCombo);
  cl("R "+localStorage.ReanimationCombo);
  cl("A "+localStorage.AstrologyCombo);
  cl("N "+localStorage.NaturalismCombo);
  cl("T "+localStorage.ToxicologyCombo);
  }
 
// catalyst foliage speeds up next monster
function speedUp() {
  //cl(enemy["atkspeed"]);
  Game.eAttackSpeed /= 1.5;
  if(enemy.abilities) {$('#baddie .abilities').append('; <i class="added">attacks faster</i>');}
  else {$('#baddie .abilities').append('<i class="added">Attacks faster</i>');}
  //cl(enemy["atkspeed"]);
  //cl(Game.eAttackSpeed);
  }
 
// organ runner gives regen to next monster
function shareRegen() {
  if(enemy.regenerates) {
    return;
    }
  else {
    enemy.regenerates = 2; enemy.regenSpeed = 10000;
    if(enemy.abilities) {$('#baddie .abilities').append('; <i class="added">regenerates</i>');}
    else {$('#baddie .abilities').append('<i class="added">Regenerates</i>');}
    }
  }

// sunbliss blossom gives stun immunity to next monster
function shareStunImmunity() {
  enemy.stunImmune = true; 
    if(enemy.abilities) {$('#baddie .abilities').append('; <i class="added">immune to stun</i>');}
    else {$('#baddie .abilities').append('<i class="added">Immune to stun</i>');}
  }  

// corrosive vinekin gives desecrator to next monster
function shareDesecrator() {
    if(enemy.onAtk) { // add desecration to existing attack trigger
      var originalFn = enemy.onAtk;
      enemy.onAtk = function () {
        originalFn(); // call the original function
        desecrate(1);
        };
      }
    else { // add attack trigger
      enemy.onAtk = function() {desecrate(1);}
      }
    if(enemy.abilities) {$('#baddie .abilities').append('; <i>desecrates</i>');}
    else {$('#baddie .abilities').append('<i>Desecrates</i>');}
  }
  
// draw function - how you get your resources!
function draw() {
  // calculate how far cards have to travel in your hand
  var winWidth = $('body').width();
  var handWidth = winWidth - $('.bench').width() - 4; //cl(handWidth);
  // cl("still going"); // debug
  if($('#deck .reagent').length) { // draw if deck is open
    $('#deck .reagent').first().prependTo('#hand')
    .css('position', 'absolute').css('left', '-70px')
    .click(function() {
      if(!$(this).hasClass('curse')) {
        $(this).unbind().find('.icon').clone().prependTo('#bench');
        jokers();
        }
  
      // send off the card in style
      $(this).stop().animate({
        'left':handWidth+'px', 
        'opacity':.2,
        'height': '40px',
        marginTop: '14px' 
        }, 400);
      if($(this).hasClass('vape')) {
        //cl('vaping'); //debug 
        $(this).fadeOut(100, function() {$(this).remove();});
        }
      else {
        //cl('discarding'); //debug
        $(this).fadeOut(100, function() {$(this).prependTo('#discard');});
        }
        
      while($('#bench .icon').length>3) {$('#bench .icon').last().remove();}
      checkRecipe();
      })
  .animate({'left': handWidth+'px'}, 10000, 'linear', function() {
    $(this).prependTo('#discard').stop().unbind();
    });
  }
  else { // shuffle discards into deck and begin drawing again
    shuffleDiscards();
    shuffle($('#deck'));
    if($('#deck .reagent').length) {
      draw();
      }
    else {
      warn("Your deck is empty."); 
      awardTrophy('empty');
      }
    }
  }

// discard all cards to clean up the fight
function discardAll() {$('#hand .reagent').unbind().stop().appendTo('#discard');}
// clear all CSS changes on cards when we reshuffle them into the deck
function shuffleDiscards() {
  $('#discard .reagent').each(function(){
    $(this).unbind().stop().css('display', '').css('margin-top', '')
    .css('left', '').css('position', '').css('opacity', '')
    .css('marginTop', '').css('height', '')
    .appendTo('#deck');
    });
  }

function bEnd(victory) {
  // clear battletimers
  battling = false; clearInterval(Game.interval);
  for (var timer in battleTimers) { clearTimeout(battleTimers[timer]); }
  battleTimers = [];
  $('.splat').stop().remove();
  //clearInterval(drawLoop);          // clear draw loop
  discardAll(); shuffleDiscards();  // shuffle all cards back into deck
  $('#bench .icon').remove(); if(circle) {circle.remove();}  // clear active stuff in battle
  if(victory) {
    var st = enemy.subtype; // get subtype for stats
    // cl(st);
    localStorage[st+'Slayer'] = Number(localStorage[st+'Slayer'])+1; // increase slayer stat
    if(localStorage[st+'Slayer']==1) {localStorage.collector = Number(localStorage.collector)+1;} // add to collection
    hiScore(st+'Slayer'); hiScore('collector');
    if(Game.pacifist) {awardTrophy('pacifist');}
    
    for (var i = 0; i < affixes.length; i++) {
      if(affixes[i].length) {
        //cl(enemy.name);
        //cl(enemy.name.indexOf(affixes[i]));
        if(enemy.name.indexOf(affixes[i])>-1) {awardTrophy('KS'+affixes[i]);}
        }
      }
    showWin($('#baddie').data('level'));
    }
  else {
    showLoss();
    }
  }
  
function showLoss() {
  var defeatScreen = '<div id="victory"><h1>DEFEAT</h1><p>You beat '+floors+' enemies.</p><a><img src="skull.png" /><!-- icon by freepik --><br />click to proceed</a></div>';
  $('body').append(defeatScreen);
  $('#victory').click(function(e) {
    e.preventDefault();
    $('#battle').hide(); 
    $('body').css('background-color', 'black');
    $(this).unbind().addClass('clicked').fadeOut(400, location.reload());
    });
  }
  
function showWin(level) {
  var gp = calcGold(level);
  var victoryScreen = '<div id="victory"><h1>VICTORY!</h1><p>You found '+gp+' gold!</p><a href="#"><img src="treasure.png" /><br />click to proceed</a></div>';
  $('body').append(victoryScreen);
  $('#victory').click(function(e) {e.preventDefault(); victory(gp)});
  localStorage.kills = parseInt(localStorage.kills) + 1; $('.kills').html(localStorage.kills);
  hiScore('kills');
  floors++; 
  if(localStorage.mode=="normal"&&floors>parseInt(localStorage.roomsNormal)) {
    localStorage.roomsNormal = floors;
    hiScore("roomsNormal");
    }
  else if(localStorage.mode=="survival"&&floors>parseInt(localStorage.roomsSurvival)) {
    localStorage.roomsSurvival = floors;
    hiScore("roomsSurvival");
    }
  else if(localStorage.mode=="story") {
    //cl('you beat a story mode battle');
    localStorage[localStorage.guild+'Story'] = parseInt(localStorage[localStorage.guild+'Story'])+1;
    }
  }
  
function victory(gp) {
  $('#battle').hide();
    $('#victory').unbind().addClass('clicked').fadeOut(400, function() {$('#victory').remove();});
  //cl("Pocketed "+gp+" gold pieces!");
  goldUp(gp);
  screen('deckbuilder');
  initiatePicks();
  }
  
// allow user to add a card to deck after battle victory
function initiatePicks() {
  $('#picks').html('');
  var i = 0; var rand2;
  while(i<4) {
    var rand = Math.random();
    if(rand<.55) {rand2 = basic();} else {rand2 = other();}
    $('#picks').append(reAgent(rand2));
    i++;
    }
  $('#picks .reagent').addClass('focus').click(function() {
    $('.bottom.picks').fadeOut(100);
    $(this).appendTo($('#deck')).removeClass('focus').unbind();
    $('#picks').html('');
    if($('#deck .reagent').length>12) {promptTrash();}
    else {deckTrophies(); 
      if(localStorage.mode=="story") {
        saveDeck();
        storyStart(); // go back to dialogue
        }
      else {bStart();}
      }
    });
  $('.bottom.start').hide();
  $('.bottom.picks').show();
  
  if(localStorage.mode!='story') {
    next_monster_level = Math.min(Math.floor(floors/3), 14);
    //next_monster = pickRandomProperty(monsters[next_monster_level]);
    nextMonster(next_monster_level);
    $('.next span').text(monsters[next_monster_level][next_monster]["name"]);
    }
  }
  
function promptTrash() {
  //cl('triggering'); //debug
  $('#deckbuilder header span').first().html('Trash a card');
  tell('Max deck size is 12. Click a reagent to trash it from your deck.');
  $('#deck .reagent').addClass('focus').click(function() {
    //cl('hihi');
    $(this).remove();
    $('#deck .reagent').removeClass('focus').unbind();
    if($('#deck .reagent').length>12) {promptTrash();}
    else {deckTrophies(); 
      if(localStorage.mode=="story") {
        saveDeck();
        storyStart(); // go back to dialogue
        }
      else {bStart();}
      }
    });
  }
  
// resign function kills you
function resign() { bEnd(false); }

// initiates starter known recipes
function firstTime(discipline) {
  if(localStorage.new=="false") {return;}
  gainRecipe(discipline+discipline);
  learnRandom(discipline); learnRandom(discipline); learnRandom(discipline);
  localStorage.new = false;
  }

// let's go
var battleTimers = [];
$(document).ready(function() {
  versionCheck(1);
  $('.resets').html(localStorage.resets);
  if(localStorage.resets==1) {awardTrophy('R1');}
  // hitting the logo goes to mode selection
  $('#logo').click(pickMode);
  // allow swiping between shops
  $('.recipes-shop').hammer().on("swipeleft", function() {shopTab('reagents');});
  $('.reagents-shop').hammer().on("swipeleft", function() {shopTab('content');})
    .on("swiperight", function() {shopTab('recipes');});
  $('.content-shop').hammer().on("swipeleft", function() {shopTab('cosmetics');})
    .on("swiperight", function() {shopTab('reagents');});
  $('.cosmetics-shop').hammer().on("swiperight", function() {shopTab('content');});
  
  // load account data
  setFace();
  displayGold();
  $('.kills').html(localStorage.kills);
  $('.floors').html(localStorage.roomsNormal);
  $('.trophies').html(localStorage.trophies);
  $('.roomsSurvival').text(localStorage.roomsSurvival);
  
  // populate shop pages
  for (var i = 0; i < buyableLength; i++) { reagentDisplay(buyable_reagents[i]); }
  for (var i = 0; i < faces.length; i++) { faceDisplay(faces[i]); }
  for (var key in spellbombs) {recipeDisplay(key);}
  listTrophies();
  $('.trophy-total').text(Object.keys(trophies).length);
  //recipeDisplay('CC');
  if(localStorage.guild) {
    // build deck if already in a guild
    $('#menu .guild').attr('src', localStorage.guild+'.png');
    initiateDeck(localStorage.guild);
    // go to menu
    if(parseInt(localStorage[localStorage.guild+'Story'])>0) {
      var storyNext = parseInt(localStorage[localStorage.guild+'Story'])+1;
      $('.mode.story').append('<span>Battle '+storyNext+'</span>');
      }
    screen('menu');
    //screen('cutscene');
    //dialogue(dialogues.C01);
    }
  else {
    // otherwise go to guild selection
    screen('guilds');
    }
    /*
  $('.'+localStorage.mode).addClass('selected');
  
  if(localStorage.mode=="survival") {
    $('#battle header').append(' <span>(Survival)</span>');
    }*/
  });

/*
function mode(mode) {
  if(mode==localStorage.mode) {return;}
  localStorage.mode = mode;
  $('.mode').toggleClass('selected');
  if(localStorage.mode=="survival") {
    $('#battle header').append(' <span>(Survival)</span>');
    tell("Survival mode enabled. Earn double gold, but no healing between battles!");
    }
  else {
    $('#battle header span').remove();
    tell("Normal mode enabled. No special rules.");
    }
  //location.reload();
  }*/

function pickGuild(discipline) {
  localStorage.guild = discipline;
  firstTime(discipline);
  initiateDeck(discipline);
  $('#menu .guild').attr('src', localStorage.guild+'.png');
  screen('menu');
  }
  
function pickMode() {
  $('#logo, #extra').slideUp(200);
  $('#menu .ninja').removeClass('ninja');
  }
  
function survivalStart() {
  localStorage.mode = 'survival';
  $('#battle header').append(' <span>(Survival)</span>');
  tell("Survival mode enabled. Earn double gold, but no healing between battles!");
  bStart();
  }

function normalStart() {
  localStorage.mode = 'normal';
  //tell("Normal mode enabled. No special rules.");
  bStart();
  }
  
//cl(next_monster);

function storyStart() {
  if(dialogues[localStorage.guild+localStorage[localStorage.guild+'Story']]) {
    localStorage.mode = 'story';
    $('.next').remove();
    var storyLevel = localStorage[localStorage.guild+'Story'];
    tell('Story mode progress: '+localStorage.guild+storyLevel);
    if(storyLevel>0) {loadDeck();}
    screen('cutscene');
    cl(localStorage.guild+localStorage[localStorage.guild+'Story']);
    dialogue(localStorage.guild+localStorage[localStorage.guild+'Story']);
    next_monster_level = Math.min(Math.floor(parseInt(storyLevel)/3), 14);
    next_monster = pickRandomProperty(monsters[next_monster_level]);
    cl(next_monster);
    }
  else {
    tell("No story mode yet.");
    }
  }
  
  

// function for saving your game to a text string
var saveFile = ''; var saveObj = new Object;
function save() {
  saveFile = JSON.stringify(localStorage);
  console.log(saveFile);
  saveObj = JSON.parse(saveFile);
  console.log(saveObj);
  }
  
function loadSave() {
  assign(localStorage, saveObj);
  tell("Loaded!");
  }

  
</script>

  
<div id="menu">
  <div id="logo"></div>
  <a id="extra" href="javascript:pickMode();">FIGHT</a>
  <a href="javascript:normalStart();" class="ninja mode normal">NORMAL</a> 
  <a href="javascript:storyStart();" class="ninja mode story">STORY</a> 
  <a href="javascript:survivalStart();" class="ninja mode survival">SURVIVAL</a> 
  <a href="javascript:screen('shop');">SHOP</a>
  <a href="javascript:screen('settings');">SETTINGS</a>
  <div id="inventory">
    <div class="stat"><img src="coins.png" /> <span class="gold"></span></div>
    <div class="stat"><img src="C.png" class="guild" /></div>
    <div class="stat" onclick="screen('trophies');"><img src="trophy-white.png" /> <span class="trophies"></span></a></div>
    <!-- <div class="stat"><img src="kills.png" />  <span class="kills"></span></div>
    <div class="stat"><img src="floors.png" /> <span class="floors"></span></div> -->
  </div>
</div>
  
<div id="guilds">
  <header>Welcome, Alchemist!</header>
  <p>Before you get started, join a guild. Each guild is associated with a different discipline of alchemy and encourages a different playstyle. Your choice will not prevent you from using other disciplines, and you can change it later.</p>
  <p><a href="javascript:pickGuild('C');">Abradacci (Combustion)</a> - Combustion is a fiery discipline. Join Guild Abradacci if you want to deal a lot of damage.</p>
  <p><a href="javascript:pickGuild('M');">Ogmite (Metallurgy)</a> - Metallurgy is a ponderous and solid discipline. Join Guild Ogmite if you like defenses and gold.</p>
  <p><a href="javascript:pickGuild('R');">Imbregog (Reanimation)</a> - Reanimation is a messy discipline. Join Guild Imbregog if you don't mind making sacrifices for power.</p>
  <p><a href="javascript:pickGuild('A');">Zimuth (Astrology)</a> - Astrology is the weirdest discipline. Join Guild Zimuth if you like prophecies and magic.</p>
  <p><a href="javascript:pickGuild('N');">Eraya (Naturalism)</a> - Naturalism is a nurturing discipline. Join Guild Eraya if you like healing and buffing.</p>
  <p><a href="javascript:pickGuild('T');">Glurizol (Toxicology)</a> - Toxicology is the discipline of cruelty. Join Guild Glurizol if you like weakening your enemies.</p>
</div>

<div id="cutscene">
  <header><a href="javascript:location.reload();" id="home"> &nbsp; </a>Story</header>
  <div id="speakerL"></div>
  <div id="speakerR"></div>
  <div id="dialogue"><span class="speaker"></span><p>Blah blah.</p></div>
</div>

<div id="trophies">
  <header><a href="javascript:screen('menu');" id="home"> &nbsp; </a>Trophies (<span class="trophies"></span>/<span class="trophy-total">X</span>)</header>
  <!-- <div class="case-head">High Scores</div> -->
  <!-- <div class="stat">Total Kills<br /><span class="kills">0</span></div>
  <div class="stat">Normal Depth<br /><span class="floors">0</span></div>
  <div class="stat">Survival Depth<br /><span class="roomsSurvival">0</span></div> 
  <div class="case-head">Achievements</div> -->
  <div class="case-head">Some secret trophies won't display<br />until you've won them.</div>
</div>

<div id="shop">
  <header><a href="javascript:screen('menu');" id="home"> &nbsp; </a><div href="" id="currency" class="gold"></div> YE ALCHEMY SHOPPE</header>
  
  <div id="shop-tabs">
  <div class="wrapper"><a class="inner recipes" href="javascript:shopTab('recipes');" data-transition="pop">Recipes</a></div>
  <div class="wrapper"><a class="inner reagents" href="javascript:shopTab('reagents');">Reagents</a></div>
  <div class="wrapper"><a class="inner content" href="javascript:shopTab('content');">Content</a></div>
  <div class="wrapper"><a class="inner cosmetics" href="javascript:shopTab('cosmetics');">Cosmetics</a></div>
  </div>
  
  <div class="shop recipes-shop" data-shop="1">
    <!-- <p class='shop-head'>No recipes here yet.</p> -->
    <div class='shop-head'>
      <div onclick="recipeFilter('C');" class="icon C " data-discipline="C"><img src="C.png" /></div>
      <div onclick="recipeFilter('M');" class="icon M " data-discipline="M"><img src="M.png" /></div>
      <div onclick="recipeFilter('R');" class="icon R " data-discipline="R"><img src="R.png" /></div>
      <div onclick="recipeFilter('A');" class="icon A " data-discipline="A"><img src="A.png" /></div>
      <div onclick="recipeFilter('N');" class="icon N " data-discipline="N"><img src="N.png" /></div>
      <div onclick="recipeFilter('T');" class="icon T " data-discipline="T"><img src="T.png" /></div>
      <div onclick="toggleKnown();" class="known">ALL</div>
    </div>
  </div>
  
  <div class="shop reagents-shop" data-shop="2">
    <p class='shop-head'>Upon purchase, these will drop after battles.</p>
  </div>
  
  <div class="shop content-shop" data-shop="3">
    <p class='shop-head'>No contents here yet.</p>
  </div>
  
  <div class="shop cosmetics-shop" data-shop="4">
    <p class='shop-head'>What kind of alchemist are YOU?</p>
  </div>
</div>

<div id="settings">
  <header><a href="javascript:screen('menu');" id="home"> &nbsp; </a>SETTINGS</header>
  <p><a href="javascript:reset();">Soft Reset? (guild choice, purchases, currency)</a></p>
  <p> &nbsp; &nbsp; Resets: <span class="resets"></span></p>
  <p><a href="javascript:reset(true);">Hard Reset? (everything)</a></p>
  <p>Current version: <span class="version"></span></p>
  
  <p><a href="javascript:save();">Save Your Game</a></p>
</div>
  
<div id="battle">
  <header><a href="javascript:resign();" id="resign"> &nbsp; </a> Battle! <a href="javascript:bEnd(true);">win</a></header>
    
  <div id="baddie">
    <div class="title">Name</div>
    <div class="abilities"></div>
    <table><tr>
    <td class="armor">0</td>
    <td>
    <div class="portrait"></div>
    <div class="hpbar"><div class="inner"></div></div>
    <div class="hp">20</div>
    </td>
    <td class="damage"><span>1</span><div id="circle"></div></td>
    </tr></table>
    <div class="status-effects"></div>
  </div>
    
  <table id="resources"><tr><td class="hand">
  <div id="hand"></div>
  </td><td class="bench">
  <div id="bench" onclick="assemble();"></div>
  <a href="javascript:assemble();" id="assemble">Assemble!</a>
  </td></tr></table>
  
  <div id="recipe"></div>
  
  <div id="you">
    <table><tr>
    <td class="damage" data-default="+0"><span>+0</span></td>
    <td>
      <div class="portrait"><img src="portraits/carelessExperiment.png" /></div>
      <div class="hpbar"><div class="inner"></div></div>
      <div class="hp" data-max="40">40</div>
    </td>
    <td class="armor" data-default="0">0</td>
    </tr></table>
    <div class="left"><div class="gold"></div></div>
    <div class="status-effects"></div>
  </div>
</div>

<div id="deckbuilder">
  <div class="top">
  <header><a href="javascript:resign();" id="resign"> &nbsp; </a> <span>This is your deck:</span></header>
  <!-- Deck (<a href="javascript:bStart(0);">start fight</a>) -->
  <div id="deck"></div>
  <div class="next">
    Next Enemy: <span></span>
  </div>
  </div>
  <div class="bottom start">
  <a href="javascript:bStart();">ENTER DUNGEON</a>
  </div>
  <div class="bottom picks">
  <header>Select a card to add:</header>
  <!-- Picks (<a href="javascript:initiatePicks();">generate</a>) -->
  <div id="picks"></div>
  </div>
</div>

<div id="discard"></div>

<div id="messages"></div>
</body>
</html>