import fs from 'fs';

const filePath = 'd:/ai-website-cloner-template/src/app/admin/khoa-hoc/page.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Update imports
if (!code.includes('useMemo')) {
  code = code.replace(
    "import React, { useState, useEffect, useRef } from 'react';",
    "import React, { useState, useEffect, useRef, useMemo } from 'react';"
  );
}

// Add Compass, Zap, Copy to lucide-react imports if not present
if (!code.includes('Compass,')) {
  code = code.replace(
    "  Code\n} from 'lucide-react';",
    "  Code,\n  Compass,\n  Zap,\n  Copy\n} from 'lucide-react';"
  );
}

// 2. Add states and helpers inside ClassroomAdminPage
const targetStateAnchor = "  const [showVideoPreviewInEditor, setShowVideoPreviewInEditor] = useState(true);";
const newStates = `  const [showVideoPreviewInEditor, setShowVideoPreviewInEditor] = useState(true);
  const [isVideoCollapsed, setIsVideoCollapsed] = useState(false);
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Section Refs for smooth scroll & anchors
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const promptsSectionRef = useRef<HTMLDivElement>(null);
  const resourcesSectionRef = useRef<HTMLDivElement>(null);
  const checklistSectionRef = useRef<HTMLDivElement>(null);
  const notesSectionRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to section with highlight
  const scrollToSection = (sectionName: string, ref: React.RefObject<HTMLDivElement | null>) => {
    setHighlightedSection(sectionName);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      setHighlightedSection(null);
    }, 1800);
  };`;

if (!code.includes('const [isVideoCollapsed, setIsVideoCollapsed]')) {
  code = code.replace(targetStateAnchor, newStates);
}

// 3. Add extractedPrompts and handleCopyPromptCard before escapeHtml
const targetPromptAnchor = "  // Helper escape HTML";
const newPromptHelpers = `  // Extract explicit prompt blocks for prominent Quick-Copy cards
  const extractedPrompts = useMemo(() => {
    if (!activeLesson?.content_markdown) return [];
    const regex = /\`\`\`(?:text|prompt|json)?\\s*([\\s\\S]*?)\`\`\`/g;
    const matches: { title: string; content: string }[] = [];
    let m;
    let idx = 1;
    while ((m = regex.exec(activeLesson.content_markdown)) !== null) {
      const raw = m[1].trim();
      if (raw.length > 20) {
        const beforeText = activeLesson.content_markdown.slice(0, m.index);
        const headingMatch = beforeText.match(/###?\\s*(?:📋|⚡|📸|🎬|🎙️|🏷️)?\\s*([^\\n#]+)\\s*$/);
        const title = headingMatch ? headingMatch[1].trim() : \`Prompt / Câu Lệnh Thực Chiến #\${idx}\`;
        matches.push({ title, content: raw });
        idx++;
      }
    }
    return matches;
  }, [activeLesson]);

  // Direct copy handler for prominent prompt cards
  const handleCopyPromptCard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPromptIdx(index);
      showToast('✓ Đã sao chép prompt vào bộ nhớ tạm!');
      setTimeout(() => {
        setCopiedPromptIdx(null);
      }, 2200);
    });
  };

  // Helper escape HTML`;

if (!code.includes('const extractedPrompts = useMemo')) {
  code = code.replace(targetPromptAnchor, newPromptHelpers);
}

// 4. Find start and end markers
const startAnchor = '{/* CHẾ ĐỘ 1: SKOOL CLASSROOM VIEW (XEM BÀI HỌC TRỰC QUAN)     */}';
const endAnchor = '/* CHẾ ĐỘ 2: SKOOL LESSON EDITOR WORKSPACE (3 TABS RÕ RÀNG)   */';

const startIndex = code.indexOf(startAnchor);
const endIndex = code.indexOf(endAnchor);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found:', { startIndex, endIndex });
  process.exit(1);
}

// Find the line before startAnchor that has {/* =====
const actualStart = code.lastIndexOf('{/* ======================================================== */}', startIndex);
// Find the line before endAnchor that has ) : (
const actualEnd = code.lastIndexOf(') : (', endIndex);

