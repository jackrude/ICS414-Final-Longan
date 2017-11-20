import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Tasks } from '/imports/api/tasks/TaskCollection';

Interests.publish();
Profiles.publish();
Tasks.publish();
