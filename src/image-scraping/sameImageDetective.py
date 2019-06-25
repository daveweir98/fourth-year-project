from __future__ import print_function
import glob
import cv2
import numpy
import sys
import os
import time

start = time.time()

filenames = [img for img in glob.glob("../../../../college/validCarImages_dent/*")]
filenames += [img for img in glob.glob("../../../../college/validCarImages_scratch/*")]
filenames += [img for img in glob.glob("../../../../Downloads/GoogleImages/*")]

print("Starting comparison")

filesToBeRemoved = set()

for index, image in enumerate(filenames):
    print(str(index) + "/" + str(len(filenames)), end='\r')
    sys.stdout.flush()
    imageMatrix = cv2.imread(image)
    for i in range(index, len(filenames)):
        checkImage = filenames[i]
        imageCheckMatrix = cv2.imread(checkImage)
        if ( image != checkImage and numpy.array_equal(imageMatrix, imageCheckMatrix) ):
            print(image)
            print(checkImage)
            print("Duplicates======================================")
            filesToBeRemoved.add(checkImage)

print("Starting deletion")

for file in filesToBeRemoved:
    print("------------------------------")
    print("Removed: " + checkImage)
    os.remove(file)


end = time.time()
print(("Completed in, {}, seconds").format(end-start))