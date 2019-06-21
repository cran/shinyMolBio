// select all click
$(document).on("click", ".pcr-plate-tbl.interactive thead tr th.toggle-all", function() {
  var notempty = $(this).parents(".pcr-plate").find('td:not(.empty-well)');
  if (notempty.length == 0)
    return;
  if (notempty.length == $(this).parents(".pcr-plate").find('td.selected-well').length)
    notempty.removeClass('selected-well');
  else
    notempty.addClass('selected-well');
  $(this).parents(".pcr-plate").trigger('change');
});

// select column click
$(document).on("click", ".pcr-plate-tbl.interactive thead tr th", function() {
  var index = this.cellIndex + 1;
  var notempty = $(this).parents(".pcr-plate").find('td:nth-child(' + index + '):not(.empty-well)');
  if (notempty.length === 0)
    return;
  if (notempty.length == $(this).parents(".pcr-plate").find('td:nth-child(' + index + ').selected-well').length)
    notempty.removeClass('selected-well');
  else
    notempty.addClass('selected-well');
  $(this).parents(".pcr-plate").trigger('change');
});

// select column dblclick
$(document).on("dblclick", ".pcr-plate-tbl.interactive thead tr th", function() {
  var index = this.cellIndex + 1;
  $(this).parents(".pcr-plate").find('td').removeClass('selected-well');
  $(this).parents(".pcr-plate").find('td:nth-child(' + index + '):not(.empty-well)').addClass('selected-well');
  $(this).parents(".pcr-plate").trigger('change');
});

// select row click
$(document).on("click", ".pcr-plate-tbl.interactive tbody tr th", function() {
  var notempty = $(this).parent().find('td:not(.empty-well)');
  if (notempty.length == 0)
    return;
  if (notempty.length == $(this).parent().find('td.selected-well').length)
    notempty.removeClass('selected-well');
  else
    notempty.addClass('selected-well');
  $(this).parents(".pcr-plate").trigger('change');
});
// select row dblclick
$(document).on("dblclick", ".pcr-plate-tbl.interactive tbody tr th", function() {
  $(this).parent().parent().find('td').removeClass('selected-well');
  $(this).parent().find('td:not(.empty-well)').addClass('selected-well');
  $(this).parents(".pcr-plate").trigger('change');
});

// select well click
$(document).on("click", ".pcr-plate-tbl.interactive tbody td:not(.empty-well)", function(event) {
    $(this).parents(".pcr-plate").trigger('change');
    if (event.ctrlKey === true){
      var group = this.getAttribute('group');
      var groupedWells = $(this).parents(".pcr-plate").find("[group='"+group+"']");
      if (groupedWells.get().every(well => well.classList.contains('selected-well')) === true)
        groupedWells.removeClass('selected-well');
      else
        groupedWells.addClass('selected-well');
    } else {
      $(this).toggleClass('selected-well');
    }
    $(this).parents(".pcr-plate").trigger('change');
});
// select well dblclick
$(document).on("dblclick", ".pcr-plate-tbl.interactive tbody td:not(.empty-well)", function() {
    $(this).parent().parent().find('td.selected-well').removeClass('selected-well');
    $(this).addClass('selected-well');
    $(this).parents(".pcr-plate").trigger('change');
});

// URL input binding
// This input binding is very similar to textInputBinding from
// shiny.js.
var pcrPlateInputBinding = new Shiny.InputBinding();

// An input binding must implement these methods
$.extend(pcrPlateInputBinding, {

  // This returns a jQuery object with the DOM element
  find: function(scope) {
    return $(scope).find('.pcr-plate');
  },

  // return the ID of the DOM element
  getId: function(el) {
    return el.id;
  },

  // Given the DOM element for the input, return the value
  getValue: function(el) {
    var selected = $(el).find('td.selected-well').map(function() { return this.id; }).get();
    if (selected.length == 0)
      return $(el).find('td:not(.empty-well)').map(function() { return this.id; }).get();
    return selected;
  },

  // Given the DOM element for the input, set the value
  setValue: function(el, selection) {
    if (Array.isArray(selection) === false)
      selection = [selection]
    selection = selection.map(function(el) {return '#' + el});
    $(el).find(selection.join(',')).addClass('selected-well');
  },

  // Set up the event listeners so that interactions with the
  // input will result in data being sent to server.
  // callback is a function that queues data to be sent to
  // the server.
  subscribe: function(el, callback) {
    $(el).on('change.pcrPlateInputBinding', function(event) {
      callback(true);
    });
  },

  // Remove the event listeners
  unsubscribe: function(el) {
    $(el).off('.pcrPlateInputBinding');
  },

  // Receive messages from the server.
  // Messages sent by updatePcrPlateInput() are received by this function.
  receiveMessage: function(el, data) {

    if (data.hasOwnProperty('selection')){
      this.setValue(el, data.selection)
    };

    if (data.hasOwnProperty('label'))
      $(el).parent().find('label[for="' + $escape(el.id) + '"]').text(data.label);

    $(el).trigger('change');
  },

  // This returns a full description of the input's state.
  // Note that some inputs may be too complex for a full description of the
  // state to be feasible.
  getState: function(el) {
    return {
    label: $(el).parent().find('label[for="' + $escape(el.id) + '"]').text(),
    value: el.value
    };
  },

  // The input rate limiting policy
  getRatePolicy: function() {
    return {
      // Can be 'debounce' or 'throttle'
      policy: 'debounce',
      delay: 250
    };
  }


});

Shiny.inputBindings.register(pcrPlateInputBinding, 'Kablag.pcrPlateInput');