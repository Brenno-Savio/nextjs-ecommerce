import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from './Footer';
import Navbar from './Navbar/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pantanal',
  description: 'The best products && The best prices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="m-auto min-w-[300px] max-w-7xl p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
