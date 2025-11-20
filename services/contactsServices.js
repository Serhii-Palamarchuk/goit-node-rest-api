import Contact from "../models/Contact.js";

async function listContacts(owner, { page = 1, limit = 20, favorite } = {}) {
  const offset = (page - 1) * limit;
  
  const whereClause = { owner };
  
  if (favorite !== undefined) {
    whereClause.favorite = favorite === 'true';
  }
  
  return await Contact.findAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
  });
}

async function getContactById(contactId, owner) {
  return await Contact.findOne({ where: { id: contactId, owner } });
}

async function removeContact(contactId, owner) {
  const contact = await Contact.findOne({ where: { id: contactId, owner } });
  if (!contact) {
    return null;
  }
  await contact.destroy();
  return contact;
}

async function addContact(name, email, phone, owner) {
  return await Contact.create({ name, email, phone, owner });
}

async function updateContact(contactId, body, owner) {
  const contact = await Contact.findOne({ where: { id: contactId, owner } });
  if (!contact) {
    return null;
  }
  await contact.update(body);
  return contact;
}

async function updateStatusContact(contactId, body, owner) {
  const contact = await Contact.findOne({ where: { id: contactId, owner } });
  if (!contact) {
    return null;
  }
  await contact.update({ favorite: body.favorite });
  return contact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

