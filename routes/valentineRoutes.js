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
    uniqueId
  });

  await val.save();

  res.json({
    link: `http://localhost:3000/ask/${uniqueId}`
  });
});


router.get('/ask/:id', async (req, res) => {
  res.sendFile(path.join(__dirname, '../views/ask.html'));
});


router.get('/data/:id', async (req, res) => {
  const data = await Valentine.findOne({ uniqueId: req.params.id });
  res.json(data);
});


router.post('/respond/:id', async (req, res) => {
  await Valentine.findOneAndUpdate(
    { uniqueId: req.params.id },
    { response: req.body.response }
  );

  res.json({ success: true });
});


module.exports = router;
