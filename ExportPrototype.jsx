/*  ExportPrototype.jsx
    Copyright (C) 2014 Rory Pickering
    http://www.rorypickering.com/

    Licensed under GNU General Public License Version 3. 
    (http://www.gnu.org/licenses/gpl-3.0-standalone.html)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
*/

// Initial pop-up
var dialog =
  "dialog { content: Group { \
      exporttype: Group { orientation: 'column', alignChildren: 'left', margins: 0, \
           option1: RadioButton { text: 'New prototype', assignmet: 'left'}, \
           option2: RadioButton { text: 'Update images', assignmet: 'left'}, \
           option3: RadioButton { text: 'Update HTML and CSS', assignmet: 'left'}, \
    }, \
  }, \
        buttons: Group { orientation: 'row', \
          ok: Button { text: 'OK', properties:{name:'ok'} }, \
          cancel: Button { text: 'Cancel', properties:{name:'cancel'} }, \
    } \
}";

popup = new Window (dialog);
popup.text = "Export prototype";
popup.content.exporttype.option1.value = true;

popup.buttons.ok.onClick = function() {
  if (popup.content.exporttype.option1.value == true) {
    saveCode();
    saveImages();
    revertDoc();
  }
  if (popup.content.exporttype.option2.value == true) {
    saveImages();
  }
  if (popup.content.exporttype.option3.value == true) {
    saveCode();
  }
  
  popup.close(0);
}

popup.buttons.cancel.onClick = function() {
  popup.close(0);
}

if(app.activeDocument.artboards.length > 1) {
  alert('Documents with more than one artboard are not compatible with this script');
}
else if (!app.activeDocument.saved){
      Window.alert("Please save your document first!");
    }
else {
  popup.center();
  popup.show();
}

//Save HTML/JS/CSS
function saveCode() {

  var doc = app.activeDocument;
  var css = new Array();
  mypath = doc.path;
  var jsLocation = mypath+'/js';
  var jsFolder = new Folder(jsLocation);
  jsFolder.create();

  var jsFile = new File (mypath + '/js/' + "scripts.js");
  jsFile.open ("w:");

  var jsDefault = (
  "$(document).ready(function(){\n" +
  "\t$('div').click(function(){\n" +
      "\t\t$(this).animate({marginLeft: '+=20px'},80).animate({marginLeft: '-=20px'},80).animate({marginLeft: '+=20px'},80).animate({marginLeft: '-=20px'},80);\n" +
    "\t})\n" +
    "})"
  )

  jsFile.write(jsDefault);

  var htmlFile = new File (mypath + "/index.html");
  htmlFile.open ("w:");

  var htmlHead = (
  "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head>\n" + 
    "\t<meta charset=\"utf-8\" />\n\n" +
    "\t<link rel=\"stylesheet\" href=\"style.css\">\n" +
    "\t<script type=\"text/javascript\" src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js\"></script>\n" +
    "\t<script type=\"text/javascript\" src=\"js/scripts.js\"></script>\n" +
    "\t<title>untitled</title>\n\n" +
    "</head>\n" + 
    "<body>\n"
    )

  htmlFile.write(htmlHead);
  
  for (i=doc.layers.length-1; i>=0; i--){
    if (doc.layers[i].visible == true && doc.layers[i].pageItems.length > 0) {
      htmlFile.write(layerToHtml (doc.layers[i],0));
    }
  }

  htmlFile.write("</body>\n</html>\n");
  htmlFile.close();

  var cssFile = new File (mypath + "/style.css");
  cssFile.open("w:");
  var e;

  var cssDefault = (
    "body {\n" + 
    "width: 100px;\n" +
    "height: 100px;\n" +
    "overflow: hidden;\n" +
    "}\n"
    )
  cssFile.write(cssDefault);

  for (i=0; i<doc.layers.length; i++){
    if (doc.layers[i].visible == true && doc.layers[i].pageItems.length > 0) {
      if (doc.layers[i].visible == true && doc.layers[i].pageItems.length > 1) {
        groupLayer(doc.layers[i],0);
      }
      cssFile.write(layerToCss (doc.layers[i],0));
    }
  }

  cssFile.close();

//Group layer items
  function groupLayer (thisLayer) {

    var layerName = String(thisLayer.name);
    var theGroup = doc.groupItems.add();
    theGroup.name = layerName + " group";
    theGroup.move(thisLayer, ElementPlacement.PLACEATBEGINNING );

    for (var a = thisLayer.pageItems.length - 1; a > 0; a--) {
            thisLayer.pageItems[a].locked = false;
            if(thisLayer.pageItems[a].guides != true) {
              thisLayer.pageItems[a].move( theGroup , ElementPlacement.PLACEATBEGINNING);
            }
    };
  };

  //Generate HTML div from a layer
  function layerToHtml (thisLayer) {
    var layerName = String(thisLayer.name);
    
    // var sublayers = thisLayer.layers.length;

    // if (sublayers > 0) {
    //   for (j=0; j<sublayers; j++) {
    //     f += "\n\t" + layerToHtml(thisLayer.layers[j]);
    //   }
    // }

    e = "<div class='" + layerName + "'></div>\n";

    return e;
    }
}

  //Generate CSS properties from a layer
  function layerToCss (thisLayer) {
    
    var layerName = String(thisLayer.name);
    var f = "";

    // var sublayers = thisLayer.layers.length;

    // if (sublayers > 0) {
    //   for (j=0; j<sublayers; j++) {
    //     f += layerToCss(thisLayer.layers[j]);
    //   }
    // }

    var layerHeight = Math.round(thisLayer.pageItems[0].height);
    var layerWidth = Math.round(thisLayer.pageItems[0].width);
    var layerImage = "img/" + layerName + ".png";
    var xPos = Math.round(thisLayer.pageItems[0].position[0]);
    var yPos = (Math.round(thisLayer.pageItems[0].position[1])) * -1;

    e =  "." + layerName + " { \n" + 
    "\tposition: absolute;\n" +  
    "\ttop: " + yPos + "px;\n" +  
    "\tleft: " + xPos + "px;\n" +  
    "\twidth: " + layerWidth + "px;\n" +  
    "\theight: " + layerHeight + "px;\n" +
    "\tbackground-image: url(\"" + layerImage + "\");\n" +
    "}\n" + f;

    return e;
  }

//Export PNGs from layers
function saveImages() {
  var doc = app.activeDocument;
  var imgLocation = doc.path+'/img';
  var imgFolder = new Folder(imgLocation);
  imgFolder.create();
  var expOptions = new ExportOptionsPNG24();

  for(var i=0; i<doc.layers.length; i++) doc.layers[i].visible = false;

  for(var i=0; i<doc.layers.length; i++) {
    var currentLayer = doc.layers[i];
    currentLayer.visible = true;

    var newImage = new File(doc.path + '/img/' + currentLayer.name + '.png');
    doc.exportFile( newImage, ExportType.PNG24, expOptions );
    currentLayer.visible = false;
    }
}

//Revert document
function revertDoc() {
  var docsource = activeDocument.fullName;
  app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  app.open(docsource);
}
