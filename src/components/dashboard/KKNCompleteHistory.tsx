import { useState } from 'react';
import { 
  FileText, Eye, Calendar, Clock, MapPin, Users,
  Building2, Camera, ClipboardCheck, GraduationCap,
  ChevronDown, ChevronUp, CheckCircle, Info
} from 'lucide-react';
import { KKNRegistration, KKNLogbook } from '@/src/services/kknService';
import { cn } from '@/src/lib/utils';

interface KKNCompleteHistoryProps {
  registration: KKNRegistration;
}

export default function KKNCompleteHistory({ registration }: KKNCompleteHistoryProps) {
  const [logbookOpen, setLogbookOpen] = useState(false);

  const documentLabels: { [key: string]: string } = {
    transkrip: 'Transkrip Nilai Akademik',
    pembayaran: 'Slip Bukti Pembayaran',
    krs: 'KRS Aktif (.PDF)',
    kesehatan: 'Surat Keterangan Sehat',
    foto: 'Pas Foto Tactical',
    pernyataan: 'Surat Pernyataan Komitmen',
    izinOrtu: 'Wali/Parental Consent'
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-750">
      <div className="border-l-4 border-primary pl-4">
        <h3 className="text-xl font-black uppercase text-slate-800 tracking-wider">
          Manifest Arsip & Rekam Proses KKN
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Menampilkan seluruh riwayat berkas, aktivitas, dan nilai dari awal pendaftaran hingga yudisium selesai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PHASE 1: REGISTRATION */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
              <ClipboardCheck size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Phase 1</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Dokumen Pendaftaran</h4>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto side-scrollbar pr-1">
            {registration.docs && Object.entries(registration.docs).length > 0 ? (
              Object.entries(registration.docs).map(([key, value]) => {
                const label = documentLabels[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase();
                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <span className="text-[11px] font-bold text-slate-700 truncate mr-2">{label}</span>
                    {typeof value === 'string' && value.startsWith('http') ? (
                      <button 
                        onClick={() => window.open(value, '_blank')} 
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

        {/* PHASE 2 & 4: SURVEY & MOBILIZATION */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Phase 2 & 4</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Induksi & Pelepasan</h4>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Dokumentasi Survei & Sosialisasi</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  ...(registration.surveyDocs?.sosialisasi || []),
                  ...(registration.surveyDocs?.survei || [])
                ].map((url: string, index: number) => (
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
                {[
                  ...(registration.surveyDocs?.sosialisasi || []),
                  ...(registration.surveyDocs?.survei || [])
                ].length === 0 && (
                  <div className="col-span-full py-2 pl-1 italic text-slate-400 text-xs flex items-center space-x-1.5">
                    <Info size={12} />
                    <span>Tidak ada dokumentasi survei lapangan terlampir.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Foto Pelepasan KKN</span>
                <span className="text-[9px] text-slate-500 font-medium italic pl-1">Departure & deployment validation</span>
              </div>
              {registration.deploymentPhoto ? (
                <button 
                  onClick={() => window.open(registration.deploymentPhoto, '_blank')}
                  className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all"
                >
                  <Camera size={12} />
                  <span>LIHAT FOTO</span>
                </button>
              ) : (
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest pr-2">BELUM DIUNGGAH</span>
              )}
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PHASE 3 & 6: RKL & LPK ACADEMIC DOCUMENTS */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Phase 3 & 6</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Dokumen Akademik KKN (RKL & LPK)</h4>
            </div>
          </div>

          <div className="space-y-3">
            {/* RKL SECTION */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-wider">Rencana Kegiatan Lapangan (RKL)</span>
              <div className="flex gap-2">
                <button 
                  disabled={!registration.rkl?.fileIndividu}
                  onClick={() => registration.rkl?.fileIndividu && window.open(registration.rkl.fileIndividu, '_blank')}
                  className={cn(
                    "flex-grow py-2 px-3 border rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 transition-all",
                    registration.rkl?.fileIndividu ? "bg-white border-slate-200 text-slate-800 hover:border-primary/40 hover:text-primary" : "bg-slate-100/50 border-transparent text-slate-400 cursor-not-allowed"
                  )}
                >
                  <FileText size={12} />
                  <span>RKL INDIVIDU</span>
                </button>
                <button 
                  disabled={!registration.rkl?.fileKelompok}
                  onClick={() => registration.rkl?.fileKelompok && window.open(registration.rkl.fileKelompok, '_blank')}
                  className={cn(
                    "flex-grow py-2 px-3 border rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 transition-all",
                    registration.rkl?.fileKelompok ? "bg-white border-slate-200 text-slate-800 hover:border-primary/40 hover:text-primary" : "bg-slate-100/50 border-transparent text-slate-400 cursor-not-allowed"
                  )}
                >
                  <Users size={12} />
                  <span>RKL KELOMPOK</span>
                </button>
              </div>
            </div>

            {/* LPK SECTION */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-wider">Laporan Pelaksanaan Kegiatan (LPK)</span>
              <div className="flex gap-2">
                <button 
                  disabled={!registration.lpk?.fileIndividu}
                  onClick={() => registration.lpk?.fileIndividu && window.open(registration.lpk.fileIndividu, '_blank')}
                  className={cn(
                    "flex-grow py-2 px-3 border rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 transition-all",
                    registration.lpk?.fileIndividu ? "bg-white border-slate-200 text-slate-800 hover:border-primary/40 hover:text-primary" : "bg-slate-100/50 border-transparent text-slate-400 cursor-not-allowed"
                  )}
                >
                  <FileText size={12} />
                  <span>LPK INDIVIDU</span>
                </button>
                <button 
                  disabled={!registration.lpk?.fileKelompok}
                  onClick={() => registration.lpk?.fileKelompok && window.open(registration.lpk.fileKelompok, '_blank')}
                  className={cn(
                    "flex-grow py-2 px-3 border rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 transition-all",
                    registration.lpk?.fileKelompok ? "bg-white border-slate-200 text-slate-800 hover:border-primary/40 hover:text-primary" : "bg-slate-100/50 border-transparent text-slate-400 cursor-not-allowed"
                  )}
                >
                  <Users size={12} />
                  <span>LPK KELOMPOK</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PHASE 7: ADVISORY & PROGRAM INFORMATION */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
              <Building2 size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Program Detail</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Staf & Penempatan Pelaksana</h4>
            </div>
          </div>

          <div className="space-y-3.5 text-xs font-bold text-slate-700">
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Lokasi Penempatan KKN</span>
              <span className="text-slate-900 font-extrabold italic uppercase">{registration.info?.lokasi || 'BELUM DIATUR'}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Kelompok / Regu Skuad</span>
              <span className="text-slate-900 font-extrabold italic uppercase">{registration.info?.kelompok || 'BELUM DIATUR'}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Dosen Pembimbing Lapangan</span>
              <span className="text-slate-900 font-extrabold italic uppercase">{registration.info?.dpl || 'BELUM DIATUR'}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Hari & Tgl Sosialisasi Akhir</span>
              <span className="text-slate-900 font-extrabold italic uppercase">{registration.info?.tglSosialisasi || 'BELUM DIATUR'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* PHASE 5: DAILY ACTIVITIES (LOGBOOK) SECTION */}
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
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Phase 5</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1 flex items-center">
                Logbook Aktivitas Lapangan 
                <span className="ml-3 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg">
                  {registration.logbooks?.length || 0} Entries
                </span>
                <span className="ml-2 px-2 py-0.5 bg-green-500/10 text-green-600 text-[10px] font-black rounded-lg">
                  {(registration.totalHours || 0).toFixed(1)} Jam Kerja
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
              registration.logbooks.map((log: KKNLogbook, index: number) => (
                <div key={log.id || index} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-slate-100/60 transition-colors">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-wider">{log.date}</span>
                      <span className="text-[9px] font-black text-primary uppercase tracking-wider">{log.hours} JAM</span>
                      <span className="text-[9px] font-bold text-slate-400">• {log.jenis || 'INDIVIDU'}</span>
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-extrabold text-sm text-slate-800 uppercase italic truncate">{log.nama}</h5>
                      <p className="text-xs text-slate-500 italic font-medium">"{log.catatan || 'Tidak ada uraian tertulis.'}"</p>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      <MapPin size={10} className="mr-1 text-primary" /> {log.lokasi} 
                      <span className="mx-2">•</span> 
                      <Building2 size={10} className="mr-1 text-primary" /> {log.pihakDesa} ({log.statusPihakDesa})
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 ml-auto md:ml-0">
                    {log.photos && log.photos[0] && (
                      <button 
                        onClick={() => window.open(log.photos[0], '_blank')}
                        className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center hover:border-primary overflow-hidden shadow-sm hover:scale-105 transition-all"
                      >
                        <img src={log.photos[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
              <div className="text-center py-10 text-slate-400 italic text-xs">Belum ada catatan logbook yang diajukan.</div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
