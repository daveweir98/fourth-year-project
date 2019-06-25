from __future__ import print_function
import cv2
import numpy as np
import os
import sys
import time
import gc

startTime = time.localtime()
startTime = time.strftime("%m/%d/%Y, %H:%M:%S", startTime)
print(startTime)

TRAIN_IMAGES = "/home/david/college/car_damage_dataset_augmented/train"

categories = os.listdir(TRAIN_IMAGES)

svm = cv2.ml.SVM_create()
svm.setKernel(cv2.ml.SVM_RBF)
hog = cv2.HOGDescriptor()

trainData = []
trainLabels = []

categoriesAsNumbers = {"undamaged": 0, "dented": 1, "scraped": 2}

imagesByCategory = {}

for categoryName in categories:
    imageFiles = os.listdir(TRAIN_IMAGES + "/" + categoryName)
    imagesByCategory[categoryName] = imageFiles

print ("CREATING TRAINING DATA & LABELS")

imageCount = 0
for category, files in imagesByCategory.iteritems():
    for imageFile in files:

        print (category + ": " + str(imageCount), end='\r')
        sys.stdout.flush()

        filePath = "{}/{}/{}".format(TRAIN_IMAGES, category, imageFile)

        image = cv2.imread(filePath)

        image = cv2.resize(image, (128, 128))

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY, 0)

        hist = hog.compute(image)

        trainData.append(hist)

        if categoriesAsNumbers[category] == 1 or categoriesAsNumbers[category] == 2:
            trainLabels.append(1)
        else:
            trainLabels.append(0)
        """
        trainLabels.append(categoriesAsNumbers[category])
        """

        imageCount += 1

    print (category)

trainData = np.array(trainData)
trainLabels = np.array(trainLabels)

indices = np.arange(trainLabels.shape[0])
print (trainLabels.shape)
np.random.shuffle(indices)
data = trainData[indices]
labels = trainLabels[indices]

print(labels)
print(type(trainLabels))

gc.collect()
#del data
del trainData
del trainLabels
del imagesByCategory

print("TRAINING")
print(trainData.shape)

trainedModel = svm.trainAuto(data, cv2.ml.ROW_SAMPLE, labels)
svm.save("./model.xml")

endTime = time.localtime()
endTime = time.strftime("%m/%d/%Y, %H:%M:%S", endTime)

print("FINISHED")
print("Start Time: {}".format(startTime))
print("End   Time: {}".format(endTime))
