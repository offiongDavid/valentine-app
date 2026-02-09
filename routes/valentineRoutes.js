const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Valentine = require('../models/Valentine');

const path = require('path');

const router = express.Router();


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/create.html'));
});


router.post('/create', async (req, res) => {
  const { senderName, receiverName } = req.body;
  const uniqueId = uuidv4().slice(0, 6);

  const val = new Valentine({
    senderName,
    receiverName,
    uniqueId,
    response: null
  });

  await val.save();

  const fullLink = `${req.protocol}://${req.get('host')}/ask/${uniqueId}`;

  res.json({ link: fullLink });
});


router.get('/ask/:id', async (req, res) => {
  res.sendFile(path.join(__dirname, '../views/ask.html'));
});


router.get('/data/:id', async (req, res) => {
  const data = await Valentine.findOne({ uniqueId: req.params.id });
  if (!data) return res.json(null);

  res.json({
    senderName: data.senderName,
    receiverName: data.receiverName,
    response: data.response
  });
});


router.post('/respond/:id', async (req, res) => {
  const { response } = req.body;

  const val = await Valentine.findOne({ uniqueId: req.params.id });
  if (!val) return res.status(404).json({ error: 'Not found' });

  if (val.response) {
    return res.json({ alreadyResponded: true });
  }

  val.response = response.toLowerCase();
  await val.save();

  res.json({ success: true });
});

router.get('/status/:id', async (req, res) => {
  const val = await Valentine.findOne({ uniqueId: req.params.id });
  if (!val) return res.json(null);

  res.json({ response: val.response });
});
  


module.exports = router;
