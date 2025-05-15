// Dictionary Helper - /src/lib/dictionaries.ts
const dictionaries = {
  en: () => import('@/dictionaries/en.json').then(module => module.default),
  uz: () => import('@/dictionaries/uz.json').then(module => module.default),
};

export const getDictionary = async (locale: string) => {
  return (dictionaries[locale as keyof typeof dictionaries] || dictionaries.en)();
};

// English Dictionary - /src/dictionaries/en.json
{
  "navigation": {
    "dashboard": "Dashboard",
    "courses": "Courses",
    "universities": "Universities",
    "admin": "Admin"
  },
  "search": {
    "placeholder": "Search course by name, subject...",
    "smart": "Smart",
    "exact": "Exact"
  },
  "courses": {
    "heading": "Courses",
    "noResults": "No courses found",
    "details": "Details",
    "startApplication": "Start Application"
  },
  "filters": {
    "studyDestination": "Study Destination",
    "cities": "Cities",
    "studyLevel": "Study Level",
    "startYear": "Start Year",
    "startMonth": "Start Month",
    "subjects": "Subjects",
    "courseOptions": "Course Options",
    "expressOffer": "Express Offer",
    "duration": "Duration",
    "modeOfStudy": "Mode Of Study",
    "feesRange": "Fees Range",
    "minFees": "Min Fees",
    "maxFees": "Max Fees"
  },
  "level": {
    "undergraduate": "Undergraduate",
    "postgraduate": "Postgraduate"
  }
}

// Uzbek Dictionary - /src/dictionaries/uz.json
{
  "navigation": {
    "dashboard": "Boshqaruv paneli",
    "courses": "Kurslar",
    "universities": "Universitetlar",
    "admin": "Admin"
  },
  "search": {
    "placeholder": "Kurs nomi, mavzu bo'yicha qidirish...",
    "smart": "Aqlli",
    "exact": "Aniq"
  },
  "courses": {
    "heading": "Kurslar",
    "noResults": "Kurslar topilmadi",
    "details": "Tafsilotlar",
    "startApplication": "Arizani boshlash"
  },
  "filters": {
    "studyDestination": "O'qish manzili",
    "cities": "Shaharlar",
    "studyLevel": "O'qish darajasi",
    "startYear": "Boshlash yili",
    "startMonth": "Boshlash oyi",
    "subjects": "Fanlar",
    "courseOptions": "Kurs variantlari",
    "expressOffer": "Tezkor taklif",
    "duration": "Davomiyligi",
    "modeOfStudy": "O'qish shakli",
    "feesRange": "To'lov oralig'i",
    "minFees": "Minimal to'lov",
    "maxFees": "Maksimal to'lov"
  },
  "level": {
    "undergraduate": "Bakalavr",
    "postgraduate": "Magistratura"
  }
}