package restapi;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.ResponseEntity;
import restapi.dataAccess.AppraisalAccess;
import restapi.dataAccess.AppraisalRepository;
import restapi.dataAccess.CarAccess;
import restapi.dataAccess.ImagesAccess;

import java.util.HashMap;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
@WebMvcTest(PutController.class )
public class PutControllerTest {

    private AppraisalAccess defaultAppraisalAccess = createDefaultAppraisal();

    @Mock
    private AppraisalRepository appraisalRepositoryMock;

    @InjectMocks
    PutController putController;

    @Test
    public void whenMarkAppraisalComplete_returnAccepted() throws Exception {
        when(appraisalRepositoryMock.findByAppraisalId(1)).thenReturn(defaultAppraisalAccess);

        ResponseEntity response = putController.markAppraisalComplete("1");

        assertEquals(response.getStatusCodeValue(), 202);
    }

    @Test
    public void whenFlagAppraisal_returnAccepted() throws Exception {
        when(appraisalRepositoryMock.findByAppraisalId(1)).thenReturn(defaultAppraisalAccess);

        ResponseEntity response = putController.flagAppraisal("1");

        assertEquals(response.getStatusCodeValue(), 202);
    }

    public AppraisalAccess createDefaultAppraisal() {
        HashMap<String, Object> returnAppraisal = new HashMap<>();
        returnAppraisal.put("rentalDate", 892468811L);
        returnAppraisal.put("returnDate", 892468800L);
        returnAppraisal.put("appraisalComplete", false);
        returnAppraisal.put("damagePresent", true);
        returnAppraisal.put("carAccess", new CarAccess());
        returnAppraisal.put("imagesAccess", new ImagesAccess());

        return new AppraisalAccess(returnAppraisal);
    }
}
