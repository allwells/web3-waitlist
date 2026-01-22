import Head from "next/head";
import { useAccount } from "wagmi";
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
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black/40 dark:border-white/[0.1] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className,
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
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
      if (!session || !isConnected) {
        router.push("/");
      }
    }
  }, [session, isConnected, status, mounted, router]);

  const handleCopy = () => {
    const refCode = address || session?.user?.name || "user123";
    const link = `https://topdotfunwaitlist.vercel.app/${refCode.slice(0, 6)}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted || status === "loading" || !session || !isConnected) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans selection:bg-[#14ee26] selection:text-black flex flex-col items-center p-6 relative overflow-hidden">
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
            {/* Logo Usage Update: Full logo instead of text pairing */}
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

          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#14ee26] animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">
                Access Granted
              </span>
            </div>
            <button
              onClick={() => {
                signOut();
                router.push("/");
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Log out
            </button>
          </div>
        </header>

        <BentoGrid className="mb-12">
          {/* Social Identity */}
          <BentoGridItem
            className="md:col-span-2 bg-card-bg border-card-border"
            title={
              <span className="flex items-center gap-2 text-xl">
                Social Identity <Check className="w-5 h-5 text-[#14ee26]" />
              </span>
            }
            description="Your verified social reputation."
            icon={<Twitter className="w-6 h-6 text-blue-400" />}
            header={
              <div className="flex-1 w-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 rounded-lg flex items-center justify-center min-h-[6rem]">
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

          {/* Wallet Connection */}
          <BentoGridItem
            className="md:row-span-2 bg-card-bg border-card-border"
            title="Web3 Wallet"
            description="Your connected wallet."
            icon={<Wallet className="w-6 h-6 text-purple-400" />}
            header={
              <div className="flex-1 w-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 rounded-lg flex flex-col items-center justify-center p-4">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full mb-4 border-4 border-[#14ee26]" />
                  <div className="px-3 py-1 bg-[#14ee26]/20 text-[#14ee26] rounded-full text-xs font-mono inline-block mb-2">
                    Connected
                  </div>
                  <p className="font-mono text-sm truncate max-w-[150px] mx-auto">
                    {address}
                  </p>
                </div>
              </div>
            }
          />

          {/* Referral System */}
          <BentoGridItem
            className="md:col-span-1 bg-card-bg border-card-border"
            title="Referrals"
            description="Invite friends to boost your position."
            icon={<Users className="w-6 h-6 text-[#14ee26]" />}
            header={
              <div className="flex-1 w-full flex flex-col justify-center p-4 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm">
                    Total Referrals
                  </span>
                  <span className="text-2xl font-bold text-[#14ee26]">0</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black/50 rounded-lg px-3 py-2 text-xs font-mono truncate text-gray-400">
                    {`https://topdotfun.../${(address || "user").slice(0, 4)}`}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-[#14ee26]/10 text-[#14ee26] rounded-md hover:bg-[#14ee26] hover:text-black transition-colors"
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

          {/* Analytics Stats */}
          <BentoGridItem
            className="md:col-span-1 bg-card-bg border-card-border"
            title="Waitlist Position"
            description="Your current global ranking."
            icon={<Trophy className="w-6 h-6 text-yellow-500" />}
            header={
              <div className="flex-1 flex items-center justify-center text-4xl font-black bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 rounded-lg">
                #4,821
              </div>
            }
          />
        </BentoGrid>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {["Total Users", "24h Volume", "Network", "Status"].map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-card-border bg-card-bg/50 backdrop-blur-sm"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                {item}
              </p>
              <p className="font-mono text-lg font-bold">
                {i === 3 ? <span className="text-[#14ee26]">Live</span> : "---"}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
