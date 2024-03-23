CREATE TABLE cart(
    cart_id int auto_increment primary key,
    customer_id int,
    FOREIGN KEY (customer_id) REFERENCES ustomer(customer_id)
);