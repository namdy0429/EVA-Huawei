var version_colors = ["orange", "gold"];

var affine_angle = 0.3;
var num_ver = 1;
var cur_idx = 0;

var viewMode = 'Single';

var is_selecting = false;
var is_comparing = false;

var version_list = [];
var start_version;

var chosenArray = new Array();

var color = d3.scaleSequential();
var package_list;


var url_string = window.location.href;
var url = new URL(url_string);
var params = parse_query_string(url.search);
var input_file_name = "data/android/" + params.recovery + "/" + params.single + "_" + params.layer + "/" + params.single + "_" + params.target_sub + "_processed_archs.json"
var compare_versions = [0, 0, 0];

function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function changeMode(mode) {
  if      (mode == 'History')       viewMode = 'History';
  else if (mode == 'Single')        viewMode = 'Single';
}

function renderGraph() {
  $(".table_index>a").attr('href', function() {
    return location.href.split('index_single.html')[0] + 'index_combined.html?&recovery=' + params.recovery +'&ver1=' + params.ver1 + '&ver2=' + params.ver2 + '&layer=' + $(this).attr("layer") + '&target_sub=' + $(this).attr("package")
    // return 'http://localhost:8888/EVA/Front-end/index_combined.html?&recovery=' + params.recovery +'&ver1=' + params.ver1 + '&ver2=' + params.ver2 + '&layer=' + $(this).attr("layer") + '&target_sub=' + $(this).attr("package")
  })

  // set svg width to be responsive
  $("#svg_history").attr("width", window.innerWidth*0.8);

  var svg = d3.select("#svg_history"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var defs = svg.append("svg:defs");

  defs.append("svg:marker")
      .attr("id", "arrow")
      .attr("orient", "auto")
      .attr("markerUnits", "userSpaceOnUse")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("fill", "white");

  var format = d3.format(",d");
  var pack = d3.pack()
      .size([width, height])
      .padding(1.5);
  var link = svg.append("g").selectAll(".link");

  // read json file & make hierarchy
  d3.json(input_file_name, function(error, root) {
    if (error) throw error;
    version_list = root.version_list;
    for (i=0; i<num_ver; i++) {
      var print_version = root.version_list[i]
      var version_id = "ver" + print_version.replace(/\./g, '').replace(/\s/g, '');
      $("#partial_title").html(params.target_sub)
    }
    $("#current_ver").val(root.version_list[0])
    $("#version_list").append(
        "<li class='ver_list chosen' version='' id='diff' style='display:none;'><a href='#' style='text-align: left; padding-left: 10px;' id='diff_btn' onclick='showDifference_comparison()' >Difference</a></li>"
    )
    start_version = version_list[0];
    showSingleVersion(version_list[0], num_ver);
    
    // set color spectrum
    color.domain([root.package_list.length, 0]);
    color.interpolator(d3.interpolateSpectral);

    // set circle color depending on the directory
    for (i=0; i<root.package_list.length; i++){
      if (root.package_list[i] == 'leaf'){
        $("#package_list").append(
        "<li class='color_list'>"  
          + "<div class='list_circle' style='display: none; background-color: " + color(i) + ";'></div>"
          + "<div class='list_index' style='display: none; '>" + params.target_sub + "</div>"
          + "</li>\n");
      }
      else {
        $("#package_list").append(
        "<li class='color_list'>"  
          + "<div class='list_circle' style='display: none; background-color: " + color(i) + ";'></div>"
          + "<div class='list_index' style='display: none; '>" + params.target_sub + "." + root.package_list[i] + "</div>"
          + "</li>\n");
      } 
    }


    package_list = root.package_list;

    var ver_root = [];
    var layers = [];

    for (var i=0; i<num_ver; i++) {
      ver_root[i] = d3.hierarchy(root.children[i])
                      .sum(function(d) { return d.size ? 1 : 0; })
                      .sort(function(a, b) { 
                        if (params.recovery == 'acdc') return b.height - a.height || b.value - a.value || b.data.name.toLowerCase() > a.data.name.toLowerCase();
                        else  return b.height - a.height || b.value - a.value; })
                      .each(function(d) {
                        if (name = d.data.name) {
                          var name, i = name.lastIndexOf(".");
                          d.name = name;
                          d.package = name.slice(0, i);
                          d.class = name.slice(i+1);
                        }
                      });
    }

    var clusters = []
    for (var i=0; i<num_ver; i++) {
      var cluster_class = "cluster cluster" + i + " layer" + i;
      clusters[i] = svg.selectAll(cluster_class)
                       .data(pack(ver_root[i]).children)
                       .enter().append("g")
                       .attr("class", function(d) {
                          if (d.data.change == -1)  return cluster_class + " dummy_cluster";
                          else return cluster_class; })
                       .attr("transform", function(d) { 
                          return "translate(" + parseFloat(d.x)  + "," + parseFloat(d.y) + ")"; })
                       .style("visibility", function(d){
                          if (version_list[i] != cur_idx) {
                            return "hidden";}
                          else if (d.data.change == -1) {
                            return "hidden";}
                          else {
                            return "visible";}
                       });
      clusters[i].append("circle")
                 .attr("class", "layer layer"+i)
                 .attr("name", function(d) {
                  return d.name; })
                 .attr("r", function(d) { return d.r; })
                 .style("fill", d3.color(version_colors[i]))
                 .style("opacity", "0.1")

      // write cluster names
      clusters[i].append("text")
                 .attr("class", "cluster_name")
                 .attr("transform", function(d) { 
                  if( d.y - d.r < 17){
                    return "translate(" + -d.r/6*5 + "," + -d.r/6*5 + ")"; }
                  else {
                    return "translate(" + 0 + "," + -d.r + ")";}
                 })
                 .selectAll("tspan")
                 .data(function(d) { return d.name.split(/(?=[A-Z][^A-Z])/g); })
                 .enter().append("tspan")
                 .text(function(d) { return d; })
                 .style("font-size", "15px")
                 .style("fill", "white")
                 .style("opacity", "0");
    }

    var cur_cluster = svg.selectAll(".cluster0");
    cur_cluster.selectAll("circle")
    .style("opacity", function(d) {
        return "0.1";
    });
    cur_cluster.selectAll("text")
    .style("opacity", function(d) {
        return "1";
    });
    $(".cluster0>text>tspan").css("opacity", "1");

    var ver_nodes = []
    for (var i=0; i<num_ver; i++){
      var nodes_class = "node node" + i;

      ver_nodes[i] = svg.selectAll(nodes_class)
                        .data(pack(ver_root[i]).leaves())
                        .enter().append("g")
                        .attr("class", function(d) {
                          if (d.data.change == -1) return nodes_class + " dummy_node";
                          else return nodes_class; })
                        .attr("version", function(d) { return d.data.version; })
                        .attr("cluster", function(d) { return d.data.cluster; })
                        .attr("transform", function(d) {
                        return "translate(" + parseFloat(d.x)  + "," + parseFloat(d.y) + ")"; })
                        .attr("from", function(d) {return d.data.from;})
                        .attr("diff", function(d) {
                          return ('diff' in d.data); })
                        .style("visibility", function(d){
                          if (d.data.version != start_version) {
                            return "hidden";
                          }
                          if (d.data.change == -1) {
                            return "hidden";
                          }
                        })

      // draw circles for components
      ver_nodes[i].append("circle")
                  .attr("name", function(d) { return d.name; })
                  .attr("r", function(d) { return d.r; })
                  .style("fill", function(d) {
                    var start_idx = getPosition(d.data.name, ".", ver_root[i].data.package_level-1)+1;
                    var end_idx = getPosition(d.data.name, ".", ver_root[i].data.package_level);
                    var package_name = d.data.name.slice(start_idx, end_idx);
                    
                    if (package_list.indexOf(package_name) == -1) return color(package_list.indexOf("leaf"))
                    else  return color(package_list.indexOf(package_name));
                  })
                  .attr("color", function(d) {
                    var start_idx = getPosition(d.data.name, ".", ver_root[i].data.package_level-1)+1;
                    var end_idx = getPosition(d.data.name, ".", ver_root[i].data.package_level);
                    var package_name = d.data.name.slice(start_idx, end_idx);
                    if (package_list.indexOf(package_name) == -1) return color(package_list.indexOf("leaf"))
                    else  return color(package_list.indexOf(package_name));
                  })
                  .style("opacity", function(d){
                    if (d.data.version != start_version) {
                      return "0.2";
                    }
                  });
      showColor();

      ver_nodes[i].append("clipPath")
                  .attr("name", function(d) { return "clip-" + d.name; })
                  .append("use")
                  .attr("xlink:href", function(d) { return "#" + d.name; });

      ver_nodes[i].append("text")
                  .attr("class", "comp_name")
                  .style("visibility", "hidden")
                  .attr("clip-path", function(d) { return "url(#clip-" + d.name + ")"; })
                  .selectAll("tspan")
                  .data(function(d) { 
                    if(d.class == undefined) return "";
                    else return d.class.split(/(?=[A-Z][^A-Z])/g); })
                  .enter().append("tspan")
                  .attr("x", 0)
                  .attr("y", function(d, i, nodes) { return 9 + (i - nodes.length / 2 - 0.5) * 7; })
                  .text(function(d) { return d; })

      ver_nodes[i].append("title")
                  .text(function(d) { return d.name; });
      
    }

    var nodes = [];
    for (var i=0; i<num_ver; i++){
      nodes.push(getAllNodes(ver_root[i]));
    }
  });
}


function showColor(){
  if ($("#show_color").is(':checked')) {
    $(".list_circle").css("display", "inline-block");
    $(".list_index").css("display", "inline-block");
  }
  else {
    $(".list_circle").css("display", "none");
    $(".list_index").css("display", "none");
  }
}

function showSingleVersion(version, num_ver) {
  if (is_selecting) {
    var list_id = "#ver" + version.replace(/\./g, '').replace(/\s/g, '');
    if ($(list_id).hasClass("chosen")) {
      $(list_id).removeClass("chosen");
      $(list_id).addClass("option");
    }
    else {
      $(list_id).removeClass("option");
      $(list_id).addClass("chosen");  
    }
    
    compare_versions[version_list.indexOf(version)] = getXOR(compare_versions[version],1)
    if (compare_versions.reduce(add, 0) == 2) {
      $("#compare_btn").removeAttr("disabled");
    }
    else {
      $("#compare_btn").attr("disabled", "disabled");
    }
  }

  else {
    cur_idx = version;
    if (viewMode == 'History') {
      changeAngle("Single");  
    }
    changeMode("Single");
    $("#current_ver").val(version);

    $("#show_history").prop("checked", false);

    var cluster_class = ".cluster" + version_list.indexOf(version);
    var node_class = ".node" + version_list.indexOf(version);
    var list_id = "#ver" + version.toString().replace(/\./g, '').replace(/\s/g, '');

    var all_cluster = ".cluster";
    var all_node = ".node";

    $(all_cluster).css("visibility", "hidden");
    $(all_node).css("visibility", "hidden");

    $(cluster_class).css("visibility", "visible");
    $(node_class).css("visibility", "visible");
    $('.dummy_node').css("visibility", "hidden");
    $('.dummy_cluster').css("visibility", "hidden");
    $(cluster_class).css("opacity", "1");
    $(node_class).css("opacity", "1");

    $(".comp_diff").css("visibility", "hidden");
    var svg = d3.select("#svg_history");

    $(".ver_list").removeClass("active");
    $(list_id).addClass("active");
    $(".hist_ver_list").removeClass("active");
    $(".hist_ver_list").css("display", "none");


    $(".node circle").attr("style", function(){
      return "fill: " + $(this).attr("color");
      
    });

    var all_cluster = svg.selectAll(".cluster");
    all_cluster.selectAll("circle")
    .style("opacity", function(d) {
        return "0";
    });
    all_cluster.selectAll("text")
    .style("opacity", function(d) {
        return "0";
    });
    var cur_cluster = svg.selectAll(cluster_class);
    cur_cluster.selectAll("circle")
    .style("visibility", "visible")
    .style("opacity", function(d) {
        return "0.1";
    });
    cur_cluster.selectAll("text")
    .style("opacity", function(d) {
        return "1";
    })
    cur_cluster.selectAll("tspan")
    .style("opacity", "1");

    var all_node = svg.selectAll(".node");

    all_node.selectAll("circle")
      .style("opacity", function(d) {
        return "0.2";
    });

    var cur_node = svg.selectAll(node_class);

    cur_node.selectAll("circle")
      .style("opacity", function(d) {
        return "1";
    });

    var issue_text = svg.selectAll(".comp_issue");
    issue_text.style("opacity", function(d) {
      if (d.data.version == version)
        return "1";
      else
        return "0.7";
    })
  }
  $('.dummy_node').css("visibility", "hidden");
    $('.dummy_cluster').css("visibility", "hidden");

}


function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

function getAllNodes(root) {
  var nodes = [];
  root.children.forEach(function(d) {
    if (d.children) {
      d.children.forEach(function(d){
        nodes.push(d);
      });
    }
  });
  return nodes;
}

function findTargetNode(nodes, source){
  var element_pos = nodes.map(function(x) {return x.name}).indexOf(source.name);
  var target_node = nodes[element_pos]
  return target_node;

};



