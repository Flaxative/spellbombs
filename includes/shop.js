// == //
// shop functions, until we move them
// == //

// function to purchase a reagent
function buyReagent(code) {
  var cost = $('.reagents-shop .'+code).data('cost');
  if(cost <= parseInt(localStorage.gold)) {
    $('.reagents-shop .'+code).unbind();
    goldUp(-cost);
    other_reagents.push(code);
    localStorage["bought"+code] = true;
    //cl(localStorage["bought"+code]);
    $('.reagents-shop .'+code).removeClass('buyable')
      .addClass('bought').prepend('<div class="check"></div>')
      .find('.cost').remove();
    if($('.reagent.buyable').length<1&&!hasTrophy('RP2')) {awardTrophy('RP2');}
    }
  else {
    warn("You don't have enough gold to buy that.");
    }
  }

// function to display a reagent
function reagentDisplay(code) {
  var cost = 100;
  if(localStorage["bought"+code]=='true') {
    $('.reagents-shop').append(reAgent(code));
    $('.reagents-shop .'+code).addClass('bought').prepend('<div class="check"></div>');
    }
  else {
    if(code.indexOf('J')>-1) {cost = 50;}
    $('.reagents-shop').append(reAgent(code));
    $('.reagents-shop .'+code).addClass('buyable')
    .data('cost', cost).append("<div class='cost'>"+cost+"</div>")
    .click(function() {buyReagent(code);});
    }
  }

// function to purchase a recipe
function buyRecipe(reagents) {
  var cost = $('.recipes-shop .'+reagents).data('cost');
  if(cost <= parseInt(localStorage.gold)) {
    gainRecipe(reagents);
    goldUp(-cost);
    }
  else {
    warn("You don't have enough gold to buy that.");
    }
  }
  
// function to add a recipe
function gainRecipe(reagents) {
  $('.recipes-shop .'+reagents).unbind();
  spellbombsKnown[reagents] = spellbombs[reagents];
  localStorage["known"+reagents] = true;
  $('.recipes-shop .'+reagents).removeClass('buyable')
      .addClass('bought').prepend('<div class="check"></div>')
      .after('<div class="function">'+spellbomb_descriptions[reagents]+'</div>')
      .find('.cost').remove();
  $('.recipes-shop .'+reagents).next().hide().slideDown(200);
  recipeTrophies();
  }
  
// function for checking for recipe trophies
function recipeTrophies() {
  if($('.recipe.buyable:has(.C)').length<1&&!hasTrophy('RPC')) {awardTrophy('RPC');}
  if($('.recipe.buyable:has(.M)').length<1&&!hasTrophy('RPM')) {awardTrophy('RPM');}
  if($('.recipe.buyable:has(.R)').length<1&&!hasTrophy('RPR')) {awardTrophy('RPR');}
  if($('.recipe.buyable:has(.A)').length<1&&!hasTrophy('RPA')) {awardTrophy('RPA');}
  if($('.recipe.buyable:has(.N)').length<1&&!hasTrophy('RPN')) {awardTrophy('RPN');}
  if($('.recipe.buyable:has(.T)').length<1&&!hasTrophy('RPT')) {awardTrophy('RPT');}
  if(hasTrophy('RPC')&&hasTrophy('RPM')&&hasTrophy('RPR')&&hasTrophy('RPA')&&hasTrophy('RPN')&&hasTrophy('RPT')&&!hasTrophy('RP1')) {
    awardTrophy('RP1');
    }
  }
  
// function to display a recipe
function recipeDisplay(reagents) {
  if(localStorage["known"+reagents]=='true') {
    $('.recipes-shop').append(recipe(reagents));
    $('.recipes-shop .recipe.'+reagents).addClass('bought').prepend('<div class="check"></div>')
    .after('<div class="function">'+spellbomb_descriptions[reagents]+'</div>');
    }
  else {
    var cost = 0;
    if(reagents.length==2) {cost = 100;}
    if(reagents.length==3) {cost = 1000;}
    if(reagents.length==4) {cost = 9999;}
    $('.recipes-shop').append(recipe(reagents));
    $('.recipes-shop .recipe.'+reagents).addClass('buyable')
    .data('cost', cost).append("<div class='cost'>"+cost+"</div>")
    .click(function() {buyRecipe(reagents);});
    }
  }

