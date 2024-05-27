/******w************
    
	Assignment 2 Javascript
	Name: Wadia Jara
	Date: May 25, 2024
	Description: javascript is complete with the validation on the form before go to php page.

*******************/

const itemDescription = ["MacBook", "The Razer", "WD My Passport", "Nexus 7", "DD-45 Drums"];
const itemPrice = [1899.99, 79.99, 179.99, 249.99, 119.99];
const itemImage = ["mac.png", "mouse.png", "wdehd.png", "nexus.png", "drums.png"];
let numberOfItemsInCart = 0;
let orderTotal = 0;

/*
 * Handles the submit event of the survey form
 *
 * param e  A reference to the event object
 * return   True if no validation errors; False if the form has
 *          validation errors
 */
function validate(e) {
	hideErrors();
	if (formHasErrors()) {
		e.preventDefault();
		return false;
	}
	return true;
}

/*
 * Handles the reset event for the form.
 *
 * param e  A reference to the event object
 * return   True allows the reset to happen; False prevents
 *          the browser from resetting the form.
 */
function resetForm(e) {
	// Confirm that the user wants to reset the form.
	if (confirm('Clear order?')) {
		// Ensure all error fields are hidden
		hideErrors();

		// Set focus to the first text field on the page
		document.getElementById("qty1").focus();

		// When using onReset="resetForm()" in markup, returning true will allow
		// the form to reset
		return true;
	}

	// Prevents the form from resetting
	e.preventDefault();

	// When using onReset="resetForm()" in markup, returning false would prevent
	// the form from resetting
	return false;
}

/*
 * Does all the error checking for the form.
 *
 * return   True if an error was found; False if no errors were found
 */
function formHasErrors() {
	let existError = false;

	if (numberOfItemsInCart == 0) {
		// Display an error message contained in a modal dialog element

		const modal = document.querySelector("#cartError");
		modal.showModal();

		const closeModal = document.querySelector(".close-button");

		closeModal.addEventListener("click", () => {
			modal.close();
			document.getElementById("qty1").focus();
		});

		// Form has errors
		existError = true;
	}
	//	Complete the validations below
	else if(numberOfItemsInCart >= 1){
		
		const requiredFields = ["fullname", "address", "city", "province", "email", "cardname", "cardnumber"];
		const requiredSelectFields = ["province", "month"];

		//Validation for all required inputs with information
		for(let i = 0; i < requiredFields.length; i++){
			let textField = document.getElementById(requiredFields[i]);
			
			if(!formFieldHasInput(textField)){
				
				document.getElementById(requiredFields[i] + "_error").style.display = "block";
	
				if(!existError){
					textField.focus();
					textField.select();
				}
	
				existError = true;
			}
		}

		//Validation for all required select with information
		for(let i = 0; i < requiredSelectFields.length; i++){
			let textField = document.getElementById(requiredSelectFields[i]);
			
			if(!formFieldHasInput(textField)){
				
				document.getElementById(requiredSelectFields[i] + "_error").style.display = "block";
	
				if(!existError){
					textField.focus();
				}
	
				existError = true;
			}
		}

		//validation for card type selection
		const card = ["visa", "amex", "mastercard", "mastercard"];
		let cardChecked = false;
	
		for(let i = 0; i < card.length && !cardChecked; i++){
			if(document.getElementById(card[i]).checked){
				cardChecked = true;
			}
		}
		if(!cardChecked){
			document.getElementById("cardtype_error").style.display = "block";
			existError = true;
		}

		//validation for the correct format of the postal code
		const postalRegex = new RegExp(/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i);
		let postalField = document.getElementById("postal").value;

		if(!postalRegex.test(postalField)){
			document.getElementById("postalformat_error").style.display = "block";
			existError = true;
		}

		//validation for the correct format of the email
		const emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
		let emailField = document.getElementById("email").value;

		if(!emailRegex.test(emailField)){
			document.getElementById("emailformat_error").style.display = "block";
			existError = true;
		}

		//validation for the correct format of the expiry date of the card info, can't be less that the currect month
		const d = new Date();
		let curretMonth = d.getMonth();
		let curretYear = d.getFullYear();
		let expiryMonth = document.getElementById("month").value;
		let expiryYear = document.getElementById("year").value;

		if(expiryMonth < curretMonth){
			if(expiryYear == curretYear){
				document.getElementById("expiry_error").style.display = "block";
				existError = true;
			}
		}

		//Validation for the input that required a number 
		let numberRegex = new RegExp(/^\d{10}$/);
		let cardnumberValue = document.getElementById("cardnumber").value;
		
		if(!numberRegex.test(cardnumberValue)){
			document.getElementById("invalidcard_error").style.display = "block";
	
			if(!existError){
				document.getElementById("cardnumber").focus();
				document.getElementById("cardnumber").select();
			}
	
			existError = true;
		}
		else {
			if(!checkLogicCardNumber(cardnumberValue)){
				document.getElementById("invalidcard_error").style.display = "block";
				existError = true;
			}
		}
	}

	return existError;	
}

