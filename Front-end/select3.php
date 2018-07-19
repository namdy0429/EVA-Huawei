<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EVA</title>

  <link href="dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/css/ie10-viewport-bug-workaround.css" rel="stylesheet">
  <link href="assets/css/force_style.css" rel="stylesheet">
  <link href="assets/css/cover.css" rel="stylesheet">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
  <script src="dist/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="assets/js/layer.js"></script>
  <style type="text/css">

</style>
</head>
<body>
<div class="site-wrapper container" style="padding-bottom: 50px;">
  <div class="row" style="margin-top: 100px;">
    <h1>EVA: A Tool for Visualizing Software Architectural Evolution</h1>
  </div>
  <div class="row" style="margin-top: 100px;">
    <div class="col-md-4 col-lg-4" style="border-right-style: solid;border-right-width: 5px; border-color: white; text-align: center;">
      <h3 style="margin-bottom: 70px;">1. Choose Recovery Method</h3>
      <form class="form-group" method="GET">
        <div class="row">
          <label for="recovery" class="col-sm-2 control-label text-align: right">Recovery</label>
          <div class="col-sm-10">
            <select class="form-control" name="recovery" style=" margin: auto" disabled>
      <?php
        echo '<option value="';
        echo $_REQUEST['recovery']."<br>";
        echo '
              " selected>';
        echo $_REQUEST['recovery']."<br>";
        echo '
              </option>
            </select>
          </div>
        </div>
        <input class="btn btn-primary pull-right" style="margin-top: 50px;" type="submit" value="Next" disabled/>
      </form>
      </div>
      <div class="col-md-4 col-lg-4" style="border-right-style: solid;border-right-width: 5px; border-color: white;">
        <h3 style="margin-bottom: 70px;">2. Choose Layer</h3>
        <form class="form-group">
          <div class="row">
            <label for="layer" class="col-sm-2 control-label text-align: right;">Layer</label>
            <div class="col-sm-10"> 
              <select class="form-control" name="layer" id="layer" style="margin: auto" disabled>
                <option value="
              ';
        echo $_REQUEST['layer']."<br>";
        echo '
              " selected>';
        echo $_REQUEST['layer']."<br>";
        echo '
                </option>
              </select>
            </div>
          </div>
          <input class="btn btn-primary pull-right" style="margin-top: 50px;" type="submit" value="Next" disabled/>
        </form>
      </div>
      <div class="col-md-4 col-lg-4">
        <h3 style="margin-bottom: 50px;">3. Choose Versions</h3>
        <form action="../Back-end/Engine/select4.php" method="POST">
          <input name="recovery" value="'.$_REQUEST['recovery'].'" hidden>
          <input name="layer" value="'.$_REQUEST['layer'].'" hidden>
          <div class="row">
            <label for="file1" class="col-sm-2 control-label text-align: right;">Older</label>
            <div class="col-sm-10">
              <select class="form-control" name="file1" id="file1" style="margin: auto">';
            // 폴더명 지정
          $thisfilename=basename(__FILE__);
          $temp_filename=realpath(__FILE__);
          $server_path = str_replace(basename(__FILE__), "", realpath(__FILE__));
          echo $server_path."<br>";
          $back_path = str_replace("Front-end", "Back-end", $server_path);
          $dir = $back_path."Data/Architecture/android/".$_REQUEST['recovery']."/".$_REQUEST['layer'];
          echo $dir."<br>";
           
          // 핸들 획득
          $handle  = opendir($dir);
           
          $files = array();
           
          // 디렉터리에 포함된 파일을 저장한다.
          while (false !== ($filename = readdir($handle))) {
              if($filename == "." || $filename == ".."){
                  continue;
              }
           
              // 파일인 경우만 목록에 추가한다.
              if(is_file($dir . "/" . $filename)){
                  $files[] = $filename;
              }
          }
           
          // 핸들 해제 
          closedir($handle);
           
          // 정렬, 역순으로 정렬하려면 rsort 사용
          sort($files);
           
          // 파일명을 출력한다.
          // foreach ($files as $key => $value) {
          // for ($i=0; $i<count($files); $i++) { 
          // foreach ($files as &$f) {
          // for($f = 0; $f < count($files); $f++) {
          foreach ($files as $f) {
              // echo $f;
              echo "<option value='".$f."'>".$f."</option>";
              // echo "<br />";
          } 
          echo '</select>
          </div>
        </div>
        <div class="row" style="height: 10px;"></div>
        <div class="row">
          <label for "file2" class="col-sm-2 control-label text-align: right;">Later</label>
          <div class="col-sm-10">
            <select class="form-control" name="file2" id="file2" style="margin: auto">';
          foreach ($files as $f) {
              // echo $f;
              echo "<option value='".$f."'>".$f."</option>";
              // echo "<br />";
          } 
        ?>
            </select>
          </div>
        </div>
        <input class="btn btn-primary pull-right" style="margin-top: 30px;" type="submit" value="Run EVA"/>
      </form>
    </div>
  </div>
</div>
</body>
</html>