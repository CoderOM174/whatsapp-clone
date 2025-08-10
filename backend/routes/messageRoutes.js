const express = require('express')
const router = express.Router()
const Message = require('../models/message')

// Get chat list grouped by wa_id
router.get('/chats', async (req, res) => {
  try {
    const chats = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$wa_id',
          lastMessage: { $first: '$$ROOT' },
        },
      },
    ])

    res.json(chats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all messages for a wa_id
router.get('/:wa_id', async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.params.wa_id }).sort({
      timestamp: 1,
    })
    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Send a new message (from UI input)
router.post('/', async (req, res) => {
  try {
    const { wa_id, text } = req.body;

  
    const existingContact = await Message.findOne({ wa_id }).sort({ timestamp: -1 });

    const newMsg = await Message.create({
      message_id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      wa_id,
      name: existingContact?.name || wa_id, 
      text,
      timestamp: new Date(),
      status: 'sent'
    });

    res.json(newMsg);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;