'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Phone, Sparkles, X, Send, ChevronUp, Bot, ExternalLink } from 'lucide-react';

const FAQ_MAP: Record<string, string> = {
  'chua-biet-code':
    'Hoàn toàn dùng được anh/chị nhé! Các Workflow n8n và Skill AI tại Tự Học AI đều được đóng gói theo dạng "Kéo - Thả" (No-code / Low-code). Em có kèm sẵn video hướng dẫn từng bước 1-click import là chạy ngay ạ.',
  'cach-thanh-toan':
    'Anh/chị chỉ cần chọn sản phẩm -> bấm "Thanh Toán". Hệ thống sẽ tạo mã VietQR động tự động. Quét bằng app ngân hàng là hệ thống đối soát trong 1-3 phút và gửi thẳng link tải vào Email/mục "Kho Của Tôi".',
  'kho-cua-toi':
    'Mục "Kho Của Tôi" nằm ngay trên thanh menu đầu trang. Anh/chị chỉ cần nhập đúng Gmail hoặc SĐT khi mua là có thể tải lại toàn bộ file JSON, Prompt hoặc tài liệu bất cứ lúc nào trọn đời.',
  'tu-van-skill':
    'Nếu mới bắt đầu, anh/chị nên bắt đầu với "Skill Claude 3.7 & ChatGPT Làm Chủ Nội Dung" hoặc "Workflow n8n Tự Động Hóa Đăng Bài". Nếu cần tư vấn cụ thể theo ngành, nhắn ngay Zalo 0938.494.303 em hỗ trợ trực tiếp nhé!',
  'fallback':
    'Cảm ơn anh/chị đã quan tâm! Để được hỗ trợ nhanh nhất và gửi tài liệu mẫu, anh/chị vui lòng nhắn Zalo trực tiếp qua số 0938 494 303 nhé ạ 💬',
};

