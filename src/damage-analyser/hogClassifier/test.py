from __future__ import print_function
import sys
import os
import numpy as np
import cv2
from sklearn.metrics import confusion_matrix, accuracy_score

TEST_IMAGES = "/home/david/college/car_damage_dataset_augmented2/test"
categories = os.listdir(TEST_IMAGES)

svm = cv2.ml.SVM_load('model.xml')
hog = cv2.HOGDescriptor()

testData = []
testLabels = []

categoriesAsNumbers = {"undamaged": 0, "dented": 1, "scraped": 2}
#categoriesAsNumbers = {"undamaged": 0, "damaged": 1,}

imagesByCategory = {}

for categoryName in categories:
    imageFiles = os.listdir(TEST_IMAGES + "/" + categoryName)
    imagesByCategory[categoryName] = imageFiles

print ("CREATING TRAINING DATA & LABELS")

imageCount = 0
for category, files in imagesByCategory.iteritems():
    for imageFile in files:

        print (category + ": " + str(imageCount), end='\r')
        sys.stdout.flush()

        filePath = "{}/{}/{}".format(TEST_IMAGES, category, imageFile)

        image = cv2.imread(filePath)

        image = cv2.resize(image, (128, 128))

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY, 0)

        hist = hog.compute(image)

        testData.append(hist)

        if categoriesAsNumbers[category] == 1 or categoriesAsNumbers[category] == 2:
            testLabels.append(1)
        else:
            testLabels.append(0)
        """
        testLabels.append(categoriesAsNumbers[category])
        """

        imageCount += 1

    print (category)

testData = np.array(testData)
testLabels = np.array(testLabels)

indices = np.arange(testLabels.shape[0])
print (testLabels.shape)
np.random.shuffle(indices)
data = testData[indices]
labels = testLabels[indices]

p = svm.predict(np.array(data))

print ("\nACCURACY")
print ("Overall: \t {}".format(accuracy_score(np.array(labels), p[1].astype(int).ravel())))

cm = confusion_matrix(np.array(labels), p[1].astype(int).ravel())

cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]

classAcc = cm.diagonal()

print("\nUndamaged:\t {}".format(classAcc[0]))
print("Dented:\t\t {}".format(classAcc[1]))
if max(testLabels == 2):
    print("Scratched:\t {}".format(classAcc[2]))

print("")
print(cm)

#print(p)