import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TopBanner from '@/components/TopBanner';
import SocialProofToast from '@/components/SocialProofToast';
import FloatingAssistant from '@/components/FloatingAssistant';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tuhocai.top'),
  title: 'Tự Học AI TOP - Kho Công Cụ AI, Workflow n8n & Skill Thực Chiến',
  description: 'Kho công cụ AI thực chiến giúp bạn làm nội dung, xây kênh và kiếm tiền nhanh hơn: Template n8n workflow, skill viết kịch bản, prompt thương mại và trợ lý AI tải về dùng ngay.',
  keywords: ['Tự học AI', 'kho công cụ AI', 'workflow n8n', 'skill AI', 'prompt AI', 'tự động hóa AI', 'tuhocai.top'],
  authors: [{ name: 'Tự Học AI', url: 'https://www.tuhocai.top' }],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Tự Học AI TOP - Kho Công Cụ AI, Workflow n8n & Skill Thực Chiến',
    description: 'Kho công cụ AI thực chiến: Skill, kịch bản, Prompt và Workflow n8n giúp bạn làm nội dung, xây kênh và kiếm tiền nhanh hơn.',
    url: 'https://www.tuhocai.top',
    siteName: 'Tự Học AI TOP',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tự Học AI TOP - Kho Công Cụ AI & Tự Động Hóa Thực Chiến',
    description: 'Kho công cụ AI thực chiến giúp bạn làm nội dung, xây kênh và kiếm tiền nhanh hơn.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.tuhocai.top/#organization',
        name: 'Tự Học AI TOP',
        url: 'https://www.tuhocai.top',
        logo: 'https://www.tuhocai.top/favicon.ico',
        description: 'Nền tảng chia sẻ kho Workflow n8n, Skill AI, Prompt thương mại và giải pháp tự động hóa thực chiến.',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.tuhocai.top/#website',
        url: 'https://www.tuhocai.top',
        name: 'Tự Học AI TOP',
        description: 'Kho Công Cụ AI, Workflow n8n & Skill Thực Chiến',
        publisher: {
          '@id': 'https://www.tuhocai.top/#organization',
        },
      },
    ],
  };

  return (
    <html lang="vi" suppressHydrationWarning className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
        <TopBanner />
        <Navbar />
        <main className="flex-1 relative overflow-hidden">{children}</main>
        <Footer />
        <SocialProofToast />
        <FloatingAssistant />
      </body>
    </html>
  );
}
