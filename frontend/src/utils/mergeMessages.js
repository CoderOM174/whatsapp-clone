export function mergeMessagesAndStatuses(messagePayloads, statusPayloads, currentUserId) {
  const messages = [];

  // Flatten messages
  for (const payload of messagePayloads) {
    const value = payload?.metaData?.entry?.[0]?.changes?.[0]?.value || {};
    const msgs = value.messages || [];
    const contact = value.contacts?.[0];
    const wa_id = contact?.wa_id;

    for (const msg of msgs) {
      messages.push({
        id: msg.id,
        wa_id,
        from: msg.from,
        name: contact?.profile?.name || null,
        text: msg.text?.body || "",
        timestamp: Number(msg.timestamp) * 1000,
        isOutgoing: msg.from === currentUserId,
        status: null
      });
    }
  }

  // Flatten statuses
  const statuses = [];
  for (const payload of statusPayloads) {
    const sts = payload?.metaData?.entry?.[0]?.changes?.[0]?.value?.statuses || [];
    for (const st of sts) {
      statuses.push({
        id: st.id,
        status: st.status,
        timestamp: Number(st.timestamp) * 1000
      });
    }
  }

  // Merge statuses into messages
  for (const msg of messages) {
    const found = statuses.find(s => s.id === msg.id);
    if (found) {
      msg.status = found.status;
    }
  }

  // Sort
  return messages.sort((a, b) => a.timestamp - b.timestamp);
}
