import fs from 'fs';

console.log('--- 🚀 BẮT ĐẦU CHUẨN HÓA HỆ THỐNG TYPOGRAPHY TOÀN DIỆN CHO TỰ HỌC AI ---');

// =========================================================================
// 1. CẬP NHẬT src/app/globals.css VỚI HỆ THỐNG TYPOGRAPHY CHUẨN
// =========================================================================
const globalsCssPath = 'src/app/globals.css';
let css = fs.readFileSync(globalsCssPath, 'utf8');

const typographySection = `
/* ======================================================== */
/* TỰ HỌC AI - HỆ THỐNG QUY CHUẨN TYPOGRAPHY TOÀN DIỆN      */
/* (Chống mỏi mắt, tối ưu dấu tiếng Việt & đạt chuẩn A11y)  */
/* ======================================================== */

/* 1. Typography Utility Tokens */
.typo-display {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  line-height: 1.15;
  font-weight: 900;
  letter-spacing: -0.025em;
}

.typo-h1 {
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  line-height: 1.25;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.typo-h2 {
  font-size: clamp(1.125rem, 1.8vw, 1.35rem);
  line-height: 1.35;
  font-weight: 800;
  letter-spacing: -0.015em;
}

.typo-h3 {
  font-size: 1.05rem;
  line-height: 1.4;
  font-weight: 700;
}

.typo-body-lead {
  font-size: 1.05rem; /* ~16.8px */
  line-height: 1.7;
  font-weight: 450;
}

.typo-body {
  font-size: 0.965rem; /* ~15.5px */
  line-height: 1.68;
  font-weight: 400;
}

.typo-sub {
  font-size: 0.875rem; /* 14px */
  line-height: 1.55;
  font-weight: 500;
}

.typo-meta {
  font-size: 0.775rem; /* ~12.4px - Ngưỡng tối thiểu an toàn */
  line-height: 1.4;
  font-weight: 600;
}

.typo-code {
  font-family: var(--font-mono), monospace;
  font-size: 0.875rem; /* 14px */
  line-height: 1.65;
}

/* 2. Prose reading styles for Classroom Notes */
.prose {
  font-size: 0.975rem !important; /* 15.6px */
  line-height: 1.75 !important;
}

.prose p {
  margin-top: 0.85em;
  margin-bottom: 0.85em;
}

.prose h1, .prose h2, .prose h3, .prose h4 {
  color: var(--text-primary);
  font-weight: 800;
  letter-spacing: -0.015em;
}

.prose h1 { font-size: 1.5rem; margin-top: 1.6em; margin-bottom: 0.8em; }
.prose h2 { font-size: 1.3rem; margin-top: 1.5em; margin-bottom: 0.7em; }
.prose h3 { font-size: 1.15rem; margin-top: 1.3em; margin-bottom: 0.6em; }

.prose strong {
  font-weight: 750;
  color: inherit;
}

.prose ul, .prose ol {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  padding-left: 1.5em;
}

.prose li {
  margin-top: 0.35em;
  margin-bottom: 0.35em;
}
`;

if (!css.includes('TỰ HỌC AI - HỆ THỐNG QUY CHUẨN TYPOGRAPHY')) {
  css += typographySection;
  fs.writeFileSync(globalsCssPath, css, 'utf8');
  console.log('✅ Đã cập nhật globals.css với bộ chuẩn Typography!');
}

// =========================================================================
// 2. CẬP NHẬT src/app/dashboard/hoc/[courseSlug]/page.tsx
// =========================================================================
const studentPagePath = 'src/app/dashboard/hoc/[courseSlug]/page.tsx';
let studentCode = fs.readFileSync(studentPagePath, 'utf8');

// A. Code box renderer inside Markdown (nâng lên 13.5px - 14px font mono)
studentCode = studentCode.replace(
  '<div class="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono">',
  '<div class="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs sm:text-sm font-mono">'
);

studentCode = studentCode.replace(
  'class="copy-code-btn px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"',
  'class="copy-code-btn px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"'
);

studentCode = studentCode.replace(
  '<pre class="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-200 select-all whitespace-pre-wrap break-words">',
  '<pre class="p-4 sm:p-5 overflow-x-auto text-[13.5px] sm:text-sm font-mono leading-relaxed text-slate-200 select-all whitespace-pre-wrap break-words">'
);

