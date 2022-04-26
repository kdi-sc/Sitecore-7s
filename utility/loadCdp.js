console.log("hello from loadCdp");
// Define the Boxever queue
var _boxeverq = _boxeverq || [];
// Define the Boxever settings
var _boxever_settings = {
  client_key: "demus02u1pkrra9te2thparua6r964fs", // Replace with your client key
  target: "https://api-us.boxever.com/v1.2", // Replace with your API target endpoint specific to your data center region
  cookie_domain: ".carb-overlayteam.sitecoresandbox.cloud", // Replace with the top level cookie domain of the website that is being integrated e.g ".example.com" and not "www.example.com"
  web_flow_target: "https://d35vb5cccm4xzp.cloudfront.net", //this is required for Sitecore Personalize for web experience and experiments
  pointOfSale: "carb-overlayteam" // this is the point of sale you have setup in Sitecore CDP & Personalize
};
// Import the Boxever library asynchronously
(function () {
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.async = true;
  s.src = "https://d1mj578wat5n4o.cloudfront.net/boxever-1.4.8.min.js";
  var x = document.getElementsByTagName("script")[0];
  x.parentNode.insertBefore(s, x);
})();
// Place an anonymous function in the Boxever queue
_boxeverq.push(function () {
  var viewEvent = {
    channel: "WEB",
    type: "VIEW",
    language: "EN",
    currency: "USD",
    page: "homepage",
    pos: "carb-overlayteam",
    browser_id: Boxever.getID(),
  };
  // Invoke event create
  // (<event msg>, <callback function>, <format>)
  Boxever.eventCreate(viewEvent, function (data) {}, "json");

});