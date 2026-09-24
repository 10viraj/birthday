import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, ChevronLeft, ChevronRight, X, Heart, Plus, Sparkles, Upload, Trash2, CheckCircle2, Loader2, Grid, ArrowLeft } from 'lucide-react';
import { birthdayService } from '../../services/birthdayService';
import { getFullImageUrl as resolveFullImageUrl } from '../../utils/imageUrl';

const DEFAULT_POLAROID_PHOTOS = [
  { id: 1, url: "/images/1.jpg", caption: "Our Beautiful Memories ❤️", rotation: -3 },
  { id: 2, url: "/images/2.jpg", caption: "That Smile 😊", rotation: 2 },
  { id: 3, url: "/images/3.jpg", caption: "One of My Favorite Moments", rotation: -2 },
  { id: 4, url: "/images/4.jpg", caption: "Looking at you, my heart melts 🥺❤️", rotation: 3 },
  { id: 5, url: "/images/5.jpg", caption: "This pic is everything 😍🔥", rotation: -4 },
  { id: 6, url: "/images/6.jpg", caption: "Forever a Special Memory 💖", rotation: 2 },
  { id: 7, url: "/images/7.jpg", caption: "Sweeter Than Cake 🎂", rotation: -1 },
  { id: 8, url: "/images/8.jpg", caption: "Pure Happiness 💖", rotation: 4 },
  { id: 9, url: "/images/9.jpg", caption: "Unforgettable Moments ✨", rotation: -2 },
  { id: 10, url: "/images/10.jpg", caption: "Endless Laughter 😄", rotation: 3 },
  { id: 11, url: "/images/1700148476352.jpg", caption: "Precious Moments 💕", rotation: -3 },
  { id: 12, url: "/images/1700148476374.jpg", caption: "Cherished Smiles 🌸", rotation: 1 },
  { id: 13, url: "/images/1700148476446.jpg", caption: "Golden Days ☀️", rotation: -4 },
  { id: 14, url: "/images/1700148476514.jpg", caption: "Making Magic Together ✨", rotation: 3 },
  { id: 15, url: "/images/1700148476534.jpg", caption: "Joyful Heart 💫", rotation: -1 },
  { id: 16, url: "/images/1700148476590.jpg", caption: "Best Times with You 🎈", rotation: 2 },
  { id: 17, url: "/images/1700148476633.jpg", caption: "Sweetest Soul 🍰", rotation: -3 },
  { id: 18, url: "/images/1700148476713.jpg", caption: "Shining Bright 🌟", rotation: 2 },
  { id: 19, url: "/images/1700148477093.jpg", caption: "Always Smiling 😊", rotation: -2 },
  { id: 20, url: "/images/1700148477143.jpg", caption: "So Much Love ❤️", rotation: 3 },
  { id: 21, url: "/images/1700148477239.jpg", caption: "Timeless Joy 🥳", rotation: -4 },
  { id: 22, url: "/images/IMG_4922.jpeg", caption: "Warm Memories ☕", rotation: 2 },
  { id: 23, url: "/images/IMG_4924.jpeg", caption: "Beautiful Day 🌈", rotation: -1 },
  { id: 24, url: "/images/IMG_4929.jpeg", caption: "Laughter & Love 💕", rotation: 4 },
  { id: 25, url: "/images/IMG_20220718_142934.jpg", caption: "Special Celebration 🎉", rotation: -2 },
  { id: 26, url: "/images/IMG_20220727_164503.jpg", caption: "Heart Full of Joy 💖", rotation: 3 },
  { id: 27, url: "/images/IMG_20220727_164509.jpg", caption: "Memories We Treasure 💎", rotation: -3 },
  { id: 28, url: "/images/IMG_20220727_164804.jpg", caption: "Brightest Smile 🌟", rotation: 1 },
  { id: 29, url: "/images/IMG_20231110_134811.jpg", caption: "Happy Vibes Only 🎈", rotation: -4 },
  { id: 30, url: "/images/IMG_20231110_135021.jpg", caption: "Picture Perfect 📸", rotation: 3 },
  { id: 31, url: "/images/IMG_20231110_143125.jpg", caption: "Love & Warmth 🥰", rotation: -1 },
  { id: 32, url: "/images/IMG_20231110_143127.jpg", caption: "Little Moments, Big Joy 💫", rotation: 2 },
  { id: 33, url: "/images/IMG_20231110_143619_1.jpg", caption: "Unconditional Love 🤍", rotation: -3 },
  { id: 34, url: "/images/IMG_20231110_143619_2.jpg", caption: "Everyday Magic ✨", rotation: 2 },
  { id: 35, url: "/images/IMG_20231110_143620.jpg", caption: "Treasured Moments 🌷", rotation: -2 },
  { id: 36, url: "/images/IMG_20231110_143629.jpg", caption: "Endless Smiles 😊", rotation: 3 },
  { id: 37, url: "/images/IMG_20231110_143630.jpg", caption: "Days Like These ☀️", rotation: -4 },
  { id: 38, url: "/images/IMG_20240119_092835.jpg", caption: "Forever Grateful 🙏", rotation: 2 },
  { id: 39, url: "/images/IMG_20240119_092841.jpg", caption: "Wonderful Times 🌸", rotation: -1 },
  { id: 40, url: "/images/IMG_20240119_092849.jpg", caption: "Capturing Joy 📸", rotation: 4 },
  { id: 41, url: "/images/IMG_20240119_092857.jpg", caption: "Kindred Spirits 💕", rotation: -2 },
  { id: 42, url: "/images/IMG_20240119_092859.jpg", caption: "Pure Bliss ✨", rotation: 3 },
  { id: 43, url: "/images/IMG_20240119_093002.jpg", caption: "Heartfelt Moments 💖", rotation: -3 },
  { id: 44, url: "/images/IMG_20240119_093004.jpg", caption: "Joy in Every Second ⏰", rotation: 1 },
  { id: 45, url: "/images/IMG20240727141436.heic", caption: "Smiling Through Life 🌼", rotation: -4 },
  { id: 46, url: "/images/IMG20240727152808.heic", caption: "Special Day ✨", rotation: 3 },
  { id: 47, url: "/images/IMG20240727152916.heic", caption: "Together Is Better 🤝", rotation: -1 },
  { id: 48, url: "/images/IMG20240727152922.heic", caption: "Radiant & Happy 💫", rotation: 2 },
  { id: 49, url: "/images/IMG20240727152959.heic", caption: "Unstoppable Joy 🚀", rotation: -3 },
  { id: 50, url: "/images/IMG20240727153008.heic", caption: "Warm Hugs & Smiles 🤗", rotation: 2 },
  { id: 51, url: "/images/IMG20240727153231.heic", caption: "Sweet Simplicity 🧁", rotation: -2 },
  { id: 52, url: "/images/IMG20240727153306.heic", caption: "Sparkle & Shine ✨", rotation: 3 },
  { id: 53, url: "/images/IMG20240727153309.heic", caption: "Celebration Time 🎂", rotation: -4 },
  { id: 54, url: "/images/IMG20240727153332.heic", caption: "Full of Sunshine ☀️", rotation: 2 },
  { id: 55, url: "/images/IMG20240727153336.heic", caption: "Moments to Remember 💭", rotation: -1 },
  { id: 56, url: "/images/IMG20240727153357.heic", caption: "Forever Young & Free 🎈", rotation: 4 },
  { id: 57, url: "/images/IMG20240727153359.heic", caption: "Love You Always 💖", rotation: -2 },
  { id: 58, url: "/images/profile.jpeg", caption: "Precious Smile 😊", rotation: 3 },
  { id: 59, url: "/images/Snapchat-72074918.jpg", caption: "A Day to Remember 🎊", rotation: -3 },
  { id: 60, url: "/images/Snapchat-85828397.jpg", caption: "Heartwarming Memories 🌸", rotation: 1 },
  { id: 61, url: "/images/Snapchat-122192030.jpg", caption: "Endless Happiness 💕", rotation: -4 },
  { id: 62, url: "/images/Snapchat-306342806.jpg", caption: "Pure Sunshine ☀️", rotation: 3 },
  { id: 63, url: "/images/Snapchat-358832379.jpg", caption: "Our Beautiful Memories ❤️", rotation: -1 },
  { id: 64, url: "/images/Snapchat-370509908.jpg", caption: "That Smile 😊", rotation: 2 },
  { id: 65, url: "/images/Snapchat-402364326.jpg", caption: "One of My Favorite Moments", rotation: -3 },
  { id: 66, url: "/images/Snapchat-431716240.jpg", caption: "Looking at you, my heart melts 🥺❤️", rotation: 2 },
  { id: 67, url: "/images/Snapchat-547885936.jpg", caption: "This pic is everything 😍🔥", rotation: -2 },
  { id: 68, url: "/images/Snapchat-704245681.jpg", caption: "Forever a Special Memory 💖", rotation: 3 },
  { id: 69, url: "/images/Snapchat-743543928.jpg", caption: "Sweeter Than Cake 🎂", rotation: -4 },
  { id: 70, url: "/images/Snapchat-750181179.jpg", caption: "Pure Happiness 💖", rotation: 2 },
  { id: 71, url: "/images/Snapchat-757008777.jpg", caption: "Unforgettable Moments ✨", rotation: -1 },
  { id: 72, url: "/images/Snapchat-898117369.jpg", caption: "Endless Laughter 😄", rotation: 4 },
  { id: 73, url: "/images/Snapchat-989788576.jpg", caption: "Precious Moments 💕", rotation: -2 },
  { id: 74, url: "/images/Snapchat-1146637754.jpg", caption: "Cherished Smiles 🌸", rotation: 3 },
  { id: 75, url: "/images/Snapchat-1149813013.jpg", caption: "Golden Days ☀️", rotation: -3 },
  { id: 76, url: "/images/Snapchat-1211637326.jpg", caption: "Making Magic Together ✨", rotation: 1 },
  { id: 77, url: "/images/Snapchat-1228911219.jpg", caption: "Joyful Heart 💫", rotation: -4 },
  { id: 78, url: "/images/Snapchat-1247920870.jpg", caption: "Best Times with You 🎈", rotation: 3 },
  { id: 79, url: "/images/Snapchat-1295452146.jpg", caption: "Sweetest Soul 🍰", rotation: -1 },
  { id: 80, url: "/images/Snapchat-1317015554.jpg", caption: "Shining Bright 🌟", rotation: 2 },
  { id: 81, url: "/images/Snapchat-1571917818.jpg", caption: "Always Smiling 😊", rotation: -3 },
  { id: 82, url: "/images/Snapchat-1637636036.jpg", caption: "So Much Love ❤️", rotation: 2 },
  { id: 83, url: "/images/Snapchat-1660305473.jpg", caption: "Timeless Joy 🥳", rotation: -2 },
  { id: 84, url: "/images/Snapchat-1779455950.jpg", caption: "Warm Memories ☕", rotation: 3 },
  { id: 85, url: "/images/Snapchat-1810730714.jpg", caption: "Beautiful Day 🌈", rotation: -4 },
  { id: 86, url: "/images/Snapchat-1843799306.jpg", caption: "Laughter & Love 💕", rotation: 2 },
  { id: 87, url: "/images/Snapchat-1879023619.jpg", caption: "Special Celebration 🎉", rotation: -1 },
  { id: 88, url: "/images/Snapchat-1900934587.jpg", caption: "Heart Full of Joy 💖", rotation: 4 },
  { id: 89, url: "/images/Snapchat-1902346433.jpg", caption: "Memories We Treasure 💎", rotation: -2 },
  { id: 90, url: "/images/Snapchat-1916089789.jpg", caption: "Brightest Smile 🌟", rotation: 3 },
  { id: 91, url: "/images/Snapchat-1949455448.jpg", caption: "Happy Vibes Only 🎈", rotation: -3 },
  { id: 92, url: "/images/Snapchat-1957274460.jpg", caption: "Picture Perfect 📸", rotation: 1 },
  { id: 93, url: "/images/Snapchat-2026317803.jpg", caption: "Love & Warmth 🥰", rotation: -4 },
  { id: 94, url: "/images/Snapchat-2077691120.jpg", caption: "Little Moments, Big Joy 💫", rotation: 3 },
  { id: 95, url: "/images/Snapchat-2132501624.jpg", caption: "Unconditional Love 🤍", rotation: -1 },
  { id: 96, url: "/images/Snapchat-2139083842.jpg", caption: "Everyday Magic ✨", rotation: 2 },
  { id: 97, url: "/images/WhatsApp Image 2026-09-22 at 2.00.27 AM.jpeg", caption: "Treasured Moments 🌷", rotation: -3 },
  { id: 98, url: "/images/WhatsApp Image 2026-09-22 at 2.00.28 AM (1).jpeg", caption: "Endless Smiles 😊", rotation: 2 },
  { id: 99, url: "/images/WhatsApp Image 2026-09-22 at 2.00.28 AM.jpeg", caption: "Days Like These ☀️", rotation: -2 },
  { id: 100, url: "/images/WhatsApp Image 2026-09-22 at 2.00.29 AM (1).jpeg", caption: "Forever Grateful 🙏", rotation: 3 },
  { id: 101, url: "/images/WhatsApp Image 2026-09-22 at 2.00.29 AM (2).jpeg", caption: "Wonderful Times 🌸", rotation: -4 },
  { id: 102, url: "/images/WhatsApp Image 2026-09-22 at 2.00.29 AM (3).jpeg", caption: "Capturing Joy 📸", rotation: 2 },
  { id: 103, url: "/images/WhatsApp Image 2026-09-22 at 2.00.29 AM.jpeg", caption: "Kindred Spirits 💕", rotation: -1 },
  { id: 104, url: "/images/WhatsApp Image 2026-09-22 at 2.00.30 AM (1).jpeg", caption: "Pure Bliss ✨", rotation: 4 },
  { id: 105, url: "/images/WhatsApp Image 2026-09-22 at 2.00.30 AM.jpeg", caption: "Heartfelt Moments 💖", rotation: -2 },
  { id: 106, url: "/images/WhatsApp Image 2026-09-22 at 2.00.31 AM (1).jpeg", caption: "Joy in Every Second ⏰", rotation: 3 },
  { id: 107, url: "/images/WhatsApp Image 2026-09-22 at 2.00.31 AM (2).jpeg", caption: "Smiling Through Life 🌼", rotation: -3 },
  { id: 108, url: "/images/WhatsApp Image 2026-09-22 at 2.00.31 AM.jpeg", caption: "Special Day ✨", rotation: 1 },
  { id: 109, url: "/images/WhatsApp Image 2026-09-22 at 2.00.32 AM (1).jpeg", caption: "Together Is Better 🤝", rotation: -4 },
  { id: 110, url: "/images/WhatsApp Image 2026-09-22 at 2.00.32 AM (2).jpeg", caption: "Radiant & Happy 💫", rotation: 3 },
  { id: 111, url: "/images/WhatsApp Image 2026-09-22 at 2.00.32 AM.jpeg", caption: "Unstoppable Joy 🚀", rotation: -1 },
  { id: 112, url: "/images/WhatsApp Image 2026-09-22 at 2.00.33 AM (1).jpeg", caption: "Warm Hugs & Smiles 🤗", rotation: 2 },
  { id: 113, url: "/images/WhatsApp Image 2026-09-22 at 2.00.33 AM.jpeg", caption: "Sweet Simplicity 🧁", rotation: -3 },
  { id: 114, url: "/images/WhatsApp Image 2026-09-22 at 2.00.34 AM (1).jpeg", caption: "Sparkle & Shine ✨", rotation: 2 },
  { id: 115, url: "/images/WhatsApp Image 2026-09-22 at 2.00.34 AM (2).jpeg", caption: "Celebration Time 🎂", rotation: -2 },
  { id: 116, url: "/images/WhatsApp Image 2026-09-22 at 2.00.34 AM.jpeg", caption: "Full of Sunshine ☀️", rotation: 3 },
  { id: 117, url: "/images/WhatsApp Image 2026-09-22 at 2.00.35 AM (1).jpeg", caption: "Moments to Remember 💭", rotation: -4 },
  { id: 118, url: "/images/WhatsApp Image 2026-09-22 at 2.00.35 AM (2).jpeg", caption: "Forever Young & Free 🎈", rotation: 2 },
  { id: 119, url: "/images/WhatsApp Image 2026-09-22 at 2.00.35 AM.jpeg", caption: "Love You Always 💖", rotation: -1 },
  { id: 120, url: "/images/WhatsApp Image 2026-09-22 at 2.00.36 AM (1).jpeg", caption: "Precious Smile 😊", rotation: 4 },
  { id: 121, url: "/images/WhatsApp Image 2026-09-22 at 2.00.36 AM (2).jpeg", caption: "A Day to Remember 🎊", rotation: -2 },
  { id: 122, url: "/images/WhatsApp Image 2026-09-22 at 2.00.36 AM.jpeg", caption: "Heartwarming Memories 🌸", rotation: 3 },
  { id: 123, url: "/images/WhatsApp Image 2026-09-22 at 2.00.37 AM (1).jpeg", caption: "Endless Happiness 💕", rotation: -3 },
  { id: 124, url: "/images/WhatsApp Image 2026-09-22 at 2.00.37 AM (2).jpeg", caption: "Pure Sunshine ☀️", rotation: 1 },
  { id: 125, url: "/images/WhatsApp Image 2026-09-22 at 2.00.37 AM.jpeg", caption: "Our Beautiful Memories ❤️", rotation: -4 },
  { id: 126, url: "/images/WhatsApp Image 2026-09-22 at 2.00.38 AM (1).jpeg", caption: "That Smile 😊", rotation: 3 },
  { id: 127, url: "/images/WhatsApp Image 2026-09-22 at 2.00.38 AM.jpeg", caption: "One of My Favorite Moments", rotation: -1 },
  { id: 128, url: "/images/WhatsApp Image 2026-09-22 at 2.00.39 AM (1).jpeg", caption: "Looking at you, my heart melts 🥺❤️", rotation: 2 },
  { id: 129, url: "/images/WhatsApp Image 2026-09-22 at 2.00.39 AM (2).jpeg", caption: "This pic is everything 😍🔥", rotation: -3 },
  { id: 130, url: "/images/WhatsApp Image 2026-09-22 at 2.00.39 AM.jpeg", caption: "Forever a Special Memory 💖", rotation: 2 },
  { id: 131, url: "/images/WhatsApp Image 2026-09-22 at 2.00.40 AM (1).jpeg", caption: "Sweeter Than Cake 🎂", rotation: -2 },
  { id: 132, url: "/images/WhatsApp Image 2026-09-22 at 2.00.40 AM (2).jpeg", caption: "Pure Happiness 💖", rotation: 3 },
  { id: 133, url: "/images/WhatsApp Image 2026-09-22 at 2.00.40 AM.jpeg", caption: "Unforgettable Moments ✨", rotation: -4 },
  { id: 134, url: "/images/WhatsApp Image 2026-09-22 at 2.00.41 AM (1).jpeg", caption: "Endless Laughter 😄", rotation: 2 },
  { id: 135, url: "/images/WhatsApp Image 2026-09-22 at 2.00.41 AM.jpeg", caption: "Precious Moments 💕", rotation: -1 },
  { id: 136, url: "/images/WhatsApp Image 2026-09-22 at 2.00.42 AM (1).jpeg", caption: "Cherished Smiles 🌸", rotation: 4 },
  { id: 137, url: "/images/WhatsApp Image 2026-09-22 at 2.00.42 AM (2).jpeg", caption: "Golden Days ☀️", rotation: -2 },
  { id: 138, url: "/images/WhatsApp Image 2026-09-22 at 2.00.42 AM.jpeg", caption: "Making Magic Together ✨", rotation: 3 },
  { id: 139, url: "/images/WhatsApp Image 2026-09-22 at 2.00.43 AM (1).jpeg", caption: "Joyful Heart 💫", rotation: -3 },
  { id: 140, url: "/images/WhatsApp Image 2026-09-22 at 2.00.43 AM.jpeg", caption: "Best Times with You 🎈", rotation: 1 },
  { id: 141, url: "/images/WhatsApp Image 2026-09-22 at 2.00.44 AM (1).jpeg", caption: "Sweetest Soul 🍰", rotation: -4 },
  { id: 142, url: "/images/WhatsApp Image 2026-09-22 at 2.00.44 AM (2).jpeg", caption: "Shining Bright 🌟", rotation: 3 },
  { id: 143, url: "/images/WhatsApp Image 2026-09-22 at 2.00.44 AM.jpeg", caption: "Always Smiling 😊", rotation: -1 },
  { id: 144, url: "/images/WhatsApp Image 2026-09-22 at 2.00.45 AM (1).jpeg", caption: "So Much Love ❤️", rotation: 2 },
  { id: 145, url: "/images/WhatsApp Image 2026-09-22 at 2.00.45 AM (2).jpeg", caption: "Timeless Joy 🥳", rotation: -3 },
  { id: 146, url: "/images/WhatsApp Image 2026-09-22 at 2.00.45 AM.jpeg", caption: "Warm Memories ☕", rotation: 2 },
  { id: 147, url: "/images/WhatsApp Image 2026-09-22 at 2.00.46 AM.jpeg", caption: "Beautiful Day 🌈", rotation: -2 },
  { id: 148, url: "/images/WhatsApp Image 2026-09-23 at 1.41.20 AM (1).jpeg", caption: "Laughter & Love 💕", rotation: 3 },
  { id: 149, url: "/images/WhatsApp Image 2026-09-23 at 1.41.20 AM.jpeg", caption: "Special Celebration 🎉", rotation: -4 },
  { id: 150, url: "/images/WhatsApp Image 2026-09-23 at 1.41.22 AM (1).jpeg", caption: "Heart Full of Joy 💖", rotation: 2 },
  { id: 151, url: "/images/WhatsApp Image 2026-09-23 at 1.41.22 AM (2).jpeg", caption: "Memories We Treasure 💎", rotation: -1 },
  { id: 152, url: "/images/WhatsApp Image 2026-09-23 at 1.41.22 AM.jpeg", caption: "Brightest Smile 🌟", rotation: 4 },
  { id: 153, url: "/images/WhatsApp Image 2026-09-23 at 1.41.23 AM.jpeg", caption: "Happy Vibes Only 🎈", rotation: -2 },
];

