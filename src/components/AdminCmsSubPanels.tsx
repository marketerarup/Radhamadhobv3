import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Edit3,
  Eye,
  FolderPlus,
  Globe,
  Image as ImageIcon,
  MapPin,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  CulturalProgramRecord,
  PROGRAM_CATEGORIES,
  PrivacyPolicyCollectionDoc,
  SeoPageKey,
  SeoPageRecord,
  applyDynamicSeoToDocumentHead,
  validateAndOptimizeUploadedImage,
} from '../data/cmsDatabase';
import {
  EventRecord,
  GALLERY_CATEGORY_TRANSLATIONS,
  GalleryRecord,
} from '../data/culturalProgramAndGalleryDatabase';
import {
  ORIGINAL_STAGE_PHOTO_OPTIONS,
  VideoRecord,
  extractYouTubeId,
} from '../data/dramaAndVideoDatabase';
import { SiteSettingsRecord } from '../data/settingsDatabase';

// ============================================================================
// 4. CULTURAL PROGRAM MANAGEMENT (`programs` Collection — Bilingual BN + EN)
// ============================================================================

interface ProgramsManagementProps {
  programs: CulturalProgramRecord[];
  onUpdatePrograms: (updated: CulturalProgramRecord[]) => Promise<void>;
  notifySaved: (msg: string) => void;
}

