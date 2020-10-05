const Role = require('../models/mongo/role');
const CustomError = require('../utils/customError');

async function createRole(name) {
	try {
		const isRoleExists = await Role.findOne({ name });
		if (isRoleExists) throw new CustomError('Role is already existed.', 409);
		const role = await Role.create({ name });
		return { role }
	} catch (error) {
		return { error };
	}
}

async function getRoleById(roleId) {
	try {
		const role = await Role.findById(roleId);
		if (!role) throw new CustomError('Role is not found.', 404);
		return { role };
	} catch (error) {
		return { error };
	}
}

async function getAllRole() {
	try {
		const roles = await Role.find();
		if (roles && roles.length) {
			return { roles }
		}
	} catch (error) {
		return { error };
	}
}

module.exports = { createRole, getRoleById, getAllRole }