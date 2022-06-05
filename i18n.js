module.exports = {
    "locales": ["en", "zh", 'ja', 'id' , 'vi', 'de'],
    "defaultLocale": "en",
    "pages": {
        "*": ["common"],
    },

    "loadLocaleFrom": (lang, ns) => import(`./public/locales/${lang}/${ns}.json`).then((m) => m.default),
}