export const getFullImageUrl = (url, fallbackIdx = 0) => {
  const fallback = DEFAULT_POLAROID_PHOTOS[fallbackIdx % DEFAULT_POLAROID_PHOTOS.length].url;
  return resolveFullImageUrl(url, fallback);
};

export default function MemoryGallery({ photos = [], slug = 'kavita' }) {
  const [activePhotos, setActivePhotos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(16);

  // Multi-upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [newPhotoUrlsText, setNewPhotoUrlsText] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, percentage: 0 });

  const storageKey = `birthday_custom_photos_${slug || 'default'}`;

  const handleResetGallery = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn("Could not clear local storage", e);
    }
    setActivePhotos(DEFAULT_POLAROID_PHOTOS);
  };

  // Sync photos from database props + localStorage
  useEffect(() => {
    let savedLocal = [];
    try {
      savedLocal = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) {
      console.warn("Could not read local storage photos", e);
    }

    const dbList = (photos && photos.length > 0)
      ? photos.map((p, idx) => ({
        id: p.id || `db-${idx}`,
        url: p.image_path || p.url || DEFAULT_POLAROID_PHOTOS[idx % DEFAULT_POLAROID_PHOTOS.length].url,
        caption: p.caption || DEFAULT_POLAROID_PHOTOS[idx % DEFAULT_POLAROID_PHOTOS.length].caption,
        rotation: (idx % 2 === 0 ? 1 : -1) * ((idx * 2) % 5 + 1),
      }))
      : [];

    const mergedMap = new Map();

    // 1. Add locally saved custom photos
    savedLocal.forEach((item) => {
      if (item && item.url) mergedMap.set(item.url, item);
    });

    // 2. Add database photos
    dbList.forEach((item) => {
      if (item && item.url) mergedMap.set(item.url, item);
    });

    let combined = Array.from(mergedMap.values());

    // 3. Fallback to default photos if empty or fewer than 4
    if (combined.length === 0) {
      combined = DEFAULT_POLAROID_PHOTOS;
    } else if (combined.length < 4) {
      const needed = DEFAULT_POLAROID_PHOTOS.filter(d => !mergedMap.has(d.url));
      combined = [...combined, ...needed.slice(0, 4 - combined.length)];
    }

    setActivePhotos(combined);
  }, [photos, slug]);

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const prevPhoto = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + activePhotos.length) % activePhotos.length);
    }
  };

  const nextPhoto = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % activePhotos.length);
    }
  };

  const handleDeletePhoto = async (photoToDelete, e) => {
    if (e) e.stopPropagation();
    if (!photoToDelete) return;

    const targetUrl = photoToDelete.url;
    const targetId = photoToDelete.id;

    // 1. Update UI activePhotos state immediately
    const updated = activePhotos.filter((p) => p.url !== targetUrl && p.id !== targetId);
    setActivePhotos(updated);

    if (selectedIndex !== null) {
      if (updated.length === 0) {
        setSelectedIndex(null);
      } else {
        setSelectedIndex((prevIndex) => (prevIndex >= updated.length ? Math.max(0, updated.length - 1) : prevIndex));
      }
    }

    // 2. Remove from localStorage
    try {
      const savedLocal = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filteredLocal = savedLocal.filter((p) => p.url !== targetUrl && p.id !== targetId);
      localStorage.setItem(storageKey, JSON.stringify(filteredLocal));
    } catch (err) {
      console.warn("LocalStorage delete note:", err);
    }

    // 3. Delete from backend database if photo ID exists
    if (targetId && !String(targetId).startsWith('db-') && !isNaN(targetId)) {
      try {
        await birthdayService.deletePublicPhoto(slug || 'kavita', targetId);
      } catch (err) {
        console.warn("Backend photo delete notice:", err);
      }
    }
  };

  // Multiple File Selection Handler
  const handleMultipleFilesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        file: file,
      }));
      setFilePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => {
      const target = prev[index];
      if (target && target.url) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearAllSelectedFiles = () => {
    filePreviews.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    setSelectedFiles([]);
    setFilePreviews([]);
  };

  // Fast client-side image compression to prevent server payload timeouts & UI freeze
  const compressImageFile = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      if (!file || file.size < 300000) {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ file, dataUrl: e.target.result });
        reader.onerror = () => resolve({ file, dataUrl: null });
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve({ file: compressedFile, dataUrl });
              } else {
                resolve({ file, dataUrl: e.target.result });
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => resolve({ file, dataUrl: e.target.result });
        img.src = e.target.result;
      };
      reader.onerror = () => resolve({ file, dataUrl: null });
      reader.readAsDataURL(file);
    });
  };

  // Batch Submit Handler for Multiple Photos (Up to 200+)
  const handleBatchAddPhotos = async (e) => {
    e.preventDefault();

    // Collect URLs pasted in textarea if any
    const pastedUrls = newPhotoUrlsText
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && (u.startsWith('http') || u.startsWith('data:')));

    const totalToUpload = selectedFiles.length + pastedUrls.length;
    if (totalToUpload === 0) return;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: totalToUpload, percentage: 0 });

    const newEntries = [];
    const captionToUse = newPhotoCaption.trim() || 'Memories ❤️';

    // 1. Process Pasted URLs immediately
    if (pastedUrls.length > 0) {
      pastedUrls.forEach((urlStr, idx) => {
        newEntries.push({
          id: Date.now() + idx,
          url: urlStr,
          caption: captionToUse,
          rotation: (Math.random() - 0.5) * 6,
        });
      });

      try {
        await birthdayService.addPublicPhotosBatch(slug || 'kavita', {
          image_paths: pastedUrls,
          caption: captionToUse,
        });
      } catch (err) {
        console.warn("Pasted URLs batch upload notice:", err);
      }
    }

    // 2. Process File Uploads in small batches of 2 photos per API call with compression
    const BATCH_SIZE = 2;
    let completedCount = pastedUrls.length;

    for (let i = 0; i < selectedFiles.length; i += BATCH_SIZE) {
      const chunkFiles = selectedFiles.slice(i, i + BATCH_SIZE);
      const formData = new FormData();
      const fallbackUrls = [];

      for (let j = 0; j < chunkFiles.length; j++) {
        const fileObj = chunkFiles[j];
        const { file: compressedFile, dataUrl } = await compressImageFile(fileObj);
        formData.append('photos[]', compressedFile || fileObj);
        if (dataUrl) fallbackUrls.push(dataUrl);
      }

      formData.append('caption', captionToUse);

      try {
        const response = await birthdayService.addPublicPhotosBatch(slug || 'kavita', formData);
        if (response?.data && Array.isArray(response.data)) {
          response.data.forEach((p, pIdx) => {
            newEntries.push({
              id: p.id || Date.now() + i + pIdx,
              url: p.image_path || p.url,
              caption: p.caption || captionToUse,
              rotation: (Math.random() - 0.5) * 6,
            });
          });
        } else {
          fallbackUrls.forEach((dUrl, dIdx) => {
            newEntries.push({
              id: Date.now() + i + dIdx,
              url: dUrl,
              caption: captionToUse,
              rotation: (Math.random() - 0.5) * 6,
            });
          });
        }
      } catch (err) {
        console.warn(`Batch upload error for index ${i}`, err);
        fallbackUrls.forEach((dUrl, dIdx) => {
          newEntries.push({
            id: Date.now() + i + dIdx,
            url: dUrl,
            caption: captionToUse,
            rotation: (Math.random() - 0.5) * 6,
          });
        });
      }

      completedCount += chunkFiles.length;
      setUploadProgress({
        current: completedCount,
        total: totalToUpload,
        percentage: Math.round((completedCount / totalToUpload) * 100),
      });
    }

    // 3. Update active UI state
    setActivePhotos((prev) => [...newEntries, ...prev]);

    // 4. Update localStorage
    try {
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      localStorage.setItem(storageKey, JSON.stringify([...newEntries, ...existing]));
    } catch (err) {
      console.error("Local storage batch save error:", err);
    }

    // Reset Form State
    clearAllSelectedFiles();
    setNewPhotoUrlsText('');
    setNewPhotoCaption('');
    setIsUploading(false);
    setShowUploadModal(false);
  };

  return (
    <section id="photo-memories" className="py-20 px-4 max-w-7xl mx-auto text-center relative z-10">
      {/* Section Header */}
      <div className="mb-14 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold tracking-wider text-xs uppercase mb-3 border border-pink-400/30">
          <Heart size={14} className="fill-pink-400 text-pink-400" />
          <span>PAGE 3 — Photo Memories ({activePhotos.length} Photos)</span>
          <Sparkles size={14} className="text-amber-300" />
        </div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif-display font-extrabold text-white mb-3">
          Our Beautiful Photo Memories 📸
        </h2>
        <p className="text-purple-200/90 text-sm md:text-base max-w-xl mx-auto font-light">
          A timeless collection of polaroid snapshots capturing our sweetest moments, smiles, and laughter.
        </p>

        {/* Action Buttons: Add Personal Photos & Reset */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500/30 via-purple-600/30 to-amber-500/30 hover:from-pink-500/50 hover:to-amber-500/50 text-pink-200 border border-pink-400/50 font-bold text-xs md:text-sm flex items-center gap-2.5 shadow-xl transition-all cursor-pointer glow-pink"
          >
            <Plus size={18} className="text-pink-400" />
            <span>Add Multiple Personal Photos (Up to 200 Pics) 📷</span>
          </button>

          <button
            onClick={handleResetGallery}
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-pink-500/20 text-pink-300 border border-pink-400/40 font-semibold text-xs md:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            title="Reset gallery photos to default"
          >
            <Trash2 size={16} />
            <span>Reset Photo Gallery</span>
          </button>
        </div>
      </div>

      {/* Polaroid Grid Layout with Pagination / Visible Count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 px-4">
        {activePhotos.slice(0, visibleCount).map((photo, index) => (
          <motion.div
            key={photo.id || index}
            initial={{ opacity: 0, y: 30, rotate: photo.rotation }}
            whileInView={{ opacity: 1, y: 0, rotate: photo.rotation }}
            transition={{ duration: 0.6, delay: (index % 12) * 0.05 }}
            viewport={{ once: true }}
            onClick={() => openLightbox(index)}
            className="polaroid-card group cursor-pointer"
          >
            {/* Heart Badge Top Center */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-pink-100 border border-pink-300 shadow flex items-center justify-center z-10 text-pink-500">
              <Heart size={14} className="fill-pink-500" />
            </div>

            {/* Photo Thumbnail */}
            <div className="w-full aspect-[4/5] rounded overflow-hidden bg-purple-950/20 mb-3 relative">
              <img
                src={getFullImageUrl(photo.url, index)}
                alt={photo.caption || "Memory"}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_POLAROID_PHOTOS[index % DEFAULT_POLAROID_PHOTOS.length].url;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                <span className="text-white text-xs font-semibold flex items-center gap-1">
                  <ImageIcon size={14} /> View Full
                </span>
              </div>
            </div>

            {/* Handwritten Caption */}
            <h3 className="font-handwriting text-2xl md:text-3xl text-gray-800 font-bold leading-tight">
              {photo.caption}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Load More Button if more than visibleCount photos */}
      {activePhotos.length > visibleCount && (
        <div className="mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + 24)}
            className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-pink-500/20 text-pink-300 border border-pink-400/40 font-bold text-sm flex items-center gap-2 mx-auto transition-all cursor-pointer shadow-lg"
          >
            <Grid size={16} />
            <span>Load More Photos ({activePhotos.length - visibleCount} Remaining) 📸</span>
          </button>
        </div>
      )}

      {/* Final Memory Quote Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-16 max-w-2xl mx-auto p-8 md:p-12 rounded-3xl glass-card border border-[#FF3FA4]/40 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-[#FF3FA4]/20 via-[#A83CFF]/20 to-[#FFD166]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF3FA4] to-[#FFD166] mx-auto flex items-center justify-center shadow-xl glow-pink"
          >
            <Heart size={32} className="fill-white text-white" />
          </motion.div>

          <h3 className="text-2xl md:text-4xl font-serif-display font-extrabold text-white leading-tight">
            “Every memory with you is a moment worth keeping forever. ❤️”
          </h3>

          <p className="text-purple-200/90 text-sm font-light max-w-md mx-auto pt-2">
            Thank you for bringing endless warmth, joy, and light into every single day! ✨
          </p>

          <div className="pt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-pink-500/20 text-pink-300 font-semibold text-xs border border-pink-400/40">
            <Sparkles size={14} className="text-amber-300 animate-spin" />
            <span>Happy Birthday Once Again! 🎂✨</span>
          </div>
        </div>
      </motion.div>

      {/* Multiple Photos Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-pink-500/40 shadow-2xl relative my-8 max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => !isUploading && setShowUploadModal(false)}
                disabled={isUploading}
                className="absolute top-4 right-4 text-purple-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-serif-display font-bold text-white mb-1 flex items-center gap-2">
                <Upload size={22} className="text-pink-400" />
                <span>Add Multiple Photos (Up to 200)</span>
              </h3>
              <p className="text-xs text-purple-200/80 mb-5">
                Select multiple pictures from your device at once or paste multiple photo URLs.
              </p>

              <form onSubmit={handleBatchAddPhotos} className="space-y-4 text-left overflow-y-auto pr-1 flex-1">
                {/* Drag & Drop Multiple File Input */}
                <div>
                  <label className="block text-xs uppercase font-semibold tracking-wider text-pink-300 mb-1">
                    Select Photos from Device (Multiple Allowed)
                  </label>
                  <label className="border-2 border-dashed border-pink-400/40 hover:border-pink-400 rounded-2xl p-4 flex flex-col items-center justify-center bg-purple-950/40 cursor-pointer transition-all hover:bg-purple-900/30 group">
                    <Upload size={28} className="text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-purple-200">
                      Click to choose up to 200 photo files
                    </span>
                    <span className="text-[10px] text-purple-300/70 mt-1">
                      PNG, JPG, JPEG, WEBP files supported
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isUploading}
                      onChange={handleMultipleFilesUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Selected Files Thumbnail Previews */}
                {filePreviews.length > 0 && (
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-green-400" />
                        {filePreviews.length} Photo{filePreviews.length > 1 ? 's' : ''} Selected
                      </span>
                      <button
                        type="button"
                        onClick={clearAllSelectedFiles}
                        disabled={isUploading}
                        className="text-[10px] font-bold text-pink-400 hover:text-pink-300 cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1">
                      {filePreviews.map((preview, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-pink-400/30 group">
                          <img src={preview.url} alt="Thumbnail" className="w-full h-full object-cover" />
                          {!isUploading && (
                            <button
                              type="button"
                              onClick={() => removeSelectedFile(idx)}
                              className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors"
                            >
                              <Trash2 size={10} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Or Paste Multiple Image URLs */}
                <div>
                  <label className="block text-xs uppercase font-semibold tracking-wider text-pink-300 mb-1">
                    Or Paste Multiple Image URLs (One URL per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                    value={newPhotoUrlsText}
                    disabled={isUploading}
                    onChange={(e) => setNewPhotoUrlsText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-purple-950/70 border border-pink-500/30 text-white text-xs focus:outline-none focus:border-pink-400 font-mono"
                  />
                </div>

                {/* Optional Memory Caption */}
                <div>
                  <label className="block text-xs uppercase font-semibold tracking-wider text-pink-300 mb-1">
                    Caption for these Photos (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Unforgettable Birthday Moments ❤️"
                    value={newPhotoCaption}
                    disabled={isUploading}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    className="w-full p-3 rounded-xl bg-purple-950/70 border border-pink-500/30 text-white text-xs focus:outline-none focus:border-pink-400"
                  />
                </div>

                {/* Upload Progress Bar */}
                {isUploading && (
                  <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-400/30 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-pink-300">
                      <span className="flex items-center gap-1.5">
                        <Loader2 size={14} className="animate-spin text-pink-400" />
                        Uploading Photos ({uploadProgress.current} / {uploadProgress.total})
                      </span>
                      <span>{uploadProgress.percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-purple-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-amber-400 transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isUploading || (selectedFiles.length === 0 && !newPhotoUrlsText.trim())}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 text-white font-bold text-sm shadow-xl hover:opacity-90 disabled:opacity-50 cursor-pointer mt-4 flex items-center justify-center gap-2 glow-pink"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Uploading Photos...</span>
                    </>
                  ) : (
                    <span>Upload All Photos to Memory Gallery ✨</span>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {selectedIndex !== null && activePhotos[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/95 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto"
          >
            {/* Top Lightbox Bar with Prominent Back Button */}
            <div className="w-full max-w-5xl flex items-center justify-between z-10 pt-2 pb-4">
              <button
                onClick={closeLightbox}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer border border-white/30 glow-pink"
              >
                <ArrowLeft size={18} />
                <span>← Back to Gallery</span>
              </button>

              <div className="text-purple-200 text-xs sm:text-sm font-semibold tracking-wider bg-white/10 px-4 py-1.5 rounded-full border border-white/20 hidden sm:block">
                Photo {selectedIndex + 1} of {activePhotos.length}
              </div>

              <button
                onClick={closeLightbox}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/20"
                title="Close Lightbox View"
              >
                <X size={22} />
              </button>
            </div>

            {/* Previous Photo Arrow */}
            <button
              onClick={prevPhoto}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-50 backdrop-blur-md border border-white/20 shadow-xl"
              title="Previous Photo"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next Photo Arrow */}
            <button
              onClick={nextPhoto}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-50 backdrop-blur-md border border-white/20 shadow-xl"
              title="Next Photo"
            >
              <ChevronRight size={28} />
            </button>

            {/* Center Polaroid Photo Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-3xl w-full flex flex-col items-center my-auto py-2 z-10"
            >
              <div className="polaroid-card p-4 sm:p-6 md:p-7 rounded-2xl max-w-lg sm:max-w-xl w-full text-center shadow-2xl relative">
                <div className="w-full max-h-[65vh] rounded-xl overflow-hidden bg-gray-950/5 mb-4 shadow-inner flex items-center justify-center p-1">
                  <img
                    src={getFullImageUrl(activePhotos[selectedIndex].url, selectedIndex)}
                    alt={activePhotos[selectedIndex].caption}
                    className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_POLAROID_PHOTOS[selectedIndex % DEFAULT_POLAROID_PHOTOS.length].url;
                    }}
                  />
                </div>

                <h4 className="font-handwriting text-3xl md:text-4xl text-gray-900 font-bold leading-tight">
                  {activePhotos[selectedIndex].caption}
                </h4>

                <p className="text-xs text-gray-500 font-sans mt-1">
                  Photo {selectedIndex + 1} of {activePhotos.length}
                </p>

                {/* Footer Controls inside Polaroid */}
                <div className="mt-5 pt-3 border-t border-gray-200 flex items-center justify-between gap-2">
                  <button
                    onClick={closeLightbox}
                    className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs flex items-center gap-1.5 transition-all border border-gray-300 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={(e) => handleDeletePhoto(activePhotos[selectedIndex], e)}
                    className="px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold text-xs flex items-center gap-1.5 transition-all border border-red-200 cursor-pointer shadow-sm"
                  >
                    <Trash2 size={14} />
                    <span>Delete Photo 🗑️</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
