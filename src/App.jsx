import { motion } from 'framer-motion';
import Navbar from './Navbar';

// คอมโพเนนต์สำหรับทำแอนิเมชันเลื่อนขึ้นแบบนุ่มนวล
const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ 
      duration: 1, 
      delay: delay, 
      ease: [0.16, 1, 0.3, 1] // ค่า Easing ที่ให้ความรู้สึกเหมือนเว็บ Apple
    }}
  >
    {children}
  </motion.div>
);

function App() {
  const projects = [
    {
      id: 1,
      title: "EGAT Transformer Management",
      description: "ระบบจัดการและติดตามสถานะหม้อแปลงไฟฟ้า พร้อมผสานข้อมูลพยากรณ์อากาศ",
      tech: "React, Node.js, Weather API",
    },
    {
      id: 2,
      title: "jstock-pos-buddy",
      description: "แอปพลิเคชัน Point of Sale สำหรับการจัดการหน้าร้าน",
      tech: "Lovable, State Management",
    },
    {
      id: 3,
      title: "Geoinformatics & Carbon Footprint",
      description: "งานวิเคราะห์ข้อมูลเชิงพื้นที่และประเมินคาร์บอนฟุตพรินต์",
      tech: "GIS, Spatial Data, Python",
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-apple-blue selection:text-white">
      
      <Navbar />

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6">
        <FadeUp>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
            Job.
          </h1>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="text-xl md:text-3xl text-gray-400 font-medium max-w-2xl">
            Software Developer & Data Systems Creator.
          </p>
        </FadeUp>
      </section>

      {/* Projects Section */}
      <section id="works" className="py-32 px-6 max-w-5xl mx-auto">
        <FadeUp>
          <h2 className="text-4xl md:text-5xl font-semibold mb-20 text-center">
            Selected Works.
          </h2>
        </FadeUp>

        <div className="space-y-32">
          {projects.map((project) => (
            <FadeUp key={project.id}>
              <div className="group cursor-pointer">
                {/* พื้นที่สำหรับใส่รูปภาพโปรเจกต์ */}
                <div className="w-full h-64 md:h-96 bg-apple-dark rounded-3xl mb-8 flex items-center justify-center overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]">
                  <span className="text-gray-600">Project Image / Mockup</span>
                </div>
                <h3 className="text-3xl font-semibold mb-3">{project.title}</h3>
                <p className="text-gray-400 text-lg mb-4">{project.description}</p>
                <p className="text-sm text-apple-blue font-medium">{project.tech}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-500 text-sm">
        <FadeUp>
          <p>© 2026 Job. All rights reserved.</p>
        </FadeUp>
      </footer>
      
    </div>
  );
}

export default App;