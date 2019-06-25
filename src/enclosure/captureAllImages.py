import cv2


def captureAllImagesOfCar():
    frontCameraCapture = cv2.VideoCapture('/dev/v4l/by-path/platform-3f980000.usb-usb-0:1.3:1.0-video-index0')
    frontImage = captureImage(frontCameraCapture)
    cv2.imwrite("frontImage.jpg", frontImage)

    sideCameraCapture = cv2.VideoCapture('/dev/v4l/by-path/platform-3f980000.usb-usb-0:1.2:1.0-video-index0')
    sideImage = captureImage(sideCameraCapture)
    cv2.imwrite("sideImage.jpg", sideImage)

def captureImage(capture):
    ret, frame = capture.read()

    capture.release()

    return frame
