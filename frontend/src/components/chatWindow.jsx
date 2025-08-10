import { useEffect, useMemo, useRef } from "react"
import { Phone, Search, Paperclip, MoreVertical, Check, CheckCheck, ArrowLeft } from "lucide-react"
import waBg from "/images/wa-bg-1.jpg"
import contactAvatar from "/contact-avatar.png"
import defaultbg from "/images/df-bg.png"

const ChatWindow = ({ messages = [], selectedId = "", onBack }) => {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const contactName = useMemo(() => {
    return messages.length > 0 ? messages[0].name || selectedId : selectedId
  }, [messages, selectedId])

  const renderStatus = (status) => {
    if (status === "read")
      return <CheckCheck className="inline h-3.5 w-3.5 text-[#53bdeb]" aria-label="Seen" />
    if (status === "delivered")
      return <CheckCheck className="inline h-3.5 w-3.5 text-gray-500" aria-label="Delivered" />
    if (status === "sent")
      return <Check className="inline h-3.5 w-3.5 text-gray-500" aria-label="Sent" />
    return null
  }

  if (!selectedId) {
    return (
      <section className="flex min-h-0 flex-1 flex-col bg-[#202D32]">
        <div className="flex flex-1 items-center justify-center text-center bg-[#171716]">
          <div className="mx-6 max-w-md">
            <img src={defaultbg} alt="WhatsApp" className="mx-auto mb-6 h-75 w-150 opacity-80" />
            <h2 className="mb-2 text-2xl font-semibold text-white">WhatsApp Web</h2>
            <p className="text-sm text-white">Select a chat to start messaging</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[#202D32]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-700 bg-[#202D32] p-2.5">
        <div className="flex items-center gap-3">
          {/* Mobile back button */}
          <button
            className="md:hidden p-2 rounded hover:bg-[#2A3941]"
            onClick={onBack}
            aria-label="Back to chats"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <img src={contactAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-white">{contactName}</p>
            <p className="text-xs text-white">{selectedId}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded p-2" aria-label="Search in conversation">
            <Search className="h-5 w-5 text-white" />
          </button>
          <button className="rounded p-2" aria-label="Attach">
            <Paperclip className="h-5 w-5 text-white" />
          </button>
          <button className="rounded p-2" aria-label="Voice call">
            <Phone className="h-5 w-5 text-white" />
          </button>
          <button className="rounded p-2" aria-label="Menu">
            <MoreVertical className="h-5 w-5 text-white" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div
        className="relative flex-1 overflow-y-auto px-4 py-3"
        style={{
          backgroundImage: `url(${waBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-3xl">
          {messages.map((msg) => {
            const align = msg.isOutgoing ? "items-end" : "items-start"
            const bubbleBg = msg.isOutgoing
              ? "bg-[#DCF8C6] text-gray-900" // outgoing - green
              : "bg-[#242626] text-white"   // incoming - dark

            return (
              <div key={msg.id} className={`mb-2 flex ${align}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 shadow ${bubbleBg}`}>
                  {!msg.isOutgoing && msg.name && (
                    <p className="mb-1 line-clamp-1 text-xs font-semibold text-[#3ACA99]">
                      {msg.name}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap break-words text-[15px] leading-snug">
                    {msg.text}
                  </p>
                  <div className="mt-1 flex items-center justify-end gap-1">
                    <span className="text-[11px] text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                    {msg.isOutgoing && renderStatus(msg.status)}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      </div>
    </section>
  )
}

export default ChatWindow
