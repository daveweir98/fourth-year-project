from __future__ import print_function
import cv2
import numpy as np
import os
import sys

TRAIN_IMAGES = "/home/david/college/car_damage_dataset/train"

categories = os.listdir(TRAIN_IMAGES)

cookbook = np.genfromtxt("cookbook.txt", delimiter=" ")

cookbook = np.float32(cookbook)

numOfClasses = 25#len(categories)
bagOfVisualWords = cv2.BOWKMeansTrainer(numOfClasses)

cookbook = bagOfVisualWords.cluster(cookbook)

svm = cv2.ml.SVM_create()

print ("COOKBOOK CREATED")

surf = cv2.xfeatures2d.SURF_create()

bagOfVisualWordsImageExtractor = cv2.BOWImgDescriptorExtractor(surf, cv2.BFMatcher(cv2.NORM_L2))

bagOfVisualWordsImageExtractor.setVocabulary(cookbook)

trainData = []
trainLabels = []

categoriesAsNumbers = {"undamaged": 0, "dented": 1, "scraped": 3}

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

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY, 0)

        kp, des = surf.detectAndCompute(gray, None)

        bowDescriptors = bagOfVisualWordsImageExtractor.compute(image, kp)

        trainData.extend(bowDescriptors)

        trainLabels.append(categoriesAsNumbers[category])

        imageCount += 1
    print (category)

trainData = np.array(trainData)
trainLabels = np.array(trainLabels)

indices = np.arange(trainLabels.shape[0])
print (trainLabels.shape)
np.random.shuffle(indices)
data = trainData[indices]
labels = trainLabels[indices]

print("TRAINING")

trainedModel = svm.trainAuto(trainData, cv2.ml.ROW_SAMPLE, trainLabels)
svm.save("./model.xml")