#!/bin/bash

bash ./getUniqueUrls.sh

if [ -s ./text-files/uniqueImageUrls.txt ]
then
  echo 'Downloading images...'
  python imageFromURL.py --urls ~/college/2019-ca400-weird3/src/image-scraping/text-files/uniqueImageUrls.txt --output ~/Downloads/GoogleImages/
fi

if [ $? == 0 ]
then
  cat ./text-files/uniqueImageUrls.txt >> ./text-files/downloadedURLs.txt
fi
