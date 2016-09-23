$(function() {
  var event_template = Handlebars.compile($("#event").html()); // compile Handlebars templates
  var events_template = Handlebars.compile($("#events").html());
  // register partial
  Handlebars.registerPartial("event", $("#event").html());

  var Events = {
    collection: [],
    $el: $("#events_list"), // cache container from DOM that will have the events list
    sort: function() {
      this.collection.sort(function(item1, item2) { // sort events by their date
        return item1.date - item2.date;
      });
    },
    add: function(events) {
      var self = this; // store context in local variable so it can be retained in forEach function invocations
      events = _.isArray(events) ? events : [events]; // if passed in event is not an array, put it in array

      events.forEach(function(event) {
        self.collection.push(event);
      });
      this.sort();
      this.render();
    },
    remove: function(id) { // remove event from the collection of events based on its id
      this.collection = this.collection.filter(function(event) {
        return event.id !== id;
      });
      this.sort();
      this.render();
    },
    render: function() { // write event items to page using Handlebars template
      this.$el.html(events_template({ events: this.collection }));
    }
  };

  $("form").on("submit", function(e) { // bind submit event to form
    e.preventDefault();
    var $form = $(this);
    $.ajax({
      url: $form.attr("action"),
      type: $form.attr("method"),
      data: $form.serialize(),
      success: function(json) {
        Events.add(json);
      }
    });
  });

  Events.$el.on("click", "a.remove", function(e) { // delegate click event to container for events
    e.preventDefault();
    var id = +$(e.target).closest("li").attr("data-id");

    Events.remove(id);

    $.ajax({
      url: "events/delete",
      type: "post",
      data: "id=" + id
    });
  });

  $.ajax({ // make initial ajax request to get the current collection of events
    url: "/events",
    success: function(json) {
      Events.add(json);
    }
  });


});
