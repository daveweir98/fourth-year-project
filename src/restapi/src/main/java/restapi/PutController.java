package restapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import restapi.dataAccess.AppraisalAccess;
import restapi.dataAccess.AppraisalRepository;

@RestController
public class PutController {

    @Autowired
    private AppraisalRepository appraisalRepository;

    @CrossOrigin("http://localhost:9000")
    @RequestMapping(value = "/markAppraisalComplete", method = RequestMethod.PUT)
    public ResponseEntity<?> markAppraisalComplete(@RequestBody String stringAppraisalId) {
        int appraisalId = Integer.parseInt(stringAppraisalId);

        AppraisalAccess appraisalAccess = appraisalRepository.findByAppraisalId(appraisalId);

        appraisalAccess.setAppraisalComplete(true);

        appraisalRepository.save(appraisalAccess);

        return ResponseEntity.accepted().build();
    }

    @CrossOrigin("http://localhost:9000")
    @RequestMapping(value = "/flagAppraisal", method = RequestMethod.PUT)
    public ResponseEntity<?> flagAppraisal(@RequestBody String stringAppraisalId) {
        int appraisalId = Integer.parseInt(stringAppraisalId);

        AppraisalAccess appraisalAccess = appraisalRepository.findByAppraisalId(appraisalId);

        appraisalAccess.setDamagePresent(false);

        appraisalRepository.save(appraisalAccess);

        return ResponseEntity.accepted().build();
    }

}