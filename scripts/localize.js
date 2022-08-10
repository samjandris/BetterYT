require('dotenv').config();
const fs = require('fs');

const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

const mainLocale = require('../src/_locales/en/messages.json');
const locales = ['es', 'fr', 'it', 'de'];

async function doTranslate() {
  const keys = [];
  const values = [];
  for (let [key, value] of Object.entries(mainLocale)) {
    keys.push(key);
    values.push(value.message);
  }

  for (let locale of locales) {
    // const locale = 'es';
    const newLocale = {};
    keys.forEach((key) => {
      newLocale[key] = {
        message: null,
        description: mainLocale[key]['description'],
      };
    });

    let [translations] = await translate.translate(values, locale);
    translations = Array.isArray(translations) ? translations : [translations];
    translations.forEach((translation, i) => {
      newLocale[keys[Math.floor(i)]]['message'] = translation;
    });

    fs.mkdir('./testLocales/' + locale, { recursive: true }, (err) => {
      if (err) {
        return console.log(err);
      }

      fs.writeFile(
        './testLocales/' + locale + '/messages.json',
        JSON.stringify(newLocale, null, 2),
        (err) => {
          if (err) {
            return console.log(err);
          }
        }
      );
    });
  }
}

doTranslate();
