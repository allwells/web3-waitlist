import Head from "next/head";
import { useAccount } from "wagmi";
import { useSession, signIn, signOut } from "next-auth/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";
import { Twitter, Wallet, ShieldCheck, Sparkles, Check } from "lucide-react";
import clsx from "clsx";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: session } = useSession();

  // Determine current step
  // Step 1: Login with X
  // Step 2: Connect Wallet (Join Waitlist)
  // Step 3: Success
  const getStep = () => {
    if (isConnected && session) return 3;
    if (session) return 2;
    return 1;
  };

  const currentStep = getStep();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground selection:bg-[#14ee26] selection:text-black overflow-hidden relative font-sans transition-colors duration-300">
      <Head>
        <title>Get Early Access | Web3 Waitlist</title>
        <meta name="description" content="Join the exclusive waitlist." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Background Decor - Strategic Green Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-[600px] h-[600px] bg-[#14ee26] rounded-full blur-[120px] opacity-20 dark:opacity-15"
        />
      </div>

      <main className="z-10 w-full max-w-md px-6 py-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 relative"
        >
          <div className="inline-flex items-center justify-center p-2 mb-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            {/* Subtle green shimmer on hover */}
            <div className="absolute inset-0 bg-[#14ee26]/10 translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Sparkles className="w-4 h-4 text-black dark:text-white mr-2 relative z-10" />
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase relative z-10">
              Early Access
            </span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
            Future of <br />
            <span className="relative inline-block">
              <span className="relative z-10">Web3 Identity</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#14ee26]/40 -skew-x-6 z-0" />
            </span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-xs mx-auto">
            Secure your spot. Link your wallet and verify your profile to join.
          </p>
        </motion.div>

        <div className="w-full space-y-4">
          {/* Step 1: X Login */}
          <StepCard
            active={currentStep === 1}
            completed={currentStep > 1}
            disabled={false}
            icon={<Twitter className="w-6 h-6" />}
            title="Verify Identity"
            description="Connect your X account."
          >
            <div className="mt-6">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="w-full flex justify-center items-center py-3 px-4 border-2 border-foreground text-sm font-bold rounded-xl text-foreground bg-card-bg hover:bg-muted transition-all shadow-[4px_4px_0px_0px_var(--color-foreground)]"
                >
                  @{session.user?.name || "User"}
                  <div className="ml-2 bg-[#14ee26] rounded-full p-0.5 text-black">
                    <Check className="w-3 h-3" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => signIn("twitter")}
                  className={clsx(
                    "w-full flex justify-center items-center py-4 px-4 border text-sm font-bold uppercase tracking-wider rounded-xl transition-all",
                    "border-foreground text-black bg-[#14ee26] hover:bg-[#12d422] shadow-[4px_4px_0px_0px_var(--color-foreground)] hover:shadow-[2px_2px_0px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer",
                  )}
                >
                  Connect X
                </button>
              )}
            </div>
          </StepCard>

          {/* Step 2: Connect Wallet */}
          <StepCard
            active={currentStep === 2}
            completed={currentStep > 2}
            disabled={currentStep < 2}
            icon={<Wallet className="w-5 h-5" />}
            title="Join Waitlist"
            description="Connect wallet to finalize."
          >
            <div className="mt-6 flex justify-center">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== "loading";
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === "authenticated");

                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                      className="w-full"
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              className="group relative w-full flex justify-center py-4 px-4 border border-foreground text-sm font-bold uppercase tracking-wider rounded-xl text-black bg-[#14ee26] hover:bg-[#12d422] focus:outline-none focus:ring-4 focus:ring-[#14ee26]/30 transition-all shadow-[4px_4px_0px_0px_var(--color-foreground)] hover:shadow-[2px_2px_0px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px]"
                            >
                              Join Waitlist
                            </button>
                          );
                        }
                        return (
                          <button
                            onClick={openAccountModal}
                            className="group relative w-full flex justify-center items-center py-3 px-4 border-2 border-foreground text-sm font-bold rounded-xl text-foreground bg-card-bg hover:bg-muted focus:outline-none transition-all shadow-[4px_4px_0px_0px_var(--color-foreground)]"
                          >
                            {account.displayName}
                            <div className="ml-2 w-2 h-2 rounded-full bg-[#14ee26] animate-pulse" />
                          </button>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </StepCard>

          {/* Step 3: Success */}
          <AnimatePresence>
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-8 p-8 bg-black dark:bg-[#111] rounded-2xl border-2 border-[#14ee26] text-center shadow-[0_0_40px_-10px_rgba(20,238,38,0.3)]"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#14ee26] mb-6 text-black">
                  <ShieldCheck className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold leading-6 text-[#14ee26] mb-2">
                  You're on the list!
                </h3>
                <p className="mt-4 text-sm text-gray-400 font-mono">
                  Address:{" "}
                  <span className="text-white">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                  <br />
                  Handle:{" "}
                  <span className="text-white">@{session?.user?.name}</span>
                </p>
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <p className="text-xs text-gray-500">
                    We'll notify you when your spot opens up.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="absolute bottom-6 text-center text-xs text-muted-foreground font-medium">
        © {new Date().getFullYear()} Web3 Waitlist. All rights reserved.
      </footer>
    </div>
  );
}

function StepCard({
  active,
  completed,
  disabled,
  icon,
  title,
  description,
  children,
}: any) {
  return (
    <motion.div
      animate={{
        opacity: disabled ? 0.3 : 1,
        y: active ? -4 : 0,
        scale: active ? 1 : 0.98,
        filter: disabled ? "grayscale(100%) blur(1px)" : "none",
      }}
      className={clsx(
        "relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300",
        active
          ? "bg-card-bg border-foreground shadow-[8px_8px_0px_0px_var(--color-foreground)] z-10"
          : "bg-card-bg border-card-border",
        completed ? "bg-[#f0fdf2] dark:bg-[#14ee26]/10 border-[#14ee26]" : "",
      )}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className={clsx(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors border-2",
            active
              ? "bg-foreground text-[#14ee26] border-foreground"
              : "bg-card-bg text-muted-foreground border-card-border",
            completed ? "bg-[#14ee26] text-black border-[#14ee26]" : "",
          )}
        >
          {completed ? <Check className="w-6 h-6 stroke-[3px]" /> : icon}
        </div>
        <div className="flex-1">
          <h3
            className={clsx(
              "text-lg font-bold",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {title}
          </h3>
          <p className="text-sm font-medium text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