//NEW METHOD TO CHECK DE CORRECT NUMBER OF THE 
function checkLogicCardNumber(cardNumberField){
	let validCardNumber = false;

	if(cardNumberField.length == 10){
		const checkingFactors = [4,3,2,7,6,5,4,3,2]; //9434578423

		//convert the complete number into an Array to multiple each number with the checking factors in their same position
		// EXAMPLE OF CARD NUMBER  9434578423
		let card = String(cardNumberField).split("").map((cardNumberField) => {
			return Number(cardNumberField)
		});
		
		let sum = 0;
		for(let i = 0; i < checkingFactors.length; i++){
			let mult = card[i] * checkingFactors[i];

			sum += mult;
		}
		let remainder = sum % 11;
		let subtract = 11 - remainder;

		validCardNumber = subtract == card[card.length - 1];
	}
	else {
		validCardNumber = false;
	}
	
	return validCardNumber;
}

/*
 * Adds an item to the cart and hides the quantity and add button for the product being ordered.
 *
 * param itemNumber The number used in the id of the quantity, item and remove button elements.
 */
function addItemToCart(itemNumber) {
	// Get the value of the quantity field for the add button that was clicked 
	let quantityValue = trim(document.getElementById("qty" + itemNumber).value);

	// Determine if the quantity value is valid
	if (!isNaN(quantityValue) && quantityValue != "" && quantityValue != null && quantityValue != 0 && !document.getElementById("cartItem" + itemNumber)) {
		// Hide the parent of the quantity field being evaluated
		document.getElementById("qty" + itemNumber).parentNode.style.visibility = "hidden";

		// Determine if there are no items in the car
		if (numberOfItemsInCart == 0) {
			// Hide the no items in cart list item 
			document.getElementById("noItems").style.display = "none";
		}

		// Create the image for the cart item
		let cartItemImage = document.createElement("img");
		cartItemImage.src = "images/" + itemImage[itemNumber - 1];
		cartItemImage.alt = itemDescription[itemNumber - 1];

		// Create the span element containing the item description
		let cartItemDescription = document.createElement("span");
		cartItemDescription.innerHTML = itemDescription[itemNumber - 1];

		// Create the span element containing the quanitity to order
		let cartItemQuanity = document.createElement("span");
		cartItemQuanity.innerHTML = quantityValue;

		// Calculate the subtotal of the item ordered
		let itemTotal = quantityValue * itemPrice[itemNumber - 1];

		// Create the span element containing the subtotal of the item ordered
		let cartItemTotal = document.createElement("span");
		cartItemTotal.innerHTML = formatCurrency(itemTotal);

		// Create the remove button for the cart item
		let cartItemRemoveButton = document.createElement("button");
		cartItemRemoveButton.setAttribute("id", "removeItem" + itemNumber);
		cartItemRemoveButton.setAttribute("type", "button");
		cartItemRemoveButton.innerHTML = "Remove";
		cartItemRemoveButton.addEventListener("click",
			// Annonymous function for the click event of a cart item remove button
			function () {
				// Removes the buttons grandparent (li) from the cart list
				this.parentNode.parentNode.removeChild(this.parentNode);

				// Deteremine the quantity field id for the item being removed from the cart by
				// getting the number at the end of the remove button's id
				let itemQuantityFieldId = "qty" + this.id.charAt(this.id.length - 1);

				// Get a reference to quanitity field of the item being removed form the cart
				let itemQuantityField = document.getElementById(itemQuantityFieldId);

				// Set the visibility of the quantity field's parent (div) to visible
				itemQuantityField.parentNode.style.visibility = "visible";

				// Initialize the quantity field value
				itemQuantityField.value = "";

				// Decrement the number of items in the cart
				numberOfItemsInCart--;

				// Decrement the order total
				orderTotal -= itemTotal;

				// Update the total purchase in the cart
				document.getElementById("cartTotal").innerHTML = formatCurrency(orderTotal);

				// Determine if there are no items in the car
				if (numberOfItemsInCart == 0) {
					// Show the no items in cart list item 
					document.getElementById("noItems").style.display = "block";
				}
			},
			false
		);

		// Create a div used to clear the floats
		let cartClearDiv = document.createElement("div");
		cartClearDiv.setAttribute("class", "clear");

		// Create the paragraph which contains the cart item summary elements
		let cartItemParagraph = document.createElement("p");
		cartItemParagraph.appendChild(cartItemImage);
		cartItemParagraph.appendChild(cartItemDescription);
		cartItemParagraph.appendChild(document.createElement("br"));
		cartItemParagraph.appendChild(document.createTextNode("Quantity: "));
		cartItemParagraph.appendChild(cartItemQuanity);
		cartItemParagraph.appendChild(document.createElement("br"));
		cartItemParagraph.appendChild(document.createTextNode("Total: "));
		cartItemParagraph.appendChild(cartItemTotal);

		// Create the cart list item and add the elements within it
		let cartItem = document.createElement("li");
		cartItem.setAttribute("id", "cartItem" + itemNumber);
		cartItem.appendChild(cartItemParagraph);
		cartItem.appendChild(cartItemRemoveButton);
		cartItem.appendChild(cartClearDiv);

		// Add the cart list item to the top of the list
		let cart = document.getElementById("cart");
		cart.insertBefore(cartItem, cart.childNodes[0]);

		// Increment the number of items in the cart
		numberOfItemsInCart++;

		// Increment the total purchase amount
		orderTotal += itemTotal;

		// Update the total puchase amount in the cart
		document.getElementById("cartTotal").innerHTML = formatCurrency(orderTotal);
	}
}

