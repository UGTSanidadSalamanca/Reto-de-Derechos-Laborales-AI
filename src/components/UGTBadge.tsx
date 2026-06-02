import { Shield } from 'lucide-react';
import { UGT_RED } from '../constants';

export default function UGTBadge() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="bg-[#E60019] text-white font-black text-xl px-2 py-0.5 rounded flex items-center justify-center tracking-tighter">
        UGT
      </div>
      <div className="flex flex-col text-stone-900 dark:text-white font-bold text-[10px] leading-[1.1] tracking-wider">
        <span>SERVICIOS</span>
        <span>PÚBLICOS</span>
      </div>
    </div>
  );
}
