CREATE TABLE product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    price INT,
    discount INT,
    game_name VARCHAR(50),
    developer VARCHAR(200),
    genre VARCHAR(200),
    publisher VARCHAR(100),
    descriptions VARCHAR(500),
    img_url VARCHAR(250),
    sideImgURL VARCHAR(250),
    example_img1 VARCHAR(250),
    example_img2 VARCHAR(250),
    example_img3 VARCHAR(250)
);