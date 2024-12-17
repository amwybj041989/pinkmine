import { createI18n } from 'vue-i18n';
import enUS from 'vant/es/locale/lang/en-US';
import zhTW from 'vant/es/locale/lang/zh-TW';
import ar from 'vant/es/locale/lang/ar-SA';
import es from 'vant/es/locale/lang/es-ES';
import fr from 'vant/es/locale/lang/fr-FR';
import id from 'vant/es/locale/lang/id-ID';
import ja from 'vant/es/locale/lang/ja-JP';
import pt from 'vant/es/locale/lang/pt-BR';
import ru from 'vant/es/locale/lang/ru-RU';
import th from 'vant/es/locale/lang/th-TH';
import vi from 'vant/es/locale/lang/vi-VN';
import hi from 'vant/es/locale/lang/hi-IN';
import { Locale, type PickerColumn } from 'vant';

const FALLBACK_LOCALE = 'zh-TW';

const vantLocales = {
  'zh-TW': zhTW,
  en: enUS,
  ar: ar,
  es: es,
  fr: fr,
  id: id,
  ja: ja,
  pt: pt,
  ru: ru,
  th: th,
  vi: vi,
  hi: hi,
};

export const languageColumns: PickerColumn = [
  { text: '繁体中文', value: 'zh-TW' },
  { text: 'English', value: 'en' },
  { text: '日語', value: 'ja' },
  { text: 'عربي عربي', value: 'ar' },
  { text: 'Español', value: 'es' },
  { text: 'Português', value: 'pt' },
  { text: 'Français', value: 'fr' },
  { text: 'Bahasa Indonesia', value: 'id' },
  { text: 'Tiếng Việt', value: 'vi' },
  { text: 'Русский язык', value: 'ru' },
  { text: 'ภาษาไทย', value: 'th' },
  { text: 'हिंदीName', value: 'hi' },
];

export const i18n = setupI18n();
type I18n = typeof i18n;

export const locale = computed({
  get() {
    return i18n.global.locale.value;
  },
  set(language: string) {
    setLang(language, i18n);
  },
});

function setupI18n() {
  const locale = getI18nLocale();
  const i18n = createI18n({
    locale,
    legacy: false,
  });
  setLang(locale, i18n);
  return i18n;
}

async function setLang(lang: string, i18n: I18n) {
  await loadLocaleMsg(lang, i18n);

  document.querySelector('html').setAttribute('lang', lang);
  localStorage.setItem('language', lang);
  i18n.global.locale.value = lang;

  // 设置 vant 组件语言包
  Locale.use(lang, vantLocales[lang]);
}

// 加载本地语言包
async function loadLocaleMsg(locale: string, i18n: I18n) {
  const messages = await import(`../locales/${locale}.json`);
  i18n.global.setLocaleMessage(locale, messages.default);
}

// 获取当前语言对应的语言包名称
function getI18nLocale() {
  const storedLocale = localStorage.getItem('language') || navigator.language;

  const langs = languageColumns.map((v) => v.value as string);

  // 存在当前语言的语言包 或 存在当前语言的任意地区的语言包
  const foundLocale = langs.find((v) => v === storedLocale || v.indexOf(storedLocale) === 0);

  // 若未找到，则使用 默认语言包
  const locale = foundLocale || FALLBACK_LOCALE;

  return locale;
}
