const fs = require("fs");

// JSON file path
const filePath = `posts_1.json`;
const filePath1 = `content/data/instagram.json`;

// fetch the posts_1 JSON file
// Read synchronously from a local JSON file
const content = fs.readFileSync(filePath);
const jsonContent = JSON.parse(content.toString());

// filter out non-JPG files
const filtered = jsonContent.filter(i => {
  const uri = i.media[0].uri;
  return uri.substr(uri.length - 3, 3) === "jpg";
});

// Map to new array
const output = filtered.map(i => {
  const item = i.media[0];
  const name = item.uri.substr(19);
  const creation_timestamp = new Date(item.creation_timestamp * 1000).toISOString();
  const title = item.title;

  return {
    title,
    creation_timestamp,
    name
  }
});

// Write output to a file
try {
  fs.writeFileSync(filePath1, JSON.stringify(output));
} catch (err) {
  console.error(err);
}
