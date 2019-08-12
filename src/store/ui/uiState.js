import { List, Record } from 'immutable';

export default Record({
  history: List(),
  historyCount: 0,
  modals: List(),
  undoneHistoryCount: 0
});
