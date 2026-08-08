import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationsProvider } from "@/lib/notifications-context";
import { StoreSwitchModal } from "@/components/store-switch";
import { ReportIssueButton } from "@/components/report-issue";
import { FloatingHelpButtons } from "@/components/floating-help";
import { GlobalCartBar } from "@/components/global-cart-bar";
import { MobileStoreNav } from "@/components/mobile-store-nav";
import { GlobalDepartmentDrawer } from "@/components/global-department-drawer";
import { MiniCartDrawer } from "@/components/mini-cart-drawer";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Aheers Group Super App",
  description: "One app. All Aheers stores. Infinity Rewards, shopping, delivery & account management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${fraunces.variable} font-sans`}>
        <AuthProvider>
          <NotificationsProvider>
            <CartProvider>
              {children}
              <GlobalCartBar />
              <MobileStoreNav />
              <GlobalDepartmentDrawer />
              <MiniCartDrawer />
              <StoreSwitchModal />
              <ReportIssueButton />
              <FloatingHelpButtons />
            </CartProvider>
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
