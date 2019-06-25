package restapi;

import org.apache.commons.io.FileUtils;
import org.hamcrest.CoreMatchers;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.ResponseEntity;
import restapi.dataAccess.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.nio.Buffer;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
@WebMvcTest(PostController.class )
public class PostControllerTest {

    private CarAccess defaultCarAccess = createDefaultCar();

    private ImagesAccess defaultImagesAccess = createDefaultImages();

    @Mock
    private CarRepository carRepositoryMock;

    @Mock
    private ImagesRepository imagesRepositoryMock;

    @Mock
    private AppraisalRepository appraisalRepositoryMock;

    @InjectMocks
    PostController postController;

    @Test
    public void whenAddNewCar_givenValidNewCarAccess_returnAccepted() throws Exception {
        when(carRepositoryMock.findByCarRegistration("06-D-11580")).thenReturn(null);

        ResponseEntity response = postController.addNewCar(defaultCarAccess);

        assertEquals(response.getStatusCodeValue(), 202);
    }

    @Test
    public void whenAddNewCar_givenInvalidNewCarAccess_returnDuplicateRegistration() throws Exception {
        when(carRepositoryMock.findByCarRegistration("06-D-11580")).thenReturn(defaultCarAccess);

        ResponseEntity response = postController.addNewCar(defaultCarAccess);

        assertEquals(response.getStatusCodeValue(), 200);
        assertEquals(response.getBody(), "Duplicate Registration");
    }

    @Test
    public void whenAddNewAppraisal_returnAccepted() throws Exception {
        String appraisal;
        JSONObject json = new JSONObject();
        json.put("rentalDate", 892468811L);
        json.put("returnDate", 892468800L);
        json.put("appraisalComplete", false);
        json.put("damagePresent", true);
        json.put("carAccess", "06-D-11580");
        json.put("imagesAccess", "1");

        appraisal = json.toString();

        when(carRepositoryMock.findByCarRegistration("06-D-11580")).thenReturn(defaultCarAccess);
        when(imagesRepositoryMock.findByImagesId(1)).thenReturn(defaultImagesAccess);

        ResponseEntity response = postController.addNewAppraisal(appraisal);

        assertEquals(response.getStatusCodeValue(), 202);
    }

    private  ByteArrayOutputStream outContent = new ByteArrayOutputStream();

    @Before
    public void setUpStreams() {
        System.setOut(new PrintStream(outContent));
    }


    @Test
    public void whenAddNewImages_returnOk_allImagesSaved() throws Exception {

        // create the parameters for the call
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();
        File file = new File(classLoader.getResource("testCar2.jpg").getFile());
        byte[] fileContent = FileUtils.readFileToByteArray(file);
        String imageAsBytes = Base64.getEncoder().encodeToString(fileContent);

        JSONObject json = new JSONObject();
        json.put("carRegistration", "06-D-11580");
        json.put("front", imageAsBytes);
        json.put("back", imageAsBytes);
        json.put("left_side", imageAsBytes);
        json.put("right_side", imageAsBytes);

        String imagesAsString = json.toString();

        // make the call
        postController.addNewImages(imagesAsString);

        // get the created files
        File folder = new File("/appraisalImages/06-D-11580/");

        File[] files = folder.listFiles();

        for (File subDir : files) {
            if (subDir.isDirectory()) {
                files = subDir.listFiles();
            }
        }

        // assert all files have been saved correctly to local storage
        assertEquals(files.length, 4);

        String[] filenames = {"front.jpg", "back.jpg", "left_side.jpg", "right_side.jpg"};
        Arrays.sort(files);
        Arrays.sort(filenames);
        for (int i=0; i<files.length; i++) {
            assertEquals(files[i].getName(), filenames[i]);
        }
    }

    public CarAccess createDefaultCar() {
        HashMap<String, Object> newCar = new HashMap<>();
        newCar.put("carRegistration", "06-D-11580");
        newCar.put("make", "Nissan");
        newCar.put("model", "Micra");

        return new CarAccess(newCar);
    }
    public ImagesAccess createDefaultImages() {
        HashMap<String, String> newImages = new HashMap<>();
        newImages.put("front", "/");
        newImages.put("back", "/");
        newImages.put("left_side", "/");
        newImages.put("right_side", "/");

        return new ImagesAccess(newImages);
    }
}
