/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, Mail, MessageCircle, Instagram, Facebook, Music2 } from 'lucide-react';
import { useData } from '../contexts/DataContext.tsx';

export default function Topbar() {
  const { businessInfo, settings } = useData();

  const hasContent = businessInfo.phone || businessInfo.email || businessInfo.whatsapp
    || settings.instagram_url || settings.facebook_url || settings.tiktok_url;

  if (!hasContent) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-10 bg-slate-900 text-white text-[11px] hidden lg:flex items-center px-6">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-3 items-center">
        <div className="flex items-center gap-1.5 justify-self-start">
          {businessInfo.phone && (
            <a href={`tel:${businessInfo.phone}`} className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
              <Phone className="w-3 h-3" />
              {businessInfo.phone}
            </a>
          )}
        </div>

        <div className="flex items-center gap-1.5 justify-self-center">
          {businessInfo.whatsapp && (
            <a
              href={`https://wa.me/${businessInfo.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-green-300 transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              WhatsApp
            </a>
          )}
        </div>

        <div className="flex items-center gap-3 justify-self-end">
          {businessInfo.email && (
            <a href={`mailto:${businessInfo.email}`} className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
              <Mail className="w-3 h-3" />
              {businessInfo.email}
            </a>
          )}
          {settings.instagram_url && (
            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors" title="Instagram">
              <Instagram className="w-3.5 h-3.5" />
            </a>
          )}
          {settings.facebook_url && (
            <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" title="Facebook">
              <Facebook className="w-3.5 h-3.5" />
            </a>
          )}
          {settings.tiktok_url && (
            <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors" title="TikTok">
              <Music2 className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
