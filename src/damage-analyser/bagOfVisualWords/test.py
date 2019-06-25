from __future__ import print_function
import sys
import os
import cv2
import numpy as np
from sklearn.metrics import confusion_matrix, accuracy_score, classification_report

TEST_IMAGES = "/home/david/college/car_damage_dataset/test"

svm = cv2.ml.SVM_load('model.xml')
#svm.setKernel(cv2.ml.SVM_RBF)

image = cv2.imread("scraped.jpg")

categories = os.listdir(TEST_IMAGES)

cookbook = np.genfromtxt("cookbook.txt", delimiter=" ")

cookbook = np.float32(cookbook)

numOfClasses = 25#len(categories)
bagOfVisualWords = cv2.BOWKMeansTrainer(numOfClasses)

cookbook = bagOfVisualWords.cluster(cookbook)

surf = cv2.xfeatures2d.SURF_create()

bagOfVisualWordsImageExtractor = cv2.BOWImgDescriptorExtractor(surf, cv2.BFMatcher(cv2.NORM_L2))

bagOfVisualWordsImageExtractor.setVocabulary(cookbook)

categoriesAsNumbers = {"undamaged":0, "dented":1, "scraped":3}

imagesByCategory = {}
for categoryName in categories:
    imageFiles = os.listdir(TEST_IMAGES + "/" + categoryName)
    imagesByCategory[categoryName] = imageFiles

testData = []
testLabels = []

imageCount = 0
for category, files in imagesByCategory.iteritems():
    for imageFile in files:

        filePath = "{}/{}/{}".format(TEST_IMAGES, category, imageFile)

        image = cv2.imread(filePath)

        gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY, 0)

        kp, des = surf.detectAndCompute(gray, None)

        bowDescriptors = bagOfVisualWordsImageExtractor.compute(image, kp)

        testData.extend(bowDescriptors)

        testLabels.append(categoriesAsNumbers[category])

        imageCount += 1

        print (category + ": " + str(imageCount), end='\r')
        sys.stdout.flush()

    print(category)

testData = np.array(testData)
testLabels = np.array(testLabels)

indices = np.arange(testLabels.shape[0])
print (testLabels.shape)
np.random.shuffle(indices)
data = testData[indices]
labels = testLabels[indices]

p = svm.predict(np.array(testData))

print (testData)
print (testLabels)
print (p)
print (p[1].astype(int).ravel())

#print (confusion_matrix(np.array(testLabels), p[1].astype(int).ravel()))
print ("OVERALL ACCURACY")
print (accuracy_score(np.array(testLabels), p[1].astype(int).ravel()))

print ("ACCURACY PER CLASS")
print (classification_report(np.array(testLabels), p[1].astype(int).ravel()))
