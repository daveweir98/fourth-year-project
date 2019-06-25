import cv2
import numpy as np

# Bag of Visual Words Deployment
"""
def predictor(image):

    svm = cv2.ml.SVM_load('model.xml')

    cookbook = np.genfromtxt("cookbook.txt", delimiter=" ")

    cookbook = np.float32(cookbook)

    numOfClasses = 25
    bagOfVisualWords = cv2.BOWKMeansTrainer(numOfClasses)

    cookbook = bagOfVisualWords.cluster(cookbook)

    surf = cv2.xfeatures2d.SURF_create()

    bagOfVisualWordsImageExtractor = cv2.BOWImgDescriptorExtractor(surf, cv2.BFMatcher(cv2.NORM_L2))

    bagOfVisualWordsImageExtractor.setVocabulary(cookbook)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY, 0)

    kp, des = surf.detectAndCompute(gray, None)

    bowDescriptors = bagOfVisualWordsImageExtractor.compute(image, kp)

    output = svm.predict(bowDescriptors)

    prediction = (output[1][0][0]).astype(int)

    return prediction
"""

def predictor(images):

    svm = cv2.ml.SVM_load('model.xml')

    hog = cv2.HOGDescriptor()

    hist = []

    for image in images:
        image = cv2.resize(image, (128, 128))

        hist += [hog.compute(image)]

    hist = np.array(hist)

    output = svm.predict(hist)


    # if damage present in any image, mark car as damaged
    prediction = (max(output[1])[0]).astype(int)

    return prediction