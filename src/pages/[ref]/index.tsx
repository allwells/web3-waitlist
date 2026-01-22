import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ReferralPage({ referrer }: { referrer: string }) {
  const router = useRouter();

  useEffect(() => {
    if (referrer) {
      // Store the referrer in localStorage to attribute the signup later
      localStorage.setItem("web3_waitlist_referrer", referrer);
    }
  }, [referrer]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      <Head>
        <title>You've been invited! | Web3 Waitlist</title>
      </Head>

      {/* Background Decor */}
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

      <main className="z-10 w-full max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center p-3 mb-8 bg-card-bg/50 backdrop-blur-md rounded-full border border-card-border shadow-sm">
            <div className="flex -space-x-2 mr-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-background" />
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 border-2 border-background" />
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#14ee26] to-green-600 border-2 border-background" />
            </div>
            <span className="text-sm font-medium">
              Invited by{" "}
              <span className="font-bold text-[#14ee26]">@{referrer}</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            Skip the line. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14ee26] to-green-600">
              Join the Waitlist.
            </span>
          </h1>

          <p className="text-lg text-muted-foreground mb-10">
            You've been invited to join the exclusive beta. <br />
            Secure your spot before it fills up.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl bg-[#14ee26] text-black hover:scale-105 transition-transform shadow-[0_0_20px_-5px_#14ee26]"
          >
            Accept Invite <ArrowRight className="ml-2 w-5 h-5" />
          </Link>

          <p className="mt-6 text-xs text-muted-foreground opacity-50">
            Limited spots available for this referral code.
          </p>
        </motion.div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { ref } = context.params as { ref: string };

  return {
    props: {
      referrer: ref || "Anonymous",
    },
  };
};
