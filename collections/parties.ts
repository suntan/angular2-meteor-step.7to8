import {Mongo} from 'meteor/mongo';
export var Parties = new Mongo.Collection<Party>('parties'); 
/*export var Parties = new Mongo.Collection('parties');*/

Parties.allow({
  insert: function() {
    var user = Meteor.user();
    return !!user;
  },
  update: function() {
    var user = Meteor.user();
    return !!user;
  },
  remove: function() {
    var user = Meteor.user();
    return !!user;
  }
});