const newSkoolView = `{/* ======================================================== */}
                    {/* CHẾ ĐỘ 1: SKOOL CLASSROOM VIEW (XEM BÀI HỌC TRỰC QUAN)     */}
                    {/* ======================================================== */}
                    {!isEditingLesson ? (
                      <div className="space-y-6">
                        {/* ======================================================== */}
                        {/* PHẦN ĐẦU: TIÊU ĐỀ + THANH ĐIỀU HƯỚNG 1 CHẠM + TÓM TẮT   */}
                        {/* ======================================================== */}
                        <div className="p-5 sm:p-6 border-2 border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#111116] shadow-sm space-y-4">
                          {/* Tiêu đề & Metadata */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                  {currentModule?.title || 'Chương học'}
                                </span>
                                <span className="text-slate-300 dark:text-slate-700">·</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1 font-bold">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{activeLesson.duration || '10:00'}</span>
                                </span>
                                {activeLesson.is_free_preview && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                                    Học thử 0đ
                                  </span>
                                )}
                              </div>
                              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                                {activeLesson.title}
                              </h2>
                            </div>

                            {/* Nút hành động sửa nhanh */}
                            <button
                              onClick={() => {
                                setIsEditingLesson(true);
                                setEditorTab('content');
                              }}
                              className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Chỉnh Sửa Bài Này</span>
                            </button>
                          </div>

                          {/* THANH ĐIỀU HƯỚNG 1 CHẠM TỰ ĐỘNG CUỘN (QUICK JUMP ANCHORS) */}
                          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none border-b border-slate-100 dark:border-white/[0.06]">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                              <Compass className="w-3.5 h-3.5 text-indigo-500" />
                              Chuyển đến:
                            </span>

                            {activeLesson.video_url && (
                              <button
                                onClick={() => scrollToSection('video', videoSectionRef)}
                                className={\`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border \${
                                  highlightedSection === 'video'
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400'
                                    : 'bg-slate-100 dark:bg-white/[0.05] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                                }\`}
                              >
                                <Video className="w-3 h-3 text-indigo-500" />
                                <span>1. Video Bài Giảng</span>
                              </button>
                            )}

                            {extractedPrompts.length > 0 && (
                              <button
                                onClick={() => scrollToSection('prompts', promptsSectionRef)}
                                className={\`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border \${
                                  highlightedSection === 'prompts'
                                    ? 'bg-amber-500 text-black border-amber-500 shadow-md ring-2 ring-amber-300'
                                    : 'bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-500/20'
                                }\`}
                              >
                                <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                                <span>2. Lấy Prompt ({extractedPrompts.length})</span>
                              </button>
                            )}

                            {activeLesson.resources && activeLesson.resources.length > 0 && (
                              <button
                                onClick={() => scrollToSection('resources', resourcesSectionRef)}
                                className={\`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border \${
                                  highlightedSection === 'resources'
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400'
                                    : 'bg-slate-100 dark:bg-white/[0.05] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                                }\`}
                              >
                                <Paperclip className="w-3 h-3 text-indigo-500" />
                                <span>3. Tải File ({activeLesson.resources.length})</span>
                              </button>
                            )}

                            {activeLesson.action_checklist && activeLesson.action_checklist.length > 0 && (
                              <button
                                onClick={() => scrollToSection('checklist', checklistSectionRef)}
                                className={\`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border \${
                                  highlightedSection === 'checklist'
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400'
                                    : 'bg-slate-100 dark:bg-white/[0.05] hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                                }\`}
                              >
                                <CheckSquare className="w-3 h-3 text-emerald-500" />
                                <span>4. Checklist ({activeLesson.action_checklist.length})</span>
                              </button>
                            )}

                            <button
                              onClick={() => scrollToSection('notes', notesSectionRef)}
                              className={\`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border \${
                                highlightedSection === 'notes'
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400'
                                  : 'bg-slate-100 dark:bg-white/[0.05] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                              }\`}
                            >
                              <FileText className="w-3 h-3 text-indigo-500" />
                              <span>5. Ghi Chú</span>
                            </button>
                          </div>

                          {/* Tóm tắt bài học (Callout màu hổ phách) */}
                          {activeLesson.summary && (
                            <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-500/[0.05] border border-amber-200 dark:border-amber-500/20 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-3">
                              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <strong className="block text-amber-800 dark:text-amber-300 font-bold mb-0.5">
                                  Điểm Cốt Lõi Của Bài Học:
                                </strong>
                                <span>{activeLesson.summary}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* ======================================================== */}
                        {/* MỤC 1: VIDEO BÀI GIẢNG (ĐỘC LẬP - CÓ NÚT THU GỌN / MỞ RỘNG) */}
                        {/* ======================================================== */}
                        <div
                          ref={videoSectionRef}
                          id="section-video"
                          className={\`rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#111116] shadow-sm scroll-mt-24 transition-all duration-300 \${
                            highlightedSection === 'video' ? 'ring-4 ring-indigo-500/80 shadow-indigo-500/30' : ''
                          }\`}
                        >
                          {/* Header Mục Video */}
                          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/30 border-b border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-cyan-400">
                                <Video className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                                  Mục 1: Video Bài Giảng Thực Hành
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                  {activeLesson.duration ? \`Thời lượng video: \${activeLesson.duration}\` : 'Xem hướng dẫn từng bước'}
                                </p>
                              </div>
                            </div>

                            {activeLesson.video_url && (
                              <button
                                onClick={() => setIsVideoCollapsed(!isVideoCollapsed)}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                {isVideoCollapsed ? (
                                  <>
                                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                                    <span>Mở Video</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Thu Gọn</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {/* Khung phát Video 16:9 */}
                          {!isVideoCollapsed ? (
                            <div className="bg-black relative aspect-video">
                              {activeLesson.video_url ? (
                                <iframe
                                  src={getEmbedUrl(activeLesson.video_url)}
                                  title={activeLesson.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="w-full h-full border-0"
                                />
                              ) : (
                                <div className="p-8 text-center space-y-2 py-12">
                                  <Video className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
                                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Bài học này chưa gắn link Video
                                  </h4>
                                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    Bấm nút <strong className="text-indigo-600">"Chỉnh Sửa Bài Này"</strong> ở góc trên để dán đường dẫn YouTube hoặc Drive.
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div
                              onClick={() => setIsVideoCollapsed(false)}
                              className="p-6 text-center bg-slate-50/50 dark:bg-black/20 hover:bg-indigo-50/30 transition-colors cursor-pointer border-t border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                            >
                              <Play className="w-4 h-4 fill-indigo-600 dark:fill-indigo-400" />
                              <span>Video đang được thu gọn. Bấm vào đây để mở lại khung xem video</span>
                            </div>
                          )}
                        </div>

                        {/* ======================================================== */}
                        {/* MỤC 2: BỘ PROMPT & CÂU LỆNH SAO CHÉP NHANH (1-CLICK COPY)  */}
                        {/* ======================================================== */}
                        {extractedPrompts.length > 0 && (
                          <div
                            ref={promptsSectionRef}
                            id="section-prompts"
                            className={\`p-5 rounded-2xl bg-amber-500/[0.04] dark:bg-amber-500/[0.03] border-2 border-amber-300 dark:border-amber-500/30 space-y-4 scroll-mt-24 transition-all duration-300 \${
                              highlightedSection === 'prompts' ? 'ring-4 ring-amber-400 shadow-lg shadow-amber-500/20' : ''
                            }\`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400">
                                  <Zap className="w-4 h-4 fill-amber-500" />
                                </div>
                                <div>
                                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                                    Mục 2: Bộ Prompt & Câu Lệnh Dùng Ngay ({extractedPrompts.length})
                                  </h3>
                                  <p className="text-[11px] text-slate-500">
                                    Sao chép 1 chạm để dán trực tiếp vào Claude, Midjourney hoặc CapCut
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {extractedPrompts.map((p, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-white dark:bg-black/40 overflow-hidden shadow-sm"
                                >
                                  <div className="px-4 py-2 bg-amber-50/80 dark:bg-amber-500/[0.08] border-b border-amber-100 dark:border-amber-500/10 flex items-center justify-between gap-3">
                                    <span className="text-xs font-bold text-amber-950 dark:text-amber-200 truncate flex items-center gap-1.5">
                                      <span>⚡</span>
                                      <span>{p.title}</span>
                                    </span>
                                    <button
                                      onClick={() => handleCopyPromptCard(p.content, pIdx)}
                                      className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-[11px] font-extrabold flex items-center gap-1 transition-all active:scale-95 shadow-sm cursor-pointer shrink-0"
                                    >
                                      {copiedPromptIdx === pIdx ? (
                                        <>
                                          <Check className="w-3 h-3 text-black" />
                                          <span>✓ Đã sao chép!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3 text-black" />
                                          <span>Sao chép</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <pre className="p-4 text-xs font-mono leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words select-all max-h-56 overflow-y-auto">
                                    {p.content}
                                  </pre>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ======================================================== */}
                        {/* MỤC 3: TÀI LIỆU & FILE ĐÍNH KÈM (SKOOL ATTACHMENTS BOX)   */}
                        {/* ======================================================== */}
                        <div
                          ref={resourcesSectionRef}
                          id="section-resources"
                          className={\`p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-500/[0.03] border-2 border-indigo-200/80 dark:border-indigo-500/20 space-y-3.5 scroll-mt-24 transition-all duration-300 \${
                            highlightedSection === 'resources' ? 'ring-4 ring-indigo-500/80 shadow-indigo-500/30' : ''
                          }\`}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                              <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              <span>Mục 3: Tài Liệu & Tệp Đính Kèm ({activeLesson.resources?.length || 0})</span>
                            </h3>
                            <button
                              onClick={() => {
                                setIsEditingLesson(true);
                                setEditorTab('resources');
                              }}
                              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              + Thêm / Tải Tài Liệu
                            </button>
                          </div>

                          {activeLesson.resources && activeLesson.resources.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {activeLesson.resources.map((res, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm hover:border-indigo-500/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-slate-800 shrink-0">
                                      {getResourceIcon(res.type)}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                        {res.name}
                                      </p>
                                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                        <span className="uppercase text-indigo-600 dark:text-indigo-400 font-bold">{res.type}</span>
                                        {res.size && <span> · {res.size}</span>}
                                      </p>
                                    </div>
                                  </div>

                                  <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition-colors"
                                  >
                                    Tải Về
                                  </a>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">Chưa có tài liệu đính kèm cho bài học này.</p>
                          )}
                        </div>

                        {/* ======================================================== */}
                        {/* MỤC 4: CHECKLIST HÀNH ĐỘNG THỰC CHIẾN                    */}
                        {/* ======================================================== */}
                        {activeLesson.action_checklist && activeLesson.action_checklist.length > 0 && (
                          <div
                            ref={checklistSectionRef}
                            id="section-checklist"
                            className={\`p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border-2 border-slate-200 dark:border-white/[0.06] space-y-3 scroll-mt-24 transition-all duration-300 \${
                              highlightedSection === 'checklist' ? 'ring-4 ring-emerald-500/80 shadow-emerald-500/30' : ''
                            }\`}
                          >
                            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 font-mono">
                              <CheckSquare className="w-4 h-4 text-emerald-500" />
                              <span>Mục 4: Checklist Hành Động Cần Hoàn Thành ({activeLesson.action_checklist.length})</span>
                            </h3>
                            <div className="space-y-2">
                              {activeLesson.action_checklist.map((task, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                                >
                                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                  <span>{task}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ======================================================== */}
                        {/* MỤC 5: NỘI DUNG BÀI HỌC (MARKDOWN DỄ ĐỌC CÓ NÚT COPY LỆNH) */}
                        {/* ======================================================== */}
                        <div
                          ref={notesSectionRef}
                          id="section-notes"
                          className={\`space-y-3 pt-2 scroll-mt-24 transition-all duration-300 \${
                            highlightedSection === 'notes' ? 'ring-4 ring-indigo-500/80 p-2 rounded-2xl shadow-indigo-500/30' : ''
                          }\`}
                        >
                          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                            Mục 5: Ghi Chú & Kịch Bản Hướng Dẫn
                          </h3>
                          <div
                            onClick={handleMarkdownClick}
                            className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed p-6 rounded-2xl bg-slate-50/70 dark:bg-black/30 border border-slate-200 dark:border-white/[0.06]"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(activeLesson.content_markdown) }}
                          />
                        </div>

                        {/* 6. SKOOL NAVIGATION (BÀI TRƯỚC / BÀI TIẾP THEO) */}
                        <div className="pt-6 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between gap-3 text-xs">
                          {prevLesson ? (
                            <button
                              onClick={() => {
                                setActiveLesson(prevLesson);
                                setActiveModuleId(prevLesson.moduleId);
                              }}
                              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              <span>Bài Trước: {prevLesson.title}</span>
                            </button>
                          ) : <div />}

                          {nextLesson && (
                            <button
                              onClick={() => {
                                setActiveLesson(nextLesson);
                                setActiveModuleId(nextLesson.moduleId);
                              }}
                              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
                            >
                              <span>Bài Tiếp: {nextLesson.title}</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
`;

code = code.slice(0, actualStart) + newSkoolView + code.slice(actualEnd);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated Skool classroom view in admin page');
