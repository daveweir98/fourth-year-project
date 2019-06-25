
export const EXPECTED_APPRAISALS : JSON = JSON.parse("[\n" +
    "    {\n" +
    "        \"appraisalId\": 1,\n" +
    "        \"rentalDate\": 892468800,\n" +
    "        \"returnDate\": 1555156800,\n" +
    "        \"appraisalComplete\": false,\n" +
    "        \"carAccess\": {\n" +
    "            \"carRegistration\": \"06-D-11580\",\n" +
    "            \"make\": \"Nissan\",\n" +
    "            \"model\": \"Micra\"\n" +
    "        },\n" +
    "        \"imagesAccess\": {\n" +
    "            \"imagesId\": 6,\n" +
    "            \"front\": \"/appraisalImages/06-D-11580/1550233020/front.jpg\",\n" +
    "            \"back\": \"/appraisalImages/06-D-11580/1550233020/back.jpg\",\n" +
    "            \"left_side\": \"/appraisalImages/06-D-11580/1550233020/left_side.jpg\",\n" +
    "            \"right_side\": \"/appraisalImages/06-D-11580/1550233020/right_side.jpg\"\n" +
    "        }\n" +
    "    },\n" +
    "    {\n" +
    "        \"appraisalId\": 2,\n" +
    "        \"rentalDate\": 913680000 ,\n" +
    "        \"returnDate\": 1556197200 ,\n" +
    "        \"appraisalComplete\": false,\n" +
    "        \"carAccess\": {\n" +
    "            \"carRegistration\": \"06-D-11580\",\n" +
    "            \"make\": \"Nissan\",\n" +
    "            \"model\": \"Micra\"\n" +
    "        },\n" +
    "        \"imagesAccess\": {\n" +
    "            \"imagesId\": 2,\n" +
    "            \"front\": \"/home/david/college/2019-ca400-weird3/src/restapi/src/main/resources/testCar2.jpg\",\n" +
    "            \"back\": \"/home/david/college/2019-ca400-weird3/src/restapi/src/main/resources/testCar2.jpg\",\n" +
    "            \"left_side\": \"/home/david/college/2019-ca400-weird3/src/restapi/src/main/resources/testCar2.jpg\",\n" +
    "            \"right_side\": \"/home/david/college/2019-ca400-weird3/src/restapi/src/main/resources/testCar2.jpg\"\n" +
    "        }\n" +
    "    }" +
    "] "
);

export const HISTORY_KEY_DATES =  [{"rentalDate":"Apr 13, 1998", "returnDate":"Apr 13, 2019"}, {"rentalDate":"Dec 15, 1998", "returnDate":"Apr 25, 2019"}];

export const HISTORY_NO_APPRAISALS_MESSAGE = "No appraisals found for this car";

export const APPRAISALS_KEY_INFO = [{"appraisalId":1, "carInfo":"06-D-11580 (Nissan, Micra)"},{"appraisalId":2, "carInfo":"06-D-11580 (Nissan, Micra)"}];

export const NO_APPRAISALS_MESSAGE = "No Appraisals Found";

export const REPORT_EXPECTED_INFO = JSON.parse("{\n" +
    "    \"appraisalId\": 1,\n" +
    "    \"rentalDate\": 892468800 ,\n" +
    "    \"returnDate\": 1555156800 ,\n" +
    "    \"appraisalComplete\": false,\n" +
    "    \"damagePresent\": true,\n" +
    "    \"carAccess\": {\n" +
    "        \"carRegistration\": \"06-D-11580\",\n" +
    "        \"make\": \"Nissan\",\n" +
    "        \"model\": \"Micra\"\n" +
    "    },\n" +
    "    \"imagesAccess\": {\n" +
    "        \"imagesId\": 6,\n" +
    "        \"front\": \"/appraisalImages/06-D-11580/1550233020/front.jpg\",\n" +
    "        \"back\": \"/appraisalImages/06-D-11580/1550233020/back.jpg\",\n" +
    "        \"left_side\": \"/appraisalImages/06-D-11580/1550233020/left_side.jpg\",\n" +
    "        \"right_side\": \"/appraisalImages/06-D-11580/1550233020/right_side.jpg\"\n" +
    "    }\n" +
    "}"
);

export const REPORT_EXPECTED_INFO_COMPLETE = JSON.parse("{\n" +
    "    \"appraisalId\": 1,\n" +
    "    \"rentalDate\": 892468800 ,\n" +
    "    \"returnDate\": 1555156800 ,\n" +
    "    \"appraisalComplete\": true,\n" +
    "    \"damagePresent\": true,\n" +
    "    \"carAccess\": {\n" +
    "        \"carRegistration\": \"06-D-11580\",\n" +
    "        \"make\": \"Nissan\",\n" +
    "        \"model\": \"Micra\"\n" +
    "    },\n" +
    "    \"imagesAccess\": {\n" +
    "        \"imagesId\": 6,\n" +
    "        \"front\": \"/appraisalImages/06-D-11580/1550233020/front.jpg\",\n" +
    "        \"back\": \"/appraisalImages/06-D-11580/1550233020/back.jpg\",\n" +
    "        \"left_side\": \"/appraisalImages/06-D-11580/1550233020/left_side.jpg\",\n" +
    "        \"right_side\": \"/appraisalImages/06-D-11580/1550233020/right_side.jpg\"\n" +
    "    }\n" +
    "}"
);

export const REPORT_ATTRIBUTES_TO_CHECK = ["1", "06-D-11580", "Nissan", "Micra", "Apr 13, 1998", "Apr 13, 2019"];

export const NEW_CAR_ERRORS = [' A valid car registration is required', ' A valid car make is required', ' A valid car model is required', ' Must match the pattern YYY-CC-SSSSSS'];

export const SEARCH_RESULTS = JSON.parse(
    "{\n" +
    "    \"carRegistration\": \"06-D-11580\",\n" +
    "    \"make\": \"Nissan\",\n" +
    "    \"model\": \"Micra\"\n" +
    "}"
    );

export const SEARCH_COUNT = 10;

export const SEARCH_ERRORS = ['A search term is required', ' Must match the pattern YYY-CC-SSSSSS'];
