package restapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.ResponseEntity;
import com.google.gson.JsonParser;
import com.google.gson.JsonObject;

import java.time.ZoneId;
import java.util.Base64;
import java.util.HashMap;
import java.time.LocalDate;

import java.io.ByteArrayInputStream;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;
import java.time.Instant;

import restapi.dataAccess.CarAccess;
import restapi.dataAccess.CarRepository;
import restapi.dataAccess.AppraisalAccess;
import restapi.dataAccess.AppraisalRepository;
import restapi.dataAccess.ImagesAccess;
import restapi.dataAccess.ImagesRepository;

@RestController
public class PostController {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private AppraisalRepository appraisalRepository;

    @Autowired
    private ImagesRepository imagesRepository;

    @RequestMapping(value = "/addNewCar")
    @PostMapping
    public ResponseEntity<?> addNewCar(@RequestBody CarAccess newCar) {

        if (carRepository.findByCarRegistration(newCar.getCarRegistration()) == null) {
            carRepository.save(newCar);
            return ResponseEntity.accepted().build();
        } else {
            return ResponseEntity.ok("Duplicate Registration");
        }
    }

    @RequestMapping(value = "/addNewAppraisal")
    @PostMapping
    public ResponseEntity<?> addNewAppraisal(@RequestBody String newAppraisalData) {
        JsonParser parser = new JsonParser();
        JsonObject newAppraisalJson = parser.parse(newAppraisalData).getAsJsonObject();

        AppraisalAccess newAppraisal = constructAppraisalAccess(newAppraisalJson);

        appraisalRepository.save(newAppraisal);
        return ResponseEntity.accepted().build();
    }

    @RequestMapping(value = "/addNewImages")
    @PostMapping
    public  ResponseEntity<?> addNewImages(@RequestBody String newImagesAsString) {
        System.out.println("ADD IMAGES2");

        HashMap<String, String> imageLocations = saveImagesToLocalStorage(newImagesAsString);

        System.out.println(imageLocations);

        int imagesId = writeImageLocationsToDataBase(imageLocations);

        return ResponseEntity.ok(imagesId);
    }

    private long getCarReturnDate(String carRegistration) {
        LocalDate date = LocalDate.now();
        ZoneId zoneId = ZoneId.of("Europe/Dublin");
        return date.atStartOfDay(zoneId).toEpochSecond();
    }

    // Mock function, production function would retrieve rental date from rental companies database
    // currently hard-coded to say every rental is 1 week long from return date
    private long getCarRentalDate(String carRegistration) {
        LocalDate date = LocalDate.now().minusDays(7);
        ZoneId zoneId = ZoneId.of("Europe/Dublin");
        return date.atStartOfDay(zoneId).toEpochSecond();
    }

    private AppraisalAccess constructAppraisalAccess(JsonObject newAppraisalJson) {
        HashMap<String, Object> newAppraisalMap = new HashMap<String, Object>();

        String carRegistration = newAppraisalJson.get("carAccess").getAsString();
        int imagesId = newAppraisalJson.get("imagesAccess").getAsInt();

        long returnDate = getCarReturnDate(carRegistration);
        newAppraisalMap.put("returnDate", returnDate);

        long rentalDate = getCarRentalDate(carRegistration);
        newAppraisalMap.put("rentalDate", rentalDate);

        newAppraisalMap.put("appraisalComplete", false);

        newAppraisalMap.put("damagePresent", true);

        CarAccess carAccess = carRepository.findByCarRegistration(carRegistration);
        newAppraisalMap.put("carAccess", carAccess);

        ImagesAccess imagesAccess = imagesRepository.findByImagesId(imagesId);
        newAppraisalMap.put("imagesAccess", imagesAccess);

        AppraisalAccess newAppraisal = new AppraisalAccess(newAppraisalMap);

        return newAppraisal;
    }

    private HashMap<String, String> saveImagesToLocalStorage(String newImagesAsString) {
        JsonParser parser = new JsonParser();
        JsonObject newImagesJson = parser.parse(newImagesAsString).getAsJsonObject();

        String[] imageTitles = {"front", "back", "left_side", "right_side"};
        HashMap<String, String> imageSaveLocations = new HashMap();

        String carRegistration = newImagesJson.get("carRegistration").getAsString();
        long currentEpochTime = Instant.now().getEpochSecond();

        System.out.println(currentEpochTime);

        for (String imageTitle : imageTitles) {
            byte[] imageBytes = Base64.getDecoder().decode(newImagesJson.get(imageTitle).getAsString());

            try {
                ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
                BufferedImage bImage2 = ImageIO.read(bis);

                String outputFileName = String.format("/appraisalImages/%s/%s/%s.jpg", carRegistration, currentEpochTime, imageTitle);

                File outputFile = new File(outputFileName);

                outputFile.getParentFile().mkdirs();

                ImageIO.write(bImage2, "jpg", outputFile);

                imageSaveLocations.put(imageTitle, outputFile.getAbsolutePath());

            } catch (Exception e) {
                System.out.println(e);
            }
        }

        return imageSaveLocations;
    }

    private int writeImageLocationsToDataBase(HashMap<String, String> imageLocations) {

        ImagesAccess images = new ImagesAccess(imageLocations);

        imagesRepository.save(images);
        imagesRepository.flush();

        return images.getImagesId();
    }
}
