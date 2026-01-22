import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { SessionProvider } from "next-auth/react";
import { config } from "@/config/wagmi";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

// Use any to avoid React types mismatch between React 19 (project) and RainbowKit (internal)
function RainbowKitWrapper({ children }: { children: any }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <RainbowKitProvider
      theme={darkTheme({
        accentColor: "#14ee26",
        accentColorForeground: "black",
        borderRadius: "medium",
      })}
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
          <Head>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <CustomCursor />
          <RainbowKitWrapper>
            <main className={inter.className}>
              <Component {...pageProps} />
            </main>
          </RainbowKitWrapper>
        </SessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
