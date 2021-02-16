// store URL for USGS data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// insert map object into div w id of 'map'
var myMap = L.map("map", {
    center: [29.4241, -98.4936],
    zoom: 13
});
  
// adding a tile layer (the background map image) to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// query the URL
d3.json(queryUrl, function(data) {
  
  // 
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: .7,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "black",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // set different color from magnitude
  function getColor(depth) {
    switch (true) {
        case depth > 90:
            return "#e71313";
        case depth > 70:
            return "#12e216";
        case depth > 50:
            return "#80b6f5";
        case depth > 30:
            return "#2ceabf";
        case depth > 10:
            return "#d4ee00";
        default:
            return "#98ee00";
    }
  }

  // set radiuss from magnitude
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

   // GeoJSON layer
   L.geoJson(data, {

      // create cricles
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      
      // circle style
      style: styleInfo,
      
      // popup for each marker
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
      }
   }).addTo(myMap);

   // an object legend
   var legend = L.control({
      position: "bottomright"
   });

   // details for the legend
   legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend"),
      depth = [-10, 10, 30, 50, 70, 90];
  
      // Looping through
      for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
          "<i style='background: " + getColor(depth[i] + 1) + "'></i> " +
          depth[i] + (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    // Finally, we our legend to the map.
    legend.addTo(myMap);
});
