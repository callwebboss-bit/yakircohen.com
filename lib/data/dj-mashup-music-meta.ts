import type {
  MashupMusic,
  MashupYoutubeDemo,
} from "@/lib/mashup-music-theory";

export type MashupIdeaEnrichment = {
  music: MashupMusic;
  youtubeDemo?: MashupYoutubeDemo;
  technique?: "stems" | "acapella" | "percussion" | "time_sig" | "harmonic" | "drop_build";
  upgradePlus?: string;
};

/** BPM, סולם והרמוניה — ממוזג לרעיונות לפי id */
export const MASHUP_IDEA_ENRICHMENTS: Record<string, MashupIdeaEnrichment> = {
  omer_taapas_levitating: {
    music: {
      trackA: { bpm: 128, keyCamelot: "8B" },
      trackB: { bpm: 128, keyCamelot: "9A" },
      harmony: {
        relation: "adjacent",
        targetBpm: 128,
        note: "8B→9A מעלה אנרגיה בלי לזרוק את המלודיה — ווקאל עומר על ביט Levitating.",
      },
    },
    youtubeDemo: {
      videoId: "TUVcZfQe-Kw",
      label: "רפרנס — Levitating × מזרחית",
      source: "reference",
    },
  },
  eyal_pantera_omer_kavod: {
    music: {
      trackA: { bpm: 130, keyCamelot: "9A" },
      trackB: { bpm: 128, keyCamelot: "10A" },
      harmony: {
        relation: "adjacent",
        targetBpm: 129,
        note: "הפרש BPM קטן — pitch על אחד השירים, לא sync כפוי.",
      },
    },
    youtubeDemo: {
      videoId: "q1Omi-3L3QM",
      label: "רפרנס Hypeddit — פנתרה",
      source: "reference",
    },
  },
  eyal_doctor_lior_pantera: {
    music: {
      trackA: { bpm: 128, keyCamelot: "8B" },
      trackB: { bpm: 130, keyCamelot: "9B" },
      harmony: {
        relation: "adjacent",
        targetBpm: 129,
        note: "build ארוך לדרופ פנתרה — שני סולמות B, מרחק 1 על הגלגל.",
      },
    },
    youtubeDemo: {
      videoId: "q1Omi-3L3QM",
      label: "רפרנס — דוקטור → פנתרה",
      source: "reference",
    },
  },
  osher_chamishi_omer_tsamud: {
    music: {
      trackA: { bpm: 126, keyCamelot: "8A" },
      trackB: { bpm: 128, keyCamelot: "9A" },
      harmony: {
        relation: "adjacent",
        targetBpm: 127,
        note: "שני מינוריים סמוכים — מעבר חלק ברחבה מזרחית.",
      },
    },
  },
  omer_ahuvati_cant_hold: {
    music: {
      trackA: { bpm: 128, keyCamelot: "8A" },
      trackB: { bpm: 128, keyCamelot: "8B" },
      harmony: {
        relation: "relative",
        targetBpm: 128,
        note: "8A↔8B — רגש עומר על דרופ בינלאומי, אותו מספר על הגלגל.",
      },
    },
    youtubeDemo: {
      videoId: "0pYqGVnjKts",
      label: "רפרנס — Can't Hold Us × מזרחית",
      source: "reference",
    },
  },
  eden_hurricane_german_avny: {
    music: {
      trackA: { bpm: 126, keyCamelot: "7B" },
      trackB: { bpm: 128, keyCamelot: "8B" },
      harmony: {
        relation: "adjacent",
        targetBpm: 127,
        note: "פתיחה אירוויזיונית שמסתיימת באוס חתונות — BPM כמעט זהה.",
      },
    },
  },
  daft_uptown_opener: {
    music: {
      trackA: { bpm: 116, keyCamelot: "7B" },
      trackB: { bpm: 120, keyCamelot: "8B" },
      harmony: {
        relation: "adjacent",
        targetBpm: 118,
        note: "שני סולמות B — funk לפני שהרחבה נפתחת.",
      },
    },
    youtubeDemo: {
      videoId: "E5ONTXHS2mM",
      label: "רפרנס — Daft Punk × Uptown Funk",
      source: "reference",
    },
  },
  apt_cant_hold_youth: {
    music: {
      trackA: { bpm: 130, keyCamelot: "9A" },
      trackB: { bpm: 128, keyCamelot: "8B" },
      harmony: {
        relation: "pitch_shift",
        targetBpm: 129,
        pitchSemitones: 1,
        note: "TikTok 2025 — pitch קטן על APT, הדרופ מ-Can't Hold Us.",
      },
    },
  },
  osher_plaster_nadav_mashup: {
    music: {
      trackA: { bpm: 100, keyCamelot: "6A" },
      trackB: { bpm: 128, keyCamelot: "8A" },
      harmony: {
        relation: "half_time",
        targetBpm: 128,
        note: "מסלואו-רגש שעולה ל-128 — בוחרים נקודת עלייה ברורה.",
      },
    },
  },
  itay_fata_eyal_ir: {
    music: {
      trackA: { bpm: 128, keyCamelot: "9A" },
      trackB: { bpm: 128, keyCamelot: "9B" },
      harmony: {
        relation: "relative",
        targetBpm: 128,
        note: "איתי 2026 על קלאסיקת אייל — אותו מספר Camelot.",
      },
    },
  },
  static_kubiot_beyonce: {
    music: {
      trackA: { bpm: 127, keyCamelot: "8A" },
      trackB: { bpm: 128, keyCamelot: "9B" },
      harmony: {
        relation: "adjacent",
        targetBpm: 128,
        note: "אנרגיה נשית גלובלית על פופ ישראלי מעריך.",
      },
    },
  },
  trapatoni_bailar: {
    music: {
      trackA: { bpm: 100, keyCamelot: "5A" },
      trackB: { bpm: 128, keyCamelot: "7A" },
      harmony: {
        relation: "parallel",
        targetBpm: 128,
        note: "נוסטלגיה → לטיני — מודולציה מודעת לפני שיא הערב.",
      },
    },
  },
  simcha_darko_nostalgia: {
    music: {
      trackA: { bpm: 128, keyCamelot: "8B" },
      trackB: { bpm: 128, keyCamelot: "8B" },
      harmony: {
        relation: "same_key",
        targetBpm: 128,
        note: "אותו סולם — דודאים וצעירים בלי הפתעות.",
      },
    },
  },
  marina_guy_beyachad_opening: {
    music: {
      trackA: { bpm: 95, keyCamelot: "6B" },
      trackB: { bpm: 128, keyCamelot: "8B" },
      harmony: {
        relation: "half_time",
        targetBpm: 128,
        note: "רגע זוגי איטי שמתפוצץ לרחבה — תזמון לפני כניסת הזוג.",
      },
    },
  },
  rihanna_levitating_club: {
    music: {
      trackA: { bpm: 128, keyCamelot: "8B" },
      trackB: { bpm: 128, keyCamelot: "8B" },
      harmony: {
        relation: "same_key",
        targetBpm: 128,
        note: "שני סטייפלס 128 באותו סולם — מיזוג נקי.",
      },
    },
    youtubeDemo: {
      videoId: "TUVcZfQe-Kw",
      label: "רפרנס — Levitating club edit",
      source: "reference",
    },
  },
  slow_hora_mainstream: {
    music: {
      trackA: { bpm: 70, keyCamelot: "4A" },
      trackB: { bpm: 128, keyCamelot: "8B" },
      harmony: {
        relation: "half_time",
        targetBpm: 128,
        note: "הורה ב-70 → רחבה ב-128. לא לעצור באמצע.",
      },
    },
  },
  simche_chupa_remix: {
    music: {
      trackA: { bpm: 95, keyCamelot: "5B" },
      trackB: { bpm: 100, keyCamelot: "6B" },
      harmony: {
        relation: "adjacent",
        targetBpm: 98,
        note: "חופה — BPM נמוך, בלי דרופים חדים באמצע הטקס.",
      },
    },
  },
  shked_kikar_first_dance: {
    music: {
      trackA: { bpm: 118, keyCamelot: "7B" },
      trackB: { bpm: 128, keyCamelot: "8B" },
      harmony: {
        relation: "adjacent",
        targetBpm: 124,
        note: "גשר מריקוד ראשון לרחבה — עלייה הדרגתית בקצב.",
      },
    },
  },
  ze_tov_apt_bar_mitzvah: {
    music: {
      trackA: { bpm: 118, keyCamelot: "7A" },
      trackB: { bpm: 130, keyCamelot: "9A" },
      harmony: {
        relation: "adjacent",
        targetBpm: 124,
        pitchSemitones: 1,
        note: "נוסטלגיה לסבים, APT לילדים — שני קהלים, מעבר ברור.",
      },
    },
  },
  omer_ometz_bachata: {
    music: {
      trackA: { bpm: 124, keyCamelot: "7A" },
      trackB: { bpm: 128, keyCamelot: "8A" },
      harmony: {
        relation: "adjacent",
        targetBpm: 126,
        note: "באצ'טה באמצע ערב מזרחית — שינוי גרוב, לא רק שיר.",
      },
    },
  },
  static_baiana_latin: {
    music: {
      trackA: { bpm: 128, keyCamelot: "8A" },
      trackB: { bpm: 128, keyCamelot: "9A" },
      harmony: {
        relation: "adjacent",
        targetBpm: 128,
        note: "ישראלי-לטיני — אותו BPM, סולמות סמוכים.",
      },
    },
  },
  ron_million_osher_2025: {
    music: {
      trackA: { bpm: 128, keyCamelot: "9A" },
      trackB: { bpm: 128, keyCamelot: "9B" },
      harmony: {
        relation: "relative",
        targetBpm: 128,
        note: "שני להיטי 2025 — מז'ור/מינור יחסיים, אנרגיה גבוהה.",
      },
    },
  },
  omer_chaverot_sharon: {
    music: {
      trackA: { bpm: 128, keyCamelot: "8B" },
      trackB: { bpm: 128, keyCamelot: "8B" },
      harmony: {
        relation: "same_key",
        targetBpm: 128,
        note: "רמיקס מוכן → מיינסטרים בלי עצירה.",
      },
    },
  },
  zohar_ukg: {
    music: {
      trackA: { bpm: 130, keyCamelot: "8A" },
      trackB: { bpm: 130, keyCamelot: "9A" },
      harmony: {
        relation: "adjacent",
        targetBpm: 130,
        note: "קאנון מזרחי על UKG — סינקופה במקום house רובוטי.",
      },
    },
    technique: "stems",
    upgradePlus: "פרדת ערוצים + שכבת בס UK + תיקון פאז על הווקאל.",
  },
  peer_ouf_breakbeat: {
    music: {
      trackA: { bpm: 128, keyCamelot: "9A" },
      trackB: { bpm: 126, keyCamelot: "8B" },
      harmony: {
        relation: "adjacent",
        targetBpm: 127,
        note: "היט ישראלי על breakbeat — stems חובה.",
      },
    },
    technique: "stems",
    upgradePlus: "drums נפרדים, ווקאל נקי, build לפני הדרופ.",
  },
  ethnix_baiana_live: {
    music: {
      trackA: { bpm: 128, keyCamelot: "8B" },
      trackB: { bpm: 128, keyCamelot: "8B" },
      harmony: {
        relation: "same_key",
        targetBpm: 128,
        note: "קלאסיקה ישראלית + פרקושן חי — נשמע כמו להקה.",
      },
    },
    technique: "percussion",
    upgradePlus: "שכבת דרבוקה/קונגה מוקלטת, לא לופ גנרי.",
  },
  viva_tehom_harmonic: {
    music: {
      trackA: { bpm: 75, keyCamelot: "6A" },
      trackB: { bpm: 128, keyCamelot: "8A" },
      harmony: {
        relation: "parallel",
        targetBpm: 128,
        note: "שינוי הרמוניה מסלואו לדרופ — בודקים סולם ב-Tunebat לפני עריכה.",
      },
    },
    technique: "harmonic",
    upgradePlus: "מודולציה מסודרת, לא pitch על כל השיר.",
  },
  birds_kirel_chop: {
    music: {
      trackA: { bpm: 108, keyCamelot: "5B" },
      trackB: { bpm: 110, keyCamelot: "6B" },
      harmony: {
        relation: "adjacent",
        targetBpm: 109,
        note: "chop ולא crossfade — דור Z × פופ ישראלי.",
      },
    },
    technique: "stems",
  },
  shir_alayim_drill: {
    music: {
      trackA: { bpm: 140, keyCamelot: "10A" },
      trackB: { bpm: 140, keyCamelot: "11A" },
      harmony: {
        relation: "adjacent",
        targetBpm: 140,
        note: "drill כבד — שני שירים באותו טווח BPM.",
      },
    },
    technique: "stems",
    upgradePlus: "808 נפרד, ווקאל chop, אין מקום ל-sync אוטומטי.",
  },
  ninnet_deep_house: {
    music: {
      trackA: { bpm: 125, keyCamelot: "8A" },
      trackB: { bpm: 124, keyCamelot: "8A" },
      harmony: {
        relation: "same_key",
        targetBpm: 124,
        note: "אייקון פופ נשי על deep house — מינימלי, לא זול.",
      },
    },
    technique: "harmonic",
  },
  darbuka_techno: {
    music: {
      trackA: { bpm: 128, keyCamelot: "9A" },
      trackB: { bpm: 128, keyCamelot: "9A" },
      harmony: {
        relation: "same_key",
        targetBpm: 128,
        note: "מוזיקאי חי + טכנו — בדיוק מה שמחפשים כשצריך אוזן.",
      },
    },
    technique: "percussion",
    upgradePlus: "דגימת דרבוקה אמיתית, לא one-shot מספרייה.",
  },
  dreams_osher_harmonic: {
    music: {
      trackA: { bpm: 123, keyCamelot: "7A" },
      trackB: { bpm: 126, keyCamelot: "8A" },
      harmony: {
        relation: "adjacent",
        targetBpm: 124,
        note: "אינדי-פופ מלנכולי × מזרחית — אותו mood.",
      },
    },
    technique: "harmonic",
  },
  heat_waves_ir_namal: {
    music: {
      trackA: { bpm: 100, keyCamelot: "6A" },
      trackB: { bpm: 128, keyCamelot: "8A" },
      harmony: {
        relation: "parallel",
        targetBpm: 128,
        note: "טיקטוק הוכיח את הרעיון — הגרסה המקצועית לרחבה חכמה.",
      },
    },
    youtubeDemo: {
      videoId: "pSykR71LHEQ",
      label: "רפרנס — Heat Waves mashup culture",
      source: "reference",
    },
  },
  gospel_afro_hora: {
    music: {
      trackA: { bpm: 123, keyCamelot: "7B" },
      trackB: { bpm: 124, keyCamelot: "8B" },
      harmony: {
        relation: "adjacent",
        targetBpm: 123,
        note: "מקהלה + אפרו — רגע שמצלמים.",
      },
    },
    technique: "percussion",
  },
  disclosure_gaon: {
    music: {
      trackA: { bpm: 124, keyCamelot: "9B" },
      trackB: { bpm: 124, keyCamelot: "10A" },
      harmony: {
        relation: "adjacent",
        targetBpm: 124,
        note: "UK house × זהב ישראלי — דיג'ייז מדברים על זה אחרי הסט.",
      },
    },
    technique: "stems",
  },
  balkan_mizrahi_9_8: {
    music: {
      trackA: { bpm: 125, keyCamelot: "8A" },
      trackB: { bpm: 125, keyCamelot: "8A" },
      harmony: {
        relation: "same_key",
        targetBpm: 125,
        note: "9/8 מול 4/4 — שינוי משקל, לא sync.",
      },
    },
    technique: "time_sig",
    upgradePlus: "עריכת משקל מלאה באולפן — לא טריק DJ.",
  },
  stromae_itay: {
    music: {
      trackA: { bpm: 124, keyCamelot: "7A" },
      trackB: { bpm: 128, keyCamelot: "8A" },
      harmony: {
        relation: "adjacent",
        targetBpm: 126,
        note: "אירופה × ישראל — חיבור thematic, לא רק טכני.",
      },
    },
    technique: "acapella",
  },
  acapella_silence_drop: {
    music: {
      trackA: { bpm: 128, keyCamelot: "8B" },
      trackB: { bpm: 128, keyCamelot: "8B" },
      harmony: {
        relation: "same_key",
        targetBpm: 128,
        note: "שקט לפני הדרופ — מוצר אולפן, לא טריק.",
      },
    },
    technique: "drop_build",
    upgradePlus: "acapella מותאם + drop מעוצב + תאום לתאורה.",
  },
  lil_nas_mizrahi_drill: {
    music: {
      trackA: { bpm: 128, keyCamelot: "9A" },
      trackB: { bpm: 140, keyCamelot: "10A" },
      harmony: {
        relation: "pitch_shift",
        targetBpm: 140,
        pitchSemitones: 2,
        note: "עולים ל-140 עם pitch על הפופ — ה-drill מוביל.",
      },
    },
    technique: "stems",
    upgradePlus: "808 נפרד, vocal chop, אין sync אוטומטי.",
  },
  reggaeton_shir_yeladim: {
    music: {
      trackA: { bpm: 100, keyCamelot: "5B" },
      trackB: { bpm: 98, keyCamelot: "5A" },
      harmony: {
        relation: "relative",
        targetBpm: 98,
        note: "נוסטלגיה ו-reggaeton באותו משפחת סולמות.",
      },
    },
    technique: "percussion",
  },
  psy_omer_bridge: {
    music: {
      trackA: { bpm: 128, keyCamelot: "8A" },
      trackB: { bpm: 145, keyCamelot: "9A" },
      harmony: {
        relation: "parallel",
        targetBpm: 128,
        note: "גשר 30 שניות — לא שיר מלא. מודולציה מכוונת.",
      },
    },
    technique: "harmonic",
    upgradePlus: "עריכת גשר באולפן, חזרה נקייה ל-128.",
  },
  piano_mizrahi_live: {
    music: {
      trackA: { bpm: 95, keyCamelot: "6B" },
      trackB: { bpm: 128, keyCamelot: "8B" },
      harmony: {
        relation: "half_time",
        targetBpm: 128,
        note: "פסנתר חי איטי → ביט מזרחית — רגש חופה.",
      },
    },
    technique: "percussion",
    upgradePlus: "הקלטת פסנתר אמיתית, לא sample ספרייה.",
  },
};

export function enrichMashupIdea<T extends { id: string }>(
  idea: T,
): T & Partial<MashupIdeaEnrichment> {
  const extra = MASHUP_IDEA_ENRICHMENTS[idea.id];
  if (!extra) return idea;
  return { ...idea, ...extra };
}
