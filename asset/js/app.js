console.clear();


var template = '<svg preserveAspectRatio="xMinYMin" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {{image.width}} {{image.height}}">\n	<defs>\n		<mask id="mask">\n		<image width="{{mask.width}}" height="{{mask.height}}" xlink:href="{{mask.src}}"></image>\n 		</mask>\n	</defs>\n	<image mask="url(#mask)" id="image" width="{{image.width}}" height="{{image.height}}" xlink:href="{{image.src}}"></image>\n</svg>',
    images = {
      "mask": { "loaded": false },
      "image": { "loaded": false }
    };


function svgOutput() {
  // Wait until mask and image are loaded
  if ( images.mask.loaded === true && images.image.loaded === true ) {
    console.table(images);
  
    var output = document.getElementById("output"),
        code = document.getElementById("code"),
        preview = document.getElementById("preview"),
        formatted = template;

    formatted = formatted.replace(/{{image.height}}/g,images.image.data.height);
    formatted = formatted.replace(/{{image.width}}/g,images.image.data.width);
    formatted = formatted.replace(/{{image.src}}/g,images.image.data.src);
    formatted = formatted.replace(/{{mask.width}}/g,images.mask.data.width);
    formatted = formatted.replace(/{{mask.height}}/g,images.mask.data.height);
    formatted = formatted.replace(/{{mask.src}}/g,images.mask.data.src);

    // Give a preview the user can click to download
    preview.innerHTML = "<a href='data:Application/octet-stream,"+ encodeURIComponent(formatted) +"' download='" + images.image.name.replace(/\.[^/.]+$/, "") + ".svg'>" +formatted + "</a>";

    code.innerHTML = formatted.replace(/</g,"&lt;").replace(/>/g,"&gt;");

    output.style.display = "block";
  
    // Reset images
    images = {
      "mask": { "loaded": false },
      "image": { "loaded": false }
    };
  
    return formatted;
  }
}


function imageToObject(image) {
  
  var src = image.result;
  var type = image.type;
  
  image.data = {};
  image.data.src = src.replace("data:;","data:" + type + ";");

  var img = document.createElement('img');
  
  img.src = src;
  img.style.display = "none";
  document.body.appendChild(img);
  
  // Wait for img to load to get accurate width & height
  img.onload = function () {
    image.data.height = this.height;
    image.data.width = this.width;
    image.loaded = true;
    document.body.removeChild(this);
    svgOutput();
  };
  
  return image;
}


// Image to Data URI conversion adapted from http://www.techmcq.com/article/Converting-an-image-into-data-URI-using-JavaScript-FileReader/61
function fileSelected(evt) {
  var files = evt.target.files;

  for (var i = 0; i < files.length; i++) {

    var f = files[i],
        role = "image";
    
    if ( f.type.indexOf("image") == 0 ) {
      console.log("image!");

      if ( f.name.indexOf("-mask") > 0 || f.name.indexOf("-alpha") > 0 ) {
        role = "mask";
      }

      if ( images[role].loaded === false ) {

        images[role] = new FileReader();
        images[role].loaded = "pending";
        images[role].type = f.type;
        images[role].name = f.name;
        
        images[role].onload = function(){
          imageToObject(this);
          svgOutput();
        }
        
        images[role].readAsDataURL(f); //on successful read, fr.onload function will be called and that will populate the result in fileContent container
       
      }
    }
  }
}
   
  //attach change event of file control
document.getElementById('files').addEventListener('change', fileSelected, false);