// B. Top Header Course Info
studentCode = studentCode.replace(
  '<span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-cyan-400 uppercase tracking-wider">\n              // KHÔNG GIAN HỌC TẬP SKOOL\n            </span>',
  '<span className="text-xs font-mono font-bold text-indigo-700 dark:text-cyan-400 uppercase tracking-wider">\n              // KHÔNG GIAN HỌC TẬP SKOOL\n            </span>'
);

studentCode = studentCode.replace(
  '<h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">',
  '<h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">'
);

studentCode = studentCode.replace(
  '<div className="flex justify-between text-xs font-mono">',
  '<div className="flex justify-between text-xs sm:text-[13px] font-mono font-semibold">'
);

// C. Sidebar Lộ Trình
studentCode = studentCode.replace(
  '<h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 font-mono">',
  '<h2 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 font-mono">'
);

studentCode = studentCode.replace(
  '<span className="text-[11px] font-mono text-slate-500 font-bold">\n                {course.totalLessons} bài\n              </span>',
  '<span className="text-xs font-mono text-slate-500 font-bold">\n                {course.totalLessons} bài\n              </span>'
);

studentCode = studentCode.replace(
  '<input\n                  type="text"\n                  placeholder="Tìm kiếm bài học..."\n                  value={lessonSearchTerm}\n                  onChange={(e) => setLessonSearchTerm(e.target.value)}\n                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"\n                />',
  '<input\n                  type="text"\n                  placeholder="Tìm kiếm bài học..."\n                  value={lessonSearchTerm}\n                  onChange={(e) => setLessonSearchTerm(e.target.value)}\n                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"\n                />'
);

studentCode = studentCode.replace(
  '<span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">\n                            {mod.title}\n                          </span>',
  '<span className="font-bold text-xs sm:text-[13.5px] text-slate-900 dark:text-slate-100 truncate">\n                            {mod.title}\n                          </span>'
);

studentCode = studentCode.replace(
  '<span className="text-[10px] text-slate-500 font-mono shrink-0">\n                            {modLessons.length} bài\n                          </span>',
  '<span className="text-xs text-slate-500 font-mono shrink-0 font-medium">\n                            {modLessons.length} bài\n                          </span>'
);

studentCode = studentCode.replace(
  '<p className="line-clamp-2 leading-snug">{lesson.title}</p>',
  '<p className="line-clamp-2 leading-snug text-xs sm:text-[13.5px] font-semibold">{lesson.title}</p>'
);

studentCode = studentCode.replace(
  '<div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">',
  '<div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-medium">'
);

// D. Header Bài Học Bên Phải
studentCode = studentCode.replace(
  '<span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-cyan-400 uppercase tracking-wider">',
  '<span className="text-xs font-mono font-bold text-indigo-700 dark:text-cyan-400 uppercase tracking-wider">'
);

studentCode = studentCode.replace(
  '<span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 font-semibold">',
  '<span className="text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1 font-semibold">'
);

studentCode = studentCode.replace(
  '<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">',
  '<span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">'
);

studentCode = studentCode.replace(
  '<h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">\n                      {activeLesson.title}\n                    </h2>',
  '<h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">\n                      {activeLesson.title}\n                    </h2>'
);

studentCode = studentCode.replace(
  'className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all active:scale-[0.98] shrink-0 cursor-pointer',
  'className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-sm shadow-lg transition-all active:scale-[0.98] shrink-0 cursor-pointer'
);

studentCode = studentCode.replace(
  '<div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-500/[0.06] border border-amber-200/80 dark:border-amber-500/20 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-3">',
  '<div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-500/[0.06] border-2 border-amber-300/80 dark:border-amber-500/25 text-[14.5px] sm:text-base text-amber-950 dark:text-amber-100 leading-relaxed flex items-start gap-3.5">'
);

studentCode = studentCode.replace(
  '<strong className="block text-amber-800 dark:text-amber-300 font-bold mb-0.5">',
  '<strong className="block text-amber-900 dark:text-amber-300 font-black mb-1 text-sm sm:text-[15px]">'
);

// E. Thanh Điều Hướng 1 Chạm
studentCode = studentCode.replace(
  '<span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">',
  '<span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5 pl-1">'
);

// Thay thế các nút điều hướng thành text-xs sm:text-sm font-bold
studentCode = studentCode.replaceAll(
  'px-3 py-1.5 rounded-lg text-xs font-bold',
  'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold'
);

// F. Mục 1: Video Bài Giảng
studentCode = studentCode.replace(
  '<h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider font-mono">\n                        Mục 1: Video Bài Giảng Thực Hành\n                      </h3>',
  '<h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider font-mono">\n                        Mục 1: Video Bài Giảng Thực Hành\n                      </h3>'
);

