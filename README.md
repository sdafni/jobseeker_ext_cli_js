# install:
1. clone this
2. npm install
3. npm run build
4. goto chrome -> extentsions -> load unpacked -> 
  select the build dir of this project
5. go to Linkedin job page - drawer should appear 
6. might need a refresh due to some bug


## debug test.html: 
run  watch-http-server -o -c-1  in /src dir
this is so that the js scripts remain in /src for the build, but also
for this server to find everything

?id=12333 is added to css link so it refreshes always

Content..css and sVGs need to be copied to public for the build to find them
TODO: script this
