import fs from 'fs';

// =========================================================================
// 1. UPDATE STUDENT CLASSROOM PAGE: src/app/dashboard/hoc/[courseSlug]/page.tsx
// =========================================================================
const studentPagePath = 'src/app/dashboard/hoc/[courseSlug]/page.tsx';
let studentCode = fs.readFileSync(studentPagePath, 'utf8');

// A. Update Left Sidebar to sticky top-20 z-20 and hide native scrollbars
studentCode = studentCode.replace(
  '<div className="order-2 lg:order-1 lg:col-span-4 space-y-4 sticky top-6">',
  '<div className="order-2 lg:order-1 lg:col-span-4 space-y-4 sticky top-20 z-20">'
);

studentCode = studentCode.replace(
  '<div className="divide-y divide-slate-100 dark:divide-white/[0.06] max-h-[calc(100vh-220px)] overflow-y-auto">',
  '<div className="divide-y divide-slate-100 dark:divide-white/[0.06] max-h-[calc(100vh-230px)] overflow-y-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">'
);

// B. Extract Quick Jump Anchors into its own dedicated Sticky bar right below Header Card
// We search for the Header block and separate the Anchors into a sticky card
const oldHeaderAndAnchorsTarget = `{/* ======================================================== */}
              {/* PHẦN ĐẦU: TIÊU ĐỀ + NÚT HOÀN THÀNH + THANH ĐIỀU HƯỚNG + TÓM TẮT */}
              {/* ======================================================== */}
              <div className="bento-card p-5 sm:p-6 border-2 border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#111116] shadow-sm space-y-4">`;

// Let's check how the header block ends:
// It has Summary callout then </div>.
// Let's inspect the exact lines between oldHeaderAndAnchorsTarget and Mục 1: Video

const studentMarker1 = '{/* PHẦN ĐẦU: TIÊU ĐỀ + NÚT HOÀN THÀNH + THANH ĐIỀU HƯỚNG + TÓM TẮT */}';
const studentMarker2 = '{/* MỤC 1: VIDEO BÀI GIẢNG (ĐỘC LẬP - CÓ NÚT THU GỌN / MỞ RỘNG) */}';

const sIdx1 = studentCode.indexOf(studentMarker1);
const sIdx2 = studentCode.indexOf(studentMarker2);

if (sIdx1 !== -1 && sIdx2 !== -1) {
  const actualStart = studentCode.lastIndexOf('{/* ======================================================== */}', sIdx1);
  const actualEnd = studentCode.lastIndexOf('{/* ======================================================== */}', sIdx2);

  const newHeaderAndStickyNav = `{/* ======================================================== */}
              {/* PHẦN ĐẦU: TIÊU ĐỀ + NÚT HOÀN THÀNH + TÓM TẮT ĐIỂM CỐT LÕI */}
              {/* ======================================================== */}
              <div className="bento-card p-5 sm:p-6 border-2 border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#111116] shadow-sm space-y-4">
                {/* Tiêu đề & Nút Hoàn thành */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-cyan-400 uppercase tracking-wider">
                        {currentModule?.title || \`BÀI HỌC SỐ \${activeIdx + 1} / \${allLessons.length}\`}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {activeLesson.duration || '10:00'}
                      </span>
                      {activeLesson.isFreePreview && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                          Xem thử 0đ
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {activeLesson.title}
                    </h2>
                  </div>

                  {/* NÚT HOÀN THÀNH BÀI HỌC (SKOOL CORE ACTION) */}
                  <button
                    onClick={handleToggleComplete}
                    disabled={updatingProgress}
                    className={\`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all active:scale-[0.98] shrink-0 cursor-pointer \${
                      activeLesson.isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/20 border border-emerald-500'
                        : 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 hover:opacity-90 text-white shadow-indigo-950/25'
                    }\`}
                  >
                    {updatingProgress ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {activeLesson.isCompleted
                      ? '✓ ĐÃ HOÀN THÀNH (BẤM ĐỂ HỦY)'
                      : 'ĐÁNH DẤU HOÀN THÀNH (+10 ĐIỂM)'}
                  </button>
                </div>

                {/* Tóm tắt điểm cốt lõi (Callout màu hổ phách) */}
                {activeLesson.summary && (
                  <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-500/[0.06] border border-amber-200/80 dark:border-amber-500/20 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-3">
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
              {/* THANH ĐIỀU HƯỚNG 1 CHẠM CỐ ĐỊNH (STICKY QUICK JUMP SUB-NAV) */}
              {/* ======================================================== */}
              <div className="sticky top-20 z-20 px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-[#111116]/95 backdrop-blur-md border-2 border-slate-200/90 dark:border-white/10 shadow-md shadow-slate-900/5 transition-all">
                <div className="flex items-center justify-between gap-3 overflow-hidden">
                  <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
                      <Compass className="w-3.5 h-3.5 text-indigo-500" />
                      Chuyển đến:
                    </span>

                    {activeLesson.videoUrl && (
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

                    {activeLesson.actionChecklist && activeLesson.actionChecklist.length > 0 && (
                      <button
                        onClick={() => scrollToSection('checklist', checklistSectionRef)}
                        className={\`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border \${
                          highlightedSection === 'checklist'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400'
                            : 'bg-slate-100 dark:bg-white/[0.05] hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                        }\`}
                      >
                        <CheckSquare className="w-3 h-3 text-emerald-500" />
                        <span>4. Checklist ({activeLesson.actionChecklist.length})</span>
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

                  {/* Nút Nhảy Về Đầu Bài Nhanh */}
                  <button
                    onClick={() => {
                      if (lessonStageRef.current) {
                        lessonStageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer shrink-0 border border-slate-200 dark:border-white/10"
                    title="Cuộn về đầu bài học"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Đầu bài</span>
                  </button>
                </div>
              </div>\n\n              `;

  studentCode = studentCode.slice(0, actualStart) + newHeaderAndStickyNav + studentCode.slice(actualEnd);
}

