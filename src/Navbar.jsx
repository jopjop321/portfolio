import { motion } from 'framer-motion';

const Navbar = () => {
  const navItems = [
    { name: 'Works', href: '#works' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-6"
    >
      <div className="flex items-center gap-8 bg-black/40 backdrop-blur-md border border-white/10 px-8 py-3 rounded-full">
        <a href="#" className="font-bold text-lg mr-4 hover:text-white/80 transition-colors">
          Job.
        </a>
        
        <div className="flex gap-6">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;