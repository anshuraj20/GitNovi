import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Nav } from '@/components/ui/Nav';
import { Footer } from '@/components/ui/Footer';
import { AIAssistantDrawer } from '@/components/ai/AIAssistantDrawer';

export const viewport: Viewport = {
  themeColor: '#070b14',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'GitNovi – Master Git from Zero to Plumbing Internals',
    template: '%s | GitNovi',
  },
  description:
    'An interactive Git academy combining 72 pedagogical lessons, 62-command encyclopedia, 18 hands-on challenges, safe virtual terminal sandbox, and multi-model AI tutoring.',
  keywords: [
    'Git',
    'Version Control',
    'Git Tutorial',
    'Git Commands',
    'Interactive Terminal',
    'Git Internals',
    'Git Challenges',
    'Git Plumbing',
  ],
  authors: [{ name: 'GitNovi' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col justify-between">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <AIAssistantDrawer />
      </body>
    </html>
  );
}