// C. Update scroll-mt-24 to scroll-mt-36 on all target sections in student page
studentCode = studentCode.replaceAll('scroll-mt-24', 'scroll-mt-36');

fs.writeFileSync(studentPagePath, studentCode, 'utf8');
console.log('✅ Updated student page with sticky sidebar, sticky sub-nav and hidden scrollbar');


// =========================================================================
// 2. UPDATE ADMIN PAGE: src/app/admin/khoa-hoc/page.tsx
// =========================================================================
const adminPagePath = 'src/app/admin/khoa-hoc/page.tsx';
let adminCode = fs.readFileSync(adminPagePath, 'utf8');

// A. Update Left Sidebar sticky top-20 z-20 and hide native scrollbars
adminCode = adminCode.replace(
  '<div className="order-2 lg:order-1 lg:col-span-4 space-y-4 sticky top-6">',
  '<div className="order-2 lg:order-1 lg:col-span-4 space-y-4 sticky top-20 z-20">'
);

adminCode = adminCode.replace(
  '<div className="divide-y divide-slate-100 dark:divide-white/[0.06] max-h-[calc(100vh-220px)] overflow-y-auto">',
  '<div className="divide-y divide-slate-100 dark:divide-white/[0.06] max-h-[calc(100vh-230px)] overflow-y-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">'
);

// B. Extract Quick Jump Anchors in Admin Skool View into its own dedicated Sticky bar
const adminMarker1 = '{/* PHẦN ĐẦU: TIÊU ĐỀ + THANH ĐIỀU HƯỚNG 1 CHẠM + TÓM TẮT   */}';
const adminMarker2 = '{/* MỤC 1: VIDEO BÀI GIẢNG (ĐỘC LẬP - CÓ NÚT THU GỌN / MỞ RỘNG) */}';

const aIdx1 = adminCode.indexOf(adminMarker1);
const aIdx2 = adminCode.indexOf(adminMarker2);

if (aIdx1 !== -1 && aIdx2 !== -1) {
  const actualStart = adminCode.lastIndexOf('{/* ======================================================== */}', aIdx1);
  const actualEnd = adminCode.lastIndexOf('{/* ======================================================== */}', aIdx2);

  const newAdminHeaderAndStickyNav = `{/* ======================================================== */}
                        {/* PHẦN ĐẦU: TIÊU ĐỀ + TÓM TẮT ĐIỂM CỐT LÕI               */}
                        {/* ======================================================== */}
                        <div className="p-5 sm:p-6 border-2 border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#111116] shadow-sm space-y-4">
                          {/* Tiêu đề & Metadata */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
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
                        {/* THANH ĐIỀU HƯỚNG 1 CHẠM CỐ ĐỊNH (STICKY QUICK JUMP SUB-NAV) */}
                        {/* ======================================================== */}
                        <div className="sticky top-20 z-20 px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-[#111116]/95 backdrop-blur-md border-2 border-slate-200/90 dark:border-white/10 shadow-md shadow-slate-900/5 transition-all">
                          <div className="flex items-center justify-between gap-3 overflow-hidden">
                            <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1 min-w-0">
                              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
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

                            {/* Nút Nhảy Về Đầu Bài Nhanh */}
                            <button
                              onClick={() => {
                                if (adminStageRef.current) {
                                  adminStageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer shrink-0 border border-slate-200 dark:border-white/10"
                              title="Cuộn về đầu bài học"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                              <span>Đầu bài</span>
                            </button>
                          </div>
                        </div>\n\n                        `;

  adminCode = adminCode.slice(0, actualStart) + newAdminHeaderAndStickyNav + adminCode.slice(actualEnd);
}

// C. Update scroll-mt-24 to scroll-mt-36 on all target sections in admin page
adminCode = adminCode.replaceAll('scroll-mt-24', 'scroll-mt-36');

fs.writeFileSync(adminPagePath, adminCode, 'utf8');
console.log('✅ Updated admin page with sticky sidebar, sticky sub-nav and hidden scrollbar');

