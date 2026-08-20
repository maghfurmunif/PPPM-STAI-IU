import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 pt-16 pb-8 border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Section 1: Profile & Contact */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded-full overflow-hidden shadow-md border border-slate-200">
                 <img src="/images/logo-stai.jpg" alt="Logo STAI IU" className="w-full h-full object-cover" />
               </div>
               <div>
                 <span className="block font-semibold text-slate-900 leading-none">PPPM</span>
                 <span className="block text-[10px] text-slate-500">STAI Ihyaul Ulum</span>
               </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Pusat Penelitian dan Pengabdian kepada Masyarakat (PPPM) STAI Ihyaul Ulum Gresik.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <Phone size={14} className="text-slate-400" />
                <span>+62 899-5023-222</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail size={14} className="text-slate-400" />
                <span>pppm@stai-iu.ac.id</span>
              </div>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Menu</h4>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/" className="text-sm text-slate-500 hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/pengumuman" className="text-sm text-slate-500 hover:text-primary transition-colors">Pengumuman</Link>
              <Link to="/statistik" className="text-sm text-slate-500 hover:text-primary transition-colors">Statistik</Link>
              <Link to="/panduan" className="text-sm text-slate-500 hover:text-primary transition-colors">Panduan</Link>
              <Link to="/login" className="text-sm text-slate-500 hover:text-primary transition-colors">Login</Link>
            </div>
          </div>

          {/* Section 3: Map */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Lokasi</h4>
            <div className="rounded-xl overflow-hidden h-40 border border-slate-100 relative">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0488092057562!2d112.5053578749972!3d-7.00353539299778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e77e48eb5a9a76b%3A0x14d3f3a46b5379d9!2sSTAI%20Ihyaul%20Ulum%20Gresik!5e0!3m2!1sid!2sid!4v1787207272567!5m2!1sid!2sid" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen={true} 
                 loading="lazy" 
                 referrerPolicy="no-referrer"
               ></iframe>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} PPPM STAI Ihyaul Ulum Gresik.
          </p>
          <div className="flex items-center space-x-4">
            <Facebook size={16} className="text-slate-400 hover:text-primary cursor-pointer transition-colors" />
            <Instagram size={16} className="text-slate-400 hover:text-primary cursor-pointer transition-colors" />
            <Youtube size={16} className="text-slate-400 hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}
