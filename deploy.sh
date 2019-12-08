#!/bin/bash

set -ex

prog_name=$(basename "$0")
dir_name=$(cd "$(dirname "$0")" || exit 1; pwd -P)
root_dir=${dir_name}/..

copyToS3() {
  file=$1
  file_basenmae=$(basename ${file})
  s3_dest=""
  mini_file="/tmp/__${file_basenmae}"
  case "${file}" in
  *\.js)
    babel ${file} --presets minify --plugins transform-remove-console > ${mini_file}
    s3_dest="js/${file_basenmae}"
    ;;
  *\.css)
    npx minify ${file}  > ${mini_file}
    s3_dest="css/${file_basenmae}"
    ;;
  *\.html)
    npx minify ${file} > ${mini_file}
    s3_dest="${file_basenmae}"
    ;;
  *)
    echo "Unknown file type for file: ${file}"
    exit 1
    ;;
  esac
  for bucket in w.tickertick.com www.tickertick.com; do
    aws s3 cp ${mini_file} s3://${bucket}/${s3_dest}
    if [ "${file_basenmae}" = "feed.html" ]; then
      aws s3 cp ${mini_file} s3://${bucket}/index.html
    fi
  done
}

for dir in js css; do
  for f in ${dir_name}/${dir}/*; do
    copyToS3 ${f}
  done
done

for html in ${dir_name}/*.html; do
  min_html=/tmp/$(basename ${html})
  cat ${html} | sed 's/bootstrap.css"/bootstrap.min.css"/' \
    | sed 's/react.development.js"/react.production.min.js"/' \
    | sed 's/react-dom.development.js"/react-dom.production.min.js"/' \
    | sed 's/react-bootstrap.js"/react-bootstrap.min.js"/' \
    | sed -r 's#^([ ]+)(console\.log\()#\1// \2#' \
    > ${min_html}
  copyToS3 ${min_html}
done
