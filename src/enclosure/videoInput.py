import cv2
import gc
import time
import re
import requests
import json
import argparse
from regDetect import parseImageForRegistration
from captureAllImages import captureAllImagesOfCar

irish_registration_plate_pattern = r'[0-9]{2,3}-[A-Z]{1,2}-[0-9]{1,6}'

locationIpAddress = ""

def beginVideoParse():
    print("Begin image parsing...")
    carReg = videoInput()

    if validCarRegistration(carReg):
        captureAllImagesOfCar()
        sendImagesForAppraisal(carReg)
    else:
        print("Invalid Registration: {}, retrying scan".format(carReg))
        beginVideoParse()

def videoInput():
    cap = cv2.VideoCapture('/dev/v4l/by-path/platform-3f980000.usb-usb-0:1.3:1.0-video-index0')

    ret, frame = cap.read()
    start_time = round(cap.get(cv2.CAP_PROP_POS_MSEC) / 1000) - 1

    oneCheckPerFrameGroup = set()
    while(True):

        ret, frame = cap.read()
        cv2.imwrite("img.jpg", frame)

        currentTime = round(cap.get(cv2.CAP_PROP_POS_MSEC) / 1000)
        frameNo = currentTime - start_time

        # take a frame on every 10th second, only check one frame from each second
        if frameNo % 10 == 0 and frameNo not in oneCheckPerFrameGroup:
           oneCheckPerFrameGroup.add(frameNo)
           results = parseImageForRegistration("img.jpg", padding=0.8)
           for result in results:
               parsedRegPlate = stringMatchingRegistrationPlate(result)

               if parsedRegPlate != []:
                   print results
                   print("VALIDATING REGISTRATION: {} ".format(parsedRegPlate[0]))
                   outputCarReg = parsedRegPlate[0]

                   # when reg found, release the capture
                   cap.release()
                   cv2.destroyAllWindows()

                   return outputCarReg

        gc.collect()

        if(args.display):
            # display the resulting frame
            # should be hidden when running only through r-pi terminal, no UI
            cv2.imshow('frame', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        frameNo += 1


# checks if the car reg is in the database
def validCarRegistration(carReg):
    data = {'carRegistration': carReg}

    response = requests.get('http://'+locationIpAddress+':5000/validCarRegistration', data=data)

    response = json.loads(response.content)

    return response.get("present")

def stringMatchingRegistrationPlate(result):
    return re.findall(irish_registration_plate_pattern, result)

def sendImagesForAppraisal(carReg):
    files = {"frontImage": open("frontImage.jpg"), "sideImage": open("sideImage.jpg")}
    data = {"carRegistration": carReg}

    response = requests.post('http://'+locationIpAddress+':5000/performPredictions', files=files, data=data)

    print(response.content)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("location", help="running at home OR college")
    parser.add_argument("--display", help="display video input stream of registration plate camera", action="store_true")
    args = parser.parse_args()
    if(args.location == "home"):
        locationIpAddress = "192.168.0.19"
    else:
        locationIpAddress = "10.216.32.21"
    beginVideoParse()
