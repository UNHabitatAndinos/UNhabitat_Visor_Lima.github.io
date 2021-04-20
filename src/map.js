// Create variable to hold map element, give initial settings to map
var map = L.map('map', {
    center: [-12, -77],
    zoom: 11,
});

L.easyButton('<img src="images/fullscreen.png">', function (btn, map) {
    var cucu = [-12, -77];
    map.setView(cucu, 11);
}).addTo(map);

var esriAerialUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services' +
    '/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var esriAerialAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, ' +
    'USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the' +
    ' GIS User Community';
var esriAerial = new L.TileLayer(esriAerialUrl,
    {maxZoom: 18, attribution: esriAerialAttrib}).addTo(map);


var opens = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
});

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = (props ?
        '<b> Personas ' + props.Personas + '</b> <br />' + '<br />' +

        '<h4>Vivienda </h4>' +
        '<b> Densidad poblacional: </b> ' + props.DEN_POB.toFixed(0)  + '<br />' +
        '<b> Vivienda adecuada: </b> ' + props.VIV_ADE.toFixed(0) + ' %' + '<br />' +
        '<b> Viviendas alquiladas: </b> ' + props.VIV_ALQ.toFixed(0) + ' %' + '<br />' +
        '<b> Agua mejorada: </b> ' + props.AGUA.toFixed(0) + ' %' + '<br />' +
        '<b> Saneamiento: </b> ' + props.SAN.toFixed(0) + ' %' + '<br />' +
        '<b> Electricidad: </b> ' + props.ELEC.toFixed(0) + ' %' + '<br />' +
        '<b> Internet: </b> ' + props.INTER.toFixed(0) + ' %'   + '<br />' + '<br />' +


        '<h4>Oportunidades económicas </h4>' +
        '<b> Desempleo: </b> ' + props.T_DESEM.toFixed(0) + ' %' + '<br />' +
        '<b> Empleo: </b> ' + props.EMPLEO.toFixed(0) + ' %' : 'Seleccione una manzana');
};
info.addTo(map);


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'black',
        dashArray: '',
        fillColor: false
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var manzanas;

