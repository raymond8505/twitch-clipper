module.exports = (app) => {
  const routes = {
    "/get-videos": "./get-videos.js",
    "/delete/:id": "./delete.js",
  };

  Object.keys(routes).forEach((path) => {
    app.get(path, require(routes[path]));
  });
};
