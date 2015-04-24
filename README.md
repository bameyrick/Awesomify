Awesomify
=============

Awesomify is a small (3Kb compressed) JavaScript plugin for Umbraco 7+, that can lazyload images at the correct dimensions of it's placeholder, and with a compression ratio based upon the visitors connection speed (using my [SpeedTest](https://github.com/bameyrick/JS-Speed-Test) plugin).

##Usage

###Install
Firstly you must include [SpeedTest](https://github.com/bameyrick/JS-Speed-Test) and Awesomify in your Master template. I recommend placing the scripts at the bottom of the document.

```html
<script src="/scripts/speed-test.min.js"></script>
<script src="/scripts/awesomify.min.js"></script>
```

###Prepare Images
For awesomify to work, all images (or elements with background images set) must be given a class of *awesomify* (you can set your own to use when initalising Awesomify). Images must also be server using Umbraco's ImageCropper for Awesomify to work (it modifies the URLs).

#####Examples
######Image
```cs
<img class="awesomify" src='@Model.Content.GetCropUrl(propertyAlias:"image", width:3, quality:1)' />
```
#####Element with Background Image
```cs
<div class="awesomify my-class" style="background-image:url(@Model.Content.GetCropUrl(propertyAlias:"image", width:3, quality:1)"></div>
```

###Options
There are a number of options you can configure for Awesomify. To see a list options you can configure, type this into your JavaScript console once Awesomify is installed on your page:

```javascript
Awesomify.Options()
```

######Available Options
| Option Name     | Type       | Description                                   | Default                                      |
|-----------------|------------|-----------------------------------------------|----------------------------------------------|
| cls             | string     | The class which you apply to elements you want to awsomify | awesomify                       |
| lazy            | boolean    | Whether or not awesomify should lazy-load images | true                                      |
| onResize        | boolean    | If the viewport resizes to a larger size, should awesomify download bigger images? | true    |
| sizes           | array      | An array of image sizes awesomify will download. This means only a few sizes need to be cached by the server | [240, 320, 500, 640, 768, 960, 1280, 1366, 2560]|
| squareSizes     | array      | Same as above but applies only to images that are square (width == height) | [40, 80, 120, 160, 320, 640] |


###Initalising Awesomify
Initialising Awesomify begins the process of binding event listeners for the lazy-loading and for the reloading on window resize. The simplest way to initalise Awesomify is like so:
```javascript
Awesomify.Init();
```

#####Initialising with Options
You may want to initialise Awesomify with your own options. You can achieve this like so:

```javascript
Awesomify.Init({
  cls: 'my-custom-class',
  lazy: false,
  reSize: true,
  sizes: [240, 320, 500, 640, 768, 960, 1280, 1366, 2560],
  squareSizes: [40, 80, 120, 160, 320, 640, 1300]
});
```

###Methods
There are a few methods that may be useful to you when using Awesomify. You may want to run Awesomify on a specific element when its added to the page, or you may want to find all new images to be Awesomified (infinate scrolling page).

####Awesomify Me
Awesomify Me runs awesomify on a specific element.
```javascript
Awesomify.Me(document.getElementById('my-id'));
```

####Find New
Find New looks for new elements to be awesomified on the page, and runs awesomify on them with the specified settings.
```javascript
Awesomify.FindNew();
```
