// Dummy file to resolve build error
// This file is referenced somewhere in the codebase but doesn't exist
module.exports = {
  renderInvoice: () => {
    throw new Error('Invoice rendering not implemented');
  }
};