package restapi.dataAccess;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.JoinColumn;
import javax.persistence.Column;
import java.util.HashMap;

import restapi.dataAccess.CarAccess;
import restapi.dataAccess.CarRepository;
import restapi.dataAccess.ImagesAccess;
import restapi.dataAccess.ImagesRepository;

@Entity
@Table(name="appraisals")
public class AppraisalAccess {

    @Id
    @GeneratedValue
    @Column(name="appraisal_id")
    private int appraisalId;
    @Column(name="rentalDate")
    private long rentalDate;
    @Column(name="returnDate")
    private long returnDate;
    @Column(name="appraisal_complete")
    private boolean appraisalComplete;
    @Column(name="damage_present")
    private boolean damagePresent;

    public int getAppraisalId() {
        return appraisalId;
    }

    public long getRentalDate() {
        return rentalDate;
    }

    public long getReturnDate() {
        return returnDate;
    }

    public boolean getAppraisalComplete() {
        return appraisalComplete;
    }

    public void setAppraisalComplete(boolean appraisalStatus) {
        this.appraisalComplete = appraisalStatus;
    }

    public  boolean getDamagePresent() {
        return damagePresent;
    }

    public void setDamagePresent(boolean damagePresent) {
        this.damagePresent = damagePresent;
    }

    @ManyToOne
    @JoinColumn(name="car_registration")
    private CarAccess carAccess;

    public CarAccess getCarAccess() {
        return carAccess;
    }

    @OneToOne
    @JoinColumn(name="images_id")
    private ImagesAccess imagesAccess;

    public ImagesAccess getImagesAccess() {
        return imagesAccess;
    }

    public AppraisalAccess(HashMap<String, Object> newAppraisalMap) {
        this.rentalDate = (long) newAppraisalMap.get("rentalDate");
        this.returnDate = (long) newAppraisalMap.get("returnDate");
        this.appraisalComplete = (boolean) newAppraisalMap.get("appraisalComplete");
        this.damagePresent = (boolean) newAppraisalMap.get("damagePresent");
        this.carAccess = (CarAccess) newAppraisalMap.get("carAccess");
        this.imagesAccess = (ImagesAccess) newAppraisalMap.get("imagesAccess");
    }

    public AppraisalAccess() {

    }
}