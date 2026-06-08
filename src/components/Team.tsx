/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useData } from '../contexts/DataContext.tsx';
import { Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
};

const socialColorMap: Record<string, string> = {
  facebook: 'hover:text-blue-600',
  instagram: 'hover:text-pink-600',
  linkedin: 'hover:text-blue-700',
  whatsapp: 'hover:text-green-500',
};

export default function Team() {
  const { team } = useData();
  return (
    <section id="equipa" className="py-20 bg-white transition-all">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono font-extrabold tracking-widest text-brand-blue bg-brand-blue/5 px-3.5 py-1.5 rounded-full">
            EQUIPA DEDICADA
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4 tracking-tight text-slate-900">
            Conheça a nossa equipa de especialistas
          </h2>
          <p className="text-slate-500 mt-4 text-md">
            Profissionais certificados e apaixonados por tecnologia, prontos para devolver a vida ao seu dispositivo.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {team.map((member) => (
            <motion.div
              key={member.id}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              className="glass-card rounded-3xl p-6 text-center hover:shadow-xl transition-all group"
            >
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-slate-100 group-hover:ring-brand-blue/20 transition-all mb-5">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <h3 className="text-lg font-bold font-display text-slate-900">
                {member.name}
              </h3>
              <span className="inline-block text-xs font-mono font-bold text-brand-blue bg-brand-blue/5 px-2.5 py-1 rounded-full mt-1 mb-3">
                {member.role}
              </span>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {member.bio}
              </p>

              <div className="flex items-center justify-center gap-2">
                {Object.entries(member.socialLinks).map(([key, url]) => {
                  if (!url) return null;
                  const Icon = socialIconMap[key];
                  const colorClass = socialColorMap[key] || 'hover:text-slate-600';
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 text-slate-400 ${colorClass} rounded-lg hover:bg-slate-100 transition-all`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
