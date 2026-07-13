CREATE TABLE `users` (
    id_user INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_user),
    UNIQUE (email)
) ENGINE=InnoDB;

CREATE TABLE vehicles (
    id_vehicle INT NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(255),
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    immat VARCHAR(50) NOT NULL,
    first_immat_date DATE,
    fuel_type VARCHAR(50),
    transmission_type VARCHAR(50),
    power INT,
    mileage_km INT,
    maintenance_interval_km INT,
    maintenance_interval_time INT,
    id_user INT NOT NULL,
    PRIMARY KEY (id_vehicle),
    UNIQUE (immat),
    CONSTRAINT fk_vehicle_user FOREIGN KEY (id_user) REFERENCES `users` (id_user)
) ENGINE=InnoDB;

CREATE TABLE maintenances (
    id_maintenance INT NOT NULL AUTO_INCREMENT,
    maintenance_date DATE,
    maintenance_km INT,
    id_vehicle INT NOT NULL,
    PRIMARY KEY (id_maintenance),
    CONSTRAINT fk_maintenance_vehicle FOREIGN KEY (id_vehicle) REFERENCES vehicles (id_vehicle)
) ENGINE=InnoDB;