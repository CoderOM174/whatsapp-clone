"use client"

import { useState } from "react"
import { Smile, Paperclip, Mic, Send } from "lucide-react"

const MessageInput = ({ onSend = () => {} }) => {
  const [text, setText] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    onSend(value)
    setText("")
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t bg-[#202D32] flex items-center gap-2">
      <button type="button" className="rounded p-2" aria-label="Emoji">
        <Smile className="h-5 w-5 text-white" />
      </button>
      <button type="button" className="rounded p-2" aria-label="Attach">
        <Paperclip className="h-5 w-5 text-white" />
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        className="flex-1 border-1 border-gray-700 text-white bg-[rgb(43,57,64)] rounded-lg px-4 py-2 mr-2 text-[15px] outline-none focus:ring-2 focus:ring-[#25D366]"
        aria-label="Message input"
      />
      {text.trim().length === 0 ? (
        <button
          type="button"
          className="rounded-full bg-[#25D366] p-2 text-white hover:brightness-95"
          aria-label="Record voice"
        >
          <Mic className="h-5 w-5" />
        </button>
      ) : (
        <button
          type="submit"
          className="rounded-full bg-[#25D366] p-2 text-white hover:brightness-95"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      )}
    </form>
  )
}

export default MessageInput
