import { Template } from 'meteor/templating';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Tasks } from '/imports/api/tasks/TaskCollection';

Template.Directory_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
});

Template.Directory_Page.helpers({

  /**
   * Returns a cursor to profiles, sorted by last name.
   */
  profiles() {
    return Profiles.find({}, { sort: { lastName: 1 } });
  },

  tasks() {
    return Tasks.find({}, { sort: { name: 1}});
  },
});
