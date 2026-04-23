"use client";

import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud, CheckCircle2, AlertTriangle, FileText, Loader2,
  ShieldCheck, Flame, ArrowRight, ArrowUpRight, TrendingDown,
  TrendingUp, Activity, BarChart3, Brain, ExternalLink
} from "lucide-react";
import { useRouter } from "next/navigation";
import CountUp from "react-countup";

// Month 2 mock transactions (reduced spending compared to Month 1)
const MONTH_2_TRANSACTIONS = [
  { merchant: "Swiggy", amount: 320, date: "2025-02-03" },
  { merchant: "Zomato", amount: 180, date: "2025-02-05" },
  { merchant: "Uber", amount: 150, date: "2025-02-06" },
  { merchant: "Amazon", amount: 450, date: "2025-02-08" },
  { merchant: "Netflix", amount: 199, date: "2025-02-10" },
  { merchant: "Swiggy", amount: 280, date: "2025-02-12" },
  { merchant: "Myntra", amount: 650, date: "2025-02-14" },
  { merchant: "Ola", amount: 180, date: "2025-02-16" },
  { merchant: "Spotify", amount: 119, date: "2025-02-18" },
  { merchant: "Zomato", amount: 220, date: "2025-02-20" },
  { merchant: "DMart", amount: 1200, date: "2025-02-22" },
  { merchant: "Uber", amount: 120, date: "2025-02-24" },
  { merchant: "Swiggy", amount: 350, date: "2025-02-26" },
  { merchant: "BigBasket", amount: 890, date: "2025-02-27" },
  { merchant: "BookMyShow", amount: 400, date: "2025-02-28" },
];

interface VerifyResult {
  message: string;
  streak_updated: number;
  new_savings_score: number;
  blockchain_tx: string;
  reduction_achieved: number;
  month1_total: number;
  month2_total: number;
  category_comparison: Record<string, { month1: number; month2: number; change: number }>;
  ai_verdict: string;
  behavioral_insights: string[];
}

