#!/bin/bash

set -ex

prog_name=$(basename "$0")
dir_name=$(cd "$(dirname "$0")" || exit 1; pwd -P)
root_dir=${dir_name}/..

bucket="if.investorfeed.info"

aws s3 cp /var/www/favicon/ s3://${bucket}/favicon/ir --recursive

aws s3 cp ${dir_name}/resources/ s3://${bucket}/resources --recursive
