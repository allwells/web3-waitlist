import Head from "next/head";
import { useAccount } from "wagmi";
import { useSession, signIn, signOut } from "next-auth/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion, AnimatePresence } from "framer-motion";
import {
  Twitter,
  Wallet,
  ShieldCheck,
  Sparkles,
  Check,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const getStep = () => {
    if (isConnected && session) return 3;
    if (session) return 2;
    return 1;
  };

  const currentStep = getStep();

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans selection:bg-[#14ee26] selection:text-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Head>
        <title>Get Early Access | Web3 Waitlist</title>
      </Head>

      {/* Background Decor - Strategic Green Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-[800px] h-[800px] bg-[#14ee26] rounded-full blur-[150px] opacity-20 dark:opacity-15"
        />
      </div>

      <main className="z-10 w-full max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center px-4 py-1.5 mb-6 bg-card-bg/50 backdrop-blur-md rounded-full border border-card-border shadow-sm group cursor-default"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2 text-[#14ee26]" />
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors">
              Exclusive Access
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            Future of <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-muted-foreground">
              Web3 Identity
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-lg mx-auto"
          >
            Claim your unique profile. Verify your social reputation.{" "}
            <br className="hidden md:block" /> Join the revolution today.
          </motion.p>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: Identity (X) */}
          <ActionCard
            step={1}
            currentStep={currentStep}
            title="Social Identity"
            description="Verify your reputation."
            icon={<Twitter className="w-8 h-8" />}
            isActive={currentStep === 1}
            isCompleted={currentStep > 1}
          >
            {session ? (
              <div className="flex flex-col items-center w-full">
                <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mb-4 border-4 border-[#14ee26]">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-card-bg">
                      {session.user?.name?.[0]}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold">@{session.user?.name}</h3>
                <p className="text-sm text-green-500 mb-6 font-mono flex items-center gap-1">
                  <Check className="w-3 h-3" /> Verified
                </p>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("twitter")}
                className="w-full py-4 bg-foreground text-background font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                <Twitter className="w-5 h-5 fill-current" />
                Connect X
              </button>
            )}
          </ActionCard>

          {/* Card 2: Wallet */}
          <ActionCard
            step={2}
            currentStep={currentStep}
            title="Web3 Wallet"
            description="Connect your assets."
            icon={<Wallet className="w-8 h-8" />}
            isActive={currentStep === 2}
            isCompleted={currentStep > 2}
            isDisabled={currentStep < 2}
          >
            <div className="w-full flex justify-center py-2">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
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
                      className="w-full"
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              disabled={currentStep < 2}
                              className={clsx(
                                "w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-3",
                                currentStep < 2
                                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                                  : "bg-[#14ee26] text-black hover:bg-[#12d422] shadow-[4px_4px_0px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px]",
                              )}
                            >
                              <Wallet className="w-5 h-5" />
                              Connect Wallet
                            </button>
                          );
                        }
                        return (
                          <div className="flex flex-col items-center w-full">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mb-4 border-4 border-[#14ee26]" />
                            <h3 className="text-lg font-bold font-mono">
                              {account.displayName}
                            </h3>
                            <p className="text-sm text-green-500 mb-6 font-mono flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />{" "}
                              Connected
                            </p>
                            <button
                              onClick={openAccountModal}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-4 py-2 border border-card-border rounded-full hover:bg-card-border"
                            >
                              Wallet Details
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </ActionCard>
        </div>

        {/* Success State - Appears below when both actiosn are done */}
        <AnimatePresence>
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 40 }}
              className="w-full max-w-3xl mx-auto"
            >
              <div className="relative p-1 rounded-3xl bg-gradient-to-r from-[#14ee26] via-blue-500 to-purple-600">
                <div className="bg-card-bg rounded-[22px] p-8 md:p-12 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#14ee26] to-transparent opacity-50" />

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-20 h-20 bg-[#14ee26] rounded-full flex items-center justify-center mx-auto mb-6 text-black shadow-lg shadow-[#14ee26]/40"
                  >
                    <ShieldCheck className="w-10 h-10" />
                  </motion.div>

                  <h2 className="text-4xl font-black mb-4 tracking-tight">
                    Access Granted
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
                    Congratulations{" "}
                    <span className="text-foreground font-bold">
                      @{session?.user?.name}
                    </span>
                    . <br />
                    You have successfully secured your spot on the waitlist.
                  </p>

                  <button className="px-8 py-3 bg-foreground text-background font-bold rounded-full hover:scale-105 transition-transform">
                    Share on X
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 text-center text-xs text-muted-foreground font-medium opacity-50 hover:opacity-100 transition-opacity">
        © {new Date().getFullYear()} Web3 Waitlist. All rights reserved.
      </footer>
    </div>
  );
}

function ActionCard({
  step,
  currentStep,
  title,
  description,
  icon,
  children,
  isActive,
  isCompleted,
  isDisabled,
}: any) {
  const isPending = !isActive && !isCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDisabled ? 0.5 : 1,
        y: 0,
        filter: isDisabled ? "grayscale(1)" : "grayscale(0)",
      }}
      className={clsx(
        "relative rounded-3xl border-2 p-8 transition-all duration-300 flex flex-col h-full",
        isActive
          ? "bg-card-bg border-foreground shadow-2xl scale-[1.02] z-10"
          : "bg-card-bg/50 border-card-border hover:border-muted-foreground/50",
        isCompleted ? "border-[#14ee26] bg-[#14ee26]/5" : "",
      )}
    >
      <div className="flex justify-between items-start mb-8">
        <div
          className={clsx(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors border-2",
            isCompleted
              ? "bg-[#14ee26] border-[#14ee26] text-black"
              : isActive
                ? "bg-foreground text-background border-foreground"
                : "bg-card-bg border-card-border text-muted-foreground",
          )}
        >
          {isCompleted ? <Check className="w-6 h-6 stroke-[3px]" /> : icon}
        </div>
        <span
          className={clsx(
            "text-xs font-bold px-3 py-1 rounded-full border",
            isCompleted
              ? "bg-[#14ee26]/20 text-[#14ee26] border-[#14ee26]/20"
              : isActive
                ? "bg-foreground text-background border-foreground"
                : "bg-muted text-muted-foreground border-transparent",
          )}
        >
          Step 0{step}
        </span>
      </div>

      <div className="mb-8">
        <h3
          className={clsx(
            "text-2xl font-bold mb-2",
            isActive || isCompleted
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        >
          {title}
        </h3>
        <p className="text-muted-foreground font-medium">{description}</p>
      </div>

      <div className="mt-auto">{children}</div>
    </motion.div>
  );
}
