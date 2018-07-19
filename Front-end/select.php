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
<div class="site-wrapper container" style="padding-bottom: 50px; vertical-align: center;">
  <div class="row" style="margin-top: 100px;">
    <h1>EVA: A Tool for Visualizing Software Architectural Evolution</h1>
  </div>
  <div class="row" style="margin-top: 100px;">
    <div class="col-md-4 col-lg-4" style="border-right-style: solid;border-right-width: 5px; border-color: white; text-align: center;">
      <h3 style="margin-bottom: 70px;">1. Choose Recovery Method</h3>
      <form action="./select2.php" class="form-group" method="GET">
        <div class="row">
          <label for="recovery" class="col-sm-2 control-label text-align: right;">Recovery</label>
          <div class="col-sm-10">
            <select class="form-control" name="recovery" style=" margin: auto">
                <option value="acdc">ACDC</option>
                <option value="arc">ARC</option>
            </select> 
          </div>
        </div>
        <input class="btn btn-primary pull-right" style="margin-top: 50px;" type="submit" value="Next"/>
      </form>
    </div>
    <div class="col-md-4 col-lg-4" style="border-right-style: solid;border-right-width: 5px; border-color: white;">
      <h3 style="margin-bottom: 70px;">2. Choose Layer</h3>
      <form class="form-group">
        <div class="row">
          <label for="layer" class="col-sm-2 control-label text-align: right;">Layer</label>
          <div class="col-sm-10"> 
            <select class="form-control" name="layer" id="layer" style="margin: auto" disabled>
            </select>
          </div>
        </div>
        <input class="btn btn-primary pull-right" style="margin-top: 50px;" type="submit" value="Next" disabled/>
      </form>
    </div>
    <div class="col-md-4 col-lg-4">
      <h3 style="margin-bottom: 50px;">3. Choose Versions</h3>
      <form class="form-group">
        <div class="row">
          <label for="file1" class="col-sm-2 control-label text-align: right;">Older</label>
          <div class="col-sm-10">
            <select class="form-control" name="file1" id="file1" style="margin: auto" disabled>
            </select>
          </div>
        </div>
        <div class="row" style="height: 10px;"></div>
        <div class="row">
          <label for="file2" class="col-sm-2 control-label text-align: right;">Later</label>
          <div class="col-sm-10"> 
            <select class="form-control" name="file2" id="file2" style="margin: auto" disabled>
            </select>
          </div>
        </div>
        <input class="btn btn-primary pull-right" style="margin-top: 30px;" type="submit" value="Run EVA" disabled/>
      </form>
    </div>
  </div>
</div>
</body>
</html>