studentCode = studentCode.replace(
  '<p className="text-[11px] text-slate-500">',
  '<p className="text-xs sm:text-[13px] text-slate-500 font-medium">'
);

studentCode = studentCode.replace(
  'className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"',
  'className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"'
);

// G. Mục 2: Bộ Prompt & Câu Lệnh
studentCode = studentCode.replace(
  '<h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider font-mono">\n                      Mục 2: Bộ Prompt & Câu Lệnh Dùng Ngay ({extractedPrompts.length})\n                    </h3>',
  '<h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider font-mono">\n                      Mục 2: Bộ Prompt & Câu Lệnh Dùng Ngay ({extractedPrompts.length})\n                    </h3>'
);

studentCode = studentCode.replace(
  '<span className="text-xs font-bold text-amber-950 dark:text-amber-200 truncate flex items-center gap-1.5">',
  '<span className="text-sm font-extrabold text-amber-950 dark:text-amber-200 truncate flex items-center gap-2">'
);

studentCode = studentCode.replace(
  'className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-[11px] font-extrabold flex items-center gap-1 transition-all active:scale-95 shadow-sm cursor-pointer shrink-0"',
  'className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer shrink-0"'
);

studentCode = studentCode.replace(
  '<pre className="p-4 text-xs font-mono leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words select-all max-h-56 overflow-y-auto">',
  '<pre className="p-4 sm:p-5 text-[13.5px] sm:text-sm font-mono leading-relaxed text-slate-900 dark:text-slate-100 whitespace-pre-wrap break-words select-all max-h-72 overflow-y-auto">'
);

// H. Mục 3: Tài Liệu
studentCode = studentCode.replace(
  '<h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider font-mono">',
  '<h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider font-mono">'
);

studentCode = studentCode.replace(
  '<p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">\n                                  {res.name}\n                                </p>',
  '<p className="font-extrabold text-sm sm:text-[15px] text-slate-900 dark:text-white truncate">\n                                  {res.name}\n                                </p>'
);

studentCode = studentCode.replace(
  '<p className="text-[11px] text-slate-400 font-mono mt-0.5">',
  '<p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">'
);

studentCode = studentCode.replace(
  'className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition-colors"',
  'className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-extrabold shrink-0 transition-colors shadow-sm"'
);

// I. Mục 4: Checklist
studentCode = studentCode.replace(
  '<h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 font-mono">',
  '<h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2 font-mono">'
);

studentCode = studentCode.replace(
  '<span className={`text-xs sm:text-sm leading-relaxed ${',
  '<span className={`text-sm sm:text-[15px] leading-relaxed font-medium ${'
);

// J. Mục 5: Ghi Chú & Markdown
studentCode = studentCode.replace(
  '<h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">\n                    Mục 5: Ghi Chú & Kịch Bản Hướng Dẫn Thực Hành\n                  </h3>',
  '<h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">\n                    Mục 5: Ghi Chú & Kịch Bản Hướng Dẫn Thực Hành\n                  </h3>'
);

studentCode = studentCode.replace(
  'className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed p-6 rounded-2xl bg-slate-50/70 dark:bg-black/30 border border-slate-200 dark:border-white/[0.06]"',
  'className="prose dark:prose-invert max-w-none text-[15.5px] sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed p-6 sm:p-8 rounded-2xl bg-slate-50/70 dark:bg-black/30 border-2 border-slate-200 dark:border-white/[0.06]"'
);

fs.writeFileSync(studentPagePath, studentCode, 'utf8');
console.log('✅ Đã chuẩn hóa Typography trang học viên: src/app/dashboard/hoc/[courseSlug]/page.tsx!');

// =========================================================================
// 3. CẬP NHẬT src/app/admin/khoa-hoc/page.tsx
// =========================================================================
const adminPagePath = 'src/app/admin/khoa-hoc/page.tsx';
let adminCode = fs.readFileSync(adminPagePath, 'utf8');

// Code renderer inside Markdown
adminCode = adminCode.replace(
  '<div class="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono">',
  '<div class="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs sm:text-sm font-mono">'
);

adminCode = adminCode.replace(
  'class="copy-code-btn px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"',
  'class="copy-code-btn px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"'
);

adminCode = adminCode.replace(
  '<pre class="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-200 select-all whitespace-pre-wrap break-words">',
  '<pre class="p-4 sm:p-5 overflow-x-auto text-[13.5px] sm:text-sm font-mono leading-relaxed text-slate-200 select-all whitespace-pre-wrap break-words">'
);

