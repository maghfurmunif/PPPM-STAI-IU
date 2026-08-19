import { supabase } from '@/src/lib/supabase';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  tag: string;
  created_at: string;
}

export interface Guide {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
}

export const publicService = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
       console.error('Error fetching announcements:', error);
       return [];
    }
    return data || [];
  },

  saveAnnouncement: async (ann: Partial<Announcement>) => {
    const { error } = await supabase
      .from('announcements')
      .upsert(ann);
    if (error) throw error;
  },

  deleteAnnouncement: async (id: string) => {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  getGuides: async (): Promise<Guide[]> => {
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
       console.error('Error fetching guides:', error);
       return [];
    }
    return data || [];
  },

  saveGuide: async (guide: Partial<Guide>) => {
    const { error } = await supabase
      .from('guides')
      .upsert(guide);
    if (error) throw error;
  },

  deleteGuide: async (id: string) => {
    const { error } = await supabase
      .from('guides')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  /** Helper: extract jenisKarya from a dokumentasi row, handling both camelCase and snake_case column names */
  getJenisKarya: (d: any): string => {
    return d.jenisKarya || d.jenis_karya || d.JENISKARYA || '';
  },

  getGlobalStats: async () => {
    // Wrap each query so one RLS failure doesn't break the entire stats
    const safe = async (fn: () => PromiseLike<any>) => {
      try { return await fn(); } catch { return { data: null, count: null, error: true }; }
    };

    const [penelitianRes, semproRes, skripsiRes, kknRes, pengabdianRes, pengabdianSelesaiRes, profilesRes, dokumentasiRes] = await Promise.all([
      safe(async () => await supabase.from('penelitian_registrations').select('id, status')),
      safe(async () => await supabase.from('sempro_registrations').select('id', { count: 'exact', head: true })),
      safe(async () => await supabase.from('skripsi_registrations').select('id', { count: 'exact', head: true })),
      safe(async () => await supabase.from('kkn_registrations').select('id', { count: 'exact', head: true })),
      safe(async () => await supabase.from('pengabdian_registrations').select('id, status')),
      safe(async () => await supabase.from('pengabdian_registrations').select('id', { count: 'exact', head: true }).eq('status', 'COMPLETED')),
      safe(async () => await supabase.from('profiles').select('id, role')),
      safe(async () => await supabase.from('dosen_dokumentasi').select('*')),
    ]);

    const activeUsers = profilesRes.data?.length || 0;
    const dosenCount = profilesRes.data?.filter((p: any) => p.role === 'DOSEN').length || 0;
    const mahasiswaCount = profilesRes.data?.filter((p: any) => p.role === 'MAHASISWA').length || 0;

    const penelitianTotal = (penelitianRes.data || []).length;
    const penelitianSelesaiCount = (penelitianRes.data || []).filter((r: any) => r.status === 'COMPLETED').length;
    const penelitianAktif = penelitianTotal - penelitianSelesaiCount;
    const pengabdianTotal = (pengabdianRes.data || []).length;
    const pengabdianSelesaiCount = pengabdianSelesaiRes.count || 0;
    const pengabdianAktif = pengabdianTotal - pengabdianSelesaiCount;

    // Hitung dokumentasi — support both camelCase & snake_case column names
    const docs = dokumentasiRes.data || [];
    const getJK = (d: any) => d.jenisKarya || d.jenis_karya || d.JENISKARYA || '';
    const jurnalCount = docs.filter((d: any) => getJK(d) === 'Jurnal').length;
    const bukuCount = docs.filter((d: any) => getJK(d) === 'Buku').length;
    const prosidingCount = docs.filter((d: any) => getJK(d) === 'Prosiding').length;
    const penelitianDocCount = docs.filter((d: any) => getJK(d) === 'Penelitian').length;
    const pengabdianDocCount = docs.filter((d: any) => getJK(d) === 'Pengabdian').length;
    const lainnyaCount = docs.filter((d: any) => {
      const jk = getJK(d);
      return jk === 'Lainnya' || (!['Jurnal','Buku','Prosiding','Penelitian','Pengabdian'].includes(jk));
    }).length;

    return {
      penelitian: penelitianTotal,
      penelitianAktif,
      penelitianSelesai: penelitianSelesaiCount,
      pengabdian: pengabdianTotal,
      pengabdianAktif,
      pengabdianSelesai: pengabdianSelesaiCount,
      sempro: semproRes.count || 0,
      skripsi: skripsiRes.count || 0,
      kkn: kknRes.count || 0,
      totalActivity: penelitianTotal + (semproRes.count || 0) + (skripsiRes.count || 0) + (kknRes.count || 0) + pengabdianTotal,
      activeUsers,
      dosenCount,
      mahasiswaCount,
      // Statistik Dokumentasi
      dokumentasiTotal: docs.length,
      jurnal: jurnalCount,
      buku: bukuCount,
      prosiding: prosidingCount,
      penelitianDoc: penelitianDocCount,
      pengabdianDoc: pengabdianDocCount,
      lainnya: lainnyaCount
    };
  },

  /** Fetch monthly counts for a given table. Returns [{ bulan: 'Jan', selesai: N, aktif: N }] */
  getMonthlyStats: async (tableName: string): Promise<{ bulan: string; selesai: number; aktif: number }[]> => {
    const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    const currentYear = new Date().getFullYear();
    const [{ data: allRows }, { data: completedRows }] = await Promise.all([
      supabase.from(tableName).select('id, status, created_at'),
      supabase.from(tableName).select('id, created_at').eq('status', 'COMPLETED'),
    ]);

    const counts: { bulan: string; selesai: number; aktif: number }[] = MONTHS.map(m => ({ bulan: m, selesai: 0, aktif: 0 }));

    (allRows || []).forEach((row: any) => {
      const d = new Date(row.created_at);
      if (d.getFullYear() === currentYear) {
        counts[d.getMonth()].aktif++;
      }
    });
    (completedRows || []).forEach((row: any) => {
      const d = new Date(row.created_at);
      if (d.getFullYear() === currentYear) {
        counts[d.getMonth()].selesai++;
      }
    });

    return counts;
  },

  /** Statistik publikasi per tahun */
  getPublicationByYear: async (): Promise<{ tahun: string; jurnal: number; buku: number; prosiding: number; penelitian: number }[]> => {
    let docs: any[] = [];
    try { const r = await supabase.from('dosen_dokumentasi').select('*'); docs = r.data || []; } catch { return []; }
    if (!docs.length) return [];

    const yearMap: Record<string, { jurnal: number; buku: number; prosiding: number; penelitian: number }> = {};

    docs.forEach(d => {
      const tgl = d.tanggal || '';
      const year = tgl.split('-')[0] || tgl.split('/')[2] || new Date().getFullYear().toString();
      if (!yearMap[year]) yearMap[year] = { jurnal: 0, buku: 0, prosiding: 0, penelitian: 0 };
      const jk = (d.jenisKarya || d.jenis_karya || '').toLowerCase();
      if (jk === 'jurnal') yearMap[year].jurnal++;
      else if (jk === 'buku') yearMap[year].buku++;
      else if (jk === 'prosiding') yearMap[year].prosiding++;
      else yearMap[year].penelitian++;
    });

    return Object.entries(yearMap)
      .map(([tahun, counts]) => ({ tahun, ...counts }))
      .sort((a, b) => a.tahun.localeCompare(b.tahun));
  },

  /** Statistik penelitian dosen per tahun (yang sudah selesai) */
  getPenelitianByYear: async (): Promise<{ tahun: string; selesai: number; aktif: number }[]> => {
    let rows: any[] = [];
    try { const r = await supabase.from('penelitian_registrations').select('id, status, created_at'); rows = r.data || []; } catch { return []; }
    if (!rows.length) return [];

    const yearMap: Record<string, { selesai: number; aktif: number }> = {};
    rows.forEach((r: any) => {
      const year = r.created_at ? new Date(r.created_at).getFullYear().toString() : new Date().getFullYear().toString();
      if (!yearMap[year]) yearMap[year] = { selesai: 0, aktif: 0 };
      if (r.status === 'COMPLETED') yearMap[year].selesai++;
      else yearMap[year].aktif++;
    });

    return Object.entries(yearMap)
      .map(([tahun, counts]) => ({ tahun, ...counts }))
      .sort((a, b) => a.tahun.localeCompare(b.tahun));
  },

  /** Statistik publikasi per dosen */
  getPublicationByDosen: async (): Promise<{ dosenId: string; dosenName: string; total: number }[]> => {
    let docs: any[] = [];
    try { const r = await supabase.from('dosen_dokumentasi').select('id, dosen_id'); docs = r.data || []; } catch { return []; }
    if (docs.length === 0) return [];

    const dosenIds = Array.from(new Set(docs.map(d => d.dosen_id)));
    let profiles: any[] = [];
    try { const r = await supabase.from('profiles').select('id, full_name').in('id', dosenIds); profiles = r.data || []; } catch { profiles = []; }
    const profileMap = (profiles || []).reduce((acc: any, p) => { acc[p.id] = p.full_name; return acc; }, {});

    const countMap: Record<string, number> = {};
    docs.forEach(d => { countMap[d.dosen_id] = (countMap[d.dosen_id] || 0) + 1; });

    return Object.entries(countMap)
      .map(([dosenId, total]) => ({ dosenId, dosenName: profileMap[dosenId] || 'Dosen', total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  },

  /** Statistik jenis publikasi */
  getPublicationByType: async (): Promise<{ jenis: string; jumlah: number }[]> => {
    let docs: any[] = [];
    try { const r = await supabase.from('dosen_dokumentasi').select('*'); docs = r.data || []; } catch { return []; }
    if (!docs.length) return [];

    const typeMap: Record<string, number> = {};
    docs.forEach(d => {
      const jk = d.jenisKarya || d.jenis_karya || 'Lainnya';
      typeMap[jk] = (typeMap[jk] || 0) + 1;
    });

    return Object.entries(typeMap)
      .map(([jenis, jumlah]) => ({ jenis, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah);
  },

  getRecentActivities: async (): Promise<any[]> => {
    try {
      const [profilesRes, penelitianRes, semproRes, skripsiRes, kknRes, pengabdianRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, role'),
        supabase.from('penelitian_registrations').select('id, dosen_id, status, updated_at').order('updated_at', { ascending: false }).limit(4),
        supabase.from('sempro_registrations').select('id, student_id, status, updated_at').order('updated_at', { ascending: false }).limit(4),
        supabase.from('skripsi_registrations').select('id, student_id, status, updated_at').order('updated_at', { ascending: false }).limit(4),
        supabase.from('kkn_registrations').select('id, student_id, status, updated_at').order('updated_at', { ascending: false }).limit(4),
        supabase.from('pengabdian_registrations').select('id, dosen_id, status, updated_at').order('updated_at', { ascending: false }).limit(4),
      ]);

      const profilesMap = (profilesRes.data || []).reduce((acc: any, p) => {
        acc[p.id] = { name: p.full_name, role: p.role };
        return acc;
      }, {});

      const activities: any[] = [];

      (penelitianRes.data || []).forEach((row: any) => {
        const p = profilesMap[row.dosen_id] || { name: 'Dosen Hanafi', role: 'DOSEN' };
        activities.push({
          id: `pen-${row.id}`,
          name: p.name,
          role: p.role,
          action: `mengajukan pendaftaran penelitian baru`,
          statusText: row.status === 'SUBMITTED' ? 'Diajukan' : row.status === 'APPROVED' ? 'Disetujui' : row.status === 'REJECTED' ? 'Ditolak' : row.status,
          time: row.updated_at || new Date().toISOString(),
          category: 'Penelitian'
        });
      });

      (semproRes.data || []).forEach((row: any) => {
        const p = profilesMap[row.student_id] || { name: 'Mahasiswa', role: 'MAHASISWA' };
        activities.push({
          id: `sem-${row.id}`,
          name: p.name,
          role: p.role,
          action: `mendaftar seminar proposal`,
          statusText: row.status === 'SUBMITTED' ? 'Diajukan' : row.status === 'APPROVED' ? 'Disetujui' : row.status === 'REJECTED' ? 'Ditolak' : row.status,
          time: row.updated_at || new Date().toISOString(),
          category: 'Sempro'
        });
      });

      (skripsiRes.data || []).forEach((row: any) => {
        const p = profilesMap[row.student_id] || { name: 'Mahasiswa', role: 'MAHASISWA' };
        activities.push({
          id: `skr-${row.id}`,
          name: p.name,
          role: p.role,
          action: `mengajukan bimbingan skripsi`,
          statusText: row.status === 'SUBMITTED' ? 'Diajukan' : row.status === 'APPROVED' ? 'Disetujui' : row.status === 'REJECTED' ? 'Ditolak' : row.status,
          time: row.updated_at || new Date().toISOString(),
          category: 'Skripsi'
        });
      });

      (kknRes.data || []).forEach((row: any) => {
        const p = profilesMap[row.student_id] || { name: 'Mahasiswa', role: 'MAHASISWA' };
        activities.push({
          id: `kkn-${row.id}`,
          name: p.name,
          role: p.role,
          action: `mendaftar program KKN`,
          statusText: row.status === 'SUBMITTED' ? 'Diajukan' : row.status === 'APPROVED' ? 'Disetujui' : row.status === 'REJECTED' ? 'Ditolak' : row.status,
          time: row.updated_at || new Date().toISOString(),
          category: 'KKN'
        });
      });

      (pengabdianRes.data || []).forEach((row: any) => {
        const p = profilesMap[row.dosen_id] || { name: 'Dosen', role: 'DOSEN' };
        activities.push({
          id: `pnd-${row.id}`,
          name: p.name,
          role: p.role,
          action: `mengajukan pengabdian masyarakat`,
          statusText: row.status === 'SUBMITTED' ? 'Diajukan' : row.status === 'APPROVED' ? 'Disetujui' : row.status === 'REJECTED' ? 'Ditolak' : row.status,
          time: row.updated_at || new Date().toISOString(),
          category: 'Pengabdian'
        });
      });

      // Default fallback entries if zero activities in DB to avoid cold empty screen
      if (activities.length === 0) {
        return [
          { id: 'f-1', name: 'Dosen Hanafi', role: 'DOSEN', action: 'mengunggah jurnal baru', statusText: 'Publik', time: new Date(Date.now() - 3600000).toISOString(), category: 'Penelitian' },
          { id: 'f-2', name: 'Siti Rahma', role: 'MAHASISWA', action: 'mendaftar seminar proposal', statusText: 'Diajukan', time: new Date(Date.now() - 7200000).toISOString(), category: 'Sempro' },
          { id: 'f-3', name: 'Ahmad Fauzi', role: 'MAHASISWA', action: 'mengajukan berkas KKN', statusText: 'Diajukan', time: new Date(Date.now() - 10800000).toISOString(), category: 'KKN' }
        ];
      }

      // Sort all by time descending
      return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);
    } catch (e) {
      console.error('Error fetching recent activities:', e);
      return [];
    }
  }
};
