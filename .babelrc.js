module.exports = api => {
  api.cache(true);

  const config = {
    presets: ["@babel/preset-react"],
    plugins: ["emotion", "@babel/plugin-syntax-dynamic-import"]
  };

  console.log("babel", process.env.ENV);

  if (process.env.ENV === "test") {
    config.presets.push(["@babel/preset-env", {
      "targets": {
        "browsers": ["last 2 versions", "safari 7", "IE 11"]
      },
      "useBuiltIns": false,
      "modules": false,
      "exclude": [
        "transform-regenerator"
      ]
    }
    ]);
  } else {
    config.presets.push(["@babel/preset-env", {
      "targets": {
        "browsers": ["last 2 versions", "safari 7", "IE 11"]
      },
      "useBuiltIns": false,
      "modules": "commonjs",
      "exclude": [
        "transform-regenerator"
      ]
    }
    ]);
  }


  return config;
};
