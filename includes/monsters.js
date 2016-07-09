// dictionary for subtypes
var subtypes = [
  'elemental',
  'drek',
  'devil',
  'golem',
  'zombie', 
  'homunculus', 
  'contraption',
  'qamarin',
  'spark',
  'leshii',
  'mutandi',
  'salamander',
  'slime',
  'meatling', 
  'gargoyle', 
  'luminid', 
  'cosmid',
  'vinekin',
  'telkine', 
  'vermin',
  'aberration',
  ];
subtypes.sort();

// dictionaries for enemies
var monsters = [];
monsters[0] = {
  apprenticeSpark: {
    name: "Apprentice's Spark", subtype: "spark",
    level: 0, hp: 8,
    dmg: 2, atkspeed: 1500,
    armor: 0,
    abilities: "Fast"
    },/**/
  burrowingGrub: {
    name: "Burrowing Grub", subtype: "drek",
    level: 0, hp: 3,
    dmg: 5, atkspeed: 4000,
    armor: 0
    },/**/
  nosyCinderImp: {
    name: "Nosy Cinder Imp", subtype: "devil",
    level: 0, hp: 13,
    dmg: 4, atkspeed: 5000,
    armor: 0
    },/**/
  immites: {
    name: "Immites", subtype: "vermin",
    level: 0, hp: 11,
    dmg: 3, atkspeed: 3000,
    armor: 0
    },/**/
  brickbagBuilderBox: {
    name: "Brickbag Builder Bot", subtype: "contraption",
    level: 0, hp: 12,
    dmg: 3, atkspeed: 5000,
    armor: 1,
    abilities: "Armored",
    },/**/
  leshiiRunt: {
    name: "Leshii Runt", subtype: "leshii",
    level: 0, hp: 11,
    dmg: 2, atkspeed: 6500,
    armor: 0,
    abilities: "Protected by its comrades",
    protector: true,
    },/**/
  }
monsters[1] = {
  talismanTrader: {
    name: "Talisman Trader", subtype: "qamarin",
    level: 1, hp: 10,
    dmg: 1, atkspeed: 13000,
    armor: 0,
    onAtk: function() {$('#deck').prepend(curse()); warn("Curse added to your deck.");},
    abilities: "Curses you on hit"
    },/**/
  gasBloatedRats: {
    name: "Gas-Bloated Rats", subtype: "vermin",
    level: 1, hp: 12,
    dmg: 3, atkspeed: 11000,
    armor: 0,
    onAtk: function() {stunPlayer(3000);},
    abilities: "Stuns you on hit"
    },/**/
  rubbleThief: {
    name: "Rubble Thief", subtype: "contraption",
    level: 1, hp: 9,
    dmg: 2, atkspeed: 5500,
    armor: 0, lifesteal: true,
    abilities: "Lifesteal",
    },
  dissectionModel: {
    name: "Dissection Model", subtype: "homunculus",
    level: 1, hp: 13,
    dmg: 0, atkspeed: 30000,
    armor: 0,
    abilities: "Becomes Manflinger",
    onAtk: function() {initiateMonster('manflinger', 4);}
    },/**/
  roottapper: {
    name: "Roottapper", subtype: "mutandi",
    level: 1, hp: 14,
    dmg: 0, atkspeed: 6000,
    armor: 0,
    abilities: "Heals everyone",
    onAtk: function() {heal(2, "baddie"); heal(2, "you");},
    },/**/
  brookbringer: {
    name: "Brookbringer", subtype: "elemental",
    level: 1, hp: 30,
    dmg: 0, atkspeed: 6000,
    armor: 0,
    abilities: "Gives you sprouts",
    onAtk: function() {benchAdd('N');},
    },/**/
  }
