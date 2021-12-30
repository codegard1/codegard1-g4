import * as JsSearch from 'js-search';

const useJsSearch = posts => {

  // Seach configuration
  const dataToSearch = new JsSearch.Search("id");
  dataToSearch.indexStrategy = new JsSearch.PrefixIndexStrategy();
  dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer();
  dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex("id");

  // Fields to search
  dataToSearch.addIndex(["fronmatter", "title"]);
  dataToSearch.addIndex(["excerpt"]);

  // Map types and filter out empty nodes (?)
  dataToSearch.addDocuments(posts);

  const search = query => dataToSearch.search(query);

  return { search };
};

export default useJsSearch;
