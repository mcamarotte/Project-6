const fs = require('fs');
const Sauce = require('./models/sauces');

exports.createSauce = (req, res, next) => {
  const sauceObj = JSON.parse(req.body.sauce);
  delete sauceObj._id;
  const sauce = new Sauce({
    ...sauceObj,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
    .then(() => res.status(201).json({message: 'Saved sauce!'}))
    .catch((error) => res.status(400).json({ error }));
};
// Returns the sauce with the provided ID
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
};
// Return the sauce updated with the provided ID
exports.modifySauce = (req, res, next) => {
  const sauceObj = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObj, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Modified sauce!'}))
    .catch(error => res.status(400).json({ error }));
};

// Delete the sauce with the provided ID
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce deleted!'}))
        .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

// Returns array of all sauces in the database
exports.getAllSauces = (req, res, next) => {
 Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.likeOrDislikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      sauce.likeOrDislike(req.body.like, req.user._id)
      sauce.save()
      .then(() => res.status(201).json({message: 'Recorded notice!'}))
      .catch(error => res.status(400).json({ error }));
    });
};