/*
 * Hides all of the error elements.
 */
function hideErrors() {
	// Get an array of error elements
	let error = document.getElementsByClassName("error");

	// Loop through each element in the error array
	for (let i = 0; i < error.length; i++) {
		// Hide the error element by setting it's display style to "none"
		error[i].style.display = "none";
	}
}

function formFieldHasInput(fieldElement) {
	// Check if the text field has a value
	if (fieldElement.value == null || fieldElement.value.trim() == "") {
		// Invalid entry
		return false;
	}

	// Valid entry
	return true;
}

/*
 * Handles the load event of the document.
 */
function load() {
	//	Populate the year select with up to date values
	let year = document.getElementById("year");
	let currentDate = new Date();
	for (let i = 0; i < 7; i++) {
		let newYearOption = document.createElement("option");
		newYearOption.value = currentDate.getFullYear() + i;
		newYearOption.innerHTML = currentDate.getFullYear() + i;
		year.appendChild(newYearOption);
	}

	// Add event listener for the form submit
	document.getElementById("orderform").addEventListener("submit", validate);
	
	//Event Listener for the reset button
	document.getElementById("orderform").reset();
	document.getElementById("orderform").addEventListener("reset", resetForm);

	//Event Listener for the add item to the shopping cart
	document.getElementById("addMac").addEventListener("click", function(){ addItemToCart(1); });
	document.getElementById("addMouse").addEventListener("click", function(){ addItemToCart(2); });
	document.getElementById("addWD").addEventListener("click", function(){ addItemToCart(3); });
	document.getElementById("addNexus").addEventListener("click", function(){ addItemToCart(4); });

}

// Add document load event listener
document.addEventListener("DOMContentLoaded", load);












