"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Wallet, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function StakePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-[#EAECEF]">Stake</h1>
        <p className="text-[#848E9C] mt-1 font-medium">Manage protocol escrow and locked capital.</p>
      </div>

      <div className="bg-[#1E2026] text-[#EAECEF] border border-[#3A3F45] shadow-xl rounded-xl p-6">
         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 mb-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-[#1E2026] text-[#EAECEF] border border-[#3A3F45] flex items-center justify-center shadow-xl">
                  <Wallet className="w-5 h-5 text-green-600" />
               </div>
               <div>
                  <div className="text-[10px] font-bold text-[#848E9C] uppercase tracking-widest">Connected Wallet</div>
                  <div className="text-sm font-bold text-[#EAECEF] font-mono">0x87A...3F9A</div>
               </div>
            </div>
            <Button className="px-4 py-2 bg-[#1E2026] text-[#EAECEF] border border-[#3A3F45] text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-gray-50 transition-colors shadow-xl">
              Disconnect
            </Button>
         </div>

         <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-5 border border-gray-100 rounded-xl bg-gray-50">
               <div className="text-[10px] uppercase text-[#848E9C] font-bold mb-2 tracking-widest">Locked Capital</div>
               <div className="text-3xl font-bold text-[#EAECEF] font-sans">0.05 ETH</div>
            </div>
            <div className="p-5 border border-gray-100 rounded-xl bg-gray-50">
               <div className="text-[10px] uppercase text-[#848E9C] font-bold mb-2 tracking-widest">Status</div>
               <div className="text-xl font-bold text-green-600 flex items-center gap-2 h-9">
                 <CheckCircle2 className="w-5 h-5" /> Active Protocol
               </div>
            </div>
         </div>

         <div className="pt-6 border-t border-gray-100">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#848E9C] mb-4">Staking Details</h3>
            <ul className="space-y-4 text-sm text-gray-600 font-medium leading-relaxed">
               <li className="flex items-start gap-3">
                 <ShieldAlert className="w-5 h-5 text-[#F6465D] shrink-0 mt-0.5" />
                 If telemetry data proves habit failure, mapped stake is sent to burn address immediately.
               </li>
               <li className="flex items-start gap-3">
                 <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                 Upon successful 30-day clearing, stake is returned to your 0x87A...3F9A wallet minus standard gas fees.
               </li>
            </ul>
         </div>
      </div>
    </div>
  );
}