monsters[2] = {
  vileScarab: {
    name: "Vile Scarab", subtype: "drek",
    level: 2, hp: 13,
    dmg: 1, atkspeed: 12000,
    armor: 0,
    onAtk: function() {
      wither(1, true, 'you');
      weaken(1, true, 'you');
      },
    abilities: "Weakens you on hit",
    },/**/
  cauldronSalamander: {
    name: "Cauldron Salamander", subtype: "salamander",
    level: 2, hp: 28,
    dmg: 3, atkspeed: 7000,
    armor: 0,
    onAtk: function() {desecrate(1);},
    abilities: "Desecrates; burns out",
    regenerates: -1, regenSpeed: 1000
    },/**/
  reagentSniffers: {
    name: "Reagent Sniffers", subtype: "homunculus",
    level: 2, hp: 22,
    dmg: 1, atkspeed: 4000,
    armor: 0,
    onAtk: function() {scramble();},
    abilities: "Scrambles ingredients on hit"
    },/**/
  furnaceStoker: {
    name: "Furnace Stoker", subtype: "elemental",
    level: 2, hp: 16,
    dmg: 8, atkspeed: 4000,
    armor: 0,
    },/**/
  puskralSpitling: {
    name: "Puskral Spitling", subtype: "slime",
    level: 2, hp: 18,
    dmg: 4, atkspeed: 4000,
    armor: 0, bypass: true,
    abilities: "Ignores armor"
    },/**/
  tempestDjinni: {
    name: "Tempest Djinni", subtype: "elemental",
    level: 2, hp: 11,
    dmg: 4, atkspeed: 1500,
    armor: 0,
    abilities: "Fast"
    },/**/
  grumblingToolbox: {
    name: "Grumbling Toolbox", subtype: "contraption",
    level: 2, hp: 16,
    dmg: 4, atkspeed: 5000,
    armor: 2,
    abilities: "Armored",
    },/**/
  mercurialSentinel: {
    name: "Mercurial Sentinel", subtype: "gargoyle",
    level: 2, hp: 13,
    dmg: 2, atkspeed: 2000,
    armor: 2,
    abilities: "Armored; Fast",
    },/**/
  tenaciousScrap: {
    name: "Tenacious Scrap", subtype: "meatling",
    level: 2, hp: 12,
    dmg: 2, atkspeed: 4000,
    armor: 0,
    abilities: "Becomes Meatling on death",
    onDeath: function() {initiateMonster('meatling', 'T');},
    },/**/
  aetherHawk: {
    name: "Aether Hawk", subtype: "luminid",
    level: 2, hp: 23,
    dmg: 2, atkspeed: 4000,
    armor: 0,
    abilities: "Spawns Cosmid on death",
    onDeath: function() {initiateMonster('cosmid', 'T');},
    },/**/
  jaggedVinekin: {
    name: "Jagged Vinekin", subtype: "vinekin",
    level: 2, hp: 12,
    dmg: 2, atkspeed: 6000,
    armor: 0,
    abilities: "Next monster gets +2 attack",
    onSpawn: function() { Game.jagged = true; },
    },/**/
  corrosiveVinekin: {
    name: "Corrosive Vinekin", subtype: "vinekin",
    level: 2, hp: 10,
    dmg: 2, atkspeed: 9000,
    armor: 0,
    onAtk: function() {desecrate(1);},
    abilities: "Desecrates; next monster desecrates",
    onSpawn: function() { Game.corrosive = true; },
    },/**/
  sunblissBlossom: {
    name: "Sunbliss Blossom", subtype: "vinekin",
    level: 2, hp: 15,
    dmg: 3, atkspeed: 9000,
    armor: 0,
    stunImmune: true,
    abilities: "Immune to stun; next monster is immune to stun",
    onSpawn: function() { Game.sunbliss = true; },
    },/**/
  organRunner: {
    name: "Organ Runner", subtype: "vinekin",
    level: 2, hp: 20,
    dmg: 2, atkspeed: 8000,
    armor: 0,
    regenerates: 2, regenSpeed: 10000,
    abilities: "Regenerates; next monster regenerates",
    onSpawn: function() { Game.organ = true; },
    },/**/
  catalystFoliage: {
    name: "Catalyst Foliage", subtype: "vinekin",
    level: 2, hp: 8,
    dmg: 1, atkspeed: 1200,
    armor: 0,
    abilities: "Super fast; next monster attacks faster",
    onSpawn: function() { Game.catalyst = true; },
    },/**/
  azothIvy: {
    name: "Azoth Ivy", subtype: "vinekin",
    level: 2, hp: 13,
    dmg: 2, atkspeed: 7000,
    armor: 1,
    abilities: "Armored; next monster gains armor",
    onSpawn: function() { Game.azoth = true; },
    },/**/
  enslavedMeteorite: {
    name: "Enslaved Meteorite", subtype: "cosmid",
    level: 2, hp: 36,
    dmg: 3, atkspeed: 3500,
    armor: 0,
    abilities: "Burns out; spawns Cosmid on death",
    onDeath: function() {initiateMonster('cosmid', 'T');},
    regenerates: -1, regenSpeed: 1000
    },/**/
  }
