// battle functionality
function damage(actor, amount, disciplines, bypass, lifesteal) {
  bypass = typeof bypass !== 'undefined' ? bypass : false;
  lifesteal = typeof lifesteal !== 'undefined' ? lifesteal : false;
  disciplines = typeof disciplines !== 'undefined' ? disciplines: false;
  
  var other = 'you'; if(actor=='you') {other = 'baddie';} else {Game.pacifist = false;}
  
  // damage buffs
  var dBuff = parseInt($('#you .damage span').text());
  if(actor=="baddie") {  amount += dBuff; } if (amount<0) {amount = 0;}
  if(actor=='baddie'&&Game.doubling) {amount = amount*2;}
  
  // bypass armor if bypassing armor
  if(bypass) {var armor = 0;} else {var armor = $('#'+actor+' .armor').text();}
  // apply armor if armor
  if(amount>0) {amount -= armor;}
  if(amount<0) {amount = 0;}
  
  // check for immunity
  if(disciplines) {
    if(disciplines.indexOf(enemy["immunity"])>-1) {amount = 0; warn("Enemy is immune to <img src='"+enemy["immunity"]+".png' />!");}
    }
  
  var hp = $('#'+actor+' .hp').text();          // get old hp
  var maxHp = $('#'+actor+' .hp').data('max');  // get max hp
  
  // check bonus from trophies
  if(actor=='baddie') {
    var bonus = 1 + parseInt(localStorage.trophies)/100;
    amount = Math.floor(amount * bonus);
    }
  
  hp -= amount;                                 // change hp
  // cl('dealing '+amount+' damage');              // debug
  if(hp<0) {hp = 0;} if(hp>maxHp) {hp = maxHp;} // hp can't go over max or under 0
  var pasento = hp/maxHp*100; // manipulate hp bar
  $('#'+actor+' .hpbar .inner').animate({width: pasento+'%'}, 300);
  $('#'+actor+' .hp').text(hp); // change hp #
  if(amount) {dSplat(actor, amount);}
  checkLife();
  if(amount>0) { // don't do these on-damage triggers if damage was 0
    if(lifesteal&&battling) {heal(amount, other);}
    if(enemy.thorns&&battling&&actor=='baddie') {damage('you', enemy.thorns);}
    if(Game.thorns&&battling&&actor=='you') {poisonDmg(Game.thorns);}
    if(actor=="you"&&Game.runningOrgans&&battling) {
      var ing = 'N'; var rInt = randomInt(0,1); if(rInt>0) {ing = 'R'}
      benchAdd(ing);
      }
    }
  }

function dSplat(actor, amount) {
  var broPos = $('#'+actor+' .portrait').offset();
  broPos.left -= 13; broPos.top -= 3;
 // var x = bro.offset().left;
 // var y = bro.offset().top;
  var rand = Math.floor(Math.random()*1000000000);
  $('body').append('<div id="r'+rand+'" class="splat dmg">-'+amount+'</div>'); 
  var rotation = randomInt(-10, 10);
  $('#r'+rand).hide().offset(broPos).velocity({rotateZ: rotation+'deg'}, 0).velocity('fadeIn', {duration: 50}).delay(750).velocity('fadeOut', {duration: 150, complete: function() {$(this).remove();} });
  //cl(actor+amount);
  }

function hSplat(actor, amount) {
  var broPos = $('#'+actor+' .portrait').offset();
  broPos.left += $('#'+actor+' .portrait').width()-13; broPos.top -= 3;
 // var x = bro.offset().left;
 // var y = bro.offset().top;
  var rand = Math.floor(Math.random()*1000000000);
  $('body').append('<div id="r'+rand+'" class="splat hl">+'+amount+'</div>'); 
  var rotation = randomInt(-10, 10);
  $('#r'+rand).hide().offset(broPos).velocity({rotateZ: rotation+'deg'}, 0).velocity('fadeIn', {duration: 50}).delay(750).velocity('fadeOut', {duration: 150, complete: function() {$(this).remove();} });
  //cl(actor+amount);
  }

  //
