function initMap() {
  require([
      "esri/views/MapView",
      "esri/Map",
      "esri/Graphic",
      "esri/widgets/Search",
      "esri/widgets/Home",
      "esri/widgets/BasemapGallery",
      "esri/widgets/Expand",
      "esri/widgets/Measurement",
      "esri/widgets/Expand/ExpandViewModel",
      "esri/identity/OAuthInfo",
      "esri/identity/IdentityManager",
      "esri/WebMap",
      "esri/widgets/LayerList",
      "esri/layers/GroupLayer",
      "esri/layers/FeatureLayer",
      "esri/request",
      "esri/layers/support/Field",
      "esri/widgets/Sketch",
      "esri/layers/GraphicsLayer",
      "esri/widgets/Print",
      "esri/widgets/ScaleBar",
      "esri/widgets/Compass",
      "esri/rest/locator",
      "esri/portal/Portal",
      "esri/geometry/support/webMercatorUtils",
      "esri/widgets/Sketch/SketchViewModel",
      "esri/widgets/Legend",
      "esri/widgets/Slider",
      "esri/symbols/support/symbolUtils",
   

      
  ], (
      MapView,
      Map,
      Graphic,
      Search,
      Home,
      BasemapGallery,
      Expand,
      Measurement,
      ExpandViewModel,
      OAuthInfo,
      esriId,
      WebMap,
      LayerList,
      GroupLayer,
      FeatureLayer, 
      request,
      Field,
      Sketch,
      GraphicsLayer,
      Print,
      ScaleBar,
      Compass,
      locator,
      Portal,
      webMercatorUtils,
      SketchViewModel,
      Legend,
      Slider,
      symbolUtils,
  

  ) => {
         //loader
    var loader = Object.assign(document.createElement('calcite-loader'), {
    });

     //theme
  const updateDarkMode = () => {
    // Calcite mode
    document.body.classList.toggle("calcite-mode-dark");
    // ArcGIS Maps SDK theme
    const dark = document.querySelector("#arcgis-maps-sdk-theme-dark");
    const light = document.querySelector("#arcgis-maps-sdk-theme-light");
    dark.disabled = !dark.disabled;
    light.disabled = !light.disabled;
    // ArcGIS Maps SDK basemap
    webmap.basemap = dark.disabled ? "topo-vector" : "dark-gray-vector";
    //map.basemap = dark.disabled ? "gray-vector" : "dark-gray-vector";
  };

  const themeButton = document.getElementById("themeButton");
  themeButton.addEventListener("click", function() {
      if(themeButton.innerHTML == 'Light mode'){
        themeButton.innerHTML = 'Dark mode'
        updateDarkMode()
      }else{
        themeButton.innerHTML = 'Light mode'
        updateDarkMode()

      }
  })
    //
    //Side panels
      function closeShellPanels() {
        const shells = document.getElementsByClassName("sideShells") 
        for (var i = 0; i < actions.length; i++) {
          shells[i].collapsed="true"
        }
        for (var i = 0; i < actions.length; i++) {
          actions[i].active = "false"
      }
      }
  
/*       //Reset panels when closed
      const sidePanels = document.getElementsByClassName("sidePanel") 
      for (var i = 0; i < sidePanels.length; i++) {
        sidePanels[i].addEventListener("calcitePanelClose", function(event) {
          closeShellPanels()
          console.log(event.target.closed)
          event.target.closed = "false"
          console.log(event.target.closed)
        })
    } */
  
      //Toggle Shells
      const actions = document.getElementsByClassName("sideActions");
      for (var i = 0; i < actions.length; i++) {
        actions[i].addEventListener("click", function(event) {
          var shellPanel = document.getElementById(event.target.id.replace("Action","ShellPanel"))
            if (shellPanel.collapsed) {
                closeShellPanels()
                shellPanel.collapsed = "false"
                this.active = "true"
            } else {
                closeShellPanels()
            }
        })
    }
  
   //////////////////////////////////////////////////////////////////////////////////////////////////////
 const portalUrl = "https://danec5.maps.arcgis.com"
            var expands = []
            //Allow Enterprise Logins
            const info = new OAuthInfo({
              appId: "NkxoSlP1vpd4tpbz",
                portalUrl: portalUrl,
              popup: false
            });
    
            esriId.registerOAuthInfos([info]);
            esriId.getCredential(info.portalUrl + "/sharing");
              //    
    
    
    
              const webmap = new WebMap({
              portalItem: {
                // autocasts as new PortalItem()
                id: "97bdf5f2c0ed4501815dd35ba096be19",
                portal: {
                  url: "https://danec5.maps.arcgis.com"
                }
              }
            });
    
            const view = new MapView({
              map: webmap,
              container: "viewDiv",
              constraints: {
                rotationEnabled: false,
               // maxZoom: 20
              }
            });

         
            view.when(function () {

        
         //signout
  const signOut = document.getElementById("signOut");
  signOut.addEventListener("click", function() {
      IdentityManager.destroyCredentials();
      location.reload();
  })

    //

            var searchAssetsSources = []
            var searchLocationsSources = []
            var allLayers = webmap.allLayers.items
            //var sewerLinesLayer
            Promise.all([
              allLayers.forEach((layer) => {
                if(layer.type == 'feature'){
                  layer.when(function(){
                    //console.log(layer)
                    var fieldNames = []
                    
                    layer.fields.forEach((field)=>{ fieldNames.push(field.name)})
                    //console.log(layer.title)
                    //console.log(fieldNames)
                  if(fieldNames.includes('STRUCTURE')){
                    
            
                  searchAssetsSources.push({
                    layer: layer,
                    searchFields: ["STRUCTURE"],
                    displayField: "STRUCTURE",
                    exactMatch: false,
                    outFields: ["STRUCTURE"],
                    name: layer.title,
                    maxSuggestions: 4
                  })
              }
              if (layer.title.includes('King County Parcels')){
                searchLocationsSources.push({
                  layer: layer,
                  searchFields: ["PIN"],
                  displayField: "PIN",
                  exactMatch: false,
                  outFields: ["PIN"],
                  name: layer.title,
                  maxSuggestions: 4
                })
              }
              if (layer.title.includes('Pierce County Parcels')){
                searchLocationsSources.push({
                  layer: layer,
                  searchFields: ["TaxParcelNumber"],
                  displayField: "TaxParcelNumber",
                  exactMatch: false,
                  outFields: ["TaxParcelNumber"],
                  name: layer.title,
                  maxSuggestions: 4
                })
              }
            }
            )}
          })
            ]).then(()=>{

          //
              
          
            //Search Widget
            const searchAssets = new Search({
              view: view,
              sources: searchAssetsSources,
              includeDefaultSources: false,
              allPlaceholder: "Find assets",
              resultGraphicEnabled: false,
              container: document.getElementById("searchDiv"),
              locationEnabled: false 
          });


                     
            //Search Widget
            const searchLocation = new Search({
              view: view,
              sources: searchLocationsSources,
              includeDefaultSources: true,
              allPlaceholder: "Find locations",
              resultGraphicEnabled: false  
          });

          view.ui.add(searchLocation, {
              position: "top-left",
              index: 0
          }); 


          searchAssets.on("select-result", function(event) {
            var feature = event.result.feature;
            event.result.feature.layer.visible = true;
            event.result.feature.layer.parent.visible = true;
            view.goTo(feature.geometry);
          });

          //Close expands when another opens
          expands.forEach(function(expand) {
            console.log(expand.expandIconClass)
            expand.watch("expanded", function(expanded) {
              if (expanded) {
                // Loop through all the other Expand objects and collapse them
                expands.forEach(function(otherExpand) {
                  if (otherExpand !== expand) {
                    otherExpand.collapse();
                  }
                });
              }
            });
          });
          //

        })
        })


      //scalebar
      let scaleBar = new ScaleBar({
        view: view,
        position: "bottom-left",
        index: 0
      });
      //


/*       //compass
      const compassWidget = new Compass({
        view: view
      });

      // Add the Compass widget to the top left corner of the view
      view.ui.add(compassWidget, "top-left");
      // */



      //print widget
      const print = new Print({
        view: view,
        heading: "pickles",
        container: document.getElementById("printPanel"), 
        // specify your own print service
        printServiceUrl:
          "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
      });
//

//
var legend = new Legend({
  view: view,
  container: document.getElementById("legendDiv")
});
//

      //sketch
      const graphicsLayer = new GraphicsLayer({
        listMode: "hide"
      });
      webmap.add(graphicsLayer)

      const sketch = new Sketch({
        layer: graphicsLayer,
        view: view,
        // graphic will be selected as soon as it is created
        creationMode: "update",
        container: document.getElementById("sketchDiv")

      });




 ///////////// Reverse Geocode & Google Streetview in right click popup//////////////////////////
 view.on("click", function(event) {
  //if right click
  if(event.button == 2){

    // you must overwrite default click-for-popup
    // behavior to display your own popup
    view.popupEnabled = false;
  
    // Get the coordinates of the click on the view
    let lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
    let lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
  
    const params = {
      location: event.mapPoint
    };

    //const serviceUrl = "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";
    //const serviceUrl = "https://gis.auburnwa.gov/mapping/rest/services/CityofAuburnComposite/GeocodeServer"
    const serviceUrl = "https://gis.auburnwa.gov/portal/sharing/servers/0a7c9c19701a4561837bb621ebe9bd6f/rest/services/World/GeocodeServer"
    var address
    locator.locationToAddress(serviceUrl, params).then(
      function (response) {
        // Show the address found
        console.log(response)
        //address = response.attributes.LongLabel;
        address = response.address;

      },
      function (err) {
        // Show no address found
        console.log('No address found')
        address = ''
      }
      
    ).then( function(){
      view.openPopup({
        // Set the popup's title to the coordinates of the location
        title: `Reverse geocode`,
        location: event.mapPoint, // Set the location of the popup to the clicked location
        content: `${address}<br>[ ${lon} ,  ${lat} ]<a target="_blank" href="https://www.google.com/maps/@?api=1&amp;map_action=pano&amp;viewpoint=${event.mapPoint.latitude},${event.mapPoint.longitude}">Google Streetview</a>`  // content displayed in the popup
      });
    });

  }
  })

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

      //Upload a shapefile
      document.getElementById("uploadForm").addEventListener("change", (event) => {
        const fileName = event.target.value.toLowerCase();

        if (fileName.indexOf(".zip") !== -1) {
          //is file a zip - if not notify user
          generateFeatureCollection(fileName);
        } else {
          document.getElementById("upload-status").innerHTML =
            '<p style="color:red">Add shapefile as .zip file</p>';
        }
      });

      const fileForm = document.getElementById("mainWindow");


      function generateFeatureCollection(fileName) {
        let name = fileName.split(".");
        // Chrome adds c:\fakepath to the value - we need to remove it
        name = name[0].replace("c:\\fakepath\\", "");

        document.getElementById("upload-status").innerHTML =
          "<b>Loading </b>" + name;

        const params = {
          name: name,
          targetSR: view.spatialReference,
          maxRecordCount: 1000,
          enforceInputFileSizeLimit: true,
          enforceOutputJsonSizeLimit: true
        };

        // generalize features to 10 meters for better performance
        params.generalize = true;
        params.maxAllowableOffset = 10;
        params.reducePrecision = true;
        params.numberOfDigitsAfterDecimal = 0;

        const myContent = {
          filetype: "shapefile",
          publishParameters: JSON.stringify(params),
          f: "json"
        };

        request(info.portalUrl + "/sharing/rest/content/features/generate", {
          query: myContent,
          body: document.getElementById("uploadForm"),
          responseType: "json"
        })
          .then((response) => {
            const layerName =
              response.data.featureCollection.layers[0].layerDefinition.name;
            document.getElementById("upload-status").innerHTML =
              "<b>Loaded: </b>" + layerName;
            addShapefileToMap(response.data.featureCollection);
          })
          .catch(errorHandler);
      }

      function errorHandler(error) {
        document.getElementById("upload-status").innerHTML =
          "<p style='color:red;max-width: 500px;'>" + error.message + "</p>";
      }

      function addShapefileToMap(featureCollection) {
        let sourceGraphics = [];

        const layers = featureCollection.layers.map((layer) => {
          const graphics = layer.featureSet.features.map((feature) => {
            return Graphic.fromJSON(feature);
          });
          sourceGraphics = sourceGraphics.concat(graphics);
          const featureLayer = new FeatureLayer({
            objectIdField: "FID",
            source: graphics,
            fields: layer.layerDefinition.fields.map((field) => {
              return Field.fromJSON(field);
            })
          });
          return featureLayer;

        });
        webmap.addMany(layers);
        view.goTo(sourceGraphics).catch((error) => {
          if (error.name != "AbortError") {
            console.error(error);
          }
        });

        document.getElementById("upload-status").innerHTML = "";
      }
      //

    

      view.when(() => {
      //coordinates
      //add coordinates to map
      var coordsWidget = document.createElement("div");
      coordsWidget.id = "coordsWidget";
      coordsWidget.className = "esri-widget esri-component";
      coordsWidget.style.padding = "5px 7px 5px";
      coordsWidget.style.fontSize = "10px"

      
      view.ui.add(coordsWidget, "bottom-left"); 
        
      
          

      //coordinate actions
        function showCoordinates(pt) {
          var coords =
            "Lat/Lon " +
            pt.latitude.toFixed(5) +
            " " +
            pt.longitude.toFixed(5) +
            " | Scale 1:" +
            Math.round(view.scale * 1) / 1 +
            " | Zoom " +
            view.zoom;
          coordsWidget.innerHTML = coords;
        }

        view.watch("stationary", function (isStationary) {
          showCoordinates(view.center);
        });

        view.on("pointer-move", function (evt) {
          showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
        });
      //
   


      });

       //meaurement
      const measurement = new Measurement({
        view: view,
        container: document.getElementById("measurePanel"),
        linearUnit: "imperial",
        areaUnit: "imperial"
      });
      

      measureDistanceButton = document.getElementById("measureDistanceButton")
      measureAreaButton = document.getElementById("measureAreaButton")
      measurementClearButton = document.getElementById("measureClearButton")

      measureDistanceButton.addEventListener("click", function(){
        measurement.activeTool = "distance"
      })
      measureAreaButton.addEventListener("click", function(){
        measurement.activeTool = "area"
      })

      measureClearButton.addEventListener("click", function(){
        measurement.clear()
      })
//

      

      // Home button
      var homeBtn = new Home({
          view: view
      });
      view.ui.add(homeBtn, "top-left");
      //

      //Add Layer from URL
     
  
      var addLayer = (url) => {
        console.log('addLayer ', url);
        const layer = new FeatureLayer({
          url: url // try this layer: https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0
        });
        view.map.layers.add(layer);
        document.getElementById('url').value = '';
      }
      document.getElementById('goButton').addEventListener('click', (evt) => {
        addLayer(document.getElementById('url').value);
      });


      //

      //basmap gallery
      var basemapGallery = new BasemapGallery({
          view: view,
          container: document.getElementById("basemapDiv"), //basemapPanel
          source: { // autocasts to PortalBasemapsSource
            portal: "https://danec5.maps.arcgis.com"
        }
      });

  //
         //layerList with Legend & Actions //
         const layerList = new LayerList({
          view: view,
          container: "sidePanel",
          index: 1,
          visibilityAppearance: "checkbox",
          collapseButton: true,
          filterPlaceholder: "",
          minFilterItems: 1,
          visibleElements: {
            filter: true
          },
          listItemCreatedFunction: function (event) {


          



              const item = event.item;


            //Add Legend to Layer List
            if (item.layer.type != "group") {

   

            //add legend symbol to layer title
            event.item.layer.when(function(){
              if(event.item.layer.renderer.type=="simple"){


                item.actionsSections = [
                  [
                          {
                            title: "Toggle Labels",
                            className: "esri-icon-labels",
                            id: "toggle-labels"
                          },
                        
                          {
                            title: "Opacity",
                            className: "esri-icon-sliders-horizontal",
                            id: "Opacity"
                          },
              
                          {
                            title: "Information",
                            className: "esri-icon-question",
                            id: "Info"
                          }
                        ]
                      ];


              var symbol = event.item.layer.renderer.symbol 
              var options = {
                size: {
                  width: 15,
                  height: 8
                }
              }
              symbolUtils.renderPreviewHTML(symbol, options).then(function(testSymbol){
                var collection = document.getElementsByClassName('esri-layer-list__item-content');
                for (var i of collection) {
                  if (i.innerHTML == event.item.layer.title){
                    testSymbol.style.marginRight= "10px";
                    i.insertBefore(testSymbol, i.firstChild);   
     
              } 
            }
            })
          }else if(event.item.layer.renderer.type!="simple"){

            var collection = document.getElementsByClassName('esri-layer-list__item-content');
            for (var i of collection) {
              if (i.innerHTML == event.item.layer.title){

                    i.style.marginLeft = "40px"
 
          } 
        }

            item.actionsSections = [
              [
                      {
                        title: "Toggle Labels",
                        className: "esri-icon-labels",
                        id: "toggle-labels"
                      },
                    
                      {
                        title: "Opacity",
                        className: "esri-icon-sliders-horizontal",
                        id: "Opacity"
                      },
          
                      {
                        title: "Information",
                        className: "esri-icon-question",
                        id: "Info"
                      },
                      {
                        title: "Legend",
                        className: "esri-icon-legend",
                        id: "Legend"
                      }
                    ]
                  ];


                  var sidePanelLegend = new Legend({
                    view: view,
                    respectLayerVisibility: false,
                    //container: sidePanelLegendContainer,
                    layerInfos: [{
                        layer: item.layer, title: ''
                    }]
                });

                  item.panel = {
                    content: sidePanelLegend,
                    open: false
                };

/*             //Add legend button
            var collection = document.getElementsByClassName('esri-layer-list__item-content');
            for (var i of collection) {
              if (i.innerHTML == event.item.layer.title){

                var legendAction = document.createElement("calcite-action")
                legendAction.icon = "legend"
                legendAction.text = "Legend"
                legendAction.textEnabled = false 
                legendAction.style = 'width: 40px; align: center; border: none;'
                legendAction.slot = 'actions-start'








                i.parentElement.append(legendAction) 


                legendAction.addEventListener("click", (event) =>{
                  console.log(typeof(i))
                 // i.appendChild(sidePanelLegend)
                   if(item.panel.open == false){
                    item.panel.content = sidePanelLegend
                    item.panel.open = true
                  }else{
                    item.panel.open = false
                  } 
                }) 
                //


    
    
    


   

              }
            } */
          }

            })



              }
          }
          
      });

      //LayerList Actions Function
        layerList.on("trigger-action", function(event) {

          //var actionLayers = event.item.layer.layers
          var actionLayer = event.item.layer

          var id = event.action.id;
         
          if (id === "Opacity") {
            
            const mySlider = new Slider({
              min: 0,
              max: 1,
              steps: .05,
              values: [1],
              //container: popOver,
              snapOnClickEnabled: true,
              visibleElements: {labels: false,
                                  rangeLabels: false}
            });

            
  
            mySlider.on("thumb-drag", event => {
              actionLayer.opacity = event.value
            });


        
             event.item.panel = {
              content: mySlider,
              icon: "sliders-horizontal",
              open: true,
              visible: true
          }; 


          }


          
          else if (id=="Legend"){
 
                  
/*               var symbol = event.item.layer.renderer.symbol 
              symbolUtils.renderPreviewHTML(symbol).then(function(testSymbol){
                var collection = document.getElementsByClassName('esri-layer-list__item-content');
                for (var i of collection) {
                  if (i.innerHTML == event.item.layer.title){
                    console.log(i.innerHTML)
                    //i.appendChild(testSymbol) 
                    i.insertBefore(testSymbol, i.firstChild);   
              } 
            }
            }) */

 

       
              var sidePanelLegend = new Legend({
                view: view,
                respectLayerVisibility: false,
                layerInfos: [{
                    layer: event.item.layer, title: ''
                }]
            });
              event.item.panel = {
                content: sidePanelLegend,
                open: true
            };
            
            
            




          }
          
          else if (id === "toggle-labels"){
            console.log(event.item.layer)
            if(event.item.layer.labelsVisible === false){
              event.item.layer.labelsVisible = true
            }else{
              event.item.layer.labelsVisible = false
            }
  
            }

          else if (id == "Info"){
            console.log(event.item)
            if(event.item.layer.resourceReferences.portalItem){
              var infoURL = event.item.layer.resourceReferences.portalItem.itemPageUrl
              
            }else{
              var infoURL = event.item.layer.parsedUrl.path
            }
            
            console.log(infoURL)
            window.open(infoURL, "_blank");
          }


        });




      //
      //

      //Hide Loader and show map once map is loaded.
      view.when(function() {
          document.querySelector("calcite-loader").hidden = true;



//Google Streetview

      const googleGraphicsLayer = new GraphicsLayer({
        listMode: "hide"
      });

      //intial point location (really doesn't matter where as it gets updated as soon as the streetview window is opened)
      var point = {
        type: "point",
        longitude: -122.20,
        latitude: 47.29
      };

      var markerSymbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          path: "M5.5,0 14.5,9 23.5,0 14.5,29z",
          color: "#ffff00",
          outline: {
              color: [0, 0, 0],
              width: 1
          },
          angle: 180,
          size: 15
      };


      var markerGraphic = new Graphic({
        geometry: webMercatorUtils.geographicToWebMercator(point),
        symbol: markerSymbol
      });

      googleGraphicsLayer.graphics.add(markerGraphic);
           
      //Inialize pano
      var pano = new google.maps.StreetViewPanorama(
        document.getElementById("pano"), {
            position: {
                lat: markerGraphic.geometry.latitude,
                lng: markerGraphic.geometry.longitude
            },
            pov: {
                heading: markerSymbol.angle - 180,
                pitch: 0
            },
            zoom: 1,
            motionTracking: false
        }

      );   
              //Intialize sketchViewModel for the googleGraphicsLayer            
              const sketchViewModel = new SketchViewModel({
                view: view,
                layer: googleGraphicsLayer,
                updateOnGraphicClick: true,
                pointSymbol: markerSymbol
              });
          
              //sketchViewModel.update(markerGraphic); //need this? Doesn't seem to work
             
              //Update Pano when marker moves and automatically Complete sketch when finished moving
              sketchViewModel.on('update', function(event){
                
                if (event.toolEventInfo) {
                  if (event.toolEventInfo.type === "move-stop") {
                     var newPosition = new google.maps.LatLng({lat: event.graphics[0].geometry.latitude, lng: event.graphics[0].geometry.longitude});
                    pano.setPosition(newPosition);
                    
                  }
                }
              });  
      
              //Update pano when sketch completes and update marker to where the pano ended up
              google.maps.event.addListener(pano, "position_changed", function() {
                sketchViewModel.complete(markerGraphic)

                  var lat = pano.getPosition().lat();
                  var lng = pano.getPosition().lng();

                  markerGraphic.geometry = {
                      type: "point",
                      x: lng,
                      y: lat
                  };
                  //recenter view to place graphic in middle
                  view.goTo(markerGraphic.geometry)
              });  

 
               // Update the marker position and direction when the street view changes
              google.maps.event.addListener(pano, "pov_changed", function() {
                  var heading = pano.getPov().heading;
                  markerSymbol.angle = heading - 180;
                  markerGraphic.symbol = markerSymbol
              })   

      var streetViewButton = document.getElementById('streetViewButton')
      view.ui.add(streetViewButton, "top-right");

      //Listen for when the Streetview button is clicked. Add/remove marker and update the Pano to be the center
      //of the view
      streetViewButton.addEventListener("click", function() {

          if (document.getElementById('pano').style.display == 'block') {
              document.getElementById('pano').style.display = 'none'
              webmap.remove(googleGraphicsLayer)

          } else if (document.getElementById('pano').style.display == '' || document.getElementById('pano').style.display == 'none') {
              document.getElementById('pano').style.display = 'block'
              console.log(point)
              console.log(view)
              markerGraphic.geometry = {
                type: "point",
                x: view.center.longitude,
                y: view.center.latitude
            };
            var newPosition = new google.maps.LatLng({lat: view.center.latitude, lng: view.center.longitude});
            pano.setPosition(newPosition);
            webmap.add(googleGraphicsLayer)

          }
      });
    });
 
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

document.querySelector("calcite-loader").hidden = true;

    // Load the user's profile from the portal
    var portal = new Portal({
      url: portalUrl
  });
    portal.authMode = "immediate";

    portal.load().then(function() {
      //console.log(portal.user)
      var userName = portal.user.username
      var fullName = portal.user.fullName
      var userFirstName = portal.user.fullName.split(" ")[0]
      var userLastName = portal.user.fullName.split(" ")[1]
      var email = portal.user.email
      var thumbnail = portal.user.thumbnailUrl

/*    console.log("First Name:", userFirstName);
      console.log("Last Name:", userLastName);
      console.log("Full Name:", fullName);
      console.log("User Name:", userName);
      console.log("Email:", email);
      console.log("thumbnail: ", thumbnail) */

      document.getElementById("user").username = userName
      document.getElementById("user").fullName = fullName
      document.getElementById("user").thumbnail = thumbnail



      //save web map
      const saveActionPadAction = document.getElementById("saveActionPadAction")
      saveActionPadAction.addEventListener("click", function(){

        //open loader
        document.body.appendChild(loader);

        //close popover
        document.getElementById("savePopover").open = false

        const saveOptions = {
          scalePreserved : true //default is false
        }
 
        view.map.updateFrom(view, saveOptions).then(() => {
          view.map.save().then((item) => {
            document.body.removeChild(loader);
            saveAlert.open = true
            buildGallaries()
             
            })
            // Save didn't work correctly
            .catch((error) => {
              document.body.removeChild(loader);
              console.log(error)
            });
      });
    })

      const saveAsActionPadAction = document.getElementById("saveAsActionPadAction")
      saveAsActionPadAction.addEventListener("click", function(){

        //creat modal workflow ehre
        const saveAsModal = Object.assign(document.createElement('calcite-modal'), {
          closeButtonDisabled: true,
          open: true
        });

        const saveAsModalHeader = Object.assign(document.createElement('div'), {
          innerHTML: "Save Web Map",
          slot: "header"
        });

        const saveAsButton = Object.assign(document.createElement('calcite-button'), {
          slot:"primary",
           width:"full",
           innerHTML: "Save"
        });

        const closeSaveAsModal = Object.assign(document.createElement('calcite-button'), {
          slot:"secondary",
           width:"full",
           innerHTML: "Cancel",
           appearance: "outline"
        });


        const saveAsModalContent = Object.assign(document.createElement('div'), {
          slot: "content"
        });

        const saveAsTitleInput = Object.assign(document.createElement('calcite-input'), {
        });

        const saveAsTitleInputLabel = Object.assign(document.createElement('calcite-label'), {
          innerHTML: "Title:"
        });

        const saveAsDescriptionInput = Object.assign(document.createElement('calcite-input'), {
        });

        const saveAsDescriptionInputLabel = Object.assign(document.createElement('calcite-label'), {
          innerHTML: "Description:"
        });

        saveAsModalContent.appendChild(saveAsTitleInputLabel)
        saveAsModalContent.appendChild(saveAsDescriptionInputLabel)
        
        saveAsDescriptionInputLabel.appendChild(saveAsDescriptionInput)
        saveAsTitleInputLabel.appendChild(saveAsTitleInput)

        saveAsModal.appendChild(saveAsModalContent)
        saveAsModal.appendChild(saveAsButton)
        saveAsModal.appendChild(closeSaveAsModal)
        saveAsModal.appendChild(saveAsModalHeader)
        document.body.appendChild(saveAsModal)


      closeSaveAsModal.addEventListener("click", function() {
        saveAsModal.open = false
      })

      saveAsButton.addEventListener("click", function(){

        document.body.removeChild(saveAsModal)
        
        //open loader
        document.body.appendChild(loader);

        console.log('Title Input Value: '+saveAsTitleInput.value)

        var item = {
          title: saveAsTitleInput.value,
          description: saveAsDescriptionInput.value,
          tags: ["M&OSaves"],
          portal: {
            url: portalUrl
          }
        }

        const saveOptions = {
          scalePreserved : true //default is false
        }


      view.map.updateFrom(view, saveOptions).then(() => {
        view.map
          .saveAs(item)
          .then((item) => {
            console.log(item.id)
             //open saved as
            const newMap = new WebMap({
              portalItem: {
                id: item.id,
                portal: {
                  url: portalUrl
                }
              }
            })
            
            //go to the intialView of the web map being loaded
            newMap.when((event) => {
              console.log('newMap.When')
              view.goTo(newMap.initialViewProperties.viewpoint)
              //buildGallaries()
            })

          view.map = newMap 
        

            //close loader & open save alert
            document.body.removeChild(loader);
            saveAlert.open = true
            //buildGallaries()
 
/*              //need to wait till the thumbnail is saved and has a url
            setTimeout(function () { 
              buildGallaries() 
            }, 5000) //this wait time needs reviewed  */ 
            
          })
          // Save didn't work correctly
          .catch((error) => {
              console.log("ERROR")
              document.body.removeChild(loader);
              console.log(error)
          });
      });



      })
    })
      ///

      //check to see if the map changed do you own the web map? if so allow save
      var currentMap = view.map;
      setInterval(function () {
        if (view.map !== currentMap) {
          console.log("Map changed");
          currentMap = view.map
          console.log(view)
          buildGallaries()
          if(currentMap.portalItem.owner == portal.user.username){
            console.log("save enabled")
            document.getElementById("saveActionPadAction").disabled = false
          }else{
            console.log("save disabled")
            document.getElementById("saveActionPadAction").disabled = true
          }
        }
      }, 5000);
    ///////

      //Web Map Gallary//////////////////////////////////////////////////////////////////////////////////
      function buildGallary(queryParams, gallary){
        //clear gallary so it doesn't get repeated
        while (gallary.firstChild) {
          gallary.removeChild(gallary.lastChild);
        }

      portal.queryItems(queryParams).then((result) => {
        //create gallary items for each web map
        result.results.forEach((webMap) => {
          //console.log(webMap)

          const listItemImage = Object.assign(document.createElement('img'), {
            src: webMap.thumbnailUrl,
            slot: 'content-end',
          });

          const listItem = Object.assign(document.createElement('calcite-list-item'), {
            label: webMap.title,
            description: webMap.description,
            value: webMap.id,
           // style: "padding-bottom: 5%; padding-top: 5%;",
            innerHTML: `<div" slot="content">
            <h4>${webMap.title}</h4><br>
            ${webMap.owner}<br>
            ${webMap.modified.toDateString()}<br>
            ${webMap.access}
            <div>`
          });

          //this doesn't work when saving as of a copy and a web map was opened from the gallary
          if(webMap.id == view.map.portalItem.id){
            console.log(`Active map: ${webMap.title}`)
            listItem.selected = true
          }

      
          listItem.appendChild(listItemImage)
          gallary.appendChild(listItem)

          //add event listener to each web map to update the view
          listItem.addEventListener("click", function(event){
              
            
             function openWebMap(webMapID){
              
              //create modal
              const modalHeader = Object.assign(document.createElement('div'), {
                slot: "header",
                innerHTML: `${webMap.title} &nbsp&nbsp<calcite-chip value="web map" icon="map">Web Map</calcite-chip>` 
              })

              const modalContent = Object.assign(document.createElement('calcite-card'), {
                heading: "Overview",
                slot: "content",
                innerHTML: `<div style = "display: flex; flex-direction: row; padding-bottom: 5%;">
                <img src = ${listItemImage.src}></img><br>
                <div style = "  display: flex;flex-direction: column; padding-left:5%;">
                <b>Description:</b> ${webMap.description}<br>
                <b>Owner:</b> ${webMap.owner}<br>
                <b>Last modified:</b> ${webMap.modified.toDateString()}<br>
                <b>Share:</b> ${webMap.access}
                </div>     
                </div>  
                <calcite-link kind="brand" target="_blank" href="https://auburn.maps.arcgis.com/home/item.html?id=${webMap.id}">View item details</calcite-link>     
                `
              })
              
              
              const modal = Object.assign(document.createElement('calcite-modal'), {
                header: webMap.title,
                contentTop: webMap.description,
                content: modalContent,
                open: true,
                outsideCloseDisabled: true,
                closeButtonDisabled: true
              })


              modal.appendChild(modalHeader)
              modal.appendChild(modalContent)

              //if open button clicked load new webMap
              const modalOpenButton = Object.assign(document.createElement('calcite-button'), {
                innerHTML: "Open",
                slot: "primary"
              })

              modalOpenButton.addEventListener("click", function(event){
                  //update view with selected map
                  const newMap = new WebMap({
                    portalItem: {
                      id: webMapID,
                      portal: {
                        url: portalUrl
                      }
                    }
                  })
                  
                  //go to the intialView of the web map being loaded
                  newMap.when((event) => {
                    console.log('newMap.When')
                    view.goTo(newMap.initialViewProperties.viewpoint)
                    //buildGallaries()
                  })

                //update the map in the view
                view.map = newMap

                //delete the modal
                modal.remove()
                

              })

              //if cancel clicked close modal
              const modalCancelButton = Object.assign(document.createElement('calcite-button'), {
                innerHTML: "Close",
                slot: "secondary",
                appearance: "outline"
              })

              modalCancelButton.addEventListener("click", function(event){
                modal.remove()
                buildGallaries()
              })

              modal.appendChild(modalCancelButton)
              modal.appendChild(modalOpenButton)
              document.body.appendChild(modal);
              
            }

            openWebMap(listItem.value)
            

          })
        })

      })
}

const webMapGallaryPrivate = document.getElementById("webMapGallaryPrivate")
const webMapGallaryOrg = document.getElementById("webMapGallaryOrg")


function buildGallaries(){
var queryParams = {
  query: `owner: ${portal.user.username} AND type: "Web Map" AND tags: "M&OSaves"`,
  sortField: "modified",
  sortOrder: "desc", //"asc" or "desc"
  num: 100
};

buildGallary(queryParams, webMapGallaryPrivate)

var queryParams = {
  query: `orgid: "Talr0y9yrNfatLSI" AND type: "Web Map" AND tags: "M&OSaves"`,
  sortField: "modified",
  sortOrder: "desc", //"asc" or "desc"
  num: 100
};

buildGallary(queryParams, webMapGallaryOrg)
      
}

buildGallaries()
///////////////////////////////////////////////////////////////////////////////////////////////


    })
//////////


  })
}