monsters[3] = {
  afizzariDancer: {
    name: "Afizzari Dancer", subtype: "golem",
    level: 5, hp: 40,
    dmg: 4, atkspeed: 5000,
    armor: 0,
    abilities: "Made of precious metals",
    },/**/
  needleworkFiend: {
    name: "Needlework Fiend", subtype: "zombie",
    level: 3, hp: 25,
    dmg: 2, atkspeed: 5000,
    armor: 0,
    abilities: "Regenerates",
    regenerates: 4, regenSpeed: 10000,
    },/**/
  ungratefulSlurp: {
    name: "Ungrateful Slurp", subtype: "slime",
    level: 3, hp: 34,
    dmg: 4, atkspeed: 6000,
    armor: 0,
    onAtk: function() {discard(1);},
    abilities: "Discards cards on hit"
    },/**/
  cupellatedBulkhead: {
    name: "Cupellated Bulkhead", subtype: "golem",
    level: 3, hp: 16,
    dmg: 4, atkspeed: 5000,
    armor: 3,
    abilities: "Armored",
    },
  telkineBulwark: {
    name: "Telkine Bulwark", subtype: "telkine",
    level: 3, hp: 23,
    dmg: 3, atkspeed: 8000,
    armor: 4,
    abilities: "Armored",
    },/**/
  voltMeat: {
    name: "Volt Meat", subtype: "aberration",
    level: 3, hp: 30,
    dmg: 2, atkspeed: 6000,
    armor: 0,
    abilities: "Becomes regular meat on death",
    onDeath: function() {
      $("#deck").append(reAgent('RR'));
      tell("<img src='R' /><img src='R' /> added to your deck.");
      bEnd(true);
      },
    },/**/
  apothecaryPet: {
    name: "Apothecary Pet", subtype: "vermin",
    level: 3, hp: 11,
    dmg: 3, atkspeed: 7000,
    armor: 0,
    //immunity: 'C',
    onSpawn: function() {
      var aegis = basicIng();
      this.immunity = aegis;
      this.abilities = "Immune to <img src='"+aegis+".png' />";
      $('#baddie .abilities').html(this.abilities);
      }
    },/**/
  snaptoothAsteridae: {
    name: "Snaptooth Asteridae", subtype: "mutandi",
    level: 3, hp: 28,
    dmg: 5, atkspeed: 5000,
    armor: 1,
    abilities: "Its blood heals you",
    onDeath: function() {heal(10); bEnd(true);},
    },/**/
  lavaspoutGargoyle: {
    name: "Lavaspout Gargoyle", subtype: "gargoyle",
    level: 3, hp: 14,
    dmg: 6, atkspeed: 4000,
    armor: 2,
    abilities: "Armored",
    },
  }