function statusEffect(name, id, positive, actor) {
  actor = typeof actor !== 'undefined' ? actor : 'you';
  positive = typeof positive !== 'undefined' ? positive : 'helpful';
  $('#'+actor+' .status-effects').append('<div id="r'+id+'" class="effect '+positive+' '+name+'">'+name+'</div>');  
  var rotation = randomInt(-10, 10);
  $('#r'+id).velocity({rotateZ: rotation+'deg'}, 0);
  }

// separate function for poison damage since damage hooks shouldn't apply
function poisonDmg(x, disciplines) {
  disciplines = typeof disciplines !== 'undefined' ? disciplines: false;
  var hp = $('#baddie .hp').text();
  var maxHp = $('#baddie .hp').data('max');
  if(disciplines) {
    if(disciplines.indexOf(enemy["immunity"])>-1) {x = 0; warn("Enemy is immune to <img src='"+enemy["immunity"]+".png' />!");}
    }
  
  hp -= x; if(hp<0) {hp = 0;} if(hp>maxHp) {hp = maxHp;}
  var pasento = hp/maxHp*100; // manipulate hp bar
  $('#baddie .hpbar .inner').animate({width: pasento+'%'}, 300);
  $('#baddie .hp').text(hp); // change hp #
  if(parseInt(x)>0) {dSplat("baddie", parseInt(x));}
  if(parseInt(x)<0) {hSplat("baddie", parseInt(-x));}
  checkLife();
  }

function heal(x, actor) {
  actor = typeof actor !== 'undefined' ? actor : 'you';
  var hp = parseInt($('#'+actor+' .hp').text());          // get old hp
  var maxHp = $('#'+actor+' .hp').data('max');  // get max hp
  // check bonus from trophies
  if(actor=='you') {
    var bonus = 1 + parseInt(localStorage.trophies)/100;
    x = Math.floor(x * bonus);
    }
  hp += x;                                 // change hp
  if(hp<0) {hp = 0;} if(hp>maxHp) {hp = maxHp;} // hp can't go over max or under 0
  var pasento = hp/maxHp*100; // manipulate hp bar
  $('#'+actor+' .hpbar .inner').animate({width: pasento+'%'}, 300);
  $('#'+actor+' .hp').text(hp); // change hp #
  hSplat(actor, x);
  }

// checks if a character is dead and ends battle if yes
function checkLife() {
  if($('#baddie .hp').text()==0) {/*cl('baddie dead');*/ 
    if(!enemy.onDeath) {bEnd(true); return;}
    else {enemy.onDeath();}
    }
  if($('#you .hp').text()==0) {/*cl('you dead');*/ 
    var st = enemy.subtype; // get subtype for stats
    // cl(st);
    localStorage[st+'Prey'] = Number(localStorage[st+'Prey'])+1; // increase slayer stat
    if(localStorage[st+'Prey']==1) {localStorage.sandbag = Number(localStorage.sandbag)+1;} // add to collection
    hiScore(st+'Prey'); hiScore('sandbag');
    bEnd(false); return;}
  }
  
// draw cards faster for a period
function drawFaster(decrease, duration) {
  Game.drawSpeed -= decrease;
  var rand = Math.floor(Math.random()*1000000000);
  statusEffect('Inspired', rand);
  battleTimers.push(setTimeout(function() {
    Game.drawSpeed += decrease;
    $('#r'+rand).remove(); 
    }, duration));
  }
  
// add armor
function armorD(actor, amount) {
  var armor = parseInt($('#'+actor+' .armor').text());
  armor += parseInt(amount);
  //if(armor<0) {armor = 0;}
  $('#'+actor+' .armor').text(armor);
  }
  
// add ingredient to workbench
function benchAdd(ingredient) {
  var icon = '<div class="icon '+ingredient+'" data-ingredient="'+ingredient+'"><img src="'+ingredient+'.png" /></div>';
  $('#bench').prepend(icon);
  while($('#bench .icon').length>3) {$('#bench .icon').last().remove();}
  checkRecipe();
  }
  
// strip enemy armor (permanent)
function wither(x, overload, actor) {
  actor = typeof actor !== 'undefined' ? actor : 'baddie';
  overload = typeof overload !== 'undefined' ? overload : false;
  var armor = parseInt($('#'+actor+' .armor').text());
  armor -= parseInt(x);
  if(!overload&&armor<0) {armor = 0;}
  $('#'+actor+' .armor').text(armor);
  }
  
