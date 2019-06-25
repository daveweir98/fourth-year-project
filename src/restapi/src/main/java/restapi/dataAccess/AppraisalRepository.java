package restapi.dataAccess;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import restapi.dataAccess.AppraisalAccess;

public interface AppraisalRepository extends JpaRepository<AppraisalAccess, Integer> {

    public String selectByRegistration = "SELECT * FROM appraisals a WHERE a.car_registration = :queryRegistration ;";

    @Query(value = selectByRegistration, nativeQuery=true)
    public AppraisalAccess findByCarRegistration(@Param("queryRegistration") String queryRegistration);

    //public String selectByAppraisalsComplete = "SELECT * FROM appraisals INNER JOIN car on appraisals.car_registration  = car.car_registration AND appraisals.appraisal_complete = true;";
    public String selectByAppraisalsComplete = "SELECT * FROM appraisals a, car c WHERE c.car_registration = '06-D-11580';";

    public List<AppraisalAccess> findByAppraisalCompleteFalse();

    public AppraisalAccess findByAppraisalId(int appraisalId);

    public Long countByCarAccessCarRegistration(String carRegistration);

    public List<AppraisalAccess> findByCarAccessCarRegistrationOrderByReturnDateDesc(String carRegistration);

}