from keras.preprocessing.image import ImageDataGenerator

# number of images in the class
batch_size = 600

datagen = ImageDataGenerator(
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.1,
    horizontal_flip=True,
    brightness_range=(0.6, 1.4),
    fill_mode='constant')

validation_generator = datagen.flow_from_directory(
    save_format='jpg',
    save_to_dir='/home/david/college/car_damage_dataset_augmented2/scraped',
    directory='/home/david/college/car_damage_dataset_augmented/scraped2',
    target_size=(256, 256),
    batch_size=batch_size,
    class_mode='categorical')

# new images per class
number_of_new_images = 20

i = 0
for batch in validation_generator:
    i += 1
    if i >= number_of_new_images:
        break

print("FINISHED")