// function to go between shop tabs
var shopTrans = false;
function shopTab(shop) {
  if(shopTrans) {return;}
  else {shopTrans = true;}
  if($('.shop:visible').length) {
    if($('.shop:visible').hasClass(shop+'-shop')) {shopTrans = false; return;}
    if($('.shop:visible').data('shop')<$('.shop.'+shop+'-shop').data('shop')) {
      $('.shop:visible').animate({
        left:'-100%', 
        right: '100%'
        }, 200, function() {
        $(this).css('left', 0).css('right', 0).stop().hide();
        //$('.'+shop+'-shop').show();
        });    // hide previous shop tab
      $('.shop.'+shop+'-shop').show().css('left', '100%').css('right', '-100%').animate({
        left:'0', 
        right: '0'
        }, 200, function() {
        //$('.'+shop+'-shop').show();
        });    // hide previous shop tab
      }
    else {
      $('.shop:visible').animate({
        left:'100%', 
        right: '-100%'
        }, 200, function() {
        $(this).css('left', 0).css('right', 0).stop().hide();
        });    // hide previous shop tab   
      $('.shop.'+shop+'-shop').show().css('left', '-100%').css('right', '100%').animate({
        left:'0', 
        right: '0'
        }, 200, function() {
        //$('.'+shop+'-shop').show();
        });    // hide previous shop tab   
      }  
    }
  else {$('.'+shop+'-shop').show();}
  // tweak the shop tabs display
  $('#shop-tabs .inner').removeClass('selected');
  $('.inner.'+shop).addClass('selected');
  // set shop height so page doesn't scroll
  var busy = $('header:visible').outerHeight()+$('#shop-tabs').outerHeight(); //cl(busy);
  var winHeight = window.innerHeight; //cl(winHeight);
  var newH = winHeight - busy; //cl(newH);
  $('.'+shop+'-shop').height(newH);
  clearRecipeFilter();
  $('.'+shop+'-shop').scrollTop(0);
  shopTrans = false;
  }

// filter recipes in shop
var rFilter = '';
function recipeFilter(discipline) {
  $('.shop-head .'+discipline).toggleClass('enabled');
  if($('.shop-head .enabled').length) { $('.shop-head .icon').not('.enabled').addClass('disabled'); }
  else {$('.shop-head .icon').removeClass('disabled');}
  $('.shop-head .enabled').removeClass('disabled');
  if($('.shop-head .'+discipline).hasClass('enabled')) {
    rFilter += discipline;
    }
  else {rFilter = rFilter.replace(discipline, '');}
  rFilter = rFilter.split('').sort().join('');
  //cl(rFilter);
  $('.recipes-shop .recipe').hide();
  $('.recipes-shop .recipe').each(function() {
    var alphaRecipe = $(this).data('recipe').split('').sort().join('');
    var match = alphaRecipe.indexOf(rFilter);
    if(match==-1) {$(this).hide(); $(this).next().hide();}
    else {$(this).show(); $(this).next().show();}
    });
  }
function clearRecipeFilter() {
  rFilter = '';
  $('.shop-head .icon').removeClass('enabled').removeClass('disabled');
  $('.recipes-shop .recipe').show().next().show();
  }
  
var faces = [
  'carelessExperiment',
  'disassemblingTouch',
  'destructiveExperiment',
  'stitchingProdigy',
  'sirenFruit',
  'magesteelGolem'
  ];
if(!localStorage.face) { 
  localStorage.face = 'carelessExperiment';
  localStorage.boughtcarelessExperiment = true;
  }
  
function faceDisplay(face) {
  var cost = 50;
  $('.cosmetics-shop').append("<div class='face "+face+"' data-face='"+face+"'></div>");
  $('.face.'+face).css('background-image', 'url(portraits/'+face+'.png)');
  if(localStorage["bought"+face]=='true') {
    $('.face.'+face).addClass('bought').prepend('<div class="check"></div>');
    if(localStorage.face==face) {$('.face.'+face).addClass('enabled');}
    $('.face.'+face).click(function() {equipFace(face);});
    }
  else {
    $('.face.'+face).addClass('buyable')
    .data('cost', cost).append("<div class='cost'>"+cost+"</div>")
    .click(function() {
      buyFace(face);
      });
    }
  }

function buyFace(face) {
  var cost = $('.cosmetics-shop .'+face).data('cost');
  if(cost <= parseInt(localStorage.gold)) {
    $('.face.'+face).unbind().click(function() {equipFace(face);});
    goldUp(-cost);
    cl('yep');
    localStorage["bought"+face] = true;
    $('.cosmetics-shop .'+face).removeClass('buyable').addClass('bought').append('<div class="check"></div>')
    .find('.cost').remove();
    if($('.face.buyable').length<1&&!hasTrophy('RP3')) {awardTrophy('RP3');}
    }
  else {
    warn("You don't have enough gold to buy that.");
    }
  }
  
function equipFace(face) {
  localStorage.face = face;
  $('.cosmetics-shop .face').removeClass('enabled');
  $('.cosmetics-shop .'+face).addClass('enabled');
  setFace();
  }
function setFace() {$('#you .portrait img').attr('src', 'portraits/'+localStorage.face+'.png');}

function resetFaces() {
  for (var i = 0; i < faces.length; i++) {
    cl(localStorage["bought"+faces[i]]);
    localStorage["bought"+faces[i]] = false;
    }
  localStorage.boughtcarelessExperiment = true;
  localStorage.face = 'carelessExperiment';
  }
  
// more recipe filtering
function toggleKnown() {
  var state = $('.known').text();
  if(state=='ALL') {
    $('.known').addClass('enabled').text('OWN');
    $('.recipes-shop .buyable').addClass('ninja');
    }
  else if(state=='OWN') {
    $('.known').text('NEW');
    $('.recipes-shop .buyable').removeClass('ninja');
    $('.recipes-shop .bought').addClass('ninja')
    .next().addClass('ninja');
    }
  else if (state=='NEW') {
    $('.known').text('ALL').removeClass("enabled");
    $('.recipes-shop .bought').removeClass('ninja')
    .next().removeClass('ninja');
    }
  }