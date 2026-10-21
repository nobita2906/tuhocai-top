import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tự Học AI - Học AI Ứng Dụng & Tự Động Hóa n8n Thực Chiến',
  description: 'Nền tảng chia sẻ kho Workflow n8n, Skill AI, Prompt thương mại và tin tức AI cập nhật liên tục bởi Nguyễn Văn Đăng (tuhocai.top).',
  keywords: ['Tự học AI', 'n8n workflow', 'prompt AI', 'skill AI', 'tự động hóa', 'tuhocai.top'],
  authors: [{ name: 'Nguyễn Văn Đăng', url: 'https://www.tuhocai.top' }],
  openGraph: {
    title: 'Tự Học AI - Học AI Ứng Dụng & Tự Động Hóa n8n Thực Chiến',
    description: 'Kho Workflow n8n, Skill AI, Prompt VIP và cộng đồng AI Việt Nam.',
    url: 'https://www.tuhocai.top',
    siteName: 'Tự Học AI',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full dark`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
