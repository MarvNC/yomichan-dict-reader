# Yomichan Dict Reader

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
const 家 Readings = yomichan.getReadingsForTerm('家');
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
const よい Terms = yomichan.getTermsForReading('よい');
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
console.log(yomichan.getDefinitionsForTermReading('宵', 'よい'));
```

Get all the data in a dictionary as an object:

```js
const allJMDict = await yomichan.getAllEntriesFromDict(JMDictPath);
```

Get all the terms in a dictionary as a set:

```js
const allJMDictTerms = await yomichan.getAllTermsInDict(JMDictPath);
```

Check if a dictionary contains a specific term:

```js
// true
yomichan.dictContains(JMDictPath, '家');
```