function resetHighlight(e) {
    manzanas.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function style(feature) {
    return {
        weight: 0.6,
        opacity: 0.5,
        color: '#ffffff00',
        fillOpacity: 0,
    };
}



function changeLegend(props) {
    var _legend = document.getElementById('legend'); // create a div with a class "info"
    _legend.innerHTML = (props ?
        `<p style="font-size: 11px"><strong>${props.title}</strong></p>
            <p style="font-size: 10px">${props.subtitle}</p>
            <p id='colors'>
                ${props.elem1}
                ${props.elem2}
                ${props.elem3}
                ${props.elem4}
                ${props.elem5}
                ${props.elem6}
                ${props.elem7}<br>
                <span style='color:#000000'>Fuente: </span>${props.elem8}<br>
            </p>` :
        `<p style="font-size: 12px"><strong>Área urbana</strong></p>
            <p id='colors'>
                <span style='color:#c3bfc2'>▉</span>Manzanas<br>
            </p>`);
}

var legends = {
    DEN_POB: {
        title: "Densidad residencial",
        subtitle: "Habitantes por km2",
        elem1: '<div><span  style= "color:#809bba">▉</span>0 - 4</div>',
        elem2: '<div><span  style= "color:#4575b5">▉</span>5 - 10</div>', 
        elem3: '<div><span  style= "color:#ffffbf">▉</span>11 - 17</div>',
        elem4: '<div><span  style= "color:#f59869">▉</span>17 - 18</div>',
        elem5: '<div><span  style= "color:#d62f27">▉</span>19 - 26</div>',
        elem6: '',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    VIV_ADE: {
        title: "Vivienda adecuada",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#d62f27">▉</span>0 - 14</div>',
        elem2: '<div><span  style= "color:#f59869">▉</span>15 - 38</div>', 
        elem3: '<div><span  style= "color:#ffffbf">▉</span>39 - 60</div>',
        elem4: '<div><span  style= "color:#4575b5">▉</span>61 - 79</div>',
        elem5: '<div><span  style= "color:#809bba">▉</span>80 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    AGUA: {
        title: "Acceso a agua mejorada",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#d62f27">▉</span>0 - 16</div>',
        elem2: '<div><span  style= "color:#f59869">▉</span>17 - 43</div>', 
        elem3: '<div><span  style= "color:#ffffbf">▉</span>44 - 67</div>',
        elem4: '<div><span  style= "color:#4575b5">▉</span>68 - 84</div>',
        elem5: '<div><span  style= "color:#809bba">▉</span>85 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    SAN: {
        title: "Acceso a saneamiento",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#d62f27">▉</span>0 - 20</div>',
        elem2: '<div><span  style= "color:#f59869">▉</span>21 - 44</div>', 
        elem3: '<div><span  style= "color:#ffffbf">▉</span>45 - 67</div>',
        elem4: '<div><span  style= "color:#4575b5">▉</span>68 - 84</div>',
        elem5: '<div><span  style= "color:#809bba">▉</span>85 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    ELEC: {
        title: "Acceso a electricidad",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#d62f27">▉</span>0 - 24</div>',
        elem2: '<div><span  style= "color:#f59869">▉</span>25 - 51</div>', 
        elem3: '<div><span  style= "color:#ffffbf">▉</span>52 - 71</div>',
        elem4: '<div><span  style= "color:#4575b5">▉</span>72 - 86</div>',
        elem5: '<div><span  style= "color:#809bba">▉</span>87 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    INTER: {
        title: "Acceso a internet",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#809bba">▉</span>0 - 14</div>',
        elem2: '<div><span  style= "color:#4575b5">▉</span>15 - 38</div>', 
        elem3: '<div><span  style= "color:#ffffbf">▉</span>39 - 60</div>',
        elem4: '<div><span  style= "color:#f59869">▉</span>61 - 79</div>',
        elem5: '<div><span  style= "color:#d62f27">▉</span>80 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    VIV_ALQ: {
        title: "Viviendas alquiladas",
        subtitle: "% Viviendas",
        elem1: '<div><span  style= "color:#809bba">▉</span>0 - 8</div>',
        elem2: '<div><span  style= "color:#4575b5">▉</span>9 - 18</div>', 
        elem3: '<div><span  style= "color:#ffffbf">▉</span>19 - 31</div>',
        elem4: '<div><span  style= "color:#f59869">▉</span>32 - 60</div>',
        elem5: '<div><span  style= "color:#d62f27">▉</span>61 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    P_ESCO: {
        title: "Años promedio educación",
        subtitle: "años",
        elem1: '<div><span  style= "color:#809bba">▉</span>15 - 18</div>',
        elem2: '<div><span  style= "color:#4575b5">▉</span>13 - 14</div>', 
        elem3: '<div><span  style= "color:#ffffbf">▉</span>11 - 12</div>',
        elem4: '<div><span  style= "color:#f59869">▉</span>9 - 10</div>',
        elem5: '<div><span  style= "color:#d62f27">▉</span>0 - 8</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    T_DESEM: {
        title: "Tasa de desempleo",
        subtitle: "%",
        elem1: '<div><span  style= "color:#809bba">▉</span>0 - 4</div>',
        elem2: '<div><span  style= "color:#4575b5">▉</span>5 - 7</div>', 
        elem3: '<div><span  style= "color:#ffffbf">▉</span>8 - 16</div>',
        elem4: '<div><span  style= "color:#f59869">▉</span>17 - 50</div>',
        elem5: '<div><span  style= "color:#d62f27">▉</span>51 - 100</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },
    EMPLEO: {
        title: "Empleo",
        subtitle: "%",
        elem1: '<div><span  style= "color:#809bba">▉</span>82 - 100</div>',
        elem2: '<div><span  style= "color:#4575b5">▉</span>67 - 81</div>', 
        elem3: '<div><span  style= "color:#ffffbf">▉</span>59 - 66</div>',
        elem4: '<div><span  style= "color:#f59869">▉</span>38 - 58</div>',
        elem5: '<div><span  style= "color:#d62f27">▉</span>0 - 37</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "INEI, Censo Nacional Población y Vivienda 2017",
    },

}

var indi = L.geoJson(Manzana, {
    style: legends.DEN_POB,
}).addTo(map);

var currentStyle = 'DEN_POB';


manzanas = L.geoJson(Manzana, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


function setProColor(d) {
    if (currentStyle === 'DEN_POB') {
        return d > 26 ? '#d62f27' :
            d > 17 ? '#f59869' :
                d > 10 ? '#ffffbf' :
                    d > 4 ? '#4575b5' :
                        '#809bba';
    }else if (currentStyle === 'VIV_ADE') {
        return d > 79 ? '#809bba' :
            d > 60 ? '#4575b5' :
                d > 38 ? '#ffffbf' :
                    d > 14 ? '#f59869' :
                        '#d62f27';
    } 
    else if (currentStyle === 'AGUA') {
        return d > 84 ? '#809bba' :
            d > 67 ? '#4575b5' :
                d > 43 ? '#ffffbf' :
                    d > 16 ? '#f59869' :
                        '#d62f27';
    } 
    else if (currentStyle === 'SAN') {
        return d > 84 ? '#809bba' :
            d > 67 ? '#4575b5' :
                d > 44 ? '#ffffbf' :
                    d > 20 ? '#f59869' :
                        '#d62f27';
    }
    else if (currentStyle === 'ELEC') {
        return d > 86 ? '#809bba' :
            d > 71 ? '#4575b5' :
                d > 51 ? '#ffffbf' :
                    d > 24 ? '#f59869' :
                        '#d62f27';
    }
    else if (currentStyle === 'INTER') {
        return d > 79 ? '#809bba' :
            d > 60 ? '#4575b5' :
                d > 30 ? '#ffffbf' :
                    d > 14 ? '#f59869' :
                        '#d62f27';
    }
    else if (currentStyle === 'VIV_ALQ') {
        return d > 60 ? '#d62f27' :
            d > 31 ? '#f59869' :
                d > 18 ? '#ffffbf' :
                    d > 8 ? '#4575b5' :
                        '#809bba';
    } 
    else if (currentStyle === 'P_ESCO') {
        return d > 15 ? '#809bba':
            d > 13 ?  '#4575b5':
                d > 10 ? '#ffffbf' :
                    d > 8 ? '#f59869':
                        '#d62f27';
    } 
    else if (currentStyle === 'T_DESEM') {
        return d > 50 ? '#d62f27' :
                        d > 16 ? '#f59869' :
                            d > 7 ? '#ffffbf' :
                                d > 4 ? '#4575b5' :
                                    '#809bba';
    } 
    else if (currentStyle === 'EMPLEO') {
        return d > 81 ? '#809bba':
                        d > 66 ?  '#4575b5':
                            d > 58 ? '#ffffbf' :
                                d > 37 ? '#f59869':
                                    '#d62f27';
    } 
    else {
        return d > 4 ? '#d7191c' :
            d > 3 ? '#fdae61' :
                d > 2 ? '#f4f466' :
                    d > 1 ? '#a6d96a' :
                        '#1a9641';
    }

}

function fillColor(feature) {
    return {
        fillColor: (currentStyle && currentStyle !== 'default' && feature.properties[currentStyle]) ? setProColor(feature.properties[currentStyle]) : '#c3bfc2',
        weight: 0.6,
        opacity: 0.1,
        color: (currentStyle && currentStyle !== 'default') ? '#ffffff00' : '#c3bfc2', 
        fillOpacity: (currentStyle && currentStyle !== 'default') ? 0.9 : 0.2,
    };
}

function changeIndi(style) {
    currentStyle = style.value;
    indi.setStyle(fillColor);
    changeLegend((style.value && legends[style.value]) ? legends[style.value] :
        {
            
        });
}

var baseMaps = {
    'Esri Satellite': esriAerial,
    'Open Street Map': opens

};

// Defines the overlay maps. For now this variable is empty, because we haven't created any overlay layers
var overlayMaps = {
    //'Comunas': comu,
    //'Límite fronterizo con Venezuela': lim
};

// Adds a Leaflet layer control, using basemaps and overlay maps defined above
var layersControl = new L.Control.Layers(baseMaps, overlayMaps, {
    collapsed: true,
});
map.addControl(layersControl);
changeIndi({value: 'DEN_POB'});
