const translate = require('@vitalets/google-translate-api');
translate('oi', { from: 'pt', to: 'en' }).then(text => console.log(text.text));
