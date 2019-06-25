from __future__ import print_function
import sys
import os
import cv2
import numpy as np

svm = cv2.ml.SVM_load('model.xml')
hog = cv2.HOGDescriptor()

filePath = sys.argv[1]

image = cv2.imread(filePath)

image = cv2.resize(image, (128, 128))

hist = [hog.compute(image)]

hist = np.array(hist)

p = svm.predict(hist)

print((p[1][0][0]).astype(int))
