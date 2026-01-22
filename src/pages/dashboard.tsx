import Head from "next/head";
import { useAccount, useDisconnect } from "wagmi";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Twitter,
  Wallet,
  Check,
  Copy,
  Users,
  Trophy,
  Sparkles,
  LogOut,
  Power,
} from "lucide-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Bento Grid Components
const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "row-span-1 rounded-xl group/bento transition duration-200 border border-white/10 justify-between flex flex-col space-y-4 shadow-none bg-black/40 backdrop-blur-xl p-6",
        className,
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans font-bold text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-400 text-xs">
          {description}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Protected Route Logic
  useEffect(() => {
    if (mounted && status !== "loading") {
      if (!session) {
        router.push("/");
      }
    }
  }, [session, status, mounted, router]);

  const handleCopy = () => {
    const refCode = address || session?.user?.name || "user123";
    const link = `https://topdotfunwaitlist.vercel.app/${refCode.slice(0, 6)}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    disconnect(); // Disconnect wallet
    signOut({ callbackUrl: "/" }); // Sign out of X/NextAuth and redirect home
  };

  if (!mounted || status === "loading" || !session) return null;

  return (
    <div className="min-h-screen bg-black text-foreground transition-colors duration-300 font-sans selection:bg-[#14ee26] selection:text-black flex flex-col items-center p-6 relative overflow-hidden">
      <Head>
        <title>Dashboard | Web3 Waitlist</title>
      </Head>

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-start justify-center pt-20">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1000px] h-[600px] bg-[#14ee26] rounded-full blur-[180px] opacity-10"
        />
      </div>

      <main className="z-10 w-full max-w-6xl mt-12 md:mt-20">
        <header className="flex justify-between items-center mb-12">
          <div>
            <div className="mb-6">
              <Image
                src="/images/logo.svg"
                alt="Tap.fun"
                width={160}
                height={60}
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-black">
              Welcome,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14ee26] to-green-600">
                {session?.user?.name}
              </span>
            </h1>
          </div>

          <div className="hidden md:flex flex-col items-end pt-8">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-muted-foreground hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </header>

        <BentoGrid className="mb-12">
          {/* Social Identity - Large Card */}
          <BentoGridItem
            className="md:col-span-2"
            title={
              <span className="flex items-center gap-2 text-xl">
                Social Identity <Check className="w-5 h-5 text-[#14ee26]" />
              </span>
            }
            description="Your verified social reputation."
            icon={<Twitter className="w-6 h-6 text-blue-400" />}
            header={
              <div className="flex-1 w-full bg-white/5 rounded-lg flex items-center justify-center min-h-[6rem] border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-4 p-4">
                  <img
                    src={session.user?.image || ""}
                    className="w-16 h-16 rounded-full border-2 border-[#14ee26]"
                    alt="Profile"
                  />
                  <div className="text-left">
                    <p className="font-bold text-lg text-foreground">
                      @{session.user?.name}
                    </p>
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified
                    </p>
                  </div>
                </div>
              </div>
            }
          />

          {/* Wallet Connection - Tall Card */}
          <BentoGridItem
            className="md:row-span-2"
            title="Web3 Wallet"
            description="Manage your connected wallet."
            icon={<Wallet className="w-6 h-6 text-purple-400" />}
            header={
              <div className="flex-1 w-full bg-white/5 rounded-lg flex flex-col items-center justify-center p-4 border border-white/5 backdrop-blur-sm">
                <div className="text-center w-full">
                  {isConnected ? (
                    <>
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 bg-[#14ee26] rounded-full blur-xl opacity-20 animate-pulse"></div>
                        <div className="relative w-full h-full bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full border-2 border-[#14ee26]"></div>
                      </div>

                      <div className="px-3 py-1 bg-[#14ee26]/10 text-[#14ee26] rounded-full text-xs font-mono inline-block mb-4 border border-[#14ee26]/20">
                        Connected
                      </div>

                      <p className="font-mono text-sm truncate max-w-[180px] mx-auto mb-6 text-neutral-400 bg-black/50 px-3 py-1.5 rounded-md border border-white/10">
                        {address}
                      </p>
                    </>
                  ) : (
                    <div className="mb-6">
                      <div className="w-20 h-20 mx-auto bg-white/5 rounded-full mb-4 border-2 border-dashed border-white/20 flex items-center justify-center">
                        <Wallet className="w-8 h-8 text-neutral-500" />
                      </div>
                      <p className="text-sm text-neutral-400 mb-4">
                        Connect wallet to access full features
                      </p>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <ConnectButton.Custom>
                      {({ openAccountModal, openConnectModal, mounted }) => {
                        const ready = mounted;
                        const connected = ready && isConnected;

                        return (
                          <div className="w-full">
                            {connected ? (
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={openAccountModal}
                                  className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                  Wallet Details
                                </button>
                                <button
                                  onClick={() => disconnect()}
                                  className="w-full px-4 py-2 border border-white/10 hover:border-red-500/50 text-neutral-400 hover:text-red-500 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                  Disconnect Wallet
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={openConnectModal}
                                className="w-full px-4 py-2 bg-[#14ee26] text-black font-bold rounded-lg hover:scale-105 transition-transform"
                              >
                                Connect Wallet
                              </button>
                            )}
                          </div>
                        );
                      }}
                    </ConnectButton.Custom>
                  </div>
                </div>
              </div>
            }
          />

          {/* Referral System - Widened Card */}
          <BentoGridItem
            className="md:col-span-2"
            title="Referrals"
            description="Invite friends to boost your position."
            icon={<Users className="w-6 h-6 text-[#14ee26]" />}
            header={
              <div className="flex-1 w-full flex flex-col justify-center p-4 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm">
                    Total Referrals
                  </span>
                  <span className="text-2xl font-bold text-[#14ee26]">0</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black/50 rounded-lg px-3 py-2 text-xs font-mono truncate text-gray-400 border border-white/5">
                    {`https://topdotfun.../${(address || "user").slice(0, 4)}`}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-[#14ee26]/10 text-[#14ee26] rounded-md hover:bg-[#14ee26] hover:text-black transition-colors border border-[#14ee26]/20"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            }
          />
        </BentoGrid>
      </main>
    </div>
  );
}
