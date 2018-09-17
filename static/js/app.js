var url = "/names"; 
var otuIdList ; 

function buildMetadata(sample) {
  Plotly.d3.json(url, function(error, response) {
    console.log(response);

    var selDatasetSelect = document.getElementById("selDataset")

    for (name in response){
      var option = document.createElement("option");
      option.value = response[name];
      option.text = response[name];
      selDatasetSelect.appendChild(option);
    }
  })
};

function optionChanged(name){
  updateMetaData(name);
  generatePieChart(name);
  generateBubbleChart(name);
}

function updateMetaData(name){
  var url = 'metadata/'+name
  Plotly.d3.json(url, function(error, response) {
    console.log(response);

    var metadataList = document.getElementById("metadataList")
    while (metadataList.firstChild) {
      metadataList.removeChild(metadataList.firstChild);
    }

    var y = document.createElement("LI");
    var age = document.createTextNode("AGE: " + reponse.AGE);
    y.appendChild(age);
    document.getElementById("metadataList").appendChild(y);
 
    var y = document.createElement("LI");
    var bbtype = document.createTextNode("BBTYPE: " + reponse.BBTYPE);
    y.appendChild(BBTYPE);
    document.getElementById("metadataList").appendChild(y);

    var y = document.createElement("LI");
    var ethnicity = document.createTextNode("ETHNICITY: " + reponse.ETHNICITY);
    y.appendChild(ETHNICITY);
    document.getElementById("metadataList").appendChild(y);

    var y = document.createElement("LI");
    var gender = document.createTextNode("GENDER: " + reponse.GENDER);
    y.appendChild(GENDER);
    document.getElementById("metadataList").appendChild(y);

    var y = document.createElement("LI");
    var location = document.createTextNode("LOCATION: " + reponse.LOCATION);
    y.appendChild(LOCATION);
    document.getElementById("metadataList").appendChild(y);

    var y = document.createElement("LI");
    var sampleid = document.createTextNode("SAMPLEID: " + reponse.SAMPLEID);
    y.appendChild(SAMPLEID);
    document.getElementById("metadataList").appendChild(y);
  });

};
//function buildCharts(sample) {

function generatePieChart(name) {

  var url = "/samples/"+name
  Plotly.d3.json(url, function(error, response){

    console.log(response);
    var sampleData = response[0];
    var data = [{
      values: sampleData.sample_values.slice(0,9),
      lables: sampleData.otu_ids.slice(0,9),
      type: 'pie'
    }];

    var layout = {
      title:"OTU per Sample",
      yaxis: {
        autorange: true
      },
      Plotly:newPlot("piePlot", data, layout)
    }}
  })
};

function generateBubbleChart(name){
  var url = "/samples/"+name
  Plotly.d3.json(url, function(error, response){
    var sampleData = response[0];
    var trace1 = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids
      }
    };

    var data = [trace1];
    var layout = {
      title: "OTU vs Sample_values",
      showlegend: false,
      yaxis: {
        autorange: true
      }
    };
    Plotly.newPlot('bubblePlot', data, layout);
  });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
