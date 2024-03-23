CREATE TABLE cart_details (
    cart_details_id int primary key auto_increment,
    cart_id int,
    product_id int,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
    FOREIGN KEY (product_id) REFERENCES product(prduct_id)
    );
DELIMITER //
CREATE TRIGGER after_insert_user
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    INSERT INTO cart (customer_id) VALUES (NEW.customer_id);
END;
//
DELIMITER ;