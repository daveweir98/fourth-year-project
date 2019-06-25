package restapi.dataAccess;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.Column;

import restapi.dataAccess.AppraisalAccess;

import java.util.HashMap;

@Entity
@Table(name="car")
public class CarAccess {

    @Id
    @Column(name="car_registration")
    private String carRegistration;
    private String make;
    private String model;

    public String getCarRegistration() {
        return carRegistration;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }

    public CarAccess(HashMap<String, Object> newCarMap) {
        this.carRegistration = (String) newCarMap.get("carRegistration");
        this.make = (String) newCarMap.get("make");
        this.model = (String) newCarMap.get("model");
    }

    public CarAccess() {
    }

    //@OneToMany(mappedBy="carRegistration")
    //private List<AppraisalAccess> appraisalAccessList;
}