CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    document CHAR(4) UNIQUE NOT NULL,
    doc_kind VARCHAR(30),
    doc_name VARCHAR(200),
    doc_name_en VARCHAR(200),
    doc_inst VARCHAR(80),
    doc_num VARCHAR(15),
    doc_date DATE,
    doc_act DATE,
    dv_danni VARCHAR(10),
    dv_date DATE
);

CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    code CHAR(5) NOT NULL,
    region_code CHAR(3) UNIQUE NOT NULL, --KOSAKOSKA
    name_bg VARCHAR(25) NOT NULL,
    name_lat VARCHAR(25),
    NUTS1 VARCHAR(5),
    NUTS2 VARCHAR(5),
    NUTS3 VARCHAR(5),
    document_id INT NOT NULL,

    CONSTRAINT fk_region_document FOREIGN KEY (document_id)
        REFERENCES documents (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE municipalities (
    id SERIAL PRIMARY KEY,
    code CHAR(5) UNIQUE NOT NULL,
    municipality_code CHAR(5)  NOT NULL, --ASDasda
    region_id INT NOT NULL,
    name_bg VARCHAR(25) NOT NULL,
    name_lat VARCHAR(25),
    category CHAR(1),
    document_id INT NOT NULL,

    CONSTRAINT fk_muni_region FOREIGN KEY (region_id)
        REFERENCES regions (id)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_muni_document FOREIGN KEY (document_id)
        REFERENCES documents (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE mayoralties (
    id SERIAL PRIMARY KEY,
    id_code CHAR(8) UNIQUE NOT NULL,
    name_bg VARCHAR(25) NOT NULL,
    name_lat VARCHAR(25),
    municipality_id INT NOT NULL,
    code CHAR(5) UNIQUE NOT NULL, 
    document_id INT,
    category CHAR(1),

    CONSTRAINT fk_mayor_muni FOREIGN KEY (municipality_id)
        REFERENCES municipalities (id)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_mayor_document FOREIGN KEY (document_id)
        REFERENCES documents (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE settlements (
    id SERIAL PRIMARY KEY,
    ekatte_code CHAR(5) UNIQUE NOT NULL,
    type CHAR(4) NOT NULL,
    name_bg VARCHAR(25) NOT NULL,
    name_lat VARCHAR(25) NOT NULL,
    region_id INT NOT NULL,
    municipality_id INT NOT NULL,
    mayoralty_id INT,
    type_code INT NOT NULL,
    category_code INT NOT NULL,
    sea_level_code INT NOT NULL,
    sea_level VARCHAR(15),
    document_id INT NOT NULL,

    CONSTRAINT fk_set_region FOREIGN KEY (region_id)
        REFERENCES regions(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_set_muni FOREIGN KEY (municipality_id)
        REFERENCES municipalities(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_set_mayor FOREIGN KEY (mayoralty_id)
        REFERENCES mayoralties(id)
        ON UPDATE CASCADE ON DELETE SET NULL,

    CONSTRAINT fk_set_document FOREIGN KEY (document_id)
        REFERENCES documents(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_settlements_name ON settlements(name_bg);

CREATE INDEX idx_settlements_municipality_id ON settlements(municipality_id);

CREATE INDEX idx_settlements_region_id ON settlements(region_id);
