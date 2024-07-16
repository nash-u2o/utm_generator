//Examples of what GeoJSON contents may look like
//Triangle at Fairbanks, Alaska
var geojson1 = {
    "type": "FeatureCollection",
    "name": "epsg_32606_ex",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::32606" } },
    "features": [
    { "type": "Feature", "properties": { "id": 1 }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 467386.117145008873194, 7191102.486031357198954 ], [ 495320.223902688769158, 7233684.528766036964953 ], [ 523907.899581027915701, 7191020.539153310470283 ], [ 467386.117145008873194, 7191102.486031357198954 ] ] ] ] } }
    ]
}
//Polygon in the Pacific Ocean
var geojson2 = {
    "type": "FeatureCollection",
    "name": "epsg_32706_ex",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::32706" } },
    "features": [
    { "type": "Feature", "properties": { "id": 2 }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 25840.652059678046498, 10171895.091019911691546 ], [ 952351.337710089050233, 10153115.742505744099617 ], [ 1142673.035927546676248, 8604857.437054987996817 ], [ -22319.517284024797846, 8625636.991317333653569 ], [ 25840.652059678046498, 10171895.091019911691546 ] ] ] ] } }
    ]
}
//Polygon over Spain
var geojson3 = {
    "type": "FeatureCollection",
    "name": "spain_box",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::32630" } },
    "features": [
    { "type": "Feature", "properties": { "id": 0 }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ 277777.247179019148462, 4786851.001270630396903 ], [ 695363.347515269764699, 4744717.215545259416103 ], [ 755895.103755642659962, 4283192.233907002024353 ], [ 426053.751062289637048, 4075019.08572816150263 ], [ 280369.766425929963589, 3994297.105475809425116 ], [ 166938.943158353504259, 4122574.435727973468602 ], [ 277777.247179019148462, 4786851.001270630396903 ] ] ] ] } }
    ]
}

var utm_reprojection = (function(){
    var map = new ol.Map({  
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM(),
          }),
        ],
        view: new ol.View({
          center: [0, 0],
          zoom: 2,
        }),
        target: 'map',
    });
  
    //Extract the EPSG numbers
    const re = /\d{4,5}/
    const epsgNum1 = geojson1.crs.properties.name.match(re)[0];
    const epsgNum2 = geojson2.crs.properties.name.match(re)[0];
    const epsgNum3 = geojson3.crs.properties.name.match(re)[0];

    //Register the UTM projections and get the string representing this projection
    //When using ol-hsb-lib, would be called using OL_HSB.utm_generator(epsgNum)
    const epsgProjection1 = utm_generator(epsgNum1);
    const epsgProjection2 = utm_generator(epsgNum2);
    const epsgProjection3 = utm_generator(epsgNum3);

    //Convert the shapes from their respective UTM zones to EPSG:3857
    var source = new ol.source.Vector();
    source.addFeatures(new ol.format.GeoJSON({
        featureProjection: 'EPSG:3857', //Desired projection
        dataProjection: epsgProjection1, //Current projection
        }).readFeatures(geojson1));
    source.addFeatures(new ol.format.GeoJSON({
        featureProjection: 'EPSG:3857',
        dataProjection: epsgProjection2, 
        }).readFeatures(geojson2));
    source.addFeatures(new ol.format.GeoJSON({
        featureProjection: 'EPSG:3857',
        dataProjection: epsgProjection3, 
        }).readFeatures(geojson3));

    var vectorLayer = new ol.layer.Vector({
        source: source
    });
    map.addLayer(vectorLayer);
})();