
import { supabase } from '@/src/lib/supabase';
import { AcademicStatus } from './semproService';

export type PenelitianStatus = 
  | 'ENROLL' 
  | 'SUBMITTED' 
  | 'REJECTED' 
  | 'APPROVED' 
  | 'SEMPRO_SUBMITTED' 
  | 'PROGRESS' 
  | 'RESULT_SUBMITTED' 
  | 'RESULT_APPROVED'
  | 'REVISION_SUBMITTED'
  | 'PUBLICATION' 
  | 'COMPLETED';

export interface PenelitianRegistration {
  id: string;
  dosenId: string;
  dosenName: string;
  status: PenelitianStatus;
  createdAt?: string;
  updatedAt?: string;
  rejectionReason?: string;
  proposalFile?: string;
  semproInfo?: {
    lokasi: string;
    tanggal: string;
    pukul: string;
    catatan?: string;
  };
  semproProof?: {
    dokumentasi: string[]; // min 3
    catatan: string; // min 1 photo
  };
  logbooks: PenelitianLogbook[];
  resultFile?: string;
  finalSemproInfo?: { // Research Seminar
    tanggal: string;
    pukul: string;
    lokasi: string;
    panelis: string;
    peserta: string;
    infoLain?: string;
  };
  finalSemproProof?: {
    dokumentasi: string[]; // min 3
    catatan: string; // min 1 photo
  };
  finalRevisionFile?: string;
  skReviewerFile?: string;
  skPenerimaBantuanFile?: string;
  publication?: {
    type: 'MANDIRI' | 'PPPM';
    method?: string; // Jurnal, Buku, Prosiding, Lainnya
  };
  // Metadata untuk pelacakan kelengkapan data (termasuk penelitian pra-2025)
  judulPenelitian?: string;
  coAuthors?: string;
  skema?: string;
  tahunPenelitian?: string;
  jenisKarya?: string; // Penelitian, Jurnal, Buku, Pengabdian, Lainnya
}

/** Checklist kelengkapan 11 item penelitian */
export interface KelengkapanPenelitian {
  penelitiUtama: boolean;      // 1. Nama Peneliti Utama (selalu true jika ada dosen_id)
  coAuthor: boolean;            // 2. Co-Author
  judulPenelitian: boolean;     // 3. Judul Penelitian
  skema: boolean;               // 4. Skema (Internal/Hibah/Kerjasama/Mandiri)
  proposalPenelitian: boolean;  // 5. Proposal Penelitian (pdf)
  skReviewer: boolean;          // 6. SK Reviewer (pdf)
  seminarProposal: boolean;     // 7. Seminar Proposal (foto)
  skPenerimaan: boolean;        // 8. SK Penerimaan (pdf)
  logbookMonev: boolean;        // 9. Logbook Penelitian/Monev (foto)
  seminarHasil: boolean;        // 10. Seminar Hasil (foto)
  laporanHasil: boolean;        // 11. Laporan Hasil Seminar (pdf)
}

/** Hitung kelengkapan dari sebuah registration */
export function hitungKelengkapan(reg: PenelitianRegistration): KelengkapanPenelitian {
  return {
    penelitiUtama: true, // Selalu ada karena dosen_id wajib
    coAuthor: !!(reg.coAuthors && reg.coAuthors.trim() !== ''),
    judulPenelitian: !!(reg.judulPenelitian && reg.judulPenelitian.trim() !== ''),
    skema: !!(reg.skema && reg.skema !== ''),
    proposalPenelitian: !!(reg.proposalFile && reg.proposalFile.trim() !== ''),
    skReviewer: !!(reg.skReviewerFile && reg.skReviewerFile.trim() !== ''),
    seminarProposal: !!(reg.semproProof && reg.semproProof.dokumentasi && reg.semproProof.dokumentasi.length > 0),
    skPenerimaan: !!(reg.skPenerimaBantuanFile && reg.skPenerimaBantuanFile.trim() !== ''),
    logbookMonev: !!(reg.logbooks && reg.logbooks.some(l => l.photo && l.photo.trim() !== '')),
    seminarHasil: !!(reg.finalSemproProof && reg.finalSemproProof.dokumentasi && reg.finalSemproProof.dokumentasi.length > 0),
    laporanHasil: !!(reg.resultFile && reg.resultFile.trim() !== ''),
  };
}

