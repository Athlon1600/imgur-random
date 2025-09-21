const esbuild = require("esbuild");
const fs = require("fs");
const chokidar = require("chokidar");
const {rimraf} = require("rimraf");

const isProduction = (process.argv || []).includes("--prod");
const isWatchMode = (process.argv || []).includes('--watch');

function clearAssets() {
    rimraf.rimrafSync("public/assets/*", {
        glob: true
    });
}

function exit() {
    process.exit(0);
}

async function buildJS(customOptions = {}) {

    const defaultOptions = {
        entryPoints: ["src/js/main.js"],
        bundle: true,
        sourcemap: !isProduction,
        outfile: "public/assets/app.js",
        minify: isProduction,
    };

    return esbuild.build({...defaultOptions, ...customOptions});
}

async function safeBuildJs() {

    try {
        const start = performance.now();
        await buildJS();
        const buildTime = performance.now() - start;
        console.log(`✅ JS build complete in ${buildTime.toFixed(2)} ms`);
    } catch (err) {
        console.error("❌ JS build failed", err);
    }
}


async function buildCSS(customOptions = {}) {

    const defaultOptions = {
        entryPoints: ["src/css/main.css"],
        bundle: true,
        sourcemap: !isProduction,
        outfile: "public/assets/styles.css",
        minify: isProduction,
    };

    return esbuild.build({...defaultOptions, ...customOptions});
}

async function safeBuildCSS() {

    try {
        const start = performance.now();
        await buildCSS();
        const buildTime = performance.now() - start;
        console.log(`✅ CSS build complete in ${buildTime.toFixed(2)} ms`);
    } catch (err) {
        console.error("❌ CSS build failed", err);
    }
}

if (isWatchMode) {

    const watcher = chokidar.watch("./src", {
        ignoreInitial: true,
        usePolling: false,
        awaitWriteFinish: false
    }).on("all", (eventName, filePath) => {

        const name = (filePath || "");
        console.log(`Change detected - ${name}`);

        // watch for template updates too
        if (name.endsWith("index.html")) {
            fs.copyFileSync("./src/index.html", "./public/index.html");
        }

        if (name.endsWith(".js")) {
            safeBuildJs();
        }

        if (name.endsWith(".css")) {
            safeBuildCSS();
        }

    });

    watcher.on('ready', async () => {
        console.log('Chokidar is ready to watch for changes...');

        fs.copyFileSync("./src/index.html", "./public/index.html");
        // do first build
        safeBuildJs();
        safeBuildCSS();
    });

} else {

    (async () => {

        console.log("Running build...");

        clearAssets();

        const scriptResult = await buildJS({
            write: false
        });

        const scriptFiles = scriptResult.outputFiles.filter(f => !f.path.endsWith('.map'));

        const cssResult = await buildCSS({
            write: false
        });

        const cssFiles = cssResult.outputFiles.filter(f => !f.path.endsWith('.map'));

        // will contain embedded CSS and JS by default
        fs.copyFileSync("src/index.html", "public/index.html");

        let templateContents = fs.readFileSync("./src/index.html", "utf8");

        // inline SCRIPT
        const code = scriptFiles[0].text;
        templateContents = templateContents.replace(/<script[^>]+app\.js[^>]*>/, "<script>" + code);

        // inline CSS
        const styles = cssFiles[0].text;
        templateContents = templateContents.replace(/<link[^>]+styles\.css[^>]*>/, `<style>${styles}</style>`);
        fs.writeFileSync("./public/index.html", templateContents);

        console.log("✅ All builds complete");
    })();
}