// Admin Header & Metadata
adminCode = adminCode.replace(
  '<span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">\n                                  {currentModule?.title || \'Chương học\'}\n                                </span>',
  '<span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">\n                                  {currentModule?.title || \'Chương học\'}\n                                </span>'
);

adminCode = adminCode.replace(
  '<h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">\n                                {activeLesson.title}\n                              </h2>',
  '<h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">\n                                {activeLesson.title}\n                              </h2>'
);

adminCode = adminCode.replace(
  '<div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-500/[0.05] border border-amber-200 dark:border-amber-500/20 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-3">',
  '<div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-500/[0.05] border-2 border-amber-300 dark:border-amber-500/25 text-[14.5px] sm:text-base text-amber-950 dark:text-amber-100 leading-relaxed flex items-start gap-3.5">'
);

adminCode = adminCode.replace(
  '<strong className="block text-amber-800 dark:text-amber-300 font-bold mb-0.5">',
  '<strong className="block text-amber-900 dark:text-amber-300 font-black mb-1 text-sm sm:text-[15px]">'
);

// Admin Quick Jump Nav
adminCode = adminCode.replace(
  '<span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">',
  '<span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5 pl-1">'
);

adminCode = adminCode.replaceAll(
  'px-3 py-1.5 rounded-lg text-xs font-bold',
  'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold'
);

// Admin Section Headings
adminCode = adminCode.replace(
  '<h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider font-mono">\n                                  Mục 1: Video Bài Giảng Thực Hành\n                                </h3>',
  '<h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider font-mono">\n                                  Mục 1: Video Bài Giảng Thực Hành\n                                </h3>'
);

adminCode = adminCode.replace(
  '<h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider font-mono">\n                                    Mục 2: Bộ Prompt & Câu Lệnh Dùng Ngay ({extractedPrompts.length})\n                                  </h3>',
  '<h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider font-mono">\n                                    Mục 2: Bộ Prompt & Câu Lệnh Dùng Ngay ({extractedPrompts.length})\n                                  </h3>'
);

adminCode = adminCode.replace(
  '<pre className="p-4 text-xs font-mono leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words select-all max-h-56 overflow-y-auto">',
  '<pre className="p-4 sm:p-5 text-[13.5px] sm:text-sm font-mono leading-relaxed text-slate-900 dark:text-slate-100 whitespace-pre-wrap break-words select-all max-h-72 overflow-y-auto">'
);

adminCode = adminCode.replace(
  '<h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider font-mono">\n                              <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />\n                              <span>Mục 3: Tài Liệu & Tệp Đính Kèm ({activeLesson.resources?.length || 0})</span>\n                            </h3>',
  '<h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider font-mono">\n                              <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />\n                              <span>Mục 3: Tài Liệu & Tệp Đính Kèm ({activeLesson.resources?.length || 0})</span>\n                            </h3>'
);

adminCode = adminCode.replace(
  '<h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 font-mono">\n                              <CheckSquare className="w-4 h-4 text-emerald-500" />\n                              <span>Mục 4: Checklist Hành Động Cần Hoàn Thành ({activeLesson.action_checklist.length})</span>\n                            </h3>',
  '<h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2 font-mono">\n                              <CheckSquare className="w-4 h-4 text-emerald-500" />\n                              <span>Mục 4: Checklist Hành Động Cần Hoàn Thành ({activeLesson.action_checklist.length})</span>\n                            </h3>'
);

adminCode = adminCode.replace(
  '<h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">\n                            Mục 5: Ghi Chú & Kịch Bản Hướng Dẫn\n                          </h3>',
  '<h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">\n                            Mục 5: Ghi Chú & Kịch Bản Hướng Dẫn\n                          </h3>'
);

adminCode = adminCode.replace(
  'className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed p-6 rounded-2xl bg-slate-50/70 dark:bg-black/30 border border-slate-200 dark:border-white/[0.06]"',
  'className="prose dark:prose-invert max-w-none text-[15.5px] sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed p-6 sm:p-8 rounded-2xl bg-slate-50/70 dark:bg-black/30 border-2 border-slate-200 dark:border-white/[0.06]"'
);

fs.writeFileSync(adminPagePath, adminCode, 'utf8');
console.log('✅ Đã chuẩn hóa Typography trang Admin: src/app/admin/khoa-hoc/page.tsx!');

console.log('--- HOÀN TẤT TOÀN BỘ BƯỚC CẬP NHẬT CODE! ---');