/** Hitung persentase kelengkapan (0-100) */
export function persentaseKelengkapan(k: KelengkapanPenelitian): number {
  const values = Object.values(k);
  const filled = values.filter(Boolean).length;
  return Math.round((filled / values.length) * 100);
}

export interface PenelitianLogbook {
  id: string;
  date: string;
  time: string;
  activity: string;
  note: string;
  photo: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface DosenDokumentasi {
  id: string;
  dosenId: string;
  namaPeneliti?: string;
  jenisKarya: string;
  judul: string;
  tanggal: string;
  isbnIssn?: string;
  penulisTambahan?: string;
  coAuthorIds?: string[];
  penerbit: string;
  platform: 'REPOSITORY' | 'SISTER' | 'SINTA' | 'SCOPUS' | 'BERISSN' | 'LAIN';
  platformRank?: string;
  fileUrl: string;
  articleUrl?: string;
}

export interface DosenProfile {
  id: string;
  fullName: string;
  email?: string;
}

export const penelitianService = {
  getRegistrations: async (): Promise<PenelitianRegistration[]> => {
    // Stage 1: Get registrations
    const { data: regs, error: regError } = await supabase
      .from('penelitian_registrations')
      .select('*');
    
    if (regError) {
      console.error('Error fetching penelitian registrations:', regError);
      return [];
    }

    if (!regs || regs.length === 0) return [];

    // Stage 2: Get profiles
    const dosenIds = Array.from(new Set(regs.map(r => r.dosen_id)));
    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', dosenIds);

    const profileMap = (profiles || []).reduce((acc: any, p) => {
      acc[p.id] = p.full_name;
      return acc;
    }, {});

    return regs.map(r => ({
      ...r,
      dosenId: r.dosen_id,
      dosenName: profileMap[r.dosen_id] || 'Dosen Academic',
      logbooks: r.logbooks || [],
      semproInfo: r.sempro_info,
      semproProof: r.sempro_proof,
      finalSemproInfo: r.final_sempro_info,
      finalSemproProof: r.final_sempro_proof,
      resultFile: r.result_file,
      finalRevisionFile: r.final_revision_file,
      skReviewerFile: r.sk_reviewer_file,
      skPenerimaBantuanFile: r.sk_penerima_bantuan_file,
      rejectionReason: r.rejection_reason,
      proposalFile: r.proposal_file,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      judulPenelitian: r.judul_penelitian,
      coAuthors: r.co_authors,
      skema: r.skema,
      tahunPenelitian: r.tahun_penelitian,
      jenisKarya: r.jenis_karya,
    }));
  },

  getRegistrationsByDosen: async (dosenId: string): Promise<PenelitianRegistration[]> => {
    const { data: regs, error: regError } = await supabase
      .from('penelitian_registrations')
      .select('*')
      .eq('dosen_id', dosenId)
      .order('created_at', { ascending: false });
    
    if (regError) {
      console.error('Error fetching penelitian registrations:', regError);
      return [];
    }

    if (!regs || regs.length === 0) return [];

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', dosenId)
      .maybeSingle();

    return regs.map(r => ({
      ...r,
      dosenId: r.dosen_id,
      dosenName: profile?.full_name || 'Dosen Academic',
      logbooks: r.logbooks || [],
      semproInfo: r.sempro_info,
      semproProof: r.sempro_proof,
      finalSemproInfo: r.final_sempro_info,
      finalSemproProof: r.final_sempro_proof,
      resultFile: r.result_file,
      finalRevisionFile: r.final_revision_file,
      skReviewerFile: r.sk_reviewer_file,
      skPenerimaBantuanFile: r.sk_penerima_bantuan_file,
      rejectionReason: r.rejection_reason,
      proposalFile: r.proposal_file,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      judulPenelitian: r.judul_penelitian,
      coAuthors: r.co_authors,
      skema: r.skema,
      tahunPenelitian: r.tahun_penelitian,
      jenisKarya: r.jenis_karya,
    }));
  },

  saveRegistration: async (reg: PenelitianRegistration) => {
    const dbPayload: any = {
      dosen_id: reg.dosenId,
      status: reg.status,
      rejection_reason: reg.rejectionReason,
      proposal_file: reg.proposalFile,
      sempro_info: reg.semproInfo,
      sempro_proof: reg.semproProof,
      logbooks: reg.logbooks,
      result_file: reg.resultFile,
      final_sempro_info: reg.finalSemproInfo,
      final_sempro_proof: reg.finalSemproProof,
      final_revision_file: reg.finalRevisionFile,
      sk_reviewer_file: reg.skReviewerFile,
      sk_penerima_bantuan_file: reg.skPenerimaBantuanFile,
      publication: reg.publication,
      judul_penelitian: reg.judulPenelitian,
      co_authors: reg.coAuthors,
      skema: reg.skema,
      tahun_penelitian: reg.tahunPenelitian,
      jenis_karya: reg.jenisKarya,
      updated_at: new Date().toISOString()
    };

    if (reg.id) {
      dbPayload.id = reg.id;
    }

    const { error } = await supabase
      .from('penelitian_registrations')
      .upsert(dbPayload);

    if (error) {
       console.error('Penelitian Upsert Error:', error);
       throw error;
    }
  },
  
  getDokumentasi: async (dosenId?: string): Promise<DosenDokumentasi[]> => {
    let query = supabase.from('dosen_dokumentasi').select('*, profiles!dosen_id(full_name)');
    if (dosenId) query = query.eq('dosen_id', dosenId);
    
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching dokumentasi:', error);
      return [];
    }
    return (data || []).map(d => ({
      id: d.id,
      dosenId: d.dosen_id,
      namaPeneliti: d.profiles?.full_name || '',
      jenisKarya: d.jenisKarya || d.jenis_karya || '',
      judul: d.judul || '',
      tanggal: d.tanggal || '',
      isbnIssn: d.isbnIssn || d.isbn_issn || '',
      penulisTambahan: d.penulisTambahan || d.penulis_tambahan || '',
      penerbit: d.penerbit || '',
      platform: d.platform || '',
      platformRank: d.platform_rank || '',
      fileUrl: d.fileUrl || d.file_url || '',
      articleUrl: d.article_url || ''
    }));
  },

