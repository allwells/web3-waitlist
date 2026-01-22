import Head from "next/head";
import { useAccount } from "wagmi";
import { useSession, signIn } from "next-auth/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";
import { Twitter, ArrowRight, Wallet } from "lucide-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home() {
  const { isConnected } = useAccount();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [flowStarted, setFlowStarted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  // Redirect to dashboard if fully authenticated
  // Also, if session exists (user logged in to X), skip splash screen
  useEffect(() => {
    if (session) {
      setFlowStarted(true);
    }

    if (isConnected && session) {
      router.push("/dashboard");
    }
  }, [isConnected, session, router]);

  const currentStep = !session ? 1 : 2;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Head>
        <title>Tap.fun</title>
      </Head>

      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-[#14ee26] rounded-full blur-[200px] opacity-10" />
      </div>

      <main className="z-10 w-full max-w-md flex flex-col items-center text-center">
        {/* State 0: Splash Screen / Entry - Only show if NO session and flow NOT started */}
        {!flowStarted && !session ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="cursor-pointer"
            onClick={() => setFlowStarted(true)}
          >
            <div className="relative w-64 h-32 hover:scale-105 transition-transform duration-500">
              <Image
                src="/images/logo.svg"
                alt="Tap.fun"
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Removed text as requested */}
          </motion.div>
        ) : (
          /* flowStarted: Show Auth Steps */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {/* Logo Header (Smaller) */}
            <div className="mb-12 relative w-40 h-16 mx-auto">
              <Image
                src="/images/logo.svg"
                alt="Tap.fun"
                fill
                className="object-contain"
              />
            </div>

            <div className="space-y-6">
              {/* Step 1: Connect X */}
              <div
                className={clsx(
                  "transition-all duration-500",
                  currentStep === 1
                    ? "opacity-100 scale-100"
                    : "opacity-50 grayscale blur-lg pointer-events-none",
                )}
              >
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-2 flex items-center justify-center gap-2">
                    Verify Identity
                    {session && (
                      <div className="text-[#14ee26] text-xs px-2 py-0.5 bg-[#14ee26]/20 rounded-full">
                        Done
                      </div>
                    )}
                  </h3>
                  <p className="text-neutral-500 text-sm mb-6">
                    Connect your X account to proceed.
                  </p>

                  {session ? (
                    <div className="py-3 bg-neutral-800 rounded-xl font-mono text-sm">
                      @{session.user?.name}
                    </div>
                  ) : (
                    <button
                      onClick={() => signIn("twitter")}
                      className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Twitter className="w-5 h-5" /> Connect X
                    </button>
                  )}
                </div>
              </div>

              {/* Step 2: Connect Wallet (Only visible/active after Step 1) */}
              {session && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-neutral-900 border border-[#14ee26] rounded-2xl p-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#14ee26] shadow-[0_0_20px_#14ee26]" />

                  <h3 className="text-2xl font-bold mb-2">Join Waitlist</h3>
                  <p className="text-neutral-400 text-sm mb-6">
                    Connect your wallet to finalize your spot.
                  </p>

                  <div className="flex justify-center">
                    <ConnectButton.Custom>
                      {({ openConnectModal }) => (
                        <button
                          onClick={openConnectModal}
                          className="w-full py-4 bg-[#14ee26] text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_30px_-5px_#14ee26] flex items-center justify-center gap-2"
                        >
                          <Wallet className="w-5 h-5" /> Connect Wallet
                        </button>
                      )}
                    </ConnectButton.Custom>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      <footer className="absolute bottom-6 text-center text-xs text-neutral-600 font-medium">
        © {new Date().getFullYear()} Tap.fun. All rights reserved.
      </footer>
    </div>
  );
}
