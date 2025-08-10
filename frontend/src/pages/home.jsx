"use client"

import { useEffect, useState } from "react"
import { getChats, getMessages, sendMessage } from "../api/messages"
import ChatList from "../components/chatList"
import ChatWindow from "../components/chatWindow"
import MessageInput from "../components/messageInput"
import toast from "react-hot-toast"

const currentUserNumber = "918329446654" 

const Home = () => {
  const [chats, setChats] = useState([])
  const [selectedId, setSelectedId] = useState(null) 
  const [messages, setMessages] = useState([])
  const [messagesCache, setMessagesCache] = useState({})

  // Load chats list
  useEffect(() => {
    getChats()
      .then((res) => {
        const normalizedChats = res.data.map((chat) => {
          const lastMsg = chat.lastMessage || {}

          // Determine the "other party" number
          const otherParty =
            lastMsg.wa_id === currentUserNumber
              ? lastMsg.from || lastMsg.name || lastMsg.wa_id 
              : lastMsg.wa_id

          // Determine display name
          const displayName =
            lastMsg.wa_id === currentUserNumber
              ? lastMsg.name || lastMsg.from || lastMsg.wa_id
              : lastMsg.name || lastMsg.wa_id

          return {
            ...chat,
            _id: otherParty || chat._id, 
            otherParty,
            displayName,
          }
        })

      
        const uniqueChats = {}
        normalizedChats.forEach((c) => {
          if (c.otherParty && !uniqueChats[c.otherParty]) {
            uniqueChats[c.otherParty] = c
          }
        })

        setChats(Object.values(uniqueChats))
      })
      .catch(() => toast.error("Failed to load chats"))
  }, [])

  // Load messages for selected chat
  useEffect(() => {
    if (!selectedId) {
      setMessages([])
      return
    }

    // Use cache if available
    if (messagesCache[selectedId]) {
      setMessages(messagesCache[selectedId])
      return
    }

    getMessages(selectedId)
      .then((res) => {
        const filtered = res.data.filter((msg) => {
          const otherParty =
            msg.wa_id === currentUserNumber ? msg.from || msg.name : msg.wa_id
          return otherParty === selectedId
        })

        const mapped = filtered.map((msg) => ({
          id: msg.message_id,
          wa_id: msg.wa_id,
          name: msg.name,
          text: msg.text,
          timestamp: new Date(msg.timestamp).getTime(),
          status: msg.status,
          isOutgoing: msg.wa_id === currentUserNumber,
        }))

        mapped.sort((a, b) => a.timestamp - b.timestamp)
        setMessages(mapped)
        setMessagesCache((prev) => ({ ...prev, [selectedId]: mapped }))
      })
      .catch(() => toast.error("Failed to load conversation"))
  }, [selectedId])

  const handleSend = async (text) => {
    if (!selectedId) return

    try {
      const res = await sendMessage({
        wa_id: selectedId,
        text,
      })

      const sentMsg = {
        id: res.data?.id || Date.now().toString(),
        wa_id: currentUserNumber,
        name: currentUserNumber,
        text,
        timestamp: Date.now(),
        isOutgoing: true,
        status: "sent",
      }

      setMessages((prev) => {
        const updated = [...prev, sentMsg]
        setMessagesCache((prevCache) => ({
          ...prevCache,
          [selectedId]: updated,
        }))
        return updated
      })

      toast.success("Message sent")
    } catch {
      toast.error("Failed to send message")
    }
  }

  return (
    <div className="flex h-screen bg-[#101B20]">
      {/* Chat List */}
      <div className={`${selectedId ? "hidden md:flex" : "flex"} flex-col w-full md:w-[480px]`}>
        <ChatList
          chats={chats.map((chat) => ({
            ...chat,
            lastMessage: {
              ...chat.lastMessage,
              name: chat.displayName, 
            },
          }))}
          selectedId={selectedId}
          onSelect={(id) => {
            if (id !== selectedId) setSelectedId(id)
          }}
        />
      </div>

      {/* Chat Window */}
      <div className={`${!selectedId ? "hidden md:flex" : "flex"} flex-col flex-1`}>
        <ChatWindow
          messages={messages}
          selectedId={selectedId || ""}
          onBack={() => setSelectedId(null)}
        />
        {selectedId && <MessageInput onSend={handleSend} />}
      </div>
    </div>
  )
}

export default Home
