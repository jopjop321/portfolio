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
      ease: [0.16, 1, 0.3, 1] 
    }}
  >
    {children}
  </motion.div>
);

function Home() {
  // ข้อมูลผลงาน (อัปเดตใส่ชื่อไฟล์รูปภาพแล้ว)
  const projects = [
    {
      id: 1,
      title: "APP NumEiang v1",
      description: "app ปฏิทินจีน มีบริการดูฤกษ์ดี วันมงคลต่างๆโดย อาจาย์ฮวงจุ้ย สีมงคล และดวงประจำวัน",
      tech: "flutter(dart)",
      image: "/numeiang.png" // ต้องนำรูปชื่อนี้ไปใส่ในโฟลเดอร์ public
    },
    {
      id: 2,
      title: "jstockpos",
      description: "เว็ป Point of Sale สำหรับการจัดการหน้าร้าน ใช้ภายในองกรค์",
      tech: "Lovable, GPT-4 , Claude, Tailwind CSS, React, Vite",
      image: "/่jstockpos.png" // ต้องนำรูปชื่อนี้ไปใส่ในโฟลเดอร์ public
    },
    {
      id: 3,
      title: "EGAT Transformer Management",
      description: "ระบบจัดการและติดตามสถานะหม้อแปลงไฟฟ้า พร้อมผสานข้อมูลพยากรณ์อากาศ",
      tech: "React, Google Apps Script (GAS), Weather API,App Sheet",
      image: "/egat.png" 
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-apple-blue selection:text-white">
      
      <Navbar />

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6">
        <FadeUp>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
            Job.
          </h1>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="text-xl md:text-3xl text-gray-400 font-medium max-w-2xl mt-4">
            Software Developer  <br className="md:hidden" /> 
          </p>
        </FadeUp>
      </section>

      {/* Projects Section */}
      <section id="works" className="py-32 px-6 max-w-5xl mx-auto">
        <FadeUp>
          <h2 className="text-4xl md:text-5xl font-semibold mb-20 text-center">
             Works.
          </h2>
        </FadeUp>

        <div className="space-y-32">
          {projects.map((project) => (
            <FadeUp key={project.id}>
              <div className="group cursor-pointer">
                {/* พื้นที่สำหรับแสดงรูปภาพแบบเต็มกรอบ (Full Bleed) */}
                {/* พื้นที่สำหรับแสดงรูปภาพโปรเจกต์ (ยึดแบบแรกสุดที่ชอบ แต่แก้จุดบอดมือถือ) */}
                <div className="w-full md:h-[450px] bg-apple-dark rounded-3xl mb-8 overflow-hidden transition-transform duration-700 group-hover:scale-[1.02] border border-white/10 shadow-2xl">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    
                    // จุดสำคัญที่แก้ให้: 
                    // - บนมือถือใช้ h-auto เพื่อให้รูปสูงตามสัดส่วนจริง (ไม่โดนตัดแหว่งอีกต่อไป)
                    // - บน iPad/PC (md:) ใช้ h-full object-cover เพื่อให้รูปเต็มขอบพอดีเป๊ะแบบที่คุณชอบ
                    className="w-full h-auto md:h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="w-full py-32 flex items-center justify-center text-gray-600">Please add image to public folder</div>';
                    }}
                  />
                </div>
                <h3 className="text-3xl font-semibold mb-3">{project.title}</h3>
                <p className="text-gray-400 text-lg mb-4">{project.description}</p>
                <p className="text-sm text-apple-blue font-medium">{project.tech}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 max-w-3xl mx-auto text-center">
        <FadeUp>
          <h2 className="text-4xl md:text-5xl font-semibold mb-12">About.</h2>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8 font-light">
            สวัสดีครับ ผม <strong className="text-white font-semibold">Job</strong> <br/>
             ผู้หลงใหลในการเขียนโปรแกรมหรือทำยังไงก็ได้ให้โปรแกรมนั้นทำงานได้
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mb-8">
            {/* ประสบการณ์ที่ผ่านมาของผมครอบคลุมตั้งแต่การพัฒนาระบบ ไปจนถึงการสร้างแอปพลิเคชันยุคใหม่ด้วยเครื่องมืออย่าง Lovable, React และ Python เพื่อเปลี่ยนข้อมูลซับซ้อนให้กลายเป็นระบบที่ใช้งานได้จริงและตอบโจทย์ธุรกิจ */}
          </p>
          <p className="text-lg text-gray-500 leading-relaxed">
            นอกจากการหมกมุ่นอยู่กับโค้ดและการออกแบบระบบแล้ว เวลาว่างผมยังสนุกกับการทดลองทำอาหารเมนูใหม่ๆ สไตล์จีน ตะวันตก และไทยเพื่อรีเฟรชตัวเองอีกด้วยครับ
          </p>
        </FadeUp>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 max-w-xl mx-auto text-center border-t border-white/10">
        <FadeUp>
          <h2 className="text-4xl font-semibold mb-8">Let's Connect.</h2>
          <p className="text-gray-400 mb-10">
            สนใจพูดคุยเรื่องเทคโนโลยี แลกเปลี่ยนไอเดีย หรือมีโปรเจกต์ที่อยากร่วมงานกัน สามารถติดต่อผมได้เลยครับ
          </p>
          <a 
            href="mailto:jobsupachai@gmail.com" 
            className="inline-block bg-white text-black font-semibold px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300"
          >
            Say Hello
          </a>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-600 text-sm border-t border-white/5 mt-20">
        <FadeUp>
          <p>© 2026 Job. All rights reserved.</p>
        </FadeUp>
      </footer>
      
    </div>
  );
}

export default Home;