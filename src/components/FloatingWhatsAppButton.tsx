import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { buildWhatsAppChatUrl } from '../data/settingsDatabase';

interface FloatingWhatsAppButtonProps {
  whatsappNumber?: string;
  prefillMessage?: string;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  whatsappNumber = '8801797059419',
  prefillMessage,
}) => {
  const { lang } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const defaultPrefill =
    lang === 'bn'
      ? 'নমস্কার, আমি রাধামাধব সনাতন সাংস্কৃতিক জোট সম্পর্কে তথ্য জানতে আগ্রহী।'
      : 'Hello, I would like to inquire about Radhamadhob Sanatan Cultural Alliance.';

  const chatUrl = buildWhatsAppChatUrl(
    whatsappNumber || '8801797059419',
    prefillMessage || defaultPrefill
  );

  const labelText =
    lang === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি যোগাযোগ' : 'Chat on WhatsApp';

  return (
    <aside
      aria-label={labelText}
      className="fixed bottom-14 sm:bottom-16 right-4 sm:right-6 z-[120] flex items-center group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Tooltip Pill (Desktop & Expanded) */}
      <span
        aria-hidden="true"
        className={`hidden sm:inline-flex items-center mr-2.5 px-3 py-1.5 rounded-full bg-[#120706]/95 text-[#FDE68A] text-xs font-bold border border-[#D4AF37]/50 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 pointer-events-none ${
          isHovered
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] mr-1.5 animate-pulse" />
        {labelText}
      </span>

      {/* Main Floating WhatsApp Action Button */}
      <a
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labelText}
        title={labelText}
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#166534] via-[#22C55E] to-[#25D366] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(34,197,94,0.55)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.75)] border-2 border-[#D4AF37] hover:border-[#FDE68A] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ring-2 ring-black/40"
      >
        {/* Subtle breathing ripple halo */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping opacity-60 pointer-events-none"
          aria-hidden="true"
        />

        {/* Crisp WhatsApp Vector Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md relative z-10"
          aria-hidden="true"
        >
          <path d="M12.031 2.01c-5.518 0-9.998 4.48-9.998 9.998 0 1.763.459 3.485 1.332 5.003L2 22l5.122-1.343a9.957 9.957 0 0 0 4.908 1.298h.004c5.517 0 9.997-4.48 9.997-9.998 0-2.671-1.04-5.182-2.928-7.071A9.935 9.935 0 0 0 12.031 2.01Zm0 18.297h-.003a8.285 8.285 0 0 1-4.224-1.157l-.303-.18-3.141.824.838-3.061-.197-.314a8.278 8.278 0 0 1-1.272-4.411c0-4.576 3.724-8.3 8.303-8.3 2.217 0 4.302.864 5.87 2.432a8.248 8.248 0 0 1 2.43 5.869c0 4.577-3.725 8.298-8.301 8.298Zm4.554-6.214c-.249-.125-1.477-.729-1.706-.812-.229-.083-.395-.125-.562.125-.166.25-.645.812-.791.979-.145.166-.291.187-.54.062-.25-.125-1.054-.388-2.008-1.239-.742-.662-1.243-1.48-1.389-1.73-.145-.25-.015-.385.11-.509.112-.112.25-.292.374-.438.125-.145.167-.25.25-.416.083-.167.042-.312-.021-.437-.062-.125-.562-1.354-.77-1.854-.202-.486-.408-.42-.562-.428l-.478-.008c-.167 0-.437.062-.666.312-.229.25-.874.854-.874 2.083s.895 2.416 1.02 2.583c.125.166 1.761 2.689 4.267 3.77.596.257 1.061.411 1.424.526.598.19 1.143.163 1.573.099.48-.072 1.477-.604 1.685-1.187.208-.583.208-1.083.146-1.187-.063-.104-.229-.167-.479-.292Z" />
        </svg>
      </a>
    </aside>
  );
};
