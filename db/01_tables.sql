CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    code CHAR(5) UNIQUE NOT NULL,
    region_code CHAR(3) UNIQUE NOT NULL,
    name_bg VARCHAR(100) NOT NULL,
    name_lat VARCHAR(100),
    NUTS1 VARCHAR(5),
    NUTS2 VARCHAR(5),
    NUTS3 VARCHAR(5),
    document_code INT
);

CREATE TABLE municipalities (
    id SERIAL PRIMARY KEY,
    code CHAR(5) UNIQUE NOT NULL,
    municipality_code CHAR(5) UNIQUE NOT NULL,
    region_id INT NOT NULL, 
    name_bg VARCHAR(100) NOT NULL,
    name_lat VARCHAR(100),
    NUTS1 VARCHAR(5),
    NUTS2 VARCHAR(5),
    NUTS3 VARCHAR(5),
    category INT,
    document_code INT, 
        CONSTRAINT fk_region FOREIGN KEY (region_id) REFERENCES regions (id)
        ON UPDATE CASCADE ON DELETE RESTRICT 
);

CREATE TABLE mayoralties (
    id SERIAL PRIMARY KEY,
    id_code CHAR(8) UNIQUE NOT NULL,
    name_bg VARCHAR(100) NOT NULL,
    name_lat VARCHAR(100) NOT NULL,
    municipality_id INT NOT NULL,
    code CHAR(5) UNIQUE NOT NULL,
    NUTS1 VARCHAR(5),
    NUTS2 VARCHAR(5),
    NUTS3 VARCHAR(5),
    document_code INT,
    category INT,
    CONSTRAINT fk_municipality FOREIGN KEY (municipality_id) REFERENCES municipalities(id)
    ON UPDATE CASCADE ON DELETE RESTRICT 
);

CREATE TABLE settlements (
    id SERIAL PRIMARY KEY,
    ekatte_code CHAR(5) UNIQUE NOT NULL,
    type VARCHAR(4) UNIQUE NOT NULL,
    name_bg VARCHAR(100) NOT NULL,
    name_lat VARCHAR(100) NOT NULL,
    region_id INT NOT NULL,
    municipality_id INT NOT NULL,
    mayoralty_id INT NOT NULL,
    NUTS1 VARCHAR(5),
    NUTS2 VARCHAR(5),
    NUTS3 VARCHAR(5),
    type_code INT NOT NULL,
    category_code INT NOT NULL,
    sea_level_code INT NOT NULL,
    sea_level VARCHAR(15),
    document_code INT,
 CONSTRAINT fk_region FOREIGN KEY (region_id) REFERENCES regions(id)
        ON UPDATE CASCADE ON DELETE RESTRICT, 
    CONSTRAINT fk_municipality FOREIGN KEY (municipality_id) REFERENCES municipalities(id)
        ON UPDATE CASCADE ON DELETE RESTRICT, 
    CONSTRAINT fk_mayoralty FOREIGN KEY (mayoralty_id) REFERENCES mayoralties(id)
        ON UPDATE CASCADE ON DELETE SET NULL 
);

CREATE INDEX idx_settlements_name ON settlements(name_bg);

CREATE INDEX idx_settlements_municipality_id ON settlements(municipality_id);

CREATE INDEX idx_settlements_region_id ON settlements(region_id);