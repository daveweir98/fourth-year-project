from flask import Flask, request, Response, json
import requests
import cv2
import numpy as np
from predictor import predictor
import base64
import random

app = Flask(__name__)


@app.route('/performPredictions', methods=['POST'])
def perform_predictions():

    frontImage = request.files.get("frontImage")
    sideImage = request.files.get("sideImage")
    carRegistration = request.form["carRegistration"]

    frontImageBytes = frontImage.read()
    sideImageBytes = sideImage.read()

    imagesBytes = [frontImageBytes, sideImageBytes]

    frontImage = convertBytesToImage(frontImageBytes)
    sideImage = convertBytesToImage(sideImageBytes)

    images = [frontImage, sideImage]

    prediction = predictor(images)

    # ensure the car is valid
    if carPresentInDatabase(carRegistration):

        # save images and create appraisal if damage is detected

        if prediction != 0 or assignRandomCar():
            imagesId = saveCarImages(imagesBytes, carRegistration)
            sendCarForAppraisal(carRegistration, imagesId)

        responseContent = {
            'status': 200,
            'message': 'Images predicted successfully',
            'prediction': prediction,
            'carRegistration': carRegistration
        }
    else:
        responseContent = {
            'status': 200,
            'message': "Invalid Car, Registration Not Found",
            'carRegistration': carRegistration
        }

    response = json.dumps(responseContent)

    response = Response(response, status=200, mimetype='application/json')

    return response


@app.route('/validCarRegistration', methods=['GET'])
def validCarRegistration():
    carReg = request.form['carRegistration']

    if carPresentInDatabase(carReg):
        responseContent = {
            'status': 200,
            'message': 'Car present in database',
            'carRegistration': carReg,
            'present': True
        }
    else:
        responseContent = {
            'status': 200,
            'message': 'Car not present in database',
            'carRegistration': carReg,
            'present': False
        }

    response = json.dumps(responseContent)

    response = Response(response, status=200, mimetype='application/json')

    return response


def convertBytesToImage(imageBytes):
    nparr = np.fromstring(imageBytes, np.uint8)

    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    return img


def assignRandomCar():
    return random.randrange(10) in [1]


def saveCarImages(imagesBytes, carRegistration):

    frontBytes = base64.b64encode(imagesBytes[0])
    sideBytes = base64.b64encode(imagesBytes[1])

    data = {
        "carRegistration": carRegistration,
        "front": frontBytes,
        "back": frontBytes,
        "left_side": sideBytes,
        "right_side": sideBytes,
    }

    data = json.dumps(data)

    response = requests.post("http://localhost:8080/addNewImages", data)

    return response.content


def sendCarForAppraisal(carRegistration, imagesId):
    data = {
        "carAccess": carRegistration,
        "imagesAccess": imagesId,
    }

    data = json.dumps(data)

    requests.post("http://localhost:8080/addNewAppraisal", data)


def carPresentInDatabase(carRegistration):
    data = {
        "queryCarRegistration": carRegistration
    }

    response = requests.get("http://localhost:8080/getCar", params=data)

    carFound = response.content != ""

    return carFound


if __name__ == '__main__':
    #app.run(debug=True)
    app.run(host='0.0.0.0')