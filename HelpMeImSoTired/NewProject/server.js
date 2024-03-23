const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const db = require("./models/dbConn")
const config = db.config;
const connection = db.pool;
const session = require('express-session')
const mysqlStore = require("express-mysql-session")(session);
const sessionStore = new mysqlStore(config);
const customerModel = require("./models/customerModel");
const { connect } = require('http2');



// Set the views directory to the correct path
app.set('views', path.join(__dirname, 'views'));
app.use(upload.none());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');



app.use(
    session({
        store: sessionStore,
        secret: "jklfsodifjsktnwjasdp465dd", // A secret key used to sign the session ID cookie
        resave: true, // Forces the session to be saved back to the session store
        saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
        cookie: {
            maxAge: 3600000, // Sets the cookie expiration time in milliseconds (1 hour here)
            sameSite: true,
            httpOnly: true, // Reduces client-side script control over the cookie
            secure: false, // Ensures cookies are only sent over HTTPS //we do not impmentment HTTPS yet, so, this is false
        },
    })
);



app.get('/', (req, res) => {
    connection.query("SELECT img_url, product_id FROM product", (err, results, fields) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const imageUrls = results.map(row => row.img_url);
        const productIds = results.map(row => row.product_id); // Extract product_ids
        res.render('mainpage', { imageUrls, productIds, isAdmin: req.session.isAdmin, customerId: req.session.customerID });
    });
});



app.get('/mainpage2', (req, res) => {
    connection.query("SELECT img_url, product_id FROM product", (err, results, fields) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const imageUrls = results.map(row => row.img_url);
        const productIds = results.map(row => row.product_id); // Extract product_ids
        res.render('mainpage2', { imageUrls, productIds, isAdmin: req.session.isAdmin});
    });
});

app.get('/mainpage3', (req, res) => {
    connection.query("SELECT img_url, product_id FROM product", (err, results, fields) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const imageUrls = results.map(row => row.img_url);
        const productIds = results.map(row => row.product_id); // Extract product_ids
        res.render('mainpage3', {productIds, imageUrls: imageUrls });
    });
});

app.get('/mainpage4', (req, res) => {
    connection.query("SELECT img_url, product_id FROM product", (err, results, fields) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const imageUrls = results.map(row => row.img_url);
        const productIds = results.map(row => row.product_id); // Extract product_ids
        res.render('mainpage4', {productIds, imageUrls: imageUrls });
    });
});


app.get("/logout", async (req, res) => {
    req.session.destroy();
    console.log("session-/logout: ", req.sessionID);
    res.redirect('/');
});


app.get('/account', (req, res) => {
    const customerId = req.session.customerID;
    
    // Check if customerId is defined
    if (customerId) {
        const sql = `SELECT username FROM Customer WHERE customer_id = ?`;
        connection.query(sql, [customerId], (error, results) => {
            if (error) {
                throw error;
            }
            
            // Assuming there's only one row returned, you can adjust accordingly if needed
            const username = results[0].username;
            
            // Render the account page with the username
            res.render('account', { username: username, customerId: customerId });
        });
    } else {
        // If customerId is not defined, render the account page without passing the username
        res.render('account', { customerId: null }); // Pass customerId as null
    }
});


app.get('/signin', (req, res) => {
    res.render('signin', { message: null });
})

