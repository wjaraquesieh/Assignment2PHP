<?php

/*******w******** 
    
    Name: Wadia Jara
    Date: May 25, 2024
    Description: Validation on the POST call from the Html and show the table with the complete information
    if something is missing is showing a message.

****************/

$totalProduct = 0;
$itemDescription = array("MacBook", "The Razer", "WD My Passport", "Nexus 7", "DD-45 Drums");
$itemPrice = array(1899.99, 79.99, 179.99, 249.99, 119.99);

$itemsRow = "";

for($x = 1; $x <= 5; $x++){
    $qty = $_POST["qty{$x}"];
    if($qty != ""){
        $cost = $itemPrice[$x-1]*$qty;
        $itemsRow .= '<tr><td>'.$qty.'</td><td>'. $itemDescription[$x-1] 
                .'</td><td class="alignright">'. $cost .'</td></tr>';

        $totalProduct = $totalProduct + $cost;
    }
}

function messageInputsMissing(){

    $validIncompleteForm = "";
    $validIncompleteForm = $_POST['fullname'] == "" ? "<tr><td>The full name is missing or wrong</td></tr>" : "";
    $validIncompleteForm .= $_POST['address'] == "" ? "<tr><td>The address is missing or wrong</td></tr>" : "";
    $validIncompleteForm .= $_POST['city'] == "" ? "<tr><td>The city is missing or wrong</td></tr>" : "";
    $validIncompleteForm .= $_POST['province'] == "" ? "<tr><td>The province is missing</td></tr>" : "";
    $validIncompleteForm .= $_POST['email'] == "" && filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL) 
                            ? "<tr><td>The email is missing or with a incorrect format</td></tr>" : "";

    $postal = filter_input(INPUT_POST, 'postal', FILTER_VALIDATE_REGEXP, array(
                                "options"=>array("regexp"=>"/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i")
                            ));
    $validIncompleteForm .= $postal === false ? "<tr><td>The postal code is missing or with a incorrect format</td></tr>" : "";
    
    if(!isset($_POST['cardtype'])){
        $validIncompleteForm .= "<tr><td>The card type is not selected</td></tr>";
    }
    $validIncompleteForm .= $_POST['cardname'] == "" ? "<tr><td>The card name is missing or wrong</td></tr>" : "";

    $month = filter_input(INPUT_POST, 'month', FILTER_VALIDATE_INT, array(
        "options"=>array('min_range' => 1, 'max_range' => 12) 
    ));
    $validIncompleteForm .= !$month ? "<tr><td>The month of the credit card is not selected</td></tr>" : "";

    $year = filter_input(INPUT_POST, 'year', FILTER_VALIDATE_INT);
    if($year === true){
        $currentYear = date("Y");
        $finalYear = $currentYear + 5;

        $year = $year >= $currentYear && $year <= $finalYear;
    }
    $validIncompleteForm .= !$year ? "<tr><td>The year is not selected</td></tr>" : "";

    $cardnumber = filter_input(INPUT_POST, 'cardnumber', FILTER_VALIDATE_INT) && strlen((string)$_POST['cardnumber']) == 10;
    $validIncompleteForm .= !$cardnumber ? "<tr><td>The card number is missing or wrong, the card number must be 10 digits</td></tr>" : "";
    
    $qty = $_POST['qty1'] != "" || $_POST['qty2'] != "" || $_POST['qty3'] != "" 
        || $_POST['qty4'] != "" || $_POST['qty5'] != "";
    $validIncompleteForm .= !$qty  ? "<tr><td>You must select a product</td></tr>" : "";

    return $validIncompleteForm;
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="styles.css">
    <title>Thanks for your order!</title>
</head>
<body>
    <!-- Remember that alternative syntax is good and html inside php is bad -->
    <div class="invoice">
        <h2><?= "Thanks for your order, {$_POST['fullname']}"; ?></h2>
        <?php if(messageInputsMissing() === ""):   ?>
        <h3>Here's a summary of your order:</h3>
        <table>
            <tr>
                <td colspan="4"><h3>Address Information</h3></td>
            </tr>
            <tr>
                <td class="alignright">
                    <span class="bold">Address:</span>
                </td>
                <td><?= "{$_POST['address']}"; ?></td>
                <td class="alignright">
                    <span class="bold">City:</span>
                </td>
                <td><?= "{$_POST['city']}"; ?></td>
            </tr>
            <tr>
                <td class="alignright">
                    <span class="bold">Province</span>
                </td>
                <td><?= "{$_POST['province']}"; ?></td>
                <td class="alignright">
                    <span class="bold">Postal Code:</span>
                </td>
                <td><?= "{$_POST['postal']}"; ?></td>
            </tr>
            <tr>
                <td colspan="2" class="alignright">
                    <span class="bold">Email:</span>
                </td>
                <td colspan="2"><?= "{$_POST['email']}"; ?></td>
            </tr>
        </table>

        <table>
            <tbody>
                <tr>
                    <td colspan="3">
                        <h3>Order Information</h3>
                    </td>
                </tr>
                <tr>
                    <td><span class="bold">Quantity</span></td>
                    <td><span class="bold">Description</span></td>
                    <td><span class="bold">Cost</span></td>
                </tr>
                <?= $itemsRow; ?>
                <tr>
                    <td colspan="2" class="alignright">
                        <span class="bold">Totals</span>
                    </td>
                    <td class="alignright">
                        <span class="bold">
                            <?= "{$totalProduct}"; ?>
                        </span>
                    </td> 
                </tr>
            </tbody>
        </table>
        <?php else  : ?>
            <table>
                <tbody>
                    <?= messageInputsMissing(); ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
</body>
</html>