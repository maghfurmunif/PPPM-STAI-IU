import { useState } from 'react';
import { 
  FileText, Eye, Calendar, Clock, MapPin, Users,
  Building2, Camera, ClipboardCheck, GraduationCap,
  ChevronDown, ArrowUpRight, CheckCircle2, Bookmark, Info
} from 'lucide-react';
import { PenelitianRegistration, PenelitianLogbook } from '@/src/services/penelitianService';
import { cn, openDocument } from '@/src/lib/utils';

interface PenelitianCompleteHistoryProps {
  registration: PenelitianRegistration;
}

export default function PenelitianCompleteHistory({ registration }: PenelitianCompleteHistoryProps) {
  const [logbookOpen, setLogbookOpen] = useState(false);

  return (
    <div className="space-y-10 animate-in fade-in duration-750">
      <div className="border-l-4 border-primary pl-4">
        <h3 className="text-xl font-black uppercase text-slate-800 tracking-wider">
          Manifest Arsip & Rekam Proses Penelitian
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Menampilkan seluruh riwayat proposal, seminar tengah, hasil akhir, publikasi jurnal, dan logbook penelitian.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* MILESTONE 1: PROPOSAL & MID-SEMINAR */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary font-bold italic">P1</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Phase 1</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Proposal & Seminar Awal</h4>
            </div>
          </div>
          
          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
               <div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Draft Proposal Penelitian</span>
                 <p className="text-[9px] text-slate-500 mt-0.5 italic">Awal pengajuan program riset</p>
               </div>
               {registration.proposalFile ? (
                 <button 
                   onClick={() => openDocument(registration.proposalFile, `Proposal_Penelitian_${registration.dosenName || 'Dosen'}`)}
                   className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-primary/50 text-slate-800 hover:text-primary rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all"
                 >
                   <Eye size={12} />
                   <span>Proposal</span>
                 </button>
               ) : (
                 <span className="text-[9px] font-bold text-slate-300 italic">Tdk Ada File</span>
               )}
            </div>

            {registration.semproInfo && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50 space-y-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-wider block">Jadwal Seminar Proposal</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-700">
                  <div className="flex items-center space-x-1">
                     <Calendar size={12} className="text-primary shrink-0" />
                     <span>{registration.semproInfo.tanggal}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                     <Clock size={12} className="text-primary shrink-0" />
                     <span>{registration.semproInfo.pukul}</span>
                  </div>
                  <div className="col-span-2 flex items-center space-x-1">
                     <MapPin size={12} className="text-primary shrink-0" />
                     <span className="truncate">{registration.semproInfo.lokasi}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MILESTONE 2: FINAL SEMINAR & AMID RESULTS */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary font-bold italic">P2</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Phase 2</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Laporan Hasil & Seminar Akhir</h4>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100/30">
               <div>
                  <span className="text-[10px] font-black text-slate-400 tracking-wider block uppercase">Laporan Hasil Riset</span>
                  <p className="text-[9px] text-slate-500 italic mt-0.5">Naskah komprehensif penelitian</p>
               </div>
               {registration.resultFile ? (
                 <button 
                   onClick={() => openDocument(registration.resultFile, `Laporan_Hasil_${registration.dosenName || 'Dosen'}`)}
                   className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all"
                 >
                   <Eye size={12} />
                   <span>Laporan</span>
                 </button>
               ) : (
                 <span className="text-[9px] font-bold text-slate-300 italic">Belum Diunggah</span>
               )}
            </div>

            {registration.finalSemproInfo && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50 space-y-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-wider block">Seminar Hasil Penelitian (Semhas)</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-700">
                  <div className="flex items-center space-x-1">
                     <Calendar size={12} className="text-primary shrink-0" />
                     <span>{registration.finalSemproInfo.tanggal}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                     <Clock size={12} className="text-primary shrink-0" />
                     <span>{registration.finalSemproInfo.pukul}</span>
                  </div>
                  <div className="col-span-2 flex items-center space-x-1">
                     <Users size={12} className="text-primary shrink-0" />
                     <span className="truncate">Panelis: {registration.finalSemproInfo.panelis}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* MILESTONE 3: FINAL REVISIONS */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary font-bold italic">P3</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Phase 3</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Revisi Final & Validasi</h4>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
            <div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Naskah Revisi Akhir</span>
               <p className="text-[9px] text-slate-500 italic mt-0.5">Sudah disempurnakan sesuai feedback panelis</p>
            </div>
            {registration.finalRevisionFile ? (
              <button 
                onClick={() => openDocument(registration.finalRevisionFile, `Revisi_Final_${registration.dosenName || 'Dosen'}`)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <Eye size={12} />
                <span>NASKAH FIX</span>
              </button>
            ) : (
              <span className="text-[9px] font-bold text-slate-300 italic">BELUM DIUNGGAH</span>
            )}
          </div>
        </div>

        {/* MILESTONE 4: PUBLICATION DISCS */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary font-bold italic">P4</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Phase 4</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Penerbitan & Publikasi Jurnal</h4>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 text-xs font-bold text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider">Model Publikasi</span>
              <span className="text-slate-900 font-extrabold italic mt-1.5">{registration.publication?.type || 'MANDIRI'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider">Target Luaran</span>
              <span className="text-slate-900 font-extrabold italic mt-1.5">{registration.publication?.method || 'Jurnal Terakreditasi'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED RESEARCH JOURNAL (LOGBOOKS) */}
      <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
        <button 
          onClick={() => setLogbookOpen(!logbookOpen)}
          className="w-full flex items-center justify-between pb-3 border-b border-slate-100 text-left outline-none"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
              <ChevronDown className={cn("transition-transform duration-300", logbookOpen && "rotate-180")} size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Progress Jurnal</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1 flex items-center">
                Logbook Aktivitas Penelitian
                <span className="ml-3 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg">
                  {registration.logbooks?.length || 0} Jurnal Riset
                </span>
              </h4>
            </div>
          </div>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
            {logbookOpen ? 'COLLAPSE LOGS' : 'VIEW DETAILED LOGS'}
          </span>
        </button>

        {logbookOpen && (
          <div className="space-y-4 overflow-y-auto max-h-[400px] side-scrollbar pr-2 pt-2 animate-in slide-in-from-top duration-300">
            {registration.logbooks && registration.logbooks.length > 0 ? (
              registration.logbooks.map((log: PenelitianLogbook, index: number) => (
                <div key={log.id || index} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-slate-100/60 transition-colors">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-wider">{log.date}</span>
                      <span className="text-[9px] font-black text-primary uppercase tracking-wider">{log.time} WITA</span>
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-extrabold text-sm text-slate-800 uppercase italic truncate">{log.activity}</h5>
                      <p className="text-xs text-slate-500 italic font-medium">"{log.note || 'Tidak ada uraian tertulis.'}"</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 ml-auto md:ml-0">
                    {log.photo && (
                      <button 
                        onClick={() => openDocument(log.photo, `Logbook_Bukti_${index+1}`)}
                        className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center hover:border-primary overflow-hidden shadow-sm hover:scale-105 transition-all"
                      >
                        <img src={log.photo} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    )}
                    <span className={cn(
                      "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border shadow-sm",
                      log.status === 'APPROVED' ? "bg-green-50 text-green-600 border-green-100" :
                      log.status === 'REJECTED' ? "bg-red-50 text-red-600 border-red-100" :
                      "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      {log.status === 'APPROVED' ? 'VERIFIED' : log.status === 'REJECTED' ? 'REJECTED' : 'PENDING'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 italic text-xs">Belum ada jurnal bimbingan terdaftar.</div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
