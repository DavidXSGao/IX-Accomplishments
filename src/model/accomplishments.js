/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accomplishmentsSchema = new Schema({
	acknowledger: String,
	acknowledged: String,
	acknowledgedImg: String,
	message: String,
	department: String,
	points: { type: Number, default: 50},
	updated: { type: Date, default: Date.now}
	},
	// remove "__v" field
	{ versionKey: false });
//export our module to use in server.js
module.exports = mongoose.model('accomplishment', accomplishmentsSchema);