  getDosenProfiles: async (): Promise<DosenProfile[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('role', 'DOSEN');
    if (error) {
      console.error('Error fetching dosen profiles:', error);
      return [];
    }
    return (data || []).map(d => ({
      id: d.id,
      fullName: d.full_name,
      email: d.email
    }));
  },

  deleteRegistration: async (id: string) => {
    const { error } = await supabase
      .from('penelitian_registrations')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Penelitian Delete Error:', error);
      throw error;
    }
  },

  deleteDokumentasi: async (id: string) => {
    const { error } = await supabase
      .from('dosen_dokumentasi')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Dokumentasi Delete Error:', error);
      throw error;
    }
  },

  saveDokumentasi: async (doc: DosenDokumentasi) => {
    // Resolve co-author names from IDs
    let coAuthorNames = doc.penulisTambahan || '';
    if (doc.coAuthorIds && doc.coAuthorIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', doc.coAuthorIds);
      const names = (profiles || []).map(p => p.full_name);
      coAuthorNames = names.join(', ');
    }

    const dbPayload: any = {
      id: doc.id,
      dosen_id: doc.dosenId,
      jenis_karya: doc.jenisKarya,
      judul: doc.judul,
      tanggal: doc.tanggal,
      isbn_issn: doc.isbnIssn,
      penulis_tambahan: coAuthorNames,
      penerbit: doc.penerbit,
      platform: doc.platform,
      file_url: doc.fileUrl
    };
    if (doc.platformRank) dbPayload.platform_rank = doc.platformRank;
    if (doc.articleUrl) dbPayload.article_url = doc.articleUrl;
    const { error } = await supabase
      .from('dosen_dokumentasi')
      .upsert(dbPayload);
    if (error) throw error;
  }
};
