package restapi;

import org.apache.commons.io.IOUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import restapi.dataAccess.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import static org.hamcrest.CoreMatchers.instanceOf;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
@WebMvcTest(GetController.class )
public class GetControllerTest {

    private AppraisalAccess defaultAppraisalAccess = createDefaultAppraisal();

    private CarAccess defaultCarAccess = createDefaultCar();

    private byte[] testImage = getDefaultImage("testCar2.jpg");

    private byte[] image404 = getDefaultImage("404.png");

    @Mock
    private AppraisalRepository appraisalRepositoryMock;

    @Mock
    private CarRepository carRepositoryMock;

    @InjectMocks
    GetController getController;

    @Test
    public void whenGetDisplayImage_givenFilePath_returnImage() throws Exception {

        // get the absolute path to resources directory
        URL res = getClass().getClassLoader().getResource("testCar2.jpg");
        File file = Paths.get(res.toURI()).toFile();
        String filepath = file.getAbsolutePath();

        byte[] outputImage = getController.getDisplayImage(filepath);

        assertArrayEquals(outputImage, testImage);
    }

    @Test
    public void whenGetDisplayImage_givenInvalidFilePath_return404Image() throws Exception {
        String filepath = "invalidFile";

        byte[] outputImage = getController.getDisplayImage(filepath);

        assertArrayEquals(outputImage, image404);
    }

    @Test
    public void whenGetDamageReport_returnValidReport() throws Exception {
        String appraisalId = "0";

        when(appraisalRepositoryMock.findByAppraisalId(0)).thenReturn(defaultAppraisalAccess);

        AppraisalAccess appraisal = getController.getDamageReport(appraisalId);

        assertEquals(appraisal.getAppraisalId(), 0);
        assertEquals(appraisal.getRentalDate(), 892468811L);
        assertEquals(appraisal.getReturnDate(), 892468800L);
        assertFalse(appraisal.getAppraisalComplete());
        assertTrue(appraisal.getDamagePresent());
        assertThat(appraisal.getCarAccess(), instanceOf(CarAccess.class));
        assertThat(appraisal.getImagesAccess(), instanceOf(ImagesAccess.class));
    }

    @Test
    public void whenGetAwaitingAppraisals_returnListOfAppraisals() throws Exception {
        when(appraisalRepositoryMock.findByAppraisalCompleteFalse()).thenReturn(new ArrayList<AppraisalAccess>(Arrays.asList(defaultAppraisalAccess, defaultAppraisalAccess)));

        List<AppraisalAccess> awaitingAppraisals = getController.getAwaitingAppraisals();

        assertEquals(awaitingAppraisals.size(), 2);
        assertThat(awaitingAppraisals, is(new ArrayList<AppraisalAccess>(Arrays.asList(defaultAppraisalAccess, defaultAppraisalAccess))));
    }

    @Test
    public void whenGetSearchResults_returnValidCarAccess() throws Exception {
        String searchTerm = "06-D-11580";

        when(carRepositoryMock.findByCarRegistration(searchTerm)).thenReturn(defaultCarAccess);

        CarAccess searchResult = getController.getSearchResults(searchTerm);

        assertEquals(searchResult.getCarRegistration(), "06-D-11580");
        assertEquals(searchResult.getMake(), "Nissan");
        assertEquals(searchResult.getModel(), "Micra");
    }

    @Test
    public void whenGetNumAppraisalsByCar_returnLongNumberAsCount() throws Exception {
        String carRegistration = "06-D-11580";

        when(appraisalRepositoryMock.countByCarAccessCarRegistration(carRegistration)).thenReturn(1L);

        Long count = getController.getNumAppraisalsByCar(carRegistration);

        assertEquals(count, (Long) 1L);
    }

    @Test
    public void whenGetAppraisalsForCar_returnAllAppraisalsForACar() throws Exception {
        String carRegistration = "06-D-11580";

        when(appraisalRepositoryMock.findByCarAccessCarRegistrationOrderByReturnDateDesc(carRegistration)).thenReturn(new ArrayList<AppraisalAccess>(Arrays.asList(defaultAppraisalAccess, defaultAppraisalAccess)));

        List<AppraisalAccess> allAppraisals = getController.getAppraisalsForCar(carRegistration);

        assertEquals(allAppraisals.size(), 2);
        assertThat(allAppraisals, is(new ArrayList<AppraisalAccess>(Arrays.asList(defaultAppraisalAccess, defaultAppraisalAccess))));
    }

    @Test
    public void whenGetCar_returnValidCarAccess() throws Exception {
        String searchTerm = "06-D-11580";

        when(carRepositoryMock.findByCarRegistration(searchTerm)).thenReturn(defaultCarAccess);

        CarAccess searchResult = getController.getCar(searchTerm);

        assertEquals(searchResult.getCarRegistration(), "06-D-11580");
        assertEquals(searchResult.getMake(), "Nissan");
        assertEquals(searchResult.getModel(), "Micra");
    }

    public byte[] getDefaultImage(String filename) {
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();

        File imageFile = new File(classLoader.getResource(filename).getFile());
        try{
            InputStream in = new FileInputStream(imageFile);

            byte[] outputByteArray = IOUtils.toByteArray(in);
            return outputByteArray;
        } catch (java.io.IOException e) {
            System.out.println(e);
            return new byte[1];
        }

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

    public CarAccess createDefaultCar() {
        HashMap<String, Object> newCar = new HashMap<>();
        newCar.put("carRegistration", "06-D-11580");
        newCar.put("make", "Nissan");
        newCar.put("model", "Micra");

        return new CarAccess(newCar);
    }
}
