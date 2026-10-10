import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Little After Rain - Interactive Companion Mimi',
  description: 'A relaxing portrait-mode game about a cozy room, rainy weather, and Mimi, your adorable interactive companion with 10 distinct expressions and context-aware dialogue.',
  openGraph: {
    title: 'Little After Rain - Interactive Companion Mimi',
    description: 'A relaxing portrait-mode game about a cozy room, rainy weather, and Mimi, your adorable interactive companion with 10 distinct expressions and context-aware dialogue.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Little After Rain - Interactive Companion Mimi',
    description: 'A relaxing portrait-mode game about a cozy room, rainy weather, and Mimi, your adorable interactive companion with 10 distinct expressions and context-aware dialogue.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
