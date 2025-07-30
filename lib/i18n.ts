"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Language = "en" | "es" | "fr" | "de" | "hi" | "zh"

interface Translations {
  [key: string]: {
    [key in Language]: string
  }
}

const translations: Translations = {
  // Navigation & Common
  "nav.dashboard": {
    en: "Dashboard",
    es: "Panel de Control",
    fr: "Tableau de Bord",
    de: "Dashboard",
    hi: "डैशबोर्ड",
    zh: "仪表板",
  },
  "nav.attendance": {
    en: "Attendance",
    es: "Asistencia",
    fr: "Présence",
    de: "Anwesenheit",
    hi: "उपस्थिति",
    zh: "出勤",
  },
  "nav.timetable": {
    en: "Timetable",
    es: "Horario",
    fr: "Emploi du Temps",
    de: "Stundenplan",
    hi: "समय सारणी",
    zh: "时间表",
  },
  "nav.analytics": {
    en: "Analytics",
    es: "Análisis",
    fr: "Analytique",
    de: "Analytik",
    hi: "विश्लेषण",
    zh: "分析",
  },
  "nav.settings": {
    en: "Settings",
    es: "Configuración",
    fr: "Paramètres",
    de: "Einstellungen",
    hi: "सेटिंग्स",
    zh: "设置",
  },

  // Authentication
  "auth.login": {
    en: "Login",
    es: "Iniciar Sesión",
    fr: "Connexion",
    de: "Anmelden",
    hi: "लॉगिन",
    zh: "登录",
  },
  "auth.register": {
    en: "Register",
    es: "Registrarse",
    fr: "S'inscrire",
    de: "Registrieren",
    hi: "पंजीकरण",
    zh: "注册",
  },
  "auth.username": {
    en: "Username",
    es: "Nombre de Usuario",
    fr: "Nom d'utilisateur",
    de: "Benutzername",
    hi: "उपयोगकर्ता नाम",
    zh: "用户名",
  },
  "auth.password": {
    en: "Password",
    es: "Contraseña",
    fr: "Mot de passe",
    de: "Passwort",
    hi: "पासवर्ड",
    zh: "密码",
  },
  "auth.logout": {
    en: "Logout",
    es: "Cerrar Sesión",
    fr: "Déconnexion",
    de: "Abmelden",
    hi: "लॉगआउट",
    zh: "登出",
  },

  // Attendance
  "attendance.present": {
    en: "Present",
    es: "Presente",
    fr: "Présent",
    de: "Anwesend",
    hi: "उपस्थित",
    zh: "出席",
  },
  "attendance.absent": {
    en: "Absent",
    es: "Ausente",
    fr: "Absent",
    de: "Abwesend",
    hi: "अनुपस्थित",
    zh: "缺席",
  },
  "attendance.percentage": {
    en: "Attendance Percentage",
    es: "Porcentaje de Asistencia",
    fr: "Pourcentage de Présence",
    de: "Anwesenheitsprozentsatz",
    hi: "उपस्थिति प्रतिशत",
    zh: "出勤率",
  },
  "attendance.target": {
    en: "Target",
    es: "Objetivo",
    fr: "Objectif",
    de: "Ziel",
    hi: "लक्ष्य",
    zh: "目标",
  },

  // Status
  "status.safe": {
    en: "Safe",
    es: "Seguro",
    fr: "Sûr",
    de: "Sicher",
    hi: "सुरक्षित",
    zh: "安全",
  },
  "status.danger": {
    en: "Danger",
    es: "Peligro",
    fr: "Danger",
    de: "Gefahr",
    hi: "खतरा",
    zh: "危险",
  },
  "status.offline": {
    en: "Offline Mode",
    es: "Modo Sin Conexión",
    fr: "Mode Hors Ligne",
    de: "Offline-Modus",
    hi: "ऑफ़लाइन मोड",
    zh: "离线模式",
  },
  "status.online": {
    en: "Online",
    es: "En Línea",
    fr: "En Ligne",
    de: "Online",
    hi: "ऑनलाइन",
    zh: "在线",
  },

  // Actions
  "action.add": {
    en: "Add",
    es: "Agregar",
    fr: "Ajouter",
    de: "Hinzufügen",
    hi: "जोड़ें",
    zh: "添加",
  },
  "action.edit": {
    en: "Edit",
    es: "Editar",
    fr: "Modifier",
    de: "Bearbeiten",
    hi: "संपादित करें",
    zh: "编辑",
  },
  "action.delete": {
    en: "Delete",
    es: "Eliminar",
    fr: "Supprimer",
    de: "Löschen",
    hi: "हटाएं",
    zh: "删除",
  },
  "action.save": {
    en: "Save",
    es: "Guardar",
    fr: "Enregistrer",
    de: "Speichern",
    hi: "सेव करें",
    zh: "保存",
  },
  "action.cancel": {
    en: "Cancel",
    es: "Cancelar",
    fr: "Annuler",
    de: "Abbrechen",
    hi: "रद्द करें",
    zh: "取消",
  },
  "action.back": {
    en: "Back",
    es: "Volver",
    fr: "Retour",
    de: "Zurück",
    hi: "वापस",
    zh: "返回",
  },

  // Messages
  "message.success": {
    en: "Success",
    es: "Éxito",
    fr: "Succès",
    de: "Erfolg",
    hi: "सफलता",
    zh: "成功",
  },
  "message.error": {
    en: "Error",
    es: "Error",
    fr: "Erreur",
    de: "Fehler",
    hi: "त्रुटि",
    zh: "错误",
  },
  "message.syncing": {
    en: "Syncing data...",
    es: "Sincronizando datos...",
    fr: "Synchronisation des données...",
    de: "Daten werden synchronisiert...",
    hi: "डेटा सिंक हो रहा है...",
    zh: "正在同步数据...",
  },
  "message.syncComplete": {
    en: "Data synchronized successfully",
    es: "Datos sincronizados exitosamente",
    fr: "Données synchronisées avec succès",
    de: "Daten erfolgreich synchronisiert",
    hi: "डेटा सफलतापूर्वक सिंक हो गया",
    zh: "数据同步成功",
  },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && Object.keys(translations).length > 0) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    return translation[language] || translation.en || key
  }

  return <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
]
