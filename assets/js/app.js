'use strict';

// please get your own access token at https://www.mapbox.com/studio/
mapboxgl.accessToken = 'pk.eyJ1IjoicG1ja2lubmV5IiwiYSI6ImNqa2Eyd2FuajA4cnEzdnFqZ2JmMDlwdGEifQ.RGdpD_AMNZr0Cal6gtP2Vg';
// home coordinates
const homeCoords = [-77.25, 40.154];
// initialize a Mapbox map with the Basic style, centered in Carlisle
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/cjf4m44iw0uza2spb3q0a7s41',
    center: homeCoords,
    zoom: 9.85,
    hash: true
});

// add controls to map
// research these
map.addControl(new MapboxGeocoder({accessToken: mapboxgl.accessToken}), 'bottom-right');
map.addControl(new mapboxgl.NavigationControl(), 'top-left');

// variables for road orientation compass
var h = 300; // size of the chart canvas
var r = h / 2; // radius of the polar histogram
var numBins = 64; // number of orientation bins spread around 360 deg.
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// set properties for canvas
canvas.style.width = canvas.style.height = h + 'px';
canvas.width = canvas.height = h;

// review blog post for what this does
if (window.devicePixelRatio > 1) {
    canvas.width = canvas.height = h * 2;
    ctx.scale(2, 2);
}

/* map magic */
map.on('load', function () {
    updateOrientations(ctx,map);
    
    // add municipality
    map.addLayer({
        id: 'municipality',
        type: 'line',
        source: {
            type: 'geojson',
            data: './assets/data/municipality.geojson'
        },
        paint: {
            'line-color': '#000',
            'line-width': 2
        }
    });
    
    // update the chart on moveend; we could do that on move,
    // but this is slow on some zoom levels due to a huge amount of roads
    map.on('moveend', function() {
        updateOrientations(ctx,map);    
    }); 
});