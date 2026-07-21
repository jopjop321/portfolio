// src/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from './App'; // เรียกใช้งานระบบภาษา Global
import { translations } from './data/translations';
import Navbar from './Navbar';

// คอมโพเนนต์สำหรับทำแอนิเมชันเลื่อนขึ้นแบบนุ่มนวล (โครงสร้างเดิมของคุณ Job)
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
  // เรียกใช้ระบบสลับภาษา Global
  const { lang } = useLanguage();
  const t = translations[lang];

  // ข้อมูลผลงานเดิมของคุณ Job
  const projects = [
    {
      id: 1,
      title: "APP NumEiang v1",
      description: lang === 'en'
        ? "Chinese calendar application offering auspicious timeline selection, feng shui guidance, lucky colors, and daily horoscopes by masters."
        : "app ปฏิทินจีน มีบริการดูฤกษ์ดี วันมงคลต่างๆโดย อาจารย์ฮวงจุ้ย สีมงคล และดวงประจำวัน",
      tech: "Flutter (Dart)",
      image: "/numeiang.png"
    },
    {
      id: 2,
      title: "jstockpos",
      description: lang === 'en'
        ? "An internal Point of Sale web application tailored for optimized enterprise retail management."
        : "เว็ป Point of Sale สำหรับการจัดการหน้าร้าน ใช้ภายในองค์กร",
      tech: "Lovable, GPT-4, Claude, Tailwind CSS, React, Vite",
      image: "/่jstockpos.png"
    },
    {
      id: 3,
      title: "EGAT Transformer Management",
      description: lang === 'en'
        ? "Electrical transformer condition tracking and management platform integrated with meteorology live forecast APIs."
        : "ระบบจัดการและติดตามสถานะหม้อแปลงไฟฟ้า พร้อมผสานข้อมูลพยากรณ์อากาศ",
      tech: "React, Google Apps Script (GAS), Weather API, AppSheet",
      image: "/egat.png"
    }
  ];

  // เพิ่มในไฟล์ Home.jsx ต่อจาก projects array
  const activities = [
    {
      id: 1,
      title: lang === 'en' ? "TA : Short Course Money Management and Tax 101" : "TA: คอร์สสั้น การบริหารเงินและภาษี 101",
      description: lang === 'en'
        ? "Conducted a session on reading mutual fund prospectuses and facilitated a Q&A with participants.."
        : "สอนดูรายละเอียดกองทุนรวม จากหนังสือชี้ชวนและตอบคำถามจากผู้เข้าร่วมกิจกรรม",
      org: "KMITL",
      image: "/ShortCourse_money.jpg"
    },
    {
      id: 2,
      title: lang === 'en' ? "TA: Short Course Mobile App Development with Flutter" : "TA: คอร์สสั้นพัฒนาแอปมือถือด้วย Flutter",
      description: lang === 'en'
        ? "Instructed participants on setting up Flutter and provided guidance during the lecture and practical sessions."
        : "สอนsetup flutter และ ให้คำแนะนำผู้เข้าร่วมระหว่างการเรียนการสอนหรือช่วงปฏิบัติ",
      org: "KMITL",
      image: "/ShortCourse_flutter.jpg"
    },
    {
      id: 3,
      title: "TA: Campus Tour",
      description: lang === 'en'
        ? "Facilitated the opening discussion with the children and provided Q&A support during the lesson."
        : "เป็นผู้ดำเนินช่วงสนทนาเปิดคลาสกับเด็กๆ และคอยตอบคำถามระหว่างทำการสอน",
      org: "KMITL",
      image: "/campus-tour.png" // ถ้าไม่มีรูป ให้ลบ key นี้ออก หรือปล่อยเป็น null
    },
    {
      id: 4,
      title: "TA: Xcer-SCIENCE@KMITL",
      description: lang === 'en'
        ? "Taught young students about micro:bit and offered mentorship during the activities."
        : "สอนน้องๆ นักเรียนเกี่ยวกับ micro:bit และให้คำปรึกษา/ดูแลอย่างใกล้ชิดระหว่างทำกิจกรรม",
      org: "KMITL",
      image: "/Xcer.jpg"
    },

  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-apple-blue selection:text-white antialiased">

      <Navbar />

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 relative">
        {/* เพิ่มแสงไฟเรืองแสงสไตล์ Apple Premium ด้านหลังข้อความต้อนรับ */}
        <div className="absolute w-[500px] h-[500px] bg-[#C5A059] opacity-[0.04] blur-[120px] rounded-full pointer-events-none top-1/3"></div>

        {/* 🛠️ แก้ไขแท็กปิดตรงนี้เรียบร้อยแล้วครับ จาก </motion.div> เป็น </FadeUp> */}
        <FadeUp>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500">
            Job.
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-xl md:text-3xl text-gray-400 font-medium max-w-2xl mt-4">
            {lang === 'en' ? 'Software Developer' : 'นักพัฒนาซอฟต์แวร์'}
          </p>
        </FadeUp>
      </section>

      {/* Works Section */}
      <section id="works" className="py-32 px-6 max-w-5xl mx-auto">
        <FadeUp>
          <h2 className="text-4xl md:text-5xl font-semibold mb-20 text-center tracking-tight">
            Works.
          </h2>
        </FadeUp>

        {/* รายการแสดงผลงาน */}
        <div className="space-y-32">
          {projects.map((project) => (
            <FadeUp key={project.id}>
              <div className="group cursor-pointer">
                <div className="w-full md:h-[450px] bg-[#11141C] rounded-3xl mb-8 overflow-hidden transition-transform duration-700 group-hover:scale-[1.01] border border-white/5 shadow-2xl relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto md:h-full object-cover object-top opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div class="w-full py-32 flex items-center justify-center text-gray-600 font-light text-sm">${lang === 'en' ? 'Snapshot coming soon' : 'กำลังจัดเตรียมรูปภาพผลงาน'}</div>`;
                    }}
                  />
                </div>
                <h3 className="text-3xl font-semibold mb-3 tracking-tight">{project.title}</h3>
                <p className="text-gray-400 text-lg mb-4 font-light leading-relaxed">{project.description}</p>
                <p className="text-sm text-apple-blue font-medium tracking-wide uppercase">{project.tech}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
      {/* Activities Section */}
      <section id="activities" className="py-32 px-6 max-w-5xl mx-auto">
        <FadeUp>
          <h2 className="text-4xl md:text-5xl font-semibold mb-20 text-center tracking-tight">
            {lang === 'en' ? 'Activities.' : 'กิจกรรม.'}
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {activities.map((item) => (
            <FadeUp key={item.id}>
              <div className="bg-[#11141C] rounded-2xl border border-white/5 p-8 h-full hover:border-white/10 transition-colors duration-500">
                {item.image && (
                  <div className="w-full rounded-xl overflow-hidden mb-6">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto object-contain opacity-90"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2 tracking-tight">{item.title}</h3>
                <p className="text-sm text-apple-blue font-medium tracking-wide uppercase mb-4">{item.org}</p>
                <p className="text-gray-400 font-light leading-relaxed">{item.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
      {/* About Section */}

      <section id="about" className="py-32 px-6 max-w-3xl mx-auto text-center relative">
        <FadeUp>
          <h2 className="text-4xl md:text-5xl font-semibold mb-12 tracking-tight">About.</h2>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8 font-light">
            {lang === 'en' ? 'Hello, I am ' : 'สวัสดีครับ ผม '}
            <strong className="text-white font-semibold">Job</strong> <br />
            {lang === 'en'
              ? 'Driven by architectural precision, committed to engineering scalable software and responsive systems that turn logic into impact.'
              : 'ผู้หลงใหลในการเขียนโปรแกรมหรือทำยังไงก็ได้ให้โปรแกรมนั้นทำงานได้'}
          </p>
          <p className="text-lg text-gray-500 leading-relaxed font-light">
            {lang === 'en'
              ? 'Beyond writing production-grade code, I deeply enjoy experimenting with culinary arts—blending Western, Chinese, and Thai flavors to reset and find fresh perspectives.'
              : 'นอกจากการหมกมุ่นอยู่กับโค้ดและการออกแบบระบบแล้ว เวลาว่างผมยังสนุกกับการทดลองทำอาหารเมนูใหม่ๆ สไตล์จีน ตะวันตก และไทยเพื่อรีเฟรชตัวเองอีกด้วยครับ'}
          </p>
        </FadeUp>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 max-w-xl mx-auto text-center border-t border-white/10">
        <FadeUp>
          <h2 className="text-4xl font-semibold mb-8 tracking-tight">Let's Connect.</h2>
          <p className="text-gray-400 mb-10 font-light leading-relaxed">
            {lang === 'en'
              ? 'Interested in high-performance digital infrastructure, exploring unique technical architectures, or seeking a development collaboration? Drop a line.'
              : 'สนใจพูดคุยเรื่องเทคโนโลยี แลกเปลี่ยนไอเดีย หรือมีโปรเจกต์ที่อยากร่วมงานกัน สามารถติดต่อผมได้เลยครับ'}
          </p>
          <a
            href="mailto:jobsupachai@gmail.com"
            className="inline-block bg-white text-black font-semibold px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 shadow-xl text-sm"
          >
            Say Hello
          </a>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-600 text-xs border-t border-white/5 mt-20 font-light tracking-wide">
        <FadeUp>
          <p>© 2026 Job. All rights reserved.</p>
        </FadeUp>
      </footer>

    </div>
  );
}

export default Home;