// reduce enemy attack (permanent)
function weaken(x, overload, actor) {
  actor = typeof actor !== 'undefined' ? actor : 'baddie';
  overload = typeof overload !== 'undefined' ? overload : false;
  var damage = parseInt($('#'+actor+' .damage span').text());
  damage -= parseInt(x);
  if(!overload&&damage<0) {damage = 0;}
  if(actor=='you'&&damage>=0) {damage = '+'+damage;}
  //cl(damage);
  $('#'+actor+' .damage span').text(damage);
  }
  
// add armor temporarily
function fortify(actor, amount, duration) {
  armorD(actor, amount); 
  var rand = Math.floor(Math.random()*1000000000);
  statusEffect('Fortified', rand);
  battleTimers.push(setTimeout(function() {
    armorD(actor, -amount); 
    $('#r'+rand).remove(); 
    cl("time is up!");
    }, duration));
  }
  
// reset opponent's attack clock, + stun
function zap(duration) {
  if(!enemy.stunImmune) {
    Game.stunned = true;
    //circle.circleProgress();
    //$(circle.circleProgress('widget')).stop();
    var rand = Math.floor(Math.random()*1000000000);
    statusEffect('Stunned', rand, 'harmful', 'baddie');
    battleTimers.push(setTimeout(function() {Game.stunned = false; $('#r'+rand).remove();}, duration));
    }
  else {warn("Enemy is immune to stun!");}
  }

// randomize workbench
function scramble() {
  if($('#bench .icon').length) {
    $('#bench .icon').each(function() {
      $(this).remove();
      benchAdd(basicIng());
      });
    }
  }

// deal DoT, 1 per tick
function poison(amount, duration) {
  Game.pacifist = false;
  var rand = Math.floor(Math.random()*1000000000);
  statusEffect('Poison', rand, 'harmful', 'baddie');
  battleTimers.push(setTimeout(function() {$('#r'+rand).remove();}, duration));
  var interval = duration/amount; 
  //cl(interval);
  var i = 0;
  while(i<amount) {
    i++;
    battleTimers.push(setTimeout(function() {poisonDmg(1, 'T');}, i*interval));
    }
  }

// stun player
function stunPlayer(duration) {
  Game.pStunned = true;
  var rand = Math.floor(Math.random()*1000000000);
  statusEffect("Stunned", rand, 'harmful');
  $('.bench').addClass('masked');
  battleTimers.push(setTimeout(function() {
    $('#r'+rand).remove(); 
    unStunPlayer();
    }, duration));
  }
function unStunPlayer() {
  $('.bench').removeClass('masked');
  Game.pStunned = false;
  }
  
// desecrate
function desecrate(x) {
  var y = x;
  while(x>0) {
    x--;
    if($('#discard .reagent').length) { // vaporize from discard if possible
      $('#discard .reagent').random().unbind().remove();
      }
    else { // else, vaporize from deck
      $('#deck .reagent').random().unbind().remove();
      }
    }
  warn("Vaporized "+y+" cards from your deck!");
  }

// discard
function discard(x) {
  var y = x;
  while(x>0) {
    x--;
    $('#hand .reagent').random().unbind().stop().fadeOut(400, function() {$(this).prependTo('#discard');});
    }
  }
  
// protector
function protector() {
  if(enemy["protector"]) {
    var roll = randomInt(1,5);
    if(roll==5) {
      $('<div class="mask"></div>').appendTo('body').velocity("fadeIn", {duration: 100}).delay(800).velocity("fadeOut", {duration: 300, complete: function() {$(this).remove()}});
      return true;
      }
    else {return false;}
    }
  else {return false;}
  }
  
function purgeAll() {
  for (var timer in battleTimers) { clearTimeout(battleTimers[timer]); }
  battleTimers = [];
  $('.effect').remove();
  Game.thorns = false; Game.thornsDuration = 0;
  Game.doubling = false; Game.doublingDuration = 0;
  Game.runningOrgans = false; Game.organDuration = 0;
  Game.stunned = false;
  Game.pStunned = false;
  Game.drawSpeed = 3000;
  $('#baddie .damage span').html(enemy["dmg"]);
  $('#baddie .armor').html(enemy["armor"]);
  $('#you .damage span').html("+0");
  $('#you .armor').html("0");
  }