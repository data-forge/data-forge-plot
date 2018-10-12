rm -rf build/*
call npx tsc
call npm run lint

call npx browserify ./templates/c3/format-chart-def-src.js -o ./templates/c3/web/assets/format-chart-def.js
cp ./templates/c3/web/assets/format-chart-def.js ./templates/c3/nodejs/assets/public

call npx browserify ./templates/flot/format-chart-def-src.js -o ./templates/flot/web/assets/format-chart-def.js
cp ./templates/flot/web/assets/format-chart-def.js ./templates/flot/nodejs/assets/public
