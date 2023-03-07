const fs = require('fs');
const jszip = require('jszip');

const termBankRegex = /term_bank_\d+\.json/;
const kanjiBankRegex = /kanji_bank_\d+\.json/;

const Yomichan = class {
  allTermReadingPairsData = {};
  allKeys = {};
  allReadings = {};
  allDicts = {};
  kanjiData = {};
  constructor(path = null) {
    if (path) {
      this.readDictionary(path);
    }
  }

  /**
   * Reads a zip file dictionary of the Yomichan format
   * @param {string} dictname
   */
  async readDictionary(dictname) {
    console.log('Reading dictionary: ', dictname);
    const zipFile = await fs.promises.readFile(dictname);
    const zip = await jszip.loadAsync(zipFile);

    this.allDicts[dictname] = {};

    let fileCount = 0;
    let entryCount = 0;
    for (const filename of Object.keys(zip.files)) {
      if (termBankRegex.test(filename)) {
        console.log(`Reading ${filename} from ${dictname}`);
        const file = await zip.file(filename).async('string');
        const json = JSON.parse(file);
        for (const entry of json) {
          const [term, reading, tags, deinflectors, popularity, definitions, sequence, bigTags] =
            entry;

          const thisEntry = {
            term,
            reading,
            tags,
            deinflectors,
            popularity,
            definitions,
            sequence,
            bigTags,
            dict: dictname,
          };

          // add entry data
          if (!this.allTermReadingPairsData[[term, reading]]) {
            this.allTermReadingPairsData[[term, reading]] = [];
          }
          this.allTermReadingPairsData[[term, reading]].push(thisEntry);

          // add to this dict
          if (!this.allDicts[dictname][[term, reading]]) {
            this.allDicts[dictname][[term, reading]] = [];
          }
          this.allDicts[dictname][[term, reading]].push(thisEntry);

          // add readings lookup
          if (!this.allKeys[term]) {
            this.allKeys[term] = [];
          }
          if (!this.allKeys[term].includes(reading)) {
            this.allKeys[term].push(reading);
          }

          // add term lookup from reading
          if (!this.allReadings[reading]) {
            this.allReadings[reading] = [];
          }
          if (!this.allReadings[reading].includes(term)) {
            this.allReadings[reading].push(term);
          }
          entryCount++;
        }
        fileCount++;
      }
    }
    console.log(`Read ${fileCount} files with ${entryCount} entries from ${dictname}`);
  }

  /**
   * Reads multiple dictionaries
   * @param {string[]} dictionaries
   */
  async readDictionaries(dictionaries) {
    for (const dict of dictionaries) {
      await this.readDictionary(dict);
    }
  }

  /**
   * Given a dictionary name, gets every single entry from that dictionary
   * as an object containing every key/reading pair as a comma-separated string
   * and the definitions as an array.
   * @param {string} filename
   */
  async getAllEntriesFromDict(filename) {
    if (!this.allDicts[filename]) {
      await this.readDictionary(filename);
    }
    return this.allDicts[filename];
  }

  /**
   * Given a dictionary name, gets every single term from that dictionary as a set.
   * @param {string} filename
   * @returns {Set.<string>}
   */
  async getAllTermsInDict(filename) {
    const allTermreadingPairs = Object.keys(await this.getAllEntriesFromDict(filename));
    return new Set(allTermreadingPairs.map((entry) => entry.split(',')[0]));
  }

  /**
   * Checks if a dictionary contains a term.
   * @param {string} filename filename of the dictionary to search
   * @param {string} term the term to check for existence of
   */
  dictContains(filename, term) {
    const readings = this.getReadingsForTerm(term);
    for (const reading of readings) {
      const definitions = this.getDefinitionsForTermReading(term, reading);
      if (definitions.some((definition) => definition.dict == filename)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets readings of a kanji term.
   * @param {string} term
   */
  getReadingsForTerm(term) {
    return this.allKeys[term] ?? [];
  }

  /**
   * Gets the terms for a reading
   * @param {string} reading
   */
  getTermsForReading(reading) {
    return this.allReadings[reading] ?? [];
  }

  /**
   * Gets the definitions for a term reading pair.
   * @param {string} term The term in kanji, or hiragana/katakana if no kanji exists for the term.
   * @param {string} reading The reading in hiragana.
   * @returns {Object[]} A list of definitions or an empty array.
   */
  getDefinitionsForTermReading(term, reading = '') {
    // if term contains comma and reading is empty, separate into term reading
    if (term.includes(',') && reading == '') {
      [term, reading] = term.split(',');
    }
    // if term is same as reading, check definitions for empty reading too

    let data = this.allTermReadingPairsData[[term, reading]];
    data = data ?? this.allTermReadingPairsData[[term, '']];
    return data ?? [];
  }

  /**
   * Gets all the definitions for a single term.
   * @param {string} term term to search
   * @returns {Array.<Object>} A list of definitions or an empty array.
   */
  getDefinitionsForTerm(term) {
    const readings = this.getReadingsForTerm(term);
    let definitions = [];
    for (const reading of readings) {
      definitions.push(...this.getDefinitionsForTermReading(term, reading));
    }
    return definitions;
  }

  /**
   * Gets all the deinflectors for a term and reading pair.
   * @param {string} term
   * @param {string} reading
   * @returns {string} A space-separated list of deinflectors.
   */
  getDeinflectorsForTermReading(term, reading) {
    const definitions = this.getDefinitionsForTermReading(term, reading);
    if (definitions.length == 0) return '';
    // combine deinflectors from all definitions
    let deinflectors = [];
    for (const definition of definitions) {
      deinflectors.push(...definition.deinflectors.split(' '));
    }
    return [...new Set(deinflectors)].join(' ');
  }

  /**
   *
   * @returns {string[]} A list of all the dictionaries that have been read.
   */
  getCurrentDicts() {
    return Object.keys(this.allDicts);
  }

  /**
   * Reads a kanji dictionary
   * @param {string} dictname
   * @returns {Promise<void>}
   */
  async readKanjiDictionary(dictname) {
    console.log('Reading kanji dictionary: ', dictname);
    const zipFile = await fs.promises.readFile(dictname);
    const zip = await jszip.loadAsync(zipFile);

    this.kanjiData[dictname] = {};

    let fileCount = 0;
    let entryCount = 0;

    for (const filename of Object.keys(zip.files)) {
      if (kanjiBankRegex.test(filename)) {
        console.log(`Reading ${filename} from ${dictname}`);
        const file = await zip.file(filename).async('string');
        const json = JSON.parse(file);
        for (const entry of json) {
          const [character, onyomi, kunyomi, tags, meaningsArr, statsObj] = entry;

          const thisEntry = {
            character,
            onyomi,
            kunyomi,
            tags,
            meaningsArr,
            statsObj,
            dict: dictname,
          };

          // add entry data
          if (!this.kanjiData[dictname][character]) {
            this.kanjiData[dictname][character] = [];
          }
          this.kanjiData[dictname][character].push(thisEntry);

          entryCount++;
        }
        fileCount++;
      }
    }
    console.log(`Read ${fileCount} files with ${entryCount} entries from ${dictname}`);
  }

  /**
   * Gets the information for a kanji.
   * @param {string} kanji
   * @returns {Object} An object containing the information for the kanji.
   */
  getKanjiInfo(kanji, dictname) {
    let data = this.kanjiData[dictname][kanji];
    return data ?? [];
  }
};

module.exports = Yomichan;
