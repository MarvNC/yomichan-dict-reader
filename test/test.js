const Yomichan = require('../yomichan');

const yomichan = new Yomichan();

(async function () {
  const JMDictPath = './test/[Bilingual] JMdict (English) Alternate.zip';
  await yomichan.readDictionary(JMDictPath);
  const 家Readings = yomichan.getReadingsForTerm('家');
  console.log(家Readings);
  console.log(yomichan.getDefinitionsForTerm('家'));

  const よいTerms = yomichan.getTermsForReading('よい');
  console.log(よいTerms);
  for (const entry of よいTerms) {
    console.log(yomichan.getDefinitionsForTermReading(entry, 'よい'));
  }
  
  const allJMDict = await yomichan.getAllEntriesFromDict(JMDictPath);
  console.log('Keys: ', Object.keys(allJMDict).length);
  const allJMDictTerms = await yomichan.getAllTermsInDict(JMDictPath);
  console.log('Terms: ', allJMDictTerms.size);
  console.log('JMDict contains 家: ', yomichan.dictContains(JMDictPath, '家'));
  console.log('JMDict contains DASDAS: ', yomichan.dictContains(JMDictPath, 'DASDAS'));
  console.log('Finished');
})();
