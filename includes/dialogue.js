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
  C0: {name: 'Bert', text: 'Hello!', next: 'C0_1'},
  C0_1: {name: 'Marx', text: 'Howdy!', side: 'R', clearL: false, callback: function() {bStart();}},
  C1: {name: 'Marx', text: 'You won the first battle!', side: 'L', callback: function() {bStart();}},
  C2: {name: 'Bert', text: 'You have now slain two monsters in story mode!', next: 'C2_1'},
  C2_1: {name: 'Bert', text: "Let's see how far we can go with this.", callback: function() {bStart();}}
  
  }
  
