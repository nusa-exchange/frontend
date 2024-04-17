module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "import",
      { libraryName: "ant-design-vue", libraryDirectory: "lib", style: true }
    ],
    [
      "transform-modules",
      {
        "cube-ui": {
          transform: "cube-ui/lib/${member}",
          preventFullImport: true,
          kebabCase: true
        }
      }
    ]
  ]
};
