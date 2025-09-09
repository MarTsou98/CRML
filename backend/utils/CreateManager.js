const Manager = require('../models/Manager');
const Salesperson = require('../models/Salesperson');

async function createManager(data) {
  const manager = new Manager(data);
  await manager.save();

  const pseudoSalesperson = new Salesperson({
    firstName: manager.firstName,
    lastName: manager.lastName,
    Role: 'manager',
  });
  await pseudoSalesperson.save();

  manager.pseudoSalespersonId = pseudoSalesperson._id;
  await manager.save();

  return manager;
}