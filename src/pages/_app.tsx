import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
  RainbowKitProvider,
  lightTheme,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { SessionProvider } from "next-auth/react";
import { config } from "@/config/wagmi";
import { Inter } from "next/font/google";
import { ThemeProvider, useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

// Use any to avoid React types mismatch between React 19 (project) and RainbowKit (internal)
function RainbowKitWrapper({ children }: { children: any }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <RainbowKitProvider
      theme={
        theme === "dark"
          ? darkTheme({
              accentColor: "#14ee26",
              accentColorForeground: "black",
              borderRadius: "medium",
            })
          : lightTheme({
              accentColor: "#000000",
              accentColorForeground: "white",
              borderRadius: "medium",
            })
      }
      coolMode
    >
      {children}
    </RainbowKitProvider>
  );
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <RainbowKitWrapper>
              <main className={inter.className}>
                <ThemeToggle />
                <Component {...pageProps} />
              </main>
            </RainbowKitWrapper>
          </ThemeProvider>
        </SessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
