#!/bin/bash

set -ex

prog_name=$(basename "$0")
dir_name=$(cd "$(dirname "$0")" || exit 1; pwd -P)
root_dir=${dir_name}/..

copyToS3() {
  file=$1
  file_basenmae=$(basename ${file})
  s3_dest=""
  case "${file}" in
  *\.js)
    s3_dest="js/${file_basenmae}"
    ;;
  *\.css)
    s3_dest="css/${file_basenmae}"
    ;;
  *\.html)
    s3_dest="${file_basenmae}"
    ;;
  *)
    echo "Unknown file type for file: ${file}"
    exit 1
    ;;
  esac
  for bucket in w.tickertick.com www.tickertick.com tickertick.com; do
    aws s3 cp ${file} s3://${bucket}/${s3_dest}
    if [ "${file_basenmae}" = "feed.html" ]; then
      aws s3 cp ${file} s3://${bucket}/index.html
    fi
  done
}

for dir in js css; do
  for f in ${dir_name}/${dir}/*; do
    copyToS3 ${f}
  done
done

for html in ${dir_name}/*.html; do
  copyToS3 ${html}
done
