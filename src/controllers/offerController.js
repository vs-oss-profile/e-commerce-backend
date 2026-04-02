const offerService = require("../services/offerService");

async function getAllOffers(req, res) {
  const { category_id } = req.query;
  const offers = await offerService.getAllOffers(category_id);
  return res.json({
    success: true,
    data: offers,
  });
}

async function getOfferById(req, res) {
  const id = req.params.id;
  const result = await offerService.getOfferById(id);

  if (result.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Offer not found",
    });
  } else {
    return res.json({
      success: true,
      data: result[0],
    });
  }
}

async function addOffer(req, res) {
  const offer = req.body;
  const result = await offerService.addOffer(offer);
  return res.status(201).json({
    success: true,
    data: result,
  });
}

async function deleteOffer(req, res) {
  const id = req.params.id;
  const affectedRows = await offerService.deleteOffer(id);

  if (affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: "Offer not found",
    });
  }

  return res.json({
    success: true,
    message: "Offer deleted successfully",
  });
}

async function updateOffer(req, res) {
  const id = req.params.id;
  const offer = req.body;

  const affectedRows = await offerService.updateOffer(id, offer);

  if (affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: "Offer not found",
    });
  }

  return res.json({
    success: true,
    message: "Offer updated successfully",
  });
}

module.exports = {
  getAllOffers,
  getOfferById,
  addOffer,
  deleteOffer,
  updateOffer,
};
