import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Tasks } from '/imports/api/tasks/TaskCollection';

const selectedInterestsKey = 'selectedInterests';

Template.Filter_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Tasks.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedInterestsKey, undefined);
});

Template.Filter_Page.helpers({
  profiles() {
    // Initialize selectedInterests to all of them if messageFlags is undefined.
    if (!Template.instance().messageFlags.get(selectedInterestsKey)) {
      Template.instance().messageFlags.set(selectedInterestsKey, _.map(Interests.findAll(), interest => interest.name));
    }
    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    const selectedInterests = Template.instance().messageFlags.get(selectedInterestsKey);
    return _.filter(allProfiles, profile => _.intersection(profile.interests, selectedInterests).length > 0);
  },

  interests() {
    return _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return {
            label: interest.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedInterestsKey), interest.name),
          };
        });
  },

  tasks() {
    return _.map(Tasks.findAll(),
        function makeTaskObject(task) {
          return {
            label: task.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedInterestsKey), task.name),
          };
    });
  },
});

Template.Filter_Page.events({
  'submit .filter-data-form'(event, instance) {
    event.preventDefault();
    const selectedOptions = _.filter(event.target.Tasks.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedInterestsKey, _.map(selectedOptions, (option) => option.value));
  },
});

