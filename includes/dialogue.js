function dialogue(d) {
  //cl(dialogues); // debug
  // initiate dialogue variables
  d = window["dialogues"][d];
  d.side = typeof d.side !== 'undefined' ? d.side : 'L';
  d.clearL = typeof d.clearL !== 'undefined' ? d.clearL : true;
  d.clearR = typeof d.clearR !== 'undefined' ? d.clearR : true;
  d.next = typeof d.next !== 'undefined' ? d.next : false;
  d.callback = typeof d.callback !== 'undefined' ? d.callback : hi;
  // clear portraits
  if(d.clearL) {$('#speakerL').html('');}
  if(d.clearR) {$('#speakerR').html('');}
  // place new content
  $('#speaker'+d.side).html('<img src="speakers/'+d.name+'.png" />');
  $('#dialogue .speaker').html(d.name);
  $('#dialogue p').html(d.text);
  // if there's a next dialogue, go to it; else, do callback function
  $('#dialogue').unbind('click').click(function() {
    if(d.next) {dialogue(d.next);} else {d.callback();}
    });
  }
  
// dictionary of dialogues
var dialogues = {
  C01: {name: 'Bert', text: 'Hello!', next: 'C02'},
  C02: {name: 'Marx', text: 'Howdy!', side: 'R', clearL: false, callback: function() {tell("Let's go to battle!");}},
  }