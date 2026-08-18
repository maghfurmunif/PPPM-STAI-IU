import { 
  FileText, Calendar, Clock, MapPin, Eye, CheckCircle2, ChevronRight, Bookmark, Image
} from 'lucide-react';
import { SemproRegistration } from '@/src/services/semproService';
import { cn, openDocument } from '@/src/lib/utils';

interface SemproCompleteHistoryProps {
  registration: SemproRegistration;
}

export default function SemproCompleteHistory({ registration }: SemproCompleteHistoryProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-750">
      <div className="border-l-4 border-primary pl-4">
        <h3 className="text-xl font-black uppercase text-slate-800 tracking-wider">
          Manifest Arsip & Rekam Seminar Proposal
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Menampilkan lampiran naskah awal, jadwal komite penguji, dokumentasi pertahanan sidang, serta berkas revisi munaqosyah terkoreksi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ENROLLMENT & PROPOSAL STAGE */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center font-bold">1</div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Draft Registration</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Pengajuan & Naskah Proposal</h4>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50 flex justify-between items-center text-xs">
            <div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">File Outline / Proposal</span>
               <p className="text-[9px] text-slate-500 italic mt-0.5">Diserahkan pada pendaftaran akademik</p>
            </div>
            {registration.proposalFile ? (
              <button 
                onClick={() => openDocument(registration.proposalFile, `Proposal_Sempro_${registration.studentName || 'Mahasiswa'}`)}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-primary/50 text-slate-800 hover:text-primary rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <Eye size={12} />
                <span>LIHAT DRAF PDF</span>
              </button>
            ) : (
              <span className="text-[9px] font-bold text-slate-500 italic">No File Found</span>
            )}
          </div>
        </div>

        {/* DEFENSE SCHEDULE */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center font-bold">2</div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Committee Panel</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Jadwal Sidang Komite</h4>
            </div>
          </div>

          {registration.schedule ? (
             <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Tanggal & Hari</span>
                      <span className="text-slate-900 font-extrabold block mt-1">{registration.schedule.hari}, {registration.schedule.tanggal}</span>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Waktu / Pukul</span>
                      <span className="text-slate-900 font-extrabold block mt-1">{registration.schedule.pukul} WIB</span>
                   </div>
                   <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                         <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Lokasi / Ruangan</span>
                         <span className="text-slate-900 font-extrabold mt-0.5 block">{registration.schedule.ruang}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-primary/15 text-primary text-[9px] font-black rounded-lg uppercase tracking-wider">
                         {registration.schedule.sifat || 'TERTUTUP'}
                      </span>
                   </div>
                </div>
             </div>
          ) : (
             <div className="p-6 text-center text-xs italic text-slate-500 font-medium bg-slate-50 rounded-2xl">
                Jadwal seminar belum dipublikasi formal oleh komite akademik.
             </div>
          )}
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* POST-SEMPRO EVIDENCE PHOTOS */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center font-bold">3</div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Photo Evidence</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Dokumentasi Jalannya Sidang</h4>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
             {registration.postSeminar?.dokumentasi && registration.postSeminar.dokumentasi.length > 0 ? (
               registration.postSeminar.dokumentasi.map((url, i) => (
                 <div key={i} className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden group relative">
                    <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                    <button 
                      onClick={() => openDocument(url, `Foto_Sidang_${i+1}_${registration.studentName || 'Mahasiswa'}`)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-xs font-black uppercase tracking-widest"
                    >
                      <Eye size={16} />
                    </button>
                 </div>
               ))
             ) : (
                <div className="col-span-3 py-10 bg-slate-50 text-xs italic text-slate-500 text-center rounded-2xl">
                   Belum ada bukti foto diunggah.
                </div>
             )}
          </div>
        </div>

        {/* POST-SEMPRO REVISIONS FILES */}
        <div className="card p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center font-bold">4</div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Correction Archives</p>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 mt-1">Naskah Catatan Koreksi & Revisi</h4>
            </div>
          </div>

          <div className="space-y-3">
             {registration.postSeminar?.catatan && registration.postSeminar.catatan.length > 0 ? (
               registration.postSeminar.catatan.map((url, i) => (
                 <div key={i} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl flex justify-between items-center text-xs transition-colors">
                    <div className="flex items-center space-x-2.5">
                       <FileText size={16} className="text-primary" />
                       <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[9px]">Berkas Catatan/Revisi #{i+1}</span>
                    </div>
                    <button 
                      onClick={() => openDocument(url, `Catatan_Revisi_${i+1}_${registration.studentName || 'Mahasiswa'}`)}
                      className="px-3 py-1 bg-white border border-slate-200 hover:border-primary text-slate-800 text-[9px] font-black uppercase tracking-widest hover:text-primary rounded-lg transition-colors flex items-center space-x-1"
                    >
                       <Eye size={12} />
                       <span>Buka</span>
                    </button>
                 </div>
               ))
             ) : (
                <div className="py-10 bg-slate-50 text-xs italic text-slate-500 text-center rounded-2xl">
                   Belum ada naskah koreksi/catatan diarsipkan.
                </div>
             )}
          </div>
        </div>

      </div>

    </div>
  );
}
