const router = require("express").Router();
const ResponseHandler = require("./utils/ResponseHandler");

const UserService = require("../services/UserService");

const Validator = require("./utils/Validator");
const Constants = require("../constants/Constants");

router.post(
	"/",
	Validator.validateBody([
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const name = req.body.name;
		const password = req.body.password;
		try {
			const user = await UserService.create(name, password);
			return ResponseHandler.sendRes(res, user);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

router.post(
	"/login",
	Validator.validateBody([
		{ name: "name", validate: [Constants.VALIDATION_TYPES.IS_STRING] },
		{
			name: "password",
			validate: [Constants.VALIDATION_TYPES.IS_STRING, Constants.VALIDATION_TYPES.IS_PASSWORD],
			length: { min: Constants.PASSWORD_MIN_LENGTH }
		}
	]),
	Validator.checkValidationResult,
	async function(req, res) {
		const name = req.body.name;
		const password = req.body.password;
		try {
			const token = await UserService.login(name, password);
			return ResponseHandler.sendRes(res, token);
		} catch (err) {
			return ResponseHandler.sendErr(res, err);
		}
	}
);

module.exports = router;
