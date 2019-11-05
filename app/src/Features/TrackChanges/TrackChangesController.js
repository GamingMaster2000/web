/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let TrackChangesController;
const RangesManager = require("./RangesManager");
const logger = require("logger-sharelatex");
const UserInfoController = require("../User/UserInfoController");
const DocumentUpdaterHandler = require("../DocumentUpdater/DocumentUpdaterHandler");
const EditorRealTimeController = require("../Editor/EditorRealTimeController");
const TrackChangesManager = require("./TrackChangesManager");

module.exports = (TrackChangesController = {
	getAllRanges(req, res, next) {
		const {
            project_id
        } = req.params;
		logger.log({project_id}, "request for project ranges");
		return RangesManager.getAllRanges(project_id, function(error, docs) {
			if (docs == null) { docs = []; }
			if (error != null) { return next(error); }
			docs = (Array.from(docs).map((d) => ({id: d._id, ranges: d.ranges})));
			return res.json(docs);
		});
	},
	
	getAllChangesUsers(req, res, next) {
		const {
            project_id
        } = req.params;
		logger.log({project_id}, "request for project range users");
		return RangesManager.getAllChangesUsers(project_id, function(error, users) {
			if (error != null) { return next(error); }
			users = (Array.from(users).map((user) => UserInfoController.formatPersonalInfo(user)));
			// Get rid of any anonymous/deleted user objects
			users = users.filter(u => (u != null ? u.id : undefined) != null);
			return res.json(users);
		});
	},
	
	acceptChange(req, res, next) {
		const {project_id, doc_id} = req.params;
		const {change_ids} = req.body.change_ids;
		logger.log({project_id, doc_id, change_ids}, "request to accept change");
		return DocumentUpdaterHandler.acceptChanges(project_id, doc_id, change_ids, function(error) {
			if (error != null) { return next(error); }
			EditorRealTimeController.emitToRoom(project_id, "accept-change", doc_id, change_ids, function(err){});
			return res.send(204);
		});
	},

	toggleTrackChanges(req, res, next) {
		const {project_id} = req.params;
		const track_changes_on = !!req.body.on;
		logger.log({project_id, track_changes_on}, "request to toggle track changes");
		return TrackChangesManager.toggleTrackChanges(project_id, track_changes_on, function(error) {
			if (error != null) { return next(error); }
			EditorRealTimeController.emitToRoom(project_id, "toggle-track-changes", track_changes_on, function(err){});
			return res.send(204);
		});
	}
});