app.post('/signin', (req, res) => {
    const { email, pswd } = req.body;

    // Check the user's credentials against the database
    // Assuming you have a function to validate credentials in your database model
    const sql = 'SELECT * FROM Customer WHERE email = ? AND pswd = ?';
    connection.query(sql, [email, pswd], async (err, results, fields) => {
        if (err) {
            console.error('Error validating credentials:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length > 0) {
            console.log(email)
            console.log(results)
            console.log("customer id: ", results[0].customer_id)
            // User authenticated successfully, redirect to root page
            req.session.customerID = results[0].customer_id
            req.session.isAdmin = results[0].isAdmin
            res.redirect('/');
        } else {
            // Incorrect credentials, render sign-in form with error message
            res.render('signin', { errorMessage: 'Incorrect email or password' });
        }
    });
});


app.get('/signup', (req, res) => {
    res.render('signup');
})


// Handle form submission
// Handle form submission
// Handle form submission
app.post('/games/add', (req, res) => {
    const { gameName, gameURL, sideImgURL, gamePrice, gameDiscount, genre, publisher, developer, description, exampleImg1, exampleImg2, exampleImg3 } = req.body;

    const sql = "INSERT INTO product (game_name, img_url, sideImgURL, price, discount, genre, publisher, developer, descriptions, example_img1, example_img2, example_img3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [gameName, gameURL, sideImgURL, gamePrice, gameDiscount, genre, publisher, developer, description, exampleImg1, exampleImg2, exampleImg3];

    connection.query(sql, values, (error, results, fields) => {
        if (error) {
            console.error('Error inserting data into database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Data inserted successfully:', results);
        res.redirect('/');
    });
});

app.get('/backoffice', (req, res) => {
    res.render('backoffice')
})


app.get('/product/:id', (req, res) => {
    const productId = req.params.id;

    // Fetch product information based on the product ID from the database
    const query = `SELECT * FROM product WHERE product_id = ?`;
    const customerID = req.session.customerID
    connection.query(query, [productId], (error, results, fields) => {
        console.log("going to product page")
        if (error) {
            console.error('Error fetching product:', error);
            return res.status(500).send('Internal Server Error');
        }

        // Check if a product was found
        if (results.length > 0) {
            const product = results[0]; // Assuming only one product is found

            // Render the product information page with the fetched data
            console.log('Product:', product);
            if (customerID) {
                res.render('informationPage', { product: product, customerID , isAdmin: req.session.isAdmin,productId});
            }
            else {
                res.render('informationPage', { product: product });

            }
        } else {
            // Handle case where product is not found
            console.log('Product not found');
            res.status(404).send('Product not found');
        }
    });
});


app.post('/account/add', (req, res) => {
    const { txt, email, pswd} = req.body;
    
    // Encrypting the password (You should use a more secure encryption method in a real-world scenario)

    const sql = 'INSERT INTO Customer (email, pswd, username) VALUES (?, ?, ?)';
    connection.query(sql, [email, pswd, txt], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving to database');
        } else {
            res.render('signin');
        }
    });
});

app.get('/contact', (req, res) => {
    res.render("contact")
})

app.post('/cart/add', (req, res) => {
    const { productId } = req.body;
    const customerId = req.session.customerID;

    // Select cart_id from cart table based on customer_id
    const cartSQL = `SELECT cart_id FROM cart WHERE customer_id = ?`;

    connection.query(cartSQL, [customerId], (cartErr, cartResult) => {
        if (cartErr) {
            console.error('Error fetching cart_id:', cartErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (cartResult.length === 0) {
            console.error('Cart not found for customer:', customerId);
            res.status(404).json({ error: 'Cart not found' });
            return;
        }

        const cartId = cartResult[0].cart_id;
        console.log('Cart id:', cartId);
        console.log('Product id:', productId);

        // Insert product ID into cart_details table
        const sql = `INSERT INTO cart_details (product_id, cart_id) VALUES (?, ?)`;
        const values = [productId, cartId];

        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error adding product to cart:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            console.log('Product added to cart successfully');
            res.redirect('/')
        });
    });
});

app.get('/cart', (req, res) => {
    // Check if customer is logged in
    if (!req.session.customerID) {
        // If not logged in, show alert and redirect to login page
        res.render('signin', { message: "Please login first to access the cart" });
        return;
    }
        // If user is already logged in, send message as null
    

    // Assuming you have the customer ID stored in the session
    const customerID = req.session.customerID;
    console.log("customerID: ", customerID);
    // Query to retrieve the cart ID based on the customer ID
    const cartSQL = `SELECT cart_id FROM backoffice.cart WHERE customer_id = ?;`;

    // Assuming you're using a MySQL database connection
    connection.query(cartSQL, customerID, (err, cartResults) => {
        if (err) {
            console.error("Error fetching cart ID:", err);
            res.status(500).send("Error fetching cart ID");
            return;
        }

        // Extracting the cart ID from the result
        const cartID = cartResults[0]?.cart_id;
        console.log("cartID", cartID);

        // Query to retrieve cart details using the cart ID
        const sql = `
            SELECT MIN(cd.cart_details_id) AS cart_details_id, 
                cd.cart_id, 
                cd.product_id, 
                p.game_name,
                p.img_url,
                CAST(p.price - (p.price * p.discount / 100) AS UNSIGNED)  as price,
                COUNT(cd.product_id) AS quantity
            FROM cart_details cd
            JOIN product p ON cd.product_id = p.product_id
            WHERE cd.cart_id = ?
            GROUP BY cd.product_id;
        `;
        if (!cartID) {
            // If no cart ID is found, render the page with an empty cart
            res.render('ShoppingCart', { cartItems: [] });
            return;
        }

        // Execute the second query to retrieve cart details
        connection.query(sql, cartID, (err, results) => {
            if (err) {
                console.error("Error fetching cart details:", err);
                res.status(500).send("Error fetching cart details");
                return;
            }

            const cartItems = results || []; // If no results, initialize as empty array

            // Render the ShoppingCart page and pass the cart details to it
            res.render('ShoppingCart', { cartItems });
        });
    });
});


