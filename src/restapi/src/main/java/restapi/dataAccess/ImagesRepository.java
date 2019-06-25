package restapi.dataAccess;

import org.springframework.data.jpa.repository.JpaRepository;

import restapi.dataAccess.ImagesAccess;

public interface ImagesRepository extends JpaRepository<ImagesAccess, Integer> {
    public ImagesAccess findByImagesId(int imagesId);
}