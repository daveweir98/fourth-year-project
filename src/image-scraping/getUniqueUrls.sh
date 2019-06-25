#!/bin/bash
#concatinates all downloaded urls from the browser download into one file and removes duplicate links

cat ~/Downloads/urls*.txt > ./text-files/allUrls.txt

grep -v -x -f ./text-files/downloadedURLs.txt ./text-files/allUrls.txt > ./text-files/unseenImageUrls.txt

sort ./text-files/unseenImageUrls.txt | uniq > ./text-files/uniqueImageUrls.txt
