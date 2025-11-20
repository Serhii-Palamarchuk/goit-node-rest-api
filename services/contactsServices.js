import Contact from "../models/Contact.js";

async function listContacts() {
  return await Contact.findAll();
}

async function getContactById(contactId) {
  return await Contact.findByPk(contactId);
}

async function removeContact(contactId) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  await contact.destroy();
  return contact;
}

async function addContact(name, email, phone) {
  return await Contact.create({ name, email, phone });
}

async function updateContact(contactId, body) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    return null;
  }
  await contact.update(body);
  return contact;
}

async function updateStatusContact(contactId, body) {
  const contact = await Contact.findByPk(contactId);
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

