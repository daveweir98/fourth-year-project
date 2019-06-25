from __future__ import print_function
import sys
import os
import cv2
import numpy as np
from matplotlib import pyplot as plt

UNDAMAGED_IMAGES = "/home/david/car_ims_1000_random"
SCRAPED_IMAGES = "/home/david/college/validCarImages_scratch"
DENTED_IMAGES = "/home/david/college/validCarImages_dent"

TRAIN_IMAGES = "/home/david/college/car_damage_dataset/train"
TEST_IMAGES = "/home/david/college/car_damage_dataset/test"

categories = os.listdir(TRAIN_IMAGES)

imagesByCategory = {}

for categoryName in categories:
    imageFiles = os.listdir(TRAIN_IMAGES + "/" + categoryName)
    imagesByCategory[categoryName] = imageFiles
    #print imageFiles

numOfClasses = 25#len(categories)
bagOfVisualWords = cv2.BOWKMeansTrainer(numOfClasses)

surf = cv2.xfeatures2d.SURF_create()

imageCount = 0

# create cook book

for category, files in imagesByCategory.iteritems():
    for imageFile in files:
        # extract features of each image
        print (category + ": " + str(imageCount), end='\r')
        sys.stdout.flush()

        filePath = "{}/{}/{}".format(TRAIN_IMAGES, category, imageFile)

        image = cv2.imread(filePath)

        gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY, 0)

        kp, des = surf.detectAndCompute(gray, None)

        bagOfVisualWords.add(des)

        imageCount += 1

    print (category)

print ("PERFORMING CLUSTERING")

# cluster using k means
cookbook = bagOfVisualWords.cluster()

print (type(cookbook))
print (cookbook)

np.savetxt("cookbook.txt", cookbook)

"""
print ("COOKBOOK CREATED")

bagOfVisualWordsImageExtractor = cv2.BOWImgDescriptorExtractor(surf, cv2.BFMatcher(cv2.NORM_L2))

bagOfVisualWordsImageExtractor.setVocabulary(cookbook)

trainData = []
trainLabels = []

categoriesAsNumbers = {"undamaged":0, "dented":1, "scraped":3}

for category, files in imagesByCategory.iteritems():
    for imageFile in files:

        filePath = "{}/{}/{}".format(TRAIN_IMAGES, category, imageFile)

        image = cv2.imread(filePath)

        gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY, 0)

        kp, des = surf.detectAndCompute(gray, None)

        bowDescriptors = bagOfVisualWordsImageExtractor.compute(image, kp)

        trainData.extend(bowDescriptors)

        trainLabels.append(categoriesAsNumbers[category])

print("TRAINING")

svm = cv2.SVM()
svm.train(np.array(trainData), np.array(trainLabels))

testImagesByCategory = {}

for categoryName in categories:
    imageFiles = os.listdir(TEST_IMAGES + "/" + categoryName)
    testImagesByCategory[categoryName] = imageFiles

testData = []
testLabels = []

for category, files in testImagesByCategory.iteritems():
    for imageFile in files:

        filePath = "{}/{}/{}".format(TEST_IMAGES, category, imageFile)

        image = cv2.imread(filePath)

        gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY, 0)

        kp, des = surf.detectAndCompute(gray, None)

        bowDescriptors = bagOfVisualWordsImageExtractor.compute(image, kp)

        testData.extend(bowDescriptors)

        testLabels.append(categoriesAsNumbers[category])


print("TESTING")

p = svm.predict(bowDescriptors)

    #get image

    #convert to gray

    #get surf features

    #save features of each images

#cluster images

#need to then save the model somehow
"""


