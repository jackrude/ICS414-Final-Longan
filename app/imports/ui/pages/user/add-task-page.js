import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Tasks } from '/imports/api/tasks/TaskCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Add_Task_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Tasks.getSchema().namedContext('Add_Task_Page');
});

Template.Add_Task_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  profile() {
    return Tasks.findDoc(FlowRouter.getParam('username'));
  },
  interests() {
    const task = Tasks.findDoc(FlowRouter.getParam('username'));
    const selectedTasks = task.tasks;
    return task && _.map(tasks.findAll(),
            function makeTaskObject(task) {
              return { label: task.name, selected: _.contains(selectedTasks, task.name) };
            });
  },
});


Template.Add_Task_Page.events({
  'submit .task-data-form'(event, instance) {
    event.preventDefault();
    const taskName = event.target.Title.value;
    const username = FlowRouter.getParam('username'); // schema requires username.

    const bio = event.target.Description.value;
    const selectedTasks = _.filter(event.target.Dependencies.selectedOptions, (option) => option.selected);
    const dependencies = _.map(selectedTasks, (option) => option.value);

    const updatedTaskData = { taskName, bio, dependencies,
      username };

    console.log(updatedTaskData);

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Profiles.getSchema().clean(updatedTaskData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
      const id = Profiles.update(docID, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});