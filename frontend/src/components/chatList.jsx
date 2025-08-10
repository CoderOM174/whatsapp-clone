'use client'

import { useMemo, useState } from 'react'
import { Filter, MessageSquarePlus } from 'lucide-react'

import contactAvatar from '/contact-avatar.png'

const ChatList = ({ chats = [], selectedId = '', onSelect = () => {} }) => {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return chats
    return chats.filter((c) => {
      const name = c.lastMessage?.name || c.lastMessage?.wa_id || c._id
      const text = c.lastMessage?.text || ''
      return (
        (name && name.toLowerCase().includes(query)) ||
        (text && text.toLowerCase().includes(query)) ||
        (c._id && String(c._id).toLowerCase().includes(query))
      )
    })
  }, [q, chats])

  return (
    <aside className="flex h-full w-full flex-col bg-[#101B20] md:flex-none md:w-100 lg:w-[430px] xl:w-[480px] border-r border-gray-700">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#202D32] px-4 py-3">
        <div className="flex items-center gap-3">
          <p className="text-xl font-medium text-white">WhatsApp</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded p-2" aria-label="New chat">
            <MessageSquarePlus className="h-5 w-5 text-white" />
          </button>
          <button className="rounded p-2" aria-label="Filter">
            <Filter className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 bg-[#101B20]">
        <div className="flex items-center gap-2 rounded-lg bg-[#2A3941] px-3 py-2">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-gray-500"
          >
            <path d="M10 4a6 6 0 104.472 10.028l4.25 4.25 1.414-1.414-4.25-4.25A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search or start new chat"
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((chat) => {
          const isActive = chat._id === selectedId
          const name =
            chat.lastMessage?.name || chat.lastMessage?.wa_id || chat._id
          const text = chat.lastMessage?.text || 'No messages yet'
          const time = chat.lastMessage?.timestamp
            ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : ''

          return (
            <button
              key={chat._id}
              onClick={() => {
                if (!isActive) onSelect(chat._id)
              }}
              className={`w-full cursor-pointer px-4 py-3 text-left transition-colors ${
                isActive ? 'bg-[#2A3941]' : 'hover:bg-[#2A3941]'
              }`}
              aria-pressed={isActive}
              aria-label={`Open chat with ${name}`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={contactAvatar}
                  alt="contactAvatar"
                  className="h-10 w-10 rounded-full object-cover bg-white"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate font-medium text-white">{name}</p>
                    <span className="shrink-0 text-xs text-white">{time}</span>
                  </div>
                  <p className="truncate text-sm text-white">{text}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export default ChatList
