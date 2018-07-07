call npx tsc format-chart-def.ts
md build
mv format-chart-def.js build
call npx browserify format-chart-def-src.js -o ./image/format-chart-def.js
cp ./image/format-chart-def.js ./web
cp ./image/format-chart-def.js ./nodejs/public