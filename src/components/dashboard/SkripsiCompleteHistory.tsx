import { useState } from 'react';
import { 
  FileText, Eye, Calendar, Clock, User, CheckCircle,
  MessageSquare, Camera, GraduationCap, ChevronDown, BookOpen, Info
} from 'lucide-react';
import { SkripsiRegistration, SkripsiLogbook } from '@/src/services/skripsiService';
import { cn, openDocument } from '@/src/lib/utils';

interface SkripsiCompleteHistoryProps {
  registration: SkripsiRegistration;
}

export default function SkripsiCompleteHistory({ registration }: SkripsiCompleteHistoryProps) {
  const [bimbinganOpen, setBimbinganOpen] = useState(false);

  const docLabels: { [key: string]: string } = {
    proposalUrl: 'Draft Proposal Skripsi',
    ktmUrl: 'KTM Aktif Mahasiswa',
    transkripUrl: 'Transkrip Nilai Terakhir (Min 110 SKS)',
    spkUrl: 'Bukti Persetujuan Pembimbing (SPK)'
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-750">
      <div className="border-l-4 border-primary pl-4">
        <h3 className="text-xl font-black uppercase text-slate-800 tracking-wider">
          Manifest Arsip & Rekam Proses Skripsi
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Menampilkan seluruh riwayat pendaftaran, bimbingan, munaqosyah, naskah final, dan transkrip nilai akademik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PHASE 1: REGISTRATION FILES */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Draft & Dokumen</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Dokumen Pendaftaran</h4>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto side-scrollbar pr-1">
            {registration.registrationDocs && Object.entries(registration.registrationDocs).length > 0 ? (
              Object.entries(registration.registrationDocs).map(([key, value]) => {
                const label = docLabels[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase();
                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <span className="text-[11px] font-bold text-slate-700 truncate mr-2">{label}</span>
                    {typeof value === 'string' && value.startsWith('http') ? (
                      <button 
                        onClick={() => openDocument(value, label)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:border-primary/50 text-slate-800 hover:text-primary rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all"
                      >
                        <Eye size={12} />
                        <span>LIHAT ARSIP</span>
                      </button>
                    ) : (
                      <span className="text-[9px] font-medium text-slate-400 uppercase italic">Tdk Ada File</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-slate-400 italic text-xs">Tidak ada dokumen pendaftaran terunggah.</div>
            )}
          </div>
        </div>

        {/* PHD OR MASTER ASSIGNMENT (ADVISOR DESIGNATION) */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
              <User size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Designation</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Dosen Pembimbing Skripsi</h4>
            </div>
          </div>

          <div className="space-y-3 font-semibold text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50 flex justify-between items-center">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider">Pembimbing Utama (I)</span>
              <span className="text-slate-900 font-extrabold flex items-center italic">
                <User size={12} className="mr-1.5 text-primary" />
                {registration.advisor?.dosenSatuNama || 'Belum ditunjuk'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50 flex justify-between items-center">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider">Pembimbing Pendamping (II)</span>
              <span className="text-slate-900 font-extrabold flex items-center italic">
                <User size={12} className="mr-1.5 text-primary" />
                {registration.advisor?.dosenDuaNama || 'Belum ditunjuk'}
              </span>
            </div>
            
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Jadwal Munaqosyah</span>
                <span className="text-[9px] text-slate-500 font-medium italic pl-1">
                  {registration.examSchedule?.hari ? `${registration.examSchedule.hari}, ${registration.examSchedule.tanggal}` : 'Jadwal belum dipromosikan'}
                </span>
              </div>
              {registration.examSchedule?.ruang ? (
                <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                  {registration.examSchedule.ruang} • {registration.examSchedule.pukul}
                </span>
              ) : (
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest pr-2">NO SCHEDULE</span>
              )}
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* EXAM EVIDENCE & FINAL MANUSCRIPT */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
              <Camera size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Munaqosyah Proof</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Dokumentasi Sidang</h4>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Foto Bukti Pelaksanaan Sidang</span>
            <div className="grid grid-cols-3 gap-2">
              {registration.afterExamDocs?.munaqosyahPhotos?.map((url: string, index: number) => (
                <div key={index} className="aspect-square bg-slate-50 rounded-xl relative overflow-hidden group border border-slate-100">
                  <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                  <button 
                    onClick={() => window.open(url, '_blank')} 
                    className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              ))}
              {(!registration.afterExamDocs?.munaqosyahPhotos || registration.afterExamDocs.munaqosyahPhotos.length === 0) && (
                <div className="col-span-full py-4 pl-1 italic text-slate-400 text-xs flex items-center space-x-1.5">
                  <Info size={12} />
                  <span>Tidak ada bukti foto pelaksanaan sidang.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FINAL SKRIPSI UPLOAD & RATIFICATION SHEET */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
              <BookOpen size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Final Archives</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Skripsi Final & Pengesahan</h4>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Naskah Skripsi Final Resmi</span>
              <p className="text-[9px] text-slate-400 font-medium italic mt-0.5">Sudah dilengkapi lembar persetujuan dewan penguji</p>
            </div>
            {registration.afterExamDocs?.finalSkripsiUrl ? (
              <button 
                onClick={() => openDocument(registration.afterExamDocs.finalSkripsiUrl, 'Skripsi_Final')}
                className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <Eye size={12} />
                <span>LIHAT NASKAH</span>
              </button>
            ) : (
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">BELUM DIUNGGAH</span>
            )}
          </div>
        </div>

      </div>

      {/* BIMBINGAN LOGS */}
      <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
        <button 
          onClick={() => setBimbinganOpen(!bimbinganOpen)}
          className="w-full flex items-center justify-between pb-3 border-b border-slate-100 text-left outline-none"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
              <ChevronDown className={cn("transition-transform duration-300", bimbinganOpen && "rotate-180")} size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Progress Jurnal</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1 flex items-center">
                Logbook Jurnal Bimbingan Skripsi
                <span className="ml-3 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg">
                  {registration.logbooks?.length || 0} Sesi Bimbingan
                </span>
              </h4>
            </div>
          </div>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
            {bimbinganOpen ? 'COLLAPSE LOGS' : 'VIEW DETAILED LOGS'}
          </span>
        </button>

        {bimbinganOpen && (
          <div className="space-y-4 overflow-y-auto max-h-[400px] side-scrollbar pr-2 pt-2 animate-in slide-in-from-top duration-300">
            {registration.logbooks && registration.logbooks.length > 0 ? (
              registration.logbooks.map((log: SkripsiLogbook, index: number) => (
                <div key={log.id || index} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-slate-100/60 transition-colors">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-wider">{log.date}</span>
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-extrabold text-sm text-slate-800 uppercase italic truncate">{log.topic}</h5>
                      <p className="text-xs text-slate-500 italic font-medium">"{log.comment || 'Tidak ada catatan pembing atau diskusi tertulis.'}"</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 ml-auto md:ml-0">
                    {log.photo && (
                      <button 
                        onClick={() => window.open(log.photo, '_blank')}
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
              <div className="text-center py-10 text-slate-400 italic text-xs">Belum ada sesi bimbingan yang terdaftar.</div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
