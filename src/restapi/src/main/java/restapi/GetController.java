package restapi;

import java.util.concurrent.atomic.AtomicLong;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.MediaType;
import org.apache.commons.io.IOUtils;
import java.io.InputStream;
import java.util.List;
import java.io.File;
import java.io.FileInputStream;

import restapi.dataAccess.AppraisalAccess;
import restapi.dataAccess.AppraisalRepository;
import restapi.dataAccess.CarAccess;
import restapi.dataAccess.CarRepository;

@RestController
public class GetController {

    @Autowired
    private AppraisalRepository appraisalRepository;

    @Autowired
    private CarRepository carRepository;

    @RequestMapping(value = "/getImage", produces = MediaType.IMAGE_JPEG_VALUE, method = RequestMethod.GET)
    public byte[] getDisplayImage(@RequestParam(value="filepath", defaultValue="/404.png") String filepath) {
        try {
            File imageFile = new File(filepath);
            InputStream in = new FileInputStream(imageFile);
            // if no image entry, display 404 image
            if (in == null) {
                in = getClass().getResourceAsStream("/404.png");
            }
            byte[] outputByteArray = IOUtils.toByteArray(in);
            return outputByteArray;
        } catch (java.io.IOException e) {
            // if file does not exist, display 404
            System.out.println("ERROR" + e);
            InputStream in = getClass().getResourceAsStream("/404.png");
            try {
                return IOUtils.toByteArray(in);
            } catch (java.io.IOException f) {
                // print if no 404 image found
                System.out.println("Default 404 not found");
                return new byte[1];
            }
        }
    }

    // return hard coded values for UI population
    @RequestMapping(value = "/getAwaitingAppraisals", method = RequestMethod.GET)
    public List<AppraisalAccess> getAwaitingAppraisals() {

        List<AppraisalAccess> appraisals = appraisalRepository.findByAppraisalCompleteFalse();

        return appraisals;
    }

    @RequestMapping(value="/getReport", method = RequestMethod.GET)
    public AppraisalAccess getDamageReport(@RequestParam String stringAppraisalId) {

        int appraisalId = Integer.parseInt(stringAppraisalId);

        AppraisalAccess report = appraisalRepository.findByAppraisalId(appraisalId);

        return report;

    }

    @RequestMapping(value="/getSearchResults", method = RequestMethod.GET)
    public CarAccess getSearchResults(@RequestParam(value="queryCarRegistration") String queryCarRegistration) {
        CarAccess resultCar = carRepository.findByCarRegistration(queryCarRegistration);

        return resultCar;
    }

    @RequestMapping(value="/getNumberOfAppraisalsByCar", method = RequestMethod.GET)
    public Long getNumAppraisalsByCar(@RequestParam(value="queryCarRegistration") String queryCarRegistration) {
        return appraisalRepository.countByCarAccessCarRegistration(queryCarRegistration);
    }

    @RequestMapping(value="/getAllAppraisalsForCar", method = RequestMethod.GET)
    public List<AppraisalAccess> getAppraisalsForCar(@RequestParam(value="queryCarRegistration") String queryCarRegistration) {
        return appraisalRepository.findByCarAccessCarRegistrationOrderByReturnDateDesc(queryCarRegistration);
    }

    @RequestMapping(value="getCar", method = RequestMethod.GET)
    public CarAccess getCar(@RequestParam(value="queryCarRegistration") String queryCarRegistration) {
        return carRepository.findByCarRegistration(queryCarRegistration);
    }
}