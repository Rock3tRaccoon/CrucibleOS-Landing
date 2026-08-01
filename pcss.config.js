import postcssImport from "postcss-import";
import postcssNested from "postcss-nested";
import autoprefixer from "autoprefixer";

export default {
	input: ["./pcss/main.pcss"],
	output: "./web-folder/css/app-bundle.css",

	watchPath: ["./pcss/**/*"],

	plugins: [postcssImport(), postcssNested(), autoprefixer()],
};