app.get('/FPS', (req, res) => {
    connection.query("SELECT * FROM product WHERE genre = 'FPS'", (err, results, fields) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('FPS', { games: results });
    });
});

app.get('/Horror', (req, res) => {
    connection.query("SELECT * FROM product WHERE genre = 'Horror'", (err, results, fields) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('Horror', { games: results });
    });
});

app.get('/Action', (req, res) => {
    connection.query("SELECT * FROM product WHERE genre = 'Action'", (err, results, fields) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('Action', { games: results });
    });
});


app.delete('/deleteCartItem', (req, res) => {
    const cartDetailsId = req.query.cartDetailsId;

    // Construct the DELETE query
    const deleteQuery = 'DELETE FROM cart_details WHERE cart_details_id = ?';

    // Execute the DELETE query with the cartDetailsId parameter
    connection.query(deleteQuery, [cartDetailsId], (error, results, fields) => {
        if (error) {
            console.error('Error deleting item:', error);
            res.status(500).send('Error deleting item from the database');
            return;
        }


        // If deletion was successful, send a success response
        res.sendStatus(200); // Send success status code
    });
});
app.get('/delete/product', (req, res) => {
    res.render('deleteProduct')
});
app.post('/delete/product', (req, res) => {
    const productId = req.body.product_id;
  
    // Execute SQL query to delete the product
    const sql = 'DELETE FROM product WHERE product_id = ?';
    connection.query(sql, [productId], (err, result) => {
      if (err) {
        console.error('Error deleting product:', err.message);
        res.status(500).send('Error deleting product');
        return;
      }
      console.log('Product deleted successfully');
      res.send('Product deleted successfully');
    });
  });

  app.get('/edit', (req, res) => {
    const productId = req.query.productId;

    if (!productId) {
        return res.status(400).send('Product ID is required');
    }

    // Fetch product information based on the product ID from the database
    const query = `SELECT * FROM product WHERE product_id = ?`;
    connection.query(query, [productId], (error, results, fields) => {
        if (error) {
            console.error('Error fetching product:', error);
            return res.status(500).send('Internal Server Error');
        }

        // Check if a product was found
        if (results.length > 0) {
            const product = results[0]; // Assuming only one product is found
            // Render the edit product page with the fetched data
            res.render('editproduct', { product: product ,productId});
        } else {
            // Handle case where product is not found
            console.log('Product not found');
            res.status(404).send('Product not found');
        }
    });
});



app.get('/edit/product/:id', (req, res) => {
    const productId = req.params.id;

    // Fetch product information based on the product ID from the database
    const query = `SELECT * FROM product WHERE product_id = ?`;
    connection.query(query, [productId], (error, results, fields) => {
        if (error) {
            console.error('Error fetching product:', error);
            return res.status(500).send('Internal Server Error');
        }

        // Check if a product was found
        if (results.length > 0) {
            const product = results[0]; // Assuming only one product is found

            // Render the edit product form with the fetched data
            res.render('editproduct', { product: product });
        } else {
            // Handle case where product is not found
            console.log('Product not found');
            res.status(404).send('Product not found');
        }
    });
});
app.post('/edit/product/:id', (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;
    // Assuming the form data is sent with all product fields
    console.log(updatedProduct);

    // Update the product information in the database
    const query = `UPDATE product SET game_name = ?, img_url = ?, descriptions = ?, sideImgURL = ?, publisher = ?, developer = ?, example_img1 = ?, example_img2 = ?, example_img3 = ?, discount = ?, price = ? WHERE product_id = ?`;

    const values = [
        updatedProduct.game_name,
        updatedProduct.img_url,
        updatedProduct.description,
        updatedProduct.sideImgURL,
        updatedProduct.publisher,
        updatedProduct.developer,
        updatedProduct.exampleImg1,
        updatedProduct.exampleImg2,
        updatedProduct.exampleImg3,
        updatedProduct.gameDiscount,
        updatedProduct.gamePrice,
        productId
    ];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error('Error updating product:', error);
            return res.status(500).send('Internal Server Error');
        }

        // Redirect to the product page or show a success message
        res.redirect(`/`);
    });
});






app.use(express.static(('public')))
app.use('/src', express.static('src'))

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
