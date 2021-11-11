module.exports = (app) => {
  const routes = {
    "/get-videos": "./get-videos.js",
  };

  Object.keys(routes).forEach((path) => {
    app.get(path, require(routes[path]));
  });
};
