package restapi.dataAccess;

import org.springframework.data.jpa.repository.JpaRepository;

import restapi.dataAccess.CarAccess;

public interface CarRepository extends JpaRepository<CarAccess, Integer> {

    public CarAccess findByCarRegistration(String carRegistration);

}