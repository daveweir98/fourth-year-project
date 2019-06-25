package restapi.dataAccess;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.Column;
import java.util.HashMap;

@Entity
@Table(name="images")
public class ImagesAccess {

    @Id
    @GeneratedValue
    @Column(name="images_id")
    private int imagesId;
    private String front;
    private String back;
    private String left_side;
    private String right_side;

    public int getImagesId() {
        return imagesId;
    }

    public String getFront() {
        return front;
    }

    public String getBack() {
        return back;
    }

    public String getLeft_side() {
        return left_side;
    }

    public String getRight_side() {
        return right_side;
    }

    public ImagesAccess(HashMap<String, String> imageLocations) {
        this.front = imageLocations.get("front");
        this.back = imageLocations.get("back");
        this.left_side = imageLocations.get("left_side");
        this.right_side = imageLocations.get("right_side");
    }

    public ImagesAccess() {}


}