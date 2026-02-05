import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import siteData from '../data/siteData.json';
import { Mail, Github, MessageCircle, ArrowUpRight, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [formState, setFormState] = useState('idle'); // idle, loading, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('loading');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
      setTimeout(() => setFormState('idle'), 5000);
    }, 1500);
  };

  return (
    <footer id="contact" className="bg-pure-black text-pure-white py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Info */}
          <div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              {siteData.personalInfo.contactHeading.slice(0, 2)}
              <br />
              {siteData.personalInfo.contactHeading.slice(2)}
            </h2>
            <p className="text-pure-white/60 font-light text-lg max-w-sm mb-12">
              无论是分镜创作还是产品探讨，我始终对未知的领域充满好奇。期待与你建立连接。
            </p>
            
            <div className="space-y-6">
              <a href={`mailto:${siteData.personalInfo.email}`} className="flex items-center group">
                <div className="w-12 h-12 bg-pure-white/10 flex items-center justify-center rounded-full mr-4 group-hover:bg-pure-white group-hover:text-pure-black transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-pure-white/40 uppercase tracking-widest">Email</p>
                  <p className="text-lg">{siteData.personalInfo.email}</p>
                </div>
              </a>
              <div className="flex items-center group">
                <div className="w-12 h-12 bg-pure-white/10 flex items-center justify-center rounded-full mr-4">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-xs text-pure-white/40 uppercase tracking-widest">WeChat</p>
                  <p className="text-lg">{siteData.personalInfo.wechat}</p>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-pure-white/10 hidden lg:block">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-pure-white/40 mb-4">社交媒体</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href={siteData.personalInfo.github} target="_blank" rel="noreferrer" className="flex items-center hover:opacity-50 transition-opacity">
                        GitHub <ArrowUpRight size={14} className="ml-1" />
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-pure-white/40 mb-4">快速跳转</h4>
                  <ul className="space-y-2">
                    {siteData.navLinks.map(link => (
                      <li key={link.path}>
                        <Link to={link.path} className="hover:opacity-50 transition-opacity">{link.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-pure-white/5 p-8 md:p-12 rounded-sm border border-pure-white/10">
            <h3 className="text-2xl font-bold mb-8">发送消息</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-pure-white/40">您的姓名</label>
                  <input required type="text" className="w-full bg-pure-white/5 border-b border-pure-white/20 focus:border-pure-white py-3 outline-none transition-colors" placeholder="姓名" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-pure-white/40">您的邮箱</label>
                  <input required type="email" className="w-full bg-pure-white/5 border-b border-pure-white/20 focus:border-pure-white py-3 outline-none transition-colors" placeholder="email@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-pure-white/40">主题</label>
                <input required type="text" className="w-full bg-pure-white/5 border-b border-pure-white/20 focus:border-pure-white py-3 outline-none transition-colors" placeholder="合作、咨询或建议" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-pure-white/40">留言内容</label>
                <textarea required rows="4" className="w-full bg-pure-white/5 border-b border-pure-white/20 focus:border-pure-white py-3 outline-none transition-colors resize-none" placeholder="告诉我您的想法..."></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={formState !== 'idle'}
                className={`w-full py-4 flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-xs transition-all duration-500 ${
                  formState === 'success' ? 'bg-green-500 text-pure-white' : 'bg-pure-white text-pure-black hover:opacity-90'
                }`}
              >
                {formState === 'idle' && <><Send size={16} /> 发送消息</>}
                {formState === 'loading' && <div className="w-4 h-4 border-2 border-pure-black/20 border-t-pure-black rounded-full animate-spin"></div>}
                {formState === 'success' && <><CheckCircle2 size={16} /> 发送成功</>}
              </button>
              
              <p className="text-[9px] text-pure-white/20 uppercase tracking-widest text-center">
                提示：本表单目前为模拟功能。如需真实接入，推荐使用 <a href="https://resend.com" target="_blank" className="underline hover:text-pure-white">Resend</a> 或 <a href="https://formspree.io" target="_blank" className="underline hover:text-pure-white">Formspree</a> 服务。
              </p>
            </form>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-pure-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-pure-white/40 uppercase tracking-widest">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>© 2026 {siteData.personalInfo.englishName}</p>
            <span className="hidden md:inline">|</span>
            <p>Vibe Coding 第四期学员</p>
          </div>
          <div className="flex gap-8 lg:hidden">
            {siteData.navLinks.map(link => (
              <Link key={link.path} to={link.path}>{link.name}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a href={siteData.personalInfo.github} target="_blank" rel="noreferrer" className="hover:text-pure-white transition-colors">
              GitHub
            </a>
            <span>|</span>
            <p>Built with React & Tailwind</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
