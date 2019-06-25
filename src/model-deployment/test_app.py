import pytest
import mock
import json
from requests.models import Response

import app


def requestsGetCarMock(url, params):
    response = Response()
    response.status_code = 200
    if(params["queryCarRegistration"] == "06-D-11580"):
        response._content = {"carRegistration": "06-D-11580", "make": "Nissan", "model": "Micra"}
    else:
        response._content = ""

    return response


def requestsPostNewAppraisalMock(url, data):
    data = json.loads(data)
    assert (data.get("carAccess") == "06-D-11580")
    assert (data.get("imagesAccess") == 1)

def requestsPostNewImages(url, data):
    data = json.loads(data)
    assert (5 == len(data))

    response = Response()
    response._content = 1
    return response


def test_predictor_damaged():
    with open("testCar2.jpg") as imageFile:
        f = imageFile.read()
        f = app.convertBytesToImage(f)

        images = [f, f]

        predict = app.predictor(images)

        assert(predict == 1)


def test_predictor_undamaged():
    with open("testCarUndamaged.jpg") as imageFile:
        f = imageFile.read()
        f = app.convertBytesToImage(f)

        images = [f, f]

        predict = app.predictor(images)

        assert(predict == 0)


@mock.patch('app.carPresentInDatabase', return_value=True)
@mock.patch('app.predictor', return_value=0)
@mock.patch('app.saveCarImages', return_value=1)
@mock.patch('app.sendCarForAppraisal')
def test_performPredictions_validCar_noDamage(mock_carPresent, mock_predictor, mock_saveImages, mock_sendCar):
    with open("testCar2.jpg") as imageFile:
        with open("testCar2.jpg") as imageFile2:

            predictionData = {
                "frontImage": (imageFile, 'frontImage'),
                "sideImage": (imageFile2, 'sideImage'),
                "carRegistration": "06-D-11580"
            }

            with app.app.test_request_context('/performPredictions', data=predictionData):
                response = app.perform_predictions()
                response = json.loads(response.response[0])

            assert (response["status"] == 200)
            assert (response["message"] == "Images predicted successfully")
            assert (response["prediction"] == 0)
            assert (response["carRegistration"] == "06-D-11580")


@mock.patch('app.carPresentInDatabase', return_value=True)
@mock.patch('app.predictor', return_value=1)
@mock.patch('app.saveCarImages', return_value=1)
@mock.patch('app.sendCarForAppraisal')
def test_performPredictions_validCar_damagePresent(mock_carPresent, mock_predictor, mock_saveImages, mock_sendCar):
    with open("testCar2.jpg") as imageFile:
        with open("testCar2.jpg") as imageFile2:

            predictionData = {
                "frontImage": (imageFile, 'frontImage'),
                "sideImage": (imageFile2, 'sideImage'),
                "carRegistration": "06-D-11580"
            }

            with app.app.test_request_context('/performPredictions', data=predictionData):
                response = app.perform_predictions()
                response = json.loads(response.response[0])

            assert (response["status"] == 200)
            assert (response["message"] == "Images predicted successfully")
            assert (response["prediction"] == 1)
            assert (response["carRegistration"] == "06-D-11580")


@mock.patch('app.carPresentInDatabase', return_value=False)
@mock.patch('app.predictor', return_value=1)
def test_performPredictions_validCar_invalidCar(mock_carPresent, mock_predictor):
    with open("testCar2.jpg") as imageFile:
        with open("testCar2.jpg") as imageFile2:

            predictionData = {
                "frontImage": (imageFile, 'frontImage'),
                "sideImage": (imageFile2, 'sideImage'),
                "carRegistration": "06-D-11580"
            }

            with app.app.test_request_context('/performPredictions', data=predictionData):
                response = app.perform_predictions()
                response = json.loads(response.response[0])

            assert (response["status"] == 200)
            assert (response["message"] == "Invalid Car, Registration Not Found")
            assert (response["carRegistration"] == "06-D-11580")


@mock.patch('app.carPresentInDatabase', return_value=True)
def test_validCarRegistration_validRegistration(mock_validCar):
    with app.app.test_request_context('/validCarRegistration', data={"carRegistration": "06-D-11580"}):
        response = app.validCarRegistration()
        response = json.loads(response.response[0])

        assert (response["status"] == 200)
        assert (response["message"] == "Car present in database")
        assert (response["carRegistration"] == "06-D-11580")
        assert (response["present"] == True)


@mock.patch('app.carPresentInDatabase', return_value=False)
def test_validCarRegistration_invalidRegistration(mock_validCar):
    with app.app.test_request_context('/validCarRegistration', data={"carRegistration": "06-D-11580"}):
        response = app.validCarRegistration()
        response = json.loads(response.response[0])

        assert (response["status"] == 200)
        assert (response["message"] == "Car not present in database")
        assert (response["carRegistration"] == "06-D-11580")
        assert (response["present"] == False)


def test_convertBytesToImage():
    with open("testCar2.jpg") as imageFile:
        f = imageFile.read()

        image = app.convertBytesToImage(f)

        # assert the bytes have been converted to ndarray, which is an image in opencv
        assert(type(image).__name__ == "ndarray")


@mock.patch('random.randrange', return_value=1)
def test_assignRandomCar_true(mock_random):
    result = app.assignRandomCar()

    assert(result == True)


@mock.patch('random.randrange', return_value=2)
def test_assignRandomCar_false(mock_random):
    result = app.assignRandomCar()

    assert(result == False)


@mock.patch('requests.post', side_effect=requestsPostNewAppraisalMock)
def test_sendCarForAppraisal(mock_post):
    app.sendCarForAppraisal("06-D-11580", 1)


@mock.patch('requests.post', side_effect=requestsPostNewImages)
def test_saveCarImages(mock_post):
    with open("testCar2.jpg") as imageFile:
        f = imageFile.read()
        imageBytes = [f, f]

        responseId = app.saveCarImages(imageBytes, "06-D-11580")

        assert (responseId == 1)


@mock.patch('requests.get', side_effect=requestsGetCarMock)
def test_carPresentInDatabase_validCar(mock_get):
    result = app.carPresentInDatabase("06-D-11580")

    assert(result == True)


@mock.patch('requests.get', side_effect=requestsGetCarMock)
def test_carPresentInDatabase_invalidCar(mock_get):
    result = app.carPresentInDatabase("invalidCar")

    assert(result == False)

