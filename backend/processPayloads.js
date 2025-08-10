const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Message = require('./models/message')

dotenv.config()

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const dataDir = path.join(__dirname, 'data')


async function processFiles() {
  const files = fs.readdirSync(dataDir)
  for (const file of files) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8')
    const payload = JSON.parse(content)

    const entries = payload.metaData?.entry || []

    for (const entry of entries) {
      const changes = entry.changes || []

      for (const change of changes) {
        const value = change.value

        // Insert messages
        if (value?.messages) {
          for (const msg of value.messages) {
            const contactName = value.contacts?.find(c => c.wa_id === msg.from)?.profile?.name;
            await Message.create({
              message_id: msg.id,
              meta_msg_id: msg.context?.id || msg.id,
              wa_id: msg.from,
              text: msg.text?.body || '',
              timestamp: new Date(parseInt(msg.timestamp) * 1000),
              status: 'sent',
              name: contactName || msg.from,
            })
          }
        }

      }
    }
  }

  console.log('✅ Payload processing complete')
  mongoose.connection.close()
}

processFiles()
