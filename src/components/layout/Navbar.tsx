import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogOut, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Reactive check for logged in user
  const [isLoggedIn, setIsLoggedIn] = useState(!!(localStorage.getItem('user_role') && localStorage.getItem('user_id')));
  const [userName, setUserName] = useState(localStorage.getItem('user_name') || 'Ahmad Maghfur');
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role') || 'MAHASISWA');

  useEffect(() => {
    const handleStorageChange = () => {
      const role = localStorage.getItem('user_role');
      const userId = localStorage.getItem('user_id');
      setIsLoggedIn(!!(role && userId));
      setUserName(localStorage.getItem('user_name') || 'Ahmad Maghfur');
      setUserRole(role || 'MAHASISWA');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full overflow-hidden shadow-md border border-slate-200">
              <img src="/images/logo-stai.jpg" alt="Logo STAI IU" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="block font-semibold text-slate-900 leading-none">PPPM</span>
              <span className="block text-[10px] text-slate-500">STAI Ihyaul Ulum</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-primary font-medium text-sm transition-colors">Dashboard</Link>
            <Link to="/pengumuman" className="text-slate-600 hover:text-primary font-medium text-sm transition-colors">Pengumuman</Link>
            <Link to="/profil-peneliti" className="text-slate-600 hover:text-primary font-medium text-sm transition-colors">Profil Peneliti</Link>
            <Link to="/statistik" className="text-slate-600 hover:text-primary font-medium text-sm transition-colors">Statistik</Link>
            <Link to="/panduan" className="text-slate-600 hover:text-primary font-medium text-sm transition-colors">Panduan</Link>
            
            <div className="flex items-center space-x-4 pl-6 border-l border-slate-200">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => navigate(`/dashboard/${userRole.toLowerCase()}`)} 
                    className="flex items-center space-x-3 group"
                  >
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">{userName}</p>
                      <p className="text-xs text-slate-500">{userRole}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User size={16} />
                    </div>
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Login</Link>
                  <Link to="/register" className="btn-primary px-5 py-2 text-sm">Get Started</Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'} aria-expanded={isOpen} className="md:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

          {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-slate-100 p-4 space-y-3 shadow-lg"
        >
          <Link to="/" className="block py-2 text-slate-600 font-medium text-sm" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/pengumuman" className="block py-2 text-slate-600 font-medium text-sm" onClick={() => setIsOpen(false)}>Pengumuman</Link>
          <Link to="/profil-peneliti" className="block py-2 text-slate-600 font-medium text-sm" onClick={() => setIsOpen(false)}>Profil Peneliti</Link>
          <Link to="/statistik" className="block py-2 text-slate-600 font-medium text-sm" onClick={() => setIsOpen(false)}>Statistik</Link>
          <Link to="/panduan" className="block py-2 text-slate-600 font-medium text-sm" onClick={() => setIsOpen(false)}>Panduan</Link>
          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            {isLoggedIn ? (
              <>
                <Link to={`/dashboard/${userRole.toLowerCase()}`} className="w-full text-center py-3 bg-primary text-white rounded-xl font-medium text-sm" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-center py-3 bg-slate-100 text-slate-600 rounded-xl font-medium text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="w-full text-center py-3 text-slate-600 font-medium text-sm" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary text-center" onClick={() => setIsOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
