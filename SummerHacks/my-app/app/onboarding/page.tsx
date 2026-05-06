"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Wallet, Target, User, Mail, DollarSign } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GOALS = [
  { value: "Bike", label: "Buy a Bike", emoji: "🏍️" },
  { value: "Laptop", label: "Gaming Laptop", emoji: "💻" },
  { value: "Trip", label: "Goa Trip", emoji: "✈️" },
  { value: "Phone", label: "New Phone", emoji: "📱" },
  { value: "Emergency Fund", label: "Emergency Fund", emoji: "🛡️" },
  { value: "Investment", label: "Start Investing", emoji: "📈" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    wallet_address: "",
    monthly_income: "",
    financial_goal: "",
  });

  const handleSubmit = async () => {
    if (!form.name || !form.monthly_income || !form.financial_goal || !user) return;
    setLoading(true);
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          name: form.name,
          email: form.email || user.primaryEmailAddress?.emailAddress || "",
          wallet_address: form.wallet_address,
          monthly_income: parseFloat(form.monthly_income),
          financial_goal: form.financial_goal,
        },
        { onConflict: "id" }
      );

      if (error) throw error;

      localStorage.setItem("ea_stipend", form.monthly_income);
      localStorage.setItem("ea_goal", form.financial_goal);
      router.push("/data-source");
    } catch (err) {
      console.error("Onboarding failed:", err);
      alert("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans dark">
      <div className="max-w-xl mx-auto px-6 pt-12 pb-32">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-16">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: s <= step ? "100%" : "0%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            {step === 1 && "Let's get to know you"}
            {step === 2 && "Your financial baseline"}
            {step === 3 && "What are you aiming for?"}
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            {step === 1 && "Tell us a bit about yourself to get started."}
            {step === 2 && "We need this to personalize your insights."}
            {step === 3 && "Choose a goal to stay motivated on your journey."}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <Card className="premium-card bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="pl-11 bg-background/50"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="pl-11 bg-background/50"
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button
                onClick={() => form.name ? setStep(2) : null}
                disabled={!form.name}
                className="w-full h-14 text-base font-bold tracking-wide uppercase"
              >
                Continue <ArrowRight size={18} className="ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <Card className="premium-card bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Monthly Income / Stipend (₹)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={form.monthly_income}
                        onChange={(e) => setForm({ ...form, monthly_income: e.target.value })}
                        className="pl-11 font-mono bg-background/50"
                        placeholder="15000"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Wallet Address (Optional)</Label>
                    <div className="relative">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={form.wallet_address}
                        onChange={(e) => setForm({ ...form, wallet_address: e.target.value })}
                        className="pl-11 font-mono text-sm bg-background/50"
                        placeholder="0x..."
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">Sepolia Testnet — required for commitment staking</p>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-14 text-sm font-bold tracking-widest uppercase">
                  Back
                </Button>
                <Button
                  onClick={() => form.monthly_income ? setStep(3) : null}
                  disabled={!form.monthly_income}
                  className="flex-1 h-14 text-sm font-bold tracking-widest uppercase"
                >
                  Continue <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {GOALS.map((goal) => (
                  <motion.button
                    key={goal.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setForm({ ...form, financial_goal: goal.value })}
                    className={`p-5 rounded-xl border transition-all text-left group relative overflow-hidden ${
                      form.financial_goal === goal.value
                        ? "border-accent bg-accent/10"
                        : "border-border bg-card/50 hover:border-accent/50"
                    }`}
                  >
                    <div className="text-3xl mb-3">{goal.emoji}</div>
                    <div className="text-sm font-bold text-foreground">{goal.label}</div>
                    {form.financial_goal === goal.value && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-3 right-3"
                      >
                        <Target className="w-4 h-4 text-accent" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-14 text-sm font-bold tracking-widest uppercase">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!form.financial_goal || loading}
                  className="flex-[2] h-14 text-sm font-bold tracking-widest uppercase shadow-lg shadow-accent/20"
                >
                  {loading ? "Setting up..." : "Complete Setup"} <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
