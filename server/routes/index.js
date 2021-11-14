module.exports = (app) => {
  const routes = {
    "/get-videos": "./get-videos.js",
    "/delete/:id": "./delete.js",
    "/parse-words/:id": "./parse-words.js",
  };

  Object.keys(routes).forEach((path) => {
    app.get(path, require(routes[path]));
  });
};
