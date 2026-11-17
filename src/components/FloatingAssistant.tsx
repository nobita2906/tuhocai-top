'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Phone, Sparkles, X, Send, Bot, Headset, ChevronRight } from 'lucide-react';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: 'Xin chào 👋 Em là trợ lý Tự Học AI. Em có thể giúp anh/chị tìm Workflow n8n, Skill AI phù hợp hoặc hướng dẫn cách thanh toán & nhận hàng tự động ạ.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const [supportContact, setSupportContact] = useState<{ hotline: string; zaloUrl: string }>({
    hotline: '0938.494.303',
    zaloUrl: 'https://zalo.me/0938494303',
  });

  useEffect(() => {
    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((data) => {
        const hl = data.hotline || '0938.494.303';
        const cleanHl = hl.replace(/[^0-9]/g, '');
        setSupportContact({
          hotline: hl,
          zaloUrl: data.zalo_support_phone
            ? `https://zalo.me/${data.zalo_support_phone.replace(/[^0-9]/g, '')}`
            : `https://zalo.me/${cleanHl || '0938494303'}`,
        });
      })
      .catch(() => {});
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Đóng cả menu lẫn chat khi đổi trang
  useEffect(() => {
    setMenuOpen(false);
    setChatOpen(false);
  }, [pathname]);

  const handleQuickAsk = (key: string, label: string) => {
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: label },
      { sender: 'bot', text: FAQ_MAP[key] || FAQ_MAP.fallback },
    ]);
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
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

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isAnyActive = menuOpen || chatOpen;

  return (
    <>
      {/* Backdrop mờ nhẹ khi mở menu trên mobile để thao tác tập trung */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-200"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating Speed Dial Container */}
      <div ref={menuRef} className="fixed right-4 sm:right-6 bottom-5 sm:bottom-6 z-50 flex flex-col items-end">
        {/* Expanded Stacked Menu (Chỉ hiện khi bấm mở nút FAB và chat chưa mở) */}
        {menuOpen && !chatOpen && (
          <div className="flex flex-col items-end gap-2.5 mb-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Action 1: Trợ lý AI */}
            <button
              onClick={() => {
                setChatOpen(true);
                setMenuOpen(false);
              }}
              className="group flex items-center gap-2.5 cursor-pointer select-none"
            >
              <span className="bg-slate-900/95 dark:bg-[#151520]/95 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-slate-700/60 dark:border-white/10 group-hover:scale-105 transition-all">
                🤖 Hỏi đáp Trợ lý AI
              </span>
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-700 to-purple-600 hover:from-indigo-600 hover:to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-white/20 group-hover:scale-110 active:scale-95 transition-all">
                <Bot className="w-5 h-5" />
              </div>
            </button>

            {/* Action 2: Gọi Hotline */}
            <a
              href={`tel:${supportContact.hotline.replace(/[^0-9]/g, '')}`}
              onClick={() => setMenuOpen(false)}
              className="group flex items-center gap-2.5 select-none"
            >
              <span className="bg-slate-900/95 dark:bg-[#151520]/95 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-slate-700/60 dark:border-white/10 group-hover:scale-105 transition-all">
                📞 Hotline: {supportContact.hotline}
              </span>
              <div className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 border border-white/20 group-hover:scale-110 active:scale-95 transition-all">
                <Phone className="w-5 h-5" />
              </div>
            </a>

            {/* Action 3: Chat Zalo */}
            <a
              href={supportContact.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="group flex items-center gap-2.5 select-none"
            >
              <span className="bg-slate-900/95 dark:bg-[#151520]/95 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-slate-700/60 dark:border-white/10 group-hover:scale-105 transition-all">
                💬 Chat Zalo: {supportContact.hotline}
              </span>
              <div className="w-11 h-11 rounded-full bg-[#0068ff] hover:bg-[#0052cc] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20 group-hover:scale-110 active:scale-95 transition-all">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
            </a>
          </div>
        )}

        {/* Nút FAB Chính duy nhất: Gọn gàng - Không choáng chỗ - Sang trọng */}
        <button
          onClick={() => {
            if (chatOpen) {
              setChatOpen(false);
            } else {
              setMenuOpen(!menuOpen);
            }
          }}
          className={`relative w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl active:scale-95 cursor-pointer ${
            isAnyActive
              ? 'bg-slate-800 hover:bg-slate-700 text-white shadow-black/40 rotate-90 border-2 border-slate-600'
              : 'bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-600 hover:opacity-90 text-white shadow-indigo-600/35 border-2 border-indigo-400/80 hover:scale-105'
          }`}
          aria-label={isAnyActive ? 'Đóng menu liên hệ' : 'Mở menu liên hệ & hỗ trợ'}
          title={isAnyActive ? 'Đóng' : 'Liên hệ & Hỗ trợ AI'}
        >
          {isAnyActive ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Headset className="w-6 h-6" />
              {/* Chấm tròn xanh báo trạng thái Online 24/7 */}
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </>
          )}
        </button>
      </div>

      {/* Chat Assistant Panel khi mở */}
      {chatOpen && (
        <div className="fixed right-4 sm:right-6 bottom-20 sm:bottom-22 z-50 w-[360px] max-w-[calc(100vw-32px)] max-h-[530px] rounded-2xl bg-white dark:bg-[#111116] border-2 border-slate-300 dark:border-white/20 shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 animate-in slide-in-from-bottom-5 duration-200">
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
              className="p-1 rounded-lg hover:bg-white/20 text-white transition hover:opacity-80 cursor-pointer"
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
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-300 border-2 border-indigo-400 dark:border-indigo-600/40 hover:opacity-75 transition-all shadow-xs cursor-pointer"
            >
              Chưa biết code học được n8n?
            </button>
            <button
              onClick={() => handleQuickAsk('cach-thanh-toan', 'Thanh toán & nhận link tải ra sao?')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/50 text-cyan-950 dark:text-cyan-300 border-2 border-cyan-400 dark:border-cyan-600/40 hover:opacity-75 transition-all shadow-xs cursor-pointer"
            >
              Cách thanh toán & nhận file?
            </button>
            <button
              onClick={() => handleQuickAsk('kho-cua-toi', 'Kho Của Tôi là gì?')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-950 dark:text-purple-300 border-2 border-purple-400 dark:border-purple-600/40 hover:opacity-75 transition-all shadow-xs cursor-pointer"
            >
              Kho Của Tôi tải lại file?
            </button>
            <button
              onClick={() => handleQuickAsk('tu-van-skill', 'Nên chọn Skill nào trước?')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-300 border-2 border-emerald-400 dark:border-emerald-600/40 hover:opacity-75 transition-all shadow-xs cursor-pointer"
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
              className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-800 to-blue-700 hover:opacity-85 text-white flex items-center justify-center shrink-0 transition shadow-md shadow-indigo-950/20 active:scale-95 cursor-pointer"
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
