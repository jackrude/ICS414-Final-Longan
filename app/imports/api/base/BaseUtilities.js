import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Tasks } from '/imports/api/tasks/TaskCollection';

export function removeAllEntities() {
  Profiles.removeAll();
  Interests.removeAll();
  Tasks.removeAll();
}
