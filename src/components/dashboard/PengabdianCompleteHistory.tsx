import { useState } from 'react';
import { 
  HeartHandshake, ChevronDown, CheckCircle2, Clock, Calendar, MapPin, Users, Eye, ExternalLink
} from 'lucide-react';
import { PengabdianRegistration, PengabdianLogbook } from '@/src/services/pengabdianService';
import { cn, openDocument } from '@/src/lib/utils';

interface PengabdianCompleteHistoryProps {
  registration: PengabdianRegistration;
}

export default function PengabdianCompleteHistory({ registration }: PengabdianCompleteHistoryProps) {
  const [logbookOpen, setLogbookOpen] = useState(false);

  return (
    <div className="space-y-10 animate-in fade-in duration-750">
      <div className="border-l-4 border-emerald-500 pl-4">
        <h3 className="text-xl font-black uppercase text-slate-800 tracking-wider">
          Manifest Arsip & Rekam Pengabdian Masyarakat
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Menampilkan akumulasi jam bimbingan, verifikasi pihak desa/mitra, surat keputusan, dan logbook pertanggungjawaban lapangan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ASSIGNMENT CLUSTER */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">1</div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Assignment Task</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Dokumen Kerjasama & Tugas</h4>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50">
               <div>
                  <span className="text-[10px] font-black text-slate-500 tracking-wider block uppercase">Proposal Pengabdian</span>
                  <p className="text-[9px] text-slate-500 italic mt-0.5">Detail program pengabdian diajukan</p>
               </div>
               {registration.docs?.proposalFile || registration.docs?.proposal ? (
                 <button 
                   onClick={() => openDocument(registration.docs?.proposalFile || registration.docs?.proposal, `Proposal_Pengabdian_${registration.dosenName || 'Dosen'}`)}
                   className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-500 text-slate-800 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all"
                 >
                   <Eye size={12} />
                   <span>View PDF</span>
                 </button>
               ) : (
                 <span className="text-[9px] font-bold text-slate-500 italic">No File</span>
               )}
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50">
               <div>
                  <span className="text-[10px] font-black text-slate-500 tracking-wider block uppercase font-bold">SK Formal / Surat Tugas</span>
                  <p className="text-[9px] text-slate-500 italic mt-0.5">Diterbitkan oleh PPPM</p>
               </div>
               {registration.docs?.suratTugas ? (
                 <button 
                   onClick={() => openDocument(registration.docs?.suratTugas, `SK_Surat_Tugas_${registration.dosenName || 'Dosen'}`)}
                   className="px-3.5 py-1.5 bg-slate-950 text-white hover:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all"
                 >
                   <Eye size={12} />
                   <span>Download SK</span>
                 </button>
               ) : (
                 <span className="text-[9px] font-bold text-slate-500 italic">Selesai via Mandiri</span>
               )}
            </div>
          </div>
        </div>

        {/* TIME & OUTREACH TARGET PROFILE */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">2</div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Activity Profile</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Sertifikasi & Daerah Binaan</h4>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider flex items-center">
                 <MapPin className="text-emerald-500 mr-1 shrink-0" size={10} /> Wilayah Target
              </span>
              <span className="text-slate-900 font-extrabold italic block truncate pt-1">{registration.info?.lokasi || 'Daerah Binaan Mandiri'}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider flex items-center">
                 <Users className="text-emerald-500 mr-1 shrink-0" size={10} /> Unit / Kelompok
              </span>
              <span className="text-slate-900 font-extrabold italic block truncate pt-1">{registration.info?.kelompok || 'Gugus Dosen Mandiri'}</span>
            </div>

            <div className="col-span-2 p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                 <Clock size={16} className="text-emerald-400" />
                 <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Total Ter-audit:</span>
              </div>
              <span className="text-lg font-black italic text-emerald-400">{registration.totalHours || 0} Jam Pengabdian</span>
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED OUTREACH WORK logs */}
      <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
        <button 
          onClick={() => setLogbookOpen(!logbookOpen)}
          className="w-full flex items-center justify-between pb-3 border-b border-slate-100 text-left outline-none"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-600">
              <ChevronDown className={cn("transition-transform duration-300", logbookOpen && "rotate-180")} size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Field Evidence</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1 flex items-center">
                Logbook Pelaksanaan Lapangan
                <span className="ml-3 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-black rounded-lg">
                  {registration.logbooks?.length || 0} Entries
                </span>
              </h4>
            </div>
          </div>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            {logbookOpen ? 'COLLAPSE EVIDENCE' : 'VIEW DETAILED EVIDENCE'}
          </span>
        </button>

        {logbookOpen && (
          <div className="space-y-4 overflow-y-auto max-h-[400px] side-scrollbar pr-2 pt-2 animate-in slide-in-from-top duration-300">
            {registration.logbooks && registration.logbooks.length > 0 ? (
              registration.logbooks.map((log: PengabdianLogbook, index: number) => (
                <div key={log.id || index} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-slate-100/60 transition-colors">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-wider">{log.date}</span>
                      <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">{log.hours} Jam Kerja Lapangan</span>
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-extrabold text-sm text-slate-800 uppercase italic truncate">{log.nama}</h5>
                      <div className="flex items-center text-[10px] text-slate-500 space-x-1.5">
                         <span className="font-black text-slate-500">Pihak Desa:</span>
                         <span className="italic font-bold bg-white px-2 py-0.5 rounded-md border border-slate-150">@{log.pihakDesa}</span>
                         <span className={cn(
                           "px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
                           log.statusPihakDesa === 'VERIFIED' ? "bg-green-50 text-green-600 border border-green-150" : "bg-orange-50 text-orange-600 border border-orange-150"
                         )}>
                           Village {log.statusPihakDesa || 'PENDING'}
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className={cn(
                      "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border shadow-sm",
                      log.status === 'APPROVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      log.status === 'REJECTED' ? "bg-red-50 text-red-600 border-red-100" :
                      "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      Outreach {log.status === 'APPROVED' ? 'VERIFIED' : log.status === 'REJECTED' ? 'REJECTED' : 'PENDING'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-500 italic text-xs">Belum ada entri logbook terdaftar.</div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
