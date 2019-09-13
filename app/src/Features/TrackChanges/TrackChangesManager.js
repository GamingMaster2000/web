/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let TrackChangesManager;
const {
    Project
} = require("../../models/Project");

module.exports = (TrackChangesManager = {
	toggleTrackChanges(project_id, track_changes_on, callback) {
		if (callback == null) { callback = function(error) {}; }
		return Project.update({_id: project_id}, {track_changes: track_changes_on}, callback);
	}
});