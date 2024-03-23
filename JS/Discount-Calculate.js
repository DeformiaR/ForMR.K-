document.addEventListener("DOMContentLoaded", function() {
    // Get the original price and discount percentage
    var originalPriceElement = document.getElementById("originalPrice");
    var originalPrice = parseFloat(originalPriceElement.textContent);
    
    var discountPercentageElement = document.getElementById("discountPercentage");
    var discountPercentage = parseFloat(discountPercentageElement.textContent);
    
    // Calculate the discounted price
    var discountAmount = (originalPrice * discountPercentage) / 100;
    var discountedPrice = originalPrice - discountAmount;
    
    // Update the HTML to display the discounted price
    var discountPriceElement = document.getElementById("discountPrice");
    discountPriceElement.textContent = discountedPrice.toFixed(2); // Assuming you want to display up to 2 decimal places
    
    // Add the suffix
    var suffixElement = document.getElementById("suffix");
    suffixElement.textContent = "BATH"; // Assuming "BATH" is the currency
    
    // Optionally, you can also remove the original price element if needed
    originalPriceElement.style.display = "none";
});