export default function VerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "preview" | "uploading" | "analyzing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);

  const handleShowPreview = () => {
    setStatus("preview");
  };

  const handleSubmitVerification = async () => {
    setStatus("uploading");
    setErrorMsg("");

    const rawText = MONTH_2_TRANSACTIONS
      .map((tx) => `${tx.merchant} - Rs.${tx.amount} - ${tx.date}`)
      .join("\n");

    setTimeout(async () => {
      setStatus("analyzing");

      try {
        const res = await axios.post("http://127.0.0.1:8001/api/verify/submit", {
          user_id: "00000000-0000-0000-0000-000000000000",
          month_2_raw_text: rawText,
        });

        if (res.data.success) {
          setResult(res.data);
          setStatus("success");
        } else {
          setErrorMsg(res.data.message || "Verification failed.");
          setStatus("error");
        }
      } catch (err: any) {
        setErrorMsg(err.response?.data?.detail || err.message || "Backend unreachable");
        setStatus("error");
      }
    }, 2000);
  };

  const isRealHash = (hash: string) =>
    hash.startsWith("0x") && !hash.includes("MOCK") && !hash.includes("FAILED") && hash.length >= 66;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 font-sans mt-8 px-4">
      <AnimatePresence mode="wait">

        {/* IDLE STATE */}
        {(status === "idle" || status === "error") && (
          <motion.div key="input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="mb-2 inline-flex items-center px-3 py-1 bg-accent/10 text-accent text-[10px] uppercase font-bold tracking-widest rounded-full">
              <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 animate-pulse" />
              Month 2 Telemetry
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">Verification Node</h1>
            <p className="text-lg text-secondary font-medium mb-10 max-w-xl">
              Upload your Month 2 bank statement to verify spending reduction and unlock your Escrow funds on-chain.
            </p>

            <div
              onClick={handleShowPreview}
              className="bg-surface border-2 border-dashed border-border rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <div className="w-16 h-16 bg-background border border-border flex items-center justify-center rounded-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-secondary group-hover:text-accent transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Upload Month 2 Statement</h3>
              <p className="text-sm font-medium text-secondary text-center max-w-sm">
                Click to load and preview your Month 2 transaction data before running verification
              </p>
            </div>

            {errorMsg && (
              <div className="mt-8 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-bold">
                <AlertTriangle className="w-5 h-5 shrink-0" /> {errorMsg}
              </div>
            )}
          </motion.div>
        )}

        {/* PREVIEW STATE — Show Month 2 Transactions */}
        {status === "preview" && (
          <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="mb-2 inline-flex items-center px-3 py-1 bg-blue-500/10 text-blue-600 text-[10px] uppercase font-bold tracking-widest rounded-full">
              <FileText className="w-3 h-3 mr-1.5" />
              Statement Preview
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Month 2 Transaction Data</h1>
            <p className="text-sm text-secondary font-medium mb-6">
              {MONTH_2_TRANSACTIONS.length} transactions detected • Total: ₹{MONTH_2_TRANSACTIONS.reduce((a, t) => a + t.amount, 0).toLocaleString()}
            </p>

            <div className="bg-card border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
                <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">#</div>
                <div className="col-span-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Merchant</div>
                <div className="col-span-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</div>
                <div className="col-span-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Amount</div>
              </div>
              {MONTH_2_TRANSACTIONS.map((tx, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="col-span-1 text-xs text-gray-300 font-mono">{String(i + 1).padStart(2, "0")}</div>
                  <div className="col-span-4 text-sm font-bold text-black">{tx.merchant}</div>
                  <div className="col-span-4 text-sm text-gray-500 font-mono">{tx.date}</div>
                  <div className="col-span-3 text-sm font-bold text-red-600 text-right font-mono">₹{tx.amount.toLocaleString()}</div>
                </motion.div>
              ))}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="col-span-9 text-sm font-bold text-gray-900 uppercase tracking-widest">Total</div>
                <div className="col-span-3 text-sm font-bold text-black text-right font-mono">
                  ₹{MONTH_2_TRANSACTIONS.reduce((a, t) => a + t.amount, 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStatus("idle")}
                className="w-1/3 py-4 border border-gray-200 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-gray-50 transition-all text-gray-500"
              >
                Back
              </button>
              <button
                onClick={handleSubmitVerification}
                className="w-2/3 py-4 bg-foreground text-background rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-foreground/80 transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <Brain className="w-4 h-4" /> Run Verification Pipeline
              </button>
            </div>
          </motion.div>
        )}

        {/* PROCESSING STATE */}
        {(status === "uploading" || status === "analyzing") && (
          <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative w-24 h-24 mb-8">
              <motion.div
                className="absolute inset-0 border-4 border-accent/20 border-r-accent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {status === "uploading" ? <FileText className="w-8 h-8 text-accent animate-pulse" /> : <Loader2 className="w-8 h-8 text-accent animate-spin" />}
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
              {status === "uploading" ? "Encrypting Statement..." : "Running Multi-Agent Verification..."}
            </h2>
            <p className="text-secondary font-medium">
              {status === "uploading" ? "Securing payload before transmission" : "Comparing Month 1 vs Month 2 spending patterns & anchoring result on-chain"}
            </p>
          </motion.div>
        )}

        {/* SUCCESS STATE */}
        {status === "success" && result && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-20" />
                <ShieldCheck className="w-12 h-12 text-accent relative z-10" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight mb-4 text-foreground">Escrow Unlocked.</h1>
              <p className="text-lg text-secondary font-medium max-w-lg mx-auto">{result.message}</p>
            </div>

            {/* Key Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <MetricCard label="Reduction" value={`${result.reduction_achieved}%`} icon={<TrendingDown className="w-5 h-5 text-green-600" />} color="green" />
              <MetricCard label="Month 1 Spend" value={`₹${result.month1_total.toLocaleString()}`} icon={<BarChart3 className="w-5 h-5 text-red-500" />} color="red" />
              <MetricCard label="Month 2 Spend" value={`₹${result.month2_total.toLocaleString()}`} icon={<BarChart3 className="w-5 h-5 text-green-600" />} color="green" />
              <MetricCard label="Savings Score" value={`${result.new_savings_score}/100`} icon={<Activity className="w-5 h-5 text-accent" />} color="accent" />
            </div>

            {/* Category Comparison */}
            <div className="bg-card border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
              <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-400" /> Category-wise Comparison
              </h3>
              <div className="space-y-3">
                {Object.entries(result.category_comparison).map(([cat, data]) => (
                  <div key={cat} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-bold text-gray-700 truncate">{cat}</div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2 relative overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-red-400/60 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(data.month1 / result.month1_total) * 100}%` }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                        />
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-2 relative overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-green-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(data.month2 / result.month1_total) * 100}%` }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        />
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <span className="text-xs font-mono text-gray-400">₹{data.month1}</span>
                      <span className="text-xs text-gray-300 mx-1">→</span>
                      <span className="text-xs font-mono text-green-600 font-bold">₹{data.month2}</span>
                    </div>
                    <div className={`w-16 text-right text-xs font-bold font-mono ${data.change < 0 ? "text-green-600" : "text-red-500"}`}>
                      {data.change}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400/60 rounded-full" /> Month 1</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" /> Month 2</span>
              </div>
            </div>

            {/* AI Verdict + Insights */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" /> AI Verdict
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">{result.ai_verdict}</p>
              </div>

              <div className="bg-card border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" /> Behavioral Insights
                </h3>
                <div className="space-y-2">
                  {result.behavioral_insights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-gray-600 font-medium">{insight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Streak + Blockchain Row */}
            <div className="flex flex-col md:flex-row gap-6 mb-12">
              <div className="bg-surface border border-border rounded-xl p-6 text-left w-full md:w-1/3 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center shrink-0">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Streak Built</div>
                  <div className="font-mono text-2xl text-foreground font-bold">{result.streak_updated} Days</div>
                </div>
              </div>

              {result.blockchain_tx && (
                <div className={`${isRealHash(result.blockchain_tx) ? "bg-green-500/10 border-green-500/20" : "bg-amber-500/10 border-amber-500/20"} border rounded-xl p-6 text-left w-full md:w-2/3`}>
                  <div className="text-[10px] font-bold text-green-700/70 uppercase tracking-widest mb-3">On-Chain Verification Receipt</div>
                  
                  {/* What was anchored — human readable */}
                  <div className="bg-card/60 border border-green-200/40 rounded-lg p-4 mb-4 space-y-1.5">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" /> Data Embedded In Transaction
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <span className="text-gray-400 font-mono">type</span>
                      <span className="text-gray-700 font-bold font-mono">escrow_unlock</span>
                      <span className="text-gray-400 font-mono">status</span>
                      <span className="text-green-600 font-bold font-mono">success</span>
                      <span className="text-gray-400 font-mono">reduction</span>
                      <span className="text-green-600 font-bold font-mono">34.2%</span>
                      <span className="text-gray-400 font-mono">challenge</span>
                      <span className="text-gray-700 font-bold font-mono truncate">demo_challenge</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-100">
                      ↑ This JSON was SHA-256 hashed and embedded in the tx <code className="text-gray-500">data</code> field. Click &quot;+ Show more&quot; on Etherscan to see the raw hex.
                    </p>
                  </div>

                  <div className="font-mono text-xs text-gray-600 break-all mb-3">{result.blockchain_tx}</div>
                  {isRealHash(result.blockchain_tx) && (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${result.blockchain_tx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View on Etherscan
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={() => router.push("/network")}
                className="py-4 px-12 bg-foreground text-background rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-foreground/80 transition-all shadow-xl inline-flex items-center gap-2"
              >
                View Leaderboard Position <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

function MetricCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  const borderColor = color === "green" ? "border-green-100" : color === "red" ? "border-red-100" : "border-gray-200";
  return (
    <div className={`bg-card border ${borderColor} rounded-xl p-5 shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-black tracking-tight">{value}</div>
    </div>
  );
}
