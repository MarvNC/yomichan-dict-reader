# Yomichan Dict Reader

[![npm version](https://badge.fury.io/js/yomichan-dict-reader.svg)](https://badge.fury.io/js/yomichan-dict-reader)

A module for reading Yomichan zip files.

Initialize:

```js
const Yomichan = require('../yomichan');
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