export default function FloatingAssistant() {
  const pathname = usePathname();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: 'Xin chào 👋 Em là trợ lý Tự Học AI. Em có thể giúp anh/chị tìm Workflow n8n, Skill AI phù hợp hoặc hướng dẫn cách thanh toán & nhận hàng tự động ạ.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);

  // Không hiển thị widget chat trong trang quản trị admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleQuickAsk = (key: string, label: string) => {
    setUserInteracted(true);
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: label },
      { sender: 'bot', text: FAQ_MAP[key] || FAQ_MAP.fallback },
    ]);
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
    setUserInteracted(true);
    const query = inputVal.trim().toLowerCase();
    setInputVal('');

    let reply = FAQ_MAP.fallback;
    if (query.includes('code') || query.includes('lập trình') || query.includes('khó')) {
      reply = FAQ_MAP['chua-biet-code'];
    } else if (query.includes('thanh toán') || query.includes('tiền') || query.includes('mua') || query.includes('qr')) {
      reply = FAQ_MAP['cach-thanh-toan'];
    } else if (query.includes('kho') || query.includes('tải lại') || query.includes('link')) {
      reply = FAQ_MAP['kho-cua-toi'];
    } else if (query.includes('tư vấn') || query.includes('skill') || query.includes('n8n') || query.includes('học')) {
      reply = FAQ_MAP['tu-van-skill'];
    }

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: inputVal.trim() },
      { sender: 'bot', text: reply },
    ]);
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed right-5 bottom-6 z-40 flex flex-col items-end gap-3">
        {/* Zalo Button */}
        <a
          href="https://zalo.me/0938494303"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-12 h-12 rounded-full bg-[#0068ff] hover:bg-[#0052cc] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all hover:scale-110"
          title="Chat Zalo: 0938.494.303"
        >
          <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md">
            Zalo: 0938 494 303
          </span>
          <MessageCircle className="w-6 h-6 fill-white" />
        </a>

        {/* Hotline Phone Button */}
        <a
          href="tel:0938494303"
          className="group relative w-12 h-12 rounded-full bg-emerald-700 hover:opacity-85 text-white flex items-center justify-center shadow-lg shadow-emerald-950/30 transition-all border-2 border-emerald-500"
          title="Gọi Hotline: 0938.494.303"
        >
          <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md">
            Gọi: 0938 494 303
          </span>
          <Phone className="w-5 h-5" />
        </a>

        {/* Chat FAQ Assistant Toggle Button - Đậm đà mặc định, hover mờ lại */}
        <button
          onClick={() => {
            setUserInteracted(true);
            setChatOpen(!chatOpen);
          }}
          className="group relative w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-800 via-indigo-700 to-blue-700 hover:opacity-85 text-white flex items-center justify-center shadow-xl shadow-indigo-950/40 border-2 border-indigo-400 transition-all active:scale-[0.98]"
          title="Trợ lý AI Tự Học AI"
        >
          <span className="absolute right-15 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md">
            Hỏi đáp Trợ lý AI
          </span>
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-white dark:border-[#09090b] animate-ping" />
        </button>
      </div>

      {/* Chat Assistant Panel */}
      {chatOpen && (
        <div className="fixed right-5 bottom-24 z-50 w-[360px] max-w-[calc(100vw-40px)] max-h-[530px] rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/20 shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 text-white px-4 py-3.5 flex items-center justify-between border-b border-indigo-900">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base border border-white/20">
                🤖
              </div>
              <div>
                <h4 className="text-sm font-extrabold tracking-tight">Trợ Lý Tự Học AI</h4>
                <p className="text-[10px] text-indigo-100 font-mono">Tư vấn tự động 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 text-white transition hover:opacity-80"
              aria-label="Đóng chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 bg-slate-50 dark:bg-[#0c0c10] text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-800 via-indigo-700 to-blue-700 text-white rounded-br-xs font-medium shadow-sm'
                      : 'bg-white dark:bg-[#181822] text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-white/10 shadow-xs rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick FAQ Chips - Đậm đà, hover mờ dịu */}
          <div className="p-2.5 bg-white dark:bg-[#111116] border-t-2 border-slate-200 dark:border-white/10 flex flex-wrap gap-1.5">
            <button
              onClick={() => handleQuickAsk('chua-biet-code', 'Chưa biết lập trình có học n8n được không?')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-300 border-2 border-indigo-400 dark:border-indigo-600/40 hover:opacity-75 transition-all shadow-xs"
            >
              Chưa biết code học được n8n?
            </button>
            <button
              onClick={() => handleQuickAsk('cach-thanh-toan', 'Thanh toán & nhận link tải ra sao?')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/50 text-cyan-950 dark:text-cyan-300 border-2 border-cyan-400 dark:border-cyan-600/40 hover:opacity-75 transition-all shadow-xs"
            >
              Cách thanh toán & nhận file?
            </button>
            <button
              onClick={() => handleQuickAsk('kho-cua-toi', 'Kho Của Tôi là gì?')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-950 dark:text-purple-300 border-2 border-purple-400 dark:border-purple-600/40 hover:opacity-75 transition-all shadow-xs"
            >
              Kho Của Tôi tải lại file?
            </button>
            <button
              onClick={() => handleQuickAsk('tu-van-skill', 'Nên chọn Skill nào trước?')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-300 border-2 border-emerald-400 dark:border-emerald-600/40 hover:opacity-75 transition-all shadow-xs"
            >
              Tư vấn Skill phù hợp
            </button>
          </div>

          {/* Input field */}
          <div className="p-2.5 bg-white dark:bg-[#111116] border-t-2 border-slate-200 dark:border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập câu hỏi cần tư vấn..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border-2 border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#181822] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-700 shadow-xs"
            />
            <button
              onClick={handleSend}
              className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-800 to-blue-700 hover:opacity-85 text-white flex items-center justify-center shrink-0 transition shadow-md shadow-indigo-950/20 active:scale-95"
              aria-label="Gửi tin nhắn"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
