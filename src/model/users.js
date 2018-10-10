/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
	firstName: String,
	lastName: String,
	fullName: String,
	department: String,
	email: String,
	image: { type: String, default: 'abstract-user-flat-3.png'},
	points: { type: Number, default: 100},
	updated: { type: Date, default: Date.now},
	given: { type: Number, default: 0},
	received: { type: Number, default: 0}
	},
	// remove "__v" field
	{ versionKey: false });
//export our module to use in server.js
module.exports = mongoose.model('user', usersSchema);