monsters[4] = {
  sunspot: {
    name: "Sunspot", subtype: "elemental",
    level: 4, hp: 35,
    dmg: 5, atkspeed: 5500,
    armor: 0,
    abilities: "Obscures light",
    onSpawn: function() {
      $('#hand, #recipe').addClass('dark');
      },
    },/**/
  warSalamander: {
    name: "War Salamander", subtype: "salamander",
    level: 4, hp: 50,
    dmg: 6, atkspeed: 5000,
    armor: 0,
    abilities: "Burns out",
    regenerates: -1, regenSpeed: 1000
    },/**/
  keystoneBrawler: {
    name: "Keystone Brawler", subtype: "golem",
    level: 4, hp: 30,
    dmg: 4, atkspeed: 9000,
    armor: 1, lifesteal: true,
    abilities: "Lifesteal",
    },/**/
  manflinger: {
    name: "Manflinger", subtype: "zombie",
    level: 4, hp: 42,
    dmg: 8, atkspeed: 7000,
    armor: 1
    },
  spitefulBlaze: {
    name: "Spiteful Blaze", subtype: "elemental",
    level: 4, hp: 30,
    dmg: 5, atkspeed: 6000,
    armor: 0,
    abilities: "Thorns", thorns: 5
    },/**/
  ubimshoBrute: {
    name: "Ubimsho Brute", subtype: "devil",
    level: 4, hp: 31,
    dmg: 13, atkspeed: 11000,
    armor: 1, abilities: "Brutal"
    },/**/
  cavernWatcher: {
    name: "Cavern Watcher", subtype: "leshii",
    level: 4, hp: 35,
    dmg: 6, atkspeed: 8000,
    armor: 0,
    abilities: "Protected by its comrades",
    protector: true,
    },/**/
  tundraEmissary: {
    name: "Tundra Emissary", subtype: "elemental",
    level: 4, hp: 54,
    dmg: 7, atkspeed: 6500,
    armor: 0
    },
  }
monsters[5] = {
  geysersprite: {
    name: "Geysersprite", subtype: "devil",
    level: 5, hp: 42,
    dmg: 6, atkspeed: 5000,
    armor: 0,
    },/**/
  nethermawImago: {
    name: "Nethermaw Imago", subtype: "drek",
    level: 5, hp: 35,
    dmg: 6, atkspeed: 8000,
    armor: 1,
    onAtk: function() {desecrate(1);},
    abilities: "Desecrates"
    },/**/
  steelseeker: {
    name: "Steelseeker", subtype: "telkine",
    level: 5, hp: 20,
    dmg: 6, atkspeed: 7000,
    armor: 5,
    onAtk: function() {benchAdd('M');},
    abilities: "Armored; gives you metal"
    },/**/
  loamBeast: {
    name: "Loam Beast", subtype: "elemental",
    level: 5, hp: 65,
    dmg: 4, atkspeed: 9000,
    armor: 1,
    },/**/
  }
monsters[6] = {
  frenzyOfLimbs: {
    name: "Frenzy of Limbs", subtype: "aberration",
    level: 6, hp: 50,
    dmg: 7, atkspeed: 5000,
    armor: 1,
    },/**/
  }
monsters[7] = {}
monsters[8] = {}
monsters[9] = {}
monsters[10] = {}
monsters[11] = {}
monsters[12] = {}
monsters[13] = {}
monsters[14] = {}
monsters[15] = {}
monsters[16] = {}
monsters[17] = {}
monsters[18] = {}
monsters[19] = {}
 
// token monsters
monsters['T'] = {
  meatling: {
    name: "Meatling",
    level: 1, hp: 12,
    dmg: 2, atkspeed: 4000,
    armor: 0,
    },/**/
  cosmid: {
    name: "Cosmid",
    level: 1, hp: 11,
    dmg: 1, atkspeed: 2000,
    armor: 0, abilities: "Fast"
    },/**/
  }
// test monsters
monsters['test'] = {
  spitefulBlaze: {
    name: "Spiteful Blaze",
    level: 4, hp: 30,
    dmg: 5, atkspeed: 6000,
    armor: 0,
    abilities: "Thorns", thorns: 5
    },/**/
  }
  
// initiate a monster
var circle; var enemy;
function initiateMonster(monster, level) {
  $('.affix-overlay').remove();
  var battleNum = floors+1;
  if(localStorage.mode=='story') {battleNum = parseInt(localStorage[localStorage.guild+'Story'])+1;}
  if(circle) {circle.unbind(); circle.remove();} // remove previous monster's attack routine
  enemy = window["monsters"][level][monster];
  $('#baddie').data('enemy', monster); 
  $('#baddie').data('level', enemy.level);
  var dmg = enemy.dmg;
  var armor = enemy.armor;
  var hp = enemy.hp;
  var title = 'Room #'+battleNum+': '+enemy.name;
  Game.eAttackSpeed = enemy.atkspeed;
  if(enemy.abilities) {$('#baddie .abilities').html(enemy.abilities);} 
    else {$('#baddie .abilities').html('');}
  $('#baddie .title').html(title);
  $('#baddie .hpbar .inner').stop().css('width', '100%');
  $('#baddie .portrait').html('<img src="portraits/'+monster+'.png" />');
  
  if(enemy.leveled) {
    cl(getFirstWord(enemy.name));
    $('#baddie .portrait').append('<div class="affix-overlay '+getFirstWord(enemy.name)+'"></div>');
    }
  
  $('#baddie .damage').html('<div id="circle"></div><span>'+dmg+'</span>');  
  $('#baddie .armor').text(armor);  
  $('#baddie .hp').html(hp).data('max', hp);  
  // enable attack routine
  circle = $('#circle').circleProgress({
        value: 0,
        size: 80,
        thickness: 10,
        fill: { color: "#67cac5" },
        animation: false,
    });
  }
  

// function for picking next monster. if necessary, will level up lower-level monsters
var affixes = ['', '', 'Angry', 'Veteran', 'Elite', 'Master', 'Super', 'Golden', 'Philosopher', 'Godly'];
function nextMonster(level) {
  var options = Object.size(monsters[level]); // figure out how many possible monsters @ this level
  //cl(level); //cl(monsters[level]); //cl(options); // debug
  if(options<10&&level>4) {
    // only level up weaker monsters if there aren't enough options
    if(randomInt(1,10)<options) { // we do want to pick 'native' monsters when posible
      // cl('go with a natural resident of this floor'); // debug
      next_monster = pickRandomProperty(monsters[level]);
      }
    else {
      // cl("leveling up!"); // level up
      var max_level = level - 2; // don't level up a monster from the previous level.
      // don't level up a monster that wouldn't have an affix. right now, 9 levels lower is the minimum ("godly").
      var min_level = Math.max((level - 9), 0); 
      var lower_level = randomInt(min_level, max_level); // get a random level in the range
      // cap lower-level monster @ highest base monster level. right now, 6 base levels is the maximum (Frenzy of Limbs).
      lower_level = Math.min(lower_level, 6);       
      // cl(lower_level); //lower_level = 0; // debug
      
      // get lower-level monster
      next_monster = pickRandomProperty(monsters[lower_level]);
      // cl(monsters[lower_level][next_monster]); // debug
      if(!monsters[level][next_monster]) { // if there is no appropriately leveled-up variant of the monster, level it up!
        // make a copy of the base monster
        monsters[level][next_monster] = jQuery.extend({}, monsters[lower_level][next_monster]);
        // modify the new elite monster's stats and name
        var statMod = (level-1)/Math.max(lower_level, 1); // get some ratios for hp and damage
        var lvlDiff = level - lower_level; // get the difference in levels for affixes, level, and armor;
        monsters[level][next_monster].dmg = parseInt(monsters[level][next_monster].dmg*statMod);
        monsters[level][next_monster].hp = parseInt(monsters[level][next_monster].hp*statMod);
        monsters[level][next_monster].level += lvlDiff;
        monsters[level][next_monster].armor += Math.floor(lvlDiff/3);
        monsters[level][next_monster].name = affixes[lvlDiff] + ' ' + monsters[level][next_monster].name;
        monsters[level][next_monster].leveled = 'true';
        }
      //cl(monsters[level]);    
      }
    }
  else {
    // don't level up if there's an available monster! just grab it at a random
    next_monster = pickRandomProperty(monsters[level]);
    }
  //cl(next_monster); // debug
  }