export const CmsProgramsManagementPanel: React.FC<ProgramsManagementProps> = ({
  programs,
  onUpdatePrograms,
  notifySaved,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingProgram, setViewingProgram] =
    useState<CulturalProgramRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState(PROGRAM_CATEGORIES[0]);
  const [dateBn, setDateBn] = useState('২০২৫');
  const [dateEn, setDateEn] = useState('2025');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [image, setImage] = useState(ORIGINAL_STAGE_PHOTO_OPTIONS[0].url);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setTitleBn('');
    setTitleEn('');
    setCategory(PROGRAM_CATEGORIES[0]);
    setDateBn('নিয়মিত বাৎসরিক ও উৎসব আয়োজন (২০২৫)');
    setDateEn('Annual & Festival Programs (2025)');
    setDescriptionBn('');
    setDescriptionEn('');
    setImage(ORIGINAL_STAGE_PHOTO_OPTIONS[0].url);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const openEdit = (prog: CulturalProgramRecord) => {
    setEditingId(prog.id);
    setTitleBn(prog.title_bn || prog.title || '');
    setTitleEn(prog.title_en || prog.titleEn || prog.title || '');
    setCategory(prog.category || PROGRAM_CATEGORIES[0]);
    setDateBn(prog.date || '২০২৫');
    setDateEn(prog.date_en || '2025');
    setDescriptionBn(prog.description_bn || prog.description || '');
    setDescriptionEn(
      prog.description_en || prog.descriptionEn || prog.description || ''
    );
    setImage(prog.image);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    try {
      const res = await validateAndOptimizeUploadedImage(file);
      setImage(res.dataUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn.trim() || !image) return;
    const resolvedTitleBn = titleBn.trim();
    const resolvedTitleEn = titleEn.trim() || resolvedTitleBn;
    const resolvedDescBn = descriptionBn.trim();
    const resolvedDescEn = descriptionEn.trim() || resolvedDescBn;

    if (editingId) {
      const updated = programs.map((p) =>
        p.id === editingId
          ? {
              ...p,
              title: resolvedTitleBn,
              title_bn: resolvedTitleBn,
              titleEn: resolvedTitleEn,
              title_en: resolvedTitleEn,
              category,
              date: dateBn.trim() || '২০২৫',
              date_en: dateEn.trim() || '2025',
              description: resolvedDescBn,
              description_bn: resolvedDescBn,
              descriptionEn: resolvedDescEn,
              description_en: resolvedDescEn,
              image,
            }
          : p
      );
      await onUpdatePrograms(updated);
      notifySaved('Cultural program updated in `programs` collection!');
    } else {
      const newProg: CulturalProgramRecord = {
        id: `program-${Date.now()}`,
        title: resolvedTitleBn,
        title_bn: resolvedTitleBn,
        titleEn: resolvedTitleEn,
        title_en: resolvedTitleEn,
        category,
        date: dateBn.trim() || '২০২৫',
        date_en: dateEn.trim() || '2025',
        description: resolvedDescBn,
        description_bn: resolvedDescBn,
        descriptionEn: resolvedDescEn,
        description_en: resolvedDescEn,
        image,
      };
      await onUpdatePrograms([newProg, ...programs]);
      notifySaved('New cultural program added to `programs` collection!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await onUpdatePrograms(programs.filter((p) => p.id !== id));
    notifySaved('Program deleted from `programs` collection.');
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5DEC9] shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#CC0000] uppercase">
            Firestore Collection: programs (Bilingual: বাংলা + English)
          </span>
          <h2 className="text-2xl font-bold text-[#1C1917] font-display-bn mt-0.5">
            ৪. সাংস্কৃতিক কার্যক্রম ব্যবস্থাপনা (Cultural Programs Management)
          </h2>
          <p className="text-xs text-[#57534E]">
            Fields: title_bn · title_en · description_bn · description_en · category · date · image
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="px-5 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#FDE68A]" />
          <span>নতুন কার্যক্রম যুক্ত করুন (Add Program)</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5DEC9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="কার্যক্রমের নাম বা বিবরণ দিয়ে খুঁজুন (Search programs)..."
          className="px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E5DEC9] rounded-xl flex-1"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E5DEC9] rounded-xl font-bold"
        >
          <option value="ALL">সকল বিভাগ (All Categories)</option>
          {PROGRAM_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs
          .filter((prog) => {
            const matchesCat =
              filterCategory === 'ALL' || prog.category === filterCategory;
            const q = searchQuery.trim().toLowerCase();
            if (!q) return matchesCat;
            return (
              matchesCat &&
              ((prog.title_bn || prog.title || '').toLowerCase().includes(q) ||
                (prog.title_en || prog.titleEn || '').toLowerCase().includes(q) ||
                (prog.description_bn || prog.description || '')
                  .toLowerCase()
                  .includes(q))
            );
          })
          .map((prog) => (
          <div
            key={prog.id}
            className="bg-white rounded-2xl border border-[#E5DEC9] overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-black">
                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 text-[#FDE68A] text-[11px] font-bold">
                  {prog.category}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <div className="text-xs font-semibold text-[#0F5132]">
                  {prog.date}
                </div>
                <h3 className="text-xl font-bold text-[#1C1917] font-display-bn">
                  {prog.title_bn || prog.title}
                </h3>
                <div className="text-xs font-semibold text-[#78716C]">
                  EN: {prog.title_en || prog.titleEn || '—'}
                </div>
                <p className="text-xs sm:text-sm text-[#57534E] line-clamp-2">
                  {prog.description_bn || prog.description}
                </p>
              </div>
            </div>
            <div className="px-5 py-3.5 bg-[#FAF8F5] border-t border-[#E5DEC9] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewingProgram(prog)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#0F5132] text-[#1C1917] hover:text-white border border-[#E5DEC9] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(prog)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#CC0000] text-[#1C1917] hover:text-white border border-[#E5DEC9] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(prog.id)}
                className="px-3 py-1.5 rounded-lg text-[#CC0000] hover:bg-red-50 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Program Details Modal (Read Operation) */}
      {viewingProgram && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setViewingProgram(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden border-2 border-[#D4AF37] shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] bg-black">
              <img
                src={viewingProgram.image}
                alt={viewingProgram.title}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setViewingProgram(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="px-3 py-1 rounded-lg bg-[#CC0000] text-white">
                  {viewingProgram.category}
                </span>
                <span className="text-[#0F5132]">
                  {viewingProgram.date} ({viewingProgram.date_en || '2025'})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-1">
                  <div className="text-[11px] font-bold text-[#CC0000]">
                    বাংলা তথ্য (Bengali)
                  </div>
                  <div className="text-base font-bold text-[#1C1917] font-display-bn">
                    {viewingProgram.title_bn || viewingProgram.title}
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {viewingProgram.description_bn || viewingProgram.description}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F0FDF4]/60 border border-[#0F5132]/20 space-y-1">
                  <div className="text-[11px] font-bold text-[#0F5132]">
                    English Information
                  </div>
                  <div className="text-base font-bold text-[#1C1917]">
                    {viewingProgram.title_en ||
                      viewingProgram.titleEn ||
                      viewingProgram.title}
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {viewingProgram.description_en ||
                      viewingProgram.descriptionEn ||
                      viewingProgram.description}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-[#E5DEC9]">
                <button
                  type="button"
                  onClick={() => {
                    const p = viewingProgram;
                    setViewingProgram(null);
                    openEdit(p);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#CC0000] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Program</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingProgram(null)}
                  className="px-4 py-2 rounded-xl border border-[#E5DEC9] text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 my-auto border-2 border-[#D4AF37]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-3">
              <h3 className="text-xl font-bold text-[#1C1917] font-display-bn">
                {editingId
                  ? 'কার্যক্রম সম্পাদনা (Edit Program — বাংলা + English)'
                  : 'নতুন কার্যক্রম সংযোজন (Add Program — বাংলা + English)'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-xs text-red-700 font-bold">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bengali Section */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-3">
                  <div className="text-xs font-bold text-[#CC0000] uppercase">
                    বাংলা তথ্য (Bengali Information)
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Title Bengali (শিরোনাম বাংলা) *
                    </label>
                    <input
                      type="text"
                      required
                      value={titleBn}
                      onChange={(e) => setTitleBn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Description Bengali (বিবরণ বাংলা) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={descriptionBn}
                      onChange={(e) => setDescriptionBn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Date Bengali (তারিখ বাংলা)
                    </label>
                    <input
                      type="text"
                      value={dateBn}
                      onChange={(e) => setDateBn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                </div>

                {/* English Section */}
                <div className="p-4 rounded-2xl bg-[#F0FDF4]/60 border border-[#0F5132]/20 space-y-3">
                  <div className="text-xs font-bold text-[#0F5132] uppercase">
                    English Information
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Title English *
                    </label>
                    <input
                      type="text"
                      required
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Description English *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Date English
                    </label>
                    <input
                      type="text"
                      value={dateEn}
                      onChange={(e) => setDateEn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] mb-1">
                    Category (বিভাগ) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E5DEC9] rounded-xl bg-white"
                  >
                    {PROGRAM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E5DEC9]">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-16 h-12 object-cover rounded border border-stone-300"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-3.5 py-2 rounded-lg bg-[#CC0000] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5DEC9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold border border-[#E5DEC9] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#CC0000] rounded-xl cursor-pointer"
                >
                  Save Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 5. EVENT MANAGEMENT (`events` Collection — Bilingual BN + EN)
// ============================================================================

interface EventsManagementProps {
  events: EventRecord[];
  onUpdateEvents: (updated: EventRecord[]) => Promise<void>;
  notifySaved: (msg: string) => void;
}

export const CmsEventsManagementPanel: React.FC<EventsManagementProps> = ({
  events,
  onUpdateEvents,
  notifySaved,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventNameBn, setEventNameBn] = useState('');
  const [eventNameEn, setEventNameEn] = useState('');
  const [dateBn, setDateBn] = useState('');
  const [dateEn, setDateEn] = useState('');
  const [locationBn, setLocationBn] = useState('');
  const [locationEn, setLocationEn] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [coverImage, setCoverImage] = useState(
    ORIGINAL_STAGE_PHOTO_OPTIONS[0].url
  );
  const [galleryImages, setGalleryImages] = useState<string[]>([
    ORIGINAL_STAGE_PHOTO_OPTIONS[0].url,
  ]);
  const coverRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setEventNameBn('');
    setEventNameEn('');
    setDateBn('শারদীয় উৎসব ২০২৫');
    setDateEn('Sharodiya Festival 2025');
    setLocationBn('রাধামাধব সাংস্কৃতিক জোট মঞ্চ প্রাঙ্গণ');
    setLocationEn('Radhamadhob Cultural Alliance Stage Ground');
    setDescriptionBn('');
    setDescriptionEn('');
    setCoverImage(ORIGINAL_STAGE_PHOTO_OPTIONS[0].url);
    setGalleryImages([ORIGINAL_STAGE_PHOTO_OPTIONS[0].url]);
    setIsModalOpen(true);
  };

  const openEdit = (ev: EventRecord) => {
    setEditingId(ev.id);
    setEventNameBn(ev.event_name_bn || ev.event_name || '');
    setEventNameEn(ev.event_name_en || ev.event_name || '');
    setDateBn(ev.date || '');
    setDateEn(ev.date_en || ev.date || '');
    setLocationBn(ev.location_bn || ev.location || '');
    setLocationEn(ev.location_en || ev.location || '');
    setDescriptionBn(ev.description_bn || ev.description || '');
    setDescriptionEn(ev.description_en || ev.description || '');
    setCoverImage(ev.cover_image);
    setGalleryImages(
      ev.gallery_images?.length ? ev.gallery_images : [ev.cover_image]
    );
    setIsModalOpen(true);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await validateAndOptimizeUploadedImage(file);
    setCoverImage(res.dataUrl);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const res = await validateAndOptimizeUploadedImage(files[i]);
      urls.push(res.dataUrl);
    }
    setGalleryImages((prev) => [...prev, ...urls]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventNameBn.trim()) return;
    const nameBn = eventNameBn.trim();
    const nameEn = eventNameEn.trim() || nameBn;
    const locBn = locationBn.trim();
    const locEn = locationEn.trim() || locBn;
    const descBn = descriptionBn.trim();
    const descEn = descriptionEn.trim() || descBn;

    if (editingId) {
      const updated = events.map((ev) =>
        ev.id === editingId
          ? {
              ...ev,
              event_name: nameBn,
              event_name_bn: nameBn,
              event_name_en: nameEn,
              date: dateBn.trim(),
              date_en: dateEn.trim() || dateBn.trim(),
              location: locBn,
              location_bn: locBn,
              location_en: locEn,
              description: descBn,
              description_bn: descBn,
              description_en: descEn,
              cover_image: coverImage,
              gallery_images: galleryImages,
            }
          : ev
      );
      await onUpdateEvents(updated);
      notifySaved('Event updated in `events` collection!');
    } else {
      const newEv: EventRecord = {
        id: `event-${Date.now()}`,
        event_name: nameBn,
        event_name_bn: nameBn,
        event_name_en: nameEn,
        date: dateBn.trim(),
        date_en: dateEn.trim() || dateBn.trim(),
        location: locBn,
        location_bn: locBn,
        location_en: locEn,
        description: descBn,
        description_bn: descBn,
        description_en: descEn,
        cover_image: coverImage,
        seo_filename: `radhamadhob-event-${Date.now()}.jpg`,
        alt_text: `${nameBn} — রাধামাধব সাংস্কৃতিক জোট`,
        gallery_images: galleryImages,
      };
      await onUpdateEvents([newEv, ...events]);
      notifySaved('Event created in `events` collection!');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <input
        ref={coverRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverUpload}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleGalleryUpload}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5DEC9] shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#0F5132] uppercase">
            Firestore Collection: events (Bilingual: বাংলা + English)
          </span>
          <h2 className="text-2xl font-bold text-[#1C1917] font-display-bn mt-0.5">
            ৫. ইভেন্ট ব্যবস্থাপনা (Event Management)
          </h2>
          <p className="text-xs text-[#57534E]">
            Fields: Event name (BN/EN) · Date · Location (BN/EN) · Description (BN/EN) · Cover image · Gallery images
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="px-5 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#FDE68A]" />
          <span>নতুন ইভেন্ট তৈরি করুন (Create Event)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="bg-white rounded-2xl border border-[#E5DEC9] overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-black">
                <img
                  src={ev.cover_image}
                  alt={ev.event_name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-bold">
                  {ev.gallery_images?.length || 1} Photos
                </span>
              </div>
              <div className="p-5 space-y-2">
                <div className="text-xs font-bold text-[#CC0000] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ev.date}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1C1917] font-display-bn">
                  {ev.event_name}
                </h3>
                <div className="text-xs font-semibold text-[#78716C]">
                  EN: {ev.event_name_en || '—'}
                </div>
                <div className="text-xs text-[#0F5132] font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{ev.location}</span>
                </div>
                <p className="text-xs text-[#57534E] line-clamp-2">
                  {ev.description}
                </p>
              </div>
            </div>
            <div className="px-5 py-3.5 bg-[#FAF8F5] border-t border-[#E5DEC9] flex items-center justify-between">
              <button
                type="button"
                onClick={() => openEdit(ev)}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#CC0000] text-[#1C1917] hover:text-white border border-[#E5DEC9] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Event</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  await onUpdateEvents(events.filter((x) => x.id !== ev.id));
                  notifySaved('Event deleted from `events` collection.');
                }}
                className="px-3 py-1.5 rounded-lg text-[#CC0000] hover:bg-red-50 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 my-auto border-2 border-[#D4AF37]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-3">
              <h3 className="text-xl font-bold text-[#1C1917] font-display-bn">
                {editingId
                  ? 'ইভেন্ট আপডেট করুন (Edit Event — বাংলা + English)'
                  : 'নতুন ইভেন্ট তৈরি করুন (Create Event — বাংলা + English)'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-3">
                  <div className="text-xs font-bold text-[#CC0000] uppercase">
                    বাংলা তথ্য (Bengali Information)
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      ইভেন্টের নাম (Event Name Bengali) *
                    </label>
                    <input
                      type="text"
                      required
                      value={eventNameBn}
                      onChange={(e) => setEventNameBn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      তারিখ (Date Bengali) *
                    </label>
                    <input
                      type="text"
                      required
                      value={dateBn}
                      onChange={(e) => setDateBn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      স্থান (Location Bengali) *
                    </label>
                    <input
                      type="text"
                      required
                      value={locationBn}
                      onChange={(e) => setLocationBn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      বিবরণ (Description Bengali) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={descriptionBn}
                      onChange={(e) => setDescriptionBn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0FDF4]/60 border border-[#0F5132]/20 space-y-3">
                  <div className="text-xs font-bold text-[#0F5132] uppercase">
                    English Information
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Event Name English *
                    </label>
                    <input
                      type="text"
                      required
                      value={eventNameEn}
                      onChange={(e) => setEventNameEn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Date English *
                    </label>
                    <input
                      type="text"
                      required
                      value={dateEn}
                      onChange={(e) => setDateEn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Location English *
                    </label>
                    <input
                      type="text"
                      required
                      value={locationEn}
                      onChange={(e) => setLocationEn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Description English *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5DEC9] space-y-2">
                  <div className="text-xs font-bold text-[#1C1917]">
                    Cover Image (কভার ছবি)
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={coverImage}
                      alt="Cover"
                      className="w-16 h-12 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => coverRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-[#CC0000] text-white text-xs font-bold cursor-pointer"
                    >
                      Upload Cover
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5DEC9] space-y-2">
                  <div className="text-xs font-bold text-[#1C1917]">
                    Gallery Images ({galleryImages.length})
                  </div>
                  <button
                    type="button"
                    onClick={() => galleryRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-[#0F5132] text-white text-xs font-bold cursor-pointer"
                  >
                    + Upload Event Gallery Photos
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5DEC9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold border border-[#E5DEC9] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#CC0000] rounded-xl cursor-pointer"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 6. GALLERY MANAGEMENT (`gallery` Collection — FULL CRUD: View, Edit, Delete, Create)
// ============================================================================
// Fields per gallery item:
// - Image
// - Title Bengali (title_bn)
// - Title English (title_en)
// - Description Bengali (description_bn)
// - Description English (description_en)
// - Category
// - Date
// Buttons on each gallery card:
// - View
// - Edit (opens update form)
// - Delete

interface GalleryManagementProps {
  gallery: GalleryRecord[];
  categories: string[];
  onUpdateGallery: (updated: GalleryRecord[]) => Promise<void>;
  onUpdateCategories: (updated: string[]) => void;
  notifySaved: (msg: string) => void;
}

export const CmsGalleryManagementPanel: React.FC<GalleryManagementProps> = ({
  gallery,
  categories,
  onUpdateGallery,
  onUpdateCategories,
  notifySaved,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সব ছবি');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<string>('নাটক');

  // Create / Edit Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [gImage, setGImage] = useState<string>(
    ORIGINAL_STAGE_PHOTO_OPTIONS[0].url
  );
  const [gTitleBn, setGTitleBn] = useState('');
  const [gTitleEn, setGTitleEn] = useState('');
  const [gDescBn, setGDescBn] = useState('');
  const [gDescEn, setGDescEn] = useState('');
  const [gCategory, setGCategory] = useState<string>('নাটক');
  const [gDate, setGDate] = useState<string>('২০২৫');

  // View Modal State
  const [viewingItem, setViewingItem] = useState<GalleryRecord | null>(null);

  const singleFileRef = useRef<HTMLInputElement | null>(null);
  const multiRef = useRef<HTMLInputElement | null>(null);

  const availableCategories = categories.filter((c) => c !== 'সব ছবি');

  // Open Create Gallery Image Modal
  const openCreateGalleryModal = () => {
    setEditingGalleryId(null);
    setGImage(ORIGINAL_STAGE_PHOTO_OPTIONS[0].url);
    setGTitleBn('');
    setGTitleEn('');
    setGDescBn('');
    setGDescEn('');
    setGCategory(availableCategories[0] || 'নাটক');
    setGDate(new Date().toISOString().slice(0, 10));
    setIsFormModalOpen(true);
  };

  // Open Edit Gallery Image Modal (pre-filled with current item values)
  const openEditGalleryModal = (item: GalleryRecord) => {
    setEditingGalleryId(item.id);
    setGImage(item.image);
    setGTitleBn(item.title_bn || item.title || '');
    setGTitleEn(item.title_en || item.titleEn || item.title || '');
    setGDescBn(item.description_bn || item.description || '');
    setGDescEn(
      item.description_en || item.descriptionEn || item.description || ''
    );
    setGCategory(item.category || availableCategories[0] || 'নাটক');
    setGDate(item.date || '২০২৫');
    setIsFormModalOpen(true);
  };

  const handleSingleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await validateAndOptimizeUploadedImage(file);
    setGImage(res.dataUrl);
  };

  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gImage || !gTitleBn.trim()) return;

    const resolvedTitleBn = gTitleBn.trim();
    const resolvedTitleEn = gTitleEn.trim() || resolvedTitleBn;
    const resolvedDescBn = gDescBn.trim();
    const resolvedDescEn = gDescEn.trim() || resolvedDescBn;
    const resolvedCatEn =
      GALLERY_CATEGORY_TRANSLATIONS[gCategory] || gCategory;

    if (editingGalleryId) {
      const updated = gallery.map((item) =>
        item.id === editingGalleryId
          ? {
              ...item,
              image: gImage,
              title: resolvedTitleBn,
              title_bn: resolvedTitleBn,
              titleEn: resolvedTitleEn,
              title_en: resolvedTitleEn,
              description: resolvedDescBn,
              description_bn: resolvedDescBn,
              descriptionEn: resolvedDescEn,
              description_en: resolvedDescEn,
              category: gCategory,
              category_en: resolvedCatEn,
              date: gDate.trim() || '২০২৫',
              alt_text: `${resolvedTitleBn} — রাধামাধব সাংস্কৃতিক জোট`,
            }
          : item
      );
      await onUpdateGallery(updated);
      notifySaved('Gallery item updated in `gallery` collection!');
    } else {
      const newItem: GalleryRecord = {
        id: `gal-${Date.now()}`,
        image: gImage,
        title: resolvedTitleBn,
        title_bn: resolvedTitleBn,
        titleEn: resolvedTitleEn,
        title_en: resolvedTitleEn,
        description: resolvedDescBn,
        description_bn: resolvedDescBn,
        descriptionEn: resolvedDescEn,
        description_en: resolvedDescEn,
        category: gCategory,
        category_en: resolvedCatEn,
        date: gDate.trim() || '২০২৫',
        seo_filename: `radhamadhob-gallery-${Date.now()}.jpg`,
        alt_text: `${resolvedTitleBn} — রাধামাধব সাংস্কৃতিক জোট`,
        aspectHint: 'wide',
      };
      await onUpdateGallery([newItem, ...gallery]);
      notifySaved('New gallery image created in `gallery` collection!');
    }
    setIsFormModalOpen(false);
  };

  const handleMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const added: GalleryRecord[] = [];
    const catEn =
      GALLERY_CATEGORY_TRANSLATIONS[uploadCategory] || uploadCategory;
    for (let i = 0; i < files.length; i++) {
      const res = await validateAndOptimizeUploadedImage(files[i]);
      const base = files[i].name.replace(/\.[^/.]+$/, '');
      const titleBn = `রাধামাধব সাংস্কৃতিক জোট — ${uploadCategory} (${base})`;
      const titleEn = `Radhamadhob Cultural Alliance — ${catEn} (${base})`;
      const descBn = `${uploadCategory} পর্বের আসল মঞ্চ আলোকচিত্র (${files[i].name})।`;
      const descEn = `Authentic stage photograph from ${catEn} performance (${files[i].name}).`;
      added.push({
        id: `gal-${Date.now()}-${i}`,
        image: res.dataUrl,
        title: titleBn,
        title_bn: titleBn,
        titleEn: titleEn,
        title_en: titleEn,
        category: uploadCategory,
        category_en: catEn,
        description: descBn,
        description_bn: descBn,
        descriptionEn: descEn,
        description_en: descEn,
        date: new Date().toISOString().slice(0, 10),
        seo_filename: files[i].name.toLowerCase().replace(/\s+/g, '-'),
        alt_text: titleBn,
      });
    }
    if (added.length > 0) {
      await onUpdateGallery([...added, ...gallery]);
      notifySaved(
        `${added.length} original photos uploaded to \`gallery\` collection!`
      );
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    onUpdateCategories([...categories, trimmed]);
    setNewCategoryName('');
    notifySaved(`New category "${trimmed}" created!`);
  };

  const filtered =
    selectedCategory === 'সব ছবি'
      ? gallery
      : gallery.filter((g) => g.category === selectedCategory);

  return (
    <div className="space-y-6">
      <input
        ref={singleFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSingleImageUpload}
      />
      <input
        ref={multiRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleMultiUpload}
      />

      {/* Header with Create Gallery Image + Bulk Upload */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5DEC9] shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#CC0000] uppercase">
            Firestore Collection: gallery · Full CRUD (Create · View · Edit · Delete)
          </span>
          <h2 className="text-2xl font-bold text-[#1C1917] font-display-bn mt-0.5">
            ৬. ফটো গ্যালারি ব্যবস্থাপনা (Gallery Management — Full CRUD)
          </h2>
          <p className="text-xs text-[#57534E]">
            Fields: Image · Title Bengali · Title English · Description Bengali · Description English · Category · Date
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Primary Create Gallery Image Button */}
          <button
            type="button"
            onClick={openCreateGalleryModal}
            className="px-5 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#FDE68A]" />
            <span>নতুন ছবি যুক্ত করুন (Create Gallery Image)</span>
          </button>

          {/* Secondary Multi-Upload Shortcut */}
          <div className="flex items-center gap-2">
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="px-3 py-2.5 text-xs font-bold bg-[#FAF8F5] border border-[#E5DEC9] rounded-xl"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  Batch: {cat}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => multiRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-[#0F5132] hover:bg-[#0B3D25] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>Multi Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Creator & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5DEC9] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#CC0000] text-white border-[#D4AF37]'
                  : 'bg-[#FAF8F5] text-[#1C1917] border-[#E5DEC9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <form onSubmit={handleCreateCategory} className="flex items-center gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="নতুন ক্যাটাগরি নাম..."
            className="px-3 py-1.5 text-xs border border-[#E5DEC9] rounded-lg"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-lg bg-[#0F5132] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Create Category</span>
          </button>
        </form>
      </div>

      {/* Gallery Grid with View, Edit, Delete Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#E5DEC9] overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div
                className="relative aspect-[16/10] bg-black cursor-pointer group"
                onClick={() => setViewingItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.alt_text || item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-black/75 text-[#FDE68A] text-[10px] font-bold">
                  {item.category}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-mono-code">
                  {item.date}
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <div className="text-sm font-bold text-[#1C1917] font-display-bn line-clamp-1">
                  {item.title_bn || item.title}
                </div>
                <div className="text-xs font-semibold text-[#0F5132] line-clamp-1">
                  EN: {item.title_en || item.titleEn || '—'}
                </div>
                <div className="text-[11px] text-[#57534E] line-clamp-2">
                  {item.description_bn || item.description}
                </div>
              </div>
            </div>

            {/* Action Bar: View | Edit | Delete */}
            <div className="px-3.5 py-2.5 bg-[#FAF8F5] border-t border-[#E5DEC9] flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => setViewingItem(item)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-[#0F5132] text-[#1C1917] hover:text-white border border-[#E5DEC9] text-xs font-bold inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>

              <button
                type="button"
                onClick={() => openEditGalleryModal(item)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-[#CC0000] text-[#1C1917] hover:text-white border border-[#E5DEC9] text-xs font-bold inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await onUpdateGallery(
                    gallery.filter((g) => g.id !== item.id)
                  );
                  notifySaved('Image deleted from `gallery` collection.');
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-red-50 hover:bg-[#CC0000] text-[#CC0000] hover:text-white text-xs font-bold inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =================================================================== */}
      {/* VIEW GALLERY IMAGE MODAL                                            */}
      {/* =================================================================== */}
      {viewingItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setViewingItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden border-2 border-[#D4AF37] shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-black">
              <img
                src={viewingItem.image}
                alt={viewingItem.title}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="px-3 py-1 rounded-lg bg-[#CC0000] text-white">
                  {viewingItem.category}
                </span>
                <span className="font-mono-code text-[#0F5132]">
                  Date: {viewingItem.date}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-1">
                  <div className="text-[11px] font-bold text-[#CC0000]">
                    বাংলা তথ্য (Bengali)
                  </div>
                  <div className="text-base font-bold text-[#1C1917] font-display-bn">
                    {viewingItem.title_bn || viewingItem.title}
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {viewingItem.description_bn || viewingItem.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F0FDF4]/60 border border-[#0F5132]/20 space-y-1">
                  <div className="text-[11px] font-bold text-[#0F5132]">
                    English Information
                  </div>
                  <div className="text-base font-bold text-[#1C1917]">
                    {viewingItem.title_en ||
                      viewingItem.titleEn ||
                      viewingItem.title}
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {viewingItem.description_en ||
                      viewingItem.descriptionEn ||
                      viewingItem.description}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#E5DEC9]">
                <button
                  type="button"
                  onClick={() => {
                    const itemToEdit = viewingItem;
                    setViewingItem(null);
                    openEditGalleryModal(itemToEdit);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#CC0000] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit This Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingItem(null)}
                  className="px-4 py-2 rounded-xl border border-[#E5DEC9] text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* CREATE / EDIT GALLERY IMAGE MODAL                                   */}
      {/* =================================================================== */}
      {isFormModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsFormModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 my-auto border-2 border-[#D4AF37]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-3">
              <div>
                <span className="text-[11px] font-bold text-[#CC0000] uppercase">
                  Firestore Collection: gallery
                </span>
                <h3 className="text-xl font-bold text-[#1C1917] font-display-bn">
                  {editingGalleryId
                    ? 'গ্যালারির ছবি সম্পাদনা (Edit Gallery Image)'
                    : 'নতুন গ্যালারি ছবি সংযোজন (Create Gallery Image)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-4">
              {/* Image Preview & Upload */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={gImage}
                    alt="Gallery Preview"
                    className="w-24 h-16 object-cover rounded-xl border border-[#D4AF37]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#1C1917]">
                      Gallery Image (ছবি) *
                    </div>
                    <div className="text-[11px] text-[#57534E]">
                      Upload a photo or choose from existing stage photographs
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => singleFileRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-[#CC0000] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
              </div>

              {/* Bilingual Title & Description Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bengali Fields */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-3">
                  <div className="text-xs font-bold text-[#CC0000] uppercase">
                    বাংলা তথ্য (Bengali)
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Title Bengali (শিরোনাম বাংলা) *
                    </label>
                    <input
                      type="text"
                      required
                      value={gTitleBn}
                      onChange={(e) => setGTitleBn(e.target.value)}
                      placeholder="ছবির বাংলা শিরোনাম..."
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Description Bengali (বিবরণ বাংলা) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={gDescBn}
                      onChange={(e) => setGDescBn(e.target.value)}
                      placeholder="ছবির সংক্ষিপ্ত বাংলা বিবরণ..."
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                </div>

                {/* English Fields */}
                <div className="p-4 rounded-2xl bg-[#F0FDF4]/60 border border-[#0F5132]/20 space-y-3">
                  <div className="text-xs font-bold text-[#0F5132] uppercase">
                    English Information
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Title English *
                    </label>
                    <input
                      type="text"
                      required
                      value={gTitleEn}
                      onChange={(e) => setGTitleEn(e.target.value)}
                      placeholder="Gallery Title in English..."
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Description English *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={gDescEn}
                      onChange={(e) => setGDescEn(e.target.value)}
                      placeholder="Gallery Description in English..."
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] mb-1">
                    Category (ক্যাটাগরি) *
                  </label>
                  <select
                    value={gCategory}
                    onChange={(e) => setGCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E5DEC9] rounded-xl bg-white"
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1917] mb-1">
                    Date (তারিখ / সাল) *
                  </label>
                  <input
                    type="text"
                    required
                    value={gDate}
                    onChange={(e) => setGDate(e.target.value)}
                    placeholder="২০২৫ / 2025-10-15"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E5DEC9] rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5DEC9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold border border-[#E5DEC9] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#CC0000] hover:bg-[#990000] rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>
                    {editingGalleryId
                      ? 'Update Gallery Image'
                      : 'Create Gallery Image'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 7. YOUTUBE VIDEO MANAGEMENT (`videos` Collection — Bilingual BN + EN)
// ============================================================================

interface VideosManagementProps {
  videos: VideoRecord[];
  onUpdateVideos: (updated: VideoRecord[]) => Promise<void>;
  notifySaved: (msg: string) => void;
}

export const CmsVideosManagementPanel: React.FC<VideosManagementProps> = ({
  videos,
  onUpdateVideos,
  notifySaved,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingVideo, setViewingVideo] = useState<VideoRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [thumbnail, setThumbnail] = useState(
    ORIGINAL_STAGE_PHOTO_OPTIONS[0].url
  );
  const thumbRef = useRef<HTMLInputElement | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setVideoUrl('https://youtube.com/@joyradhe1995?si=M9TPUzbZfpAq9cw9');
    setTitleBn('');
    setTitleEn('');
    setDescriptionBn('');
    setDescriptionEn('');
    setThumbnail(ORIGINAL_STAGE_PHOTO_OPTIONS[0].url);
    setIsModalOpen(true);
  };

  const openEdit = (v: VideoRecord) => {
    setEditingId(v.id);
    setVideoUrl(v.youtube_link);
    setTitleBn(v.title_bn || v.title || '');
    setTitleEn(v.title_en || v.titleEn || v.title || '');
    setDescriptionBn(v.description_bn || v.description || '');
    setDescriptionEn(
      v.description_en || v.descriptionEn || v.description || ''
    );
    setThumbnail(v.thumbnail);
    setIsModalOpen(true);
  };

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await validateAndOptimizeUploadedImage(file);
    setThumbnail(res.dataUrl);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn.trim() || !videoUrl.trim()) return;
    const ytId = extractYouTubeId(videoUrl.trim());
    const finalThumb =
      thumbnail ||
      (ytId
        ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        : ORIGINAL_STAGE_PHOTO_OPTIONS[0].url);

    const resolvedTitleBn = titleBn.trim();
    const resolvedTitleEn = titleEn.trim() || resolvedTitleBn;
    const resolvedDescBn = descriptionBn.trim();
    const resolvedDescEn = descriptionEn.trim() || resolvedDescBn;

    if (editingId) {
      const updated = videos.map((v) =>
        v.id === editingId
          ? {
              ...v,
              youtube_link: videoUrl.trim(),
              title: resolvedTitleBn,
              title_bn: resolvedTitleBn,
              titleEn: resolvedTitleEn,
              title_en: resolvedTitleEn,
              description: resolvedDescBn,
              description_bn: resolvedDescBn,
              descriptionEn: resolvedDescEn,
              description_en: resolvedDescEn,
              thumbnail: finalThumb,
            }
          : v
      );
      await onUpdateVideos(updated);
      notifySaved('Video updated in `videos` collection!');
    } else {
      const newVid: VideoRecord = {
        id: `video-${Date.now()}`,
        youtube_link: videoUrl.trim(),
        title: resolvedTitleBn,
        title_bn: resolvedTitleBn,
        titleEn: resolvedTitleEn,
        title_en: resolvedTitleEn,
        description: resolvedDescBn,
        description_bn: resolvedDescBn,
        descriptionEn: resolvedDescEn,
        description_en: resolvedDescEn,
        thumbnail: finalThumb,
        created_date: new Date().toISOString().slice(0, 10),
      };
      await onUpdateVideos([newVid, ...videos]);
      notifySaved('Video added to `videos` collection!');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <input
        ref={thumbRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleThumbUpload}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5DEC9] shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#CC0000] uppercase">
            Firestore Collection: videos (Bilingual: বাংলা + English)
          </span>
          <h2 className="text-2xl font-bold text-[#1C1917] font-display-bn mt-0.5">
            ৭. ইউটিউব ভিডিও ব্যবস্থাপনা (YouTube Video Management)
          </h2>
          <p className="text-xs text-[#57534E]">
            Fields: Video URL · Title (BN/EN) · Description (BN/EN) · Thumbnail
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="px-5 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#FDE68A]" />
          <span>নতুন ভিডিও যুক্ত করুন (Add Video)</span>
        </button>
      </div>

      {/* Video Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5DEC9]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ভিডিওর শিরোনাম বা বিবরণ দিয়ে খুঁজুন (Search videos by Bengali/English title)..."
          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E5DEC9] rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos
          .filter((v) => {
            const q = searchQuery.trim().toLowerCase();
            if (!q) return true;
            return (
              (v.title_bn || v.title || '').toLowerCase().includes(q) ||
              (v.title_en || v.titleEn || '').toLowerCase().includes(q) ||
              (v.description_bn || v.description || '')
                .toLowerCase()
                .includes(q)
            );
          })
          .map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-2xl border border-[#E5DEC9] overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video bg-black">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-bold text-[#1C1917] font-display-bn">
                  {v.title_bn || v.title}
                </h3>
                <div className="text-xs font-semibold text-[#0F5132] line-clamp-1">
                  EN: {v.title_en || v.titleEn || '—'}
                </div>
                <p className="text-xs text-[#57534E] line-clamp-2">
                  {v.description_bn || v.description}
                </p>
              </div>
            </div>
            <div className="px-5 py-3.5 bg-[#FAF8F5] border-t border-[#E5DEC9] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewingVideo(v)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#0F5132] text-[#1C1917] hover:text-white border border-[#E5DEC9] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(v)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#CC0000] text-[#1C1917] hover:text-white border border-[#E5DEC9] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await onUpdateVideos(videos.filter((x) => x.id !== v.id));
                  notifySaved('Video deleted from `videos` collection.');
                }}
                className="px-3 py-1.5 rounded-lg text-[#CC0000] hover:bg-red-50 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Video Details & Preview Modal */}
      {viewingVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setViewingVideo(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden border-2 border-[#D4AF37] shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-black">
              {extractYouTubeId(viewingVideo.youtube_link) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(
                    viewingVideo.youtube_link
                  )}`}
                  title={viewingVideo.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <img
                  src={viewingVideo.thumbnail}
                  alt={viewingVideo.title}
                  className="w-full h-full object-contain"
                />
              )}
              <button
                type="button"
                onClick={() => setViewingVideo(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/75 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-1">
                  <div className="text-[11px] font-bold text-[#CC0000]">
                    বাংলা তথ্য (Bengali)
                  </div>
                  <div className="text-base font-bold text-[#1C1917] font-display-bn">
                    {viewingVideo.title_bn || viewingVideo.title}
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {viewingVideo.description_bn || viewingVideo.description}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F0FDF4]/60 border border-[#0F5132]/20 space-y-1">
                  <div className="text-[11px] font-bold text-[#0F5132]">
                    English Information
                  </div>
                  <div className="text-base font-bold text-[#1C1917]">
                    {viewingVideo.title_en ||
                      viewingVideo.titleEn ||
                      viewingVideo.title}
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {viewingVideo.description_en ||
                      viewingVideo.descriptionEn ||
                      viewingVideo.description}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-[#E5DEC9]">
                <button
                  type="button"
                  onClick={() => {
                    const vid = viewingVideo;
                    setViewingVideo(null);
                    openEdit(vid);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#CC0000] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingVideo(null)}
                  className="px-4 py-2 rounded-xl border border-[#E5DEC9] text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 my-auto border-2 border-[#D4AF37]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-3">
              <h3 className="text-xl font-bold text-[#1C1917] font-display-bn">
                {editingId
                  ? 'ভিডিও সম্পাদনা (Edit Video — বাংলা + English)'
                  : 'নতুন ইউটিউব ভিডিও যুক্ত করুন (Add Video)'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1">
                  Video URL (ইউটিউব লিঙ্ক) *
                </label>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-mono-code border border-[#E5DEC9] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-3">
                  <div className="text-xs font-bold text-[#CC0000] uppercase">
                    বাংলা তথ্য (Bengali)
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Title Bengali (শিরোনাম বাংলা) *
                    </label>
                    <input
                      type="text"
                      required
                      value={titleBn}
                      onChange={(e) => setTitleBn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Description Bengali (বিবরণ বাংলা) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={descriptionBn}
                      onChange={(e) => setDescriptionBn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0FDF4]/60 border border-[#0F5132]/20 space-y-3">
                  <div className="text-xs font-bold text-[#0F5132] uppercase">
                    English Information
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Title English *
                    </label>
                    <input
                      type="text"
                      required
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Description English *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#E5DEC9]">
                <img
                  src={thumbnail}
                  alt="Thumbnail"
                  className="w-20 h-12 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => thumbRef.current?.click()}
                  className="px-3.5 py-2 rounded-lg bg-[#CC0000] text-white text-xs font-bold cursor-pointer"
                >
                  Upload Custom Thumbnail
                </button>
              </div>

              <div className="pt-3 border-t border-[#E5DEC9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold border border-[#E5DEC9] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#CC0000] rounded-xl cursor-pointer"
                >
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 8. SEO MANAGEMENT (`seo` Collection — 7 Pages)
// ============================================================================

interface SeoManagementProps {
  seoPages: SeoPageRecord[];
  onUpdateSeoPages: (updated: SeoPageRecord[]) => Promise<void>;
  notifySaved: (msg: string) => void;
}

export const CmsSeoManagementPanel: React.FC<SeoManagementProps> = ({
  seoPages,
  onUpdateSeoPages,
  notifySaved,
}) => {
  const [selectedPageId, setSelectedPageId] = useState<SeoPageKey>('home');
  const activePage =
    seoPages.find((p) => p.id === selectedPageId) || seoPages[0];

  const [seoTitle, setSeoTitle] = useState(activePage.seo_title);
  const [metaDesc, setMetaDesc] = useState(activePage.meta_description);
  const [keywords, setKeywords] = useState(activePage.keywords);
  const [urlSlug, setUrlSlug] = useState(activePage.url_slug);
  const [ogImage, setOgImage] = useState(activePage.og_image);
  const [schemaData, setSchemaData] = useState(activePage.schema_data);
  const ogFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!activePage) return;
    setSeoTitle(activePage.seo_title);
    setMetaDesc(activePage.meta_description);
    setKeywords(activePage.keywords);
    setUrlSlug(activePage.url_slug);
    setOgImage(activePage.og_image);
    setSchemaData(activePage.schema_data);
  }, [activePage]);

  // Create New SEO Page Modal State
  const [isAddSeoModalOpen, setIsAddSeoModalOpen] = useState(false);
  const [newPageKey, setNewPageKey] = useState('');
  const [newPageNameEn, setNewPageNameEn] = useState('');
  const [newPageNameBn, setNewPageNameBn] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('/');

  const CORE_SEO_KEYS = [
    'home',
    'about',
    'drama',
    'programs',
    'gallery',
    'contact',
    'privacy_policy',
  ];

  const handleSelectPage = (page: SeoPageRecord) => {
    setSelectedPageId(page.id);
    setSeoTitle(page.seo_title);
    setMetaDesc(page.meta_description);
    setKeywords(page.keywords);
    setUrlSlug(page.url_slug);
    setOgImage(page.og_image);
    setSchemaData(page.schema_data);
  };

  const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await validateAndOptimizeUploadedImage(file);
    setOgImage(res.dataUrl);
  };

  const handleCreateSeoPage = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId =
      newPageKey
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_') || `page_${Date.now()}`;
    if (seoPages.some((p) => p.id === cleanId)) {
      notifySaved(`SEO Page key "${cleanId}" already exists!`);
      return;
    }
    const createdPage: SeoPageRecord = {
      id: cleanId,
      page_name: newPageNameEn.trim() || cleanId,
      page_name_bn: newPageNameBn.trim() || newPageNameEn.trim() || cleanId,
      seo_title: `${newPageNameBn.trim() || newPageNameEn.trim()} | রাধামাধব সাংস্কৃতিক জোট`,
      meta_description: `${newPageNameBn.trim() || newPageNameEn.trim()} — রাধামাধব সাংস্কৃতিক জোটের দাপ্তরিক ওয়েব পেজ।`,
      keywords: 'রাধামাধব সাংস্কৃতিক জোট, Radhamadhob Cultural Alliance',
      url_slug: newPageSlug.trim().startsWith('/')
        ? newPageSlug.trim()
        : `/${newPageSlug.trim()}`,
      og_image: ORIGINAL_STAGE_PHOTO_OPTIONS[0].url,
      schema_data: JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: newPageNameEn.trim() || cleanId,
        },
        null,
        2
      ),
      updated_date: new Date().toISOString().slice(0, 10),
    };
    const updatedList = [...seoPages, createdPage];
    await onUpdateSeoPages(updatedList);
    handleSelectPage(createdPage);
    setIsAddSeoModalOpen(false);
    setNewPageKey('');
    setNewPageNameEn('');
    setNewPageNameBn('');
    setNewPageSlug('/');
    notifySaved(`New SEO page "${createdPage.page_name}" created!`);
  };

  const handleDeleteSeoPage = async (pageId: string) => {
    if (CORE_SEO_KEYS.includes(pageId)) return;
    const remaining = seoPages.filter((p) => p.id !== pageId);
    await onUpdateSeoPages(remaining);
    if (remaining.length > 0) {
      handleSelectPage(remaining[0]);
    }
    notifySaved(`Custom SEO page "${pageId}" deleted.`);
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRecord: SeoPageRecord = {
      ...activePage,
      seo_title: seoTitle.trim(),
      meta_description: metaDesc.trim(),
      keywords: keywords.trim(),
      url_slug: urlSlug.trim(),
      og_image: ogImage,
      schema_data: schemaData.trim(),
      updated_date: new Date().toISOString().slice(0, 10),
    };
    const updatedList = seoPages.map((p) =>
      p.id === selectedPageId ? updatedRecord : p
    );
    await onUpdateSeoPages(updatedList);
    applyDynamicSeoToDocumentHead(updatedRecord);
    notifySaved(
      `SEO metadata & JSON-LD Schema saved for "${activePage.page_name}" in \`seo\` collection!`
    );
  };

  return (
    <div className="space-y-6">
      <input
        ref={ogFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleOgUpload}
      />

      <div className="bg-white p-6 rounded-2xl border border-[#E5DEC9] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#0F5132] uppercase">
            Firestore Collection: seo_settings · Complete CRUD + Live Head Sync
          </span>
          <h2 className="text-2xl font-bold text-[#1C1917] font-display-bn mt-0.5">
            ৮. সম্পূর্ণ এসইও কন্ট্রোল প্যানেল (SEO Management — All Pages)
          </h2>
          <p className="text-xs text-[#57534E]">
            Create, Read/Preview, Update & Delete SEO Metadata, OpenGraph & JSON-LD Schema
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddSeoModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#FDE68A]" />
          <span>নতুন এসইও পেজ যুক্ত করুন (Add SEO Page)</span>
        </button>
      </div>

      {/* Page Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-2xl border border-[#E5DEC9]">
        {seoPages.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelectPage(p)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
              selectedPageId === p.id
                ? 'bg-[#CC0000] text-white border-[#D4AF37] shadow-sm'
                : 'bg-[#FAF8F5] text-[#1C1917] border-[#E5DEC9] hover:border-[#CC0000]'
            }`}
          >
            {p.page_name} ({p.page_name_bn.split(' ')[0]})
          </button>
        ))}
      </div>

      {/* SEO Editor Form + Google Search Snippet Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleSaveSeo}
          className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#E5DEC9] space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-3">
            <h3 className="text-lg font-bold text-[#1C1917] font-display-bn">
              Editing SEO: {activePage.page_name_bn}
            </h3>
            <span className="text-xs font-mono-code text-[#0F5132] font-bold">
              docId: seo/{activePage.id}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1917] mb-1">
              SEO Title (টাইটেল ট্যাগ) *
            </label>
            <input
              type="text"
              required
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-[#E5DEC9] rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1917] mb-1">
              Meta Description (মেটা বিবরণ) *
            </label>
            <textarea
              rows={3}
              required
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-[#E5DEC9] rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1917] mb-1">
                Keywords (কীওয়ার্ডসমূহ) *
              </label>
              <input
                type="text"
                required
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-[#E5DEC9] rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1C1917] mb-1">
                URL Slug (ইউআরএল স্লাগ) *
              </label>
              <input
                type="text"
                required
                value={urlSlug}
                onChange={(e) => setUrlSlug(e.target.value)}
                className="w-full px-3.5 py-2 text-sm font-mono-code border border-[#E5DEC9] rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1C1917]">
              OG Image (সোশ্যাল শেয়ার ছবি — Original Photo Only)
            </label>
            <div className="flex items-center gap-4 p-3 bg-[#FAF8F5] rounded-xl border border-[#E5DEC9]">
              <img
                src={ogImage}
                alt="OG Preview"
                className="w-24 h-14 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => ogFileRef.current?.click()}
                className="px-3.5 py-2 rounded-lg bg-[#CC0000] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Original OG Image</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1917] mb-1">
              Schema Data (JSON-LD Structured Data) *
            </label>
            <textarea
              rows={6}
              required
              value={schemaData}
              onChange={(e) => setSchemaData(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-mono-code bg-[#1C1917] text-emerald-300 border border-[#E5DEC9] rounded-xl"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            {!CORE_SEO_KEYS.includes(activePage.id) ? (
              <button
                type="button"
                onClick={() => handleDeleteSeoPage(activePage.id)}
                className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#CC0000] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete SEO Page</span>
              </button>
            ) : (
              <span className="text-[11px] text-[#78716C]">
                Core system page (protected from deletion)
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Live SEO ({activePage.page_name})</span>
            </button>
          </div>
        </form>

        {/* Live Google Search & Social Card Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5DEC9] space-y-3">
            <div className="text-xs font-bold text-[#0F5132] uppercase flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>Google Search Engine Snippet Preview</span>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-1">
              <div className="text-xs text-stone-600 font-mono-code truncate">
                https://radhamadhob.org{urlSlug}
              </div>
              <div className="text-base font-bold text-[#1a0dab] font-display-bn line-clamp-2">
                {seoTitle}
              </div>
              <div className="text-xs text-[#4d5156] line-clamp-3">
                {metaDesc}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5DEC9] space-y-3">
            <div className="text-xs font-bold text-[#CC0000] uppercase">
              OpenGraph Social Share Card Preview
            </div>
            <div className="rounded-xl overflow-hidden border border-[#E5DEC9] bg-[#FAF8F5]">
              <div className="aspect-[16/9] bg-black">
                <img
                  src={ogImage}
                  alt="OG Card"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3.5 space-y-1">
                <div className="text-[10px] font-bold uppercase text-stone-500">
                  RADHAMADHOB.ORG
                </div>
                <div className="text-sm font-bold text-[#1C1917] font-display-bn line-clamp-1">
                  {seoTitle}
                </div>
                <div className="text-xs text-[#57534E] line-clamp-2">
                  {metaDesc}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create New SEO Page Modal */}
      {isAddSeoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setIsAddSeoModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 border-2 border-[#D4AF37]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-3">
              <h3 className="text-lg font-bold text-[#1C1917] font-display-bn">
                নতুন এসইও পেজ তৈরি করুন (Create SEO Page Entry)
              </h3>
              <button
                type="button"
                onClick={() => setIsAddSeoModalOpen(false)}
                className="p-1 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSeoPage} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1">
                  Page Key / ID (যেমন: members, videos, events) *
                </label>
                <input
                  type="text"
                  required
                  value={newPageKey}
                  onChange={(e) => setNewPageKey(e.target.value)}
                  placeholder="members"
                  className="w-full px-3.5 py-2 text-sm font-mono-code border border-[#E5DEC9] rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1">
                  Page Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={newPageNameEn}
                  onChange={(e) => setNewPageNameEn(e.target.value)}
                  placeholder="Members Directory"
                  className="w-full px-3.5 py-2 text-sm border border-[#E5DEC9] rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1">
                  পেজের নাম (বাংলা) *
                </label>
                <input
                  type="text"
                  required
                  value={newPageNameBn}
                  onChange={(e) => setNewPageNameBn(e.target.value)}
                  placeholder="সদস্য তালিকা"
                  className="w-full px-3.5 py-2 text-sm border border-[#E5DEC9] rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="/members"
                  className="w-full px-3.5 py-2 text-sm font-mono-code border border-[#E5DEC9] rounded-xl"
                />
              </div>
              <div className="pt-3 border-t border-[#E5DEC9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddSeoModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold border border-[#E5DEC9] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#CC0000] rounded-xl cursor-pointer"
                >
                  Create SEO Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 9. PRIVACY POLICY MANAGEMENT (`privacy_policy` Collection)
// ============================================================================

interface PrivacyPolicyManagementProps {
  privacyDoc: PrivacyPolicyCollectionDoc;
  settings: SiteSettingsRecord;
  onUpdatePrivacyDoc: (updated: PrivacyPolicyCollectionDoc) => Promise<void>;
  onUpdateSettings: (updated: SiteSettingsRecord) => Promise<void>;
  notifySaved: (msg: string) => void;
}

export const CmsPrivacyPolicyManagementPanel: React.FC<
  PrivacyPolicyManagementProps
> = ({
  privacyDoc,
  settings,
  onUpdatePrivacyDoc,
  onUpdateSettings,
  notifySaved,
}) => {
  const [bengaliPolicy, setBengaliPolicy] = useState(privacyDoc.bengali_policy);
  const [englishPolicy, setEnglishPolicy] = useState(privacyDoc.english_policy);
  const [sections, setSections] = useState(settings.privacy_policy_sections);

  useEffect(() => {
    setBengaliPolicy(privacyDoc.bengali_policy);
    setEnglishPolicy(privacyDoc.english_policy);
  }, [privacyDoc]);

  useEffect(() => {
    setSections(settings.privacy_policy_sections);
  }, [settings.privacy_policy_sections]);

  const handleSavePrivacy = async (e: React.FormEvent) => {
    e.preventDefault();
    const nowDate = new Date().toISOString().slice(0, 10);
    await onUpdatePrivacyDoc({
      ...privacyDoc,
      bengali_policy: bengaliPolicy.trim(),
      english_policy: englishPolicy.trim(),
      updated_date: nowDate,
    });
    await onUpdateSettings({
      ...settings,
      privacy_policy_sections: sections,
      updated_date: nowDate,
    });
    notifySaved(
      'Bengali & English Privacy Policy saved to `privacy_policy` collection!'
    );
  };

  return (
    <form onSubmit={handleSavePrivacy} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5DEC9] shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#CC0000] uppercase">
            Firestore Collection: privacy_policy
          </span>
          <h2 className="text-2xl font-bold text-[#1C1917] font-display-bn mt-0.5">
            ৯. গোপনীয়তা নীতিমালা ব্যবস্থাপনা (Privacy Policy Management)
          </h2>
          <p className="text-xs text-[#57534E]">
            Edit Bengali Privacy Policy & English Privacy Policy
          </p>
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>গোপনীয়তা নীতি সংরক্ষণ করুন (Save Privacy Policy)</span>
        </button>
      </div>

      {/* Main Bengali & English Policy Document Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E5DEC9] space-y-3">
          <label className="block text-sm font-bold text-[#CC0000] font-display-bn">
            বাংলা গোপনীয়তা নীতিমালা (Bengali Privacy Policy) *
          </label>
          <textarea
            rows={12}
            required
            value={bengaliPolicy}
            onChange={(e) => setBengaliPolicy(e.target.value)}
            className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#E5DEC9] rounded-xl leading-relaxed"
          />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5DEC9] space-y-3">
          <label className="block text-sm font-bold text-[#0F5132]">
            English Privacy Policy *
          </label>
          <textarea
            rows={12}
            required
            value={englishPolicy}
            onChange={(e) => setEnglishPolicy(e.target.value)}
            className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#E5DEC9] rounded-xl leading-relaxed"
          />
        </div>
      </div>

      {/* Structured Bilingual Clauses Editor (Full CRUD: Create, Read, Update, Delete) */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5DEC9] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DEC9] pb-3">
          <div>
            <h3 className="text-lg font-bold text-[#1C1917] font-display-bn">
              ধারাভিত্তিক অনুচ্ছেদ ব্যবস্থাপনা (Bilingual Policy Clauses — Create, Edit, Delete)
            </h3>
            <p className="text-xs text-[#57534E]">
              Total Clauses: {sections.length} · Add, edit, or delete policy clauses in both Bengali and English
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const nextNum = sections.length + 1;
              setSections([
                ...sections,
                {
                  id: `clause-${Date.now()}`,
                  numberBn: `${nextNum}.`,
                  numberEn: `${String(nextNum).padStart(2, '0')}.`,
                  titleBn: 'নতুন নীতিমালা ধারা',
                  titleEn: 'New Policy Clause',
                  contentBn: 'এখানে বাংলা বিবরণ লিখুন...',
                  contentEn: 'Write English clause description here...',
                },
              ]);
            }}
            className="px-4 py-2 rounded-xl bg-[#0F5132] hover:bg-[#0a3a23] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন ধারা যুক্ত করুন (Add Clause)</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((sec, idx) => (
            <div
              key={sec.id}
              className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={sec.numberBn}
                    onChange={(e) => {
                      const next = [...sections];
                      next[idx] = { ...next[idx], numberBn: e.target.value };
                      setSections(next);
                    }}
                    className="w-14 px-2 py-1 text-xs font-bold text-[#CC0000] bg-white border border-[#E5DEC9] rounded-lg"
                  />
                  <input
                    type="text"
                    value={sec.titleBn}
                    onChange={(e) => {
                      const next = [...sections];
                      next[idx] = { ...next[idx], titleBn: e.target.value };
                      setSections(next);
                    }}
                    placeholder="বাংলা শিরোনাম"
                    className="flex-1 px-2.5 py-1 text-xs font-bold text-[#1C1917] bg-white border border-[#E5DEC9] rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSections(sections.filter((_, i) => i !== idx));
                  }}
                  className="p-1.5 rounded-lg text-[#CC0000] hover:bg-red-50 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  title="Delete Clause"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={sec.titleEn}
                onChange={(e) => {
                  const next = [...sections];
                  next[idx] = { ...next[idx], titleEn: e.target.value };
                  setSections(next);
                }}
                placeholder="English Clause Title"
                className="w-full px-2.5 py-1 text-xs font-semibold text-[#0F5132] bg-white border border-[#E5DEC9] rounded-lg"
              />
              <textarea
                rows={2}
                value={sec.contentBn}
                onChange={(e) => {
                  const next = [...sections];
                  next[idx] = { ...next[idx], contentBn: e.target.value };
                  setSections(next);
                }}
                placeholder="বাংলা অনুচ্ছেদ..."
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5DEC9] rounded-lg"
              />
              <textarea
                rows={2}
                value={sec.contentEn}
                onChange={(e) => {
                  const next = [...sections];
                  next[idx] = { ...next[idx], contentEn: e.target.value };
                  setSections(next);
                }}
                placeholder="English clause content..."
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5DEC9] rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
