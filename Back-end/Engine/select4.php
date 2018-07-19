<?php 
	$thisfilename=basename(__FILE__);
    $temp_filename=realpath(__FILE__);
    $server_path = str_replace(basename(__FILE__), "", realpath(__FILE__));
    // echo $server_path."<br>";
    $back_path = str_replace("/Engine", "", $server_path);
    $dir = $back_path."Data/Architecture/android/".$_REQUEST['recovery']."/".$_REQUEST['layer'] . "/";
	// print_r($_POST)
	// echo "python with_link_json.py --recovery ". $_POST['recovery']. " --arch1 " . $_POST['file1'] . " --arch2 " . $_POST['file2'] . " --layer " . $_POST['layer'];
	// exec ("python ../Back-end/Engine/EVA.py --recovery " . $_POST['recovery'] . " --arch1 " . $_POST['arch1'] . " --arch2 " . $_POST['arch2'] . " --layer " . $_POST['layer']);
	// echo "python " . $back_path . "Engine/EVA.py --recovery " . $_POST['recovery'] . " --arch1 " . $dir . $_POST['file1'] . " --arch2 " . $dir . $_POST['file2'] . " --layer " . $_POST['layer'];
	// echo "python " . "EVA.py --recovery " . $_POST['recovery'] . " --arch1 " . $dir . $_POST['file1'] . " --arch2 " . $dir . $_POST['file2'] . " --layer " . $_POST['layer'];
	$output = exec("python EVA.py --recovery " . $_POST['recovery'] . " --arch1 " . $dir . $_POST['file1'] . " --arch2 " . $dir . $_POST['file2'] . " --layer " . $_POST['layer']." 2>&1", $result, $return_value);
	// $output = exec("python EVA.py --recovery " . $_POST['recovery'] . " --arch1 " . $dir . $_POST['file1'] . " --arch2 " . $dir . $_POST['file2'] . " --layer " . $_POST['layer'], $result, $return_value);
	// $message = exec("python EVA.py --recovery acdc --arch1 /Applications/MAMP/htdocs/EVA/Back-end/Data/Architecture/android/acdc/av/android-6.0.0_r1_acdc_clustered.rsf --arch2 /Applications/MAMP/htdocs/EVA/Back-end/Data/Architecture/android/acdc/av/android-7.0.0_r1_acdc_clustered.rsf --layer av");
	// $message = exec ("python " . "EVA.py --recovery " . $_POST['recovery'] . " --arch1 " . $dir . $_POST['file1'] . " --arch2 " . $dir . $_POST['file2'] . " --layer " . $_POST['layer']);
	// echo "done";
	// $message = exec("python test.py");
	// print_r($message);
	// $command = escapeshellcmd("python " . "EVA.py --recovery " . $_POST['recovery'] . " --arch1 " . $dir . $_POST['file1'] . " --arch2 " . $dir . $_POST['file2'] . " --layer " . $_POST['layer']);
	// var_dump($result);
	// print_r($output);
	// echo "<br>";
	 $pageURL = 'http';
	 if ($_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
	 $pageURL .= "://";
	 if ($_SERVER["SERVER_PORT"] != "80") {
	  $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
	 } else {
	  $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
	 }
	$EVA_URL = str_replace("Back-end/Engine/select4.php", "Front-end/", $pageURL);
	// print_r($EVA_URL."index.html".$output);
	// $output = shell_exec($command);
	// echo $output;
	header("Location: ".$EVA_URL."index.html".$output);
 ?>