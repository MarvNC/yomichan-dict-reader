# Yomichan Dict Reader

[![npm version](https://badge.fury.io/js/yomichan-dict-reader.svg)](https://badge.fury.io/js/yomichan-dict-reader)

A module for reading Yomichan zip files.

Install:

```
npm i yomichan-dict-reader
```

Not yet supported:

- Frequency dictionaries
- Expanded tag detail (from a term- or dictionary-meta-bank)

Initialize:

```js
const Yomichan = require('yomichan-dict-reader');
const yomichan = new Yomichan();
const JMDictPath = './test/[Bilingual] JMdict (English) Alternate.zip';
yomichan.readDictionary(JMDictPath).then(() => {
  // do stuff
});
```

Get readings of a kanji term:

```js
// [ 'いえ', 'うち', 'け', 'や', 'か', 'んち' ]
yomichan.getReadingsForTerm('家');
```

Get kanji terms for a reading:

```js
// [
// '宵', '余意',
// '良い', '善い',
// '好い', '佳い',
// '吉い', '宜い',
// '酔い'
// ]
yomichan.getTermsForReading('よい');
```

Get definitions as an array:

```js
// [
//   {
//     term: '宵',
//     reading: 'よい',
//     tags: 'n',
//     deinflectors: '',
//     popularity: 209,
//     definitions: [ 'evening', 'early night hours' ],
//     sequence: 1347600,
//     bigTags: 'news spec',
//     dict: './test/[Bilingual] JMdict (English) Alternate.zip'
//   }
// ]
yomichan.getDefinitionsForTermReading('宵', 'よい');
```

Get the deinflectors as a string for a term-reading pair:

```js
// 'v5'
yomichan.getDeinflectorsForTermReading('出す', 'だす');
```

Get all the data in a dictionary as an object:

```js
await yomichan.getAllEntriesFromDict(JMDictPath);
```

Get all the terms in a dictionary as a set:

```js
await yomichan.getAllTermsInDict(JMDictPath);
```

Check if a dictionary contains a specific term:

```js
// true
yomichan.dictContains(JMDictPath, '家');
```

Read a kanji dictionary:

```js
const KANJIDICPath = './test/kanjidic_english.zip';
await yomichan.readKanjiDictionary(KANJIDICPath);
```

Get kanji data:

```js
// [
//   {
//     character: '家',
//     onyomi: 'カ ケ',
//     kunyomi: 'いえ や うち',
//     tags: 'jouyou',
//     meaningsArr: [
//       'house',
//       'home',
//       'family',
//       'professional',
//       'expert',
//       'performer'
//     ],
//     statsObj: {
//       busy_people: '2.8',
//       crowley: '46',
//       deroo: '751',
//       four_corner: '3023.2',
//       freq: '133',
//       gakken: '81',
//       grade: '2',
//       halpern_kkd: '2827',
//       halpern_kkld: '1458',
//       halpern_kkld_2ed: '1963',
//       halpern_njecd: '2273',
//       heisig: '541',
//       heisig6: '580',
//       henshall: '83',
//       henshall3: '89',
//       jf_cards: '158',
//       jis208: '1-18-40',
//       jlpt: '3',
//       kanji_in_context: '52',
//       kodansha_compact: '480',
//       maniette: '547',
//       moro: '7169',
//       nelson_c: '1311',
//       nelson_n: '1337',
//       oneill_kk: '151',
//       oneill_names: '1185',
//       sakade: '53',
//       sh_desc: '3m7.1',
//       sh_kk: '165',
//       sh_kk2: '165',
//       skip: '2-3-7',
//       strokes: '10',
//       tutt_cards: '189',
//       ucs: '5bb6'
//     },
//     dict: './test/kanjidic_english.zip'
//   }
// ]
yomichan.getKanjiInfo('家', KANJIDICPath);
```
