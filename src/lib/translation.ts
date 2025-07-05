import 'server-only';

import { Locale } from '@/i18n.config';
import { Languages } from './constants';

const dictionaries = {
    ar: () => import('@/dictionaries/ar.json').then((module) => module.default),
    en: () => import('@/dictionaries/en.json').then((module) => module.default),
};

const getTrans = async (lang: Locale) => {
    return lang === Languages.ARABIC ? dictionaries.ar() : dictionaries.en();
};

